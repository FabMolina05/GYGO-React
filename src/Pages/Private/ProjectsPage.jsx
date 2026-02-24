import React, { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import "dayjs/locale/es"; // ¡no instalar, solo importar!
import localizedFormat from "dayjs/plugin/localizedFormat";
import {
  RemoveRedEyeOutlined,
  EditOutlined,
  DeleteOutlineOutlined,
  AddOutlined,
} from "@mui/icons-material";
import { CreatePDF } from "../../utils/CreatePDF";
import { jsPDF } from "jspdf";
import {
  getProjects,
  getProjectsbyStatus,
  getProjectsByDates,
  getProjectsPDF,
  AddProject,
  UpdateProject,
  DProject,
} from "../../API/Projects";
import { getFactoresEmision } from "../../API/FactorEmision";
import {
  getTasks,
  UpdateStatusTask,
  AddTask,
  UpdateTaskt,
  DeleteTask,
} from "../../API/Tasks";
import { getReductionUnit } from "../../API/ReductionUnit";
import {
  Grid,
  Box,
  FormControl,
  MenuItem,
  Select,
  Typography,
  Stack,
  Button,
  CircularProgress,
  Modal,
  Switch,
  TextField,
  InputLabel,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  FormControlLabel,
  FormHelperText,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import { Try } from "@mui/icons-material";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import Swal from "sweetalert2";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import MDButton from "components/MDButton";
import MDBadge from "components/MDBadge";
import { useMediaQuery, useTheme } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
dayjs.extend(localizedFormat);
dayjs.locale("es");

function ProjectPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  //Hook para manejar el JSON de proyectos
  const [projects, setProjects] = useState([]);
  //Hook para manejar el JSON de proyectos filtro
  const [filter, setFilter] = useState("todos");
  //Hook para manejar el JSON de proyectos por fechas
  const [startDate, setStartDate] = useState(null);
  //Hook para manejar el JSON de proyectos por fechas
  const [endDate, setEndDate] = useState(null);
  //Hook para manejar el JSON de las tareas por proyectos
  const [tasks, setTasks] = useState(null);
  //Hook para cuando abrir el modal
  const [openModalTask, setOpenModalTask] = useState(false);
  const [openModalProjects, setOpenModalProjects] = useState(false);
  const [openModalDeleteProject, setOpenModalDeleteProject] = useState(null);
  //Hook para cuando un loading
  const [loading, setLoading] = useState(false);

  const [taskStatus, setTaskStatus] = useState({});

  const [data, setData] = useState({});

  //Use State para el modal de agregar o editar proyectos
  const [modoEdicion, setModoEdicion] = useState(false);
  const [projectId, setProjectId] = useState(null);
  const [reductionUnit, setReductionUnit] = useState(null);
  const [editTaskId, setEditTaskId] = useState(null);
  const [projectData, setProjecttData] = useState({
    proyectId: "",
    nombre: "",
    descripcion: "",
    fechaInicio: "",
    fechaFinal: "",
  });

  const [taskData, setTasktData] = useState({
    TaskId: "",
    proyectID: "",
    titulo: "",
    nombre: "",
    descripcion: "",
    valorActividad: "",
    FactorEmisionId: "",
    EmisionesCO2e: "",
  });

  const [tabIndex, setTabIndex] = useState(0);
  const [IsEditing, setIsEditing] = useState(false);
  const [enableEmissionFields, setEnableEmissionFields] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  //Constante para encontrar proyectos
  const grupo = 1;
  const fetchProjects = async () => {
    try {
      dayjs.extend(customParseFormat);
      let data = [];
      if (startDate && endDate) {
        const formattedStart = encodeURIComponent(
          dayjs(startDate, "DD-MM-YYYY").format("MM/DD/YYYY")
        );

        const formattedEnd = encodeURIComponent(
          dayjs(endDate, "DD-MM-YYYY").format("MM/DD/YYYY")
        );

        data = await getProjectsByDates(formattedStart, formattedEnd);
        setData(data);
      } else if (filter === "todos") {
        data = await getProjects();
      } else {
        const status = filter === "true" ? true : false;
        data = await getProjectsbyStatus(status);
      }
      setProjects(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!startDate && !endDate) {
      fetchProjects();
    }
  }, [filter, startDate, endDate]);

  const SearchByDate = () => {
    if (startDate && endDate) {
      fetchProjects();
    }
  };

  const ClearDates = () => {
    setFilter("todos");
    setEndDate(null);
    setStartDate(null);
    setData(0);
  };

  const CreatePDFAPI = async () => {
    try {
      const formattedStart = encodeURIComponent(
        dayjs(startDate).format("MM-DD-YYYY")
      );
      const formattedEnd = encodeURIComponent(
        dayjs(endDate).format("MM-DD-YYYY")
      );
      const projectsPDF = await getProjectsPDF(formattedStart, formattedEnd);

      CreatePDF(projectsPDF);
    } catch (error) {
    } finally {
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProjecttData((prev) => ({ ...prev, [name]: value }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  //#region Proyectos

  // Abrir modal y cargar detalles
  const ModalSaveProject = async () => {
    setModoEdicion(false);
    setProjectId(null);
    setProjecttData({
      nombre: "",
      descripcion: "",
      fechaInicio: "",
      fechaFinal: "",
    });
    setOpenModalProjects(true);
  };

  const ModalUpdateProject = async (project) => {
    setModoEdicion(true);
    setProjectId(project.projectID);
    setProjecttData({
      proyectoId: project.proyectoId,
      nombre: project.nombre,
      descripcion: project.descripcion,
      fechaInicio: project.fechaInicio,
      fechaFinal: project.fechaFinal,
    });
    const ReductionUnitData = await getReductionUnit();
    setReductionUnit(ReductionUnitData);

    setOpenModalProjects(true);
  };

  const closeModalProject = () => {
    fetchProjects();
    setOpenModalProjects(false);
    setErrors({});
  };

  const HandleProjects = async () => {
    try {
      setLoading(true);
      let result;
      if (
        !projectData.nombre.trim() ||
        !projectData.descripcion.trim() ||
        !projectData.fechaInicio.trim() ||
        !projectData.fechaFinal.trim()
      ) {
        setErrors({
          nombre: !projectData.nombre.trim() ? "Requerido" : "",
          descripcion: !projectData.descripcion.trim() ? "Requerido" : "",
          fechainicio: !projectData.fechaInicio.trim() ? "Requerido" : "",
          fechafinal: !projectData.fechaFinal.trim() ? "Requerido" : "",
        });
        setLoading(false);
        return;
      }
      if (modoEdicion) {
        result = await UpdateProject(projectData);

        if (result.success) {
          setOpenModalProjects(false);
          Swal.fire({
            icon: "success",
            title: "¡Proyecto actualizado!",
            text: result.message,
            showConfirmButton: false,
            timer: 2000,
          });

          fetchProjects();
        } else {
          setOpenModalProjects(false);
          Swal.fire({
            icon: "error",
            title: "No se pudo actualizar el proyecto",
            text:
              result.message ||
              "Por favor, revisá los datos e intentá nuevamente.",
            showConfirmButton: false,
            timer: 2000,
          });
          fetchProjects();
        }
        setLoading(false);
      } else {
        result = await AddProject(projectData);

        if (result.success) {
          setOpenModalProjects(false);
          Swal.fire({
            icon: "success",
            title: "¡Proyecto guardado!",
            text: result.message,
            showConfirmButton: false,
            timer: 3000,
          });
          fetchProjects();
        } else {
          setOpenModalProjects(false);
          Swal.fire({
            icon: "error",
            title: "No se pudo agregar el proyecto",
            text:
              result.message ||
              "Por favor, revisá los datos e intentá nuevamente.",
            showConfirmButton: false,
            timer: 3000,
          });
          fetchProjects();
        }
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      Swal.fire({
        icon: "error",
        title: "Error en el servidor",
        text: "Ocurrió un error inesperado. Intentalo más tarde.",
        showConfirmButton: false,
        timer: 3000,
      });
      fetchProjects();
    }
  };
  const handleDelete = (projectoID) => {
    setOpenModalDeleteProject(projectoID);
  };

  const closeModalDeleteProject = () => {
    fetchProjects();
    setOpenModalDeleteProject(null);
  };

  const DeleteProject = async (projectID) => {
    let project = await DProject(projectID);
    setOpenModalProjects(false);
    setOpenModalDeleteProject(null);
    if (project) {
      Swal.fire({
        icon: "success",
        title: "¡Proyecto Eliminado!",
        text: "El proyecto se ha eliminado correctamente.",
        showConfirmButton: false,
        timer: 3000,
      });
      fetchProjects();
    } else {
      Swal.fire({
        icon: "error",
        title: "No se pudo eliminar el proyecto",
        text: "Por favor, revisá los datos e intentá nuevamente.",
        showConfirmButton: false,
        timer: 3000,
      });
      fetchProjects();
    }
  };
  //#endregion

  //#region Tareas

  const CloseModalTaks = () => {
    setOpenModalTask(false);
    fetchProjects();
    setEnableEmissionFields(false);
    setErrors({});
  };

  const DetallesTareas = async (projectID) => {
    setIsEditing(false);
    setOpenModalTask(true);
    setLoading(true);
    try {
      setTasktData({
        proyectID: projectID,
      });
      const tasks = await getTasks(projectID);

      const initialStatus = {};
      tasks.forEach((task) => {
        initialStatus[task.taskId] = task.status;
      });
      setTaskStatus(initialStatus);
      setTasks(tasks);

      const factores = await getFactoresEmision();
      setReductionUnit(factores);
    } catch (error) {
      setTasks(null);
    } finally {
      setLoading(false);
    }
  };

  const SubmitModalTask = async () => {
    try {
      setLoading(true);

      if (!taskData?.titulo?.trim() || !taskData?.descripcion?.trim()) {
        setErrors({
          Tareatitulo: !taskData?.titulo?.trim() ? "Requerido" : "",
          TareaDescripcion: !taskData?.descripcion?.trim() ? "Requerido" : "",
        });
        setLoading(false);
        return;
      }

      if (
        !taskData?.valorActividad &&
        !taskData?.factorEmisionId &&
        !taskData?.emisionesCO2e
      ) {
        taskData.valorActividad = null;
        taskData.factorEmisionId = null;
        taskData.emisionesCO2e = null;
      } else {
        const errores = {};
        if (
          taskData?.valorActividad === null ||
          taskData?.valorActividad === ""
        ) {
          errores.valorActividad = "Requerido";
        }
        if (!taskData?.factorEmisionId) {
          errores.factorEmisionId = "Requerido";
        }
        if (taskData?.emisionesCO2e === null || taskData.emisionesCO2e === "") {
          errores.emisionesCO2e = "Requerido";
        }

        if (Object.keys(errores).length > 0) {
          setErrors(errores);
          setLoading(false);
          return;
        }
      }

      const result = await AddTask(taskData);

      if (result.success) {
        Swal.fire({
          icon: "success",
          title: "¡Tarea agregada!",
          text: result.message,
          showConfirmButton: false,
          timer: 2000,
        });
        fetchProjects();
        setOpenModalTask(false);
        setEnableEmissionFields(false);
      } else {
        Swal.fire({
          icon: "error",
          title: "No se pudo agregar la tarea",
          text:
            result.message ||
            "Por favor, revisá los datos e intentá nuevamente.",
          showConfirmButton: false,
          timer: 2000,
        });
        fetchProjects();
        setOpenModalTask(false);
        setEnableEmissionFields(false);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setOpenModalTask(false);
      Swal.fire({
        icon: "error",
        title: "Error en el servidor",
        text: "Ocurrió un error inesperado. Intentalo más tarde.",
        confirmButtonColor: "#d33",
      }).then(() => {
        window.location.reload();
      });
    }
  };

  const UpdateTask = async () => {
    setLoading(true);
    try {
      if (!taskData?.titulo?.trim() || !taskData?.descripcion?.trim()) {
        setErrors({
          Tareatitulo: !taskData?.titulo?.trim() ? "Requerido" : "",
          TareaDescripcion: !taskData?.descripcion?.trim() ? "Requerido" : "",
        });
        setLoading(false);
        return;
      }

      if (
        !taskData?.valorActividad &&
        !taskData?.factorEmisionId &&
        !taskData?.emisionesCO2e
      ) {
        taskData.valorActividad = null;
        taskData.factorEmisionId = null;
        taskData.emisionesCO2e = null;
      } else {
        const errores = {};
        if (
          taskData?.valorActividad === null ||
          taskData?.valorActividad === ""
        ) {
          errores.valorActividad = "Requerido";
        }
        if (!taskData?.factorEmisionId) {
          errores.factorEmisionId = "Requerido";
        }
        if (taskData?.emisionesCO2e === null || taskData.emisionesCO2e === "") {
          errores.emisionesCO2e = "Requerido";
        }

        if (Object.keys(errores).length > 0) {
          setLoading(false);
          setErrors(errores);
          return;
        }
      }

      const result = await UpdateTaskt(taskData);

      if (result.success) {
        setOpenModalTask(false);
        setEditTaskId(null);
        Swal.fire({
          icon: "success",
          title: "¡Tarea actualizada!",
          text: result.message,
          showConfirmButton: false,
          timer: 3000,
        });
        fetchProjects();
        setEnableEmissionFields(false);
      } else {
        setOpenModalTask(false);
        Swal.fire({
          icon: "error",
          title: "No se pudo actualizar la tarea",
          text:
            result.message ||
            "Por favor, revisá los datos e intentá nuevamente.",
          showConfirmButton: false,
          timer: 3000,
        });
      }
      setLoading(false);
      setEnableEmissionFields(false);
    } catch (error) {
      setLoading(false);
      setOpenModalTask(false);
      Swal.fire({
        icon: "error",
        title: "Error en el servidor",
        text: "Ocurrió un error inesperado. Intentalo más tarde.",
        confirmButtonColor: "#d33",
      }).then(() => {
        window.location.reload();
      });
    }
  };

  const Delete_Task = async (taskID) => {
    let task = await DeleteTask(taskID);
    setOpenModalTask(false);
    if (task) {
      Swal.fire({
        icon: "success",
        title: "Tarea Eliminado!",
        text: "El proyecto se ha eliminado correctamente.",
        showConfirmButton: false,
        timer: 2000,
      });
      fetchProjects();
    } else {
      Swal.fire({
        icon: "error",
        title: "No se pudo eliminar la tarea",
        text: "Por favor, revisá los datos e intentá nuevamente.",
        showConfirmButton: false,
        timer: 2000,
      });
    }
  };

  const handleTaskDataChange = (field, value) => {
    const updatedData = { ...taskData, [field]: value };

    // Si ya tenemos valor de actividad y factor, calculamos emisiones
    const actividad = parseFloat(updatedData.valorActividad);
    const factorObj = reductionUnit.find(
      (u) => u.id === Number(updatedData.factorEmisionId)
    );

    if (actividad && factorObj) {
      updatedData.emisionesCO2e = (actividad * factorObj.valueFactor).toFixed(
        2
      ); // opcional: 2 decimales
    } else {
      updatedData.emisionesCO2e = "";
    }

    setTasktData(updatedData);
  };

  const handleEditTask = (task) => {
    handleTaskDataChange("valorActividad", task.valorActividad);
    handleTaskDataChange("FactorEmisionId", task.valueFactor);
    setTasktData(task); // precarga los datos
    setTabIndex(0); // cambia al tab de agregar/editar
    setIsEditing(true);

    // Activa el switch si la tarea ya tenía datos
    const hasOptionalValues =
      task.valorActividad !== null &&
      task.valorActividad !== 0 &&
      task.factorEmisionId !== null;
    setEnableEmissionFields(hasOptionalValues);
  };

  const UpdateStatusTasks = (taskId) => (event) => {
    const newStatus = event.target.checked;
    setTaskStatus((prev) => ({
      ...prev,
      [taskId]: newStatus,
    }));

    UpdateStatusTask(taskId, newStatus)
      .then(() => {})
      .catch((err) => {
        console.error("Error al actualizar estado", err);
      });
  };

  //#endregion

  const columns = [
    { Header: "Nombre", accessor: "nombre", align: "left" },
    { Header: "Descripción", accessor: "descripcion", align: "left" },
    { Header: "Inicio", accessor: "fechaInicio", align: "center" },
    { Header: "Final", accessor: "fechaFinal", align: "center" },
    { Header: "Estado", accessor: "estatus", align: "center" },

    { Header: "Acciones", accessor: "action", align: "center" },
  ];

  const rows = projects.map((project) => ({
    nombre: (
      <MDTypography variant="caption" fontWeight="medium">
        {project.nombre}
      </MDTypography>
    ),
    descripcion: (
      <MDTypography variant="caption" color="text">
        {project.descripcion}
      </MDTypography>
    ),

    fechaInicio: (
      <MDTypography variant="caption" color="text">
        {dayjs(project.fechaInicio, "DD-MM-YYYY").format("DD/MM/YYYY")}
      </MDTypography>
    ),
    fechaFinal: (
      <MDTypography variant="caption" color="text">
        {dayjs(project.fechaFinal, "DD-MM-YYYY").format("DD/MM/YYYY")}
      </MDTypography>
    ),
    estatus: (
      <MDTypography variant="caption" color="text">
        {project.estatus ? "Realizado" : "Pendiente"}
      </MDTypography>
    ),
    action: (
      <Stack
        direction="row"
        spacing={1}
        justifyContent="center"
        alignItems="center"
      >
        <Tooltip title="Ver tareas">
          <IconButton
            size="small"
            onClick={() => DetallesTareas(project.proyectoId)}
          >
            <RemoveRedEyeOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Editar">
          <IconButton
            size="small"
            color="info"
            onClick={() => ModalUpdateProject(project)}
          >
            <EditOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Eliminar">
          <IconButton
            size="small"
            color="error"
            onClick={() => handleDelete(project.proyectoId)}
          >
            <DeleteOutlineOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    ),
  }));

  return (
    <DashboardLayout>
      <DashboardNavbar></DashboardNavbar>
      <MDBox py={3}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <MDBox mb={2}>
            <MDBox
              sx={{
                borderRadius: 2,
                p: 3,
                mb: 2,
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
              }}
            >
              {/* <CHANGE> Header responsive */}
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
                spacing={{ xs: 1, md: 2 }}
                sx={{
                  flexDirection: { xs: "column", md: "row" },
                  gap: { xs: 2, md: 0 },
                }}
              >
                <Grid item xs={12} md="auto">
                  <MDBox display="flex" flexDirection="column">
                    <MDBox display="flex" alignItems="center" gap={1}>
                      <MDTypography variant="h6">Proyectos</MDTypography>
                    </MDBox>
                    <MDTypography variant="body2" color="text">
                      Filtra, organiza y administra tus proyectos fácilmente.
                    </MDTypography>
                  </MDBox>
                </Grid>
                <Grid item xs={12} md="auto">
                  <MDButton
                    variant="outlined"
                    startIcon={<AddOutlined />}
                    fullWidth={{ xs: true, md: false }}
                    sx={{
                      borderColor: "#4CAF50",
                      color: "#4CAF50",
                      "&:hover": {
                        backgroundColor: "#E8F5E9",
                        borderColor: "#43A047",
                        color: "#388E3C",
                      },
                    }}
                    onClick={ModalSaveProject}
                  >
                    Agregar Proyecto
                  </MDButton>
                </Grid>
              </Grid>

              {/* <CHANGE> Filtros responsive - vertical en móvil, horizontal en desktop */}
              <Grid
                container
                alignItems={{ xs: "stretch", md: "center" }}
                justifyContent="space-between"
                spacing={2}
                mt={2}
                sx={{ flexDirection: { xs: "column", md: "row" } }}
              >
                <Grid item xs={12} md="auto">
                  <Grid
                    container
                    spacing={2}
                    sx={{ flexDirection: { xs: "column", md: "row" } }}
                  >
                    <Grid item xs={12} sm={6} md="auto">
                      <FormControl size="medium" sx={{ width: "100%" }}>
                        <InputLabel id="Estado-label">Estado</InputLabel>
                        <Select
                          labelId="Estado-label"
                          name="estado"
                          label="Estado"
                          fullWidth
                          value={filter}
                          onChange={(e) => setFilter(e.target.value)}
                          sx={{ height: 45, textAlign: "left" }}
                        >
                          <MenuItem value="todos">Todos</MenuItem>
                          <MenuItem value="true">Realizados</MenuItem>
                          <MenuItem value="false">Pendientes</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md="auto">
                      <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                        adapterLocale="es"
                      >
                        <DatePicker
                          label="Fecha Inicio"
                          value={
                            startDate ? dayjs(startDate, "DD-MM-YYYY") : null
                          }
                          onChange={(newValue) => setStartDate(newValue)}
                          inputFormat="DD-MM-YYYY"
                          slotProps={{
                            textField: {
                              size: "small",
                              sx: {
                                width: "100%",
                                fontFamily:
                                  '"Roboto", "Helvetica", "Arial", sans-serif',
                                fontSize: "0.875rem",
                                color: "rgba(0, 0, 0, 0.87)",
                                "& .MuiInputBase-input": {
                                  fontSize: "0.875rem",
                                  padding: "10px 14px",
                                  color: "rgba(0, 0, 0, 0.87)",
                                },
                                "& .MuiInputLabel-root": {
                                  fontSize: "0.875rem",
                                  color: "rgba(0, 0, 0, 0.6)",
                                },
                                "& .MuiOutlinedInput-root": {
                                  "& fieldset": {
                                    borderColor: "rgba(0, 0, 0, 0.23)",
                                  },
                                  "&:hover fieldset": {
                                    borderColor: "#1976d2",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "#1976d2",
                                  },
                                },
                              },
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </Grid>

                    <Grid item xs={12} sm={6} md="auto">
                      <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                        adapterLocale="es"
                      >
                        <DatePicker
                          label="Fecha Fin"
                          value={endDate}
                          onChange={(newValue) => setEndDate(newValue)}
                          inputFormat="DD-MM-YYYY"
                          slotProps={{
                            textField: {
                              size: "small",
                              sx: {
                                width: "100%",
                                fontFamily:
                                  '"Roboto", "Helvetica", "Arial", sans-serif',
                                fontSize: "0.875rem",
                                color: "rgba(0, 0, 0, 0.87)",
                                "& .MuiInputBase-input": {
                                  fontSize: "0.875rem",
                                  padding: "10px 14px",
                                  color: "rgba(0, 0, 0, 0.87)",
                                },
                                "& .MuiInputLabel-root": {
                                  fontSize: "0.875rem",
                                  color: "rgba(0, 0, 0, 0.6)",
                                },
                                "& .MuiOutlinedInput-root": {
                                  "& fieldset": {
                                    borderColor: "rgba(0, 0, 0, 0.23)",
                                  },
                                  "&:hover fieldset": {
                                    borderColor: "#1976d2",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: "#1976d2",
                                  },
                                },
                              },
                            },
                          }}
                        />
                      </LocalizationProvider>
                    </Grid>
                  </Grid>
                </Grid>

                {/* <CHANGE> Botones responsive - apilados en móvil */}
                <Grid item xs={12} md="auto">
                  <MDBox
                    display="flex"
                    gap={1}
                    sx={{ flexDirection: { xs: "column", md: "row" } }}
                  >
                    <MDButton
                      onClick={SearchByDate}
                      variant="outlined"
                      color="info"
                      fullWidth={{ xs: true, md: false }}
                    >
                      Buscar por fecha
                    </MDButton>
                    <MDButton
                      onClick={ClearDates}
                      variant="outlined"
                      color="secondary"
                      fullWidth={{ xs: true, md: false }}
                    >
                      Limpiar fechas
                    </MDButton>
                    {Array.isArray(data) && data.length > 0 && (
                      <MDButton
                        variant="outlined"
                        onClick={CreatePDFAPI}
                        color="error"
                        fullWidth={{ xs: true, md: false }}
                      >
                        Descargar Reporte
                      </MDButton>
                    )}
                  </MDBox>
                </Grid>
              </Grid>
            </MDBox>

            {/* <CHANGE> Tabla con tamaño responsivo */}
            <Grid size={{ xs: 12 }} mt={{ xs: 5, md: 10 }}>
              <Card>
                <MDBox
                  mx={2}
                  mt={-3}
                  py={3}
                  px={2}
                  variant="gradient"
                  bgColor="success"
                  borderRadius="lg"
                  coloredShadow="success"
                >
                  <MDTypography variant="h6" color="white" align="left">
                    Proyectos
                  </MDTypography>
                </MDBox>
                <MDBox>
                  <MDBox>
                    <Grid container spacing={5}>
                      <Grid size={{ xs: 12 }}>
                        <Card>
                          <MDBox
                            pt={3}
                            sx={{
                              p: { xs: 2, md: 3 },
                              textAlign: "center",
                              width: "100%",
                              alignItems: "center",
                              justifyContent: "center",
                              overflowX: "auto",
                            }}
                          >
                            <DataTable
                              table={{ columns, rows }}
                              isSorted={false}
                              entriesPerPage={false}
                              showTotalEntries={true}
                              noEndBorder
                              loading={loading}
                            />
                          </MDBox>
                        </Card>
                      </Grid>
                    </Grid>
                  </MDBox>
                </MDBox>
              </Card>
            </Grid>
          </MDBox>
        </LocalizationProvider>
      </MDBox>

      <Dialog
        open={openModalProjects}
        onClose={closeModalProject}
        fullWidth
        maxWidth="sm"
        sx={{
          "& .MuiDialog-paper": {
            width: "90%",
            maxWidth: { xs: "90%", sm: "90%", md: "850px" },
          },
        }}
      >
        <DialogTitle>
          <MDBox
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <MDTypography variant="h5">
              {modoEdicion ? "Editar Proyecto" : "Nuevo Proyecto"}
            </MDTypography>
            <IconButton onClick={closeModalProject}>
              <CloseIcon />
            </IconButton>
          </MDBox>
        </DialogTitle>

        <DialogContent dividers>
          <TextField
            fullWidth
            label="Nombre"
            name="nombre"
            margin="normal"
            value={projectData.nombre}
            onChange={(e) => {
              setProjecttData({ ...projectData, nombre: e.target.value });
              setErrors((prev) => ({ ...prev, nombre: "" }));
            }}
            error={!!errors.nombre}
            helperText={errors.nombre}
            sx={{
              mb: 2,
              "& .MuiInputBase-root": {
                fontSize: { xs: "0.875rem", md: "1rem" },
              },
            }}
          />

          <TextField
            fullWidth
            label="Descripción"
            name="descripcion"
            margin="normal"
            value={projectData.descripcion}
            onChange={(e) =>{
              setProjecttData({ ...projectData, descripcion: e.target.value });
              setErrors((prev) => ({ ...prev, descripcion: "" }));
            }}
            multiline
            rows={3}
            error={!!errors.descripcion}
            helperText={errors.descripcion}
            sx={{
              mb: 2,
              "& .MuiInputBase-root": {
                fontSize: { xs: "0.875rem", md: "1rem" },
              },
            }}
          />

          <Box
            sx={{
              display: "flex",
              gap: 2,
              mt: 2,
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
              <DatePicker
                label="Fecha de Inicio"
                name="fechainicio"
                value={
                  projectData.fechaInicio
                    ? dayjs(projectData.fechaInicio, "DD-MM-YYYY")
                    : null
                }
                onChange={(newValue) => {
                  setProjecttData({
                    ...projectData,
                    fechaInicio: newValue ? newValue.format("DD-MM-YYYY") : "",
                    fechaFinal: "",
                  });
                  setErrors({ ...errors, fechainicio: "" });
                }}
                inputFormat="DD-MM-YYYY"
                minDate={dayjs()}
                slotProps={{
                  textField: {
                    size: "small",
                    error: !!errors.fechainicio,
                    helperText: errors.fechainicio,
                    fullWidth: true,
                    sx: {
                      flex: { xs: 1, md: 1 },
                      "& .MuiInputBase-root": {
                        fontSize: { xs: "0.75rem", md: "0.875rem" },
                      },
                      "& input": {
                        padding: { xs: "8px 10px", md: "10px 12px" },
                        fontSize: { xs: "0.75rem", md: "0.875rem" },
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>

            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
              <DatePicker
                label="Fecha Final"
                name="fechafinal"
                value={
                  projectData.fechaFinal
                    ? dayjs(projectData.fechaFinal, "DD-MM-YYYY")
                    : null
                }
                onChange={(newValue) => {
                  if (newValue) {
                    const fechaInicio = dayjs(
                      projectData.fechaInicio,
                      "DD-MM-YYYY"
                    );
                    const diferencia = newValue.diff(fechaInicio, "day");

                    if (diferencia < 5) {
                      alert(
                        "La fecha final debe ser al menos 5 días después de la fecha de inicio."
                      );
                      return;
                    }
                  }

                  setProjecttData({
                    ...projectData,
                    fechaFinal: newValue ? newValue.format("DD-MM-YYYY") : "",
                  });
                  setErrors({ ...errors, fechafinal: "" });
                }}
                inputFormat="DD-MM-YYYY"
                disabled={!projectData.fechaInicio}
                minDate={
                  projectData.fechaInicio
                    ? dayjs(projectData.fechaInicio, "DD-MM-YYYY").add(5, "day")
                    : dayjs()
                }
                slotProps={{
                  textField: {
                    size: "small",
                    error: !!errors.fechafinal,
                    helperText: errors.fechafinal,
                    fullWidth: true,
                    sx: {
                      flex: { xs: 1, md: 1 },
                      "& .MuiInputBase-root": {
                        fontSize: { xs: "0.75rem", md: "0.875rem" },
                      },
                      "& input": {
                        padding: { xs: "8px 10px", md: "10px 12px" },
                        fontSize: { xs: "0.75rem", md: "0.875rem" },
                      },
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Box>
        </DialogContent>

        <DialogActions>
          <MDBox
            sx={{
              display: "flex",
              gap: 1,
              flexDirection: { xs: "column-reverse", md: "row" },
              width: { xs: "100%", md: "auto" },
            }}
          >
            <MDButton
              variant="outlined"
              color="error"
              onClick={closeModalProject}
              sx={{
                mr: { xs: 0, md: 1 },
                width: { xs: "100%", md: "auto" },
              }}
            >
              Cancelar
            </MDButton>
            <MDButton
              variant="gradient"
              color="success"
              onClick={HandleProjects}
             
              sx={{
                width: { xs: "100%", md: "auto" },
              }}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : modoEdicion ? (
                "Guardar cambios"
              ) : (
                "Agregar proyecto"
              )}
            </MDButton>
          </MDBox>
        </DialogActions>
      </Dialog>
      {/* Fin del Modal para agregar un nuevo proyecto */}

      <Dialog
        open={openModalTask}
        onClose={CloseModalTaks}
        fullWidth
        maxWidth={isMobile ? "sm" : "md"}
        sx={{
          "& .MuiDialog-paper": {
            width: isMobile ? "95%" : "100%",
            maxWidth: isMobile ? "100vw" : undefined,
          },
        }}
      >
        <DialogTitle>
          <MDBox
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <MDTypography variant={isMobile ? "h6" : "h5"}>
              Gestión de Actividades
            </MDTypography>
            <IconButton onClick={CloseModalTaks}>
              <CloseIcon />
            </IconButton>
          </MDBox>
        </DialogTitle>
        <DialogContent dividers>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            variant={isMobile ? "scrollable" : "standard"}
            scrollButtons={isMobile ? "auto" : false}
            sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: "#308D21",
                color: "#FFFFFF",
              },
              "& .MuiTab-root": {
                fontSize: isMobile ? "0.75rem" : "0.875rem",
                minWidth: isMobile ? "auto" : "160px",
              },
            }}
          >
            <Tab
              label="Agregar Actividades"
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "#308D21",
                  color: "#FFFFFF !important",
                },
              }}
            />
            <Tab
              label="Ver Actividades"
              sx={{
                "&.Mui-selected": {
                  backgroundColor: "#308D21",
                  color: "#FFFFFF !important",
                },
              }}
            />
          </Tabs>

          {tabIndex === 0 && (
            <Box mt={2} sx={{ px: { xs: 0, md: 2 } }}>
              <TextField
                fullWidth
                label="Título"
                name="Tareatitulo"
                margin="normal"
                value={taskData.titulo}
                onChange={(e) => {
                  setTasktData({ ...taskData, titulo: e.target.value });
                  setErrors((prev) => ({ ...prev, Tareatitulo: "" }));
                }}
                error={!!errors.Tareatitulo}
                helperText={errors.Tareatitulo}
                sx={{ mb: 2 }}
                size={isMobile ? "small" : "medium"}
              />
              <TextField
                fullWidth
                label="Descripción"
                name="TareaDescripcion"
                margin="normal"
                multiline
                rows={isMobile ? 2 : 3}
                value={taskData.descripcion}
                onChange={(e) => {
                  setTasktData({ ...taskData, descripcion: e.target.value });
                  setErrors((prev) => ({ ...prev, TareaDescripcion: "" }));
                }}
                inputProps={{ maxLength: 50 }}
                error={!!errors.TareaDescripcion}
                helperText={errors.TareaDescripcion}
                sx={{ mb: 2 }}
                size={isMobile ? "small" : "medium"}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={enableEmissionFields}
                    onChange={(e) => setEnableEmissionFields(e.target.checked)}
                    color="primary"
                    size={isMobile ? "small" : "medium"}
                  />
                }
                label={
                  <Typography variant={isMobile ? "body2" : "body1"}>
                    Agregar datos de emisión
                  </Typography>
                }
              />

              {enableEmissionFields && (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      mt: 2,
                      flexDirection: { xs: "column", md: "row" },
                    }}
                  >
                    <TextField
                      fullWidth
                      label="Valor Actividad"
                      name="valorActividad"
                      type="number"
                      value={taskData.valorActividad || ""}
                      error={!!errors.valorActividad}
                      helperText={errors.valorActividad}
                      sx={{ mb: 2 }}
                      onChange={(e) => {
                        handleTaskDataChange("valorActividad", e.target.value);
                        setErrors((prev) => ({ ...prev, valorActividad: "" }));
                      }}
                      size={isMobile ? "small" : "medium"}
                    />

                    <FormControl
                      fullWidth
                      error={!!errors.factorEmisionId}
                      sx={{ mb: 2 }}
                      size={isMobile ? "small" : "medium"}
                    >
                      <InputLabel id="unidad-label">Factor emisión</InputLabel>
                      <Select
                        sx={{
                          height: 43, // Aumenta la altura
                        }}
                        labelId="unidad-label"
                        id="factorEmisionId"
                        name="factorEmisionId"
                        label="factorEmisionId"
                        value={taskData.factorEmisionId || ""}
                        onChange={(e) => {
                          handleTaskDataChange(
                            "factorEmisionId",
                            e.target.value
                          );
                          setErrors((prev) => ({
                            ...prev,
                            factorEmisionId: "",
                          }));
                        }}
                      >
                        {Array.isArray(reductionUnit) &&
                          reductionUnit.map((unidad) => (
                            <MenuItem key={unidad.id} value={unidad.id}>
                              {unidad.name}
                            </MenuItem>
                          ))}
                      </Select>
                      {errors.factorEmisionId && (
                        <FormHelperText>
                          {errors.factorEmisionId}
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Box>

                  <TextField
                    fullWidth
                    label="Emisiones CO2"
                    name="EmisionesCO2e"
                    margin="normal"
                    value={taskData.emisionesCO2e || ""}
                    InputProps={{
                      readOnly: true,
                    }}
                    size={isMobile ? "small" : "medium"}
                  />
                </>
              )}
            </Box>
          )}

          {tabIndex === 1 && (
            <Box mt={2}>
              {tasks.length === 0 ? (
                <Typography>No hay actividades registradas.</Typography>
              ) : (
                <List sx={{ p: { xs: 0, md: 1 } }}>
                  {tasks.map((task) => (
                    <ListItem
                      key={task.taskId}
                      divider
                      secondaryAction={
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: isMobile ? 0.5 : 1,
                            flexWrap: isMobile ? "wrap" : "nowrap",
                          }}
                        >
                          <Tooltip title="Cambiar estado" arrow>
                            <Switch
                              checked={!!taskStatus[task.taskId]}
                              onChange={UpdateStatusTasks(task.taskId)}
                              slotProps={{
                                input: {
                                  "aria-label": "cambiar estado tarea",
                                },
                              }}
                              size={isMobile ? "small" : "medium"}
                              sx={{
                                "& .MuiSwitch-thumb": {
                                  backgroundColor: taskStatus[task.taskId]
                                    ? "#2DA14C"
                                    : "#D32F2F",
                                },
                                "& .Mui-checked": {
                                  color: taskStatus[task.taskId]
                                    ? "#2DA14C"
                                    : "#D32F2F",
                                },
                                "& .MuiSwitch-track": {
                                  backgroundColor: taskStatus[task.taskId]
                                    ? "#77d27dff"
                                    : "#FFCDD2",
                                },
                              }}
                            />
                          </Tooltip>
                          <Tooltip title="Editar tarea" arrow>
                            <IconButton
                              color="info"
                              edge="end"
                              aria-label="editar"
                              onClick={() => handleEditTask(task)}
                              size={isMobile ? "small" : "medium"}
                            >
                              <EditOutlinedIcon
                                fontSize={isMobile ? "small" : "inherit"}
                              />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar tarea" arrow>
                            <IconButton
                              color="error"
                              edge="end"
                              aria-label="eliminar"
                              onClick={() => {
                                Delete_Task(task.taskId);
                              }}
                              size={isMobile ? "small" : "medium"}
                              sx={{ mr: isMobile ? 0 : 2 }}
                            >
                              <DeleteOutlineOutlinedIcon
                                fontSize={isMobile ? "small" : "inherit"}
                              />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      }
                      sx={{
                        flexDirection: isMobile ? "column" : "row",
                        alignItems: isMobile ? "flex-start" : "center",
                      }}
                    >
                      <ListItemText
                        primary={
                          <Typography
                            variant={isMobile ? "body2" : "body1"}
                            sx={{ wordBreak: "break-word" }}
                          >
                            {task.titulo} -{" "}
                            {task.emisionesCO2e === 0 ||
                            task.emisionesCO2e === null
                              ? "N/A"
                              : task.emisionesCO2e}
                          </Typography>
                        }
                        secondary={
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: 0.5,
                              mt: isMobile ? 1 : 0.5,
                            }}
                          >
                            <Typography
                              variant={isMobile ? "caption" : "body2"}
                              sx={{ wordBreak: "break-word" }}
                            >
                              <strong>Descripción:</strong> {task.descripcion}
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                gap: isMobile ? 1 : 2,
                                mt: 0.5,
                                flexDirection: { xs: "column", sm: "row" },
                              }}
                            >
                              <Typography
                                variant={isMobile ? "caption" : "body2"}
                              >
                                <strong>Valor actividad:</strong>{" "}
                                {task.valorActividad === 0 ||
                                task.valorActividad === null
                                  ? "N/A"
                                  : task.valorActividad}
                              </Typography>
                              <Typography
                                variant={isMobile ? "caption" : "body2"}
                              >
                                <strong>Factor de emisión:</strong>{" "}
                                {task.factorEmisionName}
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions
          sx={{
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? 1 : 0,
            p: isMobile ? 2 : 1,
          }}
        >
          <MDButton
            color="error"
            variant="outlined"
            onClick={CloseModalTaks}
            fullWidth={isMobile}
          >
            Cerrar
          </MDButton>

          {tabIndex === 0 && (
            <MDButton
              variant="contained"
              color="success"
              onClick={() => {
                if (IsEditing) {
                  UpdateTask();
                } else {
                  SubmitModalTask();
                }
              }}
              fullWidth={isMobile}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Guardar tarea"
              )}
            </MDButton>
          )}
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={Boolean(openModalDeleteProject)}
        onClose={closeModalDeleteProject}
      >
        <DialogTitle>
          <MDBox
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <MDTypography variant="h5"> Confirmar eliminación</MDTypography>
            <IconButton onClick={closeModalDeleteProject}>
              <CloseIcon />
            </IconButton>
          </MDBox>
        </DialogTitle>

        <DialogContent dividers>
          <MDTypography variant="body1" color="text">
            ¿Confirma que desea eliminar este proyecto?
            <br />
            Tenga en cuenta que{" "}
            <strong>
              todas las tareas vinculadas también serán eliminadas
            </strong>
            .
          </MDTypography>
          <MDTypography
            variant="body2"
            color="error"
            sx={{ mt: 1, fontWeight: 500 }}
          >
            Esta acción no se puede deshacer.
          </MDTypography>
        </DialogContent>

        <DialogActions>
          <MDButton
            onClick={closeModalDeleteProject}
            variant="outlined"
            color="secondary"
          >
            Cancelar
          </MDButton>
          <MDButton
            onClick={() => DeleteProject(openModalDeleteProject)}
            variant="gradient"
            color="error"
          >
            Eliminar
          </MDButton>
        </DialogActions>
      </Dialog>

      <Footer />
    </DashboardLayout>
  );
}
export default ProjectPage;
