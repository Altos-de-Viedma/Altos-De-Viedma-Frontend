import { z } from 'zod';

const passwordValidation = z.string()
  .min( 8, "La contraseña debe tener al menos 8 caracteres" )
  .regex( /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    "La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial" );

export const newPasswordSchema = z.object( {
  password: passwordValidation,
  confirmPassword: passwordValidation
} ).refine( ( data ) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: [ "confirmPassword" ],
} );

export type ChangePasswordInputs = z.infer<typeof newPasswordSchema>;