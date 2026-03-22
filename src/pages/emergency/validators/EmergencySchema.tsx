import { z } from 'zod';



const titleValidation = z.string().min( 1, {
  message: "La dirección de la propiedad es obligatoria."
} );

const descriptionValidation = z.string().min( 1, {
  message: "Una breve descripción acerca de la propiedad es obligatoria."
} );

export const emergencySchema = z.object( {
  title:       titleValidation,
  description: descriptionValidation
} );

export type EmergencyInputs = z.infer<typeof emergencySchema>;
