import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { deleteUser } from '../services';

export const useUserDelete = () => {

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation( {
    mutationFn: ( userId: string ) => deleteUser( userId ),
    onSuccess: () => {
      queryClient.invalidateQueries( {
        queryKey: [ 'users' ],
      } );

      queryClient.invalidateQueries( {
        queryKey: [ 'inactive-users' ],
      } );
    },
  } );

  const handleDeleteUser = ( id: string, onSuccessCallback?: () => void ) => {
    mutate( id, {
      onSuccess: () => {
        toast.success( 'Usuario bloqueado correctamente' );
        onSuccessCallback?.();
      },
      onError: () => {
        toast.error( 'No se pudo bloquear el usuario. Por favor, intente nuevamente.' );
      },
    } );
  };

  return {
    deleteUser: handleDeleteUser,
    isPending,
  };
};
