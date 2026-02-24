import { useState, useEffect } from "react"
import "../styles/MonthlyHistory.css";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  Grid,
  Avatar,
  CircularProgress,
  Alert,
  Tooltip,
} from "@mui/material";
import {
  ArrowBackOutlined,
  History as HistoryIcon,
  Edit as EditIcon,
  TrendingUp as TrendingUpIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { getMonthlyHistory } from "../API/Consumptions/MonthlyHistory";
import DataTable from "examples/Tables/DataTable";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";



export function MonthlyHistoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [historialCambios, setHistorialCambios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistorialCambios = async () => {
      setLoading(true);
      try {
        const response = await getMonthlyHistory(id);
        setHistorialCambios(response);
      } catch (error) {
        console.error("Error al cargar historial de cambios:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistorialCambios();
  }, [id]);

  const formatDateTime = (dateString) =>
    new Date(dateString).toLocaleString("es-MX", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const traducirTipoCambio = (tipo) => {
  switch (tipo) {
    case "Create":
      return "Creación";
    case "Update":
      return "Actualización";
    default:
      return tipo;
  }
};

  const getTipoCambioIcon = (tipo) => {
    const tipoTraducido = traducirTipoCambio(tipo);
    switch (tipoTraducido) {
      case "Creación":
        return <TrendingUpIcon fontSize="small" />;
      case "Actualización":
        return <EditIcon fontSize="small" />;
      default:
        return <HistoryIcon fontSize="small" />;
    }
  };

  const calcularEstadisticas = () => {
    const tipos = historialCambios.reduce((acc, c) => {
      acc[c.tipo] = (acc[c.tipo] || 0) + 1;
      return acc;
    }, {});
    const tipoMasComun = Object.keys(tipos).reduce((a, b) => (tipos[a] > tipos[b] ? a : b), "");
    return {
      totalCambios: historialCambios.length,
      tipoMasComun,
    };
  };

  const estadisticas = calcularEstadisticas();

  const columns = [
    { Header: "Usuario", accessor: "usuario", align: "left" },
    { Header: "Tipo de Cambio", accessor: "tipo", align: "center" },
    { Header: "Descripción", accessor: "descripcion", align: "left" },
    { Header: "Fecha", accessor: "fecha", align: "center" },
  ];

  const rows = historialCambios.map((c) => ({
    usuario: (
      <MDTypography variant="caption" color="text">
        <PersonIcon fontSize="small" sx={{ mr: 1 }} /> {c.username}
      </MDTypography>
    ),
    tipo: (
      <MDTypography variant="caption" color="text">
        {getTipoCambioIcon(c.tipo)} {traducirTipoCambio(c.tipo)}
      </MDTypography>
    ),
    descripcion: (
      <MDTypography variant="caption" color="text">
        {c.cambio}
      </MDTypography>
    ),
    fecha: (
      <MDTypography variant="caption" color="text">
        {formatDateTime(c.date)}
      </MDTypography>
    ),
  }));

  return (
    <DashboardLayout>
      <DashboardNavbar></DashboardNavbar>
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid size={{xs:12}}>
            <Card sx={{ p: 3 }}>
              <Grid container alignItems="center" spacing={2}>
                <Grid size={{xs: 12, md: 1}}>
                  <MDButton
                    variant="text"
                    color="black"
                    startIcon={<ArrowBackOutlined />}
                    onClick={() => navigate(-1)}
                    sx={{ minWidth: "100%" }}
                  >
                    Volver
                  </MDButton>
                </Grid>
                <Grid size={{xs:12, md:10}}>
                  <MDTypography variant="h5" fontWeight="bold">
                    Historial de Cambios
                  </MDTypography>
                  <MDTypography variant="body2" color="text">
                    Registro de cambios para el consumo mensual
                  </MDTypography>
                </Grid>
              </Grid>
            </Card>
          </Grid>

          <Grid size={{xs:12, md:6}}>
            <Card sx={{ p: 3 }}>
              <MDTypography variant="subtitle2" color="text">Total Cambios</MDTypography>
              <MDTypography variant="h6" fontWeight="bold">
                {estadisticas.totalCambios}
              </MDTypography>
            </Card>
          </Grid>

          <Grid size={{xs:12, md:6}}>
            <Card sx={{ p: 3 }}>
              <MDTypography variant="subtitle2" color="text">Tipo Más Común</MDTypography>
              <MDTypography variant="h6" fontWeight="bold">
                {getTipoCambioIcon(estadisticas.tipoMasComun)} {traducirTipoCambio(estadisticas.tipoMasComun) || "N/A"}
              </MDTypography>
            </Card>
          </Grid>

          <Grid size={12}>
            <Card sx={{ p: 3 }}>
              <MDTypography variant="h6" fontWeight="bold" gutterBottom>
                Registro de Actividades
              </MDTypography>
              {loading ? (
                <MDBox display="flex" justifyContent="center" alignItems="center" py={5}>
                  <CircularProgress />
                </MDBox>
              ) : historialCambios.length === 0 ? (
                <MDBox textAlign="center" py={5}>
                  <HistoryIcon sx={{ fontSize: 48, mb: 1 }} />
                  <MDTypography variant="h6">No hay historial disponible</MDTypography>
                  <MDTypography variant="body2" color="text">
                    No se encontraron registros de cambios para este elemento.
                  </MDTypography>
                </MDBox>
              ) : (
                <DataTable
                  table={{ columns, rows }}
                  isSorted={false}
                  entriesPerPage={false}
                  showTotalEntries={true}
                  noEndBorder
                />
              )}
            </Card>
          </Grid>
        </Grid>
        <Footer />
      </MDBox>
    </DashboardLayout>
  );
}