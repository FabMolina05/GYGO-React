import React, { useState, useEffect } from 'react'
import { getSuperAdminDashboard } from '../API/DashboardGroup';
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

export const SuperAdminDashCards = () => {

    const navigate = useNavigate();
    const [data, setData] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            const result = await getSuperAdminDashboard();
           
            setData(result);
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

    const handleVerGrupos = () => {
        navigate("/reportes-empresas")
    }

    const handleVerReportes = () => {
        navigate("/reportes-servicios")
    }

    const { totalGroups, totalUsers, totalUnits, totalSources, totalFactors, recentGroups } = data

    const getGroupStatus = (isActive) => {
        if (isActive) {
            return {
                status: "Activo",
                color: "#376d4f",
                bgColor: "#f7f7f2",
                icon: <CheckCircle />,
                textColor: "#376d4f",
            };
        }
        return {
            status: "Inactivo",
            color: "#b3261e",
            bgColor: "#f7f7f2",
            icon: <Schedule />,
            textColor: "#b3261e",
        };
    };


    return (
        <Grid container spacing={3}>
            <Grid size={{ xs: 12 }}>
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
                                    Panel del Super Admin
                                </Typography>
                                <Typography variant="body1" color="#6b7280">
                                    Gestión de grupos y métricas globales
                                </Typography>
                            </Box>
                        </Box>

                        <Divider sx={{ mb: 3 }} />

                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }} >
                                <Button
                                    onClick={handleVerGrupos}
                                    variant="contained"
                                    fullWidth
                                    startIcon={<Group />}
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
                                    Ver Grupos
                                </Button>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }} >
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
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>

            <Grid size={{ xs: 12, lg: 5 }}>
                <Card
                    sx={{
                        height: 520,
                        background: "#ffffff",
                        borderRadius: 2,
                        boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
                        border: "1px solid #e5e7eb",
                    }}
                >
                    <CardContent sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}>
                        <Box display="flex" alignItems="center" mb={3}>
                            <Avatar sx={{ bgcolor: "#376D4F", mr: 2, width: 40, height: 40 }}>
                                <Assessment />
                            </Avatar>
                            <Typography variant="h6" fontWeight="600" color="#111827">
                                Métricas Globales
                            </Typography>
                        </Box>
                        <Box sx={{
                            flexGrow: 1, overflowY: "auto", pr: 3, 
                            "&::-webkit-scrollbar": {
                                width: "5px", 
                            },
                            "&::-webkit-scrollbar-track": {
                                backgroundColor: "transparent", 
                            },
                            "&::-webkit-scrollbar-thumb": {
                                backgroundColor: "#cbd5e1",
                                borderRadius: "4px",
                            },
                            "&::-webkit-scrollbar-thumb:hover": {
                                backgroundColor: "#94a3b8",
                            },
                        }}>
                            {[
                                { label: "Grupos", value: totalGroups },
                                { label: "Usuarios", value: totalUsers },
                                { label: "Unidades", value: totalUnits },
                                { label: "Fuentes", value: totalSources },
                                { label: "Factores", value: totalFactors },
                            ].map((item, index, arr) => (
                                <Box key={index}>
                                    <Box display="flex" justifyContent="space-between" py={1}>
                                        <Typography color="#374151" fontWeight="400">
                                            {item.label}
                                        </Typography>
                                        <Typography color="#111827" fontWeight="500">
                                            {item.value}
                                        </Typography>
                                    </Box>

                                    {index < arr.length - 1 && <Divider sx={{ borderColor: "#283618" }} />}
                                </Box>

                            ))}
                        </Box>
                    </CardContent>
                </Card>
            </Grid>

            <Grid size={{ xs: 12, lg: 7 }}>
                <Card
                    sx={{
                        height: 520,
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
                                    Grupos Recientes
                                </Typography>
                            </Box>
                            <Chip
                                label={`${recentGroups?.length ?? 0} grupo${(recentGroups?.length ?? 0) !== 1 ? "s" : ""}`}
                                sx={{ bgcolor: "#f3f4f6", color: "#374151", fontWeight: "500" }}
                                variant="outlined"
                            />
                        </Box>
                        <Box sx={{ flexGrow: 1, overflow: "auto" }}>
                            {recentGroups && recentGroups.length > 0 ? (
                                <Grid container spacing={2}>
                                    {recentGroups.map((group) => {
                                        const status = getGroupStatus(group.isActive);
                                        return (
                                            <Grid size={{ xs: 12, sm: 6 }} key={group.groupId}>
                                                <Card
                                                    variant="outlined"
                                                    sx={{
                                                        height: 165,
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
                                                    <CardContent sx={{ p: 2, display: "flex", flexDirection: "column", height: "100%" }}>
                                                        <Typography variant="subtitle2" fontWeight="600" color="#111827" noWrap>
                                                            {group.name}
                                                        </Typography>
                                                        <Typography variant="caption" color="#6b7280" mt={0.5}>
                                                            {group.totalUsers} usuario{group.totalUsers !== 1 ? "s" : ""}
                                                        </Typography>
                                                        <Box sx={{ mt: "auto" }}>
                                                            <Box
                                                                sx={{
                                                                    bgcolor: status.bgColor,
                                                                    p: 1,
                                                                    borderRadius: 1,
                                                                    display: "flex",
                                                                    alignItems: "center",
                                                                    justifyContent: "space-between",
                                                                }}
                                                            >
                                                                <Box display="flex" alignItems="center">
                                                                    <Box sx={{ color: status.textColor, mr: 0.5 }}>{status.icon}</Box>
                                                                    <Typography
                                                                        variant="caption"
                                                                        fontWeight="500"
                                                                        sx={{ color: status.textColor }}
                                                                    >
                                                                        {status.status}
                                                                    </Typography>
                                                                </Box>
                                                            </Box>
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        );
                                    })}
                                </Grid>
                            ) : (
                                <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
                                    <Avatar sx={{ bgcolor: "#f3f4f6", mb: 2, width: 64, height: 64 }}>
                                        <Folder sx={{ color: "#9ca3af", fontSize: 32 }} />
                                    </Avatar>
                                    <Typography variant="body1" color="#6b7280">
                                        No hay grupos recientes
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                        {recentGroups && recentGroups.length >= 4 && (
                            <Box mt={2} pt={2} borderTop="1px solid #e5e7eb" textAlign="center">
                                <Button
                                    variant="outlined"
                                    endIcon={<ArrowForward />}
                                    onClick={handleVerGrupos}
                                    sx={{
                                        borderRadius: 1.5,
                                        textTransform: "none",
                                        fontWeight: "500",
                                        borderColor: "#d1d5db",
                                        color: "#376D4F",
                                        "&:hover": { borderColor: "#9ca3af", bgcolor: "#f9fafb" },
                                    }}
                                >
                                    Ver todos los grupos
                                </Button>
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </Grid>


            <Grid size={{ xs: 12 }}>
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
                            <Grid size={{ xs: 12, md: 8 }}>
                                <Box display="flex" alignItems="center" mb={2}>
                                    <Avatar sx={{ bgcolor: "rgba(255,255,255,0.1)", mr: 2, width: 48, height: 48 }}>
                                        <Timeline fontSize="large" />
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h6" fontWeight="600" color="black">
                                            Centro de Reportes
                                        </Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                            Accede a informes globales y analíticas de toda la plataforma
                                        </Typography>
                                    </Box>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }} textAlign={{ xs: "left", md: "right" }}>
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
                                        "&:hover": { bgcolor: "#f9fafb" },
                                    }}
                                >
                                    Ver Reportes
                                </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );


}