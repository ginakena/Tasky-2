import React from "react";
import { Box, Typography, Button, Container, Stack } from "@mui/material";

const Hero = () => {
  return (
    <Box
      id="home"
      sx={{
        py: 10,
        background: "linear-gradient(to bottom, #32343fff, #adb6d3ff)",
      }}
    >
      <Container
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 4,
        }}
      >
        {/* Left: Text */}
        <Box flex={1} maxWidth="600px">
          <Box
            mb={3}
            px={2}
            py={1}
            sx={{
              backgroundColor: "#e0e7ff",
              borderRadius: 1,
              display: "inline-block",
            }}
          >
            <Typography color="#1e3a8a">Smarter Task Management</Typography>
          </Box>

          <Typography variant="h2" fontWeight="bold" gutterBottom>
            Automate Workflows{" "}
            <Box component="span" color="red">
              Faster
            </Box>
            <br />
            With Tasky
          </Typography>

          <Typography variant="h6" color="text.secondary" mb={4}>
            Boost productivity and streamline your to-dos with intelligent task
            tracking.
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button
              size="large"
              variant="contained"
              sx={{ px: 4, py: 1.5, fontWeight: 600 }}
              href="/Register"
            >
              Get Started →
            </Button>
            {/* <Button
              size="large"
              variant="outlined"
              sx={{ px: 4, py: 1.5, fontWeight: 600 }}
              href="/login"
            >
              Sign In
            </Button> */}
          </Stack>

          <Box mt={4}>
            <Typography variant="h6" fontWeight="bold" color="text.primary">
              Designed for teams & individuals
            </Typography>
            <Typography variant="body2" color="text.secondary" mt={0.5}>
              Experience productivity like never before — plan, manage, and
              crush your goals.
            </Typography>
          </Box>
        </Box>

        {/* Right: Image */}
        <Box
          flex={1}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <img
            src="/checklist-911840_1280.png"
            alt="Hero preview"
            style={{
              maxWidth: "70%",
              height: "auto",
              borderRadius: "16px",
              boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
            }}
          />
        </Box>
      </Container>
    </Box>
  );
};

export default Hero;
