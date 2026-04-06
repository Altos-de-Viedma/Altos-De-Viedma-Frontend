import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { deleteCashTransaction } from '../services';

export const useDeleteCashTransaction = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: deleteTransaction, isPending } = useMutation({
    mutationFn: (id: string) => deleteCashTransaction(id),
    onSuccess: () => {
      // Invalidar todas las queries relacionadas con cash
      queryClient.invalidateQueries({ queryKey: ['cash-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['cash-daily-summary'] });
      queryClient.invalidateQueries({ queryKey: ['cash-current-day'] });
      queryClient.invalidateQueries({ queryKey: ['cash-total-balance'] });
      queryClient.invalidateQueries({ queryKey: ['cash-transactions-by-date'] });

      toast.success('Transacción eliminada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Error al eliminar la transacción');
    },
  });

  return {
    deleteTransaction,
    isPending
  };
};