import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { IUser } from '../interfaces';
import { userInputs } from '../validators';
import { createUser } from '../services';



export const useUserAdd = () => {

  const queryClient = useQueryClient();

  const { mutate, isError, error } = useMutation<IUser, Error, userInputs>( {

    mutationFn: createUser,

    onSuccess: () => {

      queryClient.invalidateQueries( {
        queryKey: [ 'users' ],
      } );

      queryClient.invalidateQueries( {
        queryKey: [ 'user' ],
      } );
      
    },


    onError: ( err ) => {
      console.error( 'Error adding user:', err );
    },

  } );

  const addNewUser = ( newUser: userInputs ) => {
    mutate( newUser, {
      onSuccess: ( data ) => {
        toast.success( `Usuario creado correctamente ${ data.username }` );
      },
      onError: () => {
        toast.error( 'No se pudo crear el usuario. Por favor, intente nuevamente.' );
      },
    } );
  };

  return {
    addNewUser,
    isError,
    error,
  };
};
