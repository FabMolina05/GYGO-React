import React, { useState, useEffect } from 'react'
import { getDashboardGroup } from '../API/DashboardGroup';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Grid,
  Chip,
  Avatar,
  LinearProgress,
  IconButton,
  Divider
} from "@mui/material"
import {
  TrendingUp,
  Assessment,
  Folder,
  CalendarToday,
  Timeline,
  Speed,
  Group,
  ArrowForward,
  PlayArrow,
  CheckCircle,
  Schedule,
  MoreVert,
} from "@mui/icons-material"

import { useNavigate } from 'react-router-dom';
import { Carousel } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';



export const ModernDashboardCards = ({role}) => {
  const navigate = useNavigate();
  const [data, setData] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      const result = await getDashboardGroup()

      setData(result)
    }
    fetchData()
  }, [])

  if (!data) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Box textAlign="center" color="#ffffff">
          <CircularProgress size={60} thickness={4} sx={{ color: "#ffffff", mb: 2 }} />
          <Typography>Cargando dashboard...</Typography>
        </Box>
      </Box>
    )
  }

  const handleVerConsumos = () => {
    navigate("/consumo")
  }
  const handleVerProyecto = () => {
    navigate("/proyectos")
  }

  const handleVerReportes = ( ) =>{
    navigate("/reportes-emisiones")
  }
  const { groupName, projects, consumptions, hasProjects, hasConsumption } = data


  const getProjectStatus = (fechaInicio, fechaFinal) => {
    const now = new Date()
    const inicio = new Date(fechaInicio)
    const final = new Date(fechaFinal)

    if (now < inicio) {
      return {
        status: "Próximo",
        color: "#b3261e",
        bgColor: "#f7f7f2",
        icon: <Schedule />,
        textColor: "#b3261e",
      }
    }
    if (now > final) {
      return {
        status: "Completado",
        color: "#376d4f",
        bgColor: "#f7f7f2",
        icon: <CheckCircle />,
        textColor: "#376d4f",
      }
    }
    return {
      status: "En Progreso",
      color: "#7d4f50",
      bgColor: "#f7f7f2",
      icon: <PlayArrow />,
      textColor: "#7d4f50",
    }
  }


  const getProjectProgress = (fechaInicio, fechaFinal) => {
    const now = new Date()
    const inicio = new Date(fechaInicio)
    const final = new Date(fechaFinal)
    const total = final - inicio
    const elapsed = now - inicio
    return Math.max(0, Math.min(100, (elapsed / total) * 100))
  }

  return (
    <Grid container spacing={3}>
      {/* Header Card */}
      <Grid size={{xs: 12}}>
        <Card
          sx={{
            background: "#ffffff",
            borderRadius: 2,
            boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
            border: "1px solid #e5e7eb",
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Box display="flex" alignItems="center" mb={3}>
              <Avatar
                sx={{
                  bgcolor: "#376D4F",
                  mr: 3,
                  width: 56,
                  height: 56,
                }}
              >
                <Group fontSize="large" />
              </Avatar>
              <Box>
                <Typography variant="h5" fontWeight="600" color="#111827">
                  {groupName}
                </Typography>
                <Typography variant="body1" color="#6b7280">
                  Panel de control del grupo
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ mb: 3 }} />

            <Grid container spacing={2}>
              <Grid size={{xs: 12, md:4}}>
                <Button
                  onClick={handleVerConsumos}
                  variant="contained"
                  fullWidth
                  startIcon={<TrendingUp />}
                  sx={{
                    py: 1.5,
                    borderRadius: 1.5,
                    fontWeight: "500",
                    textTransform: "none",
                    fontSize: "0.95rem",
                    bgcolor: "#376D4F",
                    color: "#ffffff",
                    boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
                    "&:hover": {
                      bgcolor: "#1f2937",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                    },
                  }}
                >
                  Ver Consumo
                </Button>
              </Grid>
              <Grid size={{xs:12, md:4}}>
                <Button
                  variant="outlined"
                  fullWidth
                  startIcon={<Assessment />}
                  onClick={() => navigate("/perfil")}
                  sx={{
                    py: 1.5,
                    borderRadius: 1.5,
                    fontWeight: "500",
                    textTransform: "none",
                    fontSize: "0.95rem",
                    borderColor: "#d1d5db",
                    color: "#374151",
                    "&:hover": {
                      borderColor: "#9ca3af",
                      bgcolor: "#f9fafb",
                    },
                  }}
                >
                  Información General
                </Button>
              </Grid>
              <Grid size={{xs:12, md:4}}>
                <Button
                  onClick={handleVerProyecto}
                  variant="outlined"
                  fullWidth
                  startIcon={<Folder />}
                  sx={{
                    py: 1.5,
                    borderRadius: 1.5,
                    fontWeight: "500",
                    textTransform: "none",
                    fontSize: "0.95rem",
                    borderColor: "#d1d5db",
                    color: "#374151",
                    "&:hover": {
                      borderColor: "#9ca3af",
                      bgcolor: "#f9fafb",
                    },
                  }}
                >
                  Ver Proyectos
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      {/* Consumption Summary Card */}
      <Grid size={{xs:12, lg:5}}>
        <Card
          sx={{
            height: 520, // Altura fija
            background: "#ffffff",
            borderRadius: 2,
            boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
            border: "1px solid #e5e7eb",
          }}
        >
          <CardContent sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}>
            <Box display="flex" alignItems="center" mb={3}>
              <Avatar sx={{ bgcolor: "#376D4F", mr: 2, width: 40, height: 40 }}>
                <Speed />
              </Avatar>
              <Typography variant="h6" fontWeight="600" color="#111827">
                Resumen de Consumo
              </Typography>
            </Box>

            <Box sx={{ flexGrow: 1, overflow: "auto" }}>
              {hasConsumption ? (
                <Box>
                  {consumptions.slice(0, 4).map((c, index) => (
                    <Box key={c.id || index} sx={{ mb: 3 }}>
                      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                        <Typography variant="body2" fontWeight="500" color="#111827">
                          {c.factor}
                        </Typography>
                        <Chip
                          label={c.unidad || "sin unidad"}
                          size="small"
                          sx={{
                            bgcolor: "#f3f4f6",
                            color: "#374151",
                            fontWeight: "500",
                            fontSize: "0.75rem",
                          }}
                        />
                      </Box>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="caption" color="#6b7280">
                          Total: <strong>{c.totalAmount}</strong>
                        </Typography>
                        <Typography variant="caption" fontWeight="500" color="#111827">
                          Emisiones: <strong>{c.totalEmissions} kg CO₂</strong>
                        </Typography>
                      </Box>
                      {index < Math.min(consumptions.length, 4) - 1 && <Divider sx={{ mt: 2 }} />}
                    </Box>
                  ))}
                </Box>
              ) : (
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  sx={{ height: "100%" }}
                >
                  <Avatar sx={{ bgcolor: "#f3f4f6", mb: 2, width: 64, height: 64 }}>
                    <Speed sx={{ color: "#9ca3af", fontSize: 32 }} />
                  </Avatar>
                  <Typography variant="body1" color="#6b7280" textAlign="center" mb={1}>
                    No hay consumos registrados
                  </Typography>
                  <Typography variant="body2" color="#9ca3af" textAlign="center">
                    Los datos aparecerán aquí cuando estén disponibles
                  </Typography>
                </Box>
              )}
            </Box>

            {hasConsumption && consumptions.length > 4 && (
              <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #e5e7eb" }}>
                <Button
                  variant="text"
                  size="small"
                  onClick={handleVerConsumos}
                  endIcon={<ArrowForward />}
                  sx={{
                    color: "#376D4F",
                    textTransform: "none",
                    fontWeight: "500",
                  }}
                >
                  Ver más consumos (+{consumptions.length - 4})
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Projects Card */}
      <Grid size={{xs:12, lg:7}}>
        <Card
          sx={{
            height: 520, // Altura fija
            background: "#ffffff",
            borderRadius: 2,
            boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
            border: "1px solid #e5e7eb",
          }}
        >
          <CardContent sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
              <Box display="flex" alignItems="center">
                <Avatar sx={{ bgcolor: "#376D4F", mr: 2, width: 40, height: 40 }}>
                  <Folder />
                </Avatar>
                <Typography variant="h6" fontWeight="600" color="#111827">
                  Proyectos del Grupo
                </Typography>
              </Box>
              {hasProjects && (
                <Chip
                  label={`${projects.length} proyecto${projects.length !== 1 ? "s" : ""}`}
                  sx={{
                    bgcolor: "#f3f4f6",
                    color: "#374151",
                    fontWeight: "500",
                  }}
                  variant="outlined"
                />
              )}
            </Box>

            <Box sx={{ flexGrow: 1, overflow: "auto" }}>
              {hasProjects ? (
                <Grid container spacing={2} sx={{ height: "fit-content" }}>
                  {projects.slice(0, 4).map((project) => {
                    const projectStatus = getProjectStatus(project.fechaInicio, project.fechaFinal)
                    const progress = getProjectProgress(project.fechaInicio, project.fechaFinal)
                    return (
                      <Grid size={{xs:12, sm: 6}} key={project.id}>
                        <Card
                          variant="outlined"
                          sx={{
                            height: 165, // Altura fija para las cards de proyecto
                            borderRadius: 1.5,
                            border: "1px solid #e5e7eb",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            "&:hover": {
                              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                              borderColor: "#d1d5db",
                            },
                          }}
                        >
                          <CardContent sx={{ p: 2, height: "100%" ,display: "flex", flexDirection: "column" }}>
                            <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={1}>
                              <Box flex={1} sx={{ minWidth: 0 }}>
                                <Typography
                                  variant="subtitle2"
                                  fontWeight="600"
                                  color="#111827"
                                  sx={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  {project.name}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  color="#6b7280"
                                  sx={{
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden",
                                    lineHeight: 1.2,
                                    mt: 0.5,
                                  }}
                                >
                                  {project.description}
                                </Typography>
                              </Box>
                            </Box>

                            <Box sx={{ mt: "auto" }}>
                              <Box
                                sx={{
                                  bgcolor: projectStatus.bgColor,
                                  p: 1,
                                  borderRadius: 1,
                                  mb: 1,
                                }}
                              >
                                <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.5}>
                                  <Box display="flex" alignItems="center">
                                    <Box sx={{ color: projectStatus.textColor, mr: 0.5, fontSize: 16 }}>
                                      {projectStatus.icon}
                                    </Box>
                                    <Typography
                                      variant="caption"
                                      fontWeight="500"
                                      sx={{ color: projectStatus.textColor }}
                                    >
                                      {projectStatus.status}
                                    </Typography>
                                  </Box>
                                  <Typography
                                    variant="caption"
                                    fontWeight="600"
                                    sx={{ color: projectStatus.textColor }}
                                  >
                                    {Math.round(progress)}%
                                  </Typography>
                                </Box>
                                <LinearProgress
                                  variant="determinate"
                                  value={progress}
                                  sx={{
                                    height: 4,
                                    borderRadius: 2,
                                    bgcolor: "rgba(0,0,0,0.1)",
                                    "& .MuiLinearProgress-bar": {
                                      bgcolor: projectStatus.color,
                                      borderRadius: 2,
                                    },
                                  }}
                                />
                              </Box>

                              <Box display="flex" alignItems="center">
                                <CalendarToday sx={{ fontSize: 12, color: "#9ca3af", mr: 0.5 }} />
                                <Typography variant="caption" color="#6b7280" sx={{ fontSize: "0.7rem" }}>
                                  {new Date(project.fechaInicio).toLocaleDateString()} -{" "}
                                  {new Date(project.fechaFinal).toLocaleDateString()}
                                </Typography>
                              </Box>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    )
                  })}
                </Grid>
              ) : (
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Avatar sx={{ bgcolor: "#f3f4f6", mb: 2, width: 64, height: 64 }}>
                    <Folder sx={{ color: "#9ca3af", fontSize: 32 }} />
                  </Avatar>
                  <Typography variant="body1" color="#6b7280" mb={1} textAlign="center">
                    No hay proyectos en curso
                  </Typography>
                  <Typography variant="body2" color="#9ca3af" textAlign="center">
                    Los proyectos activos aparecerán aquí
                  </Typography>
                </Box>
              )}
            </Box>

            {hasProjects && projects.length > 4 && (
              <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #e5e7eb", textAlign: "center" }}>
                <Button
                  variant="outlined"
                  endIcon={<ArrowForward />}
                  onClick={handleVerProyecto}
                  sx={{
                    borderRadius: 1.5,
                    textTransform: "none",
                    fontWeight: "500",
                    borderColor: "#d1d5db",
                    color: "#376D4F",
                    "&:hover": {
                      borderColor: "#9ca3af",
                      bgcolor: "#f9fafb",
                    },
                  }}
                >
                  Ver todos los proyectos ({projects.length})
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>
      </Grid>

      {/* Reports Card */}
      {role === "GA" &&(
      <Grid size={{xs:12}}>
        <Card
          sx={{
            background: "#a3b18a",
            color: "black",
            borderRadius: 2,
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Grid container alignItems="center" spacing={3}>
              <Grid size={{xs:12, md:8}}>
                <Box display="flex" alignItems="center" mb={2}>
                  <Avatar sx={{ bgcolor: "rgba(255,255,255,0.1)", mr: 2, width: 48, height: 48 }}>
                    <Timeline fontSize="large" />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="600" color='black'>
                      Centro de Reportes
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Accede a informes detallados y analíticas de tu grupo
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid size={{xs:12, md:4}} textAlign={{ xs: "left", md: "right" }}>
                <Button
                  onClick={handleVerReportes}
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForward />}
                  sx={{
                    bgcolor: "#ffffff",
                    color: "#374151",
                    borderRadius: 1.5,
                    textTransform: "none",
                    fontWeight: "500",
                    py: 1.5,
                    px: 3,
                    "&:hover": {
                      bgcolor: "#f9fafb",
                    },
                  }}
                >
                  Ver Reportes
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      )}
    </Grid>
  )
}
