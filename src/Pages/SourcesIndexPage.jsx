import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Grid,
  IconButton,
  Modal,
  Tooltip,
  Stack,
  TextField,
  Box,
  MenuItem,
  Select,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { AddOutlined, EditOutlined } from "@mui/icons-material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import DataTable from "examples/Tables/DataTable";
import Footer from "examples/Footer";
import Swal from "sweetalert2";
import { getSources, CreateSource, UpdateSource } from "../API/Source";
import { getSectors } from "../API/Sector";

export function SourcesIndexPage() {
  const [sources, setSources] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [sourceData, setSourceData] = useState({
    nombre: "",
    año: "",
    sector: "",
  });
  const [errors, setErrors] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadSources();
    loadSectors();
  }, []);

  const loadSources = async () => {
    setLoading(true);
    try {
      const data = await getSources();
      setSources(data);
    } catch (e) {
      console.error("Error cargando fuentes", e);
    } finally {
      setLoading(false);
    }
  };

  const loadSectors = async () => {
    try {
      const data = await getSectors();
      setSectors(data);
    } catch (e) {
      console.error("Error cargando sectores", e);
    }
  };

  const handleAddClick = () => {
    setModalOpen(true);
    setEditMode(false);
    setSourceData({ nombre: "", año: "", sector: "" });
    setErrors({});
  };

  const handleEditClick = (source) => {
    setEditMode(true);
    setEditId(source.fuenteId);
    setSourceData({
      nombre: source.nombre,
      año: source.año,
      sector: source.sector,
    });
    setModalOpen(true);
    setErrors({});
  };

  const handleSave = async () => {
    if (!sourceData.nombre.trim() || !sourceData.año || !sourceData.sector) {
      setErrors({
        nombre: !sourceData.nombre.trim() ? "Requerido" : "",
        año: !sourceData.año ? "Requerido" : "",
        sector: !sourceData.sector ? "Requerido" : "",
      });
      return;
    }
    try {
      if (editMode) {
        const result = await UpdateSource({ fuenteId: editId, ...sourceData });
        setModalOpen(false);
        if (result.success) {
          Swal.fire({
            icon: "success",
            title: "Fuente actualizada correctamente",
            showConfirmButton: false,
            timer: 2000,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: result.message,
            showConfirmButton: false,
            timer: 2000,
          });
        }
      } else {
        const result = await CreateSource(sourceData);
        setModalOpen(false);
        if (result.success) {
          Swal.fire({
            icon: "success",
            title: "Fuente creada correctamente",
            showConfirmButton: false,
            timer: 2000,
          });
        } else {
          Swal.fire({
            icon: "error",
            title: result.message,
            showConfirmButton: false,
            timer: 2000,
          });
        }
      }
      await loadSources();
    } catch (e) {
      console.error("Error guardando fuente", e);
      Swal.fire("Error", "No se pudo guardar la fuente", "error");
    }
  };

    const filtered = sources.filter((item) =>
    item.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { Header: "Nombre", accessor: "nombre", align: "left" },
    { Header: "Año", accessor: "año", align: "left" },
    { Header: "Sector", accessor: "sectorName", align: "left" },
    { Header: "Acciones", accessor: "actions", align: "center" },
  ];

  const rows = filtered.map((source) => ({
    nombre: (
      <MDTypography variant="caption" fontWeight="medium">
        {source.nombre}
      </MDTypography>
    ),
    año: (
      <MDTypography variant="caption" color="text">
        {source.año}
      </MDTypography>
    ),
    sectorName: (
      <MDTypography variant="caption" color="text">
        {source.sectorName}
      </MDTypography>
    ),
    actions: (
      <Stack direction="row" spacing={1} justifyContent="center">
        <Tooltip title="Editar Fuente">
          <IconButton
            size="small"
            onClick={() => handleEditClick(source)}
            sx={{ color: "#1976D2" }}
          >
            <EditOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    ),
  }));

  return (
    <DashboardLayout>
      <DashboardNavbar></DashboardNavbar>
      <MDBox py={3}>
        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid size={{ xs: 12 }}>
            <MDBox
              sx={{
                background: "#ffffff",
                mb: 3,
                borderRadius: 2,
                border: "1px solid #e5e7eb",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                padding: 3,
              }}
            >
              
                <Grid
                  container
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Grid>
                    <MDBox display="flex" flexDirection="column" gap={1}>
                      <MDBox display="flex" flexDirection="column">
                        <MDBox display="flex" alignItems="center" gap={1}>
                          <MDTypography variant="h6">Fuentes</MDTypography>
                        </MDBox>
                        <MDBox display="flex" alignItems="center" gap={1}>
                          <MDTypography variant="body2" color="text">
                            Gestiona las fuentes registradas en el sistema.
                          </MDTypography>
                        </MDBox>
                      </MDBox>
                    </MDBox>
                  </Grid>
                  <Grid>
                    <MDButton
                      variant="outlined"
                      onClick={handleAddClick}
                      startIcon={<AddOutlined />}
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
                      Agregar Fuente
                    </MDButton>
                  </Grid>
                </Grid>
             

             <Grid container spacing={2} mt={1}>
                <Grid xs={12} sm={6} md={4} lg={3}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Buscar por nombre de fuente de emsión.."
                    size="large"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ width: "230px", mb: 3 }}
                  />
                </Grid>
              </Grid>



            </MDBox>
          </Grid>

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
                  Registro de Fuentes
                </MDTypography>
              </MDBox>
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
                  loading={loading}
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
        <Footer />
      </MDBox>

      <Dialog
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <Box sx={{}}>
          <DialogTitle>
            <MDBox
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <MDTypography variant="h6" gutterBottom>
                {editMode ? "Editar Fuente" : "Agregar Fuente"}
              </MDTypography>
              <IconButton onClick={() => setModalOpen(false)}>
                <CloseIcon />
              </IconButton>
            </MDBox>
          </DialogTitle>
          <DialogContent dividers>
            <TextField
              fullWidth
              label="Nombre"
              value={sourceData.nombre}
              onChange={(e) => {
                setSourceData({ ...sourceData, nombre: e.target.value });
                setErrors((prev) => ({ ...prev, nombre: "" }));
              }}
              error={!!errors.nombre}
              helperText={errors.nombre}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Año"
              type="number"
              value={sourceData.año}
              onChange={(e) => {
                setSourceData({ ...sourceData, año: e.target.value });
                setErrors((prev) => ({ ...prev, año: "" }));
              }}
              error={!!errors.año}
              helperText={errors.año}
              sx={{ mb: 2 }}
            />
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              <Select
                fullWidth
                value={sourceData.sector}
                onChange={(e) => {
                  setSourceData({ ...sourceData, sector: e.target.value });
                  setErrors((prev) => ({
                    ...prev,
                    sector: "",
                  }));
                }}
                displayEmpty
                error={!!errors.sector}
                sx={{ mb: 2, height: 40 }}
              >
                <MenuItem value="">Seleccione un sector</MenuItem>
                {sectors.map((s) => (
                  <MenuItem key={s.sectorId} value={s.sectorId}>
                    {s.nombre}
                  </MenuItem>
                ))}
              </Select>
            )}
          </DialogContent>

          <DialogActions>
            <MDButton
              variant="gradient"
              color="success"
              onClick={handleSave}
              fullWidth
            >
              Guardar
            </MDButton>
          </DialogActions>
        </Box>
      </Dialog>
    </DashboardLayout>
  );
}
