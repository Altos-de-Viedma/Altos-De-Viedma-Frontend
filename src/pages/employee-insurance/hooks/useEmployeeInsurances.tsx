import { useQuery } from '@tanstack/react-query';
import {
  getEmployeeInsurances,
  getEmployeeInsurance,
  getInsuranceStatistics,
  getExpiredInsurances,
  getExpiringSoonInsurances
} from '../services';

export const useEmployeeInsurances = () => {
  return useQuery({
    queryKey: ['employee-insurances'],
    queryFn: getEmployeeInsurances,
    staleTime: 30000, // 30 seconds
  });
};

export const useEmployeeInsurance = (id: string) => {
  return useQuery({
    queryKey: ['employee-insurance', id],
    queryFn: () => getEmployeeInsurance(id),
    enabled: !!id,
    staleTime: 30000,
  });
};

export const useInsuranceStatistics = () => {
  return useQuery({
    queryKey: ['insurance-statistics'],
    queryFn: getInsuranceStatistics,
    staleTime: 60000, // 1 minute
  });
};

export const useExpiredInsurances = () => {
  return useQuery({
    queryKey: ['expired-insurances'],
    queryFn: getExpiredInsurances,
    staleTime: 60000,
  });
};

export const useExpiringSoonInsurances = (days: number = 30) => {
  return useQuery({
    queryKey: ['expiring-soon-insurances', days],
    queryFn: () => getExpiringSoonInsurances(days),
    staleTime: 60000,
  });
};