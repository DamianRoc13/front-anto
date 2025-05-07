import { useMutation, useQuery } from '@tanstack/react-query';
import axios from 'axios';

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

  return { getJefesArea, createJefeArea, deleteJefeArea };
};
