import { altosDeViedmaApi, apiCall } from '../../../api';
import { IUser } from '../interfaces';
import { userInputs } from '../validators';


const USERS_ENDPOINT = '/auth';

const makeApiCall = <T>( method: 'get' | 'post' | 'patch' | 'delete', endpoint: string, data?: any ): Promise<T> =>
  apiCall( `${ method.toUpperCase() } ${ endpoint }`, () => altosDeViedmaApi[ method ]<T>( endpoint, data ) );

export const getAllUsers = (): Promise<IUser[]> =>
  makeApiCall( 'get', USERS_ENDPOINT );

export const getAllInactiveUsers = (): Promise<IUser[]> =>
  makeApiCall( 'get', `${ USERS_ENDPOINT }/inactive` );

export const getUserById = ( id: string ): Promise<IUser> => {
  if ( !id ) return Promise.reject( new Error( 'User ID is required' ) );
  return makeApiCall( 'get', `${ USERS_ENDPOINT }/${ id }` );
};

export const createUser = ( newUser: userInputs ): Promise<IUser> => {
  const { confirmPassword, ...newUserBody } = newUser;
  return makeApiCall( 'post', `${ USERS_ENDPOINT }/register`, newUserBody );
};

export const updateUser = ( userUpdate: userInputs, id: string ): Promise<IUser> =>
  makeApiCall( 'patch', `${ USERS_ENDPOINT }/${ id }`, userUpdate );

export const deleteUser = ( id: string ): Promise<IUser> =>
  makeApiCall( 'delete', `${ USERS_ENDPOINT }/${ id }` );

export const activateUser = ( id: string ): Promise<IUser> =>
  makeApiCall( 'patch', `${ USERS_ENDPOINT }/activate/${ id }` );
