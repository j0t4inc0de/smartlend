<script setup>
import { RouterView } from 'vue-router'
import { Toaster } from 'vue-sonner'
</script>

<template>
  <Toaster position="top-center" expand richColors theme="dark" />
  <div id="app" class="min-h-screen">
    <!-- RouterView es donde se mostrarán los componentes según la ruta -->
    <RouterView />
  </div>
</template>

<style>
/* Estilos globales */
body {
  margin: 0;
  padding: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
</style>
