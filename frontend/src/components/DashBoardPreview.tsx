import { Box, Container, Typography, Button } from "@mui/material";

export const DashboardPreview = () => {
  return (
    <Box sx={{ py: 10, backgroundColor: "#f9fafb" }}>
      <Container
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: "center",
          gap: 6,
        }}
      >
        {/* Text Content */}
        <Box flex={1}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Your Productivity Hub
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" mb={4}>
            Visualize your tasks, stay focused, and get more done. Tasky’s
            modern dashboard helps you organize your work in a clean and
            intuitive interface.
          </Typography>
          <Button variant="contained" size="large">
            Try Demo Dashboard
          </Button>
        </Box>

        {/* Image Preview */}
        <Box
          flex={1}
          component="img"
          src="https://via.placeholder.com/600x350?text=Dashboard+Preview" //add image later
          alt="Dashboard Preview"
          sx={{
            borderRadius: 4,
            width: "100%",
            boxShadow: 3,
            maxHeight: 400,
            objectFit: "cover",
          }}
        />
      </Container>
    </Box>
  );
};
