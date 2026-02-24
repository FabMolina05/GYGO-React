import { appsettings } from "../settings/appsettings";
import { fetchWithAuth } from "../utils/fetchWithAuth";

export async function GetCurrentConsumption() {
  const response = await fetchWithAuth(
    `${appsettings.apiUrl}EmissionsConsumption/CurrentConsumption`,
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

export async function GetAnnualConsumption() {
  const response = await fetchWithAuth(
    `${appsettings.apiUrl}EmissionsConsumption/AnnualConsumption`,
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

export async function GetConsumptionHistory() {
  const response = await fetchWithAuth(
    `${appsettings.apiUrl}EmissionsConsumption/ConsumptionHistory`,
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
