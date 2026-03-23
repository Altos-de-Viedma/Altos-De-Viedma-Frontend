import { altosDeViedmaApi } from '../../../api';
import { AccountVerificationStatus, ChangePasswordResponse, LoginResponse } from '../interfaces';

// Input sanitization helper
const sanitizeInput = (input: string): string => {
  return input.trim().replace(/[<>]/g, '');
};

// Input validation helpers
const validateUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9._-]{3,50}$/;
  return usernameRegex.test(username);
};

const validatePassword = (password: string): boolean => {
  return password.length >= 6 && password.length <= 128;
};

export class AuthService {
  static login = async ( username: string, password: string ): Promise<LoginResponse> => {
    try {
      // Input validation and sanitization
      const sanitizedUsername = sanitizeInput(username);
      const sanitizedPassword = password; // Don't sanitize password as it might contain special chars

      if (!validateUsername(sanitizedUsername)) {
        throw new Error('Formato de usuario inválido');
      }

      if (!validatePassword(sanitizedPassword)) {
        throw new Error('Formato de contraseña inválido');
      }

      const { data } = await altosDeViedmaApi.post<LoginResponse>( '/auth/login', {
        username: sanitizedUsername,
        password: sanitizedPassword
      });
      return data;
    } catch ( error: any ) {
      // Avoid exposing sensitive error information
      if (error.response?.status === 401) {
        throw new Error('Credenciales inválidas');
      } else if (error.response?.status === 429) {
        throw new Error('Demasiados intentos. Intente más tarde');
      } else if (error.message?.includes('inválido')) {
        throw error;
      } else {
        throw new Error('Error de conexión. Intente más tarde');
      }
    }
  };

  static checkStatus = async (): Promise<LoginResponse> => {
    try {
      const { data } = await altosDeViedmaApi.get<LoginResponse>( '/auth/check-status' );
      return data;
    } catch ( error ) {
      throw new Error( 'UnAuthorized' );
    }
  };

  static refreshToken = async (): Promise<LoginResponse> => {
    try {
      const { data } = await altosDeViedmaApi.post<LoginResponse>( '/auth/refresh-token' );
      return data;
    } catch ( error ) {
      throw new Error( 'Unable to refresh token' );
    }
  };
}

export const checkAccountVerificationStatus = async ( id: string ): Promise<AccountVerificationStatus> => {
  try {
    // Validate ID format (UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new Error('ID inválido');
    }

    const { data } = await altosDeViedmaApi.get<AccountVerificationStatus>( `/auth/account-verification-status/${ id }` );
    return data;
  } catch ( error: any ) {
    if (error.message?.includes('inválido')) {
      throw error;
    }
    throw new Error( 'Unable to check verification status' );
  }
};

export const changePassword = async ( password: string ): Promise<ChangePasswordResponse> => {
  try {
    if (!validatePassword(password)) {
      throw new Error('La contraseña debe tener entre 6 y 128 caracteres');
    }

    const { data } = await altosDeViedmaApi.post<ChangePasswordResponse>( '/auth/change-password', { password } );
    return data;
  } catch ( error: any ) {
    if (error.message?.includes('contraseña')) {
      throw error;
    }
    throw new Error( 'Unable to change password' );
  }
};