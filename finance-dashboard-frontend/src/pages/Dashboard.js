import React, { useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import LeftNav from "../components/LeftNav"; 
import "../styles/css/Dashboard.css"; // Import CSS file for styling

const DashboardLayout = () => {
    const token = sessionStorage.getItem("authToken"); // Check if user is authenticated
  
    if (!token) {
      return <Navigate to="/login" replace />; // Redirect to login if not authenticated
    }
  
    return (
      <div className="dashboard-container">
        <LeftNav />
        <div className="main-content">
          <Outlet /> {/* This renders the matched child route */}
        </div>
      </div>
    );
  };
  
  export default DashboardLayout;