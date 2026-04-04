import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import axios from 'axios';

import { confirmInvoice } from '../services/actions';
import { useAuthStore } from '../../auth';
import { formatPhoneNumber } from '../../../shared/utils';

export const useConfirmInvoice = () => {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();

  const { mutateAsync: confirmInvoiceMutation, isPending } = useMutation({
    mutationFn: (id: string) => confirmInvoice(id),
    onSuccess: async (data: any) => {
      // Invalidar múltiples queries relacionadas
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['invoice'] });

      // Forzar refetch inmediato
      queryClient.refetchQueries({ queryKey: ['invoices'] });

      // Send notification webhook
      try {
        const rawPhone = data.property?.users?.[0]?.phone || data.user?.phone || "";
        console.log('🔥🔥🔥 INVOICE - RAW PHONE:', rawPhone);

        // Format phone number consistently with backend logic
        const formattedPhone = formatPhoneNumber(rawPhone);
        console.log('🔥🔥🔥 INVOICE - FORMATTED PHONE:', formattedPhone);

        const webhookPayload = {
          phoneNumber: formattedPhone,
          serverUrl: "https://evolution-api.altosdeviedma.com",
          message: `💰 Factura aprobada

📌 Su factura ha sido aprobada exitosamente
📝 ${data.title || 'Factura'}
💵 Monto: $${data.amount || 'N/A'}
📅 Fecha de aprobación: ${new Date().toLocaleDateString('es-AR')}
🏠 Propiedad: ${data.property?.address || 'N/A'}

La factura fue revisada y aprobada por el personal administrativo.

Gracias por utilizar nuestro sistema de facturación.`,
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