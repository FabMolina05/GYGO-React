import { useState, useEffect } from "react";
import UserTable from "../components/UserAdminTable";
import InviteModal from "../components/InviteModal";
import CloseIcon from "@mui/icons-material/Close";
import { Users, Trash2 } from "lucide-react";
import {
  getGroupUsers,
  sendUserInvite,
  removeUserFromGroup,
  fetchGroupId,
} from "../API/Admin";
import {
  getDeleteUsers,
  EmailDeleteUsers,
  getCountUserDelete,
} from "../API/DeleteLogs";
import BoltIcon from "@mui/icons-material/Bolt";
import "../App.css";
import "../styles/AdminDashboard.css";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDButton from "components/MDButton";
import MDBadge from "components/MDBadge";

import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import { DeleteOutlineOutlined } from "@mui/icons-material";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
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
  Card,
} from "@mui/material";

import { refreshLogin } from "../API/Auth";
import FavoriteIcon from "@mui/icons-material/Favorite";
const AdminUserDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [historyRows, setHistoryRows] = useState([]);
  const [deleteCount, setDeleteCount] = useState(0);
  const [openModalDeleteUser, setOpenModalDeleteUser] = useState(null);

  //var GROUP_ID = fetchGroupId();

  useEffect(() => {
    fetchUsersEmail();
    fetchCountUserDelete();
  }, []); // Solo se ejecuta una vez al montar

  useEffect(() => {
    if (showHistory) {
      fetchDeleteLogs();
    } else {
      fetchUsers();
    }
  }, [showHistory]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const userData = await getGroupUsers();

      setUsers(userData);
    } catch (err) {
      setError("Failed to load users. Please try again.");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  //#region DeleteLogs
  const fetchUsersEmail = async () => {
    try {
      const userData = await EmailDeleteUsers();
    } catch (err) {
      setError("Failed to load users. Please try again.");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCountUserDelete = async () => {
    try {
      const count = await getCountUserDelete();
      setDeleteCount(count);
    } catch (err) {
      setError("Failed to load users. Please try again.");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDeleteLogs = async () => {
    try {
      const logs = await getDeleteUsers();
      setDeleteCount(logs.length);
      const rows = logs.map((log) => ({
        userName: log.userName,
        email: log.email,
        deletedAt: new Date(log.deletedAt).toLocaleDateString(),
        deletedByAdminName: log.deletedByAdminName || "N/A",
      }));
      setHistoryRows(rows);
    } catch (error) {
      console.error("Error loading delete history", error);
    }
  };
  //#endregion

  const handleInviteUser = async (email) => {
    try {
      setInviteLoading(true);
      setError("");

      const result = await sendUserInvite(email);
 


      if (result.success) {
        // Mostrar mensaje de éxito con SweetAlert
        Swal.fire({
          icon: "success",
          title: "invitación enviada",
          text: `Invitación enviada exitosamente a ${email}`,
          timer: 3000,
          showConfirmButton: false,
        });
        setInviteModalOpen(false);

        fetchUsers();
      } else {
        setInviteModalOpen(false);
        Swal.fire({
          icon: "error",
          title: "No se pudo enviar la invitación",
          text: result.message ,
          showConfirmButton: false,
          timer: 3000,
        });
        fetchUsers();
      }
    } catch (err) {
      setError(err.message || "Failed to send invitation. Please try again.");
      console.error("Error sending invite:", err);
    } finally {
      setInviteLoading(false);
    }
  };

  const handleDelete = (userId) => {
    
    setOpenModalDeleteUser(userId);
  };

  const closeModalDeleteUser = () => {
    fetchUsers();
    setOpenModalDeleteUser(null);
  };

  const handleRemoveUser = async (userId) => {
    try {
      setError("");

      setOpenModalDeleteUser(null);

      await removeUserFromGroup(userId);

      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
      Swal.fire({
        icon: "success",
        title: "Usuario eliminado",
        text: "¡El usuario fue eliminado exitosamente!",
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error al eliminar usuario",
        text: "No se pudo eliminar el usuario. Por favor, inténtalo de nuevo.",
        timer: 3000,
        showConfirmButton: false,
      });

      fetchUsers();
    }
  };

  const clearError = () => setError("");

  const columns = [
    { Header: "Nombre", accessor: "username", align: "left" },
    { Header: "Correo", accessor: "email", align: "left" },
    {
      Header: "Rol",
      accessor: "role",
      align: "center",
    },
    // { Header: "Estado", accessor: "Estado", align: "center" },
    { Header: "Acciones", accessor: "action", align: "center" },
  ];

  const rows = users.map((user) => ({
    username: (
      <MDTypography variant="caption" fontWeight="medium">
        {user.username}
      </MDTypography>
    ),
    email: (
      <MDTypography variant="caption" color="text">
        {user.email}
      </MDTypography>
    ),
    role: (
      <MDTypography variant="caption" color="text">
        {"Miembro"}
      </MDTypography>
    ),

    action: (
      <Stack
        direction="row"
        spacing={1}
        justifyContent="center"
        alignItems="center"
      >
        <Tooltip title="Eliminar">
          <IconButton
            size="small"
            color="error"
            onClick={() => handleDelete(user.id, user.name)}
          >
            <DeleteOutlineOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    ),
  }));

  const historyDeleteUsers = [
    { Header: "Usuario Eliminado", accessor: "userName", align: "left" },
    { Header: "Correo", accessor: "email", align: "left" },
    { Header: "Fecha Eliminado", accessor: "deletedAt", align: "center" },
    { Header: "Administrador", accessor: "deletedByAdminName", align: "left" },
  ];

  return (
    <DashboardLayout>
      <DashboardNavbar></DashboardNavbar>
      <MDBox py={3}>
        <MDBox mb={2}>
           <MDBox
      sx={{
        borderRadius: 2,
        p: { xs: 2, md: 3 },
        mb: 2,
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Grid
        container
        alignItems={{ xs: "flex-start", md: "center" }}
        justifyContent="space-between"
        spacing={2}
        sx={{ flexDirection: { xs: "column", md: "row" }, gap: { xs: 2, md: 0 } }}
      >
        <Grid item xs={12} md="auto">
          <MDBox display="flex" flexDirection="column">
            <MDBox display="flex" alignItems="center" gap={1}>
              <MDTypography variant="h6">Usuarios</MDTypography>
            </MDBox>
            <MDTypography variant="body2" color="text">
              Visualiza los usuarios activos y revisa el historial de eliminaciones.
            </MDTypography>
          </MDBox>
        </Grid>

        <Grid item xs={12} md="auto">
          <MDBox display="flex" gap={1} sx={{ flexDirection: { xs: "column", md: "row" } }}>
            <MDButton
              variant="outlined"
              fullWidth={{ xs: true, md: false }}
              sx={{
                borderColor: "#bfdcff",
                color: "#1479fc",
                "&:hover": {
                  backgroundColor: "#dbe6f5ff",
                  borderColor: "#1479fc",
                  color: "#065fd4ff",
                },
              }}
              onClick={() => setShowHistory(!showHistory)}
            >
              {showHistory ? "Usuarios" : "Historial de Eliminaciones"}
            </MDButton>

            <MDButton
              variant="outlined"
              fullWidth={{ xs: true, md: false }}
              sx={{
                  borderColor: "#4CAF50",
                  color: "#4CAF50",
                  "&:hover": {
                    backgroundColor: "#E8F5E9",
                    borderColor: "#43A047",
                    color: "#388E3C",
                  },
                }}
              onClick={() => {
                setShowHistory(false)
                setInviteModalOpen(true)
              }}
            >
              + Invitar
            </MDButton>
          </MDBox>
        </Grid>
      </Grid>

      <MDBox
        display="flex"
        gap={2}
        sx={{
          mt: 3,
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* Card 1: Usuarios Activos */}
        <MDBox
          sx={{
            flex: 1,
            p: { xs: 2, md: 2.5 },
            borderRadius: 2,
            border: "1px solid #e5e7eb",
            backgroundColor: "#ffffff",
            transition: "all 0.3s ease",
            "&:hover": {
              border: "1px solid #80D8FF",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
              transform: "translateY(-2px)",
            },
          }}
        >
          <MDBox display="flex" alignItems="center" gap={2} sx={{ flexDirection: { xs: "row", md: "row" } }}>
            <MDBox
              sx={{
                width: { xs: 40, md: 48 },
                height: { xs: 40, md: 48 },
                borderRadius: 2,
                backgroundColor: "#EAFBF1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Users size={24} color="#4CAF50" />
            </MDBox>

            <MDBox>
              <MDTypography
                variant="caption"
                sx={{
                  color: "#9CA3AF",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  fontWeight: 600,
                  fontSize: { xs: "0.65rem", md: "0.75rem" },
                }}
              >
                Usuarios Activos
              </MDTypography>

              <MDTypography
                variant="h3"
                fontWeight="bold"
                sx={{
                  color: "#111827",
                  lineHeight: 1.1,
                  mt: 0.25,
                  fontSize: { xs: "1.75rem", md: "2.5rem" },
                }}
              >
                {users.length}
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>

        {/* Card 2: Usuarios Eliminados */}
        <MDBox
          sx={{
            flex: 1,
            p: { xs: 2, md: 2.5 },
            borderRadius: 2,
            border: "1px solid #e5e7eb",
            backgroundColor: "#ffffff",
            transition: "all 0.3s ease",
            "&:hover": {
              border: "1px solid #80D8FF",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
              transform: "translateY(-2px)",
            },
          }}
        >
          <MDBox display="flex" alignItems="center" gap={2} sx={{ flexDirection: { xs: "row", md: "row" } }}>
            <MDBox
              sx={{
                width: { xs: 40, md: 48 },
                height: { xs: 40, md: 48 },
                borderRadius: 2,
                backgroundColor: "#FDECEC",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Trash2 size={24} color="#EF5350" />
            </MDBox>

            <MDBox>
              <MDTypography
                variant="caption"
                sx={{
                  color: "#9CA3AF",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  fontWeight: 600,
                  fontSize: { xs: "0.65rem", md: "0.75rem" },
                }}
              >
                Usuarios Eliminados
              </MDTypography>

              <MDTypography
                variant="h3"
                fontWeight="bold"
                sx={{
                  color: "#111827",
                  lineHeight: 1.1,
                  mt: 0.25,
                  fontSize: { xs: "1.75rem", md: "2.5rem" },
                }}
              >
                {deleteCount}
              </MDTypography>
            </MDBox>
          </MDBox>
        </MDBox>
      </MDBox>
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
                      {showHistory ? "Historial de Eliminaciones" : "Usuarios"}
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
                    {showHistory ? (
                      // 🔁 AQUI VA LA TABLA DE HISTORIAL
                      <DataTable
                        table={{
                          columns: historyDeleteUsers,
                          rows: historyRows,
                        }}
                        isSorted={false}
                        entriesPerPage={false}
                        showTotalEntries={true}
                        noEndBorder
                      />
                    ) : (
                      <DataTable
                        table={{ columns, rows }}
                        isSorted={false}
                        entriesPerPage={false}
                        showTotalEntries={true}
                        noEndBorder
                      />
                    )}
                  </MDBox>
                </Card>
              </Grid>
            </Grid>
          </MDBox>
        </MDBox>

        <InviteModal
          isOpen={inviteModalOpen}
          onClose={() => setInviteModalOpen(false)}
          onInvite={handleInviteUser}
          loading={inviteLoading}
        />

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={Boolean(openModalDeleteUser)}
          onClose={closeModalDeleteUser}
        >
          <DialogTitle>
            <MDBox
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <MDTypography variant="h5"> Confirmar eliminación</MDTypography>
              <IconButton onClick={closeModalDeleteUser}>
                <CloseIcon />
              </IconButton>
            </MDBox>
          </DialogTitle>

          <DialogContent dividers>
            <MDTypography variant="body1" color="text">
              ¿Confirma que desea eliminar este proyecto?
              <br />
              Tenga en cuenta que{" "}
              <strong>
                todas las tareas vinculadas también serán eliminadas
              </strong>
              .
            </MDTypography>
            <MDTypography
              variant="body2"
              color="error"
              sx={{ mt: 1, fontWeight: 500 }}
            >
              Esta acción no se puede deshacer.
            </MDTypography>
          </DialogContent>

          <DialogActions>
            <MDButton
              onClick={closeModalDeleteUser}
              variant="outlined"
              color="secondary"
            >
              Cancelar
            </MDButton>
            <MDButton
              onClick={() => handleRemoveUser(openModalDeleteUser)}
              variant="gradient"
              color="error"
            >
              Eliminar
            </MDButton>
          </DialogActions>
        </Dialog>

        <Footer />
      </MDBox>
    </DashboardLayout>
  );
};

export default AdminUserDashboard;
