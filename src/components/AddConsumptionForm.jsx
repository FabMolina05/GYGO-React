import { useEffect, useState } from "react";

import {
  Card,
  Grid,
  MenuItem,
  CircularProgress,
  TextField,
  Select,
  Alert,
  FormControl,
  FormControlLabel,
} from "@mui/material";
import { AddOutlined, ErrorOutline } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import { getFactoresEmision } from "../API/FactorEmision";
import { addConsumption } from "../API/Consumptions/Consumption";
import Swal from "sweetalert2";
import { FormControl } from "react-bootstrap";

export function AddConsumptionForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: "", factorEmisionId: "" });
  const [factoresEmision, setFactoresEmision] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFactores = async () => {
      try {
        const response = await getFactoresEmision();
        setFactoresEmision(response);
      } catch (error) {
        console.error("Error cargando factores:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFactores();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "El nombre es requerido";
    if (!formData.factorEmisionId)
      newErrors.factorEmisionId = "Seleccione un factor";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const consumo = {
        name: formData.name,
        factorEmisionId: parseInt(formData.factorEmisionId),
      };
      await addConsumption(consumo);

      await Swal.fire({
        icon: "success",
        title: "¡Consumo agregado exitosamente!",
        showConfirmButton: false,
        timer: 2000,
      });
      navigate("/consumo");
    } catch (err) {
      console.error("Error al guardar:", err);
      setErrors({ submit: "Error al guardar. Intente de nuevo." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card sx={{ p: 3 }}>
      <MDTypography variant="h6" fontWeight="bold" gutterBottom>
        Información del Consumo
      </MDTypography>
      <MDTypography variant="body2" color="text" mb={2}>
        Complete los campos para registrar el nuevo consumo
      </MDTypography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <TextField
              label="Nombre *"
              name="name"
              fullWidth
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              <FormControl>
                <InputLabel id="factor-emision-label">
                  Factor de Emisión *
                </InputLabel>
                <Select
                  sx={{ height: 40 }}
                  name="factorEmisionId"
                  labelId="factor-emision-label"
                  label="Factor de Emisión *"
                  fullWidth
                  value={formData.factorEmisionId}
                  onChange={handleChange}
                  error={!!errors.factorEmisionId}
                  helperText={errors.factorEmisionId}
                >
                  <MenuItem value="">Seleccione un factor</MenuItem>
                  {factoresEmision.map((f) => (
                    <MenuItem key={f.id} value={f.id}>
                      {f.name} ({f.unitCarbono})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </Grid>

          {errors.submit && (
            <Grid size={{ xs: 12 }}>
              <Alert severity="error" icon={<ErrorOutline />}>
                {errors.submit}
              </Alert>
            </Grid>
          )}

          <Grid size={{ xs: 12 }}>
            <MDButton
              type="submit"
              variant="gradient"
              color="success"
              fullWidth
              disabled={submitting}
            >
              {submitting ? "Agregando..." : "Agregar Consumo"}
            </MDButton>
          </Grid>
        </Grid>
      </form>
    </Card>
  );
}
