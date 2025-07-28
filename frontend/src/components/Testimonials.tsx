import { Box, Container, Typography, Avatar, Paper, useTheme } from "@mui/material";


const testimonials = [
  {
    name: "Regina Makena",
    role: "Software Engineer",
    message:
      "Tasky completely changed how I manage my work. It's fast, reliable, and actually fun to use!",
    avatar: "https://i.pravatar.cc/150?img=32",
  },
  {
    name: "Stella Stephanie",
    role: "Startup Founder",
    message:
      "The team feature helps us collaborate better. Everything stays organized and on track.",
    avatar: "https://i.pravatar.cc/150?img=15",
  },
  {
    name: "Mercy Wanjiku",
    role: "Freelancer",
    message:
      "Deadlines used to stress me out — now I stay ahead of them with Tasky.",
    avatar: "https://i.pravatar.cc/150?img=48",
  },
];

export const TestimonialsSection = () => {
  const theme = useTheme();

  return (
    <Box sx={{ py: 10, backgroundColor: "#fff" }}>
      <Container>
        <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
          What Our Users Say
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          mb={6}
        >
          Join thousands of productive users who trust Tasky every day.
        </Typography>

        <Box
          sx={{
            display: "flex",
            gap: 3,
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            scrollBehavior: "smooth",
            pb: 2,
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {testimonials.map((t, i) => (
            <Paper
              key={i}
              elevation={3}
              sx={{
                minWidth: 200,
                flexShrink: 0,
                p: 4,
                borderRadius: 3,
                scrollSnapAlign: "start",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Avatar
                src={t.avatar}
                alt={t.name}
                sx={{ width: 64, height: 64, mb: 2 }}
              />
              <Typography variant="body1" mb={2}>
                "{t.message}"
              </Typography>
              <Typography variant="subtitle1" fontWeight="bold">
                {t.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {t.role}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Container>
    </Box>
  );
};