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
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center gap-4">
            <div className="loading-dots text-primary-500">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <p className="text-foreground/60 font-medium">Cargando...</p>
          </div>
        </div>
      }
      unauthenticatedComponent={<Navigate to="/ingresar" replace />}
    >
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-4 lg:gap-2 xl:gap-1.5">
            {filteredCardOptions.map((option, index) => (
              <CardOptionMenu
                key={index}
                title={option.title}
                Icon={option.Icon}
                route={option.route}
                type={option.type}
              />
            ))}
          </div>
        </div>
      </div>
    </CheckAuthStatus>
  );
};