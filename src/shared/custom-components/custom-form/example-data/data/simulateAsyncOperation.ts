import { v4 as uuidv4 } from 'uuid';

type EntityWithId = { id: string; };

const simulateAsyncOperation = async (): Promise<void> => new Promise( resolve => setTimeout( resolve, 100 ) );

export const createEntityStore = <T extends EntityWithId>( initialEntities: T[] ) => {

  const entities: T[] = [ ...initialEntities ];

  const getAll = async (): Promise<T[]> => ( await simulateAsyncOperation(), entities );

  const add = async ( newEntity: Omit<T, 'id'> ): Promise<void> => {
    await simulateAsyncOperation();
    entities.push( { ...newEntity, id: uuidv4() } as T );
  };

  const update = async ( id: string, updatedData: Partial<T> ): Promise<void> => {
    await simulateAsyncOperation();
    const index = entities.findIndex( entity => entity.id === id );
    if ( index !== -1 ) entities[ index ] = { ...entities[ index ], ...updatedData };
  };

  const remove = async ( id: string ): Promise<void> => {
    await simulateAsyncOperation();
    const index = entities.findIndex( entity => entity.id === id );
    if ( index !== -1 ) entities.splice( index, 1 );
  };

  return {
    getAll,
    add,
    update,
    remove
  };
};
