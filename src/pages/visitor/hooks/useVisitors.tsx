import { useQuery } from '@tanstack/react-query';

import { getVisitors } from '../services';
import { useAuthStore } from '../../auth';
import { useProperties } from '../../property/hooks/useProperties';

export const useVisitors = () => {

  const { user } = useAuthStore( ( state ) => ( {
    user: state.user,
  } ) );

  const { properties } = useProperties();

  const { isLoading, isFetching, isError, error, data: allVisitors, refetch } = useQuery( {
    queryKey: [ 'visitors' ],
    queryFn: () => getVisitors()
  } );

  const visitors = allVisitors?.filter( visitor => {
    // Admin and security can see all visitors
    if (user?.roles?.includes( 'admin' ) || user?.roles?.includes( 'security' )) {
      return true;
    }

    // For regular users, check if they live in the same property as the visitor
    if (!properties || !user) return false;

    // Get all properties where the current user lives
    const userProperties = properties.filter(property =>
      property.users?.some(propertyUser => propertyUser.id === user.id)
    );

    // Check if the visitor's property matches any property where the user lives
    return userProperties.some(userProperty => userProperty.id === visitor.property.id);
  } ) || [];

  return {
    isLoading,
    isFetching,
    isError,
    error,
    visitors,
    refetch
  };
};
