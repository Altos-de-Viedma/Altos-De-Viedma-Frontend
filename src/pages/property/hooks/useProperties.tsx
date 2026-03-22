import { useQuery } from '@tanstack/react-query';

import { getProperties } from '../services';
import { useAuthStore } from '../../auth';

export const useProperties = () => {

  const { user } = useAuthStore( ( state ) => ( {
    user: state.user,
  } ) );

  const { isLoading, isFetching, isError, error, data: allProperties } = useQuery( {
    queryKey: [ 'properties' ],
    queryFn: () => getProperties()
  } );

  const properties = allProperties?.filter( property =>
    user?.roles?.includes( 'admin' ) ||
    user?.roles?.includes( 'security' ) ||
    property.user.id === user?.id
  ) || [];

  return {
    isLoading,
    isFetching,
    isError,
    error,
    properties
  };
};
