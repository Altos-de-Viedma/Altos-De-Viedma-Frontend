import { altosDeViedmaApi } from '../../../api';

export interface BulkInvoiceItem {
  phone: string;
  name: string;
  amount: number;
  date: string;
  invoiceUrl: string;
}

export interface BulkInvoiceResult {
  phone: string;
  name: string;
  userName?: string;
  propertyAddress?: string;
  amount?: number;
  invoiceId?: string;
  success: boolean;
  error?: string;
}

export const bulkCreateInvoices = async (items: BulkInvoiceItem[]): Promise<{ results: BulkInvoiceResult[] }> => {
  const { data } = await altosDeViedmaApi.post<{ results: BulkInvoiceResult[] }>(
    '/invoice/bulk', 
    { items },
    { timeout: 120000 } // Override default 10s timeout for bulk operations (can take 1-2s per item)
  );
  return data;
};
