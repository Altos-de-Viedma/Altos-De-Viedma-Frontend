import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { restoreCashTransaction } from '../services/actions';

export const useRestoreCashTransaction = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: restore, isPending } = useMutation({
    mutationFn: (id: string) => restoreCashTransaction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cash-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['cash-daily-summary'] });
      queryClient.invalidateQueries({ queryKey: ['cash-current-day'] });
      queryClient.invalidateQueries({ queryKey: ['cash-total-balance'] });
      queryClient.invalidateQueries({ queryKey: ['cash-transactions-by-date'] });
      queryClient.invalidateQueries({ queryKey: ['deleted-cash-transactions'] });
      toast.success('Transacción restaurada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Error al restaurar la transacción');
    },
  });

  return {
    restore,
    isPending
  };
};
