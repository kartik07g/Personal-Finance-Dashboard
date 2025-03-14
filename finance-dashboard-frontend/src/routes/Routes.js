import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Signup from "../pages/Signup";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Transactions from "../pages/Transactions";
import AssetLiabilities from "../pages/AssetLiabilities";
import { useSelector } from "react-redux";

// Protected Route Wrapper
const PrivateRoute = ({ children }) => {
  const token = sessionStorage.getItem("authToken"); // Check if token exists
  return token ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />  {/* Default Route */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/transactions" 
          element={
            <PrivateRoute>
              <Transactions />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/assets-liabilities" 
          element={
            <PrivateRoute>
              <AssetLiabilities />
            </PrivateRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/" />} /> {/* Redirect unknown routes */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
