import { useEffect } from 'react';
import { IoHomeOutline } from 'react-icons/io5';
import { Outlet } from 'react-router-dom';

import { IconContainer, UI, useRedirect } from '../../../shared';
import { useAuthStore } from '../store';

export const AuthLayout = () => {
  const { redirectTo } = useRedirect();
  const { status } = useAuthStore();

  useEffect(() => {
    if (status === 'authorized') {
      redirectTo('/home');
    }
  }, [status, redirectTo]);

  return (
    <div className="auth-container">
      {/* Background with responsive gradient */}
      <div className="absolute inset-0 z-0 bg-gradient-animated safe-area" aria-hidden="true"></div>

      {/* Main content - perfectly centered */}
      <main className="absolute inset-0 z-20 center-flex safe-area">
        <div className="auth-content">
          <UI.Card className="corporate-card-responsive shadow-2xl border border-gray-200 dark:border-gray-700 backdrop-blur-sm w-full max-w-md">
            <UI.CardHeader className="center-flex-col cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-t-lg responsive-padding-sm"
              onClick={() => redirectTo('/ingresar')}
              role="button"
              tabIndex={0}
              aria-label="Ir a página de inicio de sesión"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  redirectTo('/ingresar');
                }
              }}
            >
              <IconContainer className="mb-2">
                <IoHomeOutline
                  size={32}
                  className="text-primary-600 dark:text-primary-400"
                  aria-hidden="true"
                />
              </IconContainer>
              <h1 className="responsive-text-xl font-bold text-gray-800 dark:text-gray-200 text-center">
                Altos de Viedma
              </h1>
            </UI.CardHeader>

            <UI.CardBody className="responsive-padding">
              <Outlet />
            </UI.CardBody>
          </UI.Card>
        </div>
      </main>
    </div>
  );
};
