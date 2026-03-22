import { useQuery } from '@tanstack/react-query';

import { getVisitors } from '../services';
import { useAuthStore } from '../../auth';

export const useVisitors = () => {

  const { user } = useAuthStore( ( state ) => ( {
    user: state.user,
  } ) );

  const { isLoading, isFetching, isError, error, data: allVisitors, refetch } = useQuery( {
    queryKey: [ 'visitors' ],
    queryFn: () => getVisitors()
  } );

  const visitors = allVisitors?.filter( visitor =>
    user?.roles?.includes( 'admin' ) ||
    user?.roles?.includes( 'security' ) ||
    visitor.property.user.id === user?.id
  ) || [];

  return {
    isLoading,
    isFetching,
    isError,
    error,
    visitors,
    refetch
  };
};
