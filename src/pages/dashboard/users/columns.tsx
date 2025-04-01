import { ColumnDef } from "@tanstack/react-table";
import { User } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";


interface ColumnsProps {
  deleteUser: (id: string) => void;
}

export const getColumns = ({ deleteUser }: ColumnsProps): ColumnDef<User>[] => [
  {
    accessorKey: "name",
    header: "Nombre",
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("name")}</span>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Rol",
    cell: ({ row }) => (
      <span className="capitalize px-2 py-1 rounded-full bg-gray-800 text-sm">
        {row.getValue("role")}
      </span>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const navigate = useNavigate();
      const user = row.original;

      return (
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(`/dashboard/users/${user.id}`)}
            className="hover:bg-gray-800"
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteUser(user.id)}
            className="text-red-500 hover:bg-gray-800 hover:text-red-600"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      );
    },
  },
];