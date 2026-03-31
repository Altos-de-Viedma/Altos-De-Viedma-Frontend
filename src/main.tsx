import React from 'react';
import ReactDOM from 'react-dom/client';
import { HeroUIProvider } from '@heroui/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { RouterProvider } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import './index.css';
import 'react-toastify/dist/ReactToastify.css';
import { queryClient } from './api';
import { router } from './router/routerConfig';
import { useThemeStore } from './store';
import { useRealTimeData } from './hooks/useRealTimeData';
import { ErrorBoundary } from './shared';

// Componente separado para manejar la conexión en tiempo real
const RealTimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Only enable real-time in production or when VITE_ENABLE_WEBSOCKET is true
  const enableWebSocket = import.meta.env.PROD || import.meta.env.VITE_ENABLE_WEBSOCKET === 'true';

  // Initialize real-time data connection only if enabled
  useRealTimeData({
    enabled: enableWebSocket,
    onConnect: () => {
      console.log('🚀 Real-time connection established');
    },
    onDisconnect: () => {
      console.log('📡 Real-time connection closed');
    },
    onError: () => {
      // Silently handle errors
    },
  });

  return <>{children}</>;
};

const App = () => {
  const { darkMode } = useThemeStore();

  // Apply theme to document element
  React.useEffect(() => {
    const root = document.documentElement;
    if (darkMode === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <React.StrictMode>
      <ErrorBoundary>
        <HeroUIProvider>
          <QueryClientProvider client={queryClient}>
            <ErrorBoundary>
              <RealTimeProvider>
                <main
                  className={`w-full ${darkMode === 'dark' ? 'dark' : 'light'} text-foreground bg-background transition-colors duration-300 ease-in-out min-h-screen`}
                >
                  <ErrorBoundary>
                    <RouterProvider router={router} />
                  </ErrorBoundary>
                  <ToastContainer
                    position="bottom-right"
                    autoClose={4000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme={darkMode === 'dark' ? 'dark' : 'light'}
                    className="toast-container"
                    toastClassName="glass-effect border border-gray-200/50 dark:border-gray-700/50 shadow-large"
                  />
                </main>
              </RealTimeProvider>
            </ErrorBoundary>
            <ReactQueryDevtools />
          </QueryClientProvider>
        </HeroUIProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
