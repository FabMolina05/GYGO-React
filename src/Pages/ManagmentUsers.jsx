import React, { useState, useEffect } from "react";

import { AddOutlined, EditOutlined } from "@mui/icons-material";
import {
  getUsers,
  getUsersbyRol,
  sendDefaultUserInvite,
} from "../API/ManagmentUsers";

import InviteModal from "../components/InviteModal";

import {
  Grid,
  Box,
  FormControl,
  MenuItem,
  Select,
  Typography,
  Stack,
  Button,
  CircularProgress,
  Modal,
  Switch,
  TextField,
  InputLabel,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import { Try } from "@mui/icons-material";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import Swal from "sweetalert2";

import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDButton from "components/MDButton";
import MDBadge from "components/MDBadge";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";

function ManagmentUsers() {
  //Hook para manejar el JSON de proyectos
  const [Users, setUsers] = useState([]);
  //Hook para manejar el JSON de proyectos filtro
  const [filter, setFilter] = useState("todos");
  const [selectedGroup, setSelectedGroup] = useState("todos");
  //Hook para manejar el JSON de proyectos por fechas

  const [openModal, setOpenModal] = useState(false);
  const [openModalProjects, setOpenModalProjects] = useState(false);

  //Hook para cuando un loading
  const [loading, setLoading] = useState(false);

  //Use State para el modal de agregar o editar proyectos
  const [modoEdicion, setModoEdicion] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [projectId, setProjectId] = useState(null);
  const [reductionUnit, setReductionUnit] = useState(null);
  const [error, setError] = useState("");
  const [editTaskId, setEditTaskId] = useState(null);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);

  const roleLabels = {
    Default: "Usuario nuevo",
    developer: "desarrollador",
    GroupAdmin: "Administrador de grupo",
    GroupUser: "Usuario de grupo",
  };

  const fetchUsers = async () => {
    try {
      if (filter === "todos") {
        const data = await getUsers();
        setUsers(data);
      } else {
        const data = await getUsersbyRol(rol);
        setUsers(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleInviteUser = async (email) => {
    try {
      setInviteLoading(true);
      setError("");

      const result = await sendDefaultUserInvite(email);

      if (result.success) {
        // Mostrar mensaje de éxito con SweetAlert
        Swal.fire({
          icon: "success",
          title: "Invitación Enviada",
          text: `Invitación enviada exitosamente a ${email}`,
          timer: 3000,
          showConfirmButton: false,
        });
        setInviteModalOpen(false);
        fetchUsers();
        return;
      } else {
        Swal.fire({
          icon: "error",
          title: "Error al enviar la invitación",
          text: result.message,
          showConfirmButton: false,
          timer: 3000,
        });
        setInviteModalOpen(false);
        fetchUsers();
        return;
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          err.message || "No se pudo enviar la invitación. Intenta nuevamente.",
        confirmButtonText: "Cerrar",
        customClass: {
          container: "swal-top",
        },
      });
    } finally {
      setInviteLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const gruposUnicos = [...new Set(Users.map((u) => u.nombregrupo))];

  const filteredUsers = Users.filter((user) => {
    const matchesSearch = user.nombregrupo
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesGroup =
      selectedGroup === "todos" || user.nombregrupo === selectedGroup;

    return matchesSearch && matchesGroup;
  });

  const columns = [
    { Header: "Nombre", accessor: "nombre", align: "left" },
    { Header: "Correo", accessor: "correo", align: "left" },
    {
      Header: "Grupo",
      accessor: "nombregrupo",
      align: "center",
    },
    { Header: "rol", accessor: "rol", align: "center" },

    // { Header: "Acciones", accessor: "action", align: "center" },
  ];

  const rows = filteredUsers.map((user) => ({
    nombre: (
      <MDTypography variant="caption" fontWeight="medium">
        {user.nombre}
      </MDTypography>
    ),
    correo: (
      <MDTypography variant="caption" color="text">
        {user.correo}
      </MDTypography>
    ),
    nombregrupo: (
      <MDTypography variant="caption" color="text">
        {user.nombregrupo}
      </MDTypography>
    ),
    rol: (
      <MDTypography variant="caption" color="text">
        {roleLabels[user.rol] || user.rol}
      </MDTypography>
    ),

    // action: (
    //   <Stack
    //     direction="row"
    //     spacing={1}
    //     justifyContent="center"
    //     alignItems="center"
    //   >
    //     <Tooltip title="Ver detalles">
    //       <IconButton size="small" >
    //         <VisibilityIcon fontSize="small" />
    //       </IconButton>
    //     </Tooltip>
    //     <Tooltip title="Editar">
    //       <IconButton
    //         size="small"
    //         color="info"
    //       >
    //         <EditIcon fontSize="small" />
    //       </IconButton>
    //     </Tooltip>
    //     <Tooltip title="Eliminar">
    //       <IconButton
    //         size="small"
    //         color="error"

    //       >
    //         <DeleteIcon fontSize="small" />
    //       </IconButton>
    //     </Tooltip>
    //   </Stack>
    // ),
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
              <Grid>
                <MDBox display="flex" flexDirection="column">
                  <MDBox display="flex" alignItems="center" gap={1}>
                    <MDTypography variant="h6">
                      Gestión de Usuarios
                    </MDTypography>
                  </MDBox>
                  <MDTypography variant="body2" color="text">
                    Visualiza usuarios existentes e invita nuevos miembros al
                    sistema.
                  </MDTypography>
                </MDBox>
              </Grid>
              <Grid>
                <MDButton
                  startIcon={<AddOutlined />}
                  onClick={() => {
                    setInviteModalOpen(true);
                  }}
                  variant="outlined"
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
                  Agregar Usuario
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
              {/* <Grid>
                <Grid container spacing={2}>
                  <Grid>
                    <TextField
                      fullWidth
                      variant="outlined"
                      placeholder="Buscar por nombre o grupo"
                      size="large"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      sx={{ width: "200px" }}
                    />
                  </Grid>
                </Grid>
              </Grid> */}
              <Grid>
                <FormControl fullWidth>
                  <InputLabel id="grupo-select-label">Filtrar por grupo</InputLabel>
                  <Select
                    labelId="grupo-select-label"
                    value={selectedGroup}
                    label="Grupo"
                    onChange={(e) => setSelectedGroup(e.target.value)}
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
                      Usuarios
                    </MDTypography>
                  </MDBox>
                  <MDBox
                    pt={3}
                    sx={{
                      p: 3,
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
      </MDBox>

      <InviteModal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        onInvite={handleInviteUser}
        loading={inviteLoading}
      />
      <Footer />
    </DashboardLayout>
  );
}
export default ManagmentUsers;
