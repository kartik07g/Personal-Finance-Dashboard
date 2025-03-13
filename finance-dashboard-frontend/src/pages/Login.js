import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, clearError } from "../redux/slices/authSlice"; // Import login action
import "../styles/css/Auth.css"; // Import CSS file for styling

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth); // Get auth state

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    
    // Dispatch login action
    try {
      const resultAction = await dispatch(loginUser(formData));
      console.log("*****resultAction",resultAction);
      

      if (loginUser.fulfilled.match(resultAction)) {
        setSuccessMessage("Login successful! Redirecting...");
        setTimeout(() => navigate("/dashboard"), 1500); // Redirect after success
      }
    } catch (err) {
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>
        {error && <p className="error-message">{error.error || "Login failed"}</p>}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p>
          Don't have an account?{" "}
          <Link to="/signup" className="auth-link">Sign up here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
