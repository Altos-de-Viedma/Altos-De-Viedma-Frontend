import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { updateInvoice } from '../services/actions';
import { InvoiceInputs } from '../validators/InvoiceSchema';

export const useUpdateInvoice = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: invoiceUpdate, isPending } = useMutation({
    mutationFn: ({ invoice, id }: { invoice: InvoiceInputs; id: string }) => updateInvoice(id, invoice),
    onSuccess: () => {
      // Invalidar queries (esto ya triggerea el refetch automáticamente)
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice'] });

      toast.success('Expensa actualizada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Error al actualizar la expensa');
    },
  });

  return {
    invoiceUpdate,
    isPending
  };
};