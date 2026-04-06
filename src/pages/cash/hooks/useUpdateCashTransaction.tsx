import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { updateCashTransaction } from '../services';
import { ICreateCashTransaction } from '../interfaces';

export const useUpdateCashTransaction = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: updateTransaction, isPending } = useMutation({
    mutationFn: ({ id, transaction }: { id: string; transaction: Partial<ICreateCashTransaction> }) =>
      updateCashTransaction(id, transaction),
    onSuccess: () => {
      // Invalidar todas las queries relacionadas con cash
      queryClient.invalidateQueries({ queryKey: ['cash-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['cash-daily-summary'] });
      queryClient.invalidateQueries({ queryKey: ['cash-current-day'] });
      queryClient.invalidateQueries({ queryKey: ['cash-total-balance'] });
      queryClient.invalidateQueries({ queryKey: ['cash-transactions-by-date'] });

      toast.success('Transacción actualizada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Error al actualizar la transacción');
    },
  });

  return {
    updateTransaction,
    isPending
  };
};