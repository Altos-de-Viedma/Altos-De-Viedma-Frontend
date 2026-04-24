import { useQuery } from '@tanstack/react-query';
import { getMonthlyTransactions } from '../services';

export const useMonthlyTransactions = (month: number, year: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['monthlyTransactions', month, year],
    queryFn: () => getMonthlyTransactions(month, year),
    enabled: enabled && month > 0 && year > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};