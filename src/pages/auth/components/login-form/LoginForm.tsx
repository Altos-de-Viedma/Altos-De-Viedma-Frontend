import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';

import { UI, useRedirect } from '../../../../shared';
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
    <form onSubmit={ handleSubmit( onSubmit ) } className="flex flex-col items-center justify-center space-y-4">
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
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
        >
          { showPassword ? <Icons.IoEyeOffOutline /> : <Icons.IoEyeOutline /> }
        </button>
      </div>
      { errors.root && <span className="text-danger">{ errors.root.message }</span> }
      <UI.Button color="primary" className="w-full max-w-xs text-xl" size="lg" type="submit" disabled={ isSubmitting }>
        { isSubmitting ? 'Ingresando...' : 'Ingresar' }
      </UI.Button>
    </form>
  );
};