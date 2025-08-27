import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5178,
    // Configurar HMR para GitHub Codespaces
    hmr: {
      port: 5178,
      clientPort: 443,
      protocol: 'wss'
    },
    // Proxy para API do backend
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false
      }
    }
  },
  optimizeDeps: {
    include: [
      'react-icons/bi',
      '@react-three/fiber',
      '@react-three/drei',
      'three',
      'zustand',
      'styled-components'
    ]
  },
  build: {
    // Aumentar o limite de tamanho dos chunks
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'three-vendor': ['three'],
          'drei-vendor': ['@react-three/drei'],
          'ui-vendor': ['react-icons', 'styled-components', 'zustand']
        }
      }
    }
  }
})
