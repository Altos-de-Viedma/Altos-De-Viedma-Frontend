import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { IEmergency } from '../interfaces';
import { EmergencyInputs } from '../validators';
import { createEmergency } from '../services';


export const useAddEmergency = () => {

  const queryClient = useQueryClient();

  const { mutate, isError, error } = useMutation<IEmergency, Error, EmergencyInputs>( {

    mutationFn: createEmergency,

    onSuccess: () => {

      queryClient.invalidateQueries( {
        queryKey: [ 'emergency' ],
      } );

      queryClient.invalidateQueries( {
        queryKey: [ 'emergencies' ],
      } );

    },

    onError: ( err ) => {
      console.error( 'Error adding emergency:', err );
    },

  } );

  const addEmergency = ( newEmergency: EmergencyInputs ) => {
    mutate( newEmergency, {
      onSuccess: ( data ) => {
        toast.success( `Emergencia agregada correctamente: ${ data.title }. ${ data.user.lastName }, ${ data.user.name }` );
      },
      onError: () => {
        toast.error( 'No se pudo crear la emergencia. Por favor, intente nuevamente.' );
      },
    } );
  };

  return {
    addEmergency,
    isError,
    error,
  };
};
