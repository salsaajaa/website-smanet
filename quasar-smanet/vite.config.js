import { defineConfig } from 'vite'
import { quasar } from '@quasar/vite-plugin'

export default defineConfig({
  plugins: [quasar()],
  css: {
    preprocessorOptions: {
      sass: {
        additionalData: '@import "./src/styles/quasar.sass"',
      },
    },
  },
})
