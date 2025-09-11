import { z } from 'zod';

/**
 * Helper para transformar y validar un valor que puede ser una cadena de texto o un array de cadenas.
 * Transforma una cadena de texto separada por comas en un array de cadenas.
 * Valida que el array resultante tenga al menos un elemento y que cada elemento tenga una longitud mínima especificada.
 * @param minLength La longitud mínima que cada elemento en el array debe tener.
 * @param errorMessage Mensaje de error personalizado.
 */
export const useCustomSelectMultipleValidation = ( minLength: number, errorMessage: string ) =>
  z.union( [
    z.string(),
    z.array( z.string() )
  ] )
    .transform( val => {
      if ( typeof val === 'string' ) {
        return val.split( ',' ).map( item => item.trim() );
      }
      return val;
    } )
    .refine( arr => arr.length > 0 && arr.every( item => item.length >= minLength ), {
      message: errorMessage,
    } );
