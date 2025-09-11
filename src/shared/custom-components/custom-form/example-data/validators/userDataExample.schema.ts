import { z } from 'zod';

import {
  useCustomIntegerValidation,
  useCustomSelectMultipleValidation
} from '../../components';


const nameValidation = z.string().min( 2, {
  message: 'El nombre debe de tener como mínimo 2 caracteres.',
} );

const planValidation = z.string().min( 2, {
  message: 'El plan debe de tener como mínimo 2 caracteres.',
} );

const ageValidation = useCustomIntegerValidation( 1, 'La edad debe de ser un número entero válido.' );


const rolesValidation = useCustomSelectMultipleValidation( 2, 'Cada rol debe de tener al menos 2 caracteres.' );

export const userDataExampleSchema = z.object( {
  name: nameValidation,
  age:  ageValidation,
  rol:  rolesValidation,
  plan: planValidation,
} );

export type IUserExampleInput = z.infer<typeof userDataExampleSchema>;
