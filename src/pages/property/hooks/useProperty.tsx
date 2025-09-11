import { useQuery } from '@tanstack/react-query';

import { getPropertyById } from '../services';



export const useProperty = ( propertyId?: string ) => {

  const { isLoading, isFetching, isError, error, data: property } = useQuery( {
    queryKey: [ 'property', propertyId ],
    queryFn: () => getPropertyById( propertyId! ),
    enabled: !!propertyId,
  } );

  return {
    isLoading,
    isFetching,
    isError,
    error,
    property,
  };
};
