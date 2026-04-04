import { io, Socket } from 'socket.io-client';
import { toast } from 'react-toastify';

interface WebSocketConfig {
  url: string;
  token?: string;
}

class WebSocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private isConnecting = false;
  private listeners: Map<string, Function[]> = new Map();
  private connectionPromise: Promise<void> | null = null;

  constructor() {
    // Constructor vacío - la configuración se hace en connect()
  }

  connect(config: WebSocketConfig): Promise<void> {
    // Return existing connection promise if already connecting
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    if (this.socket?.connected) {
      return Promise.resolve();
    }

    this.connectionPromise = new Promise((resolve, reject) => {
      this.isConnecting = true;

      try {
        // Disconnect existing socket if any
        if (this.socket) {
          this.socket.disconnect();
          this.socket = null;
        }

        this.socket = io(config.url, {
          transports: ['websocket'],
          upgrade: false,
          timeout: 20000,
          forceNew: true,
          autoConnect: true,
          reconnection: true,
          reconnectionAttempts: 3,
          reconnectionDelay: 2000,
          extraHeaders: {
            authentication: config.token || '',
          },
        });

        this.socket.on('connect', () => {
          console.log('✅ WebSocket connected successfully');
          this.isConnecting = false;
          this.reconnectAttempts = 0;
          this.connectionPromise = null;

          toast.success('Conexión en tiempo real establecida', {
            position: 'bottom-right',
            autoClose: 3000,
            hideProgressBar: true,
          });

          resolve();
        });

        this.socket.on('connect_error', (error) => {
          console.warn('⚠️ WebSocket connection failed - backend server may not be running');
          this.isConnecting = false;
          this.connectionPromise = null;

          // Don't show error toasts for connection failures in development
          if (import.meta.env.MODE === 'production') {
            this.handleReconnection();
          }

          reject(error);
        });

        this.socket.on('disconnect', (reason) => {
          console.warn('⚠️ WebSocket disconnected:', reason);
          this.isConnecting = false;
          this.connectionPromise = null;

          if (reason === 'io server disconnect') {
            // Server disconnected, try to reconnect
            this.handleReconnection();
          }
        });

        // Real-time data update events
        this.socket.on('emergency-created', (emergency) => {
          this.emit('emergency-created', emergency);
          toast.info('Nueva emergencia reportada', {
            position: 'bottom-right',
            autoClose: 5000,
          });
        });

        this.socket.on('emergency-updated', (emergency) => {
          this.emit('emergency-updated', emergency);
        });

        this.socket.on('emergency-ended', (emergency) => {
          this.emit('emergency-ended', emergency);
          toast.success('Emergencia finalizada', {
            position: 'bottom-right',
            autoClose: 3000,
          });
        });

        this.socket.on('package-created', (packageData) => {
          this.emit('package-created', packageData);
          toast.info('Nuevo paquete registrado', {
            position: 'bottom-right',
            autoClose: 4000,
          });
        });

        this.socket.on('package-updated', (packageData) => {
          this.emit('package-updated', packageData);
        });

        this.socket.on('package-received', (packageData) => {
          this.emit('package-received', packageData);
          toast.success('Paquete entregado', {
            position: 'bottom-right',
            autoClose: 3000,
          });
        });

        this.socket.on('visitor-created', (visitor) => {
          this.emit('visitor-created', visitor);
          toast.info('Nuevo visitante registrado', {
            position: 'bottom-right',
            autoClose: 4000,
          });
        });

        this.socket.on('visitor-updated', (visitor) => {
          this.emit('visitor-updated', visitor);
        });

        this.socket.on('visitor-completed', (visitor) => {
          this.emit('visitor-completed', visitor);
          toast.success('Visita completada', {
            position: 'bottom-right',
            autoClose: 3000,
          });
        });

        this.socket.on('user-created', (user) => {
          this.emit('user-created', user);
          toast.info('Nuevo usuario registrado', {
            position: 'bottom-right',
            autoClose: 4000,
          });
        });

        this.socket.on('user-updated', (user) => {
          this.emit('user-updated', user);
        });

        this.socket.on('property-created', (property) => {
          this.emit('property-created', property);
          toast.info('Nueva propiedad registrada', {
            position: 'bottom-right',
            autoClose: 4000,
          });
        });

        this.socket.on('property-updated', (property) => {
          this.emit('property-updated', property);
        });

      } catch (error) {
        this.isConnecting = false;
        this.connectionPromise = null;
        reject(error);
      }
    });

    return this.connectionPromise;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
      this.connectionPromise = null;
      this.isConnecting = false;
      console.log('🔌 WebSocket disconnected manually');
    }
  }

  private handleReconnection(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('❌ Max reconnection attempts reached');
      toast.error('No se pudo restablecer la conexión en tiempo real', {
        position: 'bottom-right',
        autoClose: 5000,
      });
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    console.log(`🔄 Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    setTimeout(() => {
      if (this.socket && !this.socket.connected) {
        this.socket.connect();
      }
    }, delay);
  }

  sendMessage(message: string): void {
    if (this.socket?.connected) {
      this.socket.emit('message-from-client', { message });
    } else {
      console.warn('⚠️ Cannot send message: WebSocket not connected');
    }
  }

  // Event listener management
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  off(event: string, callback?: Function): void {
    if (!this.listeners.has(event)) return;

    if (callback) {
      const callbacks = this.listeners.get(event)!;
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    } else {
      this.listeners.delete(event);
    }
  }

  private emit(event: string, data: any): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in WebSocket event callback for ${event}:`, error);
        }
      });
    }
  }

  // Utility methods
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getConnectionState(): string {
    if (!this.socket) return 'disconnected';
    if (this.isConnecting) return 'connecting';
    return this.socket.connected ? 'connected' : 'disconnected';
  }

  // Real-time data refresh triggers
  refreshEmergencies(): void {
    if (this.socket?.connected) {
      this.socket.emit('refresh-emergencies');
    }
  }

  refreshPackages(): void {
    if (this.socket?.connected) {
      this.socket.emit('refresh-packages');
    }
  }

  refreshVisitors(): void {
    if (this.socket?.connected) {
      this.socket.emit('refresh-visitors');
    }
  }

  refreshUsers(): void {
    if (this.socket?.connected) {
      this.socket.emit('refresh-users');
    }
  }

  refreshProperties(): void {
    if (this.socket?.connected) {
      this.socket.emit('refresh-properties');
    }
  }
}

// Create singleton instance
export const webSocketService = new WebSocketService();

// React hook for WebSocket integration
export const useWebSocket = () => {
  return {
    connect: webSocketService.connect.bind(webSocketService),
    disconnect: webSocketService.disconnect.bind(webSocketService),
    sendMessage: webSocketService.sendMessage.bind(webSocketService),
    on: webSocketService.on.bind(webSocketService),
    off: webSocketService.off.bind(webSocketService),
    isConnected: webSocketService.isConnected.bind(webSocketService),
    getConnectionState: webSocketService.getConnectionState.bind(webSocketService),
    refreshEmergencies: webSocketService.refreshEmergencies.bind(webSocketService),
    refreshPackages: webSocketService.refreshPackages.bind(webSocketService),
    refreshVisitors: webSocketService.refreshVisitors.bind(webSocketService),
    refreshUsers: webSocketService.refreshUsers.bind(webSocketService),
    refreshProperties: webSocketService.refreshProperties.bind(webSocketService),
  };
};