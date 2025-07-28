import { Box, Container, Grid, Typography, Link, IconButton } from "@mui/material";
import { GitHub, Twitter, Instagram } from "@mui/icons-material";


const GridItem = Grid as React.ElementType;

export const Footer = () => {
  return (
    <Box sx={{ py: 6, backgroundColor: "#101827", color: "white" }}>
      <Container>
        <Grid container spacing={4}>
          <GridItem xs={12} md={6}>
            <Typography variant="h6" fontWeight="bold">
              Tasky
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: "gray" }}>
              Simplify your work. Boost your productivity.
            </Typography>
          </GridItem>

          <GridItem xs={6} md={3}>
            <Typography variant="subtitle1" fontWeight="bold">
              Product
            </Typography>
            <Link href="#" underline="none" color="inherit" display="block" mt={1}>
              Features
            </Link>
            <Link href="#" underline="none" color="inherit" display="block" mt={1}>
              Pricing
            </Link>
            <Link href="#" underline="none" color="inherit" display="block" mt={1}>
              FAQs
            </Link>
          </GridItem>

          <GridItem xs={6} md={3}>
            <Typography variant="subtitle1" fontWeight="bold">
              Follow Us
            </Typography>
            <Box mt={1}>
              <IconButton href="#" sx={{ color: "white" }}>
                <Twitter />
              </IconButton>
              <IconButton href="#" sx={{ color: "white" }}>
                <Instagram />
              </IconButton>
              <IconButton href="#" sx={{ color: "white" }}>
                <GitHub />
              </IconButton>
            </Box>
          </GridItem>
        </Grid>

        <Typography variant="caption" display="block" align="center" mt={6} color="gray">
          © {new Date().getFullYear()} Tasky. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};
