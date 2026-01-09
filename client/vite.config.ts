import { sentryVitePlugin } from "@sentry/vite-plugin";
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vuetify from 'vite-plugin-vuetify'
import compression from 'vite-plugin-compression'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vuetify({ autoImport: true }),
    compression({
      algorithm: 'gzip',
      ext: '.gz',
      threshold: 1024,
      disable: process.env.NODE_ENV === 'development'
    }),
    sentryVitePlugin({
      org: "better-new-tab",
      project: "betternewtab-vue"
    }),
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },

  // Development specific settings
  server: {
    hmr: {
      overlay: true
    },
  },

  // CSS settings
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/assets/css/variables.scss";'
      }
    }
  },

  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            'vue',
            'vue-router',
            'pinia',
            'vuetify',
            'lodash'
          ],
          sentry: ['@sentry/vue'],
          search: ['fuse.js']
        }
      }
    },
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: process.env.NODE_ENV === 'production'
      }
    }
  },

  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'pinia',
      'vuetify',
      'lodash',
      'fuse.js',
    ]
  }
})