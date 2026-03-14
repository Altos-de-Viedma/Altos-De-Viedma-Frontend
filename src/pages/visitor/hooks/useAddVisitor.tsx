import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { createVisitor } from '../services';
import { IVisitor } from '../interfaces';
import { VisitorInputs } from '../validators';



export const useAddVisitor = () => {

  const queryClient = useQueryClient();

  const { mutate, isError, error, isPending } = useMutation<IVisitor, Error, VisitorInputs>( {

    mutationFn: createVisitor,

    onSuccess: () => {

      queryClient.invalidateQueries( {
        queryKey: [ 'visitor' ],
      } );

      queryClient.invalidateQueries( {
        queryKey: [ 'visitors' ],
      } );

    },

    onError: ( err ) => {
      console.error( 'Error adding visitor:', err );
    },

  } );

  const addVisitor = ( newVisitor: VisitorInputs ) => {
    mutate( newVisitor, {
      onSuccess: ( data ) => {
        toast.success( `Visitante creado correctamente: ${ data.fullName }` );
      },
      onError: () => {
        toast.error( 'No se pudo guardar el nuevo visitante. Por favor, intente nuevamente.' );
      },
    } );
  };

  return {
    addVisitor,
    isError,
    error,
    isPending,
  };
};
