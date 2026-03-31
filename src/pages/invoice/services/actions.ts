import { altosDeViedmaApi } from '../../../api';
import { IInvoice } from '../interfaces/IInvoice';

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
  // Limpiar los datos antes de enviarlos
  const cleanData: { title: string; description?: string; invoiceUrl: string } = {
    title: invoice.title.trim(),
    invoiceUrl: invoice.invoiceUrl.trim(),
  };

  // Solo incluir description si no está vacía
  if (invoice.description && invoice.description.trim() !== '') {
    cleanData.description = invoice.description.trim();
  }

  const { data } = await altosDeViedmaApi.post<IInvoice>('/invoice', cleanData);
  return data;
};

export const updateInvoice = async (id: string, invoice: { title?: string; description?: string; invoiceUrl?: string; state?: 'in_progress' | 'confirmed' }): Promise<IInvoice> => {
  // Limpiar los datos antes de enviarlos
  const cleanData: { title?: string; description?: string; invoiceUrl?: string; state?: 'in_progress' | 'confirmed' } = {};

  if (invoice.title !== undefined) {
    cleanData.title = invoice.title.trim();
  }

  if (invoice.invoiceUrl !== undefined) {
    cleanData.invoiceUrl = invoice.invoiceUrl.trim();
  }

  if (invoice.description !== undefined && invoice.description.trim() !== '') {
    cleanData.description = invoice.description.trim();
  }

  if (invoice.state !== undefined) {
    cleanData.state = invoice.state;
  }

  const { data } = await altosDeViedmaApi.patch<IInvoice>(`/invoice/${id}`, cleanData);
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