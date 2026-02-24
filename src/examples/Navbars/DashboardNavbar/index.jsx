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

// Custom styles for DashboardNavbar
import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "../../../context/index";

import { useAuth } from "../../../context/AuthContext";

function DashboardNavbar({ absolute = false, light = false, isMini = false }) {
  const [anchorElMail, setAnchorElMail] = useState(null);
  const { role } = useAuth();

  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    transparentNavbar,
    fixedNavbar,
    openConfigurator,
    darkMode,
  } = controller;
  const [openMenu, setOpenMenu] = useState(false);
  const route = useLocation().pathname.split("/").slice(1);

  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(
        dispatch,
        (fixedNavbar && window.scrollY === 0) || !fixedNavbar
      );
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

  const handleOpenMailMenu = (event) => setAnchorElMail(event.currentTarget);
  const handleCloseMailMenu = () => setAnchorElMail(null);
  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav);
  const handleConfiguratorOpen = () =>
    setOpenConfigurator(dispatch, !openConfigurator);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);

  // Styles for the navbar icons
  const iconsStyle = ({
    palette: { dark, white, text },
    functions: { rgba },
  }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;

      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }

      return colorValue;
    },
  });

  const allowedRolesForGroup = ["GA", "DEV", "GU", "DEF"];
  const allowedRolesForMessages = ["GA", "GU"];
  const allowedRolesForSuscripcion = ["GA", "DEF"];
  const allowedRolesForGroupA = ["GA", "GU"];

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) =>
        navbar(theme, { transparentNavbar, absolute, light, darkMode })
      }
    >
      <Toolbar sx={(theme) => navbarContainer(theme)}>
        <MDBox
          color="inherit"
          mb={{ xs: 1, md: 0 }}
          sx={(theme) => navbarRow(theme, { isMini })}
        >
          { <Breadcrumbs
            icon="home"
            title={route[route.length - 1]}
            route={route}
            light={light}
          /> }
        </MDBox>
        {isMini ? null : (
          <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
            <MDBox color={light ? "white" : "inherit"}>
              {allowedRolesForMessages.includes(role) && (
                <>
                  <IconButton
                    sx={navbarIconButton}
                    size="small"
                    disableRipple
                    onClick={handleOpenMailMenu}
                  >
                    <Icon sx={iconsStyle}>mail</Icon>
                  </IconButton>

                  <Menu
                    anchorEl={anchorElMail}
                    open={Boolean(anchorElMail)}
                    onClose={handleCloseMailMenu}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                    transformOrigin={{ vertical: "top", horizontal: "left" }}
                  >
                    <Link
                      to="/mensajes"
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <NotificationItem
                        icon={<Icon>chat</Icon>}
                        title="Mensajes"
                        onClick={handleCloseMailMenu}
                      />
                    </Link>
                  </Menu>
                </>
              )}
              <IconButton
                sx={navbarIconButton}
                size="small"
                disableRipple
                onClick={handleOpenMenu}
              >
                <Icon sx={iconsStyle}>account_circle</Icon>
              </IconButton>

              <Menu
                anchorEl={openMenu}
                open={Boolean(openMenu)}
                onClose={handleCloseMenu}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                <Link
                  to="/perfil"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <NotificationItem
                    icon={<Icon>person</Icon>}
                    title="Ver perfil"
                    onClick={handleCloseMenu}
                  />
                </Link>
                {allowedRolesForSuscripcion.includes(role) && (
                  <Link
                    to="/suscripcion"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <NotificationItem
                      icon={<Icon>receipt_long</Icon>}
                      title="Suscripción"
                      onClick={handleCloseMenu}
                    />
                  </Link>
                )}
                {allowedRolesForGroupA.includes(role) && (
                  <Link
                    to="/perfil-grupo"
                    style={{ textDecoration: "none", color: "inherit" }}
                  >
                    <NotificationItem
                      icon={<Icon>groups</Icon>}
                      title="Ver grupo"
                      onClick={handleCloseMenu}
                    />
                  </Link>
                )}
              </Menu>
              {/* Botón de menú móvil */}
              <IconButton
                sx={navbarMobileMenu}
                onClick={handleMiniSidenav}
                size="small"
                disableRipple
              >
                <Icon sx={iconsStyle}>
                  {miniSidenav ? "menu_open" : "menu"}
                </Icon>
              </IconButton>
            </MDBox>
          </MDBox>
        )}
      </Toolbar>
    </AppBar>
  );
}

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
