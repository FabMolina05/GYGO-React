import React, { useState, useEffect } from "react";
import { getReportCompanies } from "../../API/Reports";
import { GetServices } from "../../API/Reports";
import { ReportCompaniesPDF } from "../../utils/ReportCompaniesPDF";
import { DataGrid } from "@mui/x-data-grid";
import dayjs from "dayjs";
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from "@mui/material";

import { RemoveRedEyeOutlined } from "@mui/icons-material";

import {
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Business as BusinessIcon,
  Email as EmailIcon,
  CalendarToday as CalendarTodayIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
} from "@mui/icons-material";

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

export function ReportCompanies() {
  const [ReportCompaniesData, SetReportCompaniesData] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [ServicesData, setServicesData] = useState([]);
  const [statusFilter, setStatusFilter] = useState("todos");
  const [serviceFilter, setServiceFilter] = useState("todos");
  const [openModal, setOpenModal] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  
  const fetchReportCompanies = async () => {
    try {
      const statusParam =
        statusFilter === "todos" ? null : statusFilter === "true";
      const idServiceParam =
        serviceFilter !== "todos" ? parseInt(serviceFilter) : null;
      const data = await getReportCompanies({
        status: statusParam,
        idService: idServiceParam,
      });

      SetReportCompaniesData(data);
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
    fetchReportCompanies();
    fetchServices();
  }, [statusFilter, serviceFilter]);

  const CreatePDF = async () => {
    try {
      ReportCompaniesPDF(ReportCompaniesData);
    } catch (error) {
      console.log("Error a crear el pdf");
    } finally {
    }
  };
  //Acciones para el modal
  const handleOpenModal = (group) => {
    setSelectedCompany(group);
    setOpenModal(true);
  };
  const handleCloseModal = async () => {
    setOpenModal(false);
    setSelectedCompany(null);
  };
  //Fin de acciones del modal

  const columns = [
    { Header: "Nombre de la Empresa", accessor: "nombre", align: "left" },
    {
      Header: "Fecha de incorporación",
      accessor: "fechaCreación",
      align: "left",
    },
    { Header: "Servicio", accessor: "serviceName", align: "center" },
    { Header: "Cantidad Usuarios", accessor: "numberOfUsers", align: "center" },
    { Header: "Estado", accessor: "estatus", align: "center" },

    { Header: "Acciones", accessor: "action", align: "center" },
  ];

  const rows = ReportCompaniesData.map((companies) => ({
    nombre: (
      <MDTypography variant="caption" fontWeight="medium">
        {companies.nombre}
      </MDTypography>
    ),
    fechaCreación: (
      <MDTypography variant="caption" color="text">
        {dayjs(companies.fechaCreación).format("DD/MM/YYYY")}
      </MDTypography>
    ),

    serviceName: (
      <MDTypography variant="caption" color="text">
        {companies.serviceName}
      </MDTypography>
    ),
    numberOfUsers: (
      <MDTypography variant="caption" color="text">
        {companies.numberOfUsers}
      </MDTypography>
    ),
    estatus: (
      <MDTypography variant="caption" color="text">
        {companies.estatus ? "Activo" : "Inactivo"}
      </MDTypography>
    ),
    action: (
      <Stack
        direction="row"
        spacing={1}
        justifyContent="center"
        alignItems="center"
      >
        <Tooltip title="Ver detalles">
          <IconButton
            size="small"
            sx={{ color: "#6c757d" }}
            onClick={() => handleOpenModal(companies)}
          >
            <RemoveRedEyeOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    ),
  }));

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
                      Reportes de Empresas
                    </MDTypography>
                  </MDBox>
                  <MDTypography variant="body2" color="text">
                    Visualiza los datos y detalles de cada empresa dentro del
                    sistema.
                  </MDTypography>
                </MDBox>
              </Grid>
              <Grid item>
                <MDButton
                  variant="outlined"
                  onClick={CreatePDF}
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
                  Descargar Reporte
                </MDButton>
              </Grid>
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
                    <Grid container spacing={2}>
                      <Grid item sx={{ pt: 3 }}>
                        <FormControl size="medium" sx={{ width: 180 }}>
                          <InputLabel id="Estado-label">Estado</InputLabel>
                          <Select
                            labelId="Estado-label"
                            name="estado"
                            label="Estado"
                            fullWidth
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            sx={{ height: 40 }}
                          >
                            <MenuItem value="todos">Todos</MenuItem>
                            <MenuItem value="true">Activos</MenuItem>
                            <MenuItem value="false">Inactivos</MenuItem>
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>

                  {/* Filtrar por servicios */}
                  <Grid item sx={{ pt: 3 }}>
                    <Grid container spacing={2}>
                      <Grid item>
                        <FormControl size="medium" sx={{ width: 180 }}>
                          <InputLabel id="Servicios-label">
                            Servicios
                          </InputLabel>

                          <Select
                            labelId="Servicios-label"
                            name="Servicios"
                            label="Servicios"
                            fullWidth
                            value={serviceFilter}
                            onChange={(e) => setServiceFilter(e.target.value)}
                            sx={{ height: 40 }}
                          >
                            <MenuItem value="todos">Todos</MenuItem>
                            {ServicesData.map((service) => (
                              <MenuItem
                                key={service.serviceId}
                                value={service.serviceId}
                              >
                                {service.serviceName}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </MDBox>

          <Grid size={{ xs: 10 }} mt={10}>
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
                  Empresas
                </MDTypography>
              </MDBox>
              <MDBox>
                <MDBox>
                  <Grid container spacing={5}>
                    <Grid size={{ xs: 12 }}>
                      <Card>
                        <MDBox
                          pt={3}
                          sx={{
                            p: 4,
                            textAlign: "center",
                            width: "100%",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <DataTable
                            table={{ columns, rows }}
                            isSorted={false}
                            entriesPerPage={false}
                            showTotalEntries={true}
                            noEndBorder
                          />
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

      {/* Modal para ver los detalles de la empresa */}

      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="xl" // Tamaños predefinidos: xs, sm, md, lg, xl
        fullWidth // Hace que el dialog ocupe todo el ancho permitido por maxWidth
        PaperProps={{
          sx: {
            borderRadius: 2, // Solo ajusta el borde si quieres
          },
        }}
      >
        <DialogTitle>
          <MDBox
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <MDTypography variant="h5">Detalles de la empresa</MDTypography>
            <IconButton onClick={handleCloseModal}>
              <CloseIcon />
            </IconButton>
          </MDBox>
        </DialogTitle>

        <DialogContent dividers sx={{ py: 4 }}>
          <Grid container spacing={2.5} sx={{ pl: 3 }}>
            {/* Primera fila - 2 columnas */}
            {[
              [
                "Nombre",
                selectedCompany?.nombre || "-",
                BusinessIcon,
                "info.main",
                "info.lighter",
              ],
              [
                "Correo",
                selectedCompany?.correo || "-",
                EmailIcon,
                "primary.main",
                "primary.lighter",
              ],
            ].map(([label, value, Icon, color, bgColor], index) => (
              <Grid item xs={12} sm={6} key={index}>
                <MDBox
                  sx={{
                    border: 1,
                    borderColor: "grey.300",
                    borderRadius: 2,
                    p: 2.5,
                    height: "100%",
                    transition: "all 0.2s",
                    "&:hover": {
                      borderColor: color,
                      boxShadow: 1,
                    },
                  }}
                >
                  <MDBox display="flex" alignItems="center" gap={2}>
                    <MDBox
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        bgcolor: bgColor,
                        flexShrink: 0,
                      }}
                    >
                      <Icon sx={{ color: color, fontSize: 28 }} />
                    </MDBox>
                    <MDBox sx={{ minWidth: 0, flex: 1 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight="medium"
                        sx={{
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                          display: "block",
                        }}
                      >
                        {label}
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight="medium"
                        color="text.primary"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          mt: 0.5,
                        }}
                      >
                        {value}
                      </Typography>
                    </MDBox>
                  </MDBox>
                </MDBox>
              </Grid>
            ))}

            {/* Segunda fila - 2 columnas */}
            {[
              [
                "Fecha de incorporación",
                selectedCompany?.fechaCreación
                  ? new Date(selectedCompany.fechaCreación).toLocaleDateString(
                      "es-CR",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }
                    )
                  : "-",
                CalendarTodayIcon,
                "warning.main",
                "warning.lighter",
              ],
              [
                "Servicio asociado",
                selectedCompany?.serviceName || "-",
                SettingsIcon,
                "secondary.main",
                "secondary.lighter",
              ],
            ].map(([label, value, Icon, color, bgColor], index) => (
              <Grid item xs={12} sm={6} key={index}>
                <MDBox
                  sx={{
                    border: 1,
                    borderColor: "grey.300",
                    borderRadius: 2,
                    p: 2.5,
                    height: "100%",
                    transition: "all 0.2s",
                    "&:hover": {
                      borderColor: color,
                      boxShadow: 1,
                    },
                  }}
                >
                  <MDBox display="flex" alignItems="center" gap={2}>
                    <MDBox
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        bgcolor: bgColor,
                        flexShrink: 0,
                      }}
                    >
                      <Icon sx={{ color: color, fontSize: 28 }} />
                    </MDBox>
                    <MDBox sx={{ minWidth: 0, flex: 1 }}>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight="medium"
                        sx={{
                          textTransform: "uppercase",
                          letterSpacing: 0.5,
                          display: "block",
                        }}
                      >
                        {label}
                      </Typography>
                      <Typography
                        variant="body1"
                        fontWeight="medium"
                        color="text.primary"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          mt: 0.5,
                        }}
                      >
                        {value}
                      </Typography>
                    </MDBox>
                  </MDBox>
                </MDBox>
              </Grid>
            ))}

            {/* Tercera fila - Cantidad de usuarios (centrado) */}
            <Grid item xs={12} sm={3}></Grid>
            <Grid item xs={12} sm={6}>
              <MDBox
                sx={{
                  border: 1,
                  borderColor: "grey.300",
                  borderRadius: 2,
                  p: 2.5,
                  height: "100%",
                  transition: "all 0.2s",
                  "&:hover": {
                    borderColor: "success.main",
                    boxShadow: 1,
                  },
                }}
              >
                <MDBox display="flex" alignItems="center" gap={2}>
                  <MDBox
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: 56,
                      height: 56,
                      borderRadius: 2,
                      bgcolor: "success.lighter",
                      flexShrink: 0,
                    }}
                  >
                    <PeopleIcon sx={{ color: "success.main", fontSize: 28 }} />
                  </MDBox>
                  <MDBox sx={{ minWidth: 0, flex: 1 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      fontWeight="medium"
                      sx={{
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                        display: "block",
                      }}
                    >
                      Cantidad de usuarios
                    </Typography>
                    <Typography
                      variant="body1"
                      fontWeight="medium"
                      color="text.primary"
                      sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        mt: 0.5,
                      }}
                    >
                      {selectedCompany?.numberOfUsers || "-"}
                    </Typography>
                  </MDBox>
                </MDBox>
              </MDBox>
            </Grid>
            <Grid item xs={12} sm={3}></Grid>

            {/* Estado destacado - ancho completo */}
            <Grid item xs={12}>
              <MDBox
                sx={{
                  border: 2,
                  borderColor: selectedCompany?.estatus
                    ? "success.light"
                    : "error.light",
                  bgcolor: selectedCompany?.estatus
                    ? "success.lighter"
                    : "error.lighter",
                  borderRadius: 2,
                  p: 2.5,
                  mt: 1,
                }}
              >
                <MDBox
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <MDBox display="flex" alignItems="center" gap={1.5}>
                    {/* Ícono de estado */}
                    {selectedCompany?.estatus ? (
                      <CheckCircleIcon
                        sx={{ color: "success.main", fontSize: 32 }}
                      />
                    ) : (
                      <CancelIcon sx={{ color: "error.main", fontSize: 32 }} />
                    )}

                    {/* Texto y chip uno debajo del otro */}
                    <MDBox
                      display="flex"
                      flexDirection="column"
                      alignItems="flex-start"
                    >
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        color="text.primary"
                      >
                        Estado de la Empresa
                      </Typography>

                      <Chip
                        label={selectedCompany?.estatus ? "Activo" : "Inactivo"}
                        color={selectedCompany?.estatus ? "success" : "error"}
                        size="small"
                        sx={{
                          fontWeight: "bold",
                          fontSize: "0.75rem",
                          mt: 0.5,
                          px: 1.5,
                        }}
                      />
                    </MDBox>
                  </MDBox>
                </MDBox>
              </MDBox>
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <MDButton variant="outlined" color="error" onClick={handleCloseModal}>
            Cerrar
          </MDButton>
        </DialogActions>
      </Dialog>

      {/* Termina Modal para ver los detalles de la empresa */}
    </DashboardLayout>
  );
}
