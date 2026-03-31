import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-toastify';

import { UI } from '../../../../shared';
import { RecoverAccountFormInput } from './RecoverAccountFormInput';
import { altosDeViedmaApi } from '../../../../api';

const recoveryAccountSchema = z.object( {
  email: z.string().email( 'Por favor, ingresa un correo electrónico válido' ),
} );

type RecoveryAccountInputs = z.infer<typeof recoveryAccountSchema>;

export const RecoverAccount: React.FC = () => {

  const [ message, setMessage ] = useState<string | null>( null );
  const [ isSubmitted, setIsSubmitted ] = useState( false );
  const [ countdown, setCountdown ] = useState( 15 );
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RecoveryAccountInputs>( {
    resolver: zodResolver( recoveryAccountSchema ),
  } );

  useEffect( () => {

    let timer: NodeJS.Timeout;

    if ( isSubmitted && countdown > 0 ) {
      timer = setTimeout( () => setCountdown( countdown - 1 ), 1000 );
    } else if ( isSubmitted && countdown === 0 ) {
      navigate( '/ingresar' );
    }

    return () => clearTimeout( timer );
  }, [ isSubmitted, countdown, navigate ] );

  const onSubmit: SubmitHandler<RecoveryAccountInputs> = async ( data ) => {
    try {
      const checkEmailResponse = await altosDeViedmaApi.post( '/auth/check-email', { email: data.email } );
      if ( checkEmailResponse.data.mailExists ) {
        await altosDeViedmaApi.post( '/auth/recover-password', { email: data.email } );
        setMessage( 'Te hemos enviado las instrucciones para cambiar tu contraseña, por favor REVISA TU BANDEJA DE SPAM' );
        setIsSubmitted( true );
        toast.success( 'Correo para cambiar la clave enviado correctamente' );
      } else {
        setMessage( 'Usuario no registrado o no existe' );
        toast.error( 'Usuario no registrado o no existe' );
      }
    } catch ( error ) {
      setMessage( 'Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.' );
      toast.error( 'Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.' );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full max-w-md p-8 space-y-8  rounded-lg shadow-lg">
        <h2 className="text-3xl font-extrabold text-center text-gray-900">Recuperar Cuenta</h2>
        { !isSubmitted ? (
          <>
            <p className="text-center text-gray-600">
              Ingresa tu correo electrónico y te enviaremos instrucciones para cambiar tu clave
            </p>
            <form onSubmit={ handleSubmit( onSubmit ) } className="mt-8 space-y-6">
              <RecoverAccountFormInput
                type="email"
                label="Correo electrónico"
                id="email"
                register={ register }
                error={ errors.email }
              />
              <div>
                <UI.Button
                  color="primary"
                  className="w-full py-3 px-4 text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md shadow-sm text-sm font-medium transition duration-150 ease-in-out"
                  size="lg"
                  type="submit"
                  disabled={ isSubmitting }
                >
                  { isSubmitting ? 'Enviando...' : 'Enviar instrucciones' }
                </UI.Button>
              </div>
            </form>
          </>
        ) : null }
        { message && (
          <div className={ `text-lg font-semibold ${ message.includes( 'error' ) ? 'text-red-600' : 'text-green-600' } p-4 border border-gray-200 dark:border-gray-700 rounded-lg shadow-inner` }>
            { message }
            { isSubmitted && (
              <p className="text-gray-600 mt-2">
                Redirigiendo en { countdown } segundos...
              </p>
            ) }
          </div>
        ) }
      </div>
    </div>
  );
};