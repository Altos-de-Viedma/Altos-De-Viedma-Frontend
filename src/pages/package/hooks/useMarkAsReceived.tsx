import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { IPackage } from '../interfaces';
import { markAsRecived } from '../services';

export const useMarkAsReceived = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<IPackage, Error, { id: string; }>( {
    mutationFn: ( { id } ) => markAsRecived( id ),
    onSuccess: ( data ) => {
      queryClient.invalidateQueries( {
        queryKey: [ 'package' ],
      } );
      queryClient.invalidateQueries( {
        queryKey: [ 'packages' ],
      } );
      toast.success( `Paquete recibido correctamente: ${ data.title }, ${ data.user.lastName }, ${ data.user.name }` );
      return data;
    },
    onError: ( error ) => {
      toast.error( 'No se pudo recibir el paquete. Por favor, intente nuevamente.' );
      console.error( 'Error updating package:', error );
    },
  } );

  const markAsReceived = async ( id: string ): Promise<IPackage> => {
    const result = await mutation.mutateAsync( { id } );
    return result;
  };

  return {
    markAsReceived,
    isPending: mutation.isPending,
    isError:   mutation.isError,
    error:     mutation.error,
  };
};
