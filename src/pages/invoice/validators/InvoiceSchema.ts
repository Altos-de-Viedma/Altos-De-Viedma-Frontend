import { z } from 'zod';

export const invoiceSchema = z.object({
  title: z.string().min(1, 'El título es obligatorio').trim(),
  description: z.string().optional().or(z.literal('')).transform(val => val === '' ? undefined : val),
  invoiceUrl: z.string().url('Debe ser una URL válida').min(1, 'La URL de la expensa es obligatoria').trim(),
  propertyId: z.string().min(1, 'La propiedad es obligatoria').trim(),
});

export type InvoiceInputs = z.infer<typeof invoiceSchema>;