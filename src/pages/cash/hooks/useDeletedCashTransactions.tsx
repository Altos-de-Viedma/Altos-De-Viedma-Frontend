import { useQuery } from '@tanstack/react-query';
import { getDeletedCashTransactions } from '../services/actions';

export const useDeletedCashTransactions = () => {
  const { data: transactions = [], isLoading, refetch } = useQuery({
    queryKey: ['deleted-cash-transactions'],
    queryFn: getDeletedCashTransactions,
  });

  return {
    transactions,
    isLoading,
    refetch
  };
};
