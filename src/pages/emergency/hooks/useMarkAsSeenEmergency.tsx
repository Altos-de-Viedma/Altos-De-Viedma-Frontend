import { useQueryClient, useMutation } from '@tanstack/react-query';

import { markAsSeenEmergency } from '../services';

export const useMarkAsSeenEmergency = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation( {
    mutationFn: ( emergencyId: string ) => markAsSeenEmergency( emergencyId ),
    onSuccess: () => {
      queryClient.invalidateQueries( {
        queryKey: [ 'emergencies' ],
      } );
      queryClient.invalidateQueries( {
        queryKey: [ 'emergency' ],
      } );
    },
  } );

  return mutation;
};