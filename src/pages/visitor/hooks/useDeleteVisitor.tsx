import { useQueryClient, useMutation } from '@tanstack/react-query';

import { deleteVisitor } from '../services';





export const useDeleteVisitor = ( visitorId: string ) => {


  const queryClient = useQueryClient();

  const mutation = useMutation( {
    mutationFn: () => deleteVisitor( visitorId )
  } );

  queryClient.invalidateQueries( {
    queryKey: [
      'visitor'
    ],
  } );

  queryClient.invalidateQueries( {
    queryKey: [
      'visitors'
    ],
  } );

  return mutation;
};  
