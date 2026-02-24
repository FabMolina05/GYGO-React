import { appsettings } from "../settings/appsettings";

const API_BASE_URL = "http://localhost:7217";

// Get group ID from cookies
const getGroupId = async () => {
  const groupId = await fetchGroupId();

  if (!groupId) {
    throw new Error("Group ID not found in cookies. Please select a group.");
  }

  const parsedGroupId = Number.parseInt(groupId, 10);
  if (isNaN(parsedGroupId)) {
    throw new Error("Invalid group ID format in cookies.");
  }

  return parsedGroupId;
};

// shared helper ─ safe JSON parsing
const parseJSON = async (response) => {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  // fallback (plain-text responses, etc.)
  return response.text();
};

/**
 * Get all users in a group
 * Uses group ID from cookies automatically
 * @returns {Promise<Array>} Array of users in the group
 */

export const getGroupUsers = async () => {
  try {
    const response = await fetch(`${appsettings.apiUrl}Admin/GetGroup`, {
      method: "GET",
      mode: "cors",
      credentials: "include", // add this to send cookies
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch group users: ${response.statusText}`);
    }

    const data = await response.json(); // parse JSON here

    return data;
  } catch (error) {
    console.error("Error fetching group users:", error);
    throw error;
  }
};

export const sendUserInvite = async (email) => {
  try {
    const response = await fetch(`${appsettings.apiUrl}Admin/sendInvite`, {
      method: "POST",
      mode: "cors",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(email),
    });

     const data = await response.json();
    if (!data.success) {
      return { success: false, message: data.message };
    }

    return { success: true, message: data.message };
  } catch (error) {
    console.error("Error sending invite:", error);
    throw error;
  }
};

export const removeUserFromGroup = async (userId) => {
  try {
    const response = await fetch(
      `${appsettings.apiUrl}Admin/removeFromGroup/${userId}`,
      {
        method: "PUT",
        credentials: "include",
        headers: {
          Accept: "text/plain", // El backend devuelve texto
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to remove user: ${response.statusText}`);
    }

    const resultText = await response.text();
    return resultText;
  } catch (error) {
    console.error("Error removing user:", error);
    throw error;
  }
};

async function fetchGroupId() {
  try {
    const response = await fetch(`http://localhost:5135/getGroupId`, {
      method: "GET",
      credentials: "include",
    });

    const groupId = await response.json();
    const hours = 4;
    const expires = new Date(Date.now() + hours * 3600 * 1000).toUTCString();
    document.cookie = `groupId=${groupId}; expires=${expires}; path=/`;
    return groupId;
  } catch (error) {
    console.error("Error fetching group ID:", error);
  }
}

export async function fetchValidarEstadoUsuario(){
  try {
    const response = await fetch(`${appsettings.apiUrl}admin/ValidarEstadoUsuario`, {
      method: "GET",
      credentials: "include",
    });
    if(!response.ok) return { state:false };
    return await response.json();

  } catch (error) {
    return { state:false, error };
  }
}

export { getGroupId, fetchGroupId };
