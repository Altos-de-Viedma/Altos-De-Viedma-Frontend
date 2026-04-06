import { useQuery } from '@tanstack/react-query';
import { getProperties } from '../services';

// Hook specifically for getting ALL properties regardless of user role
// Used in contexts where all users need to see all properties (like monthly status)
export const useAllProperties = () => {
  const { isLoading, isFetching, isError, error, data: properties } = useQuery({
    queryKey: ['properties', 'all-for-status'],
    queryFn: getProperties, // Always get all properties
    staleTime: 60000, // 1 minute
  });

  return {
    isLoading,
    isFetching,
    isError,
    error,
    properties: properties || []
  };
};