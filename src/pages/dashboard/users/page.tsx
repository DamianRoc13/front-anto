import { DataTable } from "@/components/ui/data-table";
import { getColumns } from "./columns"; 
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useUsers } from "@/hooks/use-users";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

export default function UsersPage() {
  const { users, loading, deleteUser } = useUsers();
  const navigate = useNavigate();


  const columns = getColumns({ deleteUser });

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestión de Usuarios</h1>
        <Button onClick={() => navigate("/dashboard/users/new")}>
          <Plus className="mr-2 size-4" />
          Nuevo Usuario
        </Button>
      </div>

      <DataTable 
        columns={columns} 
        data={users} 
        loading={loading}
      />
    </div>
  );
}