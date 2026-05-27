import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { deleteInvoice } from '../services/actions';

export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: deleteInv, isPending } = useMutation({
    mutationFn: (id: string) => deleteInvoice(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['deleted-invoices'] });
      toast.success('Expensa eliminada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Error al eliminar la expensa');
    },
  });

  return {
    deleteInv,
    isPending
  };
};
