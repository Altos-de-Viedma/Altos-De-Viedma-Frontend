import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import {
  createEmployeeInsurance,
  updateEmployeeInsurance,
  deleteEmployeeInsurance
} from '../services';
import { ICreateEmployeeInsurance } from '../interfaces';

export const useAddEmployeeInsurance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (insurance: ICreateEmployeeInsurance) => createEmployeeInsurance(insurance),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-insurances'] });
      queryClient.invalidateQueries({ queryKey: ['insurance-statistics'] });
      queryClient.invalidateQueries({ queryKey: ['expired-insurances'] });
      queryClient.invalidateQueries({ queryKey: ['expiring-soon-insurances'] });
      toast.success('Seguro de empleado creado exitosamente');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Error al crear el seguro de empleado';
      toast.error(message);
    },
  });
};

export const useUpdateEmployeeInsurance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, insurance }: { id: string; insurance: Partial<ICreateEmployeeInsurance> }) =>
      updateEmployeeInsurance(id, insurance),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['employee-insurances'] });
      queryClient.invalidateQueries({ queryKey: ['employee-insurance', data.id] });
      queryClient.invalidateQueries({ queryKey: ['insurance-statistics'] });
      queryClient.invalidateQueries({ queryKey: ['expired-insurances'] });
      queryClient.invalidateQueries({ queryKey: ['expiring-soon-insurances'] });
      toast.success('Seguro de empleado actualizado exitosamente');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Error al actualizar el seguro de empleado';
      toast.error(message);
    },
  });
};

export const useDeleteEmployeeInsurance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteEmployeeInsurance(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-insurances'] });
      queryClient.invalidateQueries({ queryKey: ['insurance-statistics'] });
      queryClient.invalidateQueries({ queryKey: ['expired-insurances'] });
      queryClient.invalidateQueries({ queryKey: ['expiring-soon-insurances'] });
      toast.success('Seguro de empleado eliminado exitosamente');
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || 'Error al eliminar el seguro de empleado';
      toast.error(message);
    },
  });
};