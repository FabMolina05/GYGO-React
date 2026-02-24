import { appsettings } from "../settings/appsettings";
import { fetchWithAuth } from "../utils/fetchWithAuth";

export async function getFactoresEmision() {
  const response = await fetchWithAuth(`${appsettings.apiUrl}Factor/getAll`, {
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

export async function addFactorEmision(factorDTO) {
  const response = await fetchWithAuth(`${appsettings.apiUrl}Factor/create`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(factorDTO),
  });
  if (!response) return;

  if (response.ok) {
    const data = await response.text();
    return data;
  } else {
    const error = await response.text();
    throw new Error(error);
  }
}
