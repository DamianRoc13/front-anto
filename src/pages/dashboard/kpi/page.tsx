"use client";
import { useState, useMemo, useEffect } from 'react';
import { useKPI } from '@/hooks/use-kpi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ChevronLeft } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { Slider } from '@/components/ui/slider';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { toast } from "sonner";
import axios from 'axios';

export default function KPIPage() {
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const queryClient = useQueryClient();
  const [selectedCargo, setSelectedCargo] = useState<string | null>(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [showTable, setShowTable] = useState(false);
  const [showCalificarDialog, setShowCalificarDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [nuevaCalificacion, setNuevaCalificacion] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [viewAllEmployees, setViewAllEmployees] = useState(false);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const { getKPIs,createCommitKPI } = useKPI();
  const { 
    data: allKPIs = [], 
    isLoading: isLoadingAll, 
    error: errorAll 
  } = getKPIs;

  useEffect(() => {
    console.log('Datos completos recibidos:', allKPIs);
    console.log('Cargos únicos calculados:', cargosUnicos);
  }, [allKPIs]);

  const cargosUnicos = useMemo(() => {
    if (!allKPIs || allKPIs.length === 0) return [];
    
    const conKPI = allKPIs.filter(item => parseFloat(item.kpi) > 0);
    const cargos = new Set<string>();
    conKPI.forEach(item => {
      if (item.cargoActividad && item.cargoActividad.trim() !== '') {
        cargos.add(item.cargoActividad.trim());
      }
    });
    return Array.from(cargos).sort();
  }, [allKPIs]);

  const empleadosFiltrados = useMemo(() => {
    let filtered = viewAllEmployees ? allKPIs : (selectedCargo ? allKPIs.filter(item => item.cargoActividad === selectedCargo) : []);
    return filtered;
  }, [selectedCargo, allKPIs, viewAllEmployees]);

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "cedula",
      header: "Cédula",
    },
    {
      accessorKey: "nombre",
      header: "Nombre",
    },
    {
      accessorKey: "cargoActividad",
      header: "Cargo",
    },
    {
      accessorKey: "calificacionKPI",
      header: "Calificación",
    },
    {
      accessorKey: "usuarioCalificador",
      header: "Calificador",
    },
    {
      accessorKey: "estado",
      header: "Estado",
      cell: ({ row }) => (
        <span className={`px-2 py-1 rounded-full text-xs ${
          row.original.estado === 'aprobado' ? 'bg-green-100 text-green-800' :
          row.original.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {row.original.estado}
        </span>
      ),
    },
    {
      id: "acciones",
      cell: ({ row }) => (
        <Button 
          size="sm" 
          onClick={() => handleCalificarClick(row.original)}
        >
          Calificar
        </Button>
      ),
    },
  ];

  const table = useReactTable({
    data: empleadosFiltrados,
    columns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  if (errorAll) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-red-500 p-4 border border-red-200 rounded bg-red-50">
          Error cargando datos: {(errorAll as Error)?.message}
        </div>
      </div>
    );
  }

  const handleCargoClick = (cargo: string) => {
    setSelectedCargo(cargo);
    setViewAllEmployees(false);
    setShowPasswordDialog(true);
  };

  const handleAdminAccess = () => {
    setSelectedCargo('TODOS LOS EMPLEADOS');
    setShowAdminDialog(true);
  };

  const handleAdminSubmit = () => {
    if (adminPassword === 'admin') {
      setViewAllEmployees(true);
      setShowTable(true);
      setShowAdminDialog(false);
      setAdminPassword('');
    } else {
      alert('Clave de administrador incorrecta');
    }
  };

  const handlePasswordSubmit = () => {
    if (password === 'TRCORALV1010') {
      setShowTable(true);
      setShowPasswordDialog(false);
      setPassword('');
    } else {
      alert('Clave incorrecta');
    }
  };

  const handleCalificarClick = (employee: any) => {
    setSelectedEmployee(employee);
    setNuevaCalificacion(employee.calificacionKPI.toString());
    setObservaciones(employee.observaciones || '');
    setShowCalificarDialog(true);
  };

  const handleCalificarSubmit = async () => {
    if (!selectedEmployee || !nuevaCalificacion) return;
    
    const calificacion = Number(nuevaCalificacion);
    if (calificacion < 0 || calificacion > 300) {
      toast.error('La calificación debe estar entre 0 y 300');
      return;
    }
  
    if (!observaciones.trim()) {
      toast.error('Las observaciones son obligatorias');
      return;
    }
  
    try {
      await createCommitKPI.mutateAsync({
        cedula: selectedEmployee.cedula,
        calificacionKPI: calificacion,
        observaciones
      });
  
      toast.success('Calificación creada correctamente');
      setShowCalificarDialog(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al guardar la calificación');
    }
  };

  return (
    <div className="container mx-auto py-8">
      {!showTable ? (
        <>
          <h1 className="text-2xl font-bold mb-6">Seleccione un Cargo</h1>
          {isLoadingAll ? (
            <div className="flex justify-center">Cargando cargos...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card className="cursor-pointer hover:bg-gray-50 group" onClick={handleAdminAccess}>
                <CardHeader>
                  <CardTitle className="text-lg group-hover:text-gray-500">
                    TODOS LOS EMPLEADOS
                  </CardTitle>
                </CardHeader>
               <CardContent>
                <p className="text-sm text-gray-500 group-hover:text-gray-700">
                  {allKPIs.length} empleados
                </p>
               </CardContent>
              </Card>

              {cargosUnicos.map((cargo, index) => {
                const count = allKPIs.filter(item => item.cargoActividad === cargo).length;
                return (
                  <Card key={index} className="cursor-pointer hover:bg-gray-50 group" onClick={() => handleCargoClick(cargo)}>
                    <CardHeader>
                      <CardTitle className="text-lg group-hover:text-gray-500">{cargo}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500 group-hover:text-gray-700">
                        {count} empleado{count !== 1 ? 's' : ''}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Ingrese la clave de acceso para {selectedCargo}</DialogTitle>
                <DialogDescription>
                  Solo personal autorizado puede acceder a esta información
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingrese la clave"
                  className="mb-4"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={handlePasswordSubmit}>
                  Acceder
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={showAdminDialog} onOpenChange={setShowAdminDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Acceso de Administrador</DialogTitle>
                <DialogDescription>
                  Ingrese la clave de administrador para ver todos los empleados
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Input 
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Clave de administrador"
                  className="mb-4"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAdminDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAdminSubmit}>
                  Acceder
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      ) : (
        <>
          <Button variant="ghost" className="mb-4" onClick={() => {
            setShowTable(false);
            setViewAllEmployees(false);
          }}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Volver a cargos
          </Button>

          <h1 className="text-2xl font-bold mb-6">
            KPI - {viewAllEmployees ? 'TODOS LOS EMPLEADOS' : selectedCargo}
          </h1>
          
          <div className="border rounded-lg overflow-hidden">
            <div className="p-4 \ border-b flex flex-col sm:flex-row gap-4">
              <Input
                placeholder="Filtrar por cédula"
                value={(table.getColumn("cedula")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                  table.getColumn("cedula")?.setFilterValue(event.target.value)
                }
                className="max-w-xs"
              />
              <Input
                placeholder="Filtrar por nombre"
                value={(table.getColumn("nombre")?.getFilterValue() as string) ?? ""}
                onChange={(event) =>
                  table.getColumn("nombre")?.setFilterValue(event.target.value)
                }
                className="max-w-xs"
              />
            </div>
            
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      No se encontraron resultados
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <Dialog open={showCalificarDialog} onOpenChange={setShowCalificarDialog}>
            <DialogContent className="sm:max-w-[600px]">
              <div className="text-center">
                <DialogTitle className="text-xl">Calificar KPI</DialogTitle>
              </div>
              
              <div className="grid grid-cols-2 gap-4 py-4">
                <div>
                  <p className="text-sm font-medium">Cédula</p>
                  <p className="text-sm">{selectedEmployee?.cedula}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Nombre</p>
                  <p className="text-sm">{selectedEmployee?.nombre}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Cargo</p>
                  <p className="text-sm">{selectedEmployee?.cargoActividad}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Calificación Actual</p>
                  <p className="text-sm">{selectedEmployee?.calificacionKPI}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nueva Calificación (0-300)</label>
                  <div className="flex items-center gap-4">
                    <Slider
                      min={0}
                      max={300}
                      value={[Number(nuevaCalificacion)]}
                      onValueChange={(value) => setNuevaCalificacion(value[0].toString())}
                      className="flex-1"
                    />
                    <Input
                      type="number"
                      min="0"
                      max="300"
                      value={nuevaCalificacion}
                      onChange={(e) => setNuevaCalificacion(e.target.value)}
                      className="w-20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Observaciones <span className="text-red-500">*</span></label>
                  <Input
                    value={observaciones}
                    onChange={(e) => setObservaciones(e.target.value)}
                    placeholder="Ingrese observaciones (obligatorio)"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
  <Button variant="outline" onClick={() => setShowCalificarDialog(false)}>
    Cancelar
  </Button>
  <Button 
    onClick={handleCalificarSubmit} 
    disabled={!observaciones.trim() || createCommitKPI.isPending}
  >
    {createCommitKPI.isPending ? 'Enviando...' : 'Calificar'}
  </Button>
</div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}