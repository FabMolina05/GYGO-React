import { appsettings } from "../settings/appsettings";

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export async function getAllPlans() {
  try {
    const response = await fetch(`${appsettings.apiUrl}Subscription/plans`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    const plans = await response.json();
    return plans;
  } catch (error) {
    console.error("getAllPlans error:", error);
    throw error;
  }
}

export async function subscribeToPlan(planId) {
  try {
    const response = await fetch(`${appsettings.apiUrl}Subscription/subscribe`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ planId }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    // Retorna la respuesta JSON, que debería incluir approvalUrl
    return await response.json();
  } catch (error) {
    console.error("subscribeToPlan error:", error);
    throw error;
  }
}

export async function cancelSubscription(userId, planId, reason) {
  try {
    const url = `${appsettings.apiUrl}Subscription/cancel?userId=${encodeURIComponent(userId)}&planId=${encodeURIComponent(planId)}&reason=${encodeURIComponent(reason)}`;

    const response = await fetch(url, {
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

    return await response.json();
  } catch (error) {
    console.error("cancelSubscription error:", error);
    throw error;
  }
}

export async function CacelSubscriptionByAdmin(){

}

export async function getSubscription(planId) {
  try {
    const response = await fetch(`${appsettings.apiUrl}Subscription/info?planId=${planId}`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("getSubscription error:", error);
    throw error;
  }
}

export async function getSubscriptionByUserId() {
  try {
    const response = await fetch(`${appsettings.apiUrl}Subscription/subscription-info`, {
      method: "GET",
      credentials: "include", // para enviar cookies
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("getSubscriptionByUserId error:", error);
    throw error;
  }
}

export async function fetchPaymentHistory() {
  try {
    const response = await fetch(`${appsettings.apiUrl}History/PaymentHistory`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (jsonError) {
        errorData = await response.text();
      }
      
      throw new Error(
        errorData.message || 
        errorData.error || 
        (typeof errorData === 'string' ? errorData : `HTTP error! status: ${response.status}`)
      );
    }

    return await response.json();
  } catch (error) {
    console.error("fetchPaymentHistory error:", error);
    throw new Error(error.message || "Failed to load payment history");
  }
}

export async function cancelAdminSubscription(groupId, reason) {
  try {
    
    
    const response = await fetch(`${appsettings.apiUrl}Subscription/cancel-admin/${groupId}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json", // Asegúrate que este header esté presente
      },
      body: JSON.stringify(reason) // Envía solo el string
    });

    

    if (!response.ok) {
      const errorText = await response.text();
      
      throw new Error(errorText);
    }

    return await response.text();
  } catch (error) {
    
    throw error;
  }
}

export async function confirmSubscription() {
  try {
    const response = await fetch(`${appsettings.apiUrl}Subscription/confirm`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data) {
      throw new Error("Empty response body");
    }

    return data;
  } catch (error) {
    console.error("Error confirming subscription:", error);
    return { success: false, message: "Error al confirmar la suscripción." };
  }
}


export async function sendSubscriptionEmail() {
  try {
    const response = await fetch(`${appsettings.apiUrl}Subscription/send-subscription-email`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error sending subscription email:", error);
    return { success: false, message: "Error al enviar el correo de suscripción." };
  }
}

