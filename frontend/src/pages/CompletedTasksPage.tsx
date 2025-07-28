import type React from "react"

import { useEffect, useState } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Container,
  Paper,
  Skeleton,
  Fade,
  Chip,
  Stack,
  Tooltip,
} from "@mui/material"
import {
  Undo as UndoIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  TaskAlt as TaskAltIcon,
  Celebration as CelebrationIcon,
} from "@mui/icons-material"
import API from "../api/axios"
import { toast } from "react-toastify"
import useUser from "../store/userStore"

const GridItem = Grid as React.ElementType

type CompletedTask = {
  id: string
  title: string
  description: string
  isCompleted: boolean
  isDeleted: boolean
  lastUpdated: string
  completedAt?: string
  createdAt?: string
}

const CompletedTasksPage = () => {
  const { user, hasHydrated } = useUser()
  const [tasks, setTasks] = useState<CompletedTask[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [restoringTasks, setRestoringTasks] = useState<Set<string>>(new Set())

  const fetchCompletedTasks = async () => {
    if (!user?.token) return

    try {
      setError(null)
      const res = await API.get("/tasks", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      console.log("Fetched tasks:", res.data)
      const completedTasks = res.data.filter((task: CompletedTask) => task.isCompleted === true)
      setTasks(completedTasks)
    } catch (error) {
      console.error("Error fetching completed tasks:", error)
      setError("Failed to fetch completed tasks")
      toast.error("Failed to fetch completed tasks")
    } finally {
      setLoading(false)
    }
  }

  const handleSetIncomplete = async (id: string) => {
    setRestoringTasks((prev) => new Set(prev).add(id))
    try {
      await API.patch(
        `/tasks/incomplete/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        },
      )
      // Fix the filter logic - need to return the boolean
      setTasks((prev) => prev.filter((task) => task.id !== id))
      toast.success("Task marked as incomplete! 📝")
    } catch (error) {
      console.error("Error restoring task:", error)
      toast.error("Failed to restore task")
    } finally {
      setRestoringTasks((prev) => {
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

  // const formatDateTime = (dateString: string) => {
  //   const date = new Date(dateString)
  //   return date.toLocaleDateString("en-US", {
  //     month: "short",
  //     day: "numeric",
  //     year: "numeric",
  //     hour: "2-digit",
  //     minute: "2-digit",
  //   })
  // }

  useEffect(() => {
    if (hasHydrated) {
      fetchCompletedTasks()
    }
  }, [hasHydrated, user?.token])

  const LoadingSkeleton = () => (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Skeleton variant="text" width={250} height={48} sx={{ mb: 3 }} />
      <Grid container spacing={3}>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <GridItem xs={12} md={6} lg={4} key={item}>
            <Card sx={{ height: 220 }}>
              <CardContent>
                <Skeleton variant="text" width="80%" height={32} />
                <Skeleton variant="text" width="100%" height={20} sx={{ mt: 1 }} />
                <Skeleton variant="text" width="90%" height={20} />
                <Skeleton variant="text" width="60%" height={16} sx={{ mt: 2 }} />
                <Skeleton variant="rectangular" width={120} height={36} sx={{ mt: 3 }} />
              </CardContent>
            </Card>
          </GridItem>
        ))}
      </Grid>
    </Container>
  )

  if (!hasHydrated || loading) {
    return <LoadingSkeleton />
  }

  if (error) {
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
            {error}. Please try again.
          </Typography>
          <Button variant="contained" onClick={fetchCompletedTasks}>
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
          bgcolor: "success.50",
          border: 2,
          borderColor: "success.100",
          borderStyle: "dashed",
        }}
      >
        <CelebrationIcon sx={{ fontSize: 64, color: "success.300", mb: 2 }} />
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          No completed tasks yet!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: "auto" }}>
          Complete some tasks to see them here. Every completed task is a step towards your goals! 🎯
        </Typography>
        <Button variant="contained" color="success" onClick={() => window.history.back()}>
          Go Back to Tasks
        </Button>
      </Paper>
    </Fade>
  )

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <CheckCircleIcon sx={{ fontSize: 32, color: "success.main" }} />
          <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary" }}>
            Completed Tasks
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Chip
            label={`${tasks.length} completed task${tasks.length !== 1 ? "s" : ""}`}
            color="success"
            variant="outlined"
            size="small"
          />
          <Typography variant="body2" color="text.secondary">
            Great job on your accomplishments! 🎉
          </Typography>
        </Box>
      </Box>

      {tasks.length === 0 ? (
        <EmptyState />
      ) : (
        <Grid container spacing={3}>
          {tasks.map((task, index) => (
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
                    borderColor: "success.200",
                    bgcolor: "success.50",
                    position: "relative",
                    overflow: "visible",
                  }}
                >
                  {/* Completion Badge */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: -8,
                      right: -8,
                      bgcolor: "success.main",
                      borderRadius: "50%",
                      p: 1,
                      boxShadow: 2,
                      zIndex: 1,
                    }}
                  >
                    <CheckCircleIcon sx={{ fontSize: 20, color: "white" }} />
                  </Box>

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
                          textDecoration: "line-through",
                          textDecorationColor: "success.main",
                          color: "text.primary",
                        }}
                      >
                        {task.title}
                      </Typography>

                      {/* Completion Info */}
                      <Stack direction="column" spacing={0.5}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <CheckCircleIcon sx={{ fontSize: 14, color: "success.main" }} />
                          <Typography variant="caption" color="success.main" sx={{ fontWeight: 600 }}>
                            Completed {formatDate(task.lastUpdated)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <ScheduleIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                          <Typography variant="caption" color="text.secondary">
                            Last updated {formatDate(task.lastUpdated)}
                          </Typography>
                        </Box>
                      </Stack>
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
                        opacity: 0.8,
                      }}
                    >
                      {task.description}
                    </Typography>

                    {/* Action Button */}
                    <Box sx={{ mt: "auto" }}>
                      <Tooltip title="Mark as incomplete">
                        <Button
                          variant="outlined"
                          color="primary"
                          size="small"
                          startIcon={
                            restoringTasks.has(task.id) ? <CircularProgress size={16} color="inherit" /> : <UndoIcon />
                          }
                          onClick={() => handleSetIncomplete(task.id)}
                          disabled={restoringTasks.has(task.id)}
                          fullWidth
                          sx={{
                            borderColor: "primary.main",
                            "&:hover": {
                              bgcolor: "primary.50",
                              borderColor: "primary.dark",
                            },
                          }}
                        >
                          {restoringTasks.has(task.id) ? "Restoring..." : "Mark as Incomplete"}
                        </Button>
                      </Tooltip>
                    </Box>
                  </CardContent>
                </Card>
              </Fade>
            </GridItem>
          ))}
        </Grid>
      )}

      {/* Stats Summary */}
      {tasks.length > 0 && (
        <Fade in timeout={800}>
          <Paper
            sx={{
              mt: 6,
              p: 4,
              bgcolor: "success.50",
              border: 1,
              borderColor: "success.200",
              textAlign: "center",
            }}
          >
            <TaskAltIcon sx={{ fontSize: 48, color: "success.main", mb: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Productivity Stats
            </Typography>
            <Typography variant="body1" color="text.secondary">
              You've completed <strong>{tasks.length}</strong> task{tasks.length !== 1 ? "s" : ""}! Keep up the
              excellent work! 🚀
            </Typography>
          </Paper>
        </Fade>
      )}
    </Container>
  )
}

export default CompletedTasksPage
