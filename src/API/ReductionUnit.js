    import {appsettings} from '../settings/appsettings'
    import { fetchWithAuth } from "../utils/fetchWithAuth";
    

    //API para llamar a las unidades de reduccion
    export async function getReductionUnit() {
        const response = await fetchWithAuth(`${appsettings.apiUrl}ReductionUnit`, {
        method: 'GET',
        credentials: 'include', 
        mode: 'cors', // Agregar esto
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json' // Agregar esto
        }
        });
          if (!response) return;


        if(response.ok){
            const data = await response.json();
            return data;
        }else{
            return []
        }
    }