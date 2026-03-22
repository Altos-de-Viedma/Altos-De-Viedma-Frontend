import { useQuery } from '@tanstack/react-query';

import { getPackageById } from '../services/actions';



export const usePackage = ( packageId?: string ) => {

  const { isLoading, isFetching, isError, error, data: pkg } = useQuery( {
    queryKey: [ 'package', packageId ],
    queryFn: () => getPackageById( packageId! ),
    enabled: !!packageId,
  } );

  return {
    isLoading,
    isFetching,
    isError,
    error,
    pkg,
  };
};
