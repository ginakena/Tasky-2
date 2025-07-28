import { Box, Container, Grid, Typography, Paper } from "@mui/material";
import TaskIcon from "@mui/icons-material/CheckCircleOutline";
import TimerIcon from "@mui/icons-material/AccessTime";
import GroupIcon from "@mui/icons-material/Group";


const GridItem = Grid as React.ElementType;

const features = [
  {
    icon: <TaskIcon sx={{ fontSize: 40, color: "primary.main" }} />,
    title: "Smart Task Management",
    description: "Create, organize, and prioritize your tasks with ease using intuitive tools.",
  },
  {
    icon: <TimerIcon sx={{ fontSize: 40, color: "primary.main" }} />,
    title: "Track Deadlines",
    description: "Stay on top of your deadlines and never miss an important task again.",
  },
  {
    icon: <GroupIcon sx={{ fontSize: 40, color: "primary.main" }} />,
    title: "Collaborate with Teams",
    description: "Share tasks, communicate, and achieve more together with your team.",
  },
];

export const FeaturesSection = () => {
  return (
    <Box sx={{ py: 10, backgroundColor: "#f9fafb" }}>
      <Container>
        <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
          Why Choose Tasky?
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" mb={6}>
          Tasky gives you the tools to manage your productivity like a pro.
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <GridItem  xs={12} md={4} key={index}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  textAlign: "center",
                  borderRadius: 3,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: 6,
                  },
                }}
              >
                <Box mb={2}>{feature.icon}</Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </GridItem>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};
