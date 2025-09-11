import { altosDeViedmaApi } from '../../../api';
import { AccountVerificationStatus, ChangePasswordResponse, LoginResponse } from '../interfaces';


export class AuthService {
  static login = async ( username: string, password: string ): Promise<LoginResponse> => {
    try {
      const { data } = await altosDeViedmaApi.post<LoginResponse>( '/auth/login', { username, password } );
      return data;
    } catch ( error ) {
      throw error;
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
    const { data } = await altosDeViedmaApi.get<AccountVerificationStatus>( `/auth/account-verification-status/${ id }` );
    return data;
  } catch ( error ) {
    throw new Error( 'Unable to check verification status' );
  }
};

export const changePassword = async ( password: string ): Promise<ChangePasswordResponse> => {
  try {
    const { data } = await altosDeViedmaApi.post<ChangePasswordResponse>( '/auth/change-password', { password } );
    return data;
  } catch ( error ) {
    throw new Error( 'Unable to change password' );
  }
};