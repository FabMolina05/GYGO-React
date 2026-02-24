import { appsettings } from "../../settings/appsettings";
import { fetchWithAuth } from "../../utils/fetchWithAuth";


export async function getMonthlyHistory(id){
    const response = await fetchWithAuth(`${appsettings.apiUrl}MonthlyConsumption/GetHistory?consumptionId=${id}`,
        {
      method: "GET",
      credentials: "include",
    }
    ); //7217 puerto

  if (!response) return;


    if(response.ok){
        const data = await response.json();
        return data;
    }else{
        return [];
    }
}