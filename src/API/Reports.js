import { appsettings } from "../settings/appsettings";
import { fetchWithAuth } from "../utils/fetchWithAuth";

export async function getReportCompanies({
  status = null,
  idService = null,
} = {}) {
  const params = new URLSearchParams();

  if (status !== null) {
    params.append("status", status);
  }
  if (idService !== null) {
    params.append("idService", idService);
  }

  const url = `${appsettings.apiUrl}Reports/AllCompanies${params.toString() ? `?${params}` : ""}`;
  const response = await fetchWithAuth(url, {
    method: "GET",
    credentials: "include",
    headers: { Accept: "application/json" },
  });

  if (!response) return;

  if (response.ok) {
    const data = await response.json();
    return data;
  } else {
    return [];
  }
}

export async function GetServices() {
  const response = await fetchWithAuth(
    `${appsettings.apiUrl}Services/GetServices`,

    {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
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

export async function GetReportsGroupsByService() {
  const response = await fetchWithAuth(
    `${appsettings.apiUrl}Reports/ServicesGroupByService`,
    {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
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

export async function GetReportsGroupsDetails() {
  const response = await fetchWithAuth(
    `${appsettings.apiUrl}Reports/GetGropusDetails`,
    {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
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
