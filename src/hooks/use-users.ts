import { useState, useEffect } from "react";
import { API_URL } from "@/lib/constants";
import { toast } from "sonner";
import { User } from "@/types/user"; 

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      
      if (!response.ok) throw new Error("Error en la respuesta");
      
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      toast.error("Error al cargar usuarios");
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/users/delete`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ id: id })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al eliminar usuario");
      }
      
      toast.success("Usuario eliminado correctamente");
      fetchUsers(); 
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al eliminar usuario");
      console.error("Delete error:", error);
    }
  };

  const createUser = async (userData: {
    email: string;
    name: string;
    password: string;
    role: string;
    permissions: string[];
  }) => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear usuario");
      }
  
      const data = await response.json();
      toast.success("Usuario creado exitosamente");
      fetchUsers(); 
      return data;
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al crear usuario");
      console.error("Create error:", error);
      throw error;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, deleteUser, fetchUsers , createUser };
};