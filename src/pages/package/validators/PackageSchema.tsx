import { z } from 'zod';



const titleValidation = z.string().min( 2,{
  message: "El título del paquete es obligatorio."
} );

const propertyValidation = z.string().uuid( {
  message: "El ID de la propiedad es obligatorio y debe ser un UUID válido."
} );

const arrivalDateValidation = z.string().min( 1, {
  message: "La fecha en que debería llegar el paquete es obligatoria."
} );

const descriptionValidation = z.string().min( 1, {
  message: "Una breve descripción acerca del paquete es obligatoria."
} );

export const packageSchema = z.object( {
  title:              titleValidation,
  propertyId:         propertyValidation,
  description:        descriptionValidation,
  arrivalDate:        arrivalDateValidation,
} );

export type PackageInputs = z.infer<typeof packageSchema>;
