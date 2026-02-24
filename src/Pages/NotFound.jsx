import { useNavigate } from "react-router-dom"
import { Box, Container, Typography, Card } from "@mui/material"
import MDButton from "components/MDButton"
import MDBox from "components/MDBox"

function NotFound() {
  const navigate = useNavigate()

  return (
    <MDBox
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{
        background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
        position: "relative",
        overflow: "hidden",
        "@media (prefers-color-scheme: dark)": {
          background: "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          width: "100%",
          height: "100%",
          opacity: 0.1,
        }}
      >
        {[...Array(15)].map((_, i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              width: `${Math.random() * 100 + 50}px`,
              height: `${Math.random() * 100 + 50}px`,
              borderRadius: "50%",
              background: `radial-gradient(circle, rgba(5, 150, 105, ${0.3 + Math.random() * 0.2}) 0%, transparent 70%)`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `floatSmooth ${Math.random() * 20 + 15}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
              filter: "blur(3px)",
              "@keyframes floatSmooth": {
                "0%, 100%": {
                  transform: "translate(0, 0) scale(1)",
                  opacity: 0.3,
                },
                "50%": {
                  transform: `translate(${Math.random() * 60 - 30}px, ${Math.random() * 60 - 30}px) scale(${1 + Math.random() * 0.3})`,
                  opacity: 0.6,
                },
              },
            }}
          />
        ))}
      </Box>

      <Container maxWidth="md">
        <Card
          sx={{
            backdropFilter: "blur(20px)",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            boxShadow: "0 20px 40px rgba(0, 0, 0, 0.1)",
            borderRadius: "20px",
            border: "1px solid #d1fae5",
            overflow: "visible",
            position: "relative",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "4px",
              background: "linear-gradient(90deg, #059669, #10b981, #34d399)",
              borderRadius: "20px 20px 0 0",
            },
            "@media (prefers-color-scheme: dark)": {
              backgroundColor: "rgba(15, 32, 39, 0.9)",
              border: "1px solid rgba(5, 150, 105, 0.3)",
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.6), 0 0 80px rgba(5, 150, 105, 0.2)",
            },
          }}
        >
          <MDBox p={{ xs: 4, md: 6 }} textAlign="center" position="relative">
            <Box sx={{ position: "relative", display: "inline-block", mb: 4 }}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "120px", md: "180px" },
                  fontWeight: "900",
                  background: "linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  lineHeight: 1,
                  position: "relative",
                  filter: "drop-shadow(0 8px 24px rgba(5, 150, 105, 0.3))",
                  animation: "floatGentle 3s ease-in-out infinite",
                  "@keyframes floatGentle": {
                    "0%, 100%": {
                      transform: "translateY(0px)",
                    },
                    "50%": {
                      transform: "translateY(-15px)",
                    },
                  },
                  "@media (prefers-color-scheme: dark)": {
                    background: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  },
                }}
              >
                404
              </Typography>

              {[...Array(3)].map((_, i) => (
                <Typography
                  key={i}
                  variant="h1"
                  sx={{
                    fontSize: { xs: "120px", md: "180px" },
                    fontWeight: "900",
                    color: `rgba(5, 150, 105, ${0.06 - i * 0.02})`,
                    lineHeight: 1,
                    position: "absolute",
                    top: `${(i + 1) * 6}px`,
                    left: `${(i + 1) * 6}px`,
                    zIndex: -1 - i,
                  }}
                >
                  404
                </Typography>
              ))}
            </Box>

            <Typography
              variant="h2"
              fontWeight="700"
              mb={2}
              sx={{
                fontSize: { xs: "1.8rem", md: "2.5rem" },
                letterSpacing: "-0.02em",
                color: "#059669",
                "@media (prefers-color-scheme: dark)": {
                  color: "#10b981",
                },
              }}
            >
              Página no encontrada
            </Typography>

            <Typography
              variant="body1"
              sx={{
                maxWidth: 500,
                mx: "auto",
                mb: 4,
                fontSize: { xs: "1rem", md: "1.1rem" },
                lineHeight: 1.8,
                fontWeight: 400,
                color: "#4b5563",
                "@media (prefers-color-scheme: dark)": {
                  color: "rgba(255, 255, 255, 0.8)",
                },
              }}
            >
              Lo sentimos, la página que estás buscando no existe o fue movida. Verifica la URL o regresa al inicio para
              continuar navegando.
            </Typography>

            <MDBox display="flex" gap={2} justifyContent="center" flexWrap="wrap" mb={5}>
              <MDButton
                variant="gradient"
                color="success"
                size="large"
                onClick={() => navigate("/")}
                sx={{
                  px: 5,
                  py: 1.8,
                  fontSize: "1rem",
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: "12px",
                  boxShadow: "0 10px 25px rgba(5, 150, 105, 0.3)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: "0 15px 35px rgba(5, 150, 105, 0.4)",
                  },
                  "&:active": {
                    transform: "translateY(-1px)",
                  },
                }}
              >
                Ir al inicio
              </MDButton>

              <MDButton
                variant="outlined"
                color="dark"
                size="large"
                onClick={() => navigate(-1)}
                sx={{
                  px: 5,
                  py: 1.8,
                  fontSize: "1rem",
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: "12px",
                  borderWidth: "2px",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-3px)",
                    borderWidth: "2px",
                    backgroundColor: "rgba(5, 150, 105, 0.05)",
                    borderColor: "#059669",
                  },
                  "&:active": {
                    transform: "translateY(-1px)",
                  },
                  "@media (prefers-color-scheme: dark)": {
                    borderColor: "rgba(255, 255, 255, 0.3)",
                    color: "white",
                    "&:hover": {
                      backgroundColor: "rgba(5, 150, 105, 0.1)",
                      borderColor: "#10b981",
                    },
                  },
                }}
              >
                Volver atrás
              </MDButton>
            </MDBox>

            <MDBox
              mt={5}
              pt={4}
              sx={{
                borderTop: "1px solid rgba(5, 150, 105, 0.2)",
                "@media (prefers-color-scheme: dark)": {
                  borderTop: "1px solid rgba(5, 150, 105, 0.25)",
                },
              }}
            >
       
            </MDBox>
          </MDBox>
        </Card>
      </Container>
    </MDBox>
  )
}

export default NotFound