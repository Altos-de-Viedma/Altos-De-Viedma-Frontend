import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';

import { useRedirect } from '../../../../shared';
import { LoginInputs } from '../../interfaces';
import { useAuthStore } from '../../store';
import { userLoginSchema } from '../../validations';
import { LoginFormInput } from './LoginFormInput';
import { Icons } from '../../../../shared';

export const LoginForm: React.FC = () => {
  const { redirectTo } = useRedirect();
  const loginUser = useAuthStore( state => state.loginUser );
  const [ showPassword, setShowPassword ] = useState( false );

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginInputs>( {
    resolver: zodResolver( userLoginSchema ),
  } );

  const onSubmit: SubmitHandler<LoginInputs> = async ( { username, password } ) => {
    try {
      await loginUser( username, password );
      toast.success( 'Inicio de sesión exitoso' );
      redirectTo( '/home' );
    } catch ( error: any ) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Usuario o clave incorrecto';

      // Manejar mensaje específico para usuario bloqueado
      if ( errorMessage.includes( 'bloqueado' ) ) {
        setError( 'root', {
          type: 'manual',
          message: 'Usuario bloqueado. Contacte al administrador.'
        } );
        toast.error( 'Usuario bloqueado. Contacte al administrador.' );
      } else {
        setError( 'root', {
          type: 'manual',
          message: 'Usuario o clave incorrecto'
        } );
        toast.error( 'Usuario o clave incorrecto.' );
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword( !showPassword );
  };

  return (
    <div className="w-full max-w-sm mx-auto px-4 sm:px-0">
      <form
        onSubmit={ handleSubmit( onSubmit ) }
        className="center-flex-col space-y-6 sm:space-y-8 w-full"
        role="form"
        aria-label="Formulario de inicio de sesión"
      >
        {/* Username input */}
        <div className="w-full">
          <LoginFormInput
            type="username"
            label="Usuario"
            id="username"
            register={ register }
            error={ errors.username }
          />
        </div>

        {/* Password input with toggle */}
        <div className="relative w-full">
          <LoginFormInput
            type={ showPassword ? "text" : "password" }
            label="Contraseña"
            id="password"
            register={ register }
            error={ errors.password }
          />
          <button
            type="button"
            onClick={ togglePasswordVisibility }
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md p-1.5 transition-colors duration-200"
            aria-label={ showPassword ? "Ocultar contraseña" : "Mostrar contraseña" }
            aria-pressed={ showPassword }
          >
            { showPassword ?
              <Icons.IoEyeOffOutline size={20} /> :
              <Icons.IoEyeOutline size={20} />
            }
          </button>
        </div>

        {/* Error message */}
        { errors.root && (
          <div
            role="alert"
            aria-live="polite"
            className="w-full text-center text-danger responsive-text-sm bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3"
          >
            { errors.root.message }
          </div>
        )}

        {/* Submit button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="corporate-button w-full max-w-xs mx-auto disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:bg-gray-400 disabled:transform-none shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200"
          aria-describedby={isSubmitting ? "login-loading" : undefined}
        >
          {isSubmitting ? (
            <div className="center-flex gap-2">
              <div
                className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                role="status"
                aria-label="Cargando"
              ></div>
              <span id="login-loading" className="responsive-text-sm">Ingresando...</span>
            </div>
          ) : (
            <span className="responsive-text-base font-semibold">Iniciar Sesión</span>
          )}
        </button>
      </form>
    </div>
  );
};