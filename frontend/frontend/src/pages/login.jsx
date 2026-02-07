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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username);
      navigate("/feed");
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Login failed";
      alert(msg);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 10 }}>
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h5" fontWeight="bold" mb={2}>
            Login
          </Typography>

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
            onClick={handleLogin}
          >
            Login
          </Button>

          {/* Signup Redirect */}
          <Stack direction="row" justifyContent="center" mt={2}>
            <Typography variant="body2">
              Don’t have an account?{" "}
              <Link to="/" style={{ textDecoration: "none" }}>
                <Typography component="span" color="primary" fontWeight="bold">
                  Sign up
                </Typography>
              </Link>
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Login;
