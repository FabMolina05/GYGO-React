import { IconButton, Stack, Tooltip } from "@mui/material";
import { RemoveRedEyeOutlined, EditOutlined } from "@mui/icons-material";
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import DataTable from "examples/Tables/DataTable"; // Asegúrate que apunte al mismo DataTable que usas en Projects

export function ConsumptionTable({
  consumos,
  loading,
  onVerConsumoMensual,
  onEditarConsumo,
}) {

  
  const columns = [
    { Header: "Nombre Consumo", accessor: "name", align: "left" },
    { Header: "Nombre Factor", accessor: "factorName", align: "left" },
    { Header: "Unidad", accessor: "unit", align: "center" },
    { Header: "Acciones", accessor: "actions", align: "center" },
  ];

  const rows = consumos.map((consumo) => ({
    name: (
      <MDTypography variant="caption" fontWeight="medium">
        {consumo.name}
      </MDTypography>
    ),
    factorName: (
      <MDTypography variant="caption" color="text" sx={{ color: "#495057" }}>
        {consumo.factorName}
      </MDTypography>
    ),
    unit: (
      <MDTypography variant="caption" color="text" sx={{ color: "#495057" }}>
        {consumo.unitAbbreviation}
      </MDTypography>
    ),
    actions: (
      <Stack direction="row" spacing={1} justifyContent="center">
        <Tooltip title="Ver Consumo Mensual">
          <IconButton size="small" onClick={() => onVerConsumoMensual(consumo)}>
            <RemoveRedEyeOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Editar Consumo">
          <IconButton
            size="small"
            color="info"
            onClick={() => onEditarConsumo(consumo.consumptionId)}
          >
            <EditOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    ),
  }));

  return (
    <MDBox>
      <Grid container spacing={5}>
        <Grid size={{ xs: 12 }}>
          <Card>
            <MDBox
              pt={3}
              sx={{
                p: 3,
                textAlign: "center",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
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
  );
}
