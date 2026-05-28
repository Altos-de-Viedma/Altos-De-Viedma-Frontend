import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { altosDeViedmaApi as api } from '../../../api';
import { IProperty } from '../../property/interfaces/IProperty';
import { IInvoice } from '../interfaces/invoice';

const fetchLiquidaciones = async (): Promise<IProperty[]> => {
  const { data } = await api.get<IProperty[]>('/property/liquidations');
  return data;
};

export const useLiquidaciones = () => {
  return useQuery({
    queryKey: ['liquidaciones'],
    queryFn: fetchLiquidaciones,
  });
};

const fetchPaidInvoices = async (propertyId: string): Promise<IInvoice[]> => {
  const { data } = await api.get<IInvoice[]>(`/invoice/property/${propertyId}/paid`);
  return data;
};

export const usePaidInvoices = (propertyId: string | null) => {
  return useQuery({
    queryKey: ['paidInvoices', propertyId],
    queryFn: () => fetchPaidInvoices(propertyId!),
    enabled: !!propertyId,
  });
};

interface UpdateAmountsArgs {
  id: string;
  monthlyExpenseAmount?: number;
  accumulatedDebt?: number;
}

const updatePropertyAmounts = async ({ id, monthlyExpenseAmount, accumulatedDebt }: UpdateAmountsArgs) => {
  const { data } = await api.patch(`/property/${id}`, {
    monthlyExpenseAmount,
    accumulatedDebt,
  });
  return data;
};

export const useUpdatePropertyAmounts = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updatePropertyAmounts,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['liquidaciones'] });
      toast.success('Valores actualizados correctamente');
    },
    onError: (error) => {
      console.error(error);
      toast.error('Error al actualizar los valores');
    }
  });
};
