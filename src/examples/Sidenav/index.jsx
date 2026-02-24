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
import logo from "../../assets/Logo.png";
import { useEffect } from "react";

// react-router-dom components
import { useLocation, NavLink, useNavigate } from "react-router-dom";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Link from "@mui/material/Link";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React example components
import SidenavCollapse from "examples/Sidenav/SidenavCollapse";
import DropdownCollapse from "examples/Sidenav/DropdownCollapse";

// Custom styles for the Sidenav
import SidenavRoot from "examples/Sidenav/SidenavRoot";
import sidenavLogoLabel from "examples/Sidenav/styles/sidenav";

// Material Dashboard 2 React context
import {
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
} from "../../context/index";

// Context de autenticación
import { useAuth } from "../../context/AuthContext";
import { logoutSesion } from "../../API/Auth";

function Sidenav({ color = "info", brandName, routes, ...rest }) {
  const navigate = useNavigate();
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    transparentSidenav,
    whiteSidenav,
    darkMode,
    sidenavColor,
  } = controller;
  const location = useLocation();
  const { role, loading } = useAuth();
  const { logoutRol } = useAuth();

    if (loading || !role) {
    return null; // No renderiza el sidebar
  }

  
  const logoutSes = async () => {
    //Entre al logout
    navigate("/pagina-inicio")

    // const logout = await logoutSesion();
    // if (logout) {
    //   navigate("/HomePage");
    //   setTimeout(() => logoutRol(), 50);
    // }
  };

  const collapseName = location.pathname.replace("/", "");

  let textColor = "white";

  const closeSidenav = () => setMiniSidenav(dispatch, true);

  useEffect(() => {
    function handleMiniSidenav() {
      setMiniSidenav(dispatch, window.innerWidth < 1200);
      setTransparentSidenav(
        dispatch,
        window.innerWidth < 1200 ? false : transparentSidenav
      );
      setWhiteSidenav(
        dispatch,
        window.innerWidth < 1200 ? false : whiteSidenav
      );
    }

    window.addEventListener("resize", handleMiniSidenav);
    handleMiniSidenav();

    return () => window.removeEventListener("resize", handleMiniSidenav);
  }, [dispatch, location]);

  const renderRoutes = routes
    .filter((route) => !route.hideInSidebar)
    .map((route) => {
      if (route.type === "collapse") {
        if (route.collapse) {
          return (
            <DropdownCollapse
              key={route.key}
              route={route}
              collapseName={collapseName}
              color={color}
            />
          );
        } else {
          return route.href ? (
            <Link
              href={route.href}
              key={route.key}
              target="_blank"
              rel="noreferrer"
              sx={{ textDecoration: "none" }}
            >
              <SidenavCollapse
                name={route.name}
                icon={route.icon}
                active={route.key === collapseName}
                noCollapse={route.noCollapse}
              />
            </Link>
          ) : (
            <NavLink key={route.key} to={route.route}>
              <SidenavCollapse
                name={route.name}
                icon={route.icon}
                active={route.key === collapseName}
              />
            </NavLink>
          );
        }
      } else if (route.type === "title") {
        return (
          <MDTypography
            key={route.key}
            color={textColor}
            display="block"
            variant="caption"
            fontWeight="bold"
            textTransform="uppercase"
            pl={3}
            mt={2}
            mb={1}
            ml={1}
          >
            {route.title}
          </MDTypography>
        );
      } else if (route.type === "divider") {
        return (
          <Divider
            key={route.key}
            light={
              (!darkMode && !whiteSidenav && !transparentSidenav) ||
              (darkMode && !transparentSidenav && whiteSidenav)
            }
          />
        );
      }
      return null;
    });

  return (
    <SidenavRoot
      {...rest}
      variant="permanent"
      ownerState={{ transparentSidenav, whiteSidenav, miniSidenav, darkMode }}
    >
      <MDBox pt={3} pb={1} px={4} textAlign="center">
        <MDBox
          display={{ xs: "block", xl: "none" }}
          position="absolute"
          top={0}
          right={0}
          p={1.625}
          onClick={closeSidenav}
          sx={{ cursor: "pointer" }}
        >
          <MDTypography variant="h6" color="secondary">
            <Icon sx={{ fontWeight: "bold" }}>close</Icon>
          </MDTypography>
        </MDBox>
        <MDBox
          component={NavLink}
          to="/panel-control"
          display="flex"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          gap={1}
        >
          <MDBox
            component="img"
            src={logo}
            alt="Logo"
            width="3rem" // Puedes ajustarlo a 4rem o más si querés
          />
          <MDTypography
            component="h6"
            variant="h5" // Cambialo a "h5" si querés aún más grande
            fontWeight="bold"
            color={textColor}
          >
            {brandName}
          </MDTypography>
        </MDBox>
      </MDBox>

      <Divider
        light={
          (!darkMode && !whiteSidenav && !transparentSidenav) ||
          (darkMode && !transparentSidenav && whiteSidenav)
        }
      />

      <List>{renderRoutes}</List>

      {/* Botón de cerrar sesión al fondo */}
      {!miniSidenav && (
        <MDBox mt="auto" p={2} display="flex"
            flexDirection = "column"
            gap={1}>
          <MDButton
            fullWidth
            sx={{
              backgroundColor: "#308d21",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#276e1a",
              },
            }}
            onClick={() => {
              logoutSes();
            }}
          >
            <Icon sx={{ mr: 1 }}>logout</Icon> Ir a la página principal
          </MDButton>
          
        </MDBox>
      )}
    </SidenavRoot>
  );
}

Sidenav.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "dark",
  ]),
  brand: PropTypes.string,
  brandName: PropTypes.string.isRequired,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default Sidenav;
