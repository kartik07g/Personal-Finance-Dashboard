import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../redux/slices/authSlice";
import { GoogleLogin } from '@react-oauth/google';
import { config } from "../config";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { styled } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '350px',
  background: 'linear-gradient(135deg, #e0e0e0, #d1d5db)', // Light grey and slate grey
  border: '1px solid #9ca3af', // Medium slate grey border
  borderRadius: '12px', // Slightly more rounded corners
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.15)', // Enhanced shadow
}));

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [successMessage, setSuccessMessage] = useState("");
  const apiUrl = "http://localhost:4000/proxy";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");

    try {
      const resultAction = await dispatch(loginUser(formData));

      if (loginUser.fulfilled.match(resultAction)) {
        setSuccessMessage("Login successful! Redirecting...");
        setTimeout(() => navigate("/dashboard"), 1500);
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    const accessToken = credentialResponse.credential;
    try {
      const response = await fetch(`${config.API_URL}/auth/google/callback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: accessToken }),
      });

      if (response.ok) {
        const data = await response.json();
        sessionStorage.setItem("authToken", data.access_token);
        window.location.href = '/dashboard';
      } else {
        console.error('Google login failed:', response.statusText);
      }
    } catch (error) {
      console.error('Error during Google login:', error);
    }
  };

  const handleGoogleFailure = (error) => {
    console.error('Google login failure:', error);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        bgcolor: '#f4f6f9', // Optional: Add a background color to the page
      }}
    >
      <StyledPaper elevation={3}>
        <Typography variant="h5" component="h2" gutterBottom>
          Login
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          To Personal Finance Manager
        </Typography>
        {error && <Alert severity="error">{error.error || "Login failed"}</Alert>}
        {successMessage && <Alert severity="success">{successMessage}</Alert>}

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            label="Email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
            type="email"
          />
          <TextField
            label="Password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
            type="password"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
            style={{ marginTop: '1rem' }}
          >
            {loading ? <CircularProgress size={24} /> : "Login"}
          </Button>
        </form>
        <Box mt={2}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
          />
        </Box>
        <Typography variant="body2" style={{ marginTop: '1rem' }}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ textDecoration: 'none', color: '#1976d2' }}>
            Sign up here
          </Link>
        </Typography>
      </StyledPaper>
    </Box>
  );
};

export default Login;