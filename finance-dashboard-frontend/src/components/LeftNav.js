import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice"; // Import logout action
import { FiMenu, FiX, FiEdit, FiLogOut } from "react-icons/fi";
import { MdDashboard, MdAttachMoney, MdAccountBalance } from "react-icons/md";
import "../styles/css/LeftNav.css";

const LeftNav = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleSignOut = () => {
    dispatch(logout()); // Clear Redux state
    navigate("/login"); // Redirect to login page
  };

  return (
    <div className={`left-nav ${isCollapsed ? "collapsed" : ""}`}>
      <div className="nav-header">
        <button className="menu-toggle" onClick={toggleSidebar}>
          {isCollapsed ? <FiMenu size={24} /> : <FiX size={24} />}
        </button>
        {!isCollapsed && (
          <div className="user-info">
            <img
              src="https://avatar.iran.liara.run/public/boy" // Replace with user avatar
              alt="User Avatar"
              className="user-avatar"
            />
            <div className="user-details">
              <span className="user-name">John Doe</span>
              <Link to="/profile" >
                <FiEdit className="edit-icon" />
              </Link>
            </div>
          </div>
        )}
      </div>

      <nav className="nav-links">
        <Link to="/dashboard" className="nav-item">
          <MdDashboard className="nav-icon" />
          {!isCollapsed && <span>Dashboard</span>}
        </Link>
        <Link to="/transactions" className="nav-item">
          <MdAttachMoney className="nav-icon" />
          {!isCollapsed && <span>Transactions</span>}
        </Link>
        <Link to="/assets-liabilities" className="nav-item">
          <MdAccountBalance className="nav-icon" />
          {!isCollapsed && <span>Assets & Liabilities</span>}
        </Link>
      </nav>

      <div className="nav-footer">
        <button className="signout-btn" onClick={handleSignOut}>
          <FiLogOut className="nav-icon" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );
};

export default LeftNav;
