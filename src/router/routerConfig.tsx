import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';

import { AuthLayout, LoginForm } from '../pages';
import { ProtectedRoute } from './ProtectedRoute';

// Lazy load components for better performance
const HomePage = lazy(() => import('../pages/home/pages/HomePage').then(m => ({ default: m.HomePage })));
const PackagesPage = lazy(() => import('../pages/package/pages/PackagesPage').then(m => ({ default: m.PackagesPage })));
const PropertiesPage = lazy(() => import('../pages/property/pages/PropertiesPage').then(m => ({ default: m.PropertiesPage })));
const UsersPage = lazy(() => import('../pages/users/pages/UsersPage').then(m => ({ default: m.UsersPage })));
const VisitorsPage = lazy(() => import('../pages/visitor/pages/VisitorsPage').then(m => ({ default: m.VisitorsPage })));
const EmergenciesPage = lazy(() => import('../pages/emergency/pages/EmergenciesPage').then(m => ({ default: m.EmergenciesPage })));
const InvoicePage = lazy(() => import('../pages/invoice/pages/InvoicePage').then(m => ({ default: m.InvoicePage })));
const CashPage = lazy(() => import('../pages/cash/pages/CashPage').then(m => ({ default: m.CashPage })));
const MonthlyPaymentsPage = lazy(() => import('../pages/monthly-payments/MonthlyPaymentsPage').then(m => ({ default: m.MonthlyPaymentsPage })));
const EmployeeInsurancePage = lazy(() => import('../pages/employee-insurance/pages/EmployeeInsurancePage').then(m => ({ default: m.EmployeeInsurancePage })));
const MassMessagingPage = lazy(() => import('../pages/mass-messaging/pages/MassMessagingPage').then(m => ({ default: m.MassMessagingPage })));
const DashboardLayoutPage = lazy(() => import('../pages/dashboard/dashboard-layout/DashboardPage').then(m => ({ default: m.DashboardLayoutPage })));

// Loading component
const PageLoader = () => (
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
);

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
        <Suspense fallback={<PageLoader />}>
          <DashboardLayoutPage />
        </Suspense>
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/home" replace />,
      },
      {
        path: 'home',
        element: (
          <Suspense fallback={<PageLoader />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: 'emergencias',
        element: (
          <Suspense fallback={<PageLoader />}>
            <EmergenciesPage />
          </Suspense>
        ),
      },
      {
        path: 'paquetes',
        element: (
          <Suspense fallback={<PageLoader />}>
            <PackagesPage />
          </Suspense>
        ),
      },
      {
        path: 'visitantes',
        element: (
          <Suspense fallback={<PageLoader />}>
            <VisitorsPage />
          </Suspense>
        ),
      },
      {
        path: 'propiedades',
        element: (
          <Suspense fallback={<PageLoader />}>
            <PropertiesPage />
          </Suspense>
        ),
      },
      {
        path: 'facturas',
        element: (
          <ProtectedRoute userStatus="authorized" role="user" redirectTo="/home" excludeRoles={['security']}>
            <Suspense fallback={<PageLoader />}>
              <InvoicePage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'caja',
        element: (
          <ProtectedRoute userStatus="authorized" role="user" redirectTo="/home" excludeRoles={['security']}>
            <Suspense fallback={<PageLoader />}>
              <CashPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'pagos-mensuales',
        element: (
          <ProtectedRoute userStatus="authorized" role="user" redirectTo="/home" excludeRoles={['security']}>
            <Suspense fallback={<PageLoader />}>
              <MonthlyPaymentsPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'seguros-empleados',
        element: (
          <Suspense fallback={<PageLoader />}>
            <EmployeeInsurancePage />
          </Suspense>
        ),
      },
      {
        path: 'usuarios',
        element: (
          <ProtectedRoute userStatus="authorized" role="admin" redirectTo="/home">
            <Suspense fallback={<PageLoader />}>
              <UsersPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
      {
        path: 'mensajes-masivos',
        element: (
          <ProtectedRoute userStatus="authorized" role="admin" redirectTo="/home">
            <Suspense fallback={<PageLoader />}>
              <MassMessagingPage />
            </Suspense>
          </ProtectedRoute>
        ),
      },
    ],
  },
] );
