import { useQueryClient, useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import axios from 'axios';

import { IEmergency } from '../interfaces';
import { endEmergency } from '../services';
import { useAuthStore } from '../../auth';
import { formatPhoneNumber } from '../../../shared/utils';

export const useEndEmergency = () => {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();

  const mutation = useMutation<IEmergency, Error, string>( {
    mutationFn: ( emergencyId: string ) => endEmergency( emergencyId ),
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
        console.log('🔥🔥🔥 EMERGENCY END - RAW PHONE:', rawPhone);

        // Format phone number consistently with backend logic
        const formattedPhone = formatPhoneNumber(rawPhone);
        console.log('🔥🔥🔥 EMERGENCY END - FORMATTED PHONE:', formattedPhone);

        const webhookPayload = {
          phoneNumber: formattedPhone,
          serverUrl: "https://evolution-api.altosdeviedma.com",
          message: `🚨 Emergencia finalizada

📌 Su emergencia ha sido finalizada exitosamente
📝 ${data.title}
👤 Solicitante: ${data.user.lastName}, ${data.user.name}
📅 Fecha de finalización: ${new Date().toLocaleDateString('es-AR')}

La emergencia fue resuelta y finalizada por el personal de seguridad.

Gracias por utilizar nuestro sistema de emergencias.`,
          instanceName: "AltosDeViedmaProduccion",
          apikey: "782A3BE06AAC-47C5-AE61-4985CB15631E"
        };

        console.log('🔥🔥🔥 EMERGENCY END WEBHOOK PAYLOAD:', JSON.stringify(webhookPayload, null, 2));

        await axios.post('https://n8n.altosdeviedma.com/webhook/send-message', webhookPayload, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('✅ Emergency end webhook notification sent successfully');
      } catch (webhookError: any) {
        console.error('❌ Failed to send emergency end webhook notification:', webhookError);
        console.error('❌ Error details:', webhookError.response?.data);
      }

      toast.success( `Emergencia finalizada correctamente: ${ data.title }` );
    },
    onError: ( error ) => {
      toast.error( 'No se pudo finalizar la emergencia. Por favor, intente nuevamente.' );
      console.error( 'Error ending emergency:', error );
    }
  } );

  return mutation;
};