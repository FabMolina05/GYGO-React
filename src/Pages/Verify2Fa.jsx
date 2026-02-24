import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { verify2FACode, Resend2FACode } from "../API/Auth";
import { useAuth } from "../context/AuthContext";
import beneficiosambientales from '../assets/10-beneficios-ambientales-de-plantar-un-arbol.jpg';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button, CircularProgress
} from "@mui/material";
import Swal from "sweetalert2";

export function Verify2FA() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [tempToken, setTempToken] = useState(searchParams.get("tempToken"));
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [isResending, setIsResending] = useState(false); // Para deshabilitar botón mientras reenvía

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { success, rol, error,id } = await verify2FACode(tempToken, code);

      if (!code) {
        setIsLoading(false);
        Swal.fire({
          icon: "warning",
          title: "No se pudo verificar el código",
          text: "Por favor, completá todos los campos.",
          showConfirmButton: false,
          timer: 3000,
        });
        return;
      }
      if (success) {
        login(rol,id);
        Swal.fire({
          icon: "success",
          title: "¡Código verificado!",
          text: "Has ingresado correctamente.",
          confirmButtonColor: "#2DA14C",
          timer: 3000,
          showConfirmButton: false,
        });

        setTimeout(() => {
          navigate("/panel-control");
        }, 3000); // pequeño margen por si tarda en cerrarse el Swal
      }
      else if (error?.includes("expirado")) {
        Swal.fire({
          icon: "warning",
          title: "Token expirado",
          text: "Tu token ha caducado, solicitá uno nuevo.",
          timer: 3000,
          showConfirmButton: false,
        });

        setTimeout(() => {
          navigate("/inicio-sesion"); 
        }, 3000);

        return;
      } else {
        Swal.fire({
          icon: "error",
          title: "Código incorrecto",
          text: error,
          showConfirmButton: false,
          timer: 3000,
        });
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

  const handleResendCode = async () => {
    setIsResending(true);

    try {
      const response = await Resend2FACode(tempToken);

      // si se expiro el token
      if (response.expired) {
        Swal.fire({
          icon: "warning",
          title: "Sesión expirada",
          text: response.message,
          timer: 2500,
          showConfirmButton: false,
        }).then(() => {
          navigate("/inicio-sesion");
        });
        return;
      }

      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Código reenviado",
          text: response.message,
          timer: 2500,
          showConfirmButton: false,
        });

        // Limpiar el campo del código
        setCode("");
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.message,
        });
      }
    } catch (error) {
      console.error("Error en handleResendCode:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "No se pudo conectar con el servidor.",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
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
        p: 2,
      }}
>
      <Paper
        elevation={6}
        sx={{
          width: 520,
          height: 320,
          p: 3,
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          bgcolor: "#fff",
        }}
      >
        <Typography variant="h5" fontWeight={600} mb={2}>
          Autenticación en dos pasos
        </Typography>

        <Typography variant="body2" color="text.secondary" mb={3}>
          Introduzca el código enviado a su correo.
        </Typography>

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <TextField
            type="text"
            fullWidth
            name="code"
            label="Código de verificación"
            variant="outlined"
            margin="normal"
            value={code}
            onChange={(e) => {
              const value = e.target.value;
              if (/^\d{0,6}$/.test(value)) setCode(value); // solo números y máx 6 dígitos
            }}
            inputProps={{
              maxLength: 6,
              inputMode: "numeric",
              pattern: "[0-9]*",
            }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{
              mt: 2,
              backgroundColor: "#2DA14C", // verde
              color: "#fff", // letras blancas
              "&:hover": {
                backgroundColor: "#1fcc4bff", // verde más oscuro al hacer hover
              },
            }}
          >
            {isLoading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    "Verificar"
                  )}
          </Button>

          <Button
            type="button"
            variant="contained"
            fullWidth
            size="large"
            sx={{
              mt: 2,
              backgroundColor: "#2DA14C", // verde
              color: "#fff", // letras blancas
              "&:hover": {
                backgroundColor: "#1fcc4bff", // verde más oscuro al hacer hover
              },
            }}
            onClick={handleResendCode}
            disabled={isResending}
          >
            {isResending ? "Reenviando..." : "Reenviar código"}
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
