import { useQuery } from '@tanstack/react-query';
import { getInvoices } from '../services/actions';

export const useInvoices = () => {
  const { data: invoices, isLoading, error, refetch } = useQuery({
    queryKey: ['invoices'],
    queryFn: getInvoices,
    staleTime: 1000 * 30, // Reducido a 30 segundos para mejor sincronización
    refetchOnWindowFocus: true, // Refetch cuando la ventana recibe foco
    refetchOnMount: true, // Siempre refetch al montar
  });

  return {
    invoices: invoices || [],
    isLoading,
    error,
    refetch
  };
};