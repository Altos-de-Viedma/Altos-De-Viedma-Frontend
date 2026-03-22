import { altosDeViedmaApi, apiCall } from '../../../api';
import { IProperty } from '../interfaces';
import { PropertyInputs } from '../validators';



const PROPERTY_ENDPOINT = '/property';

const makeApiCall = <T>( method: 'get' | 'post' | 'patch' | 'delete', endpoint: string, data?: any ): Promise<T> =>
  apiCall( `${ method.toUpperCase() } ${ endpoint }`, () => altosDeViedmaApi[ method ]<T>( endpoint, data ) );

makeApiCall( 'get', PROPERTY_ENDPOINT );

export const getProperties = (): Promise<IProperty[]> =>
  makeApiCall( 'get', PROPERTY_ENDPOINT );

export const getPropertyById = ( id: string ): Promise<IProperty> => {
  if ( !id ) return Promise.reject( new Error( 'User ID is required' ) );
  return makeApiCall( 'get', `${ PROPERTY_ENDPOINT }/${ id }` );
};

export const createProperty = ( newProperty: PropertyInputs ): Promise<IProperty> => {
  return makeApiCall( 'post', PROPERTY_ENDPOINT, newProperty );
};

export const updateProperty = ( propertyUpdate: PropertyInputs, id: string ): Promise<IProperty> =>
  makeApiCall( 'patch', `${ PROPERTY_ENDPOINT }/${ id }`, propertyUpdate );

export const deleteProperty = ( id: string ): Promise<IProperty> =>
  makeApiCall( 'delete', `${ PROPERTY_ENDPOINT }/${ id }` );

export const setMainProperty = ( id: string ): Promise<IProperty> =>
  makeApiCall( 'patch', `${ PROPERTY_ENDPOINT }/set-main/${ id }` );
