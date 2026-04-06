import { z } from 'zod';
import { TransactionType, TransactionCategory } from '../interfaces';

export const cashTransactionSchema = z.object({
  amount: z.number()
    .min(0.01, 'El monto debe ser mayor a 0')
    .max(999999.99, 'El monto no puede exceder $999,999.99'),

  type: z.nativeEnum(TransactionType, {
    errorMap: () => ({ message: 'Debe seleccionar entrada o salida' })
  }),

  category: z.nativeEnum(TransactionCategory, {
    errorMap: () => ({ message: 'Debe seleccionar una categoría' })
  }),

  description: z.string()
    .max(500, 'La descripción no puede exceder 500 caracteres')
    .optional()
    .or(z.literal(''))
});

export type CashTransactionInputs = z.infer<typeof cashTransactionSchema>;