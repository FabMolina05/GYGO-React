import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { UpdateConsumption, getConsumptionById } from "../API/Consumptions/Consumption";

import { getFactoresEmision } from "../API/FactorEmision";
import {
  Card,
  Grid,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  TextField,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { ArrowBackOutlined, ErrorOutline } from "@mui/icons-material";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Swal from "sweetalert2";
import Footer from "examples/Footer";

export function UpdateConsumptionPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    consumptionId: 0,
    name: "",
    factorEmisionId: "",
    isActive: true,
  });
  const [factores, setFactores] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataList = await getConsumptionById(id);
        const data = dataList[0];
        if (data) {
          setFormData({
            consumptionId: data.consumptionId,
            name: data.name || "",
            factorEmisionId: data.factorEmisionId || "",
            isActive: data.isActive,
          });
        }
      } catch (e) {
        console.error("Error al cargar consumo:", e);
      }
    };

    const fetchFactores = async () => {
      try {
        const result = await getFactoresEmision();
        setFactores(result);
      } catch (e) {
        console.error("Error al cargar factores:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    fetchFactores();
  }, [id]);

  const factorSeleccionado = factores.find((f) => f.id === Number(formData.factorEmisionId));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "El nombre es obligatorio.";
    if (!formData.factorEmisionId) newErrors.factorEmisionId = "Debe seleccionar un factor.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await UpdateConsumption(formData);
      await Swal.fire({
        icon: "success",
        title: "¡Consumo actualizado exitosamente!",
        showConfirmButton: false,
        timer: 2000,
      });
      navigate("/consumo");
    } catch (e) {
      console.error(e);
      setErrors({ submit: "Error al actualizar el consumo." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <DashboardNavbar></DashboardNavbar>
      <MDBox py={3}>
        <Grid container spacing={3} sx={{mb:5}}>
          <Grid size={{xs:12}}>
            <Card sx={{ p: 3 }}>
              <Grid container alignItems="center" spacing={2}>
                <Grid size={{xs:12, md:1}}>
                  <MDButton
                    variant="text"
                    color="black"
                    startIcon={<ArrowBackOutlined />}
                    onClick={() => navigate(-1)}
                    sx={{ minWidth: "100%" }}
                  >
                    Volver
                  </MDButton>
                </Grid>
                <Grid size={{xs:12, md: 10}}>
                  <MDTypography variant="h5" fontWeight="bold" gutterBottom>
                    Editar Consumo
                  </MDTypography>
                  <MDTypography variant="body2" color="text">
                    Modifique los datos del consumo seleccionado
                  </MDTypography>
                </Grid>
              </Grid>
            </Card>
          </Grid>

          <Grid size={{xs:12}}>
            <Card sx={{ p: 3 }}>
              <MDTypography variant="h6" fontWeight="bold" gutterBottom>
                Información del Consumo
              </MDTypography>
              <MDTypography variant="body2" color="text" mb={2}>
                Actualice los campos necesarios
              </MDTypography>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid size={{xs:12}}>
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

                  <Grid size={{xs:12}}>
                    {loading ? (
                      <CircularProgress size={24} />
                    ) : (
                      <Select
                        name="factorEmisionId"
                        fullWidth
                        value={formData.factorEmisionId}
                        onChange={handleChange}
                        sx={{ height: 40 }}
                      >
                        <MenuItem value="">Seleccione un factor</MenuItem>
                        {factores.map((f) => (
                          <MenuItem key={f.id} value={f.id}>
                            {f.name} ({f.unitCarbono})
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                    {errors.factorEmisionId && (
                      <Alert severity="error" icon={<ErrorOutline />}>
                        {errors.factorEmisionId}
                      </Alert>
                    )}
                  </Grid>

                  {factorSeleccionado && (
                    <Grid size={{xs:12}}>
                      <MDTypography variant="body2">
                        Nombre: {factorSeleccionado.name} | Unidad: {factorSeleccionado.unitCarbono}
                      </MDTypography>
                    </Grid>
                  )}

                  <Grid size={{xs:12}}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="isActive"
                          checked={formData.isActive}
                          onChange={handleChange}
                        />
                      }
                      label="Activo"
                    />
                  </Grid>

                  {errors.submit && (
                    <Grid size={{xs:12}}>
                      <Alert severity="error" icon={<ErrorOutline />}>
                        {errors.submit}
                      </Alert>
                    </Grid>
                  )}

                  <Grid size={{xs:12}}>
                    <MDButton
                      type="submit"
                      variant="gradient"
                      color="success"
                      fullWidth
                      disabled={submitting}
                    >
                      {submitting ? "Actualizando..." : "Actualizar Consumo"}
                    </MDButton>
                  </Grid>
                </Grid>
              </form>
            </Card>
          </Grid>
        </Grid>
        <Footer />
      </MDBox>
    </DashboardLayout>
  );
}