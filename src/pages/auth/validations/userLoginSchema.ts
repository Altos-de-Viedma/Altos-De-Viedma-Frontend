import { z } from 'zod';

export const userLoginSchema = z.object( {
  username: z.string( {
    message: "Por favor ingresa un usuario válido."
  } ),
  password: z.string().min( 6, {
    message: 'La contraseña debe tener al menos 6 caracteres.'
  } ),
} );
