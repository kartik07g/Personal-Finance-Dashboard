import React, { useState } from "react";
 import { useDispatch, useSelector } from "react-redux";
 import { signupUser } from "../redux/slices/authSlice";
 import { Link, useNavigate } from "react-router-dom";
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
 }));

 const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");

    try {
      const resultAction = await dispatch(signupUser(formData));

      if (signupUser.fulfilled.match(resultAction)) {
        setSuccessMessage("Signup successful! Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      console.error("Signup failed:", err);
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
          Sign Up
        </Typography>
        {successMessage && <Alert severity="success">{successMessage}</Alert>}
        {error && <Alert severity="error">{error.error}</Alert>}

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            label="Name"
            name="name"
            placeholder="Enter your Name"
            value={formData.name}
            onChange={handleChange}
            required
            fullWidth
            margin="normal"
          />
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
            {loading ? <CircularProgress size={24} /> : "Sign Up"}
          </Button>
        </form>
        <Box mt={2}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleFailure}
          />
        </Box>
        <Typography variant="body2" style={{ marginTop: '1rem' }}>
          Already have an account?{" "}
          <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2' }}>
            Login here
          </Link>
        </Typography>
      </StyledPaper>
    </Box>
  );
};

export default Signup;