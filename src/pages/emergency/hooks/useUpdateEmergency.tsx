import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { IEmergency } from '../interfaces';
import { EmergencyInputs } from '../validators';
import { updateEmergency } from '../services';




export const useEmergencieUpdate = () => {

  const queryClient = useQueryClient();

  const mutation = useMutation<IEmergency, Error, { emergency: EmergencyInputs; id: string; }>( {

    mutationFn: ( { emergency, id } ) => updateEmergency( emergency, id ),

    onSuccess: ( data ) => {

      queryClient.invalidateQueries( {
        queryKey: [ 'emergency' ]
      } );

      queryClient.invalidateQueries( {
        queryKey: [ 'emergencies' ]
      } );

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