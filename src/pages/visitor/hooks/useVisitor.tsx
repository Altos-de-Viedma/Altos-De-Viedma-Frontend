import { useQuery } from '@tanstack/react-query';

import { getVisitorById } from '../services';




export const useVisitor = ( visitorId?: string ) => {

  const { isLoading, isFetching, isError, error, data: visitor } = useQuery( {
    queryKey: [ 'visitor', visitorId ],
    queryFn: () => getVisitorById( visitorId! ),
    enabled: !!visitorId,
  } );

  return {
    isLoading,
    isFetching,
    isError,
    error,
    visitor,
  };
};
