import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@assets': '/src/assets',
      '@pages': '/src/pages',
      '@hooks': '/src/hooks',
      '@utils': '/src/utils',
      '@context': '/src/context',
      '@types': '/src/types',
      '@services': '/src/services',
      '@styles': '/src/styles',
    },
  },
})
