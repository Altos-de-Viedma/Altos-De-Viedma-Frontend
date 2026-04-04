import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useWebSocket } from '../services/websocket.service';

interface UseRealTimeDataOptions {
  enabled?: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
}

export const useRealTimeData = (options: UseRealTimeDataOptions = {}) => {
  const { enabled = true, onDisconnect } = options;
  const queryClient = useQueryClient();
  const webSocket = useWebSocket();

  // WebSocket COMPLETELY DISABLED - No more connection attempts
  const shouldConnect = false;

  // Connection management - DISABLED
  const connectWebSocket = useCallback(async () => {
    // WebSocket disabled - do nothing
    console.log('🚫 WebSocket disabled - no real-time updates');
  }, []);

  const disconnectWebSocket = useCallback(() => {
    // WebSocket disabled - do nothing
    onDisconnect?.();
  }, [onDisconnect]);

  // Real-time event handlers - ALL DISABLED
  useEffect(() => {
    // WebSocket completely disabled - no event listeners needed
    console.log('🚫 Real-time data updates disabled');
    return () => {
      // No cleanup needed
    };
  }, [enabled, queryClient, webSocket]);

  // Auto-connect when authenticated - DISABLED
  useEffect(() => {
    // WebSocket disabled - no connection attempts
    return () => {
      // No cleanup needed
    };
  }, [shouldConnect, connectWebSocket, disconnectWebSocket]);

  return {
    connect: connectWebSocket,
    disconnect: disconnectWebSocket,
    isConnected: true, // FAKE - Always return true so UI doesn't block actions
    connectionState: 'connected', // FAKE - Always return connected
    refreshEmergencies: () => {}, // DISABLED
    refreshPackages: () => {}, // DISABLED
    refreshVisitors: () => {}, // DISABLED
    refreshUsers: () => {}, // DISABLED
    refreshProperties: () => {}, // DISABLED
  };
};