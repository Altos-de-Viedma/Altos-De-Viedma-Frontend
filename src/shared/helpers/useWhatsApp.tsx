import { useCallback } from 'react';

export const useWhatsApp = () => {
  const generateWhatsAppLink = useCallback((phoneNumber: string) => {
    return (
      <a
        href={`https://wa.me/${phoneNumber}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}
      >
        {phoneNumber}
      </a>
    );
  }, []);

  return { generateWhatsAppLink };
};
