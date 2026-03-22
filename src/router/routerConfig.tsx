import { createBrowserRouter, Navigate } from 'react-router-dom';

import {
  AuthLayout,
  HomePage,
  LoginForm,
  PackagesPage,
  PropertiesPage,
  UsersPage,
  VisitorsPage
} from '../pages';
import { ProtectedRoute } from './ProtectedRoute';
import { EmergenciesPage } from '../pages/emergency';
import { DashboardLayoutPage } from '../pages/dashboard';

export const router = createBrowserRouter( [
  {
    path: '/',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/ingresar" replace />,
      },
      {
        path: 'ingresar',
        element: <LoginForm />,
      }
    ],
  },
  {
    path: '/',
    element: (
      <ProtectedRoute userStatus="authorized" role="user" redirectTo="/">
        <DashboardLayoutPage />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/home" replace />,
      },
      {
        path: 'home',
        element: <HomePage />,
      },
      // {
      //   path: 'notificaciones',
      //   element: <NotificationsPage />,
      // },
      {
        path: 'emergencias',
        element: <EmergenciesPage />,
      },
      {
        path: 'paquetes',
        element: <PackagesPage />,
      },
      {
        path: 'visitantes',
        element: <VisitorsPage />,
      },
      {
        path: 'propiedades',
        element: <PropertiesPage />,
      },
      {
        path: 'usuarios',
        element: (
          <ProtectedRoute userStatus="authorized" role="admin" redirectTo="/home">
            <UsersPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
] );
