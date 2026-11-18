import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename) 

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    open: false,
    port: 5173,
    strictPort: true
  },
  build: {
    outDir: 'dist'
  },
  resolve:{
    alias:{
      '@': path.resolve(__dirname, 'src'),
      '@app': path.resolve(__dirname, 'src/app'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@widgets': path.resolve(__dirname, 'src/widgets'),
      '@features': path.resolve(__dirname, 'src/features'),
      '@entities': path.resolve(__dirname, 'src/entities'),
      '@shared': path.resolve(__dirname, 'src/shared'),
    }
  }
})
