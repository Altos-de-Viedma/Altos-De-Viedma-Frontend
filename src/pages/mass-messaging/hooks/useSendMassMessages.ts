import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { IOwnerContact } from '../interfaces';
import { MassMessagingService } from '../services';
import { useAuthStore } from '../../auth/store';

interface UseSendMassMessagesProps {
  onSuccess?: (results: { successful: number; failed: number }) => void;
  onError?: (error: string) => void;
}

export const useSendMassMessages = ({ onSuccess, onError }: UseSendMassMessagesProps = {}) => {
  const { token } = useAuthStore();
  const [progress, setProgress] = useState({ sent: 0, total: 0, currentRecipient: '' });
  const [isActive, setIsActive] = useState(false);

  const mutation = useMutation({
    mutationFn: async ({ message, recipients }: { message: string; recipients: IOwnerContact[] }) => {
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      setIsActive(true);
      setProgress({ sent: 0, total: recipients.length, currentRecipient: '' });

      const results = await MassMessagingService.sendMassMessages(
        message,
        recipients,
        token,
        (sent, total, currentRecipient) => {
          setProgress({ sent, total, currentRecipient });
        }
      );

      return results;
    },
    onSuccess: (results) => {
      setIsActive(false);

      if (results.successful > 0) {
        toast.success(
          `Mensajes enviados: ${results.successful} exitosos, ${results.failed} fallidos`,
          { autoClose: 6000 }
        );
      }

      if (results.failed > 0) {
        toast.warning(
          `${results.failed} mensajes no pudieron ser enviados`,
          { autoClose: 8000 }
        );
      }

      onSuccess?.(results);
    },
    onError: (error: Error) => {
      setIsActive(false);
      const errorMessage = error.message || 'Error al enviar mensajes';
      toast.error(errorMessage);
      onError?.(errorMessage);
    },
  });

  return {
    sendMassMessages: mutation.mutate,
    isLoading: mutation.isPending,
    isActive,
    progress,
    error: mutation.error,
    reset: mutation.reset,
  };
};