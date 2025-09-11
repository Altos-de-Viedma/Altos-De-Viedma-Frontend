import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { IUser } from '../interfaces';
import { userInputs } from '../validators';
import { updateUser } from '../services';

export const useUserUpdate = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<IUser, Error, { user: userInputs; id: string; }>( {
    mutationFn: ( { user, id } ) => updateUser( user, id ),

    onSuccess: ( data ) => {
      queryClient.invalidateQueries( {
        queryKey: [ 'users' ]
      } );

      queryClient.invalidateQueries( {
        queryKey: [ 'user' ]
      } );

      toast.success( `Usuario actualizado correctamente: ${ data.username }` );
      return data;
    },

    onError: ( error ) => {
      toast.error( 'No se pudo actualizar el usuario. Por favor, intente nuevamente.' );
      console.error( 'Error updating user:', error );
    }
  } );

  const userUpdate = async ( user: userInputs, id: string ): Promise<IUser> => {
    const result = await mutation.mutateAsync( { user, id } );
    return result;
  };

  return {
    userUpdate,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error
  };
};