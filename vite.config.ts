import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    server: {
      // The payment-link checkout calls /api/v1/payment-links on its own
      // origin in dev; this forwards it to the local Comet-dashboard, so the
      // page also works from a phone on the LAN (`npm run dev -- --host`).
      proxy: {
        '/api': {
          target: env.COMET_API_URL || 'http://localhost:8092',
          changeOrigin: true,
        },
      },
    },
  }
})
