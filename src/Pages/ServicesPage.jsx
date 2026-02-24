import React, { useEffect, useState } from "react";
import { TextField, Grid, Box, Card, IconButton,FormControl,InputLabel,Select,MenuItem } from "@mui/material";
import Footer from "examples/Footer";
import DashboardLayout from "../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../examples/Navbars/DashboardNavbar";
import MDBox from "../components/MDBox";
import MDTypography from "../components/MDTypography";
import DataTable from "../examples/Tables/DataTable";
import { GetServices } from "../API/Reports";
import { useAuth } from "../context/AuthContext";
import BlockOutlined from "@mui/icons-material/DisabledByDefaultOutlined";
import SuperAdminCancelModal from "../components/SuperAdminCancelModal";
import { cancelAdminSubscription } from "../API/Subscription";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import Tooltip from "@mui/material/Tooltip";

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tableRows, setTableRows] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const { userId, role } = useAuth();
  const [selectedGroupFilter, setSelectedGroupFilter] = useState("todos");

  useEffect(() => {
    const fetchServices = async () => {
      const data = await GetServices();
      const flattenedRows = data.flatMap((service) =>
        service.grupos.map((grupo) => ({
          serviceName: service.serviceName,
          serviceId: service.serviceId,
          groupName: grupo.nombre,
          groupId: grupo.grupoId,
          actions: grupo.grupoId,
        }))
      );
      setServices(flattenedRows);
      setTableRows(flattenedRows);
    };
    fetchServices();
  }, []);

  useEffect(() => {
    let filtered = services;

    if (selectedGroupFilter !== "todos") {
      filtered = filtered.filter(
        (item) => item.groupName === selectedGroupFilter
      );
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.serviceName.toLowerCase().includes(term) ||
          item.groupName.toLowerCase().includes(term)
      );
    }

    setTableRows(filtered);
  }, [searchTerm, selectedGroupFilter, services]);

  const gruposUnicos = [...new Set(services.map((s) => s.groupName))];

  // Update columns to include actions
  const columns = [
    { Header: "Servicio", accessor: "serviceName" },
    { Header: "Grupo", accessor: "groupName" },
    {
      Header: "Acciones",
      accessor: "actions",
      Cell: ({ value }) =>
        role === "SA" && ( // Only show for super admin
          <Tooltip title="Cancelar grupo">
            <IconButton
              color="error"
              onClick={() => {
                setSelectedGroup(value);
                setModalOpen(true);
              }}
              size="small"
            >
              <BlockOutlined fontSize="medium" />
            </IconButton>
          </Tooltip>
        ),
      align: "center",
    },
  ];

  const handleCancelConfirm = async (groupId, reason) => {
    try {
      await cancelAdminSubscription(groupId, reason);

      const data = await GetServices();
      const flattenedRows = data.flatMap((service) =>
        service.grupos.map((grupo) => ({
          serviceName: service.serviceName,
          serviceId: service.serviceId,
          groupName: grupo.nombre,
          groupId: grupo.grupoId,
          actions: grupo.grupoId,
        }))
      );
      setServices(flattenedRows);
      setTableRows(flattenedRows);

      return true;
    } catch (error) {
      console.error("Error al cancelar:", error);
      throw error;
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />

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
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              spacing={2}
            >
              <Grid item>
                <MDBox display="flex" flexDirection="column">
                  <MDBox display="flex" alignItems="center" gap={1}>
                    <MDTypography variant="h6">
                      Empresas Registradas
                    </MDTypography>
                  </MDBox>
                  <MDTypography variant="body2" color="text">
                    Gestiona y visualiza las empresas que utilizan el sistema.
                  </MDTypography>
                </MDBox>
              </Grid>

              <Grid></Grid>
            </Grid>

            <Grid container spacing={2} mt={1}>
              {/* <Grid xs={12} sm={6} md={4} lg={3}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Buscar por nombre de empresa..."
                  size="large"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{ width: "200px", mb: 3 }}
                />
              </Grid> */}

             <Grid sx={{ pt: 1 }}>
                <FormControl fullWidth>
                  <InputLabel id="group-filter-label">Filtrar por grupo</InputLabel>
                  <Select
                    labelId="group-filter-label"
                    value={selectedGroupFilter}
                    label="Filtrar por grupo"
                    onChange={(e) => setSelectedGroupFilter(e.target.value)}
                    sx={{ width: 200, height: 40 }}
                  >
                    <MenuItem value="todos">Todos</MenuItem>
                    {gruposUnicos.map((g, i) => (
                      <MenuItem key={i} value={g}>
                        {g}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </MDBox>

          <MDBox pt={6} pb={3}>
            <Grid container spacing={6}>
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
                      Servicios
                    </MDTypography>
                  </MDBox>
                  <MDBox pt={3}>
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
                        table={{ columns, rows: tableRows }}
                        isSorted={false}
                        entriesPerPage={false}
                        showTotalEntries={true}
                        noEndBorder
                      />
                    </MDBox>
                  </MDBox>
                </Card>
              </Grid>
            </Grid>
          </MDBox>
        </MDBox>

        <Footer />
      </MDBox>

      <SuperAdminCancelModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleCancelConfirm}
        groupId={selectedGroup}
      />
    </DashboardLayout>
  );
}
