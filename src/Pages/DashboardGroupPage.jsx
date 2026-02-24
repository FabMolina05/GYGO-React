import React, { useEffect, useState } from "react";
import "../styles/DashboardGPage.css";
import { ModernDashboardCards } from "../components/DashboardsCards";
import BadgeIcon from "@mui/icons-material/Badge";
import { appsettings } from "../settings/appsettings";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { Card, Grid, CardContent } from "@mui/material";
import { fetchValidarEstadoUsuario } from "../API/Admin";
import { useAuth } from "../context/AuthContext";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import { SuperAdminDashCards } from "../components/SuperAdminDashCards";
import { useNavigate } from "react-router-dom";

export const DashboardGroupPage = () => {
  const { role } = useAuth();
  const [username, setUsername] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      if (document.cookie.includes("authToken")) {
        const refreshed = await refreshLogin();
        if (!refreshed) {
          console.warn("Fallo el refresco de sesión");
        }
      }

      const response = await fetch(`${appsettings.apiUrl}User/UserProfile`, {
        method: "GET",
        credentials: "include",
      });
      
      if (response.ok) {
        const data = await response.json();
        
        setUsername(data.username);
      }
    };

    init();
  }, []);

  useEffect(() => {
    const validateUserState = async () => {
      const userState = await fetchValidarEstadoUsuario();
      if (userState.state === true) {
        navigate("/agregar-grupo");
      }
    };
    validateUserState();
  }, []);

  const renderDashboardContent = () => {
    if (role === "GA" || role == "GU") {
      return <ModernDashboardCards role={role} />;
    }
    if (role === "SA") {
      return <SuperAdminDashCards />;
    }
    return (
      <Card
        sx={{
          background: "#fffefc",
          borderRadius: 2,
          border: "1px solid #facc15",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.04)",
          mt: 4,
        }}
      >
        <CardContent sx={{ py: 4, px: 5 }}>
          <MDBox textAlign="center">
            <BadgeIcon sx={{ fontSize: 60, color: "#facc15", mb: 2 }} />
            <MDTypography variant="h5" sx={{ mb: 1, fontWeight: 700 }}>
              Aún no tienes un rol asignado
            </MDTypography>
            <MDTypography variant="body1" sx={{ color: "#6b7280", mb: 3 }}>
              Para acceder a las funcionalidades del sistema, es necesario que
              un administrador te asigne un rol.
            </MDTypography>
            <MDTypography variant="body2" sx={{ color: "#9ca3af" }}>
              Si crees que esto es un error, intenta cerrar sesión y volver a
              ingresar, o contacta a soporte.
            </MDTypography>
          </MDBox>
        </CardContent>
      </Card>
    );
  };

  return (
    <>
      <DashboardLayout>
        <DashboardNavbar></DashboardNavbar>
        <MDBox
          sx={{
            minHeight: "100vh",
            p: 0,
          }}
        >
          <MDBox sx={{ mx: "auto" }}>
            <Grid size={12} sx={{ mb: 3 }}>
              <Card
                sx={{
                  background: "#ffffff",
                  borderRadius: 2,
                  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  border: "1px solid #e5e7eb",
                }}
              >
                <CardContent sx={{ py: 4, px: 5 }}>
                  <MDBox textAlign="center">
                    <MDTypography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        mb: 1,
                        color: "#111827",
                        textShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                      }}
                    >
                      ¡Hola, {username ? username : "Usuario"}!
                    </MDTypography>
                    <MDTypography
                      variant="body1"
                      sx={{
                        fontWeight: 400,
                        color: "#6b7280",
                      }}
                    >
                      Bienvenido de nuevo a tu dashboard
                    </MDTypography>
                  </MDBox>
                </CardContent>
              </Card>
            </Grid>
            {renderDashboardContent()}
          </MDBox>
        </MDBox>
        <Footer />
      </DashboardLayout>
    </>
  );
};
