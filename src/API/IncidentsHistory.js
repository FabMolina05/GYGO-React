import { appsettings } from "../settings/appsettings";
import { fetchWithAuth } from "../utils/fetchWithAuth";


export async function GetIncidentsHistory() {
    const response = await fetchWithAuth(`${appsettings.apiUrl}EmissionsIncident/EmissionsIncident`,
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