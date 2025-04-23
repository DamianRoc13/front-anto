import { ColumnDef } from "@tanstack/react-table";
import { Headcount } from "@/types/headcount";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { RowInfoModal } from "./row-info-modal";

export const columns: ColumnDef<Headcount>[] = [
  {
    accessorKey: "tipoIESS",
    header: "Tipo IESS",
  },
  {
    accessorKey: "nombre",
    header: "Nombre",
  },
  {
    accessorKey: "cedula",
    header: "Cédula",
  },
  {
    accessorKey: "sueldo",
    header: "Sueldo",
    cell: ({ row }) => `$${row.getValue("sueldo")}`,
  },
  {
    accessorKey: "kpi",
    header: "KPI",
  },
  {
    accessorKey: "cargoActividad",
    header: "Cargo",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const employee = row.original;
      return (
        <RowInfoModal data={employee}>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <Info className="h-4 w-4" />
          </Button>
        </RowInfoModal>
      );
    },
  },
];