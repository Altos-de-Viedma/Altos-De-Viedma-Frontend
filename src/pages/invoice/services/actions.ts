import { altosDeViedmaApi } from '../../../api';
import { IInvoice } from '../interfaces';

export const getInvoices = async (): Promise<IInvoice[]> => {
  const { data } = await altosDeViedmaApi.get<IInvoice[]>('/invoice');
  return data;
};

export const getInvoicesByUser = async (): Promise<IInvoice[]> => {
  const { data } = await altosDeViedmaApi.get<IInvoice[]>('/invoice/user/invoices');
  return data;
};

export const getInvoice = async (id: string): Promise<IInvoice> => {
  const { data } = await altosDeViedmaApi.get<IInvoice>(`/invoice/${id}`);
  return data;
};

export const createInvoice = async (invoice: { title: string; description?: string; invoiceUrl: string }): Promise<IInvoice> => {
  const { data } = await altosDeViedmaApi.post<IInvoice>('/invoice', invoice);
  return data;
};

export const updateInvoice = async (id: string, invoice: { title?: string; description?: string; invoiceUrl?: string; state?: 'in_progress' | 'confirmed' }): Promise<IInvoice> => {
  const { data } = await altosDeViedmaApi.patch<IInvoice>(`/invoice/${id}`, invoice);
  return data;
};

export const confirmInvoice = async (id: string): Promise<IInvoice> => {
  const { data } = await altosDeViedmaApi.patch<IInvoice>(`/invoice/confirm/${id}`);
  return data;
};

export const deleteInvoice = async (id: string): Promise<IInvoice> => {
  const { data } = await altosDeViedmaApi.delete<IInvoice>(`/invoice/${id}`);
  return data;
};