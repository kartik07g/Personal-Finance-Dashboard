import React, { useState, useEffect } from "react";
 import { useSelector } from "react-redux";
 import LeftNav from "../components/LeftNav";
 import { config } from "../config";
 import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  CircularProgress,
  Paper,
  useTheme,
  useMediaQuery,
  styled,
 } from "@mui/material";

 const ProfileManagement = () => {
  console.log("ProfileManagement component rendered"); // Log when the component renders

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const authToken = sessionStorage.getItem("authToken");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchUser = async () => {
      if (!authToken) {
        alert("Unauthorized access. Redirecting to login.");
        window.location.href = "/login";
        return;
      }

      try {
        const response = await fetch(`${config.API_URL}/user/users/${authToken}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setName(data.name);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user:", error);
        alert("Failed to fetch user data.");
        setLoading(false);
      }
    };

    fetchUser();
  }, [authToken]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      const response = await fetch(`${config.API_URL}/user/update`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        throw new Error("Update failed");
      }

      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update profile.");
    }
  };

  const ProfileCard = styled(Paper)(({ theme }) => ({
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: isMobile ? '90%' : '350px',
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3],
    marginTop: theme.spacing(2),
  }));

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f6f9' }}>
      <LeftNav />
      <Box sx={{ flexGrow: 1, p: 3, ml: { sm: '240px' }, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <ProfileCard>
          <Avatar
            alt="User Avatar"
            src="https://avatar.iran.liara.run/public/boy"
            sx={{ width: 80, height: 80, mb: 2 }}
          />
          <Typography variant="h5" component="h2" gutterBottom>
            Edit Profile
          </Typography>
          {loading ? (
            <CircularProgress />
          ) : (
            <form onSubmit={handleUpdate} style={{ width: '100%' }}>
              <TextField
                label="Your Name"
                value={name}
                onChange={(e) => {
                  console.log("Input value changed:", e.target.value); // Log input value
                  setName(e.target.value);
                }}
                required
                fullWidth
                margin="normal"
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                Save Changes
              </Button>
            </form>
          )}
        </ProfileCard>
      </Box>
    </Box>
  );
 };

 export default ProfileManagement;