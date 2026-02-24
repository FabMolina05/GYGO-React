import React, { useState, useEffect } from "react";
import { GetReportsGroupsByService } from "../../API/Reports";
import { GetServices } from "../../API/Reports";
import { ReportCompaniesPDF } from "../../utils/ReportCompaniesPDF";
import { DataGrid } from "@mui/x-data-grid";

import {
  Divider,
  Grid,
  FormControl,
  Select,
  CircularProgress,
  Switch,
  TextField,
  Button,
  IconButton,
  Typography,
  Modal,
  Box,
  Stack,
  Tooltip,
  Menu,
  MenuItem,
  Card,
  InputLabel,
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDButton from "components/MDButton";
import MDBadge from "components/MDBadge";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: 500 },
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 3,
  p: 4,
};

export function ReportServices() {
  const [gruposResumen, setGruposResumen] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [ServicesData, setServicesData] = useState([]);
  const [statusFilter, setStatusFilter] = useState("todos");
  const [serviceFilter, setServiceFilter] = useState("todos");

  const [selectedCompany, setSelectedCompany] = useState(null);

  const fetchReportServices = async () => {
    try {
      const data = await GetReportsGroupsByService();
      setGruposResumen(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchServices = async () => {
    try {
      const data = await GetServices();
      setServicesData(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchReportServices();
    fetchServices();
  }, [statusFilter, serviceFilter]);

  // Datos para gráfico de resumen
  const dataResumen = {
    labels: gruposResumen.map((r) => r.serviceName),
    datasets: [
      {
        label: "Total Grupos",
        data: gruposResumen.map((r) => r.totalGrupos),
        backgroundColor: "rgba(75,192,192,0.6)",
      },
    ],
  };

  return (
    <DashboardLayout>
      <DashboardNavbar></DashboardNavbar>
      <MDBox py={3}>
        <MDBox mb={2}>
          <MDBox
            sx={{
              borderRadius: 2,
              p: 3,
              mb: 2,
              background: "#ffffff",
              border: "1px solid #e5e7eb",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Grid container alignItems="center" justifyContent="space-between">
              <Grid item>
                <MDBox display="flex" flexDirection="column">
                  <MDBox display="flex" alignItems="center" gap={1}>
                    <MDTypography variant="h6">
                      Reporte de Servicios
                    </MDTypography>
                  </MDBox>
                  <MDTypography variant="body2" color="text">
                    Visualiza la cantidad de empresas que utilizan cada servicio
                    del sistema.
                  </MDTypography>
                </MDBox>
              </Grid>
              <Grid item></Grid>
            </Grid>

            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              spacing={2}
              mt={2}
            >
              <Grid item>
                <Grid container spacing={2}>
                  <Grid item>
                    <Grid container spacing={2}></Grid>
                  </Grid>

                  {/* Filtrar por servicios */}
                  <Grid item>
                    <Grid container spacing={2}></Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </MDBox>

          <Grid size={{ xs: 12 }} mt={10}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="success"
                borderRadius="lg"
                coloredShadow="success"
              >
                <MDTypography variant="h6" color="white" align="left">
                  Servicios
                </MDTypography>
              </MDBox>
              <MDBox>
                <MDBox>
                  <Grid container spacing={5}>
                    <Grid size={{ xs: 12 }}>
                      <Card>
                        <MDBox pt={3}>
                          <Bar data={dataResumen} />
                        </MDBox>
                      </Card>
                    </Grid>
                  </Grid>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </MDBox>

        <Footer />
      </MDBox>

      {/* Termina Modal para ver los detalles de la empresa */}
    </DashboardLayout>
  );
}
