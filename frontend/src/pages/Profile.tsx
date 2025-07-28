import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Avatar,
  IconButton,
  Alert,
  Snackbar,
  Paper,
  Fade,
  Stack,
  Chip,
  Tooltip,
  CircularProgress,
} from "@mui/material"
import {
  PhotoCamera,
  Person,
  Lock,
  Edit,
  ArrowBack,
  Security,
  AccountCircle,
  Email,
  Badge,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import useUser from "../store/userStore"
import API from "../api/axios"

// Updated API functions with real endpoints
const updateUserProfile = async (profileData: any, token: string) => {
  const response = await API.patch(
    "/user",
    {
      firstName: profileData.firstName,
      lastName: profileData.lastName,
      userName: profileData.userName,
      email: profileData.email,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
  return response.data
}

const updateUserPassword = async (passwordData: any, token: string) => {
  const response = await API.patch(
    "/auth/password",
    {
      oldPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )
  return response.data
}

const uploadProfilePicture = async (file: File, token: string) => {
  const formData = new FormData()
  formData.append("avatar", file)

  const response = await API.patch("/user/avatar", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  })
  return response.data
}

const ProfilePage: React.FC = () => {
  const { user, setUser, hasHydrated } = useUser()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    userName: user?.userName || "",
    email: user?.email || "",
  })

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // UI state
  const [profileLoading, setProfileLoading] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [avatarLoading, setAvatarLoading] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" as "success" | "error" })
  const [passwordError, setPasswordError] = useState("")
  const [profileErrors, setProfileErrors] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  // Update form when user data changes
  useEffect(() => {
    if (user) {
      setProfileForm({
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        email: user.email,
      })
    }
  }, [user])

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const validateProfileForm = () => {
    const errors = {
      firstName: "",
      lastName: "",
      userName: "",
      email: "",
    }

    if (!profileForm.firstName.trim()) {
      errors.firstName = "First name is required"
    } else if (profileForm.firstName.trim().length < 2) {
      errors.firstName = "First name must be at least 2 characters"
    }

    if (!profileForm.lastName.trim()) {
      errors.lastName = "Last name is required"
    } else if (profileForm.lastName.trim().length < 2) {
      errors.lastName = "Last name must be at least 2 characters"
    }

    if (!profileForm.userName.trim()) {
      errors.userName = "Username is required"
    } else if (profileForm.userName.trim().length < 3) {
      errors.userName = "Username must be at least 3 characters"
    } else if (!/^[a-zA-Z0-9_]+$/.test(profileForm.userName)) {
      errors.userName = "Username can only contain letters, numbers, and underscores"
    }

    if (!profileForm.email.trim()) {
      errors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)) {
      errors.email = "Please enter a valid email address"
    }

    setProfileErrors(errors)
    return !Object.values(errors).some((error) => error !== "")
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateProfileForm()) {
      return
    }

    if (!user?.token) {
      setSnackbar({ open: true, message: "Authentication required", severity: "error" })
      return
    }

    setProfileLoading(true)
    setProfileErrors({ firstName: "", lastName: "", userName: "", email: "" })

    try {
      const response = await updateUserProfile(profileForm, user.token)

      if (user) {
        const updatedUser = {
          ...user,
          firstName: profileForm.firstName,
          lastName: profileForm.lastName,
          userName: profileForm.userName,
          email: profileForm.email,
          lastUpdated: new Date().toISOString(),
        }

        setUser(updatedUser)
        setSnackbar({ open: true, message: "Profile updated successfully! 🎉", severity: "success" })
      }
    } catch (error: any) {
      console.error("Profile update error:", error)
      const message = error?.response?.data?.message || "Failed to update profile"
      setSnackbar({ open: true, message, severity: "error" })

      // Handle specific field errors
      if (error?.response?.data?.errors) {
        setProfileErrors(error.response.data.errors)
      }
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPasswordError("")

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match")
      return
    }

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long")
      return
    }

    if (!user?.token) {
      setSnackbar({ open: true, message: "Authentication required", severity: "error" })
      return
    }

    setPasswordLoading(true)

    try {
      await updateUserPassword(
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        },
        user.token,
      )

      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })

      setSnackbar({ open: true, message: "Password updated successfully! 🔒", severity: "success" })
    } catch (error: any) {
      console.error("Password update error:", error)
      const message = error?.response?.data?.message || "Failed to update password"
      setPasswordError(message)
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setSnackbar({ open: true, message: "Please select an image file", severity: "error" })
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setSnackbar({ open: true, message: "Image size must be less than 5MB", severity: "error" })
      return
    }

    if (!user?.token) {
      setSnackbar({ open: true, message: "Authentication required", severity: "error" })
      return
    }

    setAvatarLoading(true)

    try {
      const response = await uploadProfilePicture(file, user.token)

      if (user) {
        const updatedUser = {
          ...user,
          avatar: response.avatar || response.imageUrl,
          lastUpdated: new Date().toISOString(),
        }

        setUser(updatedUser)
        setSnackbar({ open: true, message: "Profile picture updated! 📸", severity: "success" })
      }
    } catch (error: any) {
      console.error("Avatar upload error:", error)
      const message = error?.response?.data?.message || "Failed to upload image"
      setSnackbar({ open: true, message, severity: "error" })
    } finally {
      setAvatarLoading(false)
    }
  }

  if (!hasHydrated) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box textAlign="center">
          <CircularProgress size={40} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Loading profile...
          </Typography>
        </Box>
      </Container>
    )
  }

  if (!user?.token) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper sx={{ p: 6, textAlign: "center" }}>
          <Typography variant="h6" gutterBottom>
            Please log in to access your profile
          </Typography>
          <Button variant="contained" onClick={() => navigate("/login")} sx={{ mt: 2 }}>
            Go to Login
          </Button>
        </Paper>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Fade in timeout={500}>
        <Box>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Tooltip title="Go back">
                <IconButton
                  onClick={() => navigate("/tasks")}
                  sx={{
                    bgcolor: "primary.50",
                    "&:hover": { bgcolor: "primary.100" },
                  }}
                >
                  <ArrowBack color="primary" />
                </IconButton>
              </Tooltip>
              <Person sx={{ fontSize: 32, color: "primary.main" }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary" }}>
                Profile Settings
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary" sx={{ ml: 7 }}>
              Manage your account information and security settings
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {/* Profile Picture Section */}
            <Grid size={{xs:12, md:4}}>
              <Card
                sx={{
                  height: "fit-content",
                  border: 1,
                  borderColor: "divider",
                }}
              >
                <CardContent sx={{ textAlign: "center", py: 4 }}>
                  <Box sx={{ position: "relative", display: "inline-block", mb: 3 }}>
                    <Avatar
                      src={user.avatar}
                      sx={{
                        width: 120,
                        height: 120,
                        bgcolor: "primary.main",
                        fontSize: "2rem",
                        mx: "auto",
                        border: 4,
                        borderColor: "primary.light",
                        boxShadow: 3,
                      }}
                    >
                      {!user.avatar && getInitials(user.firstName, user.lastName)}
                    </Avatar>

                    <Tooltip title="Change profile picture">
                      <IconButton
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          right: 0,
                          bgcolor: "primary.main",
                          color: "white",
                          "&:hover": { bgcolor: "primary.dark" },
                          width: 40,
                          height: 40,
                          boxShadow: 2,
                        }}
                        onClick={() => fileInputRef.current?.click()}
                        disabled={avatarLoading}
                      >
                        {avatarLoading ? (
                          <CircularProgress size={20} color="inherit" />
                        ) : (
                          <PhotoCamera fontSize="small" />
                        )}
                      </IconButton>
                    </Tooltip>
                  </Box>

                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    {user.firstName} {user.lastName}
                  </Typography>
                  <Chip
                    label={`@${user.userName}`}
                    size="small"
                    sx={{
                      bgcolor: "primary.50",
                      color: "primary.main",
                      fontWeight: 500,
                      mb: 2,
                    }}
                  />

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleAvatarUpload}
                    accept="image/*"
                    style={{ display: "none" }}
                  />

                  <Button
                    variant="outlined"
                    startIcon={<PhotoCamera />}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={avatarLoading}
                    fullWidth
                    sx={{ mt: 2 }}
                  >
                    {avatarLoading ? "Uploading..." : "Change Photo"}
                  </Button>

                  <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: "block" }}>
                    JPG, PNG or GIF (max. 5MB)
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* Profile Information */}
            <Grid size={{xs:12, md:8}}>
              <Stack spacing={3}>
                {/* Personal Information Card */}
                <Card sx={{ border: 1, borderColor: "divider" }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <AccountCircle sx={{ mr: 2, color: "primary.main", fontSize: 28 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Personal Information
                      </Typography>
                    </Box>

                    <form onSubmit={handleProfileSubmit}>
                      <Grid container spacing={3}>
                        <Grid size={{xs:12, sm:6}}>
                          <TextField
                            fullWidth
                            label="First Name"
                            value={profileForm.firstName}
                            onChange={(e) => {
                              setProfileForm({ ...profileForm, firstName: e.target.value })
                              if (profileErrors.firstName) {
                                setProfileErrors({ ...profileErrors, firstName: "" })
                              }
                            }}
                            error={!!profileErrors.firstName}
                            helperText={profileErrors.firstName}
                            disabled={profileLoading}
                            InputProps={{
                              startAdornment: <Badge sx={{ mr: 1, color: "text.secondary" }} />,
                            }}
                          />
                        </Grid>
                        <Grid size={{xs:12, sm:6}}>
                          <TextField
                            fullWidth
                            label="Last Name"
                            value={profileForm.lastName}
                            onChange={(e) => {
                              setProfileForm({ ...profileForm, lastName: e.target.value })
                              if (profileErrors.lastName) {
                                setProfileErrors({ ...profileErrors, lastName: "" })
                              }
                            }}
                            error={!!profileErrors.lastName}
                            helperText={profileErrors.lastName}
                            disabled={profileLoading}
                            InputProps={{
                              startAdornment: <Badge sx={{ mr: 1, color: "text.secondary" }} />,
                            }}
                          />
                        </Grid>
                        <Grid size={{xs:12, sm:6}}>
                          <TextField
                            fullWidth
                            label="Username"
                            value={profileForm.userName}
                            onChange={(e) => {
                              setProfileForm({ ...profileForm, userName: e.target.value })
                              if (profileErrors.userName) {
                                setProfileErrors({ ...profileErrors, userName: "" })
                              }
                            }}
                            error={!!profileErrors.userName}
                            helperText={profileErrors.userName || "Only letters, numbers, and underscores allowed"}
                            disabled={profileLoading}
                            InputProps={{
                              startAdornment: <Person sx={{ mr: 1, color: "text.secondary" }} />,
                            }}
                          />
                        </Grid>
                        <Grid size={{xs:12, sm:6}}>
                          <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={profileForm.email}
                            onChange={(e) => {
                              setProfileForm({ ...profileForm, email: e.target.value })
                              if (profileErrors.email) {
                                setProfileErrors({ ...profileErrors, email: "" })
                              }
                            }}
                            error={!!profileErrors.email}
                            helperText={profileErrors.email}
                            disabled={profileLoading}
                            InputProps={{
                              startAdornment: <Email sx={{ mr: 1, color: "text.secondary" }} />,
                            }}
                          />
                        </Grid>
                      </Grid>

                      <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
                        <Button
                          type="submit"
                          variant="contained"
                          size="large"
                          startIcon={profileLoading ? <CircularProgress size={20} color="inherit" /> : <Edit />}
                          disabled={profileLoading}
                          sx={{ px: 4 }}
                        >
                          {profileLoading ? "Updating..." : "Update Profile"}
                        </Button>
                      </Box>
                    </form>
                  </CardContent>
                </Card>

                {/* Password Change Card */}
                <Card sx={{ border: 1, borderColor: "divider" }}>
                  <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <Security sx={{ mr: 2, color: "primary.main", fontSize: 28 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Change Password
                      </Typography>
                    </Box>

                    {passwordError && (
                      <Alert severity="error" sx={{ mb: 3 }}>
                        {passwordError}
                      </Alert>
                    )}

                    <form onSubmit={handlePasswordSubmit}>
                      <Grid container spacing={3}>
                        <Grid size={{xs:12}}>
                          <TextField
                            fullWidth
                            label="Current Password"
                            type={showPasswords.current ? "text" : "password"}
                            value={passwordForm.currentPassword}
                            onChange={(e) => {
                              setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                              if (passwordError) setPasswordError("")
                            }}
                            disabled={passwordLoading}
                            InputProps={{
                              startAdornment: <Lock sx={{ mr: 1, color: "text.secondary" }} />,
                              endAdornment: (
                                <IconButton
                                  onClick={() =>
                                    setShowPasswords({ ...showPasswords, current: !showPasswords.current })
                                  }
                                  edge="end"
                                >
                                  {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid size={{xs:12, sm:6}}>
                          <TextField
                            fullWidth
                            label="New Password"
                            type={showPasswords.new ? "text" : "password"}
                            value={passwordForm.newPassword}
                            onChange={(e) => {
                              setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                              if (passwordError) setPasswordError("")
                            }}
                            disabled={passwordLoading}
                            helperText="Minimum 6 characters"
                            InputProps={{
                              startAdornment: <Lock sx={{ mr: 1, color: "text.secondary" }} />,
                              endAdornment: (
                                <IconButton
                                  onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                                  edge="end"
                                >
                                  {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid size={{xs:12, sm:6}}>
                          <TextField
                            fullWidth
                            label="Confirm New Password"
                            type={showPasswords.confirm ? "text" : "password"}
                            value={passwordForm.confirmPassword}
                            onChange={(e) => {
                              setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                              if (passwordError) setPasswordError("")
                            }}
                            disabled={passwordLoading}
                            InputProps={{
                              startAdornment: <Lock sx={{ mr: 1, color: "text.secondary" }} />,
                              endAdornment: (
                                <IconButton
                                  onClick={() =>
                                    setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })
                                  }
                                  edge="end"
                                >
                                  {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              ),
                            }}
                          />
                        </Grid>
                      </Grid>

                      <Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
                        <Button
                          type="submit"
                          variant="contained"
                          size="large"
                          startIcon={passwordLoading ? <CircularProgress size={20} color="inherit" /> : <Lock />}
                          disabled={passwordLoading}
                          sx={{ px: 4 }}
                        >
                          {passwordLoading ? "Updating..." : "Update Password"}
                        </Button>
                      </Box>
                    </form>
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </Box>
      </Fade>

      {/* Snackbar for notifications */}
      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  )
}

export default ProfilePage