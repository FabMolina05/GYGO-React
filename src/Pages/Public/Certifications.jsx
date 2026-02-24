"use client"
import { Card, Container, Grid, Typography, Box, Button } from "@mui/material"
import { styled, keyframes } from "@mui/material/styles"
import { PublicHeader } from "../../components/PublicHeader"
import Footer from "../../components/Footer"
import banderaAzul from '../../assets/bandera-playas.jpg';
import HuellaCarbono from '../../assets/Logo-PPCN-1.png';
import EsencialCostaRica from '../../assets/esencial.png';



// Animaciones CSS
const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const slideInLeft = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`

const pulse = keyframes`
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
`

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`

// Componentes estilizados
const AnimatedContainer = styled(Container)(({ theme }) => ({
  animation: `${fadeInUp} 0.8s ease-out`,
}))

const StyledTitle = styled(Typography)(({ theme }) => ({
  background: "linear-gradient(45deg, #2196F3 30%, #4CAF50 90%)",
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  textAlign: "center",
  fontWeight: 800,
  marginBottom: theme.spacing(1),
  animation: `${slideInLeft} 1s ease-out`,
  textShadow: "0 2px 4px rgba(0,0,0,0.1)",
}))

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: "center",
  marginTop: theme.spacing(6),
  borderRadius: 20,
  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  background: "linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)",
  border: "1px solid rgba(255,255,255,0.2)",
  position: "relative",
  overflow: "hidden",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  animation: `${fadeInUp} 0.6s ease-out`,
  height: "100%", // Asegura que todas las cards tengan la misma altura
  display: "flex",
  flexDirection: "column",

  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-200px",
    width: "200px",
    height: "100%",
    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)",
    animation: `${shimmer} 2s infinite`,
  },

  "&:hover": {
    transform: "translateY(-10px) scale(1.02)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.15)",

    "& .card-image": {
      transform: "scale(1.1) rotate(2deg)",
    },

    "& .card-title": {
      color: "#2196F3",
    },

    "& .card-button": {
      animation: `${pulse} 1s infinite`,
    },
  },

  // Animaciones escalonadas para cada card
  "&:nth-of-type(1)": {
    animationDelay: "0.1s",
  },
  "&:nth-of-type(2)": {
    animationDelay: "0.3s",
  },
  "&:nth-of-type(3)": {
    animationDelay: "0.5s",
  },
}))

const CardTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(2),
  color: "#333",
  transition: "color 0.3s ease",
  position: "relative",

  "&::after": {
    content: '""',
    position: "absolute",
    bottom: -8,
    left: "50%",
    transform: "translateX(-50%)",
    width: 0,
    height: 3,
    background: "linear-gradient(45deg, #2196F3, #4CAF50)",
    borderRadius: 2,
    transition: "width 0.3s ease",
  },

  "&:hover::after": {
    width: "60%",
  },
}))

const ImageContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center", // Centra verticalmente la imagen
  marginBottom: theme.spacing(3),
  position: "relative",
  height: 200, // Altura fija para el contenedor
  width: "100%",
  flex: 1, // Permite que el contenedor se expanda

  "& img": {
    maxWidth: 250, // Ancho máximo
    maxHeight: 180, // Altura máxima
    width: "auto", // Mantiene la proporción
    height: "auto", // Mantiene la proporción
    objectFit: "contain", // Asegura que la imagen completa sea visible
    borderRadius: 15,
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
  },

  "&::after": {
    content: '""',
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 250,
    height: 180,
    borderRadius: 15,
    background: "linear-gradient(45deg, rgba(33,150,243,0.1), rgba(76,175,80,0.1))",
    opacity: 0,
    transition: "opacity 0.3s ease",
    pointerEvents: "none",
  },

  "&:hover::after": {
    opacity: 1,
  },
}))

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: "auto", // Empuja el botón hacia abajo
  marginBottom: theme.spacing(2),
  borderRadius: 25,
  padding: "12px 30px",
  background: "linear-gradient(45deg, #2196F3 30%, #4CAF50 90%)",
  boxShadow: "0 6px 20px rgba(33,150,243,0.3)",
  textTransform: "none",
  fontWeight: 600,
  fontSize: "1rem",
  position: "relative",
  overflow: "hidden",

  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "-100%",
    width: "100%",
    height: "100%",
    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
    transition: "left 0.5s",
  },

  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "0 8px 25px rgba(33,150,243,0.4)",

    "&::before": {
      left: "100%",
    },
  },

  "&:active": {
    transform: "translateY(0)",
  },

  "& a": {
    color: "white",
    textDecoration: "none",
    display: "block",
    width: "100%",
    height: "100%",
  },
}))

const BackgroundDecoration = styled(Box)({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
  zIndex: -1,

  "&::before": {
    content: '""',
    position: "absolute",
    top: "10%",
    right: "10%",
    width: "300px",
    height: "300px",
    background: "radial-gradient(circle, rgba(33,150,243,0.1) 0%, transparent 70%)",
    borderRadius: "50%",
    animation: `${pulse} 4s ease-in-out infinite`,
  },

  "&::after": {
    content: '""',
    position: "absolute",
    bottom: "10%",
    left: "10%",
    width: "200px",
    height: "200px",
    background: "radial-gradient(circle, rgba(76,175,80,0.1) 0%, transparent 70%)",
    borderRadius: "50%",
    animation: `${pulse} 3s ease-in-out infinite reverse`,
  },
})

const certifications = [
  {
    title: "Bandera Azul",
    image: banderaAzul,
    link: "https://www.ict.go.cr/es/sostenibilidad/bandera-azul.html",
  },
  {
    title: "Huella de Carbono",
    image: HuellaCarbono,
    link: "https://cambioclimatico.minae.go.cr/programa-pais-carbono-neutralidad/",
  },
  {
    title: "Esencial Costa Rica",
    image: EsencialCostaRica,
    link: "https://www.esencialcostarica.com/quienes-somos/",
  },
]

export default function Certificaciones() {
  return (
    <>
      <BackgroundDecoration />
      <PublicHeader />
      <AnimatedContainer  maxWidth="lg"
  sx={{
    mt: 4,
    mb: 12,
    position: "relative",
    zIndex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center", // <-- Esto asegura el contenido centrado
  }}>
        <StyledTitle component="h1" variant="h2">
          Certificaciones Disponibles
        </StyledTitle>
        <StyledTitle component="h1" variant="h2" sx={{ mb: 4 }}>
          Para Consultoría
        </StyledTitle>

        <Grid container spacing={3} justifyContent="center">
          {certifications.map((cert, index) => (
            <Grid item xs={12} md={4} key={index}>
              <StyledCard>
                <CardTitle variant="h4" className="card-title">
                  {cert.title}
                </CardTitle>
                <ImageContainer>
                  <img src={cert.image || "/placeholder.svg"} alt={`Logo ${cert.title}`} className="card-image"  />
                </ImageContainer>
                <StyledButton variant="contained" className="card-button" size="large">
                  <a href={cert.link} target="_blank" rel="noopener noreferrer">
                    Más Información
                  </a>
                </StyledButton>
              </StyledCard>
            </Grid>
          ))}
        </Grid>
      </AnimatedContainer>
      <Footer />
    </>
  )
}