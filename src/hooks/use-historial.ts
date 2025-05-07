import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';

export const useHistorial = () => {
  const token = localStorage.getItem('token'); 

  const getHistoriales = () => useQuery({
    queryKey: ['historiales'],
    queryFn: async () => {
      const { data } = await axios.get('http://localhost:3000/historial-kpi', {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      return data;
    },
  });

  const createHistorial = useMutation({
    mutationFn: async (historial: any) => {
      const { data } = await axios.post('http://localhost:3000/historial-kpi', historial, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      return data;
    },
  });

  const deleteHistorial = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await axios.delete(`http://localhost:3000/historial-kpi/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      });
      return data;
    },
  });

  return { getHistoriales, createHistorial, deleteHistorial };
};
