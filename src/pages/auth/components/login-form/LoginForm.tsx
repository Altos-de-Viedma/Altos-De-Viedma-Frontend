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
    <form onSubmit={ handleSubmit( onSubmit ) } className="flex flex-col items-center justify-center space-y-4" role="form" aria-label="Formulario de inicio de sesión">
      <LoginFormInput
        type="username"
        label="Usuario"
        id="username"
        register={ register }
        error={ errors.username }
      />
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
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-md p-1"
          aria-label={ showPassword ? "Ocultar contraseña" : "Mostrar contraseña" }
          aria-pressed={ showPassword }
        >
          { showPassword ? <Icons.IoEyeOffOutline /> : <Icons.IoEyeOutline /> }
        </button>
      </div>
      { errors.root && (
        <div role="alert" aria-live="polite" className="text-danger text-sm">
          { errors.root.message }
        </div>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full max-w-xs bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg text-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        aria-describedby={isSubmitting ? "login-loading" : undefined}
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center gap-2">
            <div
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
              role="status"
              aria-label="Cargando"
            ></div>
            <span id="login-loading">Ingresando...</span>
          </div>
        ) : (
          'Iniciar Sesión'
        )}
      </button>
    </form>
  );
};