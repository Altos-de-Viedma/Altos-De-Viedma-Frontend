import { useQuery } from '@tanstack/react-query';

import { getAllUsers } from '../services';
import { useAuthStore } from '../../auth';

export const useUsers = () => {

  const { user } = useAuthStore( ( state ) => ( {
    user: state.user,
  } ) );

  const { isLoading, isFetching, isError, error, data: allUsers } = useQuery( {
    queryKey: [ 'users' ],
    queryFn: () => getAllUsers()
  } );

  const users = user?.roles?.includes( 'admin' ) || user?.roles?.includes( 'security' )
    ? allUsers
    : allUsers?.filter( u => u.id === user?.id ) || [];

  return {
    isLoading,
    isFetching,
    isError,
    error,
    users
  };
};
