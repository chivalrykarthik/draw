import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


export default defineConfig({
  base: '/draw/',
  plugins: [react(), tailwindcss()],

  server: {
    port: 3000,
  },
  optimizeDeps: {
    exclude: ['@terrastruct/d2'],
  },
  worker: {
    format: 'es',
  },
})
