// src/pages/dashboard/kpi/components/diff-table.tsx
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DiffTableProps {
  oldData: any[];
  newData: any[];
}

export function DiffTable({ oldData, newData }: DiffTableProps) {
  const getRowColor = (oldRow: any, newRow: any) => {
    if (!oldRow) return "bg-green-100";
    if (!newRow) return "bg-red-100";
    
    const changed = Object.keys(newRow).some(
      (key) => oldRow[key] !== newRow[key]
    );
    
    return changed ? "bg-yellow-100" : "";
  };

  const allIds = [
    ...new Set([
      ...oldData.map((item) => item.id),
      ...newData.map((item) => item.id),
    ]),
  ];

  return (
    <div className="border rounded-lg overflow-hidden mb-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Estado</TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Cédula</TableHead>
            <TableHead>Sueldo</TableHead>
            <TableHead>KPI</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allIds.map((id) => {
            const oldRow = oldData.find((item) => item.id === id);
            const newRow = newData.find((item) => item.id === id);
            
            const status = !oldRow
              ? "Nuevo"
              : !newRow
              ? "Eliminado"
              : "Modificado";
              
            const displayRow = newRow || oldRow;
            
            return (
              <TableRow key={id} className={getRowColor(oldRow, newRow)}>
                <TableCell>{status}</TableCell>
                <TableCell>{displayRow?.id}</TableCell>
                <TableCell>{displayRow?.nombre}</TableCell>
                <TableCell>{displayRow?.cedula}</TableCell>
                <TableCell>
                  {oldRow?.sueldo !== newRow?.sueldo ? (
                    <>
                      <span className="line-through text-red-500">
                        {oldRow?.sueldo}
                      </span>{" "}
                      → <span className="text-green-500">{newRow?.sueldo}</span>
                    </>
                  ) : (
                    displayRow?.sueldo
                  )}
                </TableCell>
                <TableCell>
                  {oldRow?.kpi !== newRow?.kpi ? (
                    <>
                      <span className="line-through text-red-500">
                        {oldRow?.kpi}
                      </span>{" "}
                      → <span className="text-green-500">{newRow?.kpi}</span>
                    </>
                  ) : (
                    displayRow?.kpi
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}