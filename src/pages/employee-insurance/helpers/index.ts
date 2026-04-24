export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('es-AR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleString('es-AR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const isExpiringSoon = (expirationDate: Date | string, days: number = 30): boolean => {
  const expDate = typeof expirationDate === 'string' ? new Date(expirationDate) : expirationDate;
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + days);

  return expDate >= today && expDate <= futureDate;
};

export const isExpired = (expirationDate: Date | string): boolean => {
  const expDate = typeof expirationDate === 'string' ? new Date(expirationDate) : expirationDate;
  return new Date() > expDate;
};

export const getDaysUntilExpiration = (expirationDate: Date | string): number => {
  const expDate = typeof expirationDate === 'string' ? new Date(expirationDate) : expirationDate;
  const today = new Date();
  const diffTime = expDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};