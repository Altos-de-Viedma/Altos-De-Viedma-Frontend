import { useQueryClient, useMutation } from '@tanstack/react-query';

import { endEmergency } from '../services';

export const useEndEmergency = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation( {
    mutationFn: ( emergencyId: string ) => endEmergency( emergencyId ),
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