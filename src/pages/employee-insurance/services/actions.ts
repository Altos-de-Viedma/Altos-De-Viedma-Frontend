import { altosDeViedmaApi } from '../../../api';
import { IEmployeeInsurance, ICreateEmployeeInsurance, IInsuranceStatistics } from '../interfaces';

export const getEmployeeInsurances = async (): Promise<IEmployeeInsurance[]> => {
  const { data } = await altosDeViedmaApi.get<IEmployeeInsurance[]>('/employee-insurance');
  return data;
};

export const getEmployeeInsurance = async (id: string): Promise<IEmployeeInsurance> => {
  const { data } = await altosDeViedmaApi.get<IEmployeeInsurance>(`/employee-insurance/${id}`);
  return data;
};

export const createEmployeeInsurance = async (insurance: ICreateEmployeeInsurance): Promise<IEmployeeInsurance> => {
  const { data } = await altosDeViedmaApi.post<IEmployeeInsurance>('/employee-insurance', insurance);
  return data;
};

export const updateEmployeeInsurance = async (id: string, insurance: Partial<ICreateEmployeeInsurance>): Promise<IEmployeeInsurance> => {
  const { data } = await altosDeViedmaApi.patch<IEmployeeInsurance>(`/employee-insurance/${id}`, insurance);
  return data;
};

export const deleteEmployeeInsurance = async (id: string): Promise<void> => {
  await altosDeViedmaApi.delete(`/employee-insurance/${id}`);
};

export const getInsuranceStatistics = async (): Promise<IInsuranceStatistics> => {
  const { data } = await altosDeViedmaApi.get<IInsuranceStatistics>('/employee-insurance/statistics');
  return data;
};

export const getExpiredInsurances = async (): Promise<IEmployeeInsurance[]> => {
  const { data } = await altosDeViedmaApi.get<IEmployeeInsurance[]>('/employee-insurance/expired');
  return data;
};

export const getExpiringSoonInsurances = async (days: number = 30): Promise<IEmployeeInsurance[]> => {
  const { data } = await altosDeViedmaApi.get<IEmployeeInsurance[]>(`/employee-insurance/expiring-soon?days=${days}`);
  return data;
};

export const approveEmployeeInsurance = async (id: string, approveData: { notes?: string }): Promise<IEmployeeInsurance> => {
  const { data } = await altosDeViedmaApi.post<IEmployeeInsurance>(`/employee-insurance/${id}/approve`, approveData);
  return data;
};

export const rejectEmployeeInsurance = async (id: string, rejectData: { rejectionReason: string }): Promise<IEmployeeInsurance> => {
  const { data } = await altosDeViedmaApi.post<IEmployeeInsurance>(`/employee-insurance/${id}/reject`, rejectData);
  return data;
};

export const getDeletedInsurances = async (): Promise<IEmployeeInsurance[]> => {
  const { data } = await altosDeViedmaApi.get<IEmployeeInsurance[]>('/employee-insurance/deleted');
  return data;
};

export const restoreEmployeeInsurance = async (id: string): Promise<IEmployeeInsurance> => {
  const { data } = await altosDeViedmaApi.post<IEmployeeInsurance>(`/employee-insurance/${id}/restore`);
  return data;
};