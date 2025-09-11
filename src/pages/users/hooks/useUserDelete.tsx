import { useQueryClient, useMutation } from '@tanstack/react-query';

import { deleteUser } from '../services';





export const useDeleteUser = ( userId: string ) => {


  const queryClient = useQueryClient();

  const mutation = useMutation( {
    mutationFn: () => deleteUser( userId )
  } );

  queryClient.invalidateQueries( {
    queryKey: [
      'users'
    ],
  } );

  queryClient.invalidateQueries( {
    queryKey: [
      'user'
    ],
  } );

  return mutation;
};  
