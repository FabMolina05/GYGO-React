import { useEffect, useState } from "react";
import { GetIncidentsHistory } from "../API/IncidentsHistory";
import {
  Grid,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";

import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import { GetYearsByGroup } from "../API/Consumptions/MonthlyConsum";

const meses = [
  { value: "", label: "Todos los meses" },
  { value: 1, label: "Enero" },
  { value: 2, label: "Febrero" },
  { value: 3, label: "Marzo" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Mayo" },
  { value: 6, label: "Junio" },
  { value: 7, label: "Julio" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Septiembre" },
  { value: 10, label: "Octubre" },
  { value: 11, label: "Noviembre" },
  { value: 12, label: "Diciembre" },
];

const IncidentsHistoryPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [incidents, setIncidents] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [loadingYears, setLoadingYears] = useState(true);
  const [filtros, setFiltros] = useState({ mes: "", año: "" });
  const [filteredIncidents, setFilteredIncidents] = useState([]);

  const getIncidents = async () => {
    setIsLoading(true);
    try {
      const response = await GetIncidentsHistory();
      const transformed = response.map((i) => {
        const fecha = new Date(i.detectedAt);
        const month = fecha.getMonth() + 1;
        const year = fecha.getFullYear();

        return {
          id: i.id,
          fecha: fecha.toLocaleDateString(),
          promedio: `${i.expectedAverage.toFixed(2)} kg CO₂`,
          reales: `${i.realEmissions.toFixed(2)} kg CO₂`,
          leido: i.isRead ? "✔️" : "❌",
          month,
          year,
        };
      });
      setIncidents(transformed);
    } catch (err) {
      console.log("Error al cargar incidentes: ", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getIncidents();
  }, []);

  useEffect(() => {
    const fetchYears = async () => {
      setLoadingYears(true);
      const result = await GetYearsByGroup();
      setAvailableYears(result);
      setLoadingYears(false);
    };
    fetchYears();
  }, []);

  useEffect(() => {
    setFilteredIncidents(incidents);
  }, [incidents]);

  useEffect(() => {
    let datosFiltrados = [...incidents];
    if (filtros.mes !== "") {
      datosFiltrados = datosFiltrados.filter(
        (i) => i.month === Number(filtros.mes)
      );
    }
    if (filtros.año !== "") {
      datosFiltrados = datosFiltrados.filter(
        (i) => i.year === Number(filtros.año)
      );
    }
    setFilteredIncidents(datosFiltrados);
  }, [filtros, incidents]);

  const columns = [
    { Header: "Fecha", accessor: "fecha", align: "left" },
    { Header: "Promedio Esperado", accessor: "promedio", align: "center" },
    { Header: "Emisiones Reales", accessor: "reales", align: "center" },
    { Header: "Notificado", accessor: "leido", align: "center" },
  ];

  const rows = filteredIncidents.map((i) => ({
    fecha: (
      <MDTypography variant="caption" fontWeight="medium">
        {i.fecha}
      </MDTypography>
    ),
    promedio: (
      <MDTypography variant="caption" color="text" sx={{ color: "#495057" }}>
        {i.promedio}
      </MDTypography>
    ),
    reales: (
      <MDTypography variant="caption" color="text" sx={{ color: "#495057" }}>
        {i.reales}
      </MDTypography>
    ),
    leido: (
      <MDTypography variant="caption" color="text">
        {i.leido}
      </MDTypography>
    ),
  }));

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
                  <MDTypography variant="h6">
                    Historial de Incidentes
                  </MDTypography>
                </MDBox>
                <MDTypography variant="body2" color="text">
                  Visualiza todos los incidentes de exceso de emisiones
                  registrados.
                </MDTypography>
              </MDBox>
            </Grid>
          </Grid>
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            spacing={2}
            mt={2}
          >
            <Grid size={{ xs: 12 }} sx={{ mb: 2, pt: "20px" }}>
              <Grid container spacing={2} alignItems="center">
                {/* Mes */}
                <Grid size={{ xs: 12, md: 5 }}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id="mes-label">Mes</InputLabel>
                    <Select
                      id="mes-select"
                      labelId="mes-label"
                      name="mes"
                      value={filtros.mes}
                      label="Mes"
                      sx={{ height: 40 }}
                      onChange={(e) =>
                        setFiltros((prev) => ({ ...prev, mes: e.target.value }))
                      }
                    >
                      {meses.map((mes) => (
                        <MenuItem key={mes.value} value={mes.value}>
                          {mes.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                {/* Año */}
                <Grid size={{ xs: 12, md: 5 }}>
                  <FormControl fullWidth>
                    <InputLabel>Año</InputLabel>
                    <Select
                      name="año"
                      sx={{ height: 40 }}
                      value={filtros.año}
                      label="Año"
                      onChange={(e) =>
                        setFiltros((prev) => ({ ...prev, año: e.target.value }))
                      }
                    >
                      <MenuItem value="">Seleccione</MenuItem>
                      {availableYears.map((y) => (
                        <MenuItem key={y.yearlyConsumptionId} value={y.year}>
                          {y.year}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid size={{ xs: 12, md: 2 }}>
                  <MDButton
                    variant="outlined"
                    onClick={() => setFiltros({ mes: "", año: "" })}
                    color="secondary"
                  >
                    Limpiar Filtros
                  </MDButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </MDBox>

        <Grid container spacing={3} sx={{ mb: 5, pt:8}}>
        


          <Grid size={{ xs: 12 }}>
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
                  Registro de Incidentes
                </MDTypography>
              </MDBox>
              <MDBox>
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={true}
                  noEndBorder
                  loading={isLoading}
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
        <Footer />
      </MDBox>
    </DashboardLayout>
  );
};

export default IncidentsHistoryPage;
