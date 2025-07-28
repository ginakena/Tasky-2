import type React from "react"

import { useState } from "react"
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Stack,
  Fade,
  CircularProgress,
  IconButton,
  Tooltip,
  Alert,
  Chip,
} from "@mui/material"
import {
  Add as AddIcon,
  ArrowBack as ArrowBackIcon,
  Task as TaskIcon,
  Description as DescriptionIcon,
  Save as SaveIcon,
  Clear as ClearIcon,
} from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import API from "../api/axios"
import { toast } from "react-toastify"
import useUser from "../store/userStore"
import { useMutation, useQueryClient } from "@tanstack/react-query"

interface TaskInput {
  title: string
  description: string
}

const CreateTaskPage = () => {
  const { user, hasHydrated } = useUser()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [titleError, setTitleError] = useState("")
  const [descriptionError, setDescriptionError] = useState("")
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { mutate, isPending } = useMutation({
    mutationKey: ["create-task"],
    mutationFn: async (data: TaskInput) => {
      const response = await API.post(
        "/tasks",
        { title: data.title, description: data.description },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        },
      )
      return response.data
    },
    onSuccess: () => {
      toast.success("Task created successfully! 🎉")
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
      navigate("/tasks")
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || "Task creation failed"
      toast.error(message)
    },
  })

  const validateForm = () => {
    let isValid = true
    setTitleError("")
    setDescriptionError("")

    if (!title.trim()) {
      setTitleError("Title is required")
      isValid = false
    } else if (title.trim().length < 3) {
      setTitleError("Title must be at least 3 characters long")
      isValid = false
    } else if (title.trim().length > 100) {
      setTitleError("Title must be less than 100 characters")
      isValid = false
    }

    if (!description.trim()) {
      setDescriptionError("Description is required")
      isValid = false
    } else if (description.trim().length < 10) {
      setDescriptionError("Description must be at least 10 characters long")
      isValid = false
    } else if (description.trim().length > 500) {
      setDescriptionError("Description must be less than 500 characters")
      isValid = false
    }

    return isValid
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    mutate({ title: title.trim(), description: description.trim() })
  }

  const handleClear = () => {
    setTitle("")
    setDescription("")
    setTitleError("")
    setDescriptionError("")
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setTitle(value)
    if (titleError) {
      setTitleError("")
    }
  }

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value
    setDescription(value)
    if (descriptionError) {
      setDescriptionError("")
    }
  }

  if (!hasHydrated) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Box textAlign="center">
          <CircularProgress size={40} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Loading...
          </Typography>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
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
                  <ArrowBackIcon color="primary" />
                </IconButton>
              </Tooltip>
              <AddIcon sx={{ fontSize: 32, color: "primary.main" }} />
              <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary" }}>
                Create New Task
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary" sx={{ ml: 7 }}>
              Add a new task to your productivity journey. Be specific about what you want to accomplish! 🚀
            </Typography>
          </Box>

          {/* Main Form */}
          <Paper
            elevation={0}
            sx={{
              p: 4,
              border: 1,
              borderColor: "divider",
              borderRadius: 2,
              bgcolor: "background.paper",
            }}
          >
            <form onSubmit={handleSubmit}>
              <Stack spacing={3}>
                {/* Title Field */}
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <TaskIcon sx={{ fontSize: 20, color: "primary.main" }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Task Title
                    </Typography>
                    <Chip
                      label={`${title.length}/100`}
                      size="small"
                      color={title.length > 100 ? "error" : title.length > 80 ? "warning" : "default"}
                      sx={{ ml: "auto" }}
                    />
                  </Box>
                  <TextField
                    fullWidth
                    placeholder="Enter a clear, specific title for your task..."
                    value={title}
                    onChange={handleTitleChange}
                    error={!!titleError}
                    helperText={titleError || "Give your task a clear, descriptive title"}
                    disabled={isPending}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        fontSize: "1.1rem",
                        "&.Mui-focused": {
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "primary.main",
                            borderWidth: 2,
                          },
                        },
                      },
                    }}
                  />
                </Box>

                {/* Description Field */}
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <DescriptionIcon sx={{ fontSize: 20, color: "primary.main" }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Task Description
                    </Typography>
                    <Chip
                      label={`${description.length}/500`}
                      size="small"
                      color={description.length > 500 ? "error" : description.length > 400 ? "warning" : "default"}
                      sx={{ ml: "auto" }}
                    />
                  </Box>
                  <TextField
                    fullWidth
                    multiline
                    rows={6}
                    placeholder="Describe what needs to be done, any important details, steps, or requirements..."
                    value={description}
                    onChange={handleDescriptionChange}
                    error={!!descriptionError}
                    helperText={descriptionError || "Provide detailed information about what needs to be accomplished"}
                    disabled={isPending}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "&.Mui-focused": {
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: "primary.main",
                            borderWidth: 2,
                          },
                        },
                      },
                    }}
                  />
                </Box>

                {/* Form Tips */}
                <Alert severity="info" sx={{ bgcolor: "info.50", border: 1, borderColor: "info.200" }}>
                  <Typography variant="body2">
                    <strong>💡 Pro tip:</strong> Be specific about your goals, deadlines, and success criteria. This
                    helps you stay focused and motivated!
                  </Typography>
                </Alert>

                {/* Action Buttons */}
                <Stack direction="row" spacing={2} sx={{ pt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={isPending || !title.trim() || !description.trim()}
                    startIcon={isPending ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    sx={{
                      flex: 1,
                      py: 1.5,
                      fontSize: "1rem",
                      fontWeight: 600,
                      "&:disabled": {
                        bgcolor: "grey.300",
                      },
                    }}
                  >
                    {isPending ? "Creating Task..." : "Create Task"}
                  </Button>

                  <Tooltip title="Clear form">
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={handleClear}
                      disabled={isPending || (!title && !description)}
                      startIcon={<ClearIcon />}
                      sx={{
                        px: 3,
                        py: 1.5,
                        borderColor: "grey.300",
                        color: "text.secondary",
                        "&:hover": {
                          borderColor: "grey.400",
                          bgcolor: "grey.50",
                        },
                      }}
                    >
                      Clear
                    </Button>
                  </Tooltip>
                </Stack>

                {/* Form Progress */}
                <Box sx={{ textAlign: "center", pt: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    {title.trim() && description.trim()
                      ? "✅ Ready to create your task!"
                      : "📝 Fill in both fields to create your task"}
                  </Typography>
                </Box>
              </Stack>
            </form>
          </Paper>

          {/* Quick Tips */}
          <Paper
            sx={{
              mt: 4,
              p: 3,
              bgcolor: "primary.50",
              border: 1,
              borderColor: "primary.200",
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: "primary.main" }}>
              ✨ Task Creation Tips
            </Typography>
            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">
                • <strong>Be specific:</strong> Instead of "Work on project", try "Complete user authentication feature"
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • <strong>Include context:</strong> Add relevant details, links, or requirements
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • <strong>Set clear outcomes:</strong> Define what "done" looks like for this task
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • <strong>Keep it actionable:</strong> Use action verbs like "Create", "Review", "Send", "Complete"
              </Typography>
            </Stack>
          </Paper>
        </Box>
      </Fade>
    </Container>
  )
}

export default CreateTaskPage
