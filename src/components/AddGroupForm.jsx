import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  TextField,
  Button,
  Typography,
  MenuItem,
  Select,
  Stack,
  InputLabel,
  FormControl,
  Box,
  Paper,
  CircularProgress,
  Avatar,
  FormHelperText,
} from "@mui/material";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import SendIcon from "@mui/icons-material/Send";
import "bootstrap/dist/css/bootstrap.min.css";
import { PostAddGroup, reactivateGroup, DoesUserHaveGroup } from "../API/AddGroup";
import { GetServices } from "../API/Services";
import MDButton from "components/MDButton";
import { refreshLogin } from "../API/Auth";

export const AddGroupForm = () => {
  const [nombreGrupo, setNombreGrupo] = useState("");
  const [correogrupo, setCorreogrupo] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [servicesData, setServicesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState("");
  const [preview, setPreview] = useState(null); // para vista previa de la imagen
  const [errors, setErrors] = useState({});
  const [lastGroup, setLastGroup] = useState(null);
  const navigate = useNavigate();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  //Fetch para los servicios
  const fetchServices = async () => {
    try {
      const data = await GetServices();
      setServicesData(data);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchServices();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    } else {
      setPreview(null);
    }
  };

  const handleReactivateGroup = async () => {
    const result = await reactivateGroup(lastGroup.grupoId);

    if (result.success) {
      Swal.fire({
        icon: "success",
        title: "Grupo reactivado",
        text: "El grupo se ha reactivado correctamente.",
        timer: 2000,
        showConfirmButton: false
      });

      await refreshLogin();
      navigate("/panel-control");
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo reactivar el grupo.",
      });
    }
  };




  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (
        !nombreGrupo.trim() ||
        !correogrupo.trim() ||
        !selectedService ||
        !imageFile
      ) {
        setErrors({
          nombreGrupo: !nombreGrupo.trim() ? "Requerido" : "",
          correogrupo: !correogrupo.trim() ? "Requerido" : "",
          selectedService: !selectedService ? "Requerido" : "",
          imageFile: !imageFile ? "Requerido" : "",
        });
        setLoading(false);
        return;
      }
      if (!emailRegex.test(correogrupo)) {
        setErrors((prev) => ({ ...prev, correogrupo: "Correo inválido" }));
        setLoading(false);
        return;
      }
      const result = await PostAddGroup(
        nombreGrupo,
        correogrupo,
        selectedService,
        imageFile
      );
      setLoading(false);
      
      if (result.success) {
        Swal.fire({
        icon: "success",
        title: "Registro exitoso",
        text: "La empresa se ha registrado correctamente.",
        timer: 2000,
        showConfirmButton: false,
      });

      await refreshLogin();
      navigate("/panel-control");
      } else {
        Swal.fire({
          icon: "error",
          title: "Registro fallido",
          text: result.error.message,
          showConfirmButton: false,
          timer: 3000,
        });
        return;
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <>
      <Container maxWidth="sm" sx={{ mt: 1 }}>
        <Paper elevation={3} sx={{ p: 4, mb: 5 }}>
        {lastGroup && (
  <Paper
    elevation={3}
    sx={{
      p: 3,
      mb: 4,
      borderRadius: 3,
      backgroundColor: "#e6e8e6",
    }}
  >
    <Typography variant="h5" fontWeight="bold" gutterBottom>
      Ya tienes un grupo previo
    </Typography>

    <Stack spacing={1.2} sx={{ mt: 1 }}>
      <Typography>
        <strong>Nombre:</strong> {lastGroup.nombre}
      </Typography>
      <Typography>
        <strong>Correo:</strong> {lastGroup.correo}
      </Typography>
      <Typography>
        <strong>Estado:</strong>{" "}
        <span style={{ color: "#d32f2f", fontWeight: 600 }}>Inactivo</span>
      </Typography>
    </Stack>

    <MDButton
      fullWidth
      color="info"
      onClick={handleReactivateGroup}
      sx={{ mt: 3, py: 1.2, borderRadius: 2, backgroundColor: "#" }}
    >
      Usar último grupo creado
    </MDButton>
  </Paper>
)}
  <hr></hr>
          <Typography variant="h4" align="center" gutterBottom sx={{ mb: 1 }}>
            Complete los campos correspondientes
          </Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Nombre del Grupo"
              variant="outlined"
              margin="normal"
              value={nombreGrupo}
              onChange={(e) => {
                setNombreGrupo(e.target.value);
                setErrors((prev) => ({ ...prev, nombreGrupo: "" }));
              }}
              error={!!errors.nombreGrupo}
              helperText={errors.nombreGrupo}
            />
            <TextField
              fullWidth
              label="Correo Electrónico"
              variant="outlined"
              margin="normal"
              value={correogrupo}
              onChange={(e) => {
                setCorreogrupo(e.target.value);
                setErrors((prev) => ({ ...prev, correogrupo: "" }));
              }}
              error={!!errors.correogrupo}
              helperText={errors.correogrupo}
            />
            <FormControl
              fullWidth
              margin="normal"
              error={!!errors.selectedService}
            >
              <InputLabel>Servicio</InputLabel>
              <Select
                label="Servicio"
                value={selectedService}
                onChange={(e) => {
                  setSelectedService(e.target.value);
                  setErrors((prev) => ({ ...prev, selectedService: "" }));
                }}
                sx={{ height: 40 }}
              >
                {servicesData.map((service) => (
                  <MenuItem key={service.serviceId} value={service.serviceId}>
                    {service.serviceName}
                  </MenuItem>
                ))}
              </Select>
              {errors.selectedService && (
                <FormHelperText>{errors.selectedService}</FormHelperText>
              )}
            </FormControl>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <Box
                onClick={() => document.getElementById("upload-input").click()}
                sx={{
                  mt: 4,
                  width: { xs: "100%", sm: 300 }, // 📱 Responsive
                  height: 200, // ⬆️ Más alto para mejor proporción
                  maxWidth: 300,
                  border: "2px dashed",
                  borderColor: errors.imageFile ? "red" : "#30c622ff",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  position: "relative",
                  overflow: "hidden",
                  bgcolor: preview ? "transparent" : "background.default",
                  "&:hover": {
                    borderColor: errors.imageFile ? "red" : "#0e910eff",
                    bgcolor: "action.hover",
                  },
                }}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Logo preview"
                    style={{
                      width: "95%",
                      height: "95%",
                      objectFit: "contain",
                    }}
                  />
                ) : (
                  <Typography
                    color={errors.imageFile ? "error.main" : "text.secondary"}
                    textAlign="center"
                    sx={{ px: 2 }}
                  >
                    Haz clic aquí para subir el logo
                  </Typography>
                )}
                <input
                  id="upload-input"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={(e) => {
                    handleImageChange(e);
                    setErrors((prev) => ({ ...prev, imageFile: "" }));
                  }}
                />
              </Box>

              {errors.imageFile && (
                <FormHelperText sx={{ color: "red", mt: 1 }}>
                  {errors.imageFile}
                </FormHelperText>
              )}
            </Box>

            <MDButton
              type="submit"
              fullWidth
              color="success"
              sx={{
                mt: 3,

                "&:hover": {
                  backgroundColor: "#0e910eff", // mismo color o uno similar
                },
              }}
              variant="contained"
              endIcon={<SendIcon />}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Registrar"
              )}
            </MDButton>
          </Box>
        </Paper>
      </Container>
     
    </>
  );
};
