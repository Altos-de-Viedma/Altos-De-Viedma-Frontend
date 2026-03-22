import { useQueryClient, useMutation } from '@tanstack/react-query';

import { deleteEmergency } from '../services';



export const useDeleteEmergency = ( emergencyId: string ) => {


  const queryClient = useQueryClient();

  const mutation = useMutation( {
    mutationFn: () => deleteEmergency( emergencyId )
  } );

  queryClient.invalidateQueries( {
    queryKey: [
      'emergency'
    ],
  } );

  queryClient.invalidateQueries( {
    queryKey: [
      'emergencies'
    ],
  } );

  return mutation;
};  
