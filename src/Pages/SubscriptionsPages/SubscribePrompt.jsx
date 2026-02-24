import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Grid,
} from "@mui/material";
import DashboardLayout from "@/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "@/examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import { getAllPlans, subscribeToPlan } from "../../API/Subscription";
import { useAuth } from "../../context/AuthContext";
import "./../../styles/Subscription.css";
import PaymentHistoryTable from "../../components/PaymentHistoryTable";

export default function SubscribePrompt() {
  const [plans, setPlans] = useState([]);
  const { authToken } = useAuth();regeneratorRuntime

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const fetchedPlans = await getAllPlans();
        setPlans(fetchedPlans);
      } catch (error) {
        console.error("Error al cargar los planes:", error);
      }
    };

    fetchPlans();
  }, []);

  const handleSubscribe = async (planId) => {
    try {
      const result = await subscribeToPlan(planId);
      
      if (result.approvalUrl) {
        window.location.href = result.approvalUrl;
      } else {
        alert("Suscripción creada pero no se pudo obtener el link de aprobación.");
      }
    } catch (err) {
      alert("Hubo un error al suscribirse: " + err.message);
    }
  };

  return (
    <DashboardLayout>
          <DashboardNavbar />
    <div className="subscribe-container">
      <div className="subscribe-header">
        <h1 className="subscribe-title">Elige un plan para suscribirte</h1>
        <p className="subscribe-subtitle">Selecciona el plan que mejor se adapte a tus necesidades</p>
      </div>

      <div className="subscribe-grid" data-plan-count={plans.length}>
        {plans.map((plan) => (
          <div key={plan.id} className={`subscribe-card ${plan.popular ? "popular" : ""}`}>
            {plan.popular && <div className="popular-badge">Más Popular</div>}

            <div className="plan-header">
              <h2 className="plan-name">{plan.name}</h2>
              <p className="plan-description">{plan.description || "Sin descripción"}</p>
            </div>

            {plan.price && (
              <div className="plan-pricing">
                <span className="plan-price">{plan.price}</span>
                {plan.period && <span className="plan-period">{plan.period}</span>}
              </div>
            )}

            {plan.features && plan.features.length > 0 && (
              <ul className="plan-features">
                {plan.features.map((feature, index) => (
                  <li key={index} className="feature-item">
                    <svg className="feature-icon" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            )}

            <button className="subscribe-button" onClick={() => handleSubscribe(plan.id)}>
              Suscribirse
            </button>
          </div>
        ))}
      </div>

      <div className="subscribe-footer">
        <p className="footer-text">Todos los planes incluyen garantía de 30 días. Cancela en cualquier momento.</p>
      </div>
    </div>

    <div className="Historial">
            <PaymentHistoryTable />  
    </div>

     <Footer />  
     </DashboardLayout>
  )
}