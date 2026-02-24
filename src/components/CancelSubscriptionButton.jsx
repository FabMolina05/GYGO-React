import { useState } from "react";
import MDButton from "@/components/MDButton";
import { appsettings } from "../settings/appsettings";
import MDBox from "components/MDBox";
import Swal from "sweetalert2";

export default function CancelSubscriptionButton({
  subscriptionId,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    setLoading(true);
    const result = await Swal.fire({
      title: "¿Cancelar suscripción?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Sí, cancelar",
      cancelButtonText: "No, volver",
    });

    if(!result.isConfirmed){
      setLoading(false);
      return;
    }

    try {
      
      const url = new URL(`${appsettings.apiUrl}Subscription/cancel`, window.location.origin);
      url.searchParams.append("subscriptionId", subscriptionId);
      url.searchParams.append("reason", "User requested cancellation");
      

      const response = await fetch(url.toString(), {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      await Swal.fire({
        title: "Cancelada",
        text: "La suscripción fue cancelada exitosamente.",
        icon: "success",
        confirmButtonText: "Aceptar",
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      Swal.fire({
        title: "Error",
        text: error.message || "Hubo un error al cancelar la suscripción.",
        icon: "error",
        confirmButtonText: "Entendido",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
<MDButton
  color="error"
  variant="outlined"
  onClick={handleCancel}
  disabled={loading}
  sx={{
    transition: 'all 0.3s ease',
    '&:hover': {
      background: (theme) => theme.palette.error.main,
      color: '#fff !important',          // forzar color blanco
      boxShadow: (theme) => theme.shadows[4],
      backgroundImage: 'none',
      border: 'none',
    },
  }}
>
  {loading ? "Cancelando..." : "Cancelar Suscripción"}
</MDButton>
  );
}
