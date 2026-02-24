import { appsettings } from "../settings/appsettings";
import { fetchWithAuth } from "../utils/fetchWithAuth";

export async function getDashboardGroup() {
  const response = await fetchWithAuth(`${appsettings.apiUrl}DashboardGroup`, {
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

export async function getSuperAdminDashboard() {
  const response = await fetchWithAuth(
    `${appsettings.apiUrl}SuperAdmin/Dashboard`,
    {
      method: "GET",
      credentials: "include",
    }
  ); //7217 puerto

  if (!response) return;

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    return [];
  }
}
