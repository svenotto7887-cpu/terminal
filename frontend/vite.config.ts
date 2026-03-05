import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { loadEnv } from 'vite';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },
    server: {
      port: Number(env.VITE_PORT) || 3000,
      open: true,
      proxy: {
        '/api': {
          target: env.VITE_API_BASE_URL || 'http://localhost:4000/api',
          changeOrigin: true,
          secure: false
        },
        '/socket.io': {
          target: env.VITE_WS_URL || 'http://localhost:4000',
          ws: true
        }
      }
    },
    define: {
      'process.env': env
    }
  };
});
