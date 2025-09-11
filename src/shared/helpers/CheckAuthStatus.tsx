import { Navigate } from 'react-router-dom';

import { useAuthStatus } from '../../pages/auth/hooks';
import { useAuthStore } from '../../pages/auth/store';


interface AuthCheckProps {
  loadingComponent: React.ReactElement;
  unauthenticatedComponent: React.ReactElement;
  children: React.ReactElement;
}

export const CheckAuthStatus: React.FC<AuthCheckProps> = ( { loadingComponent, children } ) => {

  const { isAuthenticated, isLoading } = useAuthStatus();
  const { logoutUser } = useAuthStore();

  if ( isLoading ) {
    return loadingComponent;
  }

  if ( !isAuthenticated ) {
    logoutUser();
    return <Navigate to="/ingresar" replace />;
  }

  return children;
};
