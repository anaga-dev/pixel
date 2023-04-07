import { defineConfig } from 'vite'
import { VitePWA as pwa } from 'vite-plugin-pwa'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import manifest from './manifest.json' assert { type: 'json' }

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
      '@': path.resolve(__dirname, 'src')
    }
  },
  plugins: [
    pwa({
      registerType: 'autoUpdate',
      manifest,
      devOptions: {
        enabled: true
      },
      workbox: {
        clientsClaim: true,
        skipWaiting: true
      }
    }),
    vue()
  ]
})
