// MonthlyConsumptionTable.jsx
import { EditOutlined, HistoryOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import DataTable from "examples/Tables/DataTable";
import { IconButton, Tooltip, Stack } from "@mui/material";

const getNombreMes = (numeroMes) => {
  const meses = [
    "",
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  return meses[numeroMes] || numeroMes;
};

export function MonthlyConsumptionTable({ consumos, loading, consumptionId }) {
  const navigate = useNavigate();

  const handleEditarConsumo = (monthlyId) => {
    navigate(`/consumo/mensual/editar/${consumptionId}/${monthlyId}`);
  };

  const handleVerHistorial = (id) => {
    navigate(`/consumo/mensual/historial/${id}`);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <span className="loading-text">Cargando consumos mensuales...</span>
      </div>
    );
  }

  if (consumos.length === 0) {
    return (
      <div className="no-results">
        <HistoryOutlined />
        <h3>No se encontraron resultados</h3>
        <p>No hay consumos que coincidan con los filtros seleccionados.</p>
      </div>
    );
  }

  const columns = [
    { Header: "Mes", accessor: "mes", align: "center" },
    { Header: "Año", accessor: "año", align: "center" },
    { Header: "Cantidad", accessor: "cantidad", align: "center" },
    { Header: "Emisiones", accessor: "emisiones", align: "center" },
    { Header: "Acciones", accessor: "acciones", align: "center" },
  ];

  const rows = consumos.map((consumo) => ({
    mes: (
      <MDTypography variant="caption" color="text" sx={{color: "#495057"}}>
        {getNombreMes(consumo.month)}
      </MDTypography>
    ),
    año: (
      <MDTypography variant="caption" color="text" sx={{color: "#495057"}}>
        {consumo.year}
      </MDTypography>
    ),
    cantidad: (
      <MDTypography variant="caption" color="text" sx={{color: "#495057"}}>
        {consumo.amount.toLocaleString()} {consumo.unitAbbreviation}
      </MDTypography>
    ),
    emisiones: (
      <MDTypography variant="caption" color="text" sx={{color: "#495057"}}>
        {consumo.emissions.toFixed(2)} kg CO₂
      </MDTypography>
    ),
    acciones: (
      <Stack direction="row" spacing={1} justifyContent="center">
        <Tooltip title="Editar">
          <IconButton
            size="small"
            color="info"
            onClick={() => handleEditarConsumo(consumo.monthlyConsumptionId)}
          >
            <EditOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Ver historial">
          <IconButton
            size="small"
            color="secondary"
            onClick={() => handleVerHistorial(consumo.monthlyConsumptionId)}
          >
            <HistoryOutlined fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    ),
  }));

  return (
    <DataTable
      table={{ columns, rows }}
      isSorted={false}
      entriesPerPage={false}
      showTotalEntries={true}
      noEndBorder
      loading={loading}
    />
  );
}
