import React, { useState } from "react";
import {
  Avatar,
  Button,
  CssBaseline,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  IconButton,
  InputAdornment,
  CircularProgress,
  Divider,
} from "@mui/material";
import {
  LockOutlined,
  Visibility,
  VisibilityOff,
  GitHub,
  Google,
  Facebook,
} from "@mui/icons-material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthProvider";

// Reusable Social Login Button Component
const SocialLoginButton = ({ provider, color, icon, onClick }) => {
  return (
    <Button
      fullWidth
      variant="contained"
      sx={{
        mb: 2,
        backgroundColor: color,
        color: "#fff",
        textTransform: "none",
        display: "flex",
        justifyContent: "flex-start", // Align content to the left
        alignItems: "center",
        padding: "8px 12px",
        "&:hover": { backgroundColor: darkenColor(color) },
      }}
      onClick={() => onClick(provider)}
    >
      {/* Icon on the left */}
      <Box sx={{ display: "flex", alignItems: "center" }}>
        {icon}
        {/* Vertical Line */}
        <Divider
          orientation="vertical"
          flexItem
          sx={{
            height: "inherit",
            width: "1px",
            backgroundColor: "#fff",
            marginLeft: 2,
            marginRight: 2,
          }}
        />
      </Box>
      {/* Text Content */}
      <Typography variant="body1" sx={{ flexGrow: 1, textAlign: "start" }}>
        Sign In With {provider}
      </Typography>
    </Button>
  );
};

// Utility function to darken colors for hover effect
const darkenColor = (color) => {
  const factor = 0.9;
  return color.replace(
    /(\d+),(\d+),(\d+)/,
    (_, r, g, b) =>
      `${Math.round(r * factor)},${Math.round(g * factor)},${Math.round(
        b * factor
      )}`
  );
};

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const { authenticate } = useAuth();

  // Form Submit Logic
  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const response = await authenticate(formData.username, formData.password);
      if (response.token) {
        console.log("token:", response.token);
        navigate("/home");
      }
    } catch (error) {
      setErrorMessage("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  // Social Login Handler
  const handleSocialLogin = (provider) => {
    console.log(`Redirecting to ${provider} login...`);
    // Implement actual social login logic
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5" sx={{ textAlign: "start" }}>
          Login
        </Typography>

        {/* Error Message */}
        {errorMessage && (
          <Typography color="error" sx={{ marginTop: 2 }}>
            {errorMessage}
          </Typography>
        )}

        {/* Login Form */}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            id="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Sign In"}
          </Button>
          <Grid container>
            <Grid item>
              <Link component={RouterLink} to="/signup" variant="body2">
                Don't have an account? Sign Up
              </Link>
            </Grid>
          </Grid>
        </Box>

        {/* Divider */}
        <Divider sx={{ width: "100%", my: 3 }}>OR</Divider>

        {/* Social Login Buttons */}
        <SocialLoginButton
          provider="GitHub"
          color="rgb(36,41,46)" // GitHub black
          icon={<GitHub />}
          onClick={handleSocialLogin}
        />
        <SocialLoginButton
          provider="Google"
          color="rgb(219,68,55)" // Google red
          icon={<Google />}
          onClick={handleSocialLogin}
        />
        <SocialLoginButton
          provider="Facebook"
          color="rgb(24,119,242)" // Facebook blue
          icon={<Facebook />}
          onClick={handleSocialLogin}
        />
      </Box>
    </Container>
  );
}
