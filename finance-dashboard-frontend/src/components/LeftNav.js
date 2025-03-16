import React, { useState } from "react";
 import { Link, useNavigate } from "react-router-dom";
 import { useDispatch } from "react-redux";
 import { logout } from "../redux/slices/authSlice"; // Import logout action
 import { FiMenu, FiX } from "react-icons/fi";
 import { MdDashboard, MdAttachMoney, MdAccountBalance, MdAccountCircle } from "react-icons/md";
 import {
  Box,
  IconButton,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
  Button,
  styled,
 } from "@mui/material";
 import DashboardIcon from '@mui/icons-material/Dashboard';
 import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
 import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
 import AccountCircleIcon from '@mui/icons-material/AccountCircle';
 import LogoutIcon from '@mui/icons-material/Logout';
 import MenuIcon from '@mui/icons-material/Menu';
 import CloseIcon from '@mui/icons-material/Close';

 const LeftNav = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleSignOut = () => {
    dispatch(logout()); // Clear Redux state
    navigate("/login"); // Redirect to login page
  };

  const NavItem = styled(ListItemButton)(({ theme }) => ({
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(1),
    color: theme.palette.common.white, // Changed tabs color to white
    '&.active': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.common.white,
      '& .MuiListItemIcon-root': {
        color: theme.palette.common.white,
      },
    },
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  }));

  const NavIcon = styled(ListItemIcon)(({ theme }) => ({
    minWidth: 40,
    color: theme.palette.common.white, // Also changed icon color to white for consistency
  }));

  return (
    <Box
      sx={{
        width: isCollapsed ? 70 : 205,
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundColor: '#1e293b',
        color: theme.palette.common.white,
        display: 'flex',
        flexDirection: 'column',
        padding: theme.spacing(2),
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        overflowX: 'hidden',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <IconButton onClick={toggleSidebar} sx={{ color: 'white' }}>
          {isCollapsed ? <MenuIcon /> : <CloseIcon />}
        </IconButton>
        {!isCollapsed && (
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 10 }}>
            <Avatar
              alt="User Avatar"
              src="https://avatar.iran.liara.run/public/boy"
              sx={{ width: 50, height: 50, mr: 1 }}
            />
          </Box>
        )}
      </Box>

      <Divider sx={{ borderColor: theme.palette.divider }} />

      <List sx={{ mt: 2, flexGrow: 1 }}>
        <NavItem component={Link} to="/profile" className={window.location.pathname === '/profile' ? 'active' : ''}>
          <NavIcon>
            <AccountCircleIcon />
          </NavIcon>
          {!isCollapsed && <ListItemText primary="Profile" primaryTypographyProps={{ color: 'white' }} />}
        </NavItem>
        <NavItem component={Link} to="/dashboard" className={window.location.pathname === '/dashboard' ? 'active' : ''}>
          <NavIcon>
            <DashboardIcon />
          </NavIcon>
          {!isCollapsed && <ListItemText primary="Dashboard" primaryTypographyProps={{ color: 'white' }} />}
        </NavItem>
        <NavItem component={Link} to="/transactions" className={window.location.pathname === '/transactions' ? 'active' : ''}>
          <NavIcon>
            <AttachMoneyIcon />
          </NavIcon>
          {!isCollapsed && <ListItemText primary="Transactions" primaryTypographyProps={{ color: 'white' }} />}
        </NavItem>
        <NavItem component={Link} to="/assets-liabilities" className={window.location.pathname === '/assets-liabilities' ? 'active' : ''}>
          <NavIcon>
            <AccountBalanceIcon />
          </NavIcon>
          {!isCollapsed && <ListItemText primary="Assets & Liabilities" primaryTypographyProps={{ color: 'white' }} />}
        </NavItem>
      </List>

      <Divider sx={{ borderColor: theme.palette.divider }} />

      <Box sx={{ mt: 2, mb: 4 }}>
        <Button
          fullWidth
          variant="outlined"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleSignOut}
          sx={{ display: 'flex', justifyContent: 'flex-start', color: 'white', borderColor: 'white' }}
        >
          {!isCollapsed && 'Sign Out'}
        </Button>
      </Box>
    </Box>
  );
 };

 export default LeftNav;