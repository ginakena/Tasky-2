import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Link,
  Paper,
} from "@mui/material";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import API from "../api/axios";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import useUser from "../store/userStore";

interface LoginDetails {
  email?: string;
  userName?: string;
  password: string;
}

const LoginPage = () => {
  const navigate = useNavigate();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const { setUser } = useUser();

  const { isPending, mutate } = useMutation({
    mutationKey: ["login-user"],
    mutationFn: async (loginDetails: LoginDetails) => {
      const response = await API.post("/auth/Login", loginDetails, {
        withCredentials: true,
      });
      return response.data;
    },
    onError: (error: any) => {
      setFormError(
        error?.response?.data?.message ||
          "Something went wrong. Try again later."
      );
    },
    onSuccess: (data: any) => {
      console.log("Login success:", data); // 👈 log this
      const user = {
        id: data.userData.id,
        firstName: data.userData.firstName,
        lastName: data.userData.lastName,
        userName: data.userData.username,
        email: data.userData.email,
        avatar: data.userData.avatar,
        lastUpdated: data.userData.lastUpdated,
        token: data.token
      }
      setUser(user);
      navigate("/tasks");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: LoginDetails = { password };
    if (emailOrUsername.includes("@")) {
      payload.email = emailOrUsername;
    } else {
      payload.userName = emailOrUsername;
    }

    mutate(payload);
  };

  return (
    <Box sx={{ backgroundColor: "#f5f7fa", minHeight: "100vh", py: 8 }}>
      <Container maxWidth="sm">
        <Paper elevation={4} sx={{ p: 6, borderRadius: 4 }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            align="center"
            gutterBottom
          >
            Welcome Back 👋
          </Typography>

          <Typography
            variant="subtitle1"
            align="center"
            color="text.secondary"
            mb={4}
          >
            Make a task. Get it done.
          </Typography>

          {formError && (
            <Typography color="error" mb={2} align="center">
              {formError}
            </Typography>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Email or Username"
              fullWidth
              margin="normal"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              required
            />
            <TextField
              label="Password"
              fullWidth
              margin="normal"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              sx={{ mt: 3, borderRadius: 2 }}
              disabled={isPending}
            >
              {isPending ? "Logging in..." : "Login"}
            </Button>
          </form>

          <Box mt={3} textAlign="center">
            <Typography variant="body2">
              Don't have an account?{" "}
              <Link component={RouterLink} to="/register" underline="hover">
                Create Account
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
