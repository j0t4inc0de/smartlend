import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// NO importes 'vite-plugin-vue-devtools' aquí arriba

export default defineConfig(async ({ mode }) => {
  // <-- Añade 'async'
  const plugins = [vue()]

  // Solo si NO es producción, importa y usa devtools
  if (mode !== 'production') {
    // Importación dinámica (solo se ejecuta en desarrollo)
    const devtools = await import('vite-plugin-vue-devtools')
    plugins.push(devtools.default())
  }

  return {
    plugins,

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  }
})
