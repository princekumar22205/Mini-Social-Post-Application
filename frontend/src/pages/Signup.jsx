import { useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Container,
  Stack
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await API.post("/auth/signup", { username, email, password });
      navigate("/");
    } catch {
      alert("Signup failed");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            Create Account
          </Typography>

          <TextField
            fullWidth
            label="Username"
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <TextField
            fullWidth
            label="Email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2, borderRadius: 5 }}
            onClick={handleSignup}
          >
            Sign Up
          </Button>

          {/* Login Redirect */}
          <Stack direction="row" justifyContent="center" mt={2}>
            <Typography variant="body2">
              Already have an account?{" "}
              <Link to="/login" style={{ textDecoration: "none" }}>
                <Typography component="span" color="primary" fontWeight="bold">
                  Login
                </Typography>
              </Link>
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Signup;
