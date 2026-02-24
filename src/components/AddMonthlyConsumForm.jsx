import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AddOutlined,
  ArrowBackOutlined,
  CheckBoxOutlined,
  ErrorOutline,
} from "@mui/icons-material";
import {
  Card,
  Grid,
  CircularProgress,
  MenuItem,
  Select,
  TextField,
  Alert,
} from "@mui/material";
import Swal from "sweetalert2";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import "../styles/consumption.css";
import { getConsumptionById } from "../API/Consumptions/Consumption";
import { addMonthlyConsumption } from "../API/Consumptions/MonthlyConsum";

export function AddMonthlyConsumForm({ consumptionId }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ month: "", year: "", amount: "" });
  const [consumo, setConsumo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  //para el select de years
  const currentYear = new Date().getFullYear();
  const startYear = 2020;
  const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i);

  useEffect(() => {
    const fetchConsumo = async () => {
      try {
        const data = await getConsumptionById(consumptionId);
        setConsumo(data[0]);
      } catch (error) {
        console.error("Error cargando el consumo base", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConsumo();
  }, [consumptionId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.month) newErrors.month = "Debe ingresar el mes";
    if (!formData.year) newErrors.year = "Debe ingresar el año";
    if (!formData.amount || parseFloat(formData.amount) <= 0)
      newErrors.amount = "La cantidad debe ser mayor a 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const newMonthly = {
        month: parseInt(formData.month),
        year: parseInt(formData.year),
        consumptionId,
        amount: parseFloat(formData.amount),
      };

      await addMonthlyConsumption(newMonthly);
      await Swal.fire({
        icon: "success",
        title: "¡Consumo mensual agregado exitosamente!",
        showConfirmButton: false,
        timer: 2000,
      });
      navigate(`/consumo/mensual/${consumptionId}`);
    } catch (error) {
      console.error("Error al agregar consumo mensual:", error);
      setErrors({ submit: "No se pudo agregar el consumo mensual" });
    } finally {
      setSubmitting(false);
    }
  };

  const calcularEmisiones = () => {
    if (!consumo || !formData.amount) return 0;
    const valorFactor = consumo.valueEmision / consumo.valueUnit;
    return (valorFactor * consumo.pcgValue * parseFloat(formData.amount)).toFixed(2);
  };

  return (
    <Card sx={{ p: 3 }}>
      <MDTypography variant="h6" fontWeight="bold" gutterBottom>
        Información del Consumo Mensual
      </MDTypography>
      <MDTypography variant="body2" color="text" mb={2}>
        Complete los campos requeridos para agregar el consumo mensual
      </MDTypography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <Select
              name="month"
              value={formData.month}
              onChange={handleChange}
              displayEmpty
              sx={{ height: 40 }}
              fullWidth
              error={!!errors.month}
            >
              <MenuItem value="">Seleccione un mes</MenuItem>
              {Array.from({ length: 12 }, (_, i) => (
                <MenuItem key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("es", { month: "long" })}
                </MenuItem>
              ))}
            </Select>
            {errors.month && (
              <Alert severity="error" icon={<ErrorOutline />}>
                {errors.month}
              </Alert>
            )}
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Select
            displayEmpty
            sx={{ height: 40 }}
              name="year"
              label="Año *"
              fullWidth
              onChange={handleChange}
              value={formData.year}
              error={!!errors.month}
            >
              <MenuItem value={""}>Seleccione un año</MenuItem>
              {years.map((y) => (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              ))}
            </Select>
            {errors.year && (
              <Alert severity="error" icon={<ErrorOutline />}>
                {errors.year}
              </Alert>
            )}
          </Grid>

          <Grid size={{ xs: 12 }}>
            <TextField
              label="Cantidad *"
              name="amount"
              type="number"
              fullWidth
              value={formData.amount}
              onChange={handleChange}
              error={!!errors.amount}
              helperText={errors.amount}
            />
            {formData.amount && consumo && (
              <MDTypography variant="caption" color="text">
                Huella estimada: <strong>{calcularEmisiones()} kg CO₂</strong>
              </MDTypography>
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
              {submitting ? "Agregando..." : "Agregar Consumo Mensual"}
            </MDButton>
          </Grid>
        </Grid>
      </form>
    </Card>
  );
}
