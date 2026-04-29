import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import axios from 'axios';

import { confirmInvoice } from '../services/actions';
import { useAuthStore } from '../../auth';

interface ConfirmInvoiceParams {
  id: string;
  confirmData: {
    amount: number;
    propertyIds: string[];
  };
}

export const useConfirmInvoice = () => {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();

  const { mutateAsync: confirmInvoiceMutation, isPending } = useMutation({
    mutationFn: ({ id, confirmData }: ConfirmInvoiceParams) => confirmInvoice(id, confirmData),
    onSuccess: async (data: any, variables: ConfirmInvoiceParams) => {
      // Invalidar queries (esto ya triggerea el refetch automáticamente)
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice'] });
      queryClient.invalidateQueries({ queryKey: ['cash-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['cash-daily-summary'] });
      queryClient.invalidateQueries({ queryKey: ['cash-current-day'] });
      queryClient.invalidateQueries({ queryKey: ['cash-total-balance'] });
      queryClient.invalidateQueries({ queryKey: ['cash-transactions-by-date'] });

      // Send notification webhook
      try {
        // Get first property owner's phone number from the backend response
        const propertyOwners = data.property?.users || [];
        const firstOwnerPhone = propertyOwners.find((user: any) => user.phone)?.phone || "";

        console.log('🔥🔥🔥 INVOICE - FIRST OWNER PHONE:', firstOwnerPhone);

        if (!firstOwnerPhone) {
          console.log('❌ No phone number found for property owners');
          toast.success('Expensa confirmada exitosamente');
          return;
        }

        // Ensure phone starts with 549
        let formattedPhone = firstOwnerPhone.replace(/[\s\-\(\)]/g, ''); // Remove spaces and special chars
        if (!formattedPhone.startsWith('549')) {
          if (formattedPhone.startsWith('+549')) {
            formattedPhone = formattedPhone.substring(1); // Remove +
          } else if (formattedPhone.startsWith('54') && !formattedPhone.startsWith('549')) {
            formattedPhone = '549' + formattedPhone.substring(2); // Replace 54 with 549
          } else {
            formattedPhone = '549' + formattedPhone; // Add 549 prefix
          }
        }

        console.log('🔥🔥🔥 INVOICE - FORMATTED PHONE:', formattedPhone);

        const webhookPayload = {
          phoneNumber: formattedPhone,
          serverUrl: "https://evolution-api.altosdeviedma.com",
          message: `💰 Expensa aprobada

📌 Su expensa ha sido aprobada exitosamente
📝 ${data.title || 'Expensa'}
📅 Fecha de aprobación: ${new Date().toLocaleDateString('es-AR')}
🏠 Propiedad: ${data.property?.address || 'N/A'}
💵 Monto: $${variables.confirmData.amount.toLocaleString('es-AR')}

La expensa fue revisada y aprobada por el personal administrativo.

Gracias por utilizar nuestro sistema de expensas.`,
          instanceName: "AltosDeViedmaProduccion",
          apikey: "782A3BE06AAC-47C5-AE61-4985CB15631E"
        };

        console.log('🔥🔥🔥 INVOICE WEBHOOK PAYLOAD:', JSON.stringify(webhookPayload, null, 2));

        await axios.post('https://n8n.altosdeviedma.com/webhook/send-message', webhookPayload, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('✅ Invoice confirm webhook notification sent successfully');
      } catch (webhookError: any) {
        console.error('❌ Failed to send invoice confirm webhook notification:', webhookError);
        console.error('❌ Error details:', webhookError.response?.data);
      }

      toast.success('Expensa confirmada exitosamente');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Error al confirmar la expensa');
    },
  });

  return {
    confirmInvoiceMutation,
    isPending
  };
};