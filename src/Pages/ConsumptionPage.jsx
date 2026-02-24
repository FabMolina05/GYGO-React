import { useState, useEffect } from "react";
import "../styles/consumption.css";
import { useNavigate } from "react-router-dom";
import { ConsumptionTable } from "../components/ConsumptionTable";
import { getConsumptions } from "../API/Consumptions/Consumption";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import {
  Grid,
  Card,
  CardContent,
  Avatar,
  Box,
  Typography,
  TextField
} from "@mui/material";
import { EnergySavingsLeaf, AddOutlined, Padding } from "@mui/icons-material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

import { refreshLogin } from "../API/Auth";

export function ConsumptionPage() {
  const [consumos, setConsumos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConsumos = async () => {
      setLoading(true);
      const result = await getConsumptions();
      setConsumos(result);
      setLoading(false);
    };
    fetchConsumos();
  }, []);
  const handleAgregarConsumo = () => {
    navigate("/consumo/agregar");
  };

  const handleAgregarConsumoo = async () => {
    await refreshLogin();
  };

  const handleVerConsumoMensual = (consumo) => {
    navigate(`/consumo/mensual/${consumo.consumptionId}`, {
      state: consumo,
    });
  };

  const handleEditarConsumo = (id) => {
    navigate(`/consumo/editar/${id}`);
  };

  const consumosFiltrados = consumos.filter((c) =>
  c.name.toLowerCase().includes(searchTerm.toLowerCase())
);



  return (
    <DashboardLayout>
      <DashboardNavbar></DashboardNavbar>

      <MDBox py={3}>
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
                  <MDTypography variant="h6">Consumo</MDTypography>
                </MDBox>
                <MDTypography variant="body2" color="text">
                  Gestiona y monitorea todos los consumos de tu empresa para
                  calcular tu huella de carbono.
                </MDTypography>
              </MDBox>
            </Grid>
            <Grid>
              <MDButton
                variant="outlined"
                startIcon={<AddOutlined />}
                onClick={handleAgregarConsumo}
                sx={{
                  borderColor: "#4CAF50",
                  color: "#4CAF50",
                  "&:hover": {
                    backgroundColor: "#E8F5E9",
                    borderColor: "#43A047",
                    color: "#388E3C",
                  },
                }}
              >
                Agregar Consumo
              </MDButton>
            </Grid>
          </Grid>
          <Grid container spacing={2} mt={1}>
            <Grid xs={12} sm={6} md={4} lg={3}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Buscar por nombre del consumo..."
                size="large"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ width: "230px", mb: 3 }}
              />
            </Grid>
          </Grid>
        </MDBox>

        <Grid container spacing={3} sx={{ mb: 5 }}>
          {/* Tabla de Consumos */}
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
                  Registro de Consumos
                </MDTypography>
              </MDBox>
              <MDBox>
                <ConsumptionTable
                  consumos={consumosFiltrados}
                  loading={loading}
                  onVerConsumoMensual={handleVerConsumoMensual}
                  onEditarConsumo={handleEditarConsumo}
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
        <Footer />
      </MDBox>
    </DashboardLayout>
  );
}
