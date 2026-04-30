import { PaymentStatus } from '../interfaces/IMonthlyPayment';

export const PAYMENT_STATUS_LABELS = {
  [PaymentStatus.PENDING]: 'Pendiente',
  [PaymentStatus.PAID]: 'Pagado',
  [PaymentStatus.PARTIAL]: 'Parcial',
  [PaymentStatus.OVERDUE]: 'Vencido'
};

export const PAYMENT_STATUS_COLORS = {
  [PaymentStatus.PENDING]: 'warning',
  [PaymentStatus.PAID]: 'success',
  [PaymentStatus.PARTIAL]: 'primary',
  [PaymentStatus.OVERDUE]: 'danger'
} as const;

export const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('es-AR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getCurrentMonth = (): { year: number; month: number } => {
  const now = new Date();
  return {
    year: now.getFullYear(),
    month: now.getMonth() + 1
  };
};

export const getMonthYearString = (year: number, month: number): string => {
  return `${MONTH_NAMES[month - 1]} ${year}`;
};