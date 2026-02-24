import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {
  Button,
  CssBaseline,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  InputAdornment,
  IconButton,
  FormControl,
  CircularProgress,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Swal from "sweetalert2";
import { ResetPassword } from "../../API/ChangePassword";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import { ConsoleLogger } from "@microsoft/signalr/dist/esm/Utils";
import logo from "../../assets/Logo.png";
import beneficiosambientales from "../../assets/10-beneficios-ambientales-de-plantar-un-arbol.jpg";

const theme = createTheme({
  palette: {
    primary: { main: "#2DA14C" },
    secondary: { main: "#ffffff" },
    background: { default: "#f9f9f5" },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
  },
  shape: { borderRadius: 12 },
});

const Paper = styled("div")(({ theme }) => ({
  padding: "40px",
  backgroundColor: "white",
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[5],
  width: "100%",
  maxWidth: 400,
  margin: "0 auto",
}));

export const ChangePassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [ConfirmPassword, SetConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // <- se obtiene aquí, no dentro de la función
  const query = new URLSearchParams(location.search);
  const token = query.get("token");

  //Funciona para la contraseña
  function isPasswordValid(password) {
    if (password.length < 8) return false;
    if (!/[A-Z]/.test(password)) return false;
    if (!/[a-z]/.test(password)) return false;
    if (!/[0-9]/.test(password)) return false;
    if (!/[^A-Za-z0-9]/.test(password)) return false;
    return true;
  }
  //Termina funcion de la contraseña

  const handleClickShowPassword = () => {
    setShowPassword((show) => !show);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!ConfirmPassword || !newPassword) {
      Swal.fire({
        icon: "warning",
        title: "No se pudo cambiar la contraseña",
        text: "Por favor, completá todos los campos.",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    if (ConfirmPassword !== newPassword) {
      Swal.fire({
        icon: "error",
        title: "No se pudo cambiar la contraseña",
        text: "Las contraseñas ingresadas no coinciden.",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    //Verifica la contraseña
    if (!isPasswordValid(ConfirmPassword) || !isPasswordValid(newPassword)) {
      Swal.fire({
        icon: "warning",
        title: "Problemas con la contraseña",
        text: "La contraseña debe tener al menos 8 caracteres, mayúscula, minúscula, número y símbolo.",
        timer: 2000,
        showConfirmButton: false,
      });
      return;
    }

    setLoading(true);
    try {
      const result = await ResetPassword(token, newPassword, ConfirmPassword);
      setLoading(false);

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Cambio de contraseña exitoso",

          text: "La contraseña se cambió correctamente.",
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          window.location.href = "/inicio-sesion";
        });
        return;
      } else {
        Swal.fire({
          icon: "error",
          title: "Error al cambiar la contraseña",
          text: result.message,
          timer: 2000,
          showConfirmButton: false,
        });
        return;
      }
    } catch (error) {}
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            backgroundImage: `linear-gradient(135deg, rgba(6, 95, 70, 0.7) 0%, rgba(4, 120, 87, 0.7) 100%), url(${beneficiosambientales})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
            backdropFilter: "blur(3px)",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Container maxWidth="xs">
            <Paper sx={{ p: 4 }}>
              <Box textAlign="center" mb={2}>
                <img src={logo} alt="Logo" style={{ maxWidth: "120px" }} />
              </Box>

              <Box textAlign="center" mb={5}>
                <Typography variant="h4" fontWeight={600} color="primary">
                  Cambiar Contraseña
                </Typography>
              </Box>

              <FormControl variant="outlined" fullWidth sx={{ mb: 3 }}>
                <InputLabel htmlFor="outlined-adornment-password">
                  Nueva Contraseña
                </InputLabel>
                <OutlinedInput
                  onChange={(e) => setNewPassword(e.target.value)}
                  id="outlined-adornment-password"
                  type={showPassword ? "text" : "password"}
                  // debo comentar esto
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={
                          showPassword
                            ? "Ocultar la contraseña"
                            : "Mostrar la contraseña"
                        }
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  } // hasta aqui
                  label="Nueva Contraseña"
                />
              </FormControl>

              <FormControl variant="outlined" fullWidth sx={{ mb: 3 }}>
                <InputLabel htmlFor="outlined-adornment-password2">
                  Confirmar Contraseña
                </InputLabel>
                <OutlinedInput
                  onChange={(e) => SetConfirmPassword(e.target.value)}
                  id="outlined-adornment-password2"
                  type={showPassword ? "text" : "password"}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={
                          showPassword
                            ? "Ocultar la contraseña"
                            : "Mostrar la contraseña"
                        }
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Nueva Contraseña"
                />
              </FormControl>

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
                sx={{ mt: 3, py: 1.5, borderRadius: 2 }}
              >
                {loading ? (
                  <CircularProgress size={26} color="inherit" />
                ) : (
                  "Actualizar Contraseña"
                )}
              </Button>
            </Paper>
          </Container>
        </Box>
      </ThemeProvider>
    </>
  );
};
