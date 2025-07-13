import { appsettings } from "../settings/appsettings";
export const getSectors = async () => {
  try {
    const response = await fetch(`${appsettings.apiUrl}Sector/Sector`, {
      method: 'GET',
      credentials: 'include', 
      headers: { Accept: 'application/json' }
    });

    if (!response.ok) {
      throw new Error('Failed to load categories');
    }

    const data = await response.json();
    console.log(data)
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const PostSector = async(sectorDTO) => {
  const response = await fetch(`${appsettings.apiUrl}Sector/Create`,{
    method: 'POST',
    credentials: "include",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(sectorDTO)
  });

  if(response.ok){
    const data = await response.text();
    return data;
  }else{
    const error = await response.text();
    return error;
  }
}

export async function UpdateSector(sectorDTO){
  const response = await fetch(`${appsettings.apiUrl}Sector/Update`, {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(sectorDTO)
        });
    
        if (response.ok) {
            const data = await response.text();
            return data;
        } else {
            const error = await response.text();
            throw new Error(error);
        }
}
