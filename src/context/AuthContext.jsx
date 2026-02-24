import { createContext, useContext, useState, useEffect } from "react";
import { refreshLogin } from "../API/Auth";
import { useNavigate } from 'react-router-dom';
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(() => sessionStorage.getItem("userRole"));
  const [userId, setUserId] = useState(() => sessionStorage.getItem("userId") || null);
  const [userGroup, setUserGroup] = useState(() => sessionStorage.getItem("userGroup") || null); // ← AGREGAR
  const [hasPaidGroupAdminAccess, setHasPaidGroupAdminAccess] = useState(false);
  
  const navigate = useNavigate(); 



  const login = (newRole, id, groupId = null) => { // ← Agregar groupId opcional
    
    setRole(newRole);
    setUserId(id);
    setUserGroup(groupId); // ← AGREGAR
    sessionStorage.setItem("userRole", newRole);
    sessionStorage.setItem("userId", id);
    if (groupId) {
      sessionStorage.setItem("userGroup", groupId); // ← AGREGAR
    }
  };

  const logoutRol = () => {
    setRole(null);
    setUserId(null);
    setUserGroup(null); // ← AGREGAR
    sessionStorage.removeItem("userRole");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("userGroup"); // ← AGREGAR
    sessionStorage.clear();    
  };

  const refreshUserData = async () => {
    try {
      const data = await refreshLogin();
      
      
      if (data?.user?.role && data?.user?.id) {
        setRole(data.user.role);
        setUserId(data.user.id);
        setUserGroup(data.user.groupId); // ← Ahora sí existe
        
        sessionStorage.setItem("userRole", data.user.role);
        sessionStorage.setItem("userId", data.user.id);
        
        if (data.user.groupId) { // ← Solo guardar si existe
          sessionStorage.setItem("userGroup", data.user.groupId);
        }
        
        return true; // ← Indicar éxito
      } else {
        console.error("No se pudo refrescar el usuario:", data);
        return false; // ← Indicar fallo
      }
    } catch (error) {
      console.error("Error al refrescar el login:", error);
      return false; // ← Indicar fallo
    }
  };

  const markUserAsPaid = () => {
    setHasPaidGroupAdminAccess(true);
  };

  const updateRole = (newRole) => {
    setRole(newRole);
    sessionStorage.setItem("userRole", newRole);
  };

  return (
    <AuthContext.Provider
      value={{
        role,
        userId,
        userGroup, // ← AGREGAR
        hasPaidGroupAdminAccess,
        login,
        logoutRol,
        refreshUserData,
        markUserAsPaid,
        updateRole
            }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};