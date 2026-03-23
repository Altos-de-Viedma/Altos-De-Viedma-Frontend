import { useCallback } from 'react';

export const useWhatsApp = () => {
  const generateWhatsAppLink = useCallback((phoneNumber: string) => {
    return (
      <a
        href={`https://wa.me/${phoneNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        className="cursor-pointer text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline transition-colors"
      >
        {phoneNumber}
      </a>
    );
  }, []);

  return { generateWhatsAppLink };
};
