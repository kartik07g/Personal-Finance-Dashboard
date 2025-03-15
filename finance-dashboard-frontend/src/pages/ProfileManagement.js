import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "../styles/css/ProfileManagement.css";
import LeftNav from "../components/LeftNav";

const ProfileManagement = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const authToken = sessionStorage.getItem("authToken");
  const apiurl = "http://localhost:4000/proxy";

  useEffect(() => {
    const fetchUser = async () => {
      if (!authToken) {
        alert("Unauthorized access. Redirecting to login.");
        window.location.href = "/login";
        return;
      }

      try {
        const response = await fetch(`${apiurl}/user/users/${authToken}`, {
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
      const response = await fetch(`${apiurl}/user/update`, {
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

  if (loading) {
    return <p className="loading">Loading...</p>;
  }

  return (
    <div className="profile-container">
      <LeftNav/>
      <div className="profile-card">
        <img
          src="https://avatar.iran.liara.run/public/boy"
          alt="User Avatar"
          className="profile-avatar"
        />
        <h2>Edit Profile</h2>
        <form onSubmit={handleUpdate}>
          <label>Your Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <button type="submit">Save Changes</button>
        </form>
      </div>
    </div>
  );
};

export default ProfileManagement;
