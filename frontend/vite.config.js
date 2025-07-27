import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8085,
    host: '0.0.0.0'
  },
  preview: {
    port: 8085,
    host: '0.0.0.0',
    allowedHosts: ['bidalbania.al', 'localhost', '127.0.0.1']
  }
})
