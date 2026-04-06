import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { createCashTransaction } from '../services';
import { ICreateCashTransaction } from '../interfaces';

export const useAddCashTransaction = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: addTransaction, isPending } = useMutation({
    mutationFn: (transaction: ICreateCashTransaction) => createCashTransaction(transaction),
    onSuccess: () => {
      // Invalidar todas las queries relacionadas con cash
      queryClient.invalidateQueries({ queryKey: ['cash-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['cash-daily-summary'] });
      queryClient.invalidateQueries({ queryKey: ['cash-current-day'] });
      queryClient.invalidateQueries({ queryKey: ['cash-total-balance'] });
      queryClient.invalidateQueries({ queryKey: ['cash-transactions-by-date'] });

      toast.success('Transacción agregada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Error al agregar la transacción');
    },
  });

  return {
    addTransaction,
    isPending
  };
};