"use client";
import { useState, useMemo, useEffect } from 'react';
import { useKPI } from '@/hooks/use-kpi';
import { useJefeArea } from '@/hooks/use-jefe-area';
import { useHistorial } from '@/hooks/use-historial'; // Nuevo hook
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ChevronLeft, Settings, Trash, List } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { toast } from "sonner";
import { PendingKpiApprovals } from './components/pending-kpi-approvals';

export default function KPIPage() {
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [showJefeAreaSection, setShowJefeAreaSection] = useState(false);
  const [showHistorialSection, setShowHistorialSection] = useState(false);
  const [showCreateHistorialDialog, setShowCreateHistorialDialog] = useState(false);
  const [newHistorial, setNewHistorial] = useState({ nombre: '', fechaDe: '', fechaHasta: '', guardadoPor: '', tablaKpi: [] });
  const [selectedHistorial, setSelectedHistorial] = useState<any>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newJefeArea, setNewJefeArea] = useState({ id: '', nombre: '', contraseña: '', departamento: '' });
  const [selectedJefeArea, setSelectedJefeArea] = useState<any>(null);
  const { getJefesArea, createJefeArea, deleteJefeArea } = useJefeArea();
  const { data: jefesAreaData, refetch } = getJefesArea();
  const { getHistoriales, createHistorial, deleteHistorial } = useHistorial();
  const { data: historialesData, refetch: refetchHistoriales } = getHistoriales();
  const [historialPassword, setHistorialPassword] = useState('');
  const [showHistorialPasswordDialog, setShowHistorialPasswordDialog] = useState(false);

  const jefesArea = Array.isArray(jefesAreaData) ? jefesAreaData : [];
  const historiales = Array.isArray(historialesData) ? historialesData : [];

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

  const { getKPIs, createCommitKPI, approveKpiCommit } = useKPI();
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
    setShowAdminDialog(true);
  };

  const handleAdminSubmit = () => {
    if (adminPassword === 'admin') {
      setShowJefeAreaSection(true);
      setShowAdminDialog(false);
      setAdminPassword('');
    } else {
      toast.error('Clave de administrador incorrecta');
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
    
    if (calificacion < 0) {
      toast.error('No se permiten números negativos');
      return;
    }
    
    if (calificacion > 300) {
      toast.error('Rango de calificación excedido');
      return;
    }
  
    if (!observaciones.trim()) {
      toast.error('Las observaciones son obligatorias');
      return;
    }
  
    try {
      const commit = await createCommitKPI.mutateAsync({
        cedula: selectedEmployee.cedula,
        calificacionKPI: calificacion,
        observaciones,
      });
  
      toast.success('Calificación creada correctamente');

      // Realizar la primera aprobación del commit creado
      await approveKpiCommit.mutateAsync(commit.id);
      toast.success('Primera aprobación realizada con éxito');
  
      setShowCalificarDialog(false);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al guardar la calificación');
    }
  };

  const handleCreateJefeArea = async () => {
    try {
      await createJefeArea.mutateAsync(newJefeArea);
      toast.success('Jefe de área creado correctamente');
      setNewJefeArea({ id: '', nombre: '', contraseña: '', departamento: '' });
      setShowCreateDialog(false);
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al crear jefe de área');
    }
  };

  const handleDeleteJefeArea = async (id: string) => {
    try {
      await deleteJefeArea.mutateAsync(id);
      toast.success('Jefe de área eliminado correctamente');
      setSelectedJefeArea(null); // Cierra el diálogo automáticamente
      refetch();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al eliminar jefe de área');
    }
  };

  const handleHistorialAccess = () => {
    setShowHistorialPasswordDialog(true); // Muestra el diálogo para ingresar la clave
  };

  const handleHistorialPasswordSubmit = () => {
    if (historialPassword === 'adminhistorial') {
      setShowHistorialSection(true); // Accede a la sección de historial
      setShowHistorialPasswordDialog(false);
      setHistorialPassword('');
    } else {
      toast.error('Clave de historial incorrecta');
    }
  };

  const handleCreateHistorial = async () => {
    try {
      // Envía tablaKpi como un array vacío
      const historialConTablaVacia = { ...newHistorial, tablaKpi: [] };

      await createHistorial.mutateAsync(historialConTablaVacia);
      toast.success('Historial creado correctamente');
      setNewHistorial({ nombre: '', fechaDe: '', fechaHasta: '', guardadoPor: '', tablaKpi: [] }); // Limpia el formulario
      setShowCreateHistorialDialog(false);
      refetchHistoriales();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al crear historial');
    }
  };

  const handleDeleteHistorial = async (id: string) => {
    try {
      await deleteHistorial.mutateAsync(id);
      toast.success('Historial eliminado correctamente');
      setSelectedHistorial(null); // Cierra el diálogo automáticamente
      refetchHistoriales();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error al eliminar historial');
    }
  };

  if (showHistorialSection) {
    return (
      <div className="container mx-auto py-8">
        <Button variant="ghost" className="mb-4" onClick={() => setShowHistorialSection(false)}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Volver
        </Button>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Carga e Historial</h1>
          <Button onClick={() => setShowCreateHistorialDialog(true)}>Crear Historial</Button>
        </div>
        <div className="space-y-4">
          {historiales.map((historial: any) => (
            <div key={historial.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-bold">{historial.nombre}</h2>
                  <p className="text-sm text-gray-500">
                    Desde: {historial.fechaDe} - Hasta: {historial.fechaHasta}
                  </p>
                  <p className="text-sm text-gray-500">Guardado por: {historial.guardadoPor}</p>
                </div>
                <Button variant="ghost" onClick={() => setSelectedHistorial(historial)}>
                  <Trash className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Dialog open={showCreateHistorialDialog} onOpenChange={setShowCreateHistorialDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Historial</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Nombre del historial"
                value={newHistorial.nombre}
                onChange={(e) => setNewHistorial({ ...newHistorial, nombre: e.target.value })}
              />
              <Input
                type="date"
                placeholder="Fecha de inicio"
                value={newHistorial.fechaDe}
                onChange={(e) => setNewHistorial({ ...newHistorial, fechaDe: e.target.value })}
              />
              <Input
                type="date"
                placeholder="Fecha de fin"
                value={newHistorial.fechaHasta}
                onChange={(e) => setNewHistorial({ ...newHistorial, fechaHasta: e.target.value })}
              />
              <Input
                placeholder="Guardado por"
                value={newHistorial.guardadoPor}
                onChange={(e) => setNewHistorial({ ...newHistorial, guardadoPor: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowCreateHistorialDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateHistorial}>Crear</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={!!selectedHistorial} onOpenChange={() => setSelectedHistorial(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>¿Está seguro de eliminar el historial "{selectedHistorial?.nombre}"?</DialogTitle>
            </DialogHeader>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setSelectedHistorial(null)}>
                Cancelar
              </Button>
              <Button onClick={() => handleDeleteHistorial(selectedHistorial.id)}>Eliminar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  if (showJefeAreaSection) {
    return (
      <div className="container mx-auto py-8">
        <Button variant="ghost" className="mb-4" onClick={() => setShowJefeAreaSection(false)}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Volver
        </Button>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Administrador de Jefes de Área</h1>
          <Button onClick={() => setShowCreateDialog(true)}>Crear Jefe de Área</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Contraseña</TableHead>
              <TableHead>Departamento</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jefesArea.map((jefe: any) => (
              <TableRow key={jefe.id}>
                <TableCell>{jefe.id}</TableCell>
                <TableCell>{jefe.nombre}</TableCell>
                <TableCell>{jefe.contraseña}</TableCell>
                <TableCell>{jefe.departamento || 'N/A'}</TableCell>
                <TableCell>
                  <Button variant="ghost" onClick={() => setSelectedJefeArea(jefe)}>
                    <Trash className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Crear Jefe de Área</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="Cédula (10 dígitos)"
                value={newJefeArea.id}
                onChange={(e) => setNewJefeArea({ ...newJefeArea, id: e.target.value })}
              />
              <Input
                placeholder="Nombre"
                value={newJefeArea.nombre}
                onChange={(e) => setNewJefeArea({ ...newJefeArea, nombre: e.target.value })}
              />
              <Input
                placeholder="Contraseña"
                value={newJefeArea.contraseña}
                onChange={(e) => setNewJefeArea({ ...newJefeArea, contraseña: e.target.value })}
              />
              <Input
                placeholder="Departamento (opcional)"
                value={newJefeArea.departamento}
                onChange={(e) => setNewJefeArea({ ...newJefeArea, departamento: e.target.value })}
              />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancelar
              </Button>
              <Button onClick={handleCreateJefeArea}>Crear</Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={!!selectedJefeArea} onOpenChange={() => setSelectedJefeArea(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>¿Está seguro de eliminar a {selectedJefeArea?.nombre}?</DialogTitle>
            </DialogHeader>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setSelectedJefeArea(null)}>
                Cancelar
              </Button>
              <Button onClick={() => handleDeleteJefeArea(selectedJefeArea.id)}>Eliminar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-end mb-4 gap-4">
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={handleAdminAccess}
        >
          <Settings className="h-4 w-4" /> Administrador de Jefes de Área
        </Button>
        <Button
          variant="ghost"
          className="flex items-center gap-2"
          onClick={handleHistorialAccess}
        >
          <List className="h-4 w-4" /> Carga e Historial
        </Button>
      </div>
      {!showTable ? (
        <>
          <h1 className="text-2xl font-bold mb-6">Seleccione por Jefe de Área</h1>
          {isLoadingAll ? (
            <div className="flex justify-center">Cargando jefes de área...</div>
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

          <Dialog open={showHistorialPasswordDialog} onOpenChange={setShowHistorialPasswordDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Acceso a Historial</DialogTitle>
                <DialogDescription>
                  Ingrese la clave de acceso para ver la sección de historial
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Input
                  type="password"
                  value={historialPassword}
                  onChange={(e) => setHistorialPassword(e.target.value)}
                  placeholder="Clave de historial"
                  className="mb-4"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowHistorialPasswordDialog(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleHistorialPasswordSubmit}>
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

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">
              KPI - {viewAllEmployees ? 'TODOS LOS EMPLEADOS' : selectedCargo}
            </h1>
            {viewAllEmployees && (
              <PendingKpiApprovals 
                onActionCompleted={() => {
                  queryClient.invalidateQueries({ queryKey: ['kpis'] });
                }} 
              />
            )}
          </div>
          
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
  <label className="block text-sm font-medium mb-2">Nueva Calificación KPI</label>
  <div className="flex items-center gap-4">
    <Input
      type="number"
      min="0"
      max="300"
      value={nuevaCalificacion}
      onChange={(e) => {
        const value = parseInt(e.target.value);
        if (value < 0) {
          toast.error("No se permiten números negativos");
          setNuevaCalificacion("0");
        } else if (value > 300) {
          toast.error("Rango de calificación excedido");
          setNuevaCalificacion("300");
        } else {
          setNuevaCalificacion(e.target.value);
        }
      }}
      className="w-full"
      placeholder="Ingrese un número de calificación"
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
      <Dialog open={showAdminDialog} onOpenChange={setShowAdminDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Acceso de Administrador</DialogTitle>
            <DialogDescription>
              Ingrese la clave de administrador para acceder al administrador de jefes de área
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
            <Button onClick={handleAdminSubmit}>Acceder</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}