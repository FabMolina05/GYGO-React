import { appsettings } from "../settings/appsettings";
import { fetchWithAuth } from "../utils/fetchWithAuth";

export const getSectors = async () => {
  try {
    const response = await fetchWithAuth(`${appsettings.apiUrl}Sector/Sector`, {
      method: "GET",
      //credentials: 'include',
      headers: { Accept: "application/json" },
    });

    if (!response) return;

    if (!response.ok) {
      throw new Error("Failed to load categories");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

export const PostSector = async (sectorDTO) => {
  const response = await fetchWithAuth(`${appsettings.apiUrl}Sector/Create`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sectorDTO),
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

export async function UpdateSector(sectorDTO) {
  const response = await fetchWithAuth(`${appsettings.apiUrl}Sector/Update`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(sectorDTO),
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
