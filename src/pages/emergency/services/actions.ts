import { altosDeViedmaApi, apiCall } from '../../../api';
import { EmergencyInputs } from '../validators';
import { IEmergency } from '../interfaces';


const EMERGENCYY_ENDPOINT = '/emergency';

const makeApiCall = <T>( method: 'get' | 'post' | 'patch' | 'delete', endpoint: string, data?: any ): Promise<T> =>
  apiCall( `${ method.toUpperCase() } ${ endpoint }`, () => altosDeViedmaApi[ method ]<T>( endpoint, data ) );

makeApiCall( 'get', EMERGENCYY_ENDPOINT );

export const getEmergencies = (): Promise<IEmergency[]> =>
  makeApiCall( 'get', EMERGENCYY_ENDPOINT );

export const getEmergencyById = ( id: string ): Promise<IEmergency> => {
  if ( !id ) return Promise.reject( new Error( 'User ID is required' ) );
  return makeApiCall( 'get', `${ EMERGENCYY_ENDPOINT }/${ id }` );
};

export const createEmergency = ( newEmergency: EmergencyInputs ): Promise<IEmergency> => {
  return makeApiCall( 'post', EMERGENCYY_ENDPOINT, newEmergency );
};

export const updateEmergency = ( emergencyUpdate: EmergencyInputs, id: string ): Promise<IEmergency> =>
  makeApiCall( 'patch', `${ EMERGENCYY_ENDPOINT }/${ id }`, emergencyUpdate );

export const markAsSeenEmergency = ( id: string ): Promise<IEmergency> =>
  makeApiCall( 'patch', `${ EMERGENCYY_ENDPOINT }/seen/${ id }` );

export const endEmergency = ( id: string ): Promise<IEmergency> =>
  makeApiCall( 'patch', `${ EMERGENCYY_ENDPOINT }/end/${ id }` );

export const deleteEmergency = ( id: string ): Promise<IEmergency> =>
  makeApiCall( 'delete', `${ EMERGENCYY_ENDPOINT }/${ id }` );
