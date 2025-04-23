import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './use-auth';

export function useHeadcount() {
  const [data, setData] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const auth = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      if (!auth.user) return; // Agregar esta línea
      
      try {
        const token = localStorage.getItem('token');
        if (!token) return;
  
        const response = await axios.get('http://localhost:3000/headcount', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setData(response.data);
      } catch (err) {
        // manejo de errores
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [auth.user?.id]); 

  return { data, loading, error };
}