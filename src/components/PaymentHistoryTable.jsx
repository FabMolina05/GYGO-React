import React, { useState, useEffect } from "react";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Stack from "@mui/material/Stack";
import EditIcon from "@mui/icons-material/Edit";
import CircularProgress from "@mui/material/CircularProgress";
import { fetchPaymentHistory } from "../API/Subscription";

const PaymentHistoryTable = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; // To prevent memory leaks

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchPaymentHistory();
        if (isMounted) {
          setPayments(data);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || "Error al cargar el historial de pagos");
          console.error("Payment history error:", err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return "-";
    return `₡${parseFloat(amount).toFixed(2)}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Fecha inválida";
      
      return new Intl.DateTimeFormat('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Fecha inválida";
    }
  };

  const columns = [
    { Header: "Fecha", accessor: "fecha", align: "left" },
    { Header: "Tipo de Evento", accessor: "tipoEvento", align: "left" },
    { Header: "Descripción", accessor: "descripcion", align: "left" },
    { Header: "Monto", accessor: "monto", align: "center" },
    { Header: "Acciones", accessor: "acciones", align: "center" },
  ];

  const handleViewDetails = (payment) => {
    console.log("View details for payment:", payment);
    // You might want to implement a modal or detailed view here
  };

  const rows = payments.map((payment) => ({
    fecha: (
      <MDTypography variant="caption" fontWeight="medium">
        {formatDate(payment.fecha)}
      </MDTypography>
    ),
    tipoEvento: (
      <MDTypography variant="caption" color="text">
        {payment.nombreEvento || "-"}
      </MDTypography>
    ),
    descripcion: (
      <MDTypography variant="caption" color="text">
        {payment.descripcion || "-"}
      </MDTypography>
    ),
    monto: (
      <MDTypography variant="caption" color={payment.Monto ? "text" : "secondary"}>
        {formatCurrency(payment.monto)}
      </MDTypography>
    ),
    acciones: (
      <Stack direction="row" spacing={1} justifyContent="center" alignItems="center">
        <Tooltip title="Ver detalles">
          <IconButton 
            size="small" 
            color="info" 
            onClick={() => handleViewDetails(payment)}
            disabled={!payment} // Disable if no payment data
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    ),
  }));

  if (loading) {
    return (
      <MDBox display="flex" justifyContent="center" alignItems="center" p={3}>
        <CircularProgress />
      </MDBox>
    );
  }

  if (error) {
    return (
      <MDBox p={3}>
        <MDTypography color="error">
          Error al cargar el historial: {error}
        </MDTypography>
        <MDBox mt={2}>
          <MDTypography 
            variant="button" 
            color="info" 
            onClick={() => window.location.reload()}
            sx={{ cursor: 'pointer' }}
          >
            Intentar nuevamente
          </MDTypography>
        </MDBox>
      </MDBox>
    );
  }

  if (payments.length === 0) {
    return (
      <MDBox p={3}>
        <MDTypography>No se encontraron registros de pagos</MDTypography>
      </MDBox>
    );
  }

  return (
    <MDBox pt={3}>
      <DataTable
        table={{ columns, rows }}
        isSorted={true}
        entriesPerPage={true}
        showTotalEntries={true}
        noEndBorder={false}
        loading={loading}
      />
    </MDBox>
  );
};

export default PaymentHistoryTable;