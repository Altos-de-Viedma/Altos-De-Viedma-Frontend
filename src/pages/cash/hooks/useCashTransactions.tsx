import { useQuery } from '@tanstack/react-query';
import { getCashTransactions, getDailySummary, getCurrentDayTotal, getTotalBalance, getMonthlyBalance, getMonthlyBalances, getCashTransactionsByDate } from '../services';

export const useCashTransactions = () => {
  return useQuery({
    queryKey: ['cash-transactions'],
    queryFn: getCashTransactions,
    staleTime: 30000, // 30 seconds
  });
};

export const useDailySummary = () => {
  return useQuery({
    queryKey: ['cash-daily-summary'],
    queryFn: getDailySummary,
    staleTime: 30000,
  });
};

export const useCurrentDayTotal = () => {
  return useQuery({
    queryKey: ['cash-current-day'],
    queryFn: getCurrentDayTotal,
    staleTime: 10000, // 10 seconds for more frequent updates
  });
};

export const useTotalBalance = () => {
  return useQuery({
    queryKey: ['cash-total-balance'],
    queryFn: getTotalBalance,
    staleTime: 30000,
  });
};

export const useMonthlyBalance = () => {
  return useQuery({
    queryKey: ['cash-monthly-balance'],
    queryFn: getMonthlyBalance,
    staleTime: 30000,
  });
};

export const useMonthlyBalances = () => {
  return useQuery({
    queryKey: ['cash-monthly-balances'],
    queryFn: getMonthlyBalances,
    staleTime: 60000, // 1 minute
  });
};

export const useCashTransactionsByDate = (date: string) => {
  return useQuery({
    queryKey: ['cash-transactions-by-date', date],
    queryFn: () => getCashTransactionsByDate(date),
    enabled: !!date,
    staleTime: 60000, // 1 minute
  });
};