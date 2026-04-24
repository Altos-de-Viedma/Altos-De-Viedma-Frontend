import { altosDeViedmaApi } from '../../../api';
import { ICreateCashTransaction, ICashTransaction, IDailySummary, ICurrentDayTotal } from '../interfaces';

export const getCashTransactions = async (): Promise<IDailySummary[]> => {
  const { data } = await altosDeViedmaApi.get<IDailySummary[]>('/daily-cash-transactions');
  return data;
};

export const getCashTransactionsByDate = async (date: string): Promise<ICashTransaction[]> => {
  const { data } = await altosDeViedmaApi.get<ICashTransaction[]>(`/daily-cash-transactions/by-date?date=${date}`);
  return data;
};

export const getDailySummary = async (): Promise<IDailySummary[]> => {
  const { data } = await altosDeViedmaApi.get<IDailySummary[]>('/daily-cash-transactions/summary');
  return data;
};

export const getCurrentDayTotal = async (): Promise<ICurrentDayTotal> => {
  const { data } = await altosDeViedmaApi.get<ICurrentDayTotal>('/daily-cash-transactions/current-day');
  return data;
};

export const getTotalBalance = async (): Promise<number> => {
  const { data } = await altosDeViedmaApi.get<number>('/daily-cash-transactions/total-balance');
  return data;
};

export const getMonthlyBalance = async (): Promise<{ balance: number; month: number; year: number }> => {
  const { data } = await altosDeViedmaApi.get<{ balance: number; month: number; year: number }>('/daily-cash-transactions/monthly-balance');
  return data;
};

export const getMonthlyBalances = async (): Promise<{ year: number; month: number; balance: number; transactionCount: number }[]> => {
  const { data } = await altosDeViedmaApi.get<{ year: number; month: number; balance: number; transactionCount: number }[]>('/daily-cash-transactions/monthly-balances');
  return data;
};

export const getCashTransaction = async (id: string): Promise<ICashTransaction> => {
  const { data } = await altosDeViedmaApi.get<ICashTransaction>(`/daily-cash-transactions/${id}`);
  return data;
};

export const createCashTransaction = async (transaction: ICreateCashTransaction): Promise<ICashTransaction> => {
  const { data } = await altosDeViedmaApi.post<ICashTransaction>('/daily-cash-transactions', transaction);
  return data;
};

export const updateCashTransaction = async (id: string, transaction: Partial<ICreateCashTransaction>): Promise<ICashTransaction> => {
  const { data } = await altosDeViedmaApi.patch<ICashTransaction>(`/daily-cash-transactions/${id}`, transaction);
  return data;
};

export const deleteCashTransaction = async (id: string): Promise<void> => {
  await altosDeViedmaApi.delete(`/daily-cash-transactions/${id}`);
};

export const getMonthlyTransactions = async (month: number, year: number): Promise<ICashTransaction[]> => {
  const { data } = await altosDeViedmaApi.get<ICashTransaction[]>(`/daily-cash-transactions/monthly?month=${month}&year=${year}`);
  return data;
};