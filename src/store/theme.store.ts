import { StateCreator, create } from 'zustand';

interface StoreState {
  darkMode: 'dark' | 'light';
  toggleDarkMode: () => void;
}

const createStore: StateCreator<StoreState> = ( set ) => ( {
  darkMode: localStorage.getItem( 'theme' ) === 'dark' ? 'dark' : 'light',
  toggleDarkMode: () =>
    set( ( state ) => {
      const newMode = state.darkMode === 'dark' ? 'light' : 'dark';
      localStorage.setItem( 'theme', newMode );
      return { darkMode: newMode };
    } ),
} );

export const useThemeStore = create<StoreState>( createStore );
