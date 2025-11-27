import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        // backend
        target: "https://localhost:7180",
        changeOrigin: true,
        secure: false
      },
      "/hubs": {
        target: "https://localhost:7180",
        changeOrigin: true,
        secure: false,
        ws: true
      }
    }
  }
})
