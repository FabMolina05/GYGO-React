import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

import {
  Grid,
  Card,
  CircularProgress,
  Divider,
  FormHelperText,
  FormControlLabel,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  IconButton,
  TextField,
  Avatar,
  Stack,
} from "@mui/material";
import { ManageAccounts as ManageAccountsIcon } from "@mui/icons-material";
import Swal from "sweetalert2";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Footer from "examples/Footer";
import { getGrupoProfile, updateGrupoProfile } from "../API/Group";
import MDButton from "components/MDButton";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function GrupoProfilePage() {
  const { role } = useAuth();

  const [grupo, setGrupo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [groupData, setGroupData] = useState({
    nombre: "",
    correo: "",
    logoUrl: "",
    logoFile: null,
  });
  const [previewLogo, setPreviewLogo] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchGrupo = async () => {
    try {
      const result = await getGrupoProfile();
      setGrupo(result);

      const baseUrl = import.meta.env.VITE_API_URL;
      setGroupData({
        nombre: result.nombre,
        correo: result.correo,
        logoUrl: result.logoURL ? `${baseUrl}${result.logoURL}` : "",
        logoFile: null,
      });


      setPreviewLogo(result.logoURL ? `${baseUrl}${result.logoURL}` : null);



    } catch (error) {
      console.error("Error al cargar el perfil del grupo:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrupo();
  }, []);

  const formatFecha = (fechaISO) => {
    return new Date(fechaISO).toLocaleDateString("es-CR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getServicioNombre = (id) => {
    switch (id) {
      case 1:
        return "Bandera Azul";
      case 2:
        return "Huella de Carbono";
      default:
        return "No especificado";
    }
  };

  //#region metodos para el modal

  const openModalWithData = () => {
    setPreviewLogo(
      groupData.logoFile
        ? URL.createObjectURL(groupData.logoFile)
        : groupData.logoUrl
    );
    setOpenModal(true);
  };

  const closeModal = () => {
    setOpenModal(false);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGroupData((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const UpdateGroup = async () => {
    setSaving(true);
    try {
      if (!groupData.nombre.trim() || !groupData.correo.trim()) {
        setErrors({
          nombre: !groupData.nombre.trim() ? "Requerido" : "",
          correo: !groupData.correo.trim() ? "Requerido" : "",
        });
        setSaving(false);
        return;
      }
      if (!groupData.logoFile && !groupData.logoUrl) {
        setErrors((prev) => ({ ...prev, logoFile: "Requerido" }));
        setSaving(false);
        return;
      }

      if (!emailRegex.test(groupData.correo)) {
        setErrors((prev) => ({ ...prev, correo: "Correo inválido" }));
        setSaving(false);
        return;
      }

      // Validación del logo usando solo setErrors
      if (groupData.logoFile) {
        const validTypes = ["image/jpeg", "image/png"];

        if (!validTypes.includes(groupData.logoFile.type)) {
          setErrors({
            logoFile: "Formato no válido. Use JPG, PNG",
          });
          setSaving(false);
          return;
        }

        if (groupData.logoFile.size > 5 * 1024 * 1024) {
          setErrors({
            nombre: "",
            correo: "",
            logo: "El logo no debe superar 5MB",
          });
          setSaving(false);
          return;
        }
      }

      const result = await updateGrupoProfile(groupData);

      if (result.success) {
        closeModal();
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: "La información del grupo ha sido actualizada.",
          showConfirmButton: false,
          timer: 3000,
        });

        fetchGrupo();
      } else {
        closeModal();
        Swal.fire({
          icon: "error",
          title: "No se pudo actualizar el proyecto",
          text:
            result.message ||
            "Por favor, revisá los datos e intentá nuevamente.",
          showConfirmButton: false,
          timer: 3000,
        });

        fetchGrupo();
      }
    } catch (error) {
      closeModal();
      Swal.fire({
        icon: "error",
        title: "Error en el servidor",
        text: "Ocurrió un error inesperado. Intentalo más tarde.",
        showConfirmButton: false,
        timer: 3000,
      });
      fetchGrupo();
    } finally {
      setSaving(false);
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png"];
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        logoFile: "Formato inválido. JPG o PNG",
      }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        logoFile: "La imagen no debe superar 5MB",
      }));
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewLogo(reader.result); // base64 para preview
      setGroupData((prev) => ({ ...prev, logoFile: file }));
      setErrors((prev) => ({ ...prev, logoFile: "" }));
    };
    reader.readAsDataURL(file);
  };

  // const handleRemoveLogo = () => {
  //   setPreviewLogo(null);
  //   setGroupData((prev) => ({
  //     ...prev,
  //     logoFile: null /*, logoUrl: "" si quieres eliminar permanentemente */,
  //   }));
  //   setErrors((prev) => ({ ...prev, logoFile: "" }));
  // };

  //#endregion

  return (
    <DashboardLayout>
      <DashboardNavbar></DashboardNavbar>
      <MDBox py={3}>
        <Grid container spacing={3} sx={{ mb: 5 }}>
          <Grid size={{ xs: 12 }}>
            <Card sx={{ p: 3 }}>
              <MDTypography variant="h4" fontWeight="bold" gutterBottom>
                Perfil del Grupo
              </MDTypography>
              <MDTypography variant="body2" color="text">
                Información del grupo registrado en el sistema
              </MDTypography>
            </Card>
          </Grid>

          {loading ? (
            <Grid size={{ xs: 12 }}>
              <Card sx={{ p: 3, textAlign: "center" }}>
                <CircularProgress />
              </Card>
            </Grid>
          ) : (
            <>
              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ p: 3 }}>
                  <MDTypography variant="subtitle2" color="text">
                    Nombre del Grupo
                  </MDTypography>
                  <MDTypography variant="h6" fontWeight="medium">
                    {grupo.nombre}
                  </MDTypography>

                  <Divider sx={{ my: 2 }} />

                  <MDTypography variant="subtitle2" color="text">
                    Correo Electrónico
                  </MDTypography>
                  <MDTypography variant="body1">{grupo.correo}</MDTypography>
                </Card>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Card sx={{ p: 3 }}>
                  <MDTypography variant="subtitle2" color="text">
                    Fecha de Creación
                  </MDTypography>
                  <MDTypography variant="body1">
                    {formatFecha(grupo.fechaCreación)}
                  </MDTypography>

                  <Divider sx={{ my: 2 }} />

                  <MDTypography variant="subtitle2" color="text">
                    Servicio Asociado
                  </MDTypography>
                  <MDTypography variant="body1">
                    {getServicioNombre(grupo.idService)}
                  </MDTypography>
                </Card>
              </Grid>

              {role !== "GU" && (
                <Grid size={{ xs: 12 }} sx={{ mb: 3 }}>
                  <Card sx={{ p: 3, textAlign: "right" }}>
                    <MDButton
                      sx={{ mb: 2 }}
                      variant="contained"
                      color="success"
                      startIcon={<ManageAccountsIcon />}
                      onClick={openModalWithData}
                    >
                      Editar Información del Grupo
                    </MDButton>
                  </Card>
                </Grid>
              )}
            </>
          )}
        </Grid>

        {/* Modal para actulizar información */}
        <Dialog open={openModal} onClose={closeModal} maxWidth="md" fullWidth>
          <DialogTitle>
            <MDBox
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <MDTypography variant="h5"> Editar Grupo</MDTypography>
              <IconButton onClick={closeModal}>
                <CloseIcon />
              </IconButton>
            </MDBox>
          </DialogTitle>

          <DialogContent dividers>
            <MDBox sx={{ mb: 3, textAlign: "center" }}>
              <MDBox
                sx={{
                  width: "100%",
                  maxWidth: 300,
                  height: 120,
                  margin: "0 auto",
                  mb: 2,
                  border: "2px dashed",
                  borderColor: errors.logo ? "error.main" : "divider",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  backgroundColor: "grey.50",
                }}
              >
                {previewLogo || groupData.logoUrl ? (
                  <img
                    src={previewLogo || groupData.logoUrl}
                    alt="Logo del grupo"
                    style={{
                      maxWidth: "100%",
                      maxHeight: "100%",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <MDTypography variant="body2" color="text.secondary">
                    Sin logo
                  </MDTypography>
                )}
              </MDBox>

              {errors.logoFile && (
                <MDTypography
                  variant="caption"
                  color="error"
                  sx={{ display: "block", mb: 1 }}
                >
                  {errors.logoFile}
                </MDTypography>
              )}

              <MDBox sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                <MDButton
                  component="label"
                  variant="outlined"
                  color="info"
                  startIcon={<CloudUploadIcon />}
                  size="small"
                >
                  Subir Logo
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => {
                      handleLogoChange(e);
                      setErrors((prev) => ({ ...prev, logoFile: "" }));
                    }}
                  />
                </MDButton>
              </MDBox>

              <MDTypography
                variant="caption"
                color="text"
                sx={{ display: "block", mt: 1 }}
              >
                JPG, PNG (máx. 5MB)
              </MDTypography>
            </MDBox>

            <TextField
              fullWidth
              label="Nombre"
              name="nombre"
              margin="normal"
              value={groupData.nombre}
              onChange={handleChange}
              error={!!errors.nombre}
              helperText={errors.nombre}
              sx={{ mb: 2 }}
            />

            <TextField
              fullWidth
              label="Correo Electrónico"
              name="correo"
              margin="normal"
              value={groupData.correo}
              onChange={handleChange}
              error={!!errors.correo}
              helperText={errors.correo}
              sx={{ mb: 2 }}
            />
          </DialogContent>

          <DialogActions>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              width="100%"
            >
              <MDButton
                sx={{ flex: 1 }}
                onClick={() => UpdateGroup()}
                variant="contained"
                color="info"
              >
                {saving ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Guardar"
                )}
              </MDButton>

              <MDButton
                sx={{ flex: 1 }}
                onClick={closeModal}
                variant="contained"
                color="error"
              >
                Cancelar
              </MDButton>
            </Stack>
          </DialogActions>
        </Dialog>
        {/* Modal para actulizar información */}

        <Footer />
      </MDBox>
    </DashboardLayout>
  );
}
