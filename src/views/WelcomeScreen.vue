<template>
  <div class="relative flex flex-col items-center justify-between h-screen w-full overflow-hidden">
    <!-- Imagen de fondo con overlay oscuro -->
    <div class="absolute inset-0">
      <img
        :src=sedeBackground
        alt="Sede INACAP"
        class="h-full w-full"
      />
      <div class="absolute inset-0 bg-black bg-opacity-60"></div>
    </div>

    <!-- Logo INACAP (parte superior centrada) -->
    <div class="relative pt-8">
      <img
        :src="inacapLogo"
        alt="INACAP"
        class="w-48 md:w-64 mx-auto"
      />
    </div>

    <!-- Botón "Iniciar" centrado -->
    <div class="relative flex-1 flex items-center justify-center">
      <button
        @click="startProcess"
        class="group/button relative inline-flex items-center justify-center overflow-hidden rounded-md bg-red-500 backdrop-blur-lg px-6 py-2 text-base font-semibold text-white transition-all duration-300 ease-in-out hover:scale-110 hover:shadow-xl hover:shadow-red-600"
      >
        <span class="text-lg">Ingresar</span>
        <div
          class="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]"
        >
          <div class="relative h-full w-10 bg-white/30"></div>
        </div>
      </button>
    </div>

    <!-- Logo SmartLend (parte inferior centrada) -->
    <div class="relative pb-6">
      <img
        :src="smartlendLogo"
        alt="SmartLend"
        class="h-8 md:h-10 mx-auto opacity-90"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import sedeBackground from '../assets/images/sede-background.jpg'
import inacapLogo from '../assets/images/inacap-logo.png'
import smartlendLogo from '../assets/images/smartlend-logo.png'

import { useRouter } from 'vue-router'


const router = useRouter()

const startProcess = () => {
  router.push('/facial-recognition')
}
</script>

<style scoped></style>
