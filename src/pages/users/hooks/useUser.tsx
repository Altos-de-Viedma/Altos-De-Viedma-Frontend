import { useQuery } from '@tanstack/react-query';
import { getUserById } from '../services';

export const useUser = ( userId?: string ) => {
  const { isLoading, isFetching, isError, error, data: user } = useQuery( {
    queryKey: [ 'user', userId ],
    queryFn: () => getUserById( userId! ), 
    enabled: !!userId,
  } );

  return {
    isLoading,
    isFetching,
    isError,
    error,
    user,
  };
};
