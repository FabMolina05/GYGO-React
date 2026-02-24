import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import SuperAdminSubscriptionManager from "./SuperAdminSubscriptionManager";
import SubscribePrompt from "./SubscribePrompt";
import AdminSubscriptionEditor from "./AdminSubscriptionEditor";

import DashboardLayout from "@/examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "@/examples/Navbars/DashboardNavbar";

import Modal from '@mui/material/Modal';
import MDBox from "@/components/MDBox";
import MDTypography from "@/components/MDTypography";
import MDButton from "@/components/MDButton";

import { useAuth } from "../../context/AuthContext";  // IMPORTA solo useAuth
import {refreshLogin} from "../../API/Auth";
import { getSubscriptionByUserId, confirmSubscription, sendSubscriptionEmail } from "../../API/Subscription";
import WebhookTestButtons from "../../components/WebhooksTestButtons";
import { DoesUserHaveGroup, reactivateGroup } from "../../API/AddGroup";
import PaymentHistoryTable from "../../components/PaymentHistoryTable";

export default function SubscriptionSwitch() {
  const { role, userId, markUserAsPaid, updateRole} = useAuth();
  const [searchParams] = useSearchParams();
  const [modalMessage, setModalMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(false);
  const [subscriptionLoading, setSubscriptionLoading] = useState(false);
  const navigate = useNavigate();
  const [paypalSubscriptionId, setPaypalSubscriptionId] = useState(null);
  const [emailSent, setEmailSent] = useState(false);

  const status = searchParams.get("status");
  const processedRef = useRef(false);

  const reloadSubscription = async () => {
    try {
      const subscription = await getSubscriptionByUserId(userId);
      if (subscription) {
        setHasSubscription(true);
        setPaypalSubscriptionId(subscription.payPalSubscriptionId);
        //hacer una recarga de la pagina aqui para la primera vez que entra
        //  if (!sessionStorage.getItem("subscriptionReloaded")) {
        // sessionStorage.setItem("subscriptionReloaded", "true");
        // window.location.reload();
      // }
      } else {
        setHasSubscription(false);
        setPaypalSubscriptionId(null);
      }
    } catch (err) {
      setHasSubscription(false);
      setPaypalSubscriptionId(null);
    }
  };

useEffect(() => {
    if (!status) return;
    if (processedRef.current) return;
    processedRef.current = true;

    if (status === "success") {
      setSubscriptionSuccess(true);
      setModalMessage("¡Suscripción realizada con éxito!");
      setModalOpen(true);
      markUserAsPaid();
      updateRole("GA");

      (async () => {
        try {
          const confirmation = await confirmSubscription();
          await reloadSubscription();
          await refreshLogin();
          await sendSubscriptionEmail();
          setEmailSent(true);
        } catch (error) {
          console.error(error);
        }
      })();
    }

    if (status === "cancel") {
      updateRole("DEF");
      setModalMessage("Suscripción cancelada.");
      setModalOpen(true);
    }
  }, [status]);

  useEffect(() => {
  if (!userId || !role) {
    return;
  }

  let isMounted = true;

  const checkSubscription = async () => {
    setSubscriptionLoading(true);

    try {
      const subscription = await getSubscriptionByUserId(userId);

      if (!isMounted) return;

      if (subscription) {
        setHasSubscription(true);
        setPaypalSubscriptionId(subscription.payPalSubscriptionId);
      } else {
        setHasSubscription(false);
        setPaypalSubscriptionId(null);
      }
    } catch {
      if (!isMounted) return;
      setHasSubscription(false);
      setPaypalSubscriptionId(null);
    } finally {
      if (isMounted) {
        setSubscriptionLoading(false);
      }
    }
  };

  checkSubscription();

  return () => {
    isMounted = false;
  };
}, [userId, role]);

  const handleClose = async () => {
    setModalOpen(false);
    if(!subscriptionSuccess){
      return
    }

    try {
      const groupCheck = await DoesUserHaveGroup();
      if(groupCheck?.state === true){
        const groupId = groupCheck.grupo.grupoId;
        const result = await reactivateGroup(groupId);

        if(result?.message === 'Grupo reactivado correctamente'){
          await refreshLogin();

          navigate("panel-control");
        }else{
          console.error("Error al reactivar grupo:", result);
        navigate("panel-control");
        }
        return;
      }

      navigate("/agregar-grupo");

    } catch (ex) {
      console.error("Error en el flujo de suscripción:", err);
      navigate("/agregar-grupo");
    }
  };

  if (!role) {
  return <p>Cargando usuario...</p>;
}



  const renderContent = () => {
    switch (role) {
      case "DEV":
      case "SA":
        return <SuperAdminSubscriptionManager />;
      case "DEF":
        return <SubscribePrompt />
      case "GA":
        return  <AdminSubscriptionEditor /> 
      default:
        return <p>Acceso denegado</p>;
    }
  };

  return (

    
        <MDBox sx={{ minHeight: "100vh", p: 3 }}>
          {renderContent()}
          <Modal
            open={modalOpen}
            onClose={handleClose}
            aria-labelledby="modal-message-title"
            aria-describedby="modal-message-description"
          >
            <MDBox
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 3,
                borderRadius: 2,
                width: { xs: 300, sm: 400 },
                textAlign: 'center',
              }}
            >
              <MDTypography
                variant="h6"
                id="modal-message-title"
                fontWeight="medium"
                gutterBottom
              >
                {modalMessage}
              </MDTypography>
              <MDButton variant="gradient" color="info" onClick={handleClose}>
                Cerrar
              </MDButton>
            </MDBox>
          </Modal>
        </MDBox>
  );
}