import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { IProperty } from '../interfaces';
import { setMainProperty } from '../services';



export const useSetMainProperty = () => {

  const queryClient = useQueryClient();

  const { mutate, isError, error } = useMutation<IProperty, Error, string>( {

    mutationFn: setMainProperty,

    onSuccess: () => {

      queryClient.invalidateQueries( {
        queryKey: [ 'property' ],
      } );

      queryClient.invalidateQueries( {
        queryKey: [ 'properties' ],
      } );

    },

    onError: ( err ) => {
      console.error( 'Error setting main property:', err );
    },

  } );

  const setAsMain = ( id: string ) => {
    mutate( id, {
      onSuccess: ( data ) => {
        toast.success( `Propiedad "${ data.address }" establecida como principal` );
      },
      onError: () => {
        toast.error( 'No se pudo establecer la propiedad como principal. Por favor, intente nuevamente.' );
      },
    } );
  };

  return {
    setAsMain,
    isError,
    error,
  };
};
