import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // Proxy /api/* to Spring Boot (includes /api/v1/images/...)
      '/api': {
        target: 'http://localhost:9090',  // Your backend port
        changeOrigin: true,
        secure: false,
        // NEW: Configure for debugging and binary handling
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('Proxying request:', req.method, req.url);  // Logs in Vite terminal
          });
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('Proxied response:', proxyRes.statusCode, 'for', req.url);  // Check if 200
          });
          proxy.on('error', (err, req, res) => {
            console.log('Proxy error for', req.url, ':', err.message);
          });
        },
      },
    },
  },
})