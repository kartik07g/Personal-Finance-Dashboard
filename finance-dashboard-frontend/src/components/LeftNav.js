import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX, FiEdit, FiLogOut } from "react-icons/fi";
import { MdDashboard, MdAttachMoney, MdAccountBalance } from "react-icons/md";
import "../styles/css/LeftNav.css";

const LeftNav = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
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
              src="https://via.placeholder.com/50" // Replace with user avatar
              alt="User Avatar"
              className="user-avatar"
            />
            <div className="user-details">
              <span className="user-name">John Doe</span>
              <FiEdit className="edit-icon" />
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
        <button className="signout-btn">
          <FiLogOut className="nav-icon" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  );
};

export default LeftNav;
