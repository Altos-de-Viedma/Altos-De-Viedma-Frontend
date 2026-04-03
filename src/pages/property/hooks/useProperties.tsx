import { useQuery } from '@tanstack/react-query';

import { getProperties, getMyProperties } from '../services';
import { useAuthStore } from '../../auth';

export const useProperties = () => {

  const { user } = useAuthStore( ( state ) => ( {
    user: state.user,
  } ) );

  // Use backend filtering instead of client-side filtering
  const isAdminOrSecurity = user?.roles?.includes( 'admin' ) || user?.roles?.includes( 'security' );

  const { isLoading, isFetching, isError, error, data: properties } = useQuery( {
    queryKey: isAdminOrSecurity ? [ 'properties', 'all' ] : [ 'properties', 'my' ],
    queryFn: () => isAdminOrSecurity ? getProperties() : getMyProperties(),
    enabled: !!user // Only run query when user is available
  } );

  return {
    isLoading,
    isFetching,
    isError,
    error,
    properties: properties || []
  };
};
