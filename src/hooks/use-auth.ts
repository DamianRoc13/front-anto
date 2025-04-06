import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "@/lib/constants";
import { toast } from "sonner";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  
  const login = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Error al iniciar sesión");

      
      localStorage.setItem("user", JSON.stringify({
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
        permissions: result.user.permissions || []
      }));
      localStorage.setItem("token", result.access_token);
      
      toast.success(`Bienvenido, ${result.user.name || ''}`);
      navigate("/dashboard");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error desconocido");
    } finally {
      setIsLoading(false);
    }
  };

  
  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.success("Sesión cerrada correctamente");
    navigate("/");
  };

  
  const isAuthenticated = () => {
    return !!localStorage.getItem("token");
  };

  
  const getUser = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  };

  
  const hasRole = (role: string) => {
    const user = getUser();
    return user?.role === role;
  };

  
  const hasPermission = (permission: string) => {
    const user = getUser();
    return user?.permissions?.includes(permission) || user?.permissions?.includes('all');
  };

  return { 
    login, 
    logout,
    isLoading, 
    isAuthenticated,
    user: getUser(),
    hasRole,
    hasPermission
  };
};