import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from 'sonner';

export const useJefeArea = () => {
  const token = localStorage.getItem('token'); // Obtén el token desde el almacenamiento local

  const getJefesArea = () => useQuery({
    queryKey: ['jefes-area'],
    queryFn: async () => {
      const { data } = await axios.get('http://localhost:3000/jefe-area', {
        headers: {
          Authorization: `Bearer ${token}`, // Agrega el token al encabezado
        },
      });
      return data;
    },
  });

  const createJefeArea = useMutation({
    mutationFn: async (jefeArea: any) => {
      const { data } = await axios.post('http://localhost:3000/jefe-area', jefeArea, {
        headers: {
          Authorization: `Bearer ${token}`, // Agrega el token al encabezado
        },
      });
      return data;
    },
  });

  const deleteJefeArea = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.delete(`http://localhost:3000/jefe-area/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Agrega el token al encabezado
        },
      });
      return data;
    },
  });

  const removerEmpleado = async (jefeAreaId: string, empleadoId: string) => {
    try {
      await fetch(`http://localhost:3000/jefe-area/${jefeAreaId}/remover-kpis`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Usa el token directamente
        },
        body: JSON.stringify([empleadoId]),
      });
      toast.success('Empleado removido correctamente');
    } catch (error) {
      toast.error('Error al remover empleado');
      throw error;
    }
  };

  const asignarEmpleados = async (jefeAreaId: string, empleadoIds: string[]) => {
    try {
      await fetch(`http://localhost:3000/jefe-area/${jefeAreaId}/asignar-kpis`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Usa el token directamente
        },
        body: JSON.stringify(empleadoIds),
      });
      toast.success('Empleados asignados correctamente');
    } catch (error) {
      toast.error('Error al asignar empleados');
      throw error;
    }
  };

  return { getJefesArea, createJefeArea, deleteJefeArea, removerEmpleado, asignarEmpleados };
};
