import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          map: ['mapbox-gl', 'react-map-gl'],
          charts: ['recharts', 'd3'],
          ui: ['@mui/material', '@emotion/react']
        }
      }
    }
  },
  server: {
    port: 3000,
    proxy: {
      // This would point to your external API
      '/api': {
        target: 'https://your-external-api.com', // Replace with your actual API endpoint
        changeOrigin: true,
        secure: true,
      }
    }
  }
})