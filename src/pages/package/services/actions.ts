import { altosDeViedmaApi, apiCall } from '../../../api';
import { IPackage } from '../interfaces';
import { PackageInputs } from '../validators/PackageSchema';



const PACKAGE_ENDPOINT = '/package';

const makeApiCall = <T>( method: 'get' | 'post' | 'patch' | 'delete', endpoint: string, data?: any ): Promise<T> =>
  apiCall( `${ method.toUpperCase() } ${ endpoint }`, () => altosDeViedmaApi[ method ]<T>( endpoint, data ) );

makeApiCall( 'get', PACKAGE_ENDPOINT );

export const getPackages = (): Promise<IPackage[]> =>
  makeApiCall( 'get', PACKAGE_ENDPOINT );

export const getPackageById = ( id: string ): Promise<IPackage> => {
  if ( !id ) return Promise.reject( new Error( 'Package ID is required' ) );
  return makeApiCall( 'get', `${ PACKAGE_ENDPOINT }/${ id }` );
};

export const createPackage = ( newPackage: PackageInputs ): Promise<IPackage> => {
  return makeApiCall( 'post', PACKAGE_ENDPOINT, newPackage );
};

export const updatePackage = ( pacakgeUpdate: PackageInputs, id: string ): Promise<IPackage> =>
  makeApiCall( 'patch', `${ PACKAGE_ENDPOINT }/${ id }`, pacakgeUpdate );

export const markAsRecived = ( id: string ): Promise<IPackage> =>
  makeApiCall( 'patch', `${ PACKAGE_ENDPOINT }/mark-as-received/${ id }` );

export const deletePackage = ( id: string ): Promise<IPackage> =>
  makeApiCall( 'delete', `${ PACKAGE_ENDPOINT }/${ id }` );


