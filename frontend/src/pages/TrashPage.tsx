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
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material"
import {
  Restore as RestoreIcon,
  Delete as DeleteIcon,
  DeleteForever as DeleteForeverIcon,
  Schedule as ScheduleIcon,
  FolderDelete as FolderDeleteIcon,
  Warning as WarningIcon,
  RestoreFromTrash as RestoreFromTrashIcon,
} from "@mui/icons-material"
import API from "../api/axios"
import { toast } from "react-toastify"
import useUser from "../store/userStore"

const GridItem = Grid as React.ElementType

type DeletedTask = {
  id: string
  title: string
  description: string
  isCompleted: boolean
  isDeleted: boolean
  lastUpdated: string
  deletedAt?: string
  createdAt?: string
}

const TrashPage = () => {
  const { user, hasHydrated } = useUser()
  const [tasks, setTasks] = useState<DeletedTask[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [restoringTasks, setRestoringTasks] = useState<Set<string>>(new Set())
  const [deletingTasks, setDeletingTasks] = useState<Set<string>>(new Set())
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean
    taskId: string
    taskTitle: string
  }>({
    open: false,
    taskId: "",
    taskTitle: "",
  })

  const fetchDeletedTasks = async () => {
    if (!user?.token) return

    try {
      setError(null)
      const res = await API.get("/tasks", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      console.log("Fetched tasks:", res.data)
      const deletedTasks = res.data.filter((task: DeletedTask) => task.isDeleted === true)
      setTasks(deletedTasks)
    } catch (error) {
      console.error("Error fetching deleted tasks:", error)
      setError("Failed to fetch deleted tasks")
      toast.error("Failed to fetch deleted tasks")
    } finally {
      setLoading(false)
    }
  }

  const handleRestore = async (id: string) => {
    setRestoringTasks((prev) => new Set(prev).add(id))
    try {
      await API.patch(
        `/tasks/restore/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        },
      )
      // Fix the filter logic - need to return the boolean
      setTasks((prev) => prev.filter((task) => task.id !== id))
      toast.success("Task restored successfully! 📂")
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

  const handlePermanentDelete = async (id: string) => {
    setDeletingTasks((prev) => new Set(prev).add(id))
    try {
      // Assuming there's a permanent delete endpoint
      await API.delete(`/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      })
      setTasks((prev) => prev.filter((task) => task.id !== id))
      toast.success("Task permanently deleted")
      setConfirmDialog({ open: false, taskId: "", taskTitle: "" })
    } catch (error) {
      console.error("Error permanently deleting task:", error)
      toast.error("Failed to permanently delete task")
    } finally {
      setDeletingTasks((prev) => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }
  }

  const handleClearTrash = async () => {
    if (tasks.length === 0) return

    try {
      // Assuming there's a bulk delete endpoint
      await Promise.all(
        tasks.map((task) =>
          API.delete(`/tasks/${task.id}`, {
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          }),
        ),
      )
      setTasks([])
      toast.success("Trash cleared successfully")
    } catch (error) {
      console.error("Error clearing trash:", error)
      toast.error("Failed to clear trash")
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

  const getDaysInTrash = (dateString: string) => {
    const deletedDate = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - deletedDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  useEffect(() => {
    if (hasHydrated) {
      fetchDeletedTasks()
    }
  }, [hasHydrated, user?.token])

  const LoadingSkeleton = () => (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Skeleton variant="text" width={200} height={48} sx={{ mb: 3 }} />
      <Grid container spacing={3}>
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <GridItem xs={12} md={6} lg={4} key={item}>
            <Card sx={{ height: 240 }}>
              <CardContent>
                <Skeleton variant="text" width="80%" height={32} />
                <Skeleton variant="text" width="100%" height={20} sx={{ mt: 1 }} />
                <Skeleton variant="text" width="90%" height={20} />
                <Skeleton variant="text" width="60%" height={16} sx={{ mt: 2 }} />
                <Box sx={{ display: "flex", gap: 1, mt: 3 }}>
                  <Skeleton variant="rectangular" width={100} height={36} />
                  <Skeleton variant="rectangular" width={40} height={36} />
                </Box>
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
          <Button variant="contained" onClick={fetchDeletedTasks}>
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
          bgcolor: "grey.50",
          border: 2,
          borderColor: "grey.200",
          borderStyle: "dashed",
        }}
      >
        <FolderDeleteIcon sx={{ fontSize: 64, color: "grey.400", mb: 2 }} />
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
          Trash is empty!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400, mx: "auto" }}>
          No deleted tasks here. When you delete tasks, they'll appear here for 30 days before being permanently
          removed.
        </Typography>
        <Button variant="contained" onClick={() => window.history.back()}>
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
          <DeleteIcon sx={{ fontSize: 32, color: "warning.main" }} />
          <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary" }}>
            Trash
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Chip
              label={`${tasks.length} deleted task${tasks.length !== 1 ? "s" : ""}`}
              color="warning"
              variant="outlined"
              size="small"
            />
            <Typography variant="body2" color="text.secondary">
              Tasks are permanently deleted after 30 days
            </Typography>
          </Box>
          {tasks.length > 0 && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteForeverIcon />}
              onClick={handleClearTrash}
              size="small"
            >
              Clear Trash
            </Button>
          )}
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
                    borderColor: "warning.200",
                    bgcolor: "warning.50",
                    position: "relative",
                    overflow: "visible",
                    opacity: 0.9,
                  }}
                >
                  {/* Deleted Badge */}
                  <Box
                    sx={{
                      position: "absolute",
                      top: -8,
                      right: -8,
                      bgcolor: "warning.main",
                      borderRadius: "50%",
                      p: 1,
                      boxShadow: 2,
                      zIndex: 1,
                    }}
                  >
                    <DeleteIcon sx={{ fontSize: 20, color: "white" }} />
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
                          color: "text.secondary",
                          opacity: 0.8,
                        }}
                      >
                        {task.title}
                      </Typography>

                      {/* Deletion Info */}
                      <Stack direction="column" spacing={0.5}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <DeleteIcon sx={{ fontSize: 14, color: "warning.main" }} />
                          <Typography variant="caption" color="warning.main" sx={{ fontWeight: 600 }}>
                            Deleted {formatDate(task.lastUpdated)}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <ScheduleIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                          <Typography variant="caption" color="text.secondary">
                            {getDaysInTrash(task.lastUpdated)} day{getDaysInTrash(task.lastUpdated) !== 1 ? "s" : ""} in
                            trash
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
                        opacity: 0.7,
                      }}
                    >
                      {task.description}
                    </Typography>

                    {/* Warning for old tasks */}
                    {getDaysInTrash(task.lastUpdated) > 25 && (
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          p: 1,
                          bgcolor: "error.50",
                          borderRadius: 1,
                          mb: 2,
                        }}
                      >
                        <WarningIcon sx={{ fontSize: 16, color: "error.main" }} />
                        <Typography variant="caption" color="error.main" sx={{ fontWeight: 600 }}>
                          Will be permanently deleted soon!
                        </Typography>
                      </Box>
                    )}

                    {/* Action Buttons */}
                    <Stack direction="row" spacing={1} sx={{ mt: "auto" }}>
                      <Tooltip title="Restore task">
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          startIcon={
                            restoringTasks.has(task.id) ? (
                              <CircularProgress size={16} color="inherit" />
                            ) : (
                              <RestoreIcon />
                            )
                          }
                          onClick={() => handleRestore(task.id)}
                          disabled={restoringTasks.has(task.id)}
                          sx={{ flex: 1 }}
                        >
                          {restoringTasks.has(task.id) ? "Restoring..." : "Restore"}
                        </Button>
                      </Tooltip>

                      <Tooltip title="Delete permanently">
                        <IconButton
                          color="error"
                          onClick={() =>
                            setConfirmDialog({
                              open: true,
                              taskId: task.id,
                              taskTitle: task.title,
                            })
                          }
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
                            <DeleteForeverIcon fontSize="small" />
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

      {/* Info Section */}
      {tasks.length > 0 && (
        <Fade in timeout={800}>
          <Paper
            sx={{
              mt: 6,
              p: 4,
              bgcolor: "warning.50",
              border: 1,
              borderColor: "warning.200",
              textAlign: "center",
            }}
          >
            <RestoreFromTrashIcon sx={{ fontSize: 48, color: "warning.main", mb: 2 }} />
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Trash Information
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Tasks in trash are automatically deleted after <strong>30 days</strong>. You can restore them anytime
              before then.
            </Typography>
          </Paper>
        </Fade>
      )}

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, taskId: "", taskTitle: "" })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <WarningIcon color="error" />
          Permanently Delete Task?
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" gutterBottom>
            Are you sure you want to permanently delete "{confirmDialog.taskTitle}"?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This action cannot be undone. The task will be permanently removed from your account.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false, taskId: "", taskTitle: "" })}>Cancel</Button>
          <Button
            onClick={() => handlePermanentDelete(confirmDialog.taskId)}
            color="error"
            variant="contained"
            disabled={deletingTasks.has(confirmDialog.taskId)}
            startIcon={
              deletingTasks.has(confirmDialog.taskId) ? <CircularProgress size={16} color="inherit" /> : undefined
            }
          >
            {deletingTasks.has(confirmDialog.taskId) ? "Deleting..." : "Delete Permanently"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default TrashPage
