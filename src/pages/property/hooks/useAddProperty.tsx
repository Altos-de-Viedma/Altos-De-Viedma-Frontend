import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { IProperty } from '../interfaces';
import { PropertyInputs } from '../validators';
import { createProperty } from '../services';




export const useAddProperty = () => {

  const queryClient = useQueryClient();

  const { mutate, isError, error, isPending } = useMutation<IProperty, Error, PropertyInputs>( {

    mutationFn: createProperty,

    onSuccess: () => {

      queryClient.invalidateQueries( {
        queryKey: [ 'property' ],
      } );

      queryClient.invalidateQueries( {
        queryKey: [ 'properties' ],
      } );

    },

    onError: ( err ) => {
      console.error( 'Error adding property:', err );
    },

  } );

  const addProperty = ( newProperty: PropertyInputs ) => {
    mutate( newProperty, {
      onSuccess: ( data ) => {
        toast.success( `Propiedad creada correctamente: ${ data.address }. ${ data.users[0]?.lastName }, ${ data.users[0]?.name }` );
      },
      onError: () => {
        toast.error( 'No se pudo crear la propiedad. Por favor, intente nuevamente.' );
      },
    } );
  };

  return {
    addProperty,
    isError,
    error,
    isPending,
  };
};
