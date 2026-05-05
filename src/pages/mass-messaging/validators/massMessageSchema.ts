import { z } from 'zod';

export const massMessageSchema = z.object({
  message: z
    .string()
    .min(1, 'El mensaje es requerido')
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(1000, 'El mensaje no puede exceder 1000 caracteres'),
});

export type MassMessageFormData = z.infer<typeof massMessageSchema>;