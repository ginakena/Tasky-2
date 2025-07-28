"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  CircularProgress,
} from "@mui/material"
import { Menu as MenuIcon, Task, Add, CheckCircle, Delete, Person, Logout, Login, PersonAdd } from "@mui/icons-material"
import { useNavigate, useLocation } from "react-router-dom"
import useUser from "../store/userStore"
import API from "../api/axios"

const Header = () => {
  const { user, logOut, hasHydrated } = useUser()
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  // Debug logging to help identify the issue
  useEffect(() => {
    console.log("Header render - hasHydrated:", hasHydrated, "user:", user)
  }, [hasHydrated, user])

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleProfileMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      await API.post("/auth/logout", {}, { withCredentials: true })
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      logOut()
      handleProfileMenuClose()
      setIsLoggingOut(false)
      navigate("/login")
    }
  }

  const handleNavigation = (path: string) => {
    navigate(path)
    setMobileDrawerOpen(false)
  }

  const handleLoginClick = () => {
    navigate("/login")
  }

  const handleSignUpClick = () => {
    navigate("/register")
  }

  // Navigation items for logged-in users
  const navigationItems = [
    { label: "Tasks", path: "/tasks", icon: <Task /> },
    { label: "New Task", path: "/tasks/create-task", icon: <Add /> },
    { label: "Completed", path: "/tasks/completed", icon: <CheckCircle /> },
    { label: "Trash", path: "/tasks/trash", icon: <Delete /> },
    { label: "Profile", path: "/profile", icon: <Person /> },
  ]

  const getCurrentTabValue = () => {
    const currentPath = location.pathname
    const matchingItem = navigationItems.find((item) => item.path === currentPath)
    return matchingItem ? navigationItems.indexOf(matchingItem) : false
  }

  // Show loading spinner while hydrating
  if (!hasHydrated) {
    return (
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: "white", fontWeight: 600 }}>
            Tasky
          </Typography>
          <CircularProgress size={24} sx={{ color: "white" }} />
        </Toolbar>
      </AppBar>
    )
  }

  // Check if user is logged in (has both user object and token)
  const isLoggedIn = user && user.token

  // Logged out header
  if (!isLoggedIn) {
    return (
      <AppBar position="static" elevation={0} sx={{ bgcolor: "primary.main" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: "white", fontWeight: 600 }}>
            Tasky
          </Typography>

          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              startIcon={<Login />}
              onClick={handleLoginClick}
              sx={{
                textTransform: "none",
                color: "white",
                borderColor: "white",
                "&:hover": {
                  borderColor: "rgba(255, 255, 255, 0.7)",
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              Login
            </Button>
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={handleSignUpClick}
              sx={{
                textTransform: "none",
                bgcolor: "white",
                color: "primary.main",
                "&:hover": {
                  bgcolor: "rgba(255, 255, 255, 0.9)",
                },
              }}
            >
              Sign Up
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    )
  }

  // Mobile drawer for logged-in users
  const mobileDrawer = (
    <Drawer
      anchor="left"
      open={mobileDrawerOpen}
      onClose={() => setMobileDrawerOpen(false)}
      sx={{
        "& .MuiDrawer-paper": {
          width: 280,
          boxSizing: "border-box",
        },
      }}
    >
      <Box sx={{ p: 2, borderBottom: 1, borderColor: "divider" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            src={user.avatar}
            sx={{
              width: 40,
              height: 40,
              bgcolor: "primary.main",
              border: 2,
              borderColor: "primary.light",
            }}
          >
            {!user.avatar && getInitials(user.firstName, user.lastName)}
          </Avatar>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
              Welcome back, {user.firstName}!
            </Typography>
            <Typography variant="caption" color="text.secondary">
              @{user.userName}
            </Typography>
          </Box>
        </Box>
      </Box>

      <List>
        {navigationItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              selected={location.pathname === item.path}
              sx={{
                "&.Mui-selected": {
                  bgcolor: "primary.50",
                  borderRight: 3,
                  borderColor: "primary.main",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: location.pathname === item.path ? "primary.main" : "inherit",
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                sx={{
                  "& .MuiListItemText-primary": {
                    fontWeight: location.pathname === item.path ? 600 : 400,
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ mt: "auto", p: 2, borderTop: 1, borderColor: "divider" }}>
        <Button
          fullWidth
          variant="outlined"
          startIcon={isLoggingOut ? <CircularProgress size={16} /> : <Logout />}
          onClick={handleLogout}
          color="error"
          disabled={isLoggingOut}
        >
          {isLoggingOut ? "Logging out..." : "Logout"}
        </Button>
      </Box>
    </Drawer>
  )

  // Logged in header
  return (
    <>
      <AppBar
        position="static"
        elevation={0}
        sx={{ bgcolor: "background.paper", borderBottom: 1, borderColor: "divider" }}
      >
        <Toolbar>
          {/* Mobile menu button */}
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => setMobileDrawerOpen(true)}
              sx={{ mr: 2, color: "text.primary" }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo */}
          <Typography
            variant="h6"
            component="div"
            sx={{
              color: "primary.main",
              fontWeight: 700,
              mr: 4,
              cursor: "pointer",
            }}
            onClick={() => navigate("/tasks")}
          >
            Tasky
          </Typography>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ flexGrow: 1 }}>
              <Tabs
                value={getCurrentTabValue()}
                onChange={(_, newValue) => {
                  if (newValue !== false) {
                    navigate(navigationItems[newValue].path)
                  }
                }}
                sx={{
                  "& .MuiTabs-indicator": {
                    backgroundColor: "primary.main",
                    height: 3,
                  },
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontWeight: 500,
                    fontSize: "0.875rem",
                  },
                }}
              >
                {navigationItems.map((item) => (
                  <Tab
                    key={item.path}
                    label={item.label}
                    icon={item.icon}
                    iconPosition="start"
                    sx={{
                      minHeight: 64,
                      "&.Mui-selected": {
                        color: "primary.main",
                        fontWeight: 600,
                      },
                    }}
                  />
                ))}
              </Tabs>
            </Box>
          )}

          {/* Welcome message and avatar */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, ml: "auto" }}>
            {!isMobile && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Welcome back,
                </Typography>
                <Chip
                  label={user.firstName}
                  size="small"
                  sx={{
                    bgcolor: "primary.50",
                    color: "primary.main",
                    fontWeight: 600,
                    border: 1,
                    borderColor: "primary.200",
                  }}
                />
              </Box>
            )}

            <IconButton
              onClick={handleProfileMenuOpen}
              sx={{
                p: 0,
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              <Avatar
                src={user.avatar}
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: "primary.main",
                  border: 2,
                  borderColor: "primary.light",
                  boxShadow: 2,
                }}
              >
                {!user.avatar && getInitials(user.firstName, user.lastName)}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
        PaperProps={{
          elevation: 8,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 4px 12px rgba(0,0,0,0.15))",
            mt: 1.5,
            minWidth: 220,
            borderRadius: 2,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Box sx={{ px: 3, py: 2, borderBottom: 1, borderColor: "divider" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {user.firstName} {user.lastName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            @{user.userName}
          </Typography>
        </Box>

        <MenuItem
          onClick={() => navigate("/profile")}
          sx={{
            py: 1.5,
            px: 3,
            "&:hover": {
              bgcolor: "primary.50",
            },
          }}
        >
          <Person fontSize="small" sx={{ mr: 2, color: "primary.main" }} />
          Profile Settings
        </MenuItem>

        <MenuItem
          onClick={handleLogout}
          disabled={isLoggingOut}
          sx={{
            py: 1.5,
            px: 3,
            color: "error.main",
            "&:hover": {
              bgcolor: "error.50",
            },
          }}
        >
          {isLoggingOut ? <CircularProgress size={16} sx={{ mr: 2 }} /> : <Logout fontSize="small" sx={{ mr: 2 }} />}
          {isLoggingOut ? "Logging out..." : "Logout"}
        </MenuItem>
      </Menu>

      {/* Mobile Drawer */}
      {mobileDrawer}
    </>
  )
}

export default Header
