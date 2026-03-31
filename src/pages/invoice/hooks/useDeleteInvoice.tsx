import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { deleteInvoice } from '../services/actions';

export const useDeleteInvoice = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: removeInvoice, isPending } = useMutation({
    mutationFn: (id: string) => deleteInvoice(id),
    onSuccess: () => {
      // Invalidar múltiples queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice'] });

      // Forzar refetch inmediato
      queryClient.refetchQueries({ queryKey: ['invoices'] });

      toast.success('Factura eliminada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Error al eliminar la factura');
    },
  });

  return {
    removeInvoice,
    isPending
  };
};