import {appsettings} from '../settings/appsettings'
import { fetchWithAuth } from "../utils/fetchWithAuth";


export async function GetServices() {
    const response = await fetchWithAuth(`${appsettings.apiUrl}Services/GetServices`, {
      method: 'GET',
      //credentials: 'include', 
      headers: { Accept: 'application/json' }
        }
    );
    if (!response) return [];

    
    if(response.ok){
        const data = await response.json();
        return data;
    }else{
        return []
    }
}