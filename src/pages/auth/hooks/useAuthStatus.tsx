import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';

import { AuthService } from '../services';
import { useAuthStore } from '../store';
import { User } from '../interfaces';

export const useAuthStatus = () => {

  const logoutUser = useAuthStore( state => state.logoutUser );

  const { data, isError, isLoading, isFetching, refetch } = useQuery({
    queryKey: [ 'auth-status' ],
    queryFn: () => AuthService.checkStatus(),
    refetchInterval: 5000,
    retry: false,
    onError: ( err: any ) => {
      const errorMessage = err?.response?.data?.message || err?.message || '';

      // Si el usuario está bloqueado, cerrar sesión y mostrar mensaje
      if ( errorMessage.includes( 'bloqueado' ) ) {
        toast.error( 'Usuario bloqueado. Contacte al administrador.' );
        logoutUser();
      }
    },
  } ) as any;

  return {
    isAuthenticated: !!data,
    user: data,
    isError,
    isLoading,
    isFetching,
    refetch,
  };
};