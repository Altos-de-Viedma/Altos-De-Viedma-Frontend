import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { altosDeViedmaApi } from '../../../api';
import { IPropertyMonthlyPayment, IMonthlyPaymentSummary, IPropertyPaymentStatus } from '../interfaces/IMonthlyPayment';

// Get all monthly payments
export const useMonthlyPayments = () => {
  return useQuery({
    queryKey: ['monthlyPayments'],
    queryFn: async (): Promise<IPropertyMonthlyPayment[]> => {
      const { data } = await altosDeViedmaApi.get('/property-monthly-payments');
      return data;
    },
  });
};

// Get monthly payments for specific month
export const useMonthlyPaymentsByMonth = (year: number, month: number) => {
  return useQuery({
    queryKey: ['monthlyPayments', year, month],
    queryFn: async (): Promise<IPropertyMonthlyPayment[]> => {
      const { data } = await altosDeViedmaApi.get(`/property-monthly-payments/month/${year}/${month}`);
      return data;
    },
    enabled: !!year && !!month,
  });
};

// Get monthly payment summary
export const useMonthlyPaymentSummary = (year: number, month: number) => {
  return useQuery({
    queryKey: ['monthlyPaymentSummary', year, month],
    queryFn: async (): Promise<IMonthlyPaymentSummary> => {
      const { data } = await altosDeViedmaApi.get(`/property-monthly-payments/summary/${year}/${month}`);
      return data;
    },
    enabled: !!year && !!month,
  });
};

// Get payments for specific property
export const usePropertyPayments = (propertyId: string) => {
  return useQuery({
    queryKey: ['propertyPayments', propertyId],
    queryFn: async (): Promise<IPropertyMonthlyPayment[]> => {
      const { data } = await altosDeViedmaApi.get(`/property-monthly-payments/property/${propertyId}`);
      return data;
    },
    enabled: !!propertyId,
  });
};

// Get property payment status
export const usePropertyPaymentStatus = (propertyId: string) => {
  return useQuery({
    queryKey: ['propertyPaymentStatus', propertyId],
    queryFn: async (): Promise<IPropertyPaymentStatus> => {
      const { data } = await altosDeViedmaApi.get(`/property-monthly-payments/property-status/${propertyId}`);
      return data;
    },
    enabled: !!propertyId,
  });
};

// Create monthly payment
export const useCreateMonthlyPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (paymentData: {
      propertyId: string;
      year: number;
      month: number;
      amountDue: number;
      amountPaid?: number;
      notes?: string;
    }) => {
      const { data } = await altosDeViedmaApi.post('/property-monthly-payments', paymentData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monthlyPayments'] });
      queryClient.invalidateQueries({ queryKey: ['monthlyPaymentSummary'] });
      queryClient.invalidateQueries({ queryKey: ['propertyPayments'] });
      queryClient.invalidateQueries({ queryKey: ['propertyPaymentStatus'] });
    },
  });
};

// Update monthly payment
export const useUpdateMonthlyPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updateData }: {
      id: string;
      amountPaid?: number;
      status?: string;
      notes?: string;
    }) => {
      const { data } = await altosDeViedmaApi.patch(`/property-monthly-payments/${id}`, updateData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monthlyPayments'] });
      queryClient.invalidateQueries({ queryKey: ['monthlyPaymentSummary'] });
      queryClient.invalidateQueries({ queryKey: ['propertyPayments'] });
      queryClient.invalidateQueries({ queryKey: ['propertyPaymentStatus'] });
    },
  });
};

// Initialize monthly payments for all properties
export const useInitializeMonthlyPayments = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ year, month, defaultAmount }: {
      year: number;
      month: number;
      defaultAmount?: number;
    }) => {
      const { data } = await altosDeViedmaApi.post(
        `/property-monthly-payments/initialize/${year}/${month}?defaultAmount=${defaultAmount || 0}`
      );
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monthlyPayments'] });
      queryClient.invalidateQueries({ queryKey: ['monthlyPaymentSummary'] });
    },
  });
};

// Delete monthly payment
export const useDeleteMonthlyPayment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await altosDeViedmaApi.delete(`/property-monthly-payments/${id}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['monthlyPayments'] });
      queryClient.invalidateQueries({ queryKey: ['monthlyPaymentSummary'] });
      queryClient.invalidateQueries({ queryKey: ['propertyPayments'] });
      queryClient.invalidateQueries({ queryKey: ['propertyPaymentStatus'] });
    },
  });
};