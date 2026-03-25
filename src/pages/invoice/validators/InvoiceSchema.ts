import { z } from 'zod';

export const invoiceSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio'),
  description: z.string().optional(),
  invoiceUrl: z.string().url('Debe ser una URL válida').min(1, 'La URL de la factura es obligatoria'),
});

export type InvoiceInputs = z.infer<typeof invoiceSchema>;