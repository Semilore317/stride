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
      // Proxy /products/* requests to your backend (adjust port below)
      '/products': {
        target: 'http://localhost:9090',  
        changeOrigin: true,  // Helps with CORS by setting the origin header
        secure: false,  // Set to true if your backend uses HTTPS in dev
      },
    },
  },
})