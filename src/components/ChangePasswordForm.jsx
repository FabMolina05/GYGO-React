import React, { useState } from "react";
import {
  Card,
  Grid,
  CircularProgress,
  FormControl,
  InputAdornment,
  IconButton,
  InputLabel,
  OutlinedInput,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Swal from "sweetalert2";
import { PostChangePassword } from "../API/ChangePassword";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";

export const ChangePasswordForm = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClickShowCurrentPassword = () => {
    setShowCurrentPassword((show) => !show);
  };

  const handleClickShowNewPassword = () => {
    setShowNewPassword((show) => !show);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setLoading(true);

    const UserDTO = {
      CurrentPassword: currentPassword,
      NewPassword: newPassword,
    };
    try {
      const result = await PostChangePassword(UserDTO);
      setLoading(false);

      if (!currentPassword || !newPassword) {
        Swal.fire({
          icon: "warning",
          title: "No se pudo cambiar la contraseña",
          text: "Por favor, completá todos los campos.",
          timer: 3000,
          showConfirmButton: false,
        });
        return;
      }
      
    
      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "Cambio de contraseña exitoso",
          text: "El cambio de contraseña se cambio correctamente.",
          showConfirmButton: false,
          confirmButtonColor: "#2DA14C",
          timer: 3000,
        }).then(() => {
          window.location.href = "/panel-control";
        });
        return;
      } else {
        Swal.fire({
          icon: "error",
          title: "Error al cambiar la contraseña",
          text: result.error.message,
          timer: 3000,
          showConfirmButton: false,
        });
        return;
      }

      //navigate("/DashboardGroupPage");
    } catch (error) {}
  };

  return (
    <>
      <MDBox
        component="form"
        onSubmit={handleSubmit}
        mt={3}
        display="flex"
        flexDirection="column"
        gap={3}
      >
        <FormControl variant="outlined" fullWidth>
          <InputLabel htmlFor="outlined-adornment-password">
            Contraseña Actual
          </InputLabel>
          <OutlinedInput
            onChange={(e) => setCurrentPassword(e.target.value)}
            id="outlined-adornment-password"
            type={showCurrentPassword ? "text" : "password"}
            // debo comentar esto
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showCurrentPassword
                      ? "Ocultar la contraseña"
                      : "Mostrar la contraseña"
                  }
                  onClick={handleClickShowCurrentPassword}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseUpPassword}
                  edge="end"
                >
                  {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            } // hasta aqui
            label="Contraseña actual"
          />
        </FormControl>

        <FormControl variant="outlined" fullWidth>
          <InputLabel htmlFor="outlined-adornment-password2">
            Nueva Contraseña
          </InputLabel>
          <OutlinedInput
            onChange={(e) => setNewPassword(e.target.value)}
            id="outlined-adornment-password2"
            type={showNewPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label={
                    showNewPassword
                      ? "Ocultar la contraseña"
                      : "Mostrar la contraseña"
                  }
                  onClick={handleClickShowNewPassword}
                  onMouseDown={handleMouseDownPassword}
                  onMouseUp={handleMouseUpPassword}
                  edge="end"
                >
                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Nueva Contraseña"
          />
        </FormControl>

        <MDButton
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{
            backgroundColor: "#4CAF50",
            color: "#ffff",
            "&:hover": {
              backgroundColor: "#388E3C",
            },
          }}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            "Actualizar Contraseña"
          )}
        </MDButton>
      </MDBox>
    </>
  );
};
