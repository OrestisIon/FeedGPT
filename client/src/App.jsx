
import React,{ useState, useEffect, useMemo } from "react";

// react-router components
import { Routes, Route, Navigate, useLocation } from "react-router-dom";

// @mui material components
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import Sidenav from "examples/Sidenav";
import Configurator from "examples/Configurator";

// Material Dashboard 2 React themes
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";

// Material Dashboard 2 React Dark Mode themes
import themeDark from "assets/theme-dark";
import themeDarkRTL from "assets/theme-dark/theme-rtl";

// RTL plugins
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

// Material Dashboard 2 React routes
import routes from "routes";

// Material Dashboard 2 React contexts
import { useMaterialUIController, setMiniSidenav, setOpenConfigurator } from "context";

// Images
import brandWhite from "assets/images/feedgpt.png";
import brandDark from "assets/images/feedgpt.png";

import { AuthProvider } from 'context/AuthContext'; // Import the AuthProvider
import ProtectedRoute from 'components/ProtectedRoute'; // Import ProtectedRoute

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const filteredRoutes = routes.filter(route => route.to_dashboard === true);
  const {
    miniSidenav,
    direction,
    layout,
    openConfigurator,
    sidenavColor,
    transparentSidenav,
    whiteSidenav,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const [isAuth, setisAuth] = useState(false);
  const { pathname } = useLocation();

  // Cache for the rtl
  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  // Open sidenav when mouse enter on mini sidenav
  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  // Close sidenav when mouse leave mini sidenav
  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  // Change the openConfigurator state
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  // Setting the dir attribute for the body element
  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  // Setting page scroll to 0 when changing the route
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) => allRoutes.map((route) => {
    if (route.collapse) {
      return getRoutes(route.collapse); // Recursively handle nested routes if any
    }

    if (route.route) {
      // Directly accessible routes without authentication
      if (route.key === "sign-in" || route.key === "sign-up") {
        return (
          <Route
            key={route.key}
            path={route.route}
            element={React.createElement(route.component)}
          />
        );
      } else {
        // Routes that require authentication
        return (
          <Route
            key={route.key}
            path={route.route}
            element={
              <ProtectedRoute>
                {React.createElement(route.component)}
              </ProtectedRoute>
            }
          />
        );
      }
    }

    return null;
  });


  const getRoutesvr = (allRoutes) => allRoutes.map((route) => {
    if (route.collapse) {
      return getRoutes(route.collapse); // Recursively handle nested routes if any
    }

    if (route.route) {
      // Directly accessible routes without authentication
        return (
          <Route
            key={route.key}
            path={route.route}
            element={React.createElement(route.component)}
          />
        );
    }

    return null;
  });

  const configsButton = (
    <MDBox
      display="flex"
      justifyContent="center"
      alignItems="center"
      width="3.25rem"
      height="3.25rem"
      bgColor="white"
      shadow="sm"
      borderRadius="50%"
      position="fixed"
      right="2rem"
      bottom="2rem"
      zIndex={99}
      color="dark"
      sx={{ cursor: "pointer" }}
      onClick={handleConfiguratorOpen}
    >
      <Icon fontSize="small" color="inherit">
        settings
      </Icon>
    </MDBox>
  );


  return (
    <AuthProvider>
      {direction === "rtl" ? (
        <CacheProvider value={rtlCache}>
          <ThemeProvider theme={darkMode ? themeDarkRTL : themeRTL}>
            <CssBaseline />
            {layout === "vr" && <Configurator />}
            <Routes>
              {getRoutes(routes)}
              {/* Fallback route - redirect to login if route is not found/protected and user is not authenticated */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </ThemeProvider>
        </CacheProvider>
      ) : (
        <ThemeProvider theme={darkMode ? themeDark : theme}>
          <CssBaseline />
          {layout === "dashboard" && (
            <>
              <Sidenav
                color={sidenavColor}
                brand={(transparentSidenav && !darkMode) || whiteSidenav ? brandDark : brandWhite}
                brandName="FeedGPT"
                routes={filteredRoutes}
                onMouseEnter={handleOnMouseEnter}
                onMouseLeave={handleOnMouseLeave}
              />
            </>
          )}
          {layout === "vr" && <Configurator />}
          <Routes>
              {getRoutesvr(routes)}
              <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </ThemeProvider>
      )}
    </AuthProvider>

  );
}