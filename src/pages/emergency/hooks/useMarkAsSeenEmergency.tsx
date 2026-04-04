import { useQueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import axios from 'axios';

import { IEmergency } from '../interfaces';
import { markAsSeenEmergency } from '../services';
import { useAuthStore } from '../../auth';

export const useMarkAsSeenEmergency = () => {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();

  const mutation = useMutation<IEmergency, Error, string>( {
    mutationFn: ( emergencyId: string ) => markAsSeenEmergency( emergencyId ),
    onSuccess: async ( data ) => {
      queryClient.invalidateQueries( {
        queryKey: [ 'emergencies' ],
      } );
      queryClient.invalidateQueries( {
        queryKey: [ 'emergency' ],
      } );

      // Send notification webhook
      try {
        const rawPhone = data.user?.phone || "";
        console.log('🔥🔥🔥 EMERGENCY SEEN - RAW PHONE:', rawPhone);

        // Only add 549 if the number doesn't already start with it
        const formattedPhone = rawPhone.startsWith('549') ? rawPhone : `549${rawPhone}`;
        console.log('🔥🔥🔥 EMERGENCY SEEN - FORMATTED PHONE:', formattedPhone);

        const webhookPayload = {
          phoneNumber: formattedPhone,
          serverUrl: "https://evolution-api.altosdeviedma.com",
          message: `🚨 Emergencia vista por seguridad

📌 Su emergencia ha sido vista por el personal de seguridad
📝 ${data.title}
👤 Solicitante: ${data.user.lastName}, ${data.user.name}
📅 Fecha: ${new Date().toLocaleDateString('es-AR')}

El personal de seguridad ha tomado conocimiento de su emergencia.

Gracias por utilizar nuestro sistema de emergencias.`,
          instanceName: "AltosDeViedmaProduccion",
          apikey: "782A3BE06AAC-47C5-AE61-4985CB15631E"
        };

        console.log('🔥🔥🔥 EMERGENCY SEEN WEBHOOK PAYLOAD:', JSON.stringify(webhookPayload, null, 2));

        await axios.post('https://n8n.altosdeviedma.com/webhook/send-message', webhookPayload, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('✅ Emergency seen webhook notification sent successfully');
      } catch (webhookError: any) {
        console.error('❌ Failed to send emergency seen webhook notification:', webhookError);
        console.error('❌ Error details:', webhookError.response?.data);
      }

      toast.success( `Emergencia marcada como vista: ${ data.title }` );
    },
    onError: ( error ) => {
      toast.error( 'No se pudo marcar la emergencia como vista. Por favor, intente nuevamente.' );
      console.error( 'Error marking emergency as seen:', error );
    }
  } );

  return mutation;
};