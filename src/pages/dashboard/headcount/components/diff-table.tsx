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

  // Función para normalizar todos los valores antes de comparar
  const normalizeValue = (value: any): any => {
    if (value === null || value === undefined || value === '') return '';
    if (typeof value === 'string') {
      // Normalizar strings: trim, manejar casos especiales
      const trimmed = value.trim();
      
      // Manejar fechas (puedes agregar más formatos si es necesario)
      if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(trimmed)) {
        return trimmed; // Dejar fechas como están para comparación exacta
      }
      
      // Manejar números con formato de string
      if (!isNaN(Number(trimmed.replace(',', '.')))) {
        return Number(trimmed.replace(',', '.'));
      }
      
      return trimmed;
    }
    return value;
  };

  // Función mejorada para comparar cualquier tipo de valor
  const areValuesEqual = (oldVal: any, newVal: any): boolean => {
    const normalizedOld = normalizeValue(oldVal);
    const normalizedNew = normalizeValue(newVal);

    // Caso especial: ambos valores están "vacíos"
    if (normalizedOld === '' && normalizedNew === '') return true;

    // Comparación para números
    if (typeof normalizedOld === 'number' && typeof normalizedNew === 'number') {
      return Math.abs(normalizedOld - normalizedNew) < 0.001;
    }

    // Comparación estricta para otros casos
    return normalizedOld === normalizedNew;
  };

  // Función para detectar cambios por campo
  const getFieldStyle = (oldVal: any, newVal: any, key: string) => {
    if (key === 'id') return colors.unchanged.text;
    if (areValuesEqual(oldVal, newVal)) return colors.unchanged.text;
    if (!oldVal || oldVal === '') return colors.added.text;
    if (!newVal || newVal === '') return colors.removed.text;
    return colors.modified.text;
  };

  // Función para determinar el estado de la fila
  const getRowState = (oldRow: any, newRow: any) => {
    if (!oldRow && newRow) return 'added';
    if (oldRow && !newRow) return 'removed';
    
    const hasChanges = Object.keys(newRow || oldRow).some(
      key => key !== 'id' && !areValuesEqual(oldRow[key], newRow[key])
    );
    
    return hasChanges ? 'modified' : 'unchanged';
  };

  // Obtenemos todas las cédulas únicas
  const allCedulas = [
    ...new Set([
      ...oldData.map((item) => item.cedula),
      ...newData.map((item) => item.cedula),
    ]),
  ].filter(Boolean);

  // Campos que se muestran en la tabla (para debug)
  const visibleFields = ['cedula', 'nombre', 'sueldo', 'kpi', 'cargoActividad'];

  return (
    <div className="border rounded-lg overflow-hidden mb-4 w-full max-w-[95vw]">
      <Table className="w-full">
        <TableHeader>
          <TableRow className={colors.unchanged.background}>
            <TableHead className="w-[120px]">Estado</TableHead>
            {visibleFields.map(field => (
              <TableHead key={field}>
                {field === 'cedula' ? 'Cédula' : 
                 field === 'nombre' ? 'Nombre' :
                 field === 'sueldo' ? 'Sueldo' :
                 field === 'kpi' ? 'KPI' : 'Cargo'}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {allCedulas.map((cedula) => {
            const oldRow = oldData.find((item) => item.cedula === cedula);
            const newRow = newData.find((item) => item.cedula === cedula);
            const state = getRowState(oldRow, newRow);
            const style = colors[state];
            const displayRow = newRow || oldRow;

            // DEBUG: Mostrar diferencias en consola
            if (state === 'modified') {
              console.log('Diferencias para cédula:', cedula);
              Object.keys(newRow || oldRow).forEach(key => {
                if (key !== 'id' && !areValuesEqual(oldRow?.[key], newRow?.[key])) {
                  console.log(`Campo ${key}:`, 'Antiguo:', oldRow?.[key], 'Nuevo:', newRow?.[key]);
                }
              });
            }

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
                
                {visibleFields.map(field => (
                  <TableCell 
                    key={field} 
                    className={getFieldStyle(oldRow?.[field], newRow?.[field], field)}
                  >
                    {state === 'modified' && !areValuesEqual(oldRow?.[field], newRow?.[field]) ? (
                      <>
                        <span className={`line-through ${colors.removed.text} mr-2`}>
                          {oldRow?.[field] ?? '-'}
                        </span>
                        <span className={colors.added.text}>
                          {newRow?.[field] ?? '-'}
                        </span>
                      </>
                    ) : (
                      displayRow?.[field] ?? '-'
                    )}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}