import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { createInvoice } from '../services/actions';
import { InvoiceInputs } from '../validators/InvoiceSchema';

export const useAddInvoice = () => {
  const queryClient = useQueryClient();

  const { mutateAsync: addInvoice, isPending } = useMutation({
    mutationFn: (invoice: InvoiceInputs) => createInvoice(invoice),
    onSuccess: () => {
      // Invalidar queries (esto ya triggerea el refetch automáticamente)
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice'] });

      toast.success('Factura creada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Error al crear la factura');
    },
  });

  return {
    addInvoice,
    isPending
  };
};