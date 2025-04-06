import { DataTable } from "@/components/ui/data-table";
import { getColumns } from "./columns"; 
import { Button } from "@/components/ui/button";
import { Plus, Minus , Eye, EyeOff } from "lucide-react";
import { useUsers } from "@/hooks/use-users";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

export default function UsersPage() {
  const { users, loading, deleteUser, createUser } = useUsers();
  const [showForm, setShowForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    password: "",
    role: "user",
    permissions: [] as string[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser(formData);
      
      setFormData({
        email: "",
        name: "",
        password: "",
        role: "user",
        permissions: []
      });
      
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const togglePermission = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const columns = getColumns({ deleteUser });

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? (
            <Minus className="mr-2 size-4" />
          ) : (
            <Plus className="mr-2 size-4" />
          )}
          {showForm ? "Cancelar" : "Nuevo Usuario"}
        </Button>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        <div className={`${showForm ? "xl:flex-1 min-w-[600px]" : "w-full"}`}>
          <DataTable 
            columns={columns} 
            data={users} 
            loading={loading}
          />
        </div>

        {showForm && (
          <div className="xl:w-[400px] xl:max-w-[500px] w-full p-6 rounded-lg border bg-card">
            <h2 className="text-xl font-semibold mb-4">Crear Nuevo Usuario</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nombre</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ej: Juan Pérez"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Ej: usuario@ejemplo.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Contraseña</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full border rounded-md p-2 focus:ring-2 focus:ring-primary focus:border-transparent pr-10"
                      placeholder="Mínimo 8 caracteres"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Rol</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full border rounded-md p-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="user">Usuario</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Permisos</label>
                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.permissions.includes("featured")}
                      onChange={() => togglePermission("featured")}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span>Destacado</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit" className="bg-primary hover:bg-primary/90">
                  Crear Usuario
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}