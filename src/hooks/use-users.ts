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
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Error al eliminar");
      
      toast.success("Usuario eliminado");
      fetchUsers(); 
    } catch (error) {
      toast.error("Error al eliminar usuario");
      console.error("Delete error:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return { users, loading, deleteUser, fetchUsers };
};