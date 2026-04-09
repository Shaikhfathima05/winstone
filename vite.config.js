import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    historyApiFallback: {
      rewrites: [
        { from: /^\/admin$/, to: '/admin.html' },
      ],
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        projects: resolve(__dirname, 'projects.html'),
        admin: resolve(__dirname, 'admin.html'),
        damac: resolve(__dirname, 'damac.html'),
        sobha: resolve(__dirname, 'sobha.html'),
        township: resolve(__dirname, 'township.html'),
        saif: resolve(__dirname, 'saif.html'),
        commercial: resolve(__dirname, 'commercial.html'),
      },
    },
  },
})
