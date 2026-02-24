const API_BASE_URL = "https://localhost:7217";
import { appsettings } from "../settings/appsettings";
import { fetchWithAuth } from "../utils/fetchWithAuth";

export const createEmissionFactor = async (emissionFactorData) => {
  const response = await fetchWithAuth(`${appsettings.apiUrl}Factor/create`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(emissionFactorData),
  });

  if (!response) return;

  if (!response.ok) {
    throw new Error(`Failed to create emission factor: ${response.statusText}`);
  }

  return true;
};

export const getEmissionFactors = async () => {
  const response = await fetchWithAuth(`${appsettings.apiUrl}Factor/getAll`, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response) return;

  if (!response.ok) {
    throw new Error(`Failed to fetch emission factors: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};

export const updateEmissionFactor = async (data) => {
  const response = await fetchWithAuth(`${appsettings.apiUrl}Factor/update`, {
    method: "PUT",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response) return;

  if (!response.ok) {
    throw new Error(`Failed to update emission factor: ${response.statusText}`);
  }

  return true;
};

export const deleteEmissionFactor = async (id) => {
  const response = await fetchWithAuth(
    `${appsettings.apiUrl}Factor/delete/${id}`,
    {
      method: "DELETE",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    }
  );

  if (!response) return;

  if (!response.ok) {
    throw new Error(`Failed to delete emission factor: ${response.statusText}`);
  }

  return { success: true, id };
};

export const getMeasurementUnits = async () => {
  const response = await fetchWithAuth(`${appsettings.apiUrl}Unit/GetUnits`, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response) return;

  if (!response.ok) {
    throw new Error("Failed to load measurement units");
  }
  return await response.json();
};

export const getSectors = async () => {
  const response = await fetchWithAuth(`${appsettings.apiUrl}Sector/Sector`, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response) return;

  if (!response.ok) {
    throw new Error("Failed to load sectors");
  }
  return await response.json();
};

export const getSources = async () => {
  const response = await fetchWithAuth(`${appsettings.apiUrl}Source/Get`, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response) return;

  if (!response.ok) {
    throw new Error("Failed to load sources");
  }
  return await response.json();
};

export const getAllPCGs = async () => {
  const response = await fetchWithAuth(`${appsettings.apiUrl}PCGs/PCGs`, {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response) return;

  if (!response.ok) {
    throw new Error("Failed to load PCGs");
  }
  return await response.json();
};

const parseJSON = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
};
