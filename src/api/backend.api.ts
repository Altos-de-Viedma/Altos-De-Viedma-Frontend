import { NavigateFunction } from 'react-router-dom';
import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { useAuthStore } from '../pages/auth/store';
import { AuthService } from '../pages/auth/services';

const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

// Validate BASE_URL
if (!BASE_URL || !BASE_URL.startsWith('http')) {
  throw new Error('Invalid or missing VITE_BACKEND_BASE_URL');
}

let navigate: NavigateFunction | null = null;

export const setNavigate = ( nav: NavigateFunction ) => {
  navigate = nav;
};

const onLogout = () => {
  // Clear sensitive data from memory
  useAuthStore.getState().logoutUser();

  // Clear any cached data
  if (typeof window !== 'undefined') {
    sessionStorage.clear();
    // Only clear localStorage items related to auth, not all
    localStorage.removeItem('auth-token');
    localStorage.removeItem('refresh-token');
  }

  if ( navigate ) {
    navigate( '/ingresar' );
  } else {
    console.error( 'Navigate function not set' );
  }
};

export const createApi = (): AxiosInstance => {
  const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000, // 10 second timeout
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest', // CSRF protection
    },
    withCredentials: true, // Include cookies for CSRF protection
  });

  // Request interceptor
  api.interceptors.request.use(
    async ( config ) => {
      const token = useAuthStore.getState().token;

      if ( token ) {
        // Validate token format before sending
        if (typeof token === 'string' && token.length > 0) {
          config.headers[ 'Authorization' ] = `Bearer ${ token }`;
        }
      }

      // Add security headers
      config.headers['X-Content-Type-Options'] = 'nosniff';
      config.headers['X-Frame-Options'] = 'DENY';
      config.headers['X-XSS-Protection'] = '1; mode=block';

      return config;
    },
    (error) => {
      console.error('Request interceptor error:', error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  api.interceptors.response.use(
    ( response ) => {
      // Validate response structure
      if (response.data && typeof response.data === 'object') {
        return response;
      }
      console.warn('Unexpected response format:', response);
      return response;
    },
    async ( error: AxiosError ) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean; };

      // Handle different error scenarios securely
      if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const { token, user } = await AuthService.refreshToken();

          // Validate refreshed token
          if (!token || typeof token !== 'string') {
            throw new Error('Invalid token received');
          }

          useAuthStore.getState().setCredentials( token, user );
          if ( originalRequest.headers ) {
            originalRequest.headers[ 'Authorization' ] = `Bearer ${ token }`;
          }
          return api( originalRequest );
        } catch ( refreshError ) {
          console.error('Token refresh failed:', refreshError);
          onLogout();
          return Promise.reject( refreshError );
        }
      }

      // Handle rate limiting
      if (error.response?.status === 429) {
        console.warn('Rate limit exceeded');
        return Promise.reject(new Error('Demasiadas solicitudes. Intente más tarde.'));
      }

      // Handle server errors without exposing sensitive information
      if (error.response?.status && error.response.status >= 500) {
        console.error('Server error:', error.response.status);
        return Promise.reject(new Error('Error del servidor. Intente más tarde.'));
      }

      return Promise.reject( error );
    }
  );

  return api;
};

export const altosDeViedmaApi = createApi();

export type ApiResponse<T> = Promise<T>;

export const handleApiError = ( error: unknown, operation: string ): never => {
  // Log error securely (avoid logging sensitive data)
  console.error(`API Error in ${operation}:`, {
    message: error instanceof Error ? error.message : 'Unknown error',
    timestamp: new Date().toISOString(),
  });

  // Don't expose internal error details to the user
  if (error instanceof Error) {
    throw error;
  }
  throw new Error('Error de conexión');
};

export const apiCall = async <T>(
  operation: string,
  apiFunction: () => Promise<AxiosResponse<T>>
): ApiResponse<T> => {
  try {
    const { data } = await apiFunction();
    return data;
  } catch ( error ) {
    return handleApiError( error, operation );
  }
};