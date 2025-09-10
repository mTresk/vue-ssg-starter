import type { ViteSSGOptions } from 'vite-ssg'
import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
import devIndex from './plugins/dev-index'
import injectScripts from './plugins/inject-scripts'
import minifyVendor from './plugins/minify-vendor'
import svgSprite from './plugins/svg-sprite'

export default defineConfig({
  plugins: [
    vue(),
    injectScripts({
      enabled: true,
    }),
    minifyVendor(),
    svgSprite(),
    devIndex(),
    ViteImageOptimizer({
      test: /\.(jpe?g|png|gif|tiff|webp|avif)$/i,
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    minify: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'
          }
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.names[0].split('.')
          const extention = info[info.length - 1]

          if (['woff', 'woff2', 'ttf', 'otf', 'eot'].includes(extention)) {
            return `assets/fonts/[name]-[hash][extname]`
          }

          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp|avif/i.test(extention)) {
            return `assets/images/[name]-[hash][extname]`
          }

          return `assets/[name]-[hash][extname]`
        },
      },
    },
    modulePreload: {
      polyfill: false,
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    open: true,
  },
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        additionalData: `@use '@/styles/helpers' as *;`,
        silenceDeprecations: ['import'],
      },
    },
  },
  ssgOptions: {
    formatting: 'prettify',
    mock: true,
    entry: 'src/main.ts',
  } satisfies ViteSSGOptions,
})
