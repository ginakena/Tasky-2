import type React from "react"

import { useQuery } from "@tanstack/react-query"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Fab,
  Chip,
  IconButton,
  Stack,
  Container,
  Paper,
  Skeleton,
  Fade,
  Tooltip,
} from "@mui/material"
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  TaskAlt as TaskAltIcon,
} from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import { useState } from "react"
import API from "../api/axios"
import useUser from "../store/userStore"

const GridItem = Grid as React.ElementType

type Task = {
  id: string
  title: string
  description: string
  isDeleted: boolean
  isCompleted: boolean
  lastUpdated: string
  createdAt?: string
}

const fetchTasks = async (): Promise<Task[]> => {
  try {
    const response = await API.get("/tasks", {
      withCredentials: true,
    })
    const tasks = response.data
    console.log("Fetched tasks:", response.data)
    return tasks.filter((task: Task) => !task.isDeleted && !task.isCompleted)
  } catch (error: any) {
    console.error("Error in fetchTasks:", error)
    throw new Error("Failed to fetch tasks")
  }
}

const TasksPage = () => {
  const {  hasHydrated } = useUser()
  const navigate = useNavigate()
  const [completingTasks, setCompletingTasks] = useState<Set<string>>(new Set())
  const [deletingTasks, setDeletingTasks] = useState<Set<string>>(new Set())

  if (!hasHydrated) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box textAlign="center">
          <CircularProgress size={40} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Loading your tasks...
          </Typography>
        </Box>
      </Container>
    )
  }

  const {
    data: tasks = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  })

  const handleComplete = async (id: string) => {
    setCompletingTasks((prev) => new Set(prev).add(id))
    try {
      await API.patch(
        `/tasks/complete/${id}`,
        {},
        {
          withCredentials: true,
        },
      )
      toast.success("Task completed! 🎉")
      refetch()
    } catch (error) {
      console.error("Error completing task:", error)
      toast.error("Failed to complete task")
    } finally {
      setCompletingTasks((prev) => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }
  }

  const handleDelete = async (id: string) => {
    setDeletingTasks((prev) => new Set(prev).add(id))
    try {
      await API.delete(
        `/tasks/${id}`,)
      toast.success("Task moved to trash")
      refetch()
    } catch (error) {
      console.error("Error deleting task:", error)
      toast.error("Failed to delete task")
    } finally {
      setDeletingTasks((prev) => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const LoadingSkeleton = () => (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Skeleton variant="text" width={200} height={48} sx={{ mb: 3 }} />
      <Grid container spacing={3}>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <GridItem xs={12} md={6} lg={4} key={item}>
            <Card sx={{ height: 200 }}>
              <CardContent>
                <Skeleton variant="text" width="80%" height={32} />
                <Skeleton variant="text" width="100%" height={20} sx={{ mt: 1 }} />
                <Skeleton variant="text" width="90%" height={20} />
                <Box sx={{ display: "flex", gap: 1, mt: 3 }}>
                  <Skeleton variant="rectangular" width={80} height={36} />
                  <Skeleton variant="rectangular" width={80} height={36} />
                  <Skeleton variant="rectangular" width={100} height={36} />
                </Box>
              </CardContent>
            </Card>
          </GridItem>
        ))}
      </Grid>
    </Container>
  )

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (isError) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Paper
          sx={{
            p: 6,
            textAlign: "center",
            bgcolor: "error.50",
            border: 1,
            borderColor: "error.200",
          }}
        >
          <Typography variant="h6" color="error.main" gutterBottom>
            Oops! Something went wrong
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            We couldn't fetch your tasks. Please try again.
          </Typography>
          <Button variant="contained" onClick={() => refetch()}>
            Try Again
          </Button>
        </Paper>
      </Container>
    )
  }

  const EmptyState = () => (
    <Fade in timeout={500}>
      <Paper
        sx={{
          p: 8,
          textAlign: "center",
          bgcolor: "primary.50",
          border: 2,
          borderColor: "primary.100",
          borderStyle: "dashed",
        }}
      >
        <TaskAltIcon sx={{ fontSize: 64, color: "primary.300", mb: 2 }} />
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          No tasks yet!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: "auto" }}>
          You're all caught up! Create your first task to get started on your productivity journey.
        </Typography>
        <Button
          variant="contained"
          size="large"
          startIcon={<AddIcon />}
          onClick={() => navigate("create-task")}
          sx={{ px: 4 }}
        >
          Create Your First Task
        </Button>
      </Paper>
    </Fade>
  )

  return (
    <Container maxWidth="lg" sx={{ py: 4, pb: 12 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: "text.primary" }}>
          Your Tasks
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Chip
            label={`${tasks.length} active task${tasks.length !== 1 ? "s" : ""}`}
            color="primary"
            variant="outlined"
            size="small"
          />
          <Typography variant="body2" color="text.secondary">
            Keep up the great work! 💪
          </Typography>
        </Box>
      </Box>

      {tasks.length === 0 ? (
        <EmptyState />
      ) : (
        <Grid container spacing={3}>
          {tasks.map((task: Task, index) => (
            <GridItem xs={12} md={6} lg={4} key={task.id}>
              <Fade in timeout={300 + index * 100}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "all 0.3s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 4,
                    },
                    border: 1,
                    borderColor: "divider",
                  }}
                >
                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    {/* Task Header */}
                    <Box sx={{ mb: 2 }}>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          mb: 1,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {task.title}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                        <ScheduleIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                        <Typography variant="caption" color="text.secondary">
                          Updated {formatDate(task.lastUpdated)}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Task Description */}
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mb: 3,
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                        lineHeight: 1.5,
                      }}
                    >
                      {task.description}
                    </Typography>

                    {/* Action Buttons */}
                    <Stack direction="row" spacing={1} sx={{ mt: "auto" }}>
                      <Tooltip title="Mark as completed">
                        <Button
                          variant="contained"
                          color="success"
                          size="small"
                          startIcon={
                            completingTasks.has(task.id) ? (
                              <CircularProgress size={16} color="inherit" />
                            ) : (
                              <CheckCircleIcon />
                            )
                          }
                          onClick={() => handleComplete(task.id)}
                          disabled={completingTasks.has(task.id)}
                          sx={{ flex: 1 }}
                        >
                          {completingTasks.has(task.id) ? "Completing..." : "Complete"}
                        </Button>
                      </Tooltip>

                      <Tooltip title="Edit task">
                        <IconButton
                          color="primary"
                          onClick={() => navigate(`/tasks/update/${task.id}`)}
                          sx={{
                            border: 1,
                            borderColor: "primary.main",
                            "&:hover": {
                              bgcolor: "primary.50",
                            },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Move to trash">
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(task.id)}
                          disabled={deletingTasks.has(task.id)}
                          sx={{
                            border: 1,
                            borderColor: "error.main",
                            "&:hover": {
                              bgcolor: "error.50",
                            },
                          }}
                        >
                          {deletingTasks.has(task.id) ? (
                            <CircularProgress size={16} color="inherit" />
                          ) : (
                            <DeleteIcon fontSize="small" />
                          )}
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </CardContent>
                </Card>
              </Fade>
            </GridItem>
          ))}
        </Grid>
      )}

      {/* Floating Action Button */}
      <Tooltip title="Create new task">
        <Fab
          color="primary"
          aria-label="add task"
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 1300,
            boxShadow: 4,
            "&:hover": {
              transform: "scale(1.1)",
              boxShadow: 6,
            },
            transition: "all 0.3s ease-in-out",
          }}
          onClick={() => navigate("create-task")}
        >
          <AddIcon />
        </Fab>
      </Tooltip>
    </Container>
  )
}

export default TasksPage
