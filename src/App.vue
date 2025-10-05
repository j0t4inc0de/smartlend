<script setup>

</script>

<template>
  <router-view />
  <h1 class="text-2xl text-center text-red-500 hover:text-red-800">Hola, soy el componente principal de
    <span class="text-2xl underline font-medium">Smartlend - Actualizado</span>
  </h1>
    <div style="background: blue; color: white; padding: 10px; text-align: center;">
      ✅ Despliegue automático funcionando - {{ new Date().toLocaleString() }}
    </div>
</template>

<style scoped></style>
