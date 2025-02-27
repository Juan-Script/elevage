import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        popup: 'src/popup/popup.html',
        background: 'src/background/background.ts',
        content: 'src/content/content.ts'
      },
      output: {
        entryFileNames: (chunkInfo) => {
          // Los archivos principales van a la raíz
          if (['background', 'content'].includes(chunkInfo.name)) {
            return '[name].js';
          }
          return 'assets/[name].js';
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    },
    modulePreload: {
      polyfill: false
    }
  }
})

