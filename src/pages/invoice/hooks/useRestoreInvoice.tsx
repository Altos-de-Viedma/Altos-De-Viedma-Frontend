import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { restoreInvoice } from '../services/actions';

export const useRestoreInvoice = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: restore, isPending } = useMutation({
    mutationFn: (id: string) => restoreInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['deleted-invoices'] });
      toast.success('Expensa restaurada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Error al restaurar la expensa');
    },
  });

  return {
    restore,
    isPending
  };
};
