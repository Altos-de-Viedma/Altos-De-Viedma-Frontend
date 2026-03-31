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
    (option.title !== 'Propiedades' || hasOnlyUserRole || user?.roles?.includes('admin') || user?.roles?.includes('security')) &&
    (option.title !== 'Facturas' || !user?.roles?.includes('security'))
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
      <div className="layout-content">
        <div className="ultra-wide">
          {/* Welcome section */}
          <div className="center-flex-col mb-3 sm:mb-4 lg:mb-5">
            <h1 className="responsive-text-xl font-bold text-gray-800 dark:text-gray-200 text-center mb-1">
              Bienvenido, {user?.name || 'Usuario'}
            </h1>
            <p className="responsive-text-sm text-gray-600 dark:text-gray-400 text-center max-w-4xl">
              Selecciona una opción para comenzar a gestionar el sistema
            </p>
          </div>

          {/* Cards grid - perfectly centered regardless of number of items */}
          <div className="w-full flex justify-center">
            <div className="flex flex-wrap justify-center items-start gap-3 sm:gap-4 md:gap-4 lg:gap-5 xl:gap-6 max-w-6xl">
              {filteredCardOptions.map((option, index) => (
                <div key={index} className="flex-shrink-0">
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
      </div>
    </CheckAuthStatus>
  );
};