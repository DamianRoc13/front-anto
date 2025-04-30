import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface KpiData {
  cedula: string;
  nombre: string;
  cargoActividad: string;
  calificacionKPI: number;
  usuarioCalificador: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
}

export function useKPI() {
  const queryClient = useQueryClient();

  const getKPIs = useQuery<KpiData[]>({
    queryKey: ['kpis'],
    queryFn: async () => {
      try {
        const { data } = await axios.get('/api/kpi');
        return Array.isArray(data) ? data : []; 
      } catch (error) {
        console.error('Error fetching KPIs:', error);
        return []; 
      }
    },
    staleTime: 1000 * 60 * 5
  });

  const getKPIsByCargo = (cargo: string) => useQuery<KpiData[]>({
    queryKey: ['kpis', cargo],
    queryFn: async () => {
      const { data } = await axios.get(`/api/kpi?cargo=${cargo}`);
      return data;
    },
    enabled: !!cargo
  });

  const calificarKPI = useMutation({
    mutationFn: async ({ 
      cedula, 
      calificacion,
      observaciones 
    }: { 
      cedula: string; 
      calificacion: number;
      observaciones?: string;
    }) => {
      const { data } = await axios.put(`/api/kpi/calificar/${cedula}`, { 
        calificacionKPI: calificacion,
        observaciones
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kpis'] });
    }
  });

  return { getKPIs, getKPIsByCargo, calificarKPI };
}