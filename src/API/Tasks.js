import { appsettings } from "../settings/appsettings";
import { fetchWithAuth } from "../utils/fetchWithAuth";


//API para llamar los proyectos por grupo
export async function AddTask(taskData) {
  try {
    
    const response = await fetchWithAuth(`${appsettings.apiUrl}Tasks/AddTask`, {
      method: "POST",
      //credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });

    if (!response) return;

    const data = await response.json();
    
    if (!data.success) {
      return { success: false, message: data.message };
    }

    return { success: true, message: data.message };
  } catch (error) {
    console.error("Error al agregar el proyecto", error);
    return { success: false, message: error.message };
  }
}

export async function UpdateTaskt(taskData) {
  try {
    const response = await fetchWithAuth(`${appsettings.apiUrl}Tasks/UpdateTask`, {
      method: "PUT",
      //credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskData),
    });

    if (!response) return;


    const data = await response.json();

    if (!data.success) {
      return { success: false, message: data.message };
    }

    return { success: true, message: data.message };
  } catch (error) {
    console.error("Error al actualizar la tarea:", error);
    return { success: false, message: error.message };
  }
}

// API para eliminar proyectos
export async function DeleteTask(taskID) {
  try {
    const response = await fetchWithAuth(
      `${appsettings.apiUrl}Tasks/DeleteTask?TaskID=${taskID}`,
      {
        //credentials: "include",
        method: "DELETE",
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
export async function getTasks(projectID) {
  const response = await fetchWithAuth(
    `${appsettings.apiUrl}Tasks/TasksByProject/${projectID}`,
    {
      //credentials: "include",
      method: "GET",
    }
  );

   if (!response) return [];


  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    return [];
  }
}

//API para actulizar el status de los proyectos
export async function UpdateStatusTask(tasksID, status) {
  try {
    const response = await fetchWithAuth(
      `${appsettings.apiUrl}Tasks/UpdateTaskStatus?TaskId=${tasksID}&status=${status}`,
      {
        //credentials: "include",
        method: "PUT",
      }
    );

     if (!response) return false;

     
    if (response.ok) {
      return true;
    } else {
      console.error("Error al actualizar el estado:", response.statusText);
      return false;
    }
  } catch (error) {
    console.error("Error en la petición:", error);
    return false;
  }
}
