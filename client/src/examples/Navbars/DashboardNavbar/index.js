/**
=========================================================
* Material Dashboard 2 React - v2.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useEffect } from "react";

// react-router components
import { useLocation, Link } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @material-ui core components
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";

// Material Dashboard 2 React example components
import Breadcrumbs from "examples/Breadcrumbs";
import NotificationItem from "examples/Items/NotificationItem";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import LogoutIcon from '@mui/icons-material/Logout';
import MailIcon from '@mui/icons-material/Mail';
import { useAuth } from 'context/AuthContext'; // Adjust the path as necessary
import { useNavigate } from "react-router-dom";
// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";
import { MenuItem, ListItemIcon, ListItemText } from '@mui/material';

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";

function DashboardNavbar({ absolute, light, isMini }) {
  const { logout } = useAuth(); // Destructure login method
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const route = useLocation().pathname.split("/").slice(1);
  const navigate = useNavigate();
  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(dispatch, (fixedNavbar && window.scrollY === 0) || !fixedNavbar);
    }

    /** 
     The event listener that's calling the handleTransparentNavbar function when 
     scrolling the window.
    */
    window.addEventListener("scroll", handleTransparentNavbar);

    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar();

    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);
  const [anchorElAccount, setAnchorElAccount] = useState(null);
  const handleLogout = () => {
    logout(); // Call the logout function from the context
    navigate('/login'); // Navigate to login page after logout
  };

  // State for the notifications menu
  const [anchorElNotifications, setAnchorElNotifications] = useState(null);

  // Handle opening account menu
  const handleOpenAccountMenu = (event) => {
    setAnchorElAccount(event.currentTarget);
  };

  // Handle closing account menu
  const handleCloseAccountMenu = () => {
    setAnchorElAccount(null);
  };

  // Handle opening notifications menu
  const handleOpenNotificationsMenu = (event) => {
    setAnchorElNotifications(event.currentTarget);
  };

  // Handle closing notifications menu
  const handleCloseNotificationsMenu = () => {
    setAnchorElNotifications(null);
  };

  // Render the account menu
  const renderAccountMenu = () => (
    <Menu
      anchorEl={anchorElAccount}
      open={Boolean(anchorElAccount)}
      onClose={handleCloseAccountMenu}
    >
      <Link to="/myprofile">
      <MenuItem onClick={handleCloseAccountMenu}>
        
        <ListItemIcon >
          <AccountBoxIcon  sx={iconsStyle} />
          </ListItemIcon>
        <ListItemText primary="Profile" />
        </MenuItem>
      </Link>
      
      <Link to="/settings">
      <MenuItem onClick={handleCloseAccountMenu}>
        <ListItemIcon>
          <SettingsIcon sx={iconsStyle} />
        </ListItemIcon>
        <ListItemText primary="Settings" />
        </MenuItem>
      </Link>

      <MenuItem onClick={handleLogout}>
      <ListItemIcon>
        <LogoutIcon sx={iconsStyle} />
      </ListItemIcon>
      <ListItemText primary="Logout" />
      </MenuItem>

    </Menu>
  );

  // Render the notifications menu
  const renderNotificationsMenu = () => (
    <Menu
      anchorEl={anchorElNotifications}
      open={Boolean(anchorElNotifications)}
      onClose={handleCloseNotificationsMenu}
    >
      <MenuItem onClick={handleCloseNotificationsMenu}>
        <ListItemIcon>
          <MailIcon sx={iconsStyle} />
        </ListItemIcon>
        <ListItemText primary="No new notifications" />
      </MenuItem>
      {/* <MenuItem onClick={handleCloseNotificationsMenu}>
        <ListItemIcon>
          <Icon>notifications</Icon>
        </ListItemIcon>
        <ListItemText primary="Notifications" />
      </MenuItem> */}
    </Menu>
  );


  // Styles for the navbar icons
  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;

      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }

      return colorValue;
    },
  });

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox color="inherit" mb={{ xs: 3, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
        </MDBox>
        {isMini ? null : (
          <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
      
            <MDBox color={light ? "white" : "inherit"}>
              <IconButton
                size="large"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                aria-haspopup="true"
                variant="contained"
                edge="end"
                aria-label="account of current user"
                aria-controls="menu-account"
                onClick={handleOpenAccountMenu}
              >
                <AccountCircleIcon sx={iconsStyle} />
              </IconButton>
              <IconButton
                size="large"
                edge="end"
                color="inherit"
                aria-label="notifications"
                aria-controls="menu-notifications"
                aria-haspopup="true"
                onClick={handleOpenNotificationsMenu}
              >
                <NotificationsIcon sx={iconsStyle} />
              </IconButton>
              <IconButton
                size="large"
                disableRipple
                color="inherit"
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
              >
                {miniSidenav ? <MenuOpenIcon sx={iconsStyle} fontSize="medium">

                  </MenuOpenIcon> : <MenuIcon sx={iconsStyle} fontSize="medium">
                  
                </MenuIcon>   }
                
              </IconButton>

              {/* <IconButton
                size="medium"
                disableRipple
                color="inherit"
                sx={navbarIconButton}
                onClick={handleConfiguratorOpen}
              >
                <SettingsIcon sx={iconsStyle}>settings</SettingsIcon>
              </IconButton> */}
            
              {/* Render Menus */}
              {renderAccountMenu()}
              {renderNotificationsMenu()}

              
            </MDBox>
          </MDBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
