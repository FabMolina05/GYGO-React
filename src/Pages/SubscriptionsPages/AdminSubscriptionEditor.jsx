import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Box,
  Grid,
} from "@mui/material";

import DashboardLayout from "@/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "@/examples/Navbars/DashboardNavbar";
import WebhookTestButtons from "../../components/WebhooksTestButtons";
import CancelSubscriptionButton from "../../components/CancelSubscriptionButton";
import { getSubscriptionByUserId } from "../../API/Subscription";
import PaymentHistoryTable from "../../components/PaymentHistoryTable";

import "./../../styles/Subscription.css";

export default function AdminSubscriptionEditor() {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        const data = await getSubscriptionByUserId();
        setSubscription(data);
      } catch (err) {
        setError(err.message || "Error al cargar la suscripción");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "activa":
        return "active";
      case "cancelled":
      case "cancelada":
        return "cancelled";
      default:
        return "pending";
    }
  };

  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "Activo";
      case "cancelled":
        return "Cancelada";
      case "pending":
        return "Pendiente";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="subscription-details-container">
        <div className="subscription-details-wrapper">
          <div className="subscription-details-card">
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p className="loading-text">
                Cargando información de suscripción...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="subscription-details-container">
        <div className="subscription-details-wrapper">
          <div className="subscription-details-card">
            <div className="error-message">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="subscription-details-container">
        <div className="subscription-details-wrapper">
          <div className="subscription-details-card">
            <div className="no-subscription-message">
              No hay datos de suscripción.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <DashboardNavbar></DashboardNavbar>
      <div className="subscription-details-container">
        <div className="subscription-details-wrapper">
          <div className="subscription-details-card">
            <div className="subscription-details-header">
              <h1 className="subscription-details-title">
                Información de Suscripción
              </h1>
            </div>

            <div className="subscription-info-grid">
              <div className="subscription-info-item plan-id-highlight">
                <p className="subscription-info-label">Plan</p>
                <p className="subscription-info-value">
                  {subscription.payPalSubscriptionId}
                </p>
              </div>

              <div className="subscription-info-item">
                <p className="subscription-info-label">Estado</p>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <div
                    className={`subscription-status ${getStatusClass(subscription.status)}`}
                  >
                    {getStatusLabel(subscription.status)}
                  </div>
                </Box>
              </div>

              <div className="subscription-info-item">
                <p className="subscription-info-label">Fecha de inicio</p>
                <p className="subscription-info-value date-value">
                  {formatDate(subscription.startDate)}
                </p>
              </div>

              <div className="subscription-info-item">
                <p className="subscription-info-label">Próxima facturación</p>
                <p
                  className={`subscription-info-value date-value ${!subscription.nextBillingDate ? "na-value" : ""}`}
                >
                  {formatDate(subscription.nextBillingDate)}
                </p>
              </div>

              <div className="subscription-info-item">
                <p className="subscription-info-label">Último pago</p>
                <p
                  className={`subscription-info-value date-value ${!subscription.lastPaymentDate ? "na-value" : ""}`}
                >
                  {formatDate(subscription.lastPaymentDate)}
                </p>
              </div>

              <div className="subscription-info-item">
                <p className="subscription-info-label">Cancelado en</p>
                <p
                  className={`subscription-info-value date-value ${!subscription.cancelledAt ? "na-value" : ""}`}
                >
                  {formatDate(subscription.cancelledAt)}
                </p>
              </div>
            </div>

            <div className="subscription-info-item">
              <p className="subscription-info-label">Creado en</p>
              <p className="subscription-info-value date-value">
                {formatDate(subscription.createdAt)}
              </p>
            </div>

            <div
              className="subscription-actions"
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  width: "100%",
                }}
              >
                {subscription.status !== "Cancelled" && (
                  <CancelSubscriptionButton
                    userId={subscription.userId}
                    subscriptionId={subscription.payPalSubscriptionId}
                    onSuccess={() => {
                      console.log("Cancelación exitosa");
                      window.location.reload();
                    }}
                  />
                )}
              </div>
            </div>
          </div>
          <div className="Historial">
            <PaymentHistoryTable />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
