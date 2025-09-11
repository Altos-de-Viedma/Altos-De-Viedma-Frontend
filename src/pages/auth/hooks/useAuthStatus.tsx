import { useQuery } from '@tanstack/react-query';

import { AuthService } from '../services';

export const useAuthStatus = () => {
  
  const { data, isError, isLoading, isFetching, refetch } = useQuery( {
    queryKey: [ 'auth-status' ],
    queryFn: AuthService.checkStatus,
    refetchInterval: 5000,
    retry: false,
  } );

  return {
    isAuthenticated: !!data,
    user: data,
    isError,
    isLoading,
    isFetching,
    refetch,
  };
};