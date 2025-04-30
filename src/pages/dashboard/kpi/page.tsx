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


export default function KPIPage() {
  const queryClient = useQueryClient();
  const [selectedCargo, setSelectedCargo] = useState<string | null>(null);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [password, setPassword] = useState('');
  const [showTable, setShowTable] = useState(false);
  const [showCalificarDialog, setShowCalificarDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [nuevaCalificacion, setNuevaCalificacion] = useState('');
  const [observaciones, setObservaciones] = useState('');

  const { getKPIs, calificarKPI } = useKPI();
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
    
    console.log('Procesando cargos...', allKPIs); 
  
    // Filtramos primero los que tienen KPI > 0
    const conKPI = allKPIs.filter(item => parseFloat(item.kpi) > 0);
    
   
    const cargos = new Set<string>();
    conKPI.forEach(item => {
      if (item.cargoActividad && item.cargoActividad.trim() !== '') {
        cargos.add(item.cargoActividad.trim());
      }
    });
    
    console.log('Cargos encontrados:', Array.from(cargos)); 
    return Array.from(cargos).sort();
  }, [allKPIs]);

  // Filtrar empleados por cargo seleccionado
  const empleadosFiltrados = useMemo(() => {
    if (!selectedCargo) return [];
    return allKPIs.filter(item => item.cargoActividad === selectedCargo);
  }, [selectedCargo, allKPIs]);

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
    setShowPasswordDialog(true);
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

  const handleCalificarSubmit = () => {
    if (!selectedEmployee || !nuevaCalificacion) return;
    
    const calificacion = Number(nuevaCalificacion);
    if (calificacion < 0 || calificacion > 300) {
      alert('La calificación debe estar entre 0 y 300');
      return;
    }

    calificarKPI.mutate({
      cedula: selectedEmployee.cedula,
      calificacion,
      observaciones
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['kpis'] });
        setShowCalificarDialog(false);
      }
    });
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
              {cargosUnicos.map((cargo, index) => {
                const count = allKPIs.filter(item => item.cargoActividad === cargo).length;
                return (
                  <Card key={index} className="cursor-pointer hover:bg-gray-50" onClick={() => handleCargoClick(cargo)}>
                    <CardHeader>
                      <CardTitle className="text-lg">{cargo}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500">
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
        </>
      ) : (
        <>
          <Button variant="ghost" className="mb-4" onClick={() => setShowTable(false)}>
            <ChevronLeft className="mr-2 h-4 w-4" /> Volver a cargos
          </Button>

          <h1 className="text-2xl font-bold mb-6">KPI - {selectedCargo}</h1>
          
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cédula</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Calificación</TableHead>
                  <TableHead>Calificador</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {empleadosFiltrados.map((item) => (
                  <TableRow key={item.cedula}>
                    <TableCell>{item.cedula}</TableCell>
                    <TableCell>{item.nombre}</TableCell>
                    <TableCell>{item.cargoActividad}</TableCell>
                    <TableCell>{item.calificacionKPI}</TableCell>
                    <TableCell>{item.usuarioCalificador}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        item.estado === 'aprobado' ? 'bg-green-100 text-green-800' :
                        item.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.estado}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button 
                        size="sm" 
                        onClick={() => handleCalificarClick(item)}
                        disabled={item.estado === 'aprobado'}
                      >
                        Calificar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Diálogo de calificación (se mantiene igual) */}
          <Dialog open={showCalificarDialog} onOpenChange={setShowCalificarDialog}>
            {/* ... contenido del diálogo ... */}
          </Dialog>
        </>
      )}
    </div>
  );
}