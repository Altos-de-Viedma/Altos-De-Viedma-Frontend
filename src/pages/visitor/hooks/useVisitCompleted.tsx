import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import axios from 'axios';

import { IVisitor } from '../interfaces';
import { visitCompleted } from '../services';
import { useAuthStore } from '../../auth';

export const useVisitCompleted = () => {

  const queryClient = useQueryClient();
  const { token } = useAuthStore();

  const mutation = useMutation<IVisitor, Error, { id: string; }>( {

    mutationFn: ( { id } ) => visitCompleted( id ),

    onSuccess: async ( data ) => {

      queryClient.invalidateQueries( {
        queryKey: [ 'visitor' ]
      } );

      queryClient.invalidateQueries( {
        queryKey: [ 'visitors' ]
      } );

      // Send notification webhook
      try {
        const rawPhone = data.property?.users?.[0]?.phone || "";
        console.log('🔥🔥🔥 VISIT - RAW PHONE:', rawPhone);

        // Only add 549 if the number doesn't already start with it
        const formattedPhone = rawPhone.startsWith('549') ? rawPhone : `549${rawPhone}`;
        console.log('🔥🔥🔥 VISIT - FORMATTED PHONE:', formattedPhone);

        const webhookPayload = {
          phoneNumber: formattedPhone,
          serverUrl: "https://evolution-api.altosdeviedma.com",
          message: `👥 Visita completada

📌 Su visita ha finalizado exitosamente
👤 Visitante: ${data.fullName}
📅 Fecha: ${new Date().toLocaleDateString('es-AR')}
🏠 Propiedad: ${data.property.address}

La visita fue registrada como completada por el personal de seguridad.

Gracias por utilizar nuestro sistema de registro de visitantes.`,
          instanceName: "AltosDeViedmaProduccion",
          apikey: "782A3BE06AAC-47C5-AE61-4985CB15631E"
        };

        console.log('🔥🔥🔥 VISIT WEBHOOK PAYLOAD:', JSON.stringify(webhookPayload, null, 2));

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

      toast.success( `Visita finalizada correctamente: ${ data.fullName }` );
      return data;
    },

    onError: ( error ) => {
      toast.error( 'No se pudo finalizar la visita. Por favor, intente nuevamente.' );
      console.error( 'Error updating visitor:', error );
    }

  } );

  const completedVisit = async ( id: string ): Promise<IVisitor> => {
    const result = await mutation.mutateAsync( { id } );
    return result;
  };

  return {
    completedVisit,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error
  };
};