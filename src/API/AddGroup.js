import { appsettings } from "../settings/appsettings";
import { fetchWithAuth } from "../utils/fetchWithAuth";


export async function PostAddGroup(newGroup, correogrupo, selectedService,image) {
  try {

    
    const formData = new FormData();
    formData.append("nombre", newGroup);
    formData.append("correo", correogrupo);
    formData.append("idService", selectedService);
    formData.append("Logo", image);



    const response = await fetchWithAuth(`${appsettings.apiUrl}Group/create`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    if (!response) return;

    
  if (response.ok) {
        return { success: true };
    }
      const data = await response.json();
       
       return { success: false, error: data };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getUsers(){
    const response = await fetch(`${appsettings.apiUrl}getUsers`);
    

    if(response.ok){
        const data = await response.json();
        return data;
    }else{
        return [];
    }
}

export async function reactivateGroup(groupId){
  const res = await fetchWithAuth(`${appsettings.apiUrl}Group/reactivate/${groupId}`, {
    method: "PUT",
    credentials: "include"
  });
    if (!response) return;

  return await response.json();
};


export async function DoesUserHaveGroup(){
  try{
    const res = await fetchWithAuth(`${appsettings.apiUrl}Group/DoesUserHaveGroup`, {
      method: "GET",
      credentials: "include"
    });

    if(!res.ok) return { state:false };
    return await res.json();

  }catch(err){
    return { success:false, error:err };
  }
}

