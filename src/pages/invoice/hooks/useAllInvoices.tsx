import { useQuery } from '@tanstack/react-query';
import { getInvoices } from '../services/actions';

// Hook specifically for getting ALL invoices regardless of user role
// Used in contexts where all users need to see all invoices (like monthly status)
export const useAllInvoices = () => {
  const { data: invoices, isLoading, error, refetch } = useQuery({
    queryKey: ['invoices', 'all-for-status'],
    queryFn: getInvoices, // Always get all invoices
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  return {
    invoices: invoices || [],
    isLoading,
    error,
    refetch
  };
};