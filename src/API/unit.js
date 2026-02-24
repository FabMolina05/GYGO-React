import { appsettings } from "../settings/appsettings";
import { fetchWithAuth } from "../utils/fetchWithAuth";

export const getUnits = async () => {
  try {
    const response = await fetchWithAuth(`${appsettings.apiUrl}Unit/GetUnits`, {
      method: "GET",
      //credentials: "include",
      headers: { Accept: "application/json" },
    });

    if (!response || !response.ok) {
      throw new Error("Failed to load categories");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const CreateUnits = async (unitDTO) => {
  const response = await fetchWithAuth(`${appsettings.apiUrl}Unit/CreateUnit`, {
    method: "POST",
    //credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(unitDTO),
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

export async function UpdateUnits(unitDTO) {
  const response = await fetchWithAuth(`${appsettings.apiUrl}Unit/Update`, {
    method: "POST",
    //credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(unitDTO),
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
