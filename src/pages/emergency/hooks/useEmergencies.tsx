import { useQuery } from '@tanstack/react-query';

import { useAuthStore } from '../../auth';
import { getEmergencies } from '../services';



export const useEmergencies = () => {

  const { user } = useAuthStore( ( state ) => ( {
    user: state.user,
  } ) );

  const { isLoading, isFetching, isError, error, data: allEmergencies, refetch } = useQuery( {
    queryKey: [ 'emergencies' ],
    queryFn: () => getEmergencies()
  } );

  const emergencies = allEmergencies?.filter( emergency =>
    user?.roles?.includes( 'admin' ) ||
    user?.roles?.includes( 'security' ) ||
    emergency.user.id === user?.id
  ) || [];

  return {
    refetch,
    isLoading,
    isFetching,
    isError,
    error,
    emergencies
  };
};
