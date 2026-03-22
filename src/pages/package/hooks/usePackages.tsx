import { useQuery } from '@tanstack/react-query';

import { getPackages } from '../services/actions';
import { useAuthStore } from '../../auth';

export const usePackages = () => {

  const { user } = useAuthStore( ( state ) => ( {
    user: state.user,
  } ) );

  const { isLoading, isFetching, isError, error, data: allPackages, refetch } = useQuery( {
    queryKey: [ 'packages' ],
    queryFn: () => getPackages()
  } );

  const packages = allPackages?.filter( pkg =>
    user?.roles?.includes( 'admin' ) ||
    user?.roles?.includes( 'security' ) ||
    pkg.user.id === user?.id
  ) || [];

  return {
    isLoading,
    isFetching,
    isError,
    error,
    packages,
    refetch
  };
};
