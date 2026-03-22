import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { IVisitor } from '../interfaces';
import { VisitorInputs } from '../validators';
import { updateVisitor } from '../services';



export const useVisitorUpdate = () => {

  const queryClient = useQueryClient();

  const mutation = useMutation<IVisitor, Error, { visitor: VisitorInputs; id: string; }>( {

    mutationFn: ( { visitor, id } ) => updateVisitor( visitor, id ),

    onSuccess: ( data ) => {

      queryClient.invalidateQueries( {
        queryKey: [ 'visitor' ]
      } );

      queryClient.invalidateQueries( {
        queryKey: [ 'visitors' ]
      } );

      toast.success( `Visitante actualizado correctamente: ${ data.fullName }` );
      return data;
    },

    onError: ( error ) => {
      toast.error( 'No se pudo actualizar el visitante. Por favor, intente nuevamente.' );
      console.error( 'Error updating visitor:', error );
    }

  } );

  const visitorUpdate = async ( visitor: VisitorInputs, id: string ): Promise<IVisitor> => {
    const result = await mutation.mutateAsync( { visitor, id } );
    return result;
  };

  return {
    visitorUpdate,
    isPending: mutation.isPending,
    isError:   mutation.isError,
    error:     mutation.error
  };
};