import { z } from 'zod';



const propertyValidation = z.string().uuid( {
  message: "El ID de la propiedad a la que visitará es obligatorio y debe ser un UUID válido.",
} );

const dateAndTimeOfVisitValidation = z.string().min( 1, {
  message: "La fecha de la visita es obligatoria.",
} );

const fullNameVisitorValidation = z.string().min( 1, {
  message: "El nombre del visitante es obligatorio.",
} );

const dniVisitorValidation = z.string().min( 1, {
  message: "El DNI del visitante es obligatorio.",
} );

const phoneVisitorValidation = z.string().min( 1, {
  message: "El teléfono del visitante es obligatorio.",
} );

const descriptionValidation = z.string().min( 1, {
  message: "Una breve descripción acerca de la visita es obligatoria.",
} );


const vehiclePlateValidation = z.string().optional().default("-");

const profilePictureValidation = z.string().min( 1, {
  message: "Una foto del vistiante es obligatoria.",
} );

export const visitorSchema = z.object( {
  property:           propertyValidation,
  dateAndTimeOfVisit: dateAndTimeOfVisitValidation,
  fullName:           fullNameVisitorValidation,
  vehiclePlate:       vehiclePlateValidation,
  dni:                dniVisitorValidation,
  phone:              phoneVisitorValidation,
  description:        descriptionValidation,
  profilePicture:     profilePictureValidation,
} );

export type VisitorInputs = z.infer<typeof visitorSchema>;
