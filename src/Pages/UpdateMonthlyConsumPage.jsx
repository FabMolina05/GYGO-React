import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ErrorOutline, SaveOutlined, ArrowBack } from "@mui/icons-material";
import {
  Card,
  Grid,
  TextField,
  MenuItem,
  CircularProgress,
  Alert,
  Select
} from "@mui/material";
import Swal from "sweetalert2";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

import { UpdateMonthlyConsumption, getMonthlyConsumptions } from "../API/Consumptions/MonthlyConsum";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

export function UpdateMonthlyConsumPage() {
  const { consumptionId, monthlyId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ month: "", year: "", amount: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchMonthly = async () => {
      try {
        const data = await getMonthlyConsumptions(consumptionId);
        const found = data.find((item) => item.monthlyConsumptionId === Number(monthlyId));
        if (found) {
          setFormData({
            month: found.month,
            year: found.year,
            amount: found.amount,
          });
        }
      } catch (error) {
        console.error("Error al cargar el consumo mensual:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMonthly();
  }, [consumptionId, monthlyId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.month || formData.month < 1 || formData.month > 12) newErrors.month = "Mes inválido (1-12)";
    if (!formData.year || formData.year < 2000 || formData.year > 2100) newErrors.year = "Año inválido";
    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = "Cantidad debe ser mayor a 0";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      const dto = {
        monthlyConsumptionId: Number(monthlyId),
        consumptionId: Number(consumptionId),
        month: Number(formData.month),
        year: Number(formData.year),
        amount: parseFloat(formData.amount),
      };
      await UpdateMonthlyConsumption(dto);
      await Swal.fire({
        icon: "success",
        title: "Consumo mensual actualizado",
        timer: 2000,
        showConfirmButton: false,
      });
      navigate(`/consumo/mensual/${consumptionId}`);
    } catch (error) {
      console.error("Error al actualizar consumo mensual:", error);
      setErrors({ submit: "Error al actualizar el consumo." });
    } finally {
      setSubmitting(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const startYear = 2020;
  const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i);


  return (
    <DashboardLayout>
      <DashboardNavbar></DashboardNavbar>
      <Grid container spacing={3} py={3} sx={{ mb: 5 }}>
        <Grid size={{ xs: 12 }}>
          <Card sx={{ p: 3 }}>
            <Grid container alignItems="center" spacing={2}>
              <Grid size={{ xs: 12, md: 1 }}>
                <MDButton variant="text" color="black" startIcon={<ArrowBack />} onClick={() => navigate(-1)}>
                  Volver
                </MDButton>
              </Grid>
              <Grid size={{ xs: 12, md: 10 }}>
                <MDTypography variant="h5" fontWeight="bold" gutterBottom>
                  Editar Consumo Mensual
                </MDTypography>
                <MDTypography variant="body2" color="text">
                  Modifique los datos del consumo mensual registrado
                </MDTypography>
              </Grid>
            </Grid>
          </Card>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <Card sx={{ p: 3 }}>
            {loading ? (
              <CircularProgress />
            ) : (
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Select
                      name="month"
                      value={formData.month}
                      onChange={handleInputChange}
                      displayEmpty
                      fullWidth
                      error={!!errors.month}
                      sx={{ height: 40 }}
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
                  <Grid size={{ xs: 12, md: 4 }}>
                    <Select
                      name="year"
                      value={formData.year}
                      onChange={handleInputChange}
                      displayEmpty
                      fullWidth
                      error={!!errors.year}
                      sx={{ height: 40 }}
                    >
                      <MenuItem value="">Seleccione un año</MenuItem>
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
                  <Grid size={{ xs: 12, md: 4 }}>
                    <TextField
                      label="Cantidad *"
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      fullWidth
                      error={!!errors.amount}
                      helperText={errors.amount}
                      inputProps={{ min: 0, step: 0.01 }}
                    />
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
                      color="info"
                      fullWidth
                      disabled={submitting}
                      startIcon={<SaveOutlined />}
                    >
                      {submitting ? "Guardando..." : "Guardar Cambios"}
                    </MDButton>
                  </Grid>
                </Grid>
              </form>
            )}
          </Card>
        </Grid>
      </Grid>
      <Footer />
    </DashboardLayout>
  );
}
