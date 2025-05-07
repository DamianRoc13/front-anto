import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api'; 

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
  jefeArea: string; // Nuevo campo agregado
}

export interface KpiCommit {
  id: string;
  cedula: string;
  nombreEmpleado: string;
  cargoEmpleado: string;
  calificacionKPI: string;
  totalKPI: string;
  observaciones: string;
  status: 'pending_first' | 'pending_second' | 'approved' | 'rejected';
  createdAt: string;
  firstApprovalAt: string | null;
  firstApprovalBy: string | null;
  secondApprovalAt: string | null;
  secondApprovalBy: string | null;
  rejectionReason: string | null;
}

export function useKPI() {
  const queryClient = useQueryClient();
  const token = localStorage.getItem('token');

  const getKPIs = useQuery<KpiData[]>({
    queryKey: ['kpis'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/kpi', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return Array.isArray(data)
          ? data.map((kpi: KpiData) => ({
              ...kpi,
              jefeArea: kpi.jefeArea || 'Sin jefe asignado', // Maneja el nuevo campo jefeArea
            }))
          : [];
      } catch (error) {
        console.error('Error fetching KPIs:', error);
        return [];
      }
    },
    staleTime: 1000 * 60 * 5
  });

  const createCommitKPI = useMutation({
    mutationFn: async ({ 
      cedula, 
      calificacionKPI,
      observaciones 
    }: { 
      cedula: string; 
      calificacionKPI: number;
      observaciones: string;
    }) => {
      const { data } = await api.post(`/kpi/commits/${cedula}`, { 
        calificacionKPI,
        observaciones
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kpis'] });
    }
  });

  const approveKpiCommit = useMutation({
    mutationFn: async (commitId: string) => {
      const token = localStorage.getItem('token');
      const { data } = await api.put(`/kpi/commits/${commitId}/first-approval`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kpis'] });
      queryClient.invalidateQueries({ queryKey: ['kpi-pending-commits'] });
    }
  });

  const secondApproveCommit = useMutation({
    mutationFn: async ({ id, action, rejectionReason }: { id: string; action: "approve" | "reject"; rejectionReason?: string }) => {
      const { data } = await api.put(`/kpi/commits/${id}/second-approval`, {
        action,
        rejectionReason,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kpis'] });
      queryClient.invalidateQueries({ queryKey: ['kpi-pending-commits'] });
    },
    onError: (error: any) => {
      console.error("Error en secondApproveCommit:", error.response?.data || error);
    }
  });

  const updateCommit = useMutation({
    mutationFn: async ({ id, calificacionKPI, observaciones }: { id: string; calificacionKPI: number; observaciones: string }) => {
      const { data } = await api.put(`/kpi/commits/${id}`, {
        calificacionKPI,
        observaciones,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kpis'] });
      queryClient.invalidateQueries({ queryKey: ['kpi-pending-commits'] });
    }
  });

  const assignJefeArea = useMutation({
    mutationFn: async ({ jefeAreaId, kpiIds }: { jefeAreaId: string; kpiIds: string[] }) => {
      const { data } = await api.patch(`/jefe-area/${jefeAreaId}/asignar-kpis`, kpiIds, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jefes-area'] });
    },
  });

  const unassignJefeArea = useMutation({
    mutationFn: async ({ jefeAreaId, kpiIds }: { jefeAreaId: string; kpiIds: string[] }) => {
      const { data } = await api.patch(`/jefe-area/${jefeAreaId}/remover-kpis`, kpiIds, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jefes-area'] });
    },
  });

  const getPendingCommits = useQuery<KpiCommit[]>({
    queryKey: ['kpi-pending-commits'],
    queryFn: async () => {
      try {
        const { data } = await api.get('/kpi/commits/pending');
        return Array.isArray(data) ? data : [];
      } catch (error) {
        console.error('Error fetching pending commits:', error);
        return [];
      }
    },
    refetchInterval: 30000, 
    staleTime: 1000 * 60 * 5 
  });

  return { 
    getKPIs, 
    createCommitKPI, 
    approveKpiCommit, 
    secondApproveCommit, 
    updateCommit, 
    getPendingCommits, 
    assignJefeArea, 
    unassignJefeArea 
  };
}