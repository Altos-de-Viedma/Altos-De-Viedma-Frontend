import { toast } from 'react-toastify';

class NotificationService {
  // Emergency notifications
  emergencyCreated() {
    toast.info('Nueva emergencia reportada', {
      position: 'bottom-right',
      autoClose: 5000,
    });
  }

  emergencyEnded() {
    toast.success('Emergencia finalizada', {
      position: 'bottom-right',
      autoClose: 3000,
    });
  }

  // Package notifications
  packageCreated() {
    toast.info('Nuevo paquete registrado', {
      position: 'bottom-right',
      autoClose: 4000,
    });
  }

  packageReceived() {
    toast.success('Paquete entregado', {
      position: 'bottom-right',
      autoClose: 3000,
    });
  }

  // Visitor notifications
  visitorCreated() {
    toast.info('Nuevo visitante registrado', {
      position: 'bottom-right',
      autoClose: 4000,
    });
  }

  visitorCompleted() {
    toast.success('Visita completada', {
      position: 'bottom-right',
      autoClose: 3000,
    });
  }

  // User notifications
  userCreated() {
    toast.info('Nuevo usuario registrado', {
      position: 'bottom-right',
      autoClose: 4000,
    });
  }

  // Property notifications
  propertyCreated() {
    toast.info('Nueva propiedad registrada', {
      position: 'bottom-right',
      autoClose: 4000,
    });
  }

  // Generic success/error notifications
  success(message: string) {
    toast.success(message, {
      position: 'bottom-right',
      autoClose: 3000,
    });
  }

  error(message: string) {
    toast.error(message, {
      position: 'bottom-right',
      autoClose: 5000,
    });
  }

  info(message: string) {
    toast.info(message, {
      position: 'bottom-right',
      autoClose: 4000,
    });
  }
}

// Create singleton instance
export const notificationService = new NotificationService();

// React hook for notifications
export const useNotifications = () => {
  return {
    emergencyCreated: notificationService.emergencyCreated.bind(notificationService),
    emergencyEnded: notificationService.emergencyEnded.bind(notificationService),
    packageCreated: notificationService.packageCreated.bind(notificationService),
    packageReceived: notificationService.packageReceived.bind(notificationService),
    visitorCreated: notificationService.visitorCreated.bind(notificationService),
    visitorCompleted: notificationService.visitorCompleted.bind(notificationService),
    userCreated: notificationService.userCreated.bind(notificationService),
    propertyCreated: notificationService.propertyCreated.bind(notificationService),
    success: notificationService.success.bind(notificationService),
    error: notificationService.error.bind(notificationService),
    info: notificationService.info.bind(notificationService),
  };
};