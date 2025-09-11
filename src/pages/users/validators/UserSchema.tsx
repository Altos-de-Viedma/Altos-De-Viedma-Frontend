import { z } from 'zod';



const usernameValidation = z.string().min(1, {
  message: "El nombre de usuario es obligatorio."
});

const nameValidation = z.string().min(1, {
  message: "El nombre del propietario es obligatorio."
});

const lastNameValidation = z.string().min(1, {
  message: "El apellido del propietario es obligatorio."
});

const passwordValidation = z.string().regex(
  /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  message: 'La contraseña debe tener una mayúscula, una minúscula y un número'
}).min(8, {
  message: 'La contraseña debe tener al menos 8 caracteres'
}).max(20, {
  message: 'La contraseña no debe exceder los 20 caracteres'
});

const phoneValidation = z.string().min(1, {
  message: "Por favor ingresa un número de teléfono válido."
});

const addressValidation = z.string().min(1, {
  message: "Por favor ingresa una dirección válida."
});

const rolesValidation = z.array(z.string()).min(1, {
  message: "Debe haber al menos un rol."
});

export const userSchema = z.object({
  username:          usernameValidation,
  password:          passwordValidation,
  confirmPassword:   passwordValidation,
  name:              nameValidation,
  lastName:          lastNameValidation,
  address:           addressValidation,
  phone:             phoneValidation,
  roles:             rolesValidation
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

export interface userInputs extends z.infer<typeof userSchema> {}
