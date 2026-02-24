import {
  getMonthlyEmissions,
  getSourcesEmissions,
  getRangeByMonthsEmissions,
  getRangeByYearsEmissions,
} from "../API/EmissionsReport/MonthlyEmissions";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useEffect, useRef, useState } from "react";
import { GetYearsByGroup } from "../API/Consumptions/MonthlyConsum";
import { exportToExcel } from "../utils/CreateReportExcel";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  ButtonGroup,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Paper,
  Divider,
  Stack,
} from "@mui/material";
import { exportChartToPDF } from "../utils/CreateReportPDF";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
import MDButton from "components/MDButton";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

const meses = [
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

export const ReportsEmissionsPage = () => {
  const chartRef = useRef();
  const [labels, setLabels] = useState([]);
  const [emissions, setEmissions] = useState([]);
  const [selectedReport, setSelectedReport] = useState("");
  const [availableYears, setAvailableYears] = useState([]);
  const [loadingYears, setLoadingYears] = useState(true);

  const [formData, setFormData] = useState({
    year: "",
    initialMonth: "",
    finalMonth: "",
    initialYear: "",
    finalYear: "",
  });

  useEffect(() => {
    const fetchYears = async () => {
      setLoadingYears(true);
      const result = await GetYearsByGroup();
      setAvailableYears(result);
      setLoadingYears(false);
    };
    fetchYears();
  }, []);

  const handleReportTypeChange = (type) => {
    setSelectedReport(type);
    setLabels([]);
    setEmissions([]);
    setFormData({
      year: "",
      initialMonth: "",
      finalMonth: "",
      initialYear: "",
      finalYear: "",
    });
  };

  const getLabelTitle = () => {
  switch (selectedReport) {
    case "monthly":
      return "Mes";
    case "sources":
      return "Factor de emisión";
    case "rangeMonths":
      return "Mes";
    case "rangeYears":
      return "Año";
    default:
      return "Dato";
  }
};


  const handleInputChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const setLabelsName = async (months) => {
    const mes = await months.map((item) => meses[item - 1].label);
    setLabels(mes);
  };

  const handleGenerate = async () => {
    const { year, initialMonth, finalMonth, initialYear, finalYear } = formData;
    switch (selectedReport) {
      case "monthly":
        if (year) {
          const res = await getMonthlyEmissions(year);
          const labelsFetch = res.map((item) => item.labels);
          const emissionsFetch = res.map((item) => item.emissions);
          setLabelsName(labelsFetch);
          setEmissions(emissionsFetch);
        }
        break;
      case "sources":
        if (year) {
          const res = await getSourcesEmissions(year);
          setLabels(res.labels);
          setEmissions(res.emissions);
        }
        break;
      case "rangeMonths":
        if (year && initialMonth && finalMonth) {
          const res = await getRangeByMonthsEmissions(
            year,
            initialMonth,
            finalMonth
          );
          if (res && res.length > 0) {
            setLabelsName(res[0].labels);
            setEmissions(res[0].emissions);
          } else {
            setLabels([]);
            setEmissions([]);
          }
        }
        break;
      case "rangeYears":
        if (initialYear && finalYear) {
          const res = await getRangeByYearsEmissions(initialYear, finalYear);
          if (res && res.length > 0) {
            setLabels(res[0].labels);
            setEmissions(res[0].emissions);
          } else {
            setLabels([]);
            setEmissions([]);
          }
        }
        break;
    }
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: "Emisiones (kg CO₂e)",
        data: emissions,
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Reporte de Emisiones" },
    },
  };

  return (
    <>
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
                      Reportes de Emisiones
                    </MDTypography>
                  </MDBox>

                  <MDTypography variant="body2" color="text.secondary">
                    Visualiza todos los incidentes registrados donde se hayan
                    superado los límites permitidos de emisiones.
                  </MDTypography>
                </MDBox>
              </Grid>
            </Grid>

            <Grid container spacing={2} mt={2} justifyContent="center" pt={4}>
              <Grid size={{xs:12, sm: 12, md: "auto"}}>
                
                  <Stack direction={{ xs: "column", md:"row"}} spacing={2} sx={{width: {xs:"100%", md:"auto"}}}>
                    <Button
                    fullWidth={{ xs: true, md: false }}
                    size="large"
                      onClick={() => handleReportTypeChange("monthly")}
                      color={
                        selectedReport === "monthly" ? "primary" : "inherit"
                      }
                      variant={
                        selectedReport === "monthly" ? "contained" : "outlined"
                      }
                        sx={{
                        color:
                          selectedReport === "monthly"
                            ? "#fff !important"
                            : "inherit",
                      }}
                    >
                      Por Mes
                    </Button>

                    <Button
                    fullWidth={{ xs: true, md: false }}
                    size="large"
                      onClick={() => handleReportTypeChange("sources")}
                      color={
                        selectedReport === "sources" ? "primary" : "inherit"
                      }
                      variant={
                        selectedReport === "sources" ? "contained" : "outlined"
                      }
                        sx={{
                        color:
                          selectedReport === "sources"
                            ? "#fff !important"
                            : "inherit",
                      }}
                    >
                      Por factor de emisión
                    </Button>

                    <Button
                    fullWidth={{ xs: true, md: false }}
                    size="large"
                      onClick={() => handleReportTypeChange("rangeMonths")}
                      color={
                        selectedReport === "rangeMonths" ? "primary" : "inherit"
                      }
                      variant={
                        selectedReport === "rangeMonths"
                          ? "contained"
                          : "outlined"
                      }
                      sx={{
                        color:
                          selectedReport === "rangeMonths"
                            ? "#fff !important"
                            : "inherit",
                      }}
                    >
                      Rango de Meses
                    </Button>

                    <Button
                    fullWidth={{ xs: true, md: false }}
                    size="large"
                      onClick={() => handleReportTypeChange("rangeYears")}
                      color={
                        selectedReport === "rangeYears" ? "primary" : "inherit"
                      }
                      variant={
                        selectedReport === "rangeYears"
                          ? "contained"
                          : "outlined"
                      }
                      sx={{
                        color:
                          selectedReport === "rangeYears"
                            ? "#fff !important"
                            : "inherit",
                      }}
                    >
                      Rango de Años
                    </Button>
                  </Stack>
              </Grid>
            </Grid>
          </MDBox>

          <Box sx={{ mb: 5 }}>
            <Card elevation={3} sx={{ mb: 3 }}>
              <CardContent>
                {selectedReport === "" && (
                  <Box sx={{ textAlign: "center", py: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                      Seleccione un tipo de reporte para comenzar
                    </Typography>
                  </Box>
                )}

                {(selectedReport === "monthly" ||
                  selectedReport === "sources") && (
                  <Box>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ mb: 3, color: "#333" }}
                    >
                      Configuración del Reporte
                    </Typography>
                    <Grid container spacing={3} alignItems="center">
                      <Grid size={{ xs: 12, md: 6 }}>
                        <FormControl fullWidth variant="outlined">
                          <InputLabel id="yearInputLabel">Año</InputLabel>
                          <Select
                            labelId="yearInputLabel"
                            id="yearInput"
                            name="year"
                            label="Año"
                            value={formData.year}
                            onChange={handleInputChange}
                            sx={{ borderRadius: 2, height: 40 }}
                          >
                            <MenuItem value="">Seleccione</MenuItem>
                            {availableYears.map((y) => (
                              <MenuItem
                                key={y.yearlyConsumptionId}
                                value={y.year}
                              >
                                {y.year}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid size={{ xs: 12, md: 6 }}>
                        <MDButton
                          variant="contained"
                          size="large"
                          onClick={handleGenerate}
                          fullWidth
                          sx={{
                            py: 1.5,
                            borderRadius: 2,
                            fontWeight: "bold",
                            background: "#376D4F",
                            color: "#e6e6e6ff",
                            "&:hover": {
                              transform: "translateY(-2px)",
                              boxShadow: 3,
                              background: "#376D4F",
                            },
                          }}
                        >
                          Generar Reporte
                        </MDButton>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {selectedReport === "rangeMonths" && (
                  <Box>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ mb: 3, color: "#333" }}
                    >
                      Rango de Meses
                    </Typography>
                    <Grid container spacing={3} alignItems="center">
                      <Grid size={{ xs: 12, md: 3 }}>
                        <FormControl fullWidth variant="outlined">
                          <InputLabel id="yearInputLabel2">Año</InputLabel>
                          <Select
                            labelId="yearInputLabel2"
                            id="yearInput2"
                            label="Año"
                            name="year"
                            value={formData.year}
                            onChange={handleInputChange}
                            sx={{ borderRadius: 2, height: 40 }}
                          >
                            <MenuItem value="">Seleccione</MenuItem>
                            {availableYears.map((y) => (
                              <MenuItem
                                key={y.yearlyConsumptionId}
                                value={y.year}
                              >
                                {y.year}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid size={{ xs: 12, md: 3 }}>
                        <FormControl fullWidth variant="outlined">
                          <InputLabel id="initialMonthLabel">
                            Mes Inicial
                          </InputLabel>
                          <Select
                            labelId="initialMonthLabel"
                            id="initialMonth"
                            label="Mes Inicial"
                            name="initialMonth"
                            value={formData.initialMonth}
                            onChange={handleInputChange}
                            sx={{ borderRadius: 2, height: 40 }}
                          >
                            <MenuItem value="">Seleccione</MenuItem>
                            {meses.map((m) => (
                              <MenuItem key={m.value} value={m.value}>
                                {m.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid size={{ xs: 12, md: 3 }}>
                        <FormControl fullWidth variant="outlined">
                          <InputLabel id="finalMonthLabel">
                            Mes Final
                          </InputLabel>
                          <Select
                            labelId="finalMonthLabel"
                            name="finalMonth"
                            label="Mes Final"
                            value={formData.finalMonth}
                            onChange={handleInputChange}
                            sx={{ borderRadius: 2, height: 40 }}
                          >
                            <MenuItem value="">Seleccione</MenuItem>
                            {meses.map((m) => (
                              <MenuItem key={m.value} value={m.value}>
                                {m.label}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid size={{ xs: 12, md: 3 }}>
                        <MDButton
                          variant="contained"
                          size="large"
                          onClick={handleGenerate}
                          fullWidth
                          sx={{
                            py: 1.5,
                            borderRadius: 2,
                            fontWeight: "bold",
                            background: "#376D4F",
                            color: "#ffffff",
                            "&:hover": {
                              transform: "translateY(-2px)",
                              boxShadow: 3,
                              background: "#376D4F",
                            },
                          }}
                        >
                          Generar Reporte
                        </MDButton>
                      </Grid>
                    </Grid>
                  </Box>
                )}

                {selectedReport === "rangeYears" && (
                  <Box>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ mb: 3, color: "#333" }}
                    >
                      Rango de Años
                    </Typography>
                    <Grid container spacing={3} alignItems="center">
                      <Grid size={{ xs: 12, md: 4 }}>
                        <FormControl fullWidth variant="outlined">
                          <InputLabel id="initialYearLabel">
                            Año Inicial
                          </InputLabel>
                          <Select
                            labelId="initialYearLabel"
                            name="initialYear"
                            label="Año Inicial"
                            value={formData.initialYear}
                            onChange={handleInputChange}
                            sx={{ borderRadius: 2, height: 40 }}
                          >
                            <MenuItem value="">Seleccione</MenuItem>
                            {availableYears.map((y) => (
                              <MenuItem
                                key={y.yearlyConsumptionId}
                                value={y.year}
                              >
                                {y.year}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <FormControl fullWidth variant="outlined">
                          <InputLabel id="finalYearLabel">Año Final</InputLabel>
                          <Select
                            labelId="finalYearLabel"
                            name="finalYear"
                            label="Año Final"
                            value={formData.finalYear}
                            onChange={handleInputChange}
                            sx={{ borderRadius: 2, height: 40 }}
                          >
                            <MenuItem value="">Seleccione</MenuItem>
                            {availableYears.map((y) => (
                              <MenuItem
                                key={y.yearlyConsumptionId}
                                value={y.year}
                              >
                                {y.year}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid size={{ xs: 12, md: 4 }}>
                        <MDButton
                          variant="contained"
                          size="large"
                          onClick={handleGenerate}
                          fullWidth
                          sx={{
                            py: 1.5,
                            borderRadius: 2,
                            fontWeight: "bold",
                            background: "#376D4F",
                            color: "#ffffff",
                            "&:hover": {
                              transform: "translateY(-2px)",
                              boxShadow: 3,
                              background: "#376D4F",
                            },
                          }}
                        >
                          Generar Reporte
                        </MDButton>
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </CardContent>
            </Card>

            {labels.length > 0 ? (
              <Card elevation={3}>
                <CardContent>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ mb: 3, color: "#333" }}
                  >
                    Resultados del Reporte
                  </Typography>
                  <Box sx={{ mb: 3 }}>
                    <Bar
                      ref={chartRef}
                      data={chartData}
                      options={chartOptions}
                    />
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Stack direction="row" spacing={2} justifyContent="center">
                    <Button
                      variant="contained"
                      color="error"
                      size="large"
                      onClick={() =>
                        exportChartToPDF(chartRef, labels, emissions, getLabelTitle())
                      }
                      sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        fontWeight: "bold",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: 4,
                        },
                      }}
                    >
                      Descargar PDF
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      size="large"
                      onClick={() => exportToExcel(labels, emissions, getLabelTitle())}
                      sx={{
                        px: 4,
                        py: 1.5,
                        borderRadius: 2,
                        fontWeight: "bold",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: 4,
                        },
                      }}
                    >
                      Descargar Excel
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            ) : (
              selectedReport !== "" && (
                <Card elevation={3}>
                  <CardContent>
                    <Box sx={{ textAlign: "center", py: 4 }}>
                      <Typography variant="h6" color="text.secondary">
                        No hay datos para mostrar
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              )
            )}
          </Box>
        </MDBox>
        <Footer></Footer>
      </DashboardLayout>
    </>
  );
};
