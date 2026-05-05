import { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { useAuthStore } from '../pages/auth/store';
import { AuthStatus } from '../pages/auth/interfaces';

interface ProtectedRouteProps {
  children?: ReactNode;
  userStatus: AuthStatus;
  role: string;
  redirectTo?: string;
  excludeRoles?: string[];
}

export const ProtectedRoute = ( { children, userStatus, role, redirectTo = "/", excludeRoles = [] }: ProtectedRouteProps ) => {

  const { status, user } = useAuthStore();

  // Check if user has any excluded roles
  const hasExcludedRole = excludeRoles.length > 0 && user?.roles?.some(userRole => excludeRoles.includes(userRole));

  if ( status !== userStatus || !user?.roles.includes( role ) || hasExcludedRole ) {
    return <Navigate to={ redirectTo } />;
  }

  return children ? children : <Outlet />;

};
