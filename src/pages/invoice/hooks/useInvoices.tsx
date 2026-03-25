import { useQuery } from '@tanstack/react-query';
import { getInvoices } from '../services/actions';

export const useInvoices = () => {
  const { data: invoices, isLoading, error, refetch } = useQuery({
    queryKey: ['invoices'],
    queryFn: getInvoices,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    invoices,
    isLoading,
    error,
    refetch
  };
};