import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import axios from 'axios';

import { IPackage } from '../interfaces';
import { markAsRecived } from '../services';
import { useAuthStore } from '../../auth';

export const useMarkAsReceived = () => {
  const queryClient = useQueryClient();
  const { token } = useAuthStore();

  const mutation = useMutation<IPackage, Error, { id: string; }>( {
    mutationFn: ( { id } ) => markAsRecived( id ),
    onSuccess: async ( data ) => {
      queryClient.invalidateQueries( {
        queryKey: [ 'package' ],
      } );
      queryClient.invalidateQueries( {
        queryKey: [ 'packages' ],
      } );

      // Send notification webhook
      try {
        const rawPhone = data.property?.users?.[0]?.phone || data.user?.phone || "";
        console.log('🔥🔥🔥 PACKAGE - RAW PHONE:', rawPhone);

        // Only add 549 if the number doesn't already start with it
        const formattedPhone = rawPhone.startsWith('549') ? rawPhone : `549${rawPhone}`;
        console.log('🔥🔥🔥 PACKAGE - FORMATTED PHONE:', formattedPhone);

        const webhookPayload = {
          phoneNumber: formattedPhone,
          serverUrl: "https://evolution-api.altosdeviedma.com",
          message: `📦 Paquete recibido por seguridad

📌 Su paquete ya fue entregado
📝 ${data.title}
📅 Fecha de recepción: ${new Date().toLocaleDateString('es-AR')}

El paquete fue recibido exitosamente por el personal de seguridad y está disponible para su retiro.

Propiedad: ${data.property.address}`,
          instanceName: "AltosDeViedmaProduccion",
          apikey: "782A3BE06AAC-47C5-AE61-4985CB15631E"
        };

        console.log('🔥🔥🔥 PACKAGE WEBHOOK PAYLOAD:', JSON.stringify(webhookPayload, null, 2));

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

      toast.success( `Paquete recibido correctamente: ${ data.title }, ${ data.user.lastName }, ${ data.user.name }` );
      return data;
    },
    onError: ( error ) => {
      toast.error( 'No se pudo recibir el paquete. Por favor, intente nuevamente.' );
      console.error( 'Error updating package:', error );
    },
  } );

  const markAsReceived = async ( id: string ): Promise<IPackage> => {
    console.log('🔥 useMarkAsReceived - markAsReceived called with ID:', id);
    console.log('🔥 About to call mutation.mutateAsync');
    const result = await mutation.mutateAsync( { id } );
    console.log('🔥 mutation.mutateAsync SUCCESS, result:', result);
    return result;
  };

  return {
    markAsReceived,
    isPending: mutation.isPending,
    isError:   mutation.isError,
    error:     mutation.error,
  };
};
