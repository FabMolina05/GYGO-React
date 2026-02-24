import React, { useEffect, useState } from 'react'
import { ChangePasswordForm } from '../components/ChangePasswordForm'
import { jwtDecode } from 'jwt-decode';
import {
  Card,
  Grid,
  CircularProgress,
  FormControl,
  InputAdornment,
  IconButton,
  InputLabel,
  OutlinedInput,
  Button,
} from '@mui/material';
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

export const ChangePasswordPage = () => {

  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await fetch("https://localhost:7217/api/User/UserProfile",
          {
            method: "GET",
            credentials: "include"
          }
        );
        if (!response.ok) {
          throw new Error("Error al traer la información del usuario.")
        }

        const data = await response.json();
        setUsername(data.username);
      } catch (error) {
        console.error("Error: ", error);
      }
    };

    fetchUsername();
  }, [])


  return (
    <DashboardLayout>
      <DashboardNavbar></DashboardNavbar>
      <MDBox py={3}
        sx={{
          background: "linear-gradient(135deg, #eef2f3 0%, #dfe9f3 100%)",
          minHeight: "100vh"
        }}
        mb={4}>
        <Grid container spacing={3} justifyContent={"center"}>
          <Grid size={{ xs: 12, md: 8, lg: 6 }}>
            <Card sx={{
              p: 4,
              borderRadius: 4,
              boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
              backdropFilter: "blur(6px)",
              animation: "fadeInUp 0.5s ease"
            }}>
              <MDTypography variant="h5" fontWeight="bold" gutterBottom sx={{ textAlign: "center", mb: 3 }}>
                Cambiar contraseña | {username || "Usuario"}
              </MDTypography>
              <ChangePasswordForm></ChangePasswordForm>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  )
}
