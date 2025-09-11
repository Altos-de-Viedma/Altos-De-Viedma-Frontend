import { altosDeViedmaApi, apiCall } from '../../../api';
import { IVisitor } from '../interfaces/IVisitor';
import { VisitorInputs } from '../validators';



const VISITOR_ENDPOINT = '/visitor';

const makeApiCall = <T>( method: 'get' | 'post' | 'patch' | 'delete', endpoint: string, data?: any ): Promise<T> =>
  apiCall( `${ method.toUpperCase() } ${ endpoint }`, () => altosDeViedmaApi[ method ]<T>( endpoint, data ) );

makeApiCall( 'get', VISITOR_ENDPOINT );

export const getVisitors = (): Promise<IVisitor[]> =>
  makeApiCall( 'get', VISITOR_ENDPOINT );

export const getVisitorById = ( visitorId: string ): Promise<IVisitor> => {
  if ( !visitorId ) return Promise.reject( new Error( 'Visitor ID is required' ) );
  return makeApiCall( 'get', `${ VISITOR_ENDPOINT }/${ visitorId }` );
};

export const createVisitor = ( newVisitor: VisitorInputs ): Promise<IVisitor> => {
  return makeApiCall( 'post', `${ VISITOR_ENDPOINT }`, newVisitor );
};

export const updateVisitor = ( visitorUpdate: VisitorInputs, id: string ): Promise<IVisitor> =>
  makeApiCall( 'patch', `${ VISITOR_ENDPOINT }/${ id }`, visitorUpdate );

export const visitCompleted = ( id: string ): Promise<IVisitor> =>
  makeApiCall( 'patch', `${ VISITOR_ENDPOINT }/visit-completed/${ id }` );

export const deleteVisitor = ( visitorId: string ): Promise<IVisitor> =>
  makeApiCall( 'delete', `${ VISITOR_ENDPOINT }/${ visitorId }` );
