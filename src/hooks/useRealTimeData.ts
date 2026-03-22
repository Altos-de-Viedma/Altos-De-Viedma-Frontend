import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useWebSocket } from '../services/websocket.service';
import { useAuthStore } from '../pages/auth';

interface UseRealTimeDataOptions {
  enabled?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
}

export const useRealTimeData = (options: UseRealTimeDataOptions = {}) => {
  const { enabled = true, onConnect, onDisconnect, onError } = options;
  const queryClient = useQueryClient();
  const webSocket = useWebSocket();
  const { token, status } = useAuthStore();

  const isAuthenticated = status === 'authorized';

  // Completely disable WebSocket in development unless explicitly enabled
  const shouldConnect = enabled && isAuthenticated && token && (
    import.meta.env.PROD ||
    import.meta.env.VITE_ENABLE_WEBSOCKET === 'true'
  );

  // Connection management
  const connectWebSocket = useCallback(async () => {
    if (!shouldConnect) return;

    // Check if already connected or connecting
    const connectionState = webSocket.getConnectionState();
    if (connectionState === 'connected' || connectionState === 'connecting') {
      return;
    }

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
      await webSocket.connect({
        url: backendUrl,
        token: token,
      });
      onConnect?.();
    } catch (error) {
      console.warn('⚠️ Real-time connection failed');
      onError?.(error);
    }
  }, [shouldConnect, webSocket, token, onConnect, onError]);

  const disconnectWebSocket = useCallback(() => {
    webSocket.disconnect();
    onDisconnect?.();
  }, [webSocket, onDisconnect]);

  // Real-time event handlers
  useEffect(() => {
    if (!enabled) return;

    // Emergency events
    const handleEmergencyCreated = (emergency: any) => {
      queryClient.invalidateQueries({ queryKey: ['emergencies'] });
      queryClient.setQueryData(['emergencies'], (oldData: any) => {
        if (!oldData) return [emergency];
        return [emergency, ...oldData];
      });
    };

    const handleEmergencyUpdated = (emergency: any) => {
      queryClient.invalidateQueries({ queryKey: ['emergencies'] });
      queryClient.setQueryData(['emergencies'], (oldData: any[]) => {
        if (!oldData) return [emergency];
        return oldData.map(item => item.id === emergency.id ? emergency : item);
      });
    };

    const handleEmergencyEnded = (emergency: any) => {
      queryClient.invalidateQueries({ queryKey: ['emergencies'] });
      queryClient.setQueryData(['emergencies'], (oldData: any[]) => {
        if (!oldData) return [];
        return oldData.map(item => item.id === emergency.id ? emergency : item);
      });
    };

    // Package events
    const handlePackageCreated = (packageData: any) => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      queryClient.setQueryData(['packages'], (oldData: any) => {
        if (!oldData) return [packageData];
        return [packageData, ...oldData];
      });
    };

    const handlePackageUpdated = (packageData: any) => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      queryClient.setQueryData(['packages'], (oldData: any[]) => {
        if (!oldData) return [packageData];
        return oldData.map(item => item.id === packageData.id ? packageData : item);
      });
    };

    const handlePackageReceived = (packageData: any) => {
      queryClient.invalidateQueries({ queryKey: ['packages'] });
      queryClient.setQueryData(['packages'], (oldData: any[]) => {
        if (!oldData) return [];
        return oldData.map(item => item.id === packageData.id ? packageData : item);
      });
    };

    // Visitor events
    const handleVisitorCreated = (visitor: any) => {
      queryClient.invalidateQueries({ queryKey: ['visitors'] });
      queryClient.setQueryData(['visitors'], (oldData: any) => {
        if (!oldData) return [visitor];
        return [visitor, ...oldData];
      });
    };

    const handleVisitorUpdated = (visitor: any) => {
      queryClient.invalidateQueries({ queryKey: ['visitors'] });
      queryClient.setQueryData(['visitors'], (oldData: any[]) => {
        if (!oldData) return [visitor];
        return oldData.map(item => item.id === visitor.id ? visitor : item);
      });
    };

    const handleVisitorCompleted = (visitor: any) => {
      queryClient.invalidateQueries({ queryKey: ['visitors'] });
      queryClient.setQueryData(['visitors'], (oldData: any[]) => {
        if (!oldData) return [];
        return oldData.map(item => item.id === visitor.id ? visitor : item);
      });
    };

    // User events
    const handleUserCreated = (user: any) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.setQueryData(['users'], (oldData: any) => {
        if (!oldData) return [user];
        return [user, ...oldData];
      });
    };

    const handleUserUpdated = (user: any) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      queryClient.setQueryData(['users'], (oldData: any[]) => {
        if (!oldData) return [user];
        return oldData.map(item => item.id === user.id ? user : item);
      });
    };

    // Property events
    const handlePropertyCreated = (property: any) => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.setQueryData(['properties'], (oldData: any) => {
        if (!oldData) return [property];
        return [property, ...oldData];
      });
    };

    const handlePropertyUpdated = (property: any) => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.setQueryData(['properties'], (oldData: any[]) => {
        if (!oldData) return [property];
        return oldData.map(item => item.id === property.id ? property : item);
      });
    };

    // Register event listeners
    webSocket.on('emergency-created', handleEmergencyCreated);
    webSocket.on('emergency-updated', handleEmergencyUpdated);
    webSocket.on('emergency-ended', handleEmergencyEnded);
    webSocket.on('package-created', handlePackageCreated);
    webSocket.on('package-updated', handlePackageUpdated);
    webSocket.on('package-received', handlePackageReceived);
    webSocket.on('visitor-created', handleVisitorCreated);
    webSocket.on('visitor-updated', handleVisitorUpdated);
    webSocket.on('visitor-completed', handleVisitorCompleted);
    webSocket.on('user-created', handleUserCreated);
    webSocket.on('user-updated', handleUserUpdated);
    webSocket.on('property-created', handlePropertyCreated);
    webSocket.on('property-updated', handlePropertyUpdated);

    // Cleanup event listeners
    return () => {
      webSocket.off('emergency-created', handleEmergencyCreated);
      webSocket.off('emergency-updated', handleEmergencyUpdated);
      webSocket.off('emergency-ended', handleEmergencyEnded);
      webSocket.off('package-created', handlePackageCreated);
      webSocket.off('package-updated', handlePackageUpdated);
      webSocket.off('package-received', handlePackageReceived);
      webSocket.off('visitor-created', handleVisitorCreated);
      webSocket.off('visitor-updated', handleVisitorUpdated);
      webSocket.off('visitor-completed', handleVisitorCompleted);
      webSocket.off('user-created', handleUserCreated);
      webSocket.off('user-updated', handleUserUpdated);
      webSocket.off('property-created', handlePropertyCreated);
      webSocket.off('property-updated', handlePropertyUpdated);
    };
  }, [enabled, queryClient, webSocket]);

  // Auto-connect when authenticated
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (shouldConnect) {
      // Debounce connection attempts to prevent rapid reconnections
      timeoutId = setTimeout(() => {
        connectWebSocket();
      }, 100);
    } else {
      disconnectWebSocket();
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      disconnectWebSocket();
    };
  }, [shouldConnect, connectWebSocket, disconnectWebSocket]);

  return {
    connect: connectWebSocket,
    disconnect: disconnectWebSocket,
    isConnected: webSocket.isConnected(),
    connectionState: webSocket.getConnectionState(),
    refreshEmergencies: webSocket.refreshEmergencies,
    refreshPackages: webSocket.refreshPackages,
    refreshVisitors: webSocket.refreshVisitors,
    refreshUsers: webSocket.refreshUsers,
    refreshProperties: webSocket.refreshProperties,
  };
};