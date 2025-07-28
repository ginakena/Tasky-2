import {
  Box,
  Button,
  Container, 
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Link,
} from "@mui/material";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import API from "../api/axios"; 

interface User {
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  password: string;
}

const Register = () => {
  // const [plan, setPlan] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [formError, setFormError] = useState("");

  const navigate = useNavigate();

  const { isPending, mutate } = useMutation({
    mutationKey: ["register-user"],
    mutationFn: async (newUser: User) => {
      const response = await API.post("/auth/Register", newUser); 
      return response.data;
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || "Something went wrong. Try again later.";
      setFormError(message);
    },
    onSuccess: () => {
      navigate("/Login");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!agreed) {
      setFormError("Please agree to the terms and privacy policy.");
      return;
    }

    if (password !== confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }

    const newUser: User = {
      firstName,
      lastName,
      email,
      userName,
      password,
    };

    mutate(newUser);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ py: 5 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom align="center">
          Create a New Account
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom>
          It only takes 20 seconds
        </Typography>

        {formError && (
          <Typography color="error" align="center" mb={2}>
            {formError}
          </Typography>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="First Name"
            fullWidth
            required
            margin="normal"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            label="Last Name"
            fullWidth
            required
            margin="normal"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          <TextField
            label="User Name"
            fullWidth
            required
            margin="normal"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            required
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            required
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {/* <FormControl fullWidth required margin="normal">
            <InputLabel>Select Plan</InputLabel>
            <Select
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              label="Select Plan"
            >
              <MenuItem value="free">Free</MenuItem>
              <MenuItem value="pro">Pro</MenuItem>
              <MenuItem value="enterprise">Enterprise</MenuItem>
            </Select>
          </FormControl> */}

          <FormControlLabel
            control={
              <Checkbox
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
              />
            }
            label={
              <Typography variant="body2">
                I agree to the <Link href="#">terms</Link> &{" "}
                <Link href="#">privacy policy</Link>
              </Typography>
            }
            sx={{ mt: 2 }}
          />

          <Button
            type="submit"
            variant="contained"
            size="large"
            fullWidth
            sx={{ mt: 3, borderRadius: 2 }}
            disabled={isPending}
          >
            {isPending ? "Signing up..." : "Sign Up"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
