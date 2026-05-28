import { format, isValid } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date: Date | string): string => {
  if (!date) return 'Fecha inválida';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (!isValid(dateObj)) return 'Fecha inválida';

  return format(dateObj, 'dd/MM/yyyy', { locale: es });
};

export const formatDateTime = (date: Date | string): string => {
  if (!date) return 'Fecha inválida';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (!isValid(dateObj)) return 'Fecha inválida';

  return format(dateObj, 'dd/MM/yyyy HH:mm', { locale: es });
};

export const formatDateForInput = (date: Date | string): string => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (!isValid(dateObj)) return '';

  return format(dateObj, 'yyyy-MM-dd');
};

export const isToday = (date: Date | string): boolean => {
  if (!date) return false;

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (!isValid(dateObj)) return false;

  const today = new Date();

  return dateObj.getDate() === today.getDate() &&
         dateObj.getMonth() === today.getMonth() &&
         dateObj.getFullYear() === today.getFullYear();
};

export const getArgentinaToday = (): string => {
  // Get current date in Argentina timezone
  const now = new Date();
  const argentinaOffset = -3; // UTC-3
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const argentinaTime = new Date(utc + (argentinaOffset * 3600000));

  return formatDateForInput(argentinaTime);
};