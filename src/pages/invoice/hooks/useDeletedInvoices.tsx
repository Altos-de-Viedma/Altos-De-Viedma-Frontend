import { useQuery } from '@tanstack/react-query';
import { getDeletedInvoices } from '../services/actions';

export const useDeletedInvoices = () => {
  const { data: invoices = [], isLoading, refetch } = useQuery({
    queryKey: ['deleted-invoices'],
    queryFn: getDeletedInvoices,
  });

  return {
    invoices,
    isLoading,
    refetch
  };
};
