import { z } from 'zod';


const emailValidation = z.string().email( {
  message: "Por favor ingresa un correo válido."
} );

export const recoveryAccountSchema = z.object( {
  email: emailValidation,
} );

export interface recoveryAccountInputs extends z.infer<typeof recoveryAccountSchema> { }