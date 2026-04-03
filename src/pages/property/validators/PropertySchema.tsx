import { z } from 'zod';



const usersValidation = z.array(z.string().uuid({
  message: "Cada ID de usuario debe ser un UUID válido."
})).min(1, {
  message: "La propiedad debe tener al menos un propietario."
});

const addressValidation = z.string().min( 1, {
  message: "La dirección de la propiedad es obligatoria."
} );

const descriptionValidation = z.string().min( 1, {
  message: "Una breve descripción acerca de la propiedad es obligatoria."
} );

export const propertySchema = z.object( {
  address:     addressValidation,
  description: descriptionValidation,
  users:       usersValidation,
  isMain:      z.boolean().optional(),
} );

export type PropertyInputs = z.infer<typeof propertySchema>;
