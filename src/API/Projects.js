import { appsettings } from "../settings/appsettings";
import { fetchWithAuth } from "../utils/fetchWithAuth";

//API para llamar los proyectos por grupo
export async function AddProject(projectData) {
  try {
    const response = await fetchWithAuth(
      `${appsettings.apiUrl}Projects/AddProject`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      }
    );

    if (!response) return;

    const data = await response.json();
    if (!data.success) {
      return { success: false, message: data.message };
    }

    return { success: true, message: data.message };
  } catch (error) {
    console.error("Error al agregar el proyecto:", error);
    return { success: false, message: error.message };
  }
}

export async function UpdateProject(projectData) {
  try {
    const response = await fetchWithAuth(
      `${appsettings.apiUrl}Projects/UpdateProject`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      }
    );

    if (!response) return;

    const data = await response.json();
    if (!data.success) {
      return { success: false, message: data.message };
    }

    return { success: true, message: data.message };
  } catch (error) {
    console.error("Error al actualizar el proyecto:", error);
    return { success: false, message: error.message };
  }
}
// API para eliminar proyectos
export async function DProject(projectID) {
  try {
    const response = await fetchWithAuth(
      `${appsettings.apiUrl}Projects/DeleteProject?projectID=${projectID}`,
      {
        method: "DELETE",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response) return;

    if (response.ok) {
      return true;
    } else {
      console.error("Error al eliminar el proyecto:", response.status);
      return false;
    }
  } catch (error) {
    console.error("DProject error:", error);
    throw error;
  }
}

//API para llamar los proyectos por grupo
export async function getProjects() {
  const response = await fetchWithAuth(
    `${appsettings.apiUrl}Projects/AllProjects`,
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
export async function getProjectsbyStatus(status) {
  const response = await fetchWithAuth(
    `${appsettings.apiUrl}Projects/status/${status}`,
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

//API para obtener los proyectos por fechas
export async function getProjectsByDates(startDate, endDate) {
  const response = await fetchWithAuth(
    `${appsettings.apiUrl}Projects/dates?Start_date=${startDate}&End_date=${endDate}`,
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

//API para obtener los proyectos y tareas para el pdf
export async function getProjectsPDF(startDate, endDate) {
  const response = await fetchWithAuth(
    `${appsettings.apiUrl}Projects/CreatePdf?Start_date=${startDate}&End_date=${endDate}`,
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
