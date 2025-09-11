
export type rolesExample = 'admin' | 'user' |'instructor';

export interface UserDataExample {
  id:   string;  
  name: string;
  age:  number;
  rol:  rolesExample[];
}
