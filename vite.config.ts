import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig( {
  plugins: [ react() ],
  define: {
    'process.env': {},
    'process.env.NODE_ENV': JSON.stringify( process.env.NODE_ENV || 'development' )
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor libraries
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@heroui/react', '@heroui/system', '@heroui/theme'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'query-vendor': ['@tanstack/react-query', '@tanstack/react-query-devtools'],
          'utils-vendor': ['axios', 'clsx', 'classnames', 'uuid'],
          'icons-vendor': ['react-icons'],
          'animation-vendor': ['framer-motion'],
          'toast-vendor': ['react-toastify'],
          'chart-vendor': ['recharts'],
          'socket-vendor': ['socket.io-client'],
          'cloudinary-vendor': ['@cloudinary/react', '@cloudinary/url-gen']
        }
      }
    },
    chunkSizeWarningLimit: 600
  }
} );