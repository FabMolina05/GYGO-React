import { appsettings } from "../settings/appsettings";
import { fetchWithAuth } from "../utils/fetchWithAuth";

//API para llamar los proyectos por grupo
export async function getUsers() {
  const response = await fetchWithAuth(
    `${appsettings.apiUrl}ManagmentUsers/AllUsers`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response) return;

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    return [];
  }
}

//API para los projectos pendientes
export async function getUsersbyRol(rol) {
  const response = await fetchWithAuth(
    `${appsettings.apiUrl}ManagmentUsers/rol/${rol}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!response) return;

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    return [];
  }
  CreatePdf;
}

export const sendDefaultUserInvite = async (email) => {
  try {
    const response = await fetchWithAuth(
      `${appsettings.apiUrl}Admin/sendInviteDefault`,
      {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(email),
      }
    );
    if (!response) return;

    const data = await response.json();

    if (!data.success) {
      return { success: false, message: data.message };
    }

    return { success: true, message: data.message };
  } catch (error) {
    return { success: false, message: error.message || "Error de conexión" };
  }
};
