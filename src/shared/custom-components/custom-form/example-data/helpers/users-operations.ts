import { v4 as uuidv4 } from 'uuid';

import { UserDataExample } from '../interfaces';
import { createEntityStore } from '../data';

const initialUsers: UserDataExample[] = Array.from( { length: 100 }, ( _, i ) => ( {
  id: uuidv4(),
  name: `User ${ i + 1 }`,
  age: 18 + ( i % 10 ),
  rol: i % 3 === 0 ? [ 'user' ] : i % 3 === 1 ? [ 'admin' ] : [ 'instructor' ],
} ) );

export const userStore = createEntityStore( initialUsers );