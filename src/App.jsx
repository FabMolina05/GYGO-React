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
import "regenerator-runtime/runtime";
import { useState, useEffect, useMemo } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Sidenav from "examples/Sidenav";
import theme from "assets/theme";
import themeDark from "assets/theme-dark";
import { useAuth } from "./context/AuthContext";
import { routes, getRoutes } from "./routes";
import {
  useMaterialUIController,
  setMiniSidenav,
} from "./context/index";
import NotFound from "./Pages/NotFound";

export default function App() {
  const [controller, dispatch] = useMaterialUIController();
  const {
    miniSidenav,
    direction,
    layout,
    sidenavColor,
    darkMode,
  } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const { pathname } = useLocation();
  const { role } = useAuth();
  const navigate = useNavigate();

  const publicRoutes = [
    "/",
    "*",
    "/inicio-sesion",
    "/pagina-inicio",
    "/certificaciones",
    "/servicios",
    "/nosotros",
    "/contactos",
    "/registro",
    "/registro/:inviteToken",
    "/restablecer-contrasena",
    "/verificar-2fa",
    "/agregar-grupo"
  ];

  const matchRoute = (route, path) => {
    const pattern = "^" + route.replace(/:\w+/g, "[^/]+") + "$";
    return new RegExp(pattern, "i").test(path);
  };

  const isPublicRoute = publicRoutes.some((route) => {
    if (route.includes(":")) return matchRoute(route, pathname.toLowerCase());
    return route.toLowerCase() === pathname.toLowerCase();
  });

  const filteredRoutes = getRoutes(role);

  // NUEVO: Función para obtener TODAS las rutas del sistema (no solo las filtradas por rol)
  const getAllSystemRoutes = () => {
    const allRoutes = [];
    const extractRoutes = (routesList) => {
      routesList.forEach((route) => {
        if (route.route && route.route !== "*") {
          allRoutes.push(route.route.toLowerCase());
        }
        if (route.collapse) {
          extractRoutes(route.collapse);
        }
      });
    };
    extractRoutes(routes); // usa 'routes' importado, no 'filteredRoutes'
    return allRoutes;
  };

  const allSystemRoutes = getAllSystemRoutes();

  // NUEVO: Verificar si la ruta actual existe en el sistema
  const isValidSystemRoute = allSystemRoutes.some((route) => {
    if (route.includes(":")) return matchRoute(route, pathname.toLowerCase());
    return pathname.toLowerCase() === route;
  });

  // ESTE useEffect MANEJA LA REDIRECCIÓN
  useEffect(() => {
    // Si no hay rol, no es ruta pública, PERO SÍ es una ruta válida del sistema
    // entonces redirigir a login
    if (!role && !isPublicRoute && isValidSystemRoute && pathname !== "/inicio-sesion") {
      setIsRedirecting(true);
      navigate("/inicio-sesion", { replace: true });
    } else {
      setIsRedirecting(false);
    }
  }, [role, pathname, isPublicRoute, isValidSystemRoute, navigate]);

  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const renderRoutes = (allRoutes) =>
    allRoutes.flatMap((route) => {
      if (route.collapse) return renderRoutes(route.collapse);
      if (route.route && route.component)
        return (
          <Route
            exact
            path={route.route}
            element={route.component}
            key={route.key}
          />
        );
      return [];
    });

  const hideSidebar = isPublicRoute || !isValidSystemRoute;


  // Si está redirigiendo, mostrar loading
  if (isRedirecting) {
    return null;
  }

  return (
    <ThemeProvider theme={darkMode ? themeDark : theme}>
      <CssBaseline />
      {layout === "dashboard" && !hideSidebar && (
        <Sidenav
          color={sidenavColor}
          brandName="GYGO"
          routes={filteredRoutes}
          onMouseEnter={handleOnMouseEnter}
          onMouseLeave={handleOnMouseLeave}
        />
      )}
      <Routes>
        {renderRoutes(filteredRoutes)}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </ThemeProvider>
  );
}