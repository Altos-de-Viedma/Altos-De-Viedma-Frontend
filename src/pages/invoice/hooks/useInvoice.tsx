import { useQuery } from '@tanstack/react-query';
import { getInvoice } from '../services/actions';

export const useInvoice = (id: string) => {
  const { data: invoice, isLoading, error } = useQuery({
    queryKey: ['invoice', id],
    queryFn: () => getInvoice(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    invoice,
    isLoading,
    error
  };
};