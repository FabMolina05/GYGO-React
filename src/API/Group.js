import { appsettings } from "../settings/appsettings";
import { fetchWithAuth } from "../utils/fetchWithAuth";

export async function getGrupoProfile() {
  const response = await fetchWithAuth(`${appsettings.apiUrl}Group/getById`, {
    method: "GET",
    credentials: "include",
  }); //7217 puerto

  if (!response) return;

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    return [];
  }
}

// End point para acutalizar la información del grupo
export async function updateGrupoProfile(grupoData) {
  try {

    const form = new FormData();
    form.append("Nombre", grupoData.nombre);
    form.append("Correo", grupoData.correo);

    if (grupoData.logoFile) {
      form.append("Logo", grupoData.logoFile);
    } else {
      form.append("LogoURL", grupoData.logo);
    }

    const response = await fetchWithAuth(
      `${appsettings.apiUrl}Group/UpdateGroup`,
      {
        method: "PUT",
        credentials: "include",
        body: form,
      }
    );

    if (!response) return;

    const data = await response.json();
    if (!data.success) {
      return { success: false, message: data.message };
    }
    return { success: true, message: data.message };
  } catch (error) {
    console.error("Error al actualizar la información del grupo");
    return { success: false, message: error.message };
  }
}
