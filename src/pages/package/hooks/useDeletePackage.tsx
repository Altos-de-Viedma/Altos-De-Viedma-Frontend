import { useQueryClient, useMutation } from '@tanstack/react-query';

import { deletePackage } from '../services/actions';




export const useDeletePackage = ( packageId: string ) => {

  const queryClient = useQueryClient();

  const mutation = useMutation( {
    mutationFn: () => deletePackage( packageId )
  } );

  queryClient.invalidateQueries( {
    queryKey: [
      'package'
    ],
  } );

  queryClient.invalidateQueries( {
    queryKey: [
      'packages'
    ],
  } );

  return mutation;
};  
