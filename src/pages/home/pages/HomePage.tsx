import { Navigate } from 'react-router-dom';

import { CardOptionMenu } from '../../dashboard/components';
import { cardOptions } from '../../dashboard/helpers';
import { CheckAuthStatus } from '../../../shared/helpers';
import { useAuthStore } from '../../auth';

export const HomePage: React.FC = () => {
  const { user } = useAuthStore((state) => ({
    user: state.user,
  }));

  const hasOnlyUserRole = user?.roles?.length === 1 && user?.roles?.includes('user');

  const filteredCardOptions = cardOptions.filter((option) =>
    (option.title !== 'Usuarios' || user?.roles?.includes('admin')) &&
    (option.title !== 'Propiedades' || hasOnlyUserRole || user?.roles?.includes('admin') || user?.roles?.includes('security'))
  );

  return (
    <CheckAuthStatus
      loadingComponent={
        <div className="mobile-center">
          <div className="center-flex-col gap-4 responsive-padding">
            <div className="loading-dots text-primary-500">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <p className="responsive-text-base text-foreground/60 font-medium text-center">
              Cargando...
            </p>
          </div>
        </div>
      }
      unauthenticatedComponent={<Navigate to="/ingresar" replace />}
    >
      <div className="layout-content bg-gray-50 dark:bg-gray-900">
        <div className="wide-container pt-2 sm:pt-3 md:pt-4 px-3 sm:px-4 md:px-4 lg:px-4 xl:px-6 2xl:px-8">
          {/* Welcome section */}
          <div className="center-flex-col mb-3 sm:mb-4 lg:mb-5">
            <h1 className="responsive-text-xl font-bold text-gray-800 dark:text-gray-200 text-center mb-1">
              Bienvenido, {user?.name || 'Usuario'}
            </h1>
            <p className="responsive-text-sm text-gray-600 dark:text-gray-400 text-center max-w-4xl">
              Selecciona una opción para comenzar a gestionar el sistema
            </p>
          </div>

          {/* Cards grid - perfectly centered and responsive with more space on desktop */}
          <div className="dashboard-grid">
            {filteredCardOptions.map((option, index) => (
              <div key={index} className="center-flex w-full">
                <CardOptionMenu
                  title={option.title}
                  Icon={option.Icon}
                  route={option.route}
                  type={option.type}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </CheckAuthStatus>
  );
};