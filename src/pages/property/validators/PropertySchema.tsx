import { z } from 'zod';



const userIdValidation = z.string().uuid( {
  message: "El ID de usuario es obligatorio y debe ser un UUID válido."
} );

const addressValidation = z.string().min( 1, {
  message: "La dirección de la propiedad es obligatoria."
} );

const descriptionValidation = z.string().min( 1, {
  message: "Una breve descripción acerca de la propiedad es obligatoria."
} );

export const propertySchema = z.object( {
  address:     addressValidation,
  description: descriptionValidation,
  user:        userIdValidation,
} );

export type PropertyInputs = z.infer<typeof propertySchema>;
