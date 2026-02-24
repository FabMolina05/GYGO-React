import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
//import { useAuth } from '../../AuthContext';
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser, logoutSesion } from "../../API/Auth";
import { RequestPasswordReset } from "../../API/ChangePassword";
import CloseIcon from "@mui/icons-material/Close";
import MDBox from "components/MDBox";
import MDButton from "../../components/MDButton";
import MDTypography from "components/MDTypography";
import beneficiosambientales from '../../assets/10-beneficios-ambientales-de-plantar-un-arbol.jpg';

import {
  Button,
  CssBaseline,
  TextField,
  Checkbox,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  InputAdornment,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  FormControlLabel,
  FormHelperText,
} from "@mui/material";
import { Visibility, VisibilityOff, ArrowBack } from "@mui/icons-material";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import Swal from "sweetalert2";
import logo from "../../assets/Logo.png";

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

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [emailReset, setEmailReset] = useState("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setErrors({});
    setEmailReset("");
  };
  const [saving, setSaving] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      setIsLoading(false);
      Swal.fire({
        icon: "warning",
        title: "No se pudo iniciar sesión",
        text: "Por favor, completá todos los campos.",
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }

    try {
      const { success, isTwoFactor, tempToken, error, rol, id } =
        await loginUser(email, password);
      
      
      if (!success) {
        if(error && error[1] === "LoggedSession"){
          Swal.fire({
            icon: "warning",
            title: "Sesión activa detectada",
            text: "Ya tenés una sesión activa. Si querés iniciar una nueva, cerrá la sesión en el otro dispositivo.",
            showConfirmButton: true,
            allowOutsideClick: false,
            didOpen: (modal) => {
              modal.querySelector(".swal2-confirm").textContent = "Cerrar sesión";
              modal.querySelector(".swal2-deny").textContent = "Intentar de nuevo";
              modal.querySelector(".swal2-confirm").style.marginRight = "10px";
            },
            preConfirm: async () => {
              const logoutSuccess = await logoutSesion();
              if (logoutSuccess) {
                Swal.fire({
                  icon: "success",
                  title: "Sesión cerrada",
                  text: "Tu sesión anterior ha sido cerrada. Ahora puedes iniciar sesión.",
                  showConfirmButton: false,
                  timer: 2000,
                });
                setEmail("");
                setPassword("");
                return true;
              } else {
                Swal.fire({
                  icon: "error",
                  title: "Error",
                  text: "No se pudo cerrar la sesión anterior.",
                  showConfirmButton: false,
                  timer: 2000,
                });
              }
            },
            preDeny: () => {
              // Solo desaparece el modal
              return true;
            },
          });
          setIsLoading(false);
          return;
        }

      


        Swal.fire({
          icon: "error",
          title: "Error al iniciar sesión",
          text: error,
          showConfirmButton: false,
          timer: 3000,
        });
        setIsLoading(false);
        return;
      }

      
     
      if (isTwoFactor) {
        // Redirect to 2FA page
        navigate(`/verificar-2fa?tempToken=${encodeURIComponent(tempToken)}`);
      } else {
        login(rol, id);
        // Normal login success — redirect to dashboard or home
        navigate("/panel-control");
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo conectar con el servidor, intentá nuevamente más tarde.",
        showConfirmButton: false,
        timer: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendReset = async () => {
    if (!emailReset.trim()) {
      setErrors({
        email: !emailReset.trim() ? "Requerido" : "",
      });
      return;
    }
    //Validacion de correo
    if (!/\S+@\S+\.\S+/.test(emailReset)) {
      setErrors((prev) => ({
        ...prev,
        email: "Correo electronico es obligatorio",
      }));
      return;
    }
    try {
      setSaving(true);
      const response = await RequestPasswordReset(emailReset);
      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Correo enviado",
          text: "Se envió un enlace de recuperación a tu correo.",
          showConfirmButton: false,
          timer: 2000,
        });
        setSaving(false);
        handleClose();
      } else {
        setSaving(false);
        handleClose();
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No se pudo enviar el enlace. Verifica el correo.",
          timer: 2000,
          showConfirmButton: false,
        });
      }
      setSaving(false);
      setErrors({});
      setEmailReset("");
    } catch (error) {
      console.error("Error enviando reset:", error);
      Swal.fire({
        icon: "error",
        title: "Error inesperado",
        text: "Hubo un error al intentar enviar el enlace.",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  };

  return (
    <div>
      {/* <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {message && <p>{message}</p>} */}

      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box
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
          {/* Large circle top right */}
          <Box
            sx={{
              position: "absolute",
              top: "-96px",
              right: "-96px",
              width: "480px",
              height: "480px",
              borderRadius: "50%",
              background: "rgba(52, 211, 153, 0.25)",
              filter: "blur(80px)",
              pointerEvents: "none",
            }}
          />

          {/* Medium circle bottom left */}
          <Box
            sx={{
              position: "absolute",
              bottom: "-128px",
              left: "-128px",
              width: "400px",
              height: "400px",
              borderRadius: "50%",
              background: "rgba(20, 184, 166, 0.2)",
              filter: "blur(80px)",
              pointerEvents: "none",
            }}
          />

          {/* Small accent circle top left */}
          <Box
            sx={{
              position: "absolute",
              top: "25%",
              left: "25%",
              width: "192px",
              height: "192px",
              borderRadius: "50%",
              background: "rgba(110, 231, 183, 0.1)",
              filter: "blur(60px)",
              pointerEvents: "none",
            }}
          />

          {/* Small accent circle bottom right */}
          <Box
            sx={{
              position: "absolute",
              bottom: "33%",
              right: "33%",
              width: "160px",
              height: "160px",
              borderRadius: "50%",
              background: "rgba(94, 234, 212, 0.1)",
              filter: "blur(60px)",
              pointerEvents: "none",
            }}
          />

          <Container maxWidth="xs" sx={{ position: "relative", zIndex: 1 }}>
            <Paper
              sx={{
                backgroundColor: "rgba(255, 255, 255, 1)",
                border: "1px solid rgba(209, 250, 229, 0.5)",
              }}
            >
              <Box sx={{ position: "relative" }}>
                <IconButton
                 onClick={() => navigate('/pagina-inicio')}
                  sx={{
                    position: "absolute",
                    top: -8,
                    left: -8,
                    color: "primary.main",
                    "&:hover": {
                      backgroundColor: "rgba(45, 161, 76, 0.08)",
                    },
                  }}
                  aria-label="regresar"
                >
                  <ArrowBack />
                </IconButton>
              </Box>

              <Box textAlign="center" mb={2}>
                <img
                  src={logo}
                  alt="Logo"
                  style={{ maxWidth: "120px" }}
                />
              </Box>

              <Box textAlign="center" mb={5}>
                <Typography variant="h4" fontWeight={600} color="primary">
                  Iniciar Sesión
                </Typography>
              </Box>

              <form onSubmit={handleLogin}>
                <TextField
                  fullWidth
                  margin="normal"
                  label="Correo Eletronico"
                  variant="outlined"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <TextField
                  fullWidth
                  margin="normal"
                  label="Contraseña"
                  variant="outlined"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <Typography
                  variant="body2"
                  color="primary"
                  align="right"
                  sx={{ mb: 2, cursor: "pointer", textDecoration: "underline" }}
                  onClick={handleOpen}
                >
                  ¿Olvidaste tu contraseña?
                </Typography>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={isLoading}
                  sx={{ mt: 3, mb: 2, py: 1.5, borderRadius: 2 }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Iniciar sesión"
                  )}
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  color="primary"
                  size="large"
                  sx={{ mb: 2, py: 1.5, borderRadius: 2 }}
                  onClick={() => navigate("/registro")}
                >
                  Crear cuenta
                </Button>
              </form>
            </Paper>
          </Container>
        </Box>
      </ThemeProvider>

      {/* Modal de recuperación */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        sx={{
          "& .MuiDialog-paper": { minHeight: "200px", minWidth: "300px" },
        }}
      >
        <DialogTitle>
          <MDBox
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <MDTypography variant="h5">Recuperar Contraseña</MDTypography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </MDBox>
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            label="Correo electrónico"
            type="email"
            fullWidth
            value={emailReset}
            onChange={(e) => {
              setEmailReset(e.target.value);
              setErrors((prev) => ({ ...prev, email: "" }));
            }}
            error={!!errors.email}
            helperText={errors.email}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <MDButton variant="outlined" color="error" onClick={handleClose}>
            Cancelar
          </MDButton>
          <MDButton
            onClick={handleSendReset}
            variant="contained"
            color="success"
          >
            {saving ? <CircularProgress size={24} color="inherit" /> : "Enviar"}
          </MDButton>
        </DialogActions>
      </Dialog>
    </div>
  );
}
