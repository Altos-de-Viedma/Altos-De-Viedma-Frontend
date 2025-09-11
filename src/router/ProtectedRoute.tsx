import { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { useAuthStore } from '../pages/auth/store';
import { AuthStatus } from '../pages/auth/interfaces';

interface ProtectedRouteProps {
  children?: ReactNode;
  userStatus: AuthStatus;
  role: string;
  redirectTo?: string;
}

export const ProtectedRoute = ( { children, userStatus, role, redirectTo = "/" }: ProtectedRouteProps ) => {

  const { status, user } = useAuthStore();
  
  if ( status !== userStatus || !user?.roles.includes( role ) ) {
    return <Navigate to={ redirectTo } />;
  }

  return children ? children : <Outlet />;

};
