import { Navigate } from 'react-router-dom';

import { CardOptionMenu } from '../../dashboard/components';
import { cardOptions } from '../../dashboard/helpers';
import { CheckAuthStatus } from '../../../shared/helpers';
import { useAuthStore } from '../../auth';
import { UserCard } from '../components';

export const HomePage: React.FC = () => {
  const { user } = useAuthStore( ( state ) => ( {
    user: state.user,
  } ) );

  const hasOnlyUserRole = user?.roles?.length === 1 && user?.roles?.includes( 'user' );

  const filteredCardOptions = cardOptions.filter( ( option ) =>
    ( option.title !== 'Usuarios' || user?.roles?.includes( 'admin' ) ) &&
    ( option.title !== 'Propiedades' || hasOnlyUserRole || user?.roles?.includes( 'admin' ) || user?.roles?.includes( 'security' ) )
  );

  return (
    <CheckAuthStatus
      loadingComponent={ <div>Cargando...</div> }
      unauthenticatedComponent={ <Navigate to="/ingresar" replace /> }
    >
      <div className="md:p-4 flex flex-col items-center">
        <UserCard />
        <div className="flex flex-1 justify-center items-center mt-4">
          <div className="flex flex-wrap justify-center items-center gap-4">
            { filteredCardOptions.map( ( option, index ) => (
              <CardOptionMenu
                key={ index }
                title={ option.title }
                Icon={ option.Icon }
                route={ option.route }
                type={ option.type }
              />
            ) ) }
          </div>
        </div>
      </div>
    </CheckAuthStatus>
  );
};