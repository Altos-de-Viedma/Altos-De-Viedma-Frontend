import { z } from 'zod';


const nameValidation = z.string().min( 1, {
  message: "El nombre es obligatorio."
} );

const lastNameValidation = z.string().min( 1, {
  message: "El apellido es obligatorio."
} );

const emailValidation = z.string().email( {
  message: "Por favor ingresa un correo válido."
} );

const rolesValidation = z.array(z.string()).min(1, {
  message: "Debe haber al menos un rol."
});

export const userSchema = z.object( {
  email:    emailValidation,
  name:     nameValidation,
  lastName: lastNameValidation,
  roles:    rolesValidation
} );

export interface userInputs extends z.infer<typeof userSchema> { }