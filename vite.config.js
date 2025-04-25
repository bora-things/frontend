import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import daisyui from 'daisyui'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), daisyui],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
