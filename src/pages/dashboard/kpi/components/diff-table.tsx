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
  // Esquema de colores GitHub
  const colors = {
    added: {
      background: "bg-[#1c4428]",
      text: "text-[#56d364]",
      border: "border-[#2c7045]"
    },
    removed: {
      background: "bg-[#462c32]",
      text: "text-[#f85149]",
      border: "border-[#80393f]"
    },
    unchanged: {
      background: "bg-[#161b22]",
      text: "text-[#8b949e]",
      border: "border-[#30363d]"
    },
    modified: {
      background: "bg-[#341a00]",
      text: "text-[#e3b341]",
      border: "border-[#693e00]"
    }
  };

  // Obtenemos todas las cédulas únicas
  const allCedulas = [
    ...new Set([
      ...oldData.map((item) => item.cedula),
      ...newData.map((item) => item.cedula),
    ]),
  ].filter(Boolean);

  // Función para detectar cambios por campo
  const getFieldStyle = (oldVal: any, newVal: any, key: string) => {
    if (key === 'id') return colors.unchanged.text; // Ignorar ID
    if (oldVal === newVal) return colors.unchanged.text;
    if (!oldVal) return colors.added.text;
    if (!newVal) return colors.removed.text;
    return colors.modified.text;
  };

  // Función para determinar el estado de la fila
  const getRowState = (oldRow: any, newRow: any) => {
    if (!oldRow && newRow) return 'added';
    if (oldRow && !newRow) return 'removed';
    
    const hasChanges = Object.keys(newRow || oldRow).some(
      key => key !== 'id' && oldRow[key] !== newRow[key]
    );
    
    return hasChanges ? 'modified' : 'unchanged';
  };

  return (
    <div className="border rounded-lg overflow-hidden mb-4 w-full max-w-[95vw]">
      <Table className="w-full">
        <TableHeader>
          <TableRow className={colors.unchanged.background}>
            <TableHead className="w-[120px]">Estado</TableHead>
            <TableHead>Cédula</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Sueldo</TableHead>
            <TableHead>KPI</TableHead>
            <TableHead>Cargo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allCedulas.map((cedula) => {
            const oldRow = oldData.find((item) => item.cedula === cedula);
            const newRow = newData.find((item) => item.cedula === cedula);
            const state = getRowState(oldRow, newRow);
            const style = colors[state];
            const displayRow = newRow || oldRow;

            // Texto descriptivo del estado
            const statusText = {
              added: 'Nuevo',
              removed: 'Eliminado',
              modified: 'Modificado',
              unchanged: 'Sin cambios'
            }[state];

            return (
              <TableRow key={cedula} className={`${style.background} ${style.border}`}>
                <TableCell className={`font-medium ${style.text}`}>
                  {statusText}
                </TableCell>
                <TableCell className={getFieldStyle(oldRow?.cedula, newRow?.cedula, 'cedula')}>
                  {displayRow?.cedula}
                </TableCell>
                <TableCell className={getFieldStyle(oldRow?.nombre, newRow?.nombre, 'nombre')}>
                  {state === 'modified' && oldRow?.nombre !== newRow?.nombre ? (
                    <>
                      <span className={`line-through ${colors.removed.text} mr-2`}>
                        {oldRow?.nombre}
                      </span>
                      <span className={colors.added.text}>
                        {newRow?.nombre}
                      </span>
                    </>
                  ) : (
                    displayRow?.nombre
                  )}
                </TableCell>
                <TableCell className={getFieldStyle(oldRow?.sueldo, newRow?.sueldo, 'sueldo')}>
                  {state === 'modified' && oldRow?.sueldo !== newRow?.sueldo ? (
                    <>
                      <span className={`line-through ${colors.removed.text} mr-2`}>
                        {oldRow?.sueldo}
                      </span>
                      <span className={colors.added.text}>
                        {newRow?.sueldo}
                      </span>
                    </>
                  ) : (
                    displayRow?.sueldo
                  )}
                </TableCell>
                <TableCell className={getFieldStyle(oldRow?.kpi, newRow?.kpi, 'kpi')}>
                  {state === 'modified' && oldRow?.kpi !== newRow?.kpi ? (
                    <>
                      <span className={`line-through ${colors.removed.text} mr-2`}>
                        {oldRow?.kpi}
                      </span>
                      <span className={colors.added.text}>
                        {newRow?.kpi}
                      </span>
                    </>
                  ) : (
                    displayRow?.kpi
                  )}
                </TableCell>
                <TableCell className={getFieldStyle(oldRow?.cargoActividad, newRow?.cargoActividad, 'cargoActividad')}>
                  {state === 'modified' && oldRow?.cargoActividad !== newRow?.cargoActividad ? (
                    <>
                      <span className={`line-through ${colors.removed.text} mr-2`}>
                        {oldRow?.cargoActividad}
                      </span>
                      <span className={colors.added.text}>
                        {newRow?.cargoActividad}
                      </span>
                    </>
                  ) : (
                    displayRow?.cargoActividad
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