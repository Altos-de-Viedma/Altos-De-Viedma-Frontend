import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { confirmInvoice } from '../services/actions';

export const useConfirmInvoice = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: confirmInvoiceMutation, isPending } = useMutation({
    mutationFn: (id: string) => confirmInvoice(id),
    onSuccess: () => {
      // Invalidar múltiples queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice'] });

      // Forzar refetch inmediato
      queryClient.refetchQueries({ queryKey: ['invoices'] });

      toast.success('Factura confirmada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Error al confirmar la factura');
    },
  });

  return {
    confirmInvoiceMutation,
    isPending
  };
};