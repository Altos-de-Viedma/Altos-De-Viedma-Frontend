import { NavigateFunction } from 'react-router-dom';
import axios, { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { useAuthStore } from '../pages/auth/store';
import { AuthService } from '../pages/auth/services';



const BASE_URL = import.meta.env.VITE_BACKEND_BASE_URL;

let navigate: NavigateFunction | null = null;

export const setNavigate = ( nav: NavigateFunction ) => {
  navigate = nav;
};

const onLogout = () => {

  useAuthStore.getState().logoutUser();

  if ( navigate ) {
    navigate( '/login' );
  } else {
    console.error( 'Navigate function not set' );
  }

};

export const createApi = (): AxiosInstance => {
  const api = axios.create( { baseURL: BASE_URL } );

  api.interceptors.request.use( async ( config ) => {

    const token = useAuthStore.getState().token;

    if ( token ) {
      config.headers[ 'Authorization' ] = `Bearer ${ token }`;
    }

    return config;
  } );

  api.interceptors.response.use(
    ( response ) => response,
    async ( error: AxiosError ) => {

      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean; };

      if ( error.response?.status === 401 && originalRequest && !originalRequest._retry ) {

        originalRequest._retry = true;

        try {
          const { token, user } = await AuthService.refreshToken();
          useAuthStore.getState().setCredentials( token, user );
          if ( originalRequest.headers ) {
            originalRequest.headers[ 'Authorization' ] = `Bearer ${ token }`;
          }
          return api( originalRequest );
        } catch ( refreshError ) {
          onLogout();
          return Promise.reject( refreshError );
        }
      }

      return Promise.reject( error );
    }
  );

  return api;
};

export const altosDeViedmaApi = createApi();

export type ApiResponse<T> = Promise<T>;

export const handleApiError = ( error: unknown, operation: string ): never => {
  console.log( operation );
  console.log( error );
  throw error;
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