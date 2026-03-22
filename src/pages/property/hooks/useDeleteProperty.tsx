import { useQueryClient, useMutation } from '@tanstack/react-query';

import { deleteProperty } from '../services';




export const useDeleteProperty = ( propertyId: string ) => {


  const queryClient = useQueryClient();

  const mutation = useMutation( {
    mutationFn: () => deleteProperty( propertyId )
  } );

  queryClient.invalidateQueries( {
    queryKey: [
      'property'
    ],
  } );

  queryClient.invalidateQueries( {
    queryKey: [
      'properties'
    ],
  } );

  return mutation;
};  
