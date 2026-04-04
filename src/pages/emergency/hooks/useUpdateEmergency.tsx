import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import axios from 'axios';

import { IEmergency } from '../interfaces';
import { EmergencyInputs } from '../validators';
import { updateEmergency } from '../services';
import { useAuthStore } from '../../auth';
import { formatPhoneNumber } from '../../../shared/utils';

export const useEmergencieUpdate = () => {

  const queryClient = useQueryClient();
  const { token } = useAuthStore();

  const mutation = useMutation<IEmergency, Error, { emergency: EmergencyInputs; id: string; }>( {

    mutationFn: ( { emergency, id } ) => updateEmergency( emergency, id ),

    onSuccess: async ( data ) => {

      queryClient.invalidateQueries( {
        queryKey: [ 'emergency' ]
      } );

      queryClient.invalidateQueries( {
        queryKey: [ 'emergencies' ]
      } );

      // Send notification webhook
      try {
        const rawPhone = data.user?.phone || "";
        console.log('🔥🔥🔥 EMERGENCY UPDATE - RAW PHONE:', rawPhone);

        // Format phone number consistently with backend logic
        const formattedPhone = formatPhoneNumber(rawPhone);
        console.log('🔥🔥🔥 EMERGENCY UPDATE - FORMATTED PHONE:', formattedPhone);

        const webhookPayload = {
          phoneNumber: formattedPhone,
          serverUrl: "https://evolution-api.altosdeviedma.com",
          message: `🚨 Emergencia actualizada

📌 Su emergencia ha sido actualizada
📝 ${data.title}
👤 Solicitante: ${data.user.lastName}, ${data.user.name}
📅 Fecha de actualización: ${new Date().toLocaleDateString('es-AR')}

La emergencia fue actualizada por el personal de seguridad.

Gracias por utilizar nuestro sistema de emergencias.`,
          instanceName: "AltosDeViedmaProduccion",
          apikey: "782A3BE06AAC-47C5-AE61-4985CB15631E"
        };

        console.log('🔥🔥🔥 EMERGENCY UPDATE WEBHOOK PAYLOAD:', JSON.stringify(webhookPayload, null, 2));

        await axios.post('https://n8n.altosdeviedma.com/webhook/send-message', webhookPayload, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('✅ Webhook notification sent successfully');
      } catch (webhookError: any) {
        console.error('❌ Failed to send webhook notification:', webhookError);
        console.error('❌ Error details:', webhookError.response?.data);
      }

      toast.success( `Emergencia actualizada correctamente: ${ data.title }. ${ data.user.lastName }, ${ data.user.name }` );
      return data;
    },

    onError: ( error ) => {
      toast.error( 'No se pudo actualizar la emergencia. Por favor, intente nuevamente.' );
      console.error( 'Error updating emergency:', error );
    }

  } );

  const emergencyUpdate = async ( emergency: EmergencyInputs, id: string ): Promise<IEmergency> => {
    const result = await mutation.mutateAsync( { emergency, id } );
    return result;
  };

  return {
    emergencyUpdate,
    isPending: mutation.isPending,
    isError:   mutation.isError,
    error:     mutation.error
  };
};