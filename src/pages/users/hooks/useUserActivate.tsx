import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { IUser } from '../interfaces';
import { activateUser, getAllInactiveUsers } from '../services';



export const useInactiveUsers = () => {
  const { data, isLoading, error } = useQuery<IUser[], Error>( {
    queryKey: [ 'inactive-users' ],
    queryFn: getAllInactiveUsers,
  } );

  return {
    inactiveUsers: data,
    isLoading,
    error,
  };
};



export const useUserActivate = () => {

  const queryClient = useQueryClient();

  const { mutate, isError, error, isPending } = useMutation<IUser, Error, string>( {

    mutationFn: activateUser,

    onSuccess: () => {

      queryClient.invalidateQueries( {
        queryKey: [ 'users' ],
      } );

      queryClient.invalidateQueries( {
        queryKey: [ 'inactive-users' ],
      } );

    },

    onError: ( err ) => {
      console.error( 'Error activating user:', err );
    },

  } );

  const activate = ( id: string, onSuccessCallback?: () => void ) => {
    mutate( id, {
      onSuccess: ( data ) => {
        toast.success( `Usuario "${ data.username }" activado correctamente` );
        onSuccessCallback?.();
      },
      onError: () => {
        toast.error( 'No se pudo activar el usuario. Por favor, intente nuevamente.' );
      },
    } );
  };

  return {
    activate,
    isError,
    error,
    isPending,
  };
};
