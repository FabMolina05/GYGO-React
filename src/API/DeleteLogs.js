import { appsettings } from "../settings/appsettings";
import { fetchWithAuth } from "../utils/fetchWithAuth";

export async function getDeleteUsers() {
  const response = await fetchWithAuth(
    `${appsettings.apiUrl}DeleteLogs/DeleteUsers`,
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

export async function EmailDeleteUsers() {
  const response = await fetchWithAuth(
    `${appsettings.apiUrl}DeleteLogs/LastDeleteUsers`,
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

export async function getCountUserDelete() {
  const response = await fetchWithAuth(
    `${appsettings.apiUrl}DeleteLogs/CountDeleteUser`,
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
