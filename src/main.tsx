import React from 'react';
import ReactDOM from 'react-dom/client';
import { NextUIProvider } from '@nextui-org/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import './index.css';
import { queryClient } from './api';
import { router } from './router/routerConfig';
import { useThemeStore } from './store';

const App = () => {
  
  const { darkMode } = useThemeStore();

  return (
    <React.StrictMode>
      <NextUIProvider>
        <QueryClientProvider client={ queryClient }>
          <main
            className={ `w-full ${ darkMode === 'dark' ? 'dark' : '' } text-foreground bg-background transition-theme duration-500 ease-in-out min-h-screen` }
          >
            <RouterProvider router={ router } />
            <ToastContainer position="bottom-right" />
          </main>
          <ReactQueryDevtools />
        </QueryClientProvider>
      </NextUIProvider>
    </React.StrictMode>
  );
};

ReactDOM.createRoot( document.getElementById( 'root' )! ).render( <App /> );
