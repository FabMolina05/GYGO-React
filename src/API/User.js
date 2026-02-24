import { appsettings } from "../settings/appsettings";
import { fetchWithAuth } from "../utils/fetchWithAuth";

export const ChangeProfileUser = async(changeProfile) => {
    try {
    const response = await fetchWithAuth(`${appsettings.apiUrl}user/editProfile`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(changeProfile),
    });
    if (!response) return;


    const data = await response.json(); 
    return data
  } catch (error) {
    return { success: false, error: error.message };
  }
}