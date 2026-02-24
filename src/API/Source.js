import { appsettings } from "../settings/appsettings";
import { fetchWithAuth } from "../utils/fetchWithAuth";

export const getSources = async () => {
  try {
    const response = await fetchWithAuth(`${appsettings.apiUrl}Source/Get`, {
      method: "GET",
      //credentials: 'include',
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error("Failed to load sources");
    }
    if (!response) return;

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching sources:", error);
    throw error;
  }
};

export const CreateSource = async (sourceDTO) => {
  const response = await fetchWithAuth(`${appsettings.apiUrl}Source/Create`, {
    method: "POST",
    //credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sourceDTO),
  });

  if (!response) return;

  if (response.ok) {
    const data = await response.text();
    return { success: true, message: data };
  } else {
    const error = await response.json();
    return { success: false, message: error.message };
  }
};

export async function UpdateSource(sourceDTO) {
  const response = await fetchWithAuth(`${appsettings.apiUrl}Source/Update`, {
    method: "POST",
    //credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sourceDTO),
  });
  
  if (!response) return;

  if (response.ok) {
    const data = await response.text();
    return { success: true, message: data };
  } else {
    const error = await response.json();
    return { success: false, message: error.message };
  }
}
