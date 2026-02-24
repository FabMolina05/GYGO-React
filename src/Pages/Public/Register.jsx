import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

import { registerUser } from "../../API/Auth";
import { useNavigate } from "react-router-dom";
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
  InputAdornment, CircularProgress,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff, Email,ArrowBack } from "@mui/icons-material";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import Swal from "sweetalert2";
import logo from "../../assets/Logo.png";
import beneficiosambientales from '../../assets/10-beneficios-ambientales-de-plantar-un-arbol.jpg';

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

export function Register() {
  const { inviteToken } = useParams();
  const [form, setForm] = useState({ email: "", username: "", password: "" });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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

  useEffect(() => {
    if (inviteToken) {
      try {
        const decoded = jwtDecode(inviteToken);

        const invitedEmail = decoded.InvitedEmail;

        setForm((prev) => ({
          ...prev,
          email: invitedEmail || "",
        }));
      } catch (error) {
        console.error("Token inválido:", error);
      }
    }
  }, [inviteToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (!form.email || !form.password || !form.username) {
      setIsLoading(false);
      Swal.fire({
        icon: "warning",
        title: "No se pudo registrar al usuario",
        text: "Por favor, completá todos los campos.",
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }
    //Verifica la contraseña
    if (!isPasswordValid(form.password)) {
      setIsLoading(false);
      Swal.fire({
        icon: "warning",
        title: "Problemas con la contraseña",
        text: "La contraseña debe tener al menos 8 caracteres, mayúscula, minúscula, número y símbolo.",
        showConfirmButton: false,
        timer: 3000,
      });
      return;
    }

    try {
      const response = await registerUser(inviteToken, form);
      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Registro exitoso",
          text: "El usuario ha sido registrado correctamente.",
          timer: 3000, // se cierra después de 3 segundos
          showConfirmButton: false,
          willClose: () => {
            window.location.href = "/inicio-sesion";
          },
        });
        return;
      } else {
        Swal.fire({
          icon: "error",
          title: "Error al registrar al usuario",
          text: response.message,
          showConfirmButton: false,
          timer: 3000,
        });
        return;
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo conectar con el servidor, intentá nuevamente más tarde.",
        showConfirmButton: false,
        timer: 3000,
      });
    }finally{
      setIsLoading(false);
    }
  };

  return (
    <div>
      {/* <h2>Registro {inviteToken ? "por invitación" : "normal"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={form.email}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="text"
          name="username"
          placeholder="Nombre de usuario"
          value={form.username}
          onChange={handleChange}
          required
        />
        <br />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={form.password}
          onChange={handleChange}
          required
        />
        <br />
        <button type="submit">Registrarse</button>
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
          <Container maxWidth="xs">
            <Paper>
 <Box sx={{ position: "relative" }}>
                <IconButton
                  onClick={() => navigate("/pagina-inicio")}
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


              <Box textAlign="center" mb={1}>
                <img src={logo} alt="Logo" style={{ maxWidth: "120px" }} />
              </Box>

              <Box textAlign="center" mb={2}>
                <Typography variant="h4" fontWeight={600} color="primary">
                  Registro {inviteToken ? "por invitación" : ""}
                </Typography>
              </Box>

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  margin="normal"
                  name="email"
                  label="Correo Eletronico"
                  variant="outlined"
                  value={form.email}
                  onChange={handleChange}
                  disabled={!!inviteToken}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  label="Nombre de usuario"
                  name="username"
                  variant="outlined"
                  value={form.username}
                  onChange={handleChange}
                />

                <TextField
                  fullWidth
                  margin="normal"
                  label="Contraseña"
                  name="password"
                  variant="outlined"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  sx={{ mt: 3, mb: 2, py: 1.5, borderRadius: 2 }}
                >
                  {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Registrar"
                  )}
                </Button>
                {!inviteToken && (
                  <Button
                    onClick={() => navigate("/inicio-sesion")}
                    fullWidth
                    variant="outlined"
                    color="primary"
                    size="large"
                    sx={{ mt: 1, mb: 2, py: 1.5, borderRadius: 2 }}
                  >
                    Iniciar sesión
                  </Button>
                )}
              </form>
            </Paper>
          </Container>
        </Box>
      </ThemeProvider>
    </div>
  );
}
