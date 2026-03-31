import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { IVisitor } from '../interfaces';
import { visitCompleted } from '../services';



export const useVisitCompleted = () => {

  const queryClient = useQueryClient();

  const mutation = useMutation<IVisitor, Error, { id: string; }>( {

    mutationFn: ( { id } ) => visitCompleted( id ),

    onSuccess: ( data ) => {

      queryClient.invalidateQueries( {
        queryKey: [ 'visitor' ]
      } );

      queryClient.invalidateQueries( {
        queryKey: [ 'visitors' ]
      } );

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