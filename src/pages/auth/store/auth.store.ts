import { StateCreator, create }   from 'zustand';
import { devtools, persist }      from 'zustand/middleware';

import { AuthStatus, User }       from '../interfaces';
import { AuthService }            from '../services';


export interface AuthState {
  status:           AuthStatus;
  token?:           string;
  user?:            User;

  loginUser:        (username: string, password: string) => Promise<void>;
  checkAuthStatus:  () => Promise<void>;
  logoutUser:       () => void;
  setCredentials:   (token: string, user: User) => void;
}

const storeApi: StateCreator<AuthState> = (set) => ({
  status:           'pending',
  token:            undefined,
  user:             undefined,

  loginUser: async (username: string, password: string) => {
    try {
      const { token, user } = await AuthService.login(username, password);
      set({ status: 'authorized', token, user });
    } catch (error) {
      set({ status: 'unauthorized', token: undefined, user: undefined });
      throw 'Unauthorized';
    }
  },

  checkAuthStatus: async () => {
    try {
      const { token, user } = await AuthService.checkStatus();
      set({ status: 'authorized', token, user });
    } catch (error) {
      set({ status: 'unauthorized', token: undefined, user: undefined });
    }
  },

  logoutUser: () => {
    set({ status: 'unauthorized', token: undefined, user: undefined });
  },

  setCredentials: (token: string, user: User) => {
    set({ status: 'authorized', token, user });
  },
});

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      storeApi,
      { name: 'auth-storage' }
    )
  )
);
