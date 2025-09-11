// src/helpers/numberValidation.ts
import { z } from 'zod';

/**
 * Helper para validar y transformar una cadena de texto a un número entero.
 * Valida que la cadena sea un número entero válido y que no esté vacía.
 * @param min La longitud mínima del número como cadena (en términos de caracteres).
 * @param errorMessage El mensaje de error para casos inválidos.
 * @returns Un esquema Zod para la validación y transformación.
 */
export const useCustomIntegerValidation = ( min: number, errorMessage: string ) =>
  z.string()
    .min( min, { message: errorMessage } )
    .transform( val => {
      const num = parseInt( val, 10 );
      if ( isNaN( num ) ) {
        throw new Error( errorMessage );
      }
      return num;
    } );
