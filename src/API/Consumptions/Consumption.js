import { appsettings } from "../../settings/appsettings";
import { fetchWithAuth } from "../../utils/fetchWithAuth";

export async function getConsumptions() {
  const response = await fetchWithAuth(
    `${appsettings.apiUrl}Consumption/Consumptions`,
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

export async function getConsumptionById(id) {
  const response = await fetchWithAuth(
    `${appsettings.apiUrl}Consumption/ConsumptionById?id=${id}`,
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

export async function addConsumption(consumptionDTO) {
  const response = await fetchWithAuth(
    `${appsettings.apiUrl}Consumption/AddConsumption`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(consumptionDTO),
    }
  );

  if (!response) return;

  if (response.ok) {
    const data = await response.text();
    return data;
  } else {
    const error = await response.text();
    throw new Error(error);
  }
}

export async function UpdateConsumption(consumptionDTO) {
  const response = await fetchWithAuth(
    `${appsettings.apiUrl}Consumption/Update`,
    {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(consumptionDTO),
    }
  );
  if (!response) return;

  if (response.ok) {
    const data = await response.text();
    return data;
  } else {
    const error = await response.text();
    throw new Error(error);
  }
}
