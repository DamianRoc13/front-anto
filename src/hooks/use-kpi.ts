import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api'; 
import axios from 'axios';

interface KpiData {
  id: number;
  cedula: string;
  nombre: string;
  cargoActividad: string;
  sueldo: string;
  kpi: string;
  grupoCentrosCostos: string;
  calificacionKPI: string;
  totalKPI: string;
  observaciones: string;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  fechaCalificacion: string;
  usuarioCalificador: string;
}



export function useKPI() {
  const queryClient = useQueryClient();

  const getKPIs = useQuery<KpiData[]>({
    queryKey: ['kpis'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/kpi');
        
        console.log('Datos recibidos del backend:', data); 
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error('Error fetching KPIs:', error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5
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
      const { data } = await axios.put(`/kpi/calificar/${cedula}`, { 
        calificacionKPI: calificacion,
        observaciones
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kpis'] });
    }
  });

  return { getKPIs, calificarKPI };
}