<template>
  <div class="relative flex flex-col items-center justify-between min-h-screen w-full overflow-hidden">
    <!-- Imagen de fondo con overlay oscuro -->
    <div class="absolute inset-0">
      <img
        :src="sedeBackground"
        alt="Sede INACAP"
        class="h-full w-full object-cover"
      />
      <div class="absolute inset-0 bg-black bg-opacity-60"></div>
    </div>

    <!-- Logo INACAP -->
    <div class="relative w-full flex justify-center pt-4 sm:pt-8">
      <img
        :src="inacapLogo"
        alt="INACAP"
        class="w-40 sm:w-48 md:w-56 lg:w-64"
      />
    </div>

    <!-- Botón "Iniciar" centrado -->
    <div class="relative flex-1 flex items-center justify-center px-4">
      <button
        class="group/button relative inline-flex items-center justify-center overflow-hidden rounded-md bg-red-500/30 backdrop-blur-lg px-6 py-2 text-base font-semibold text-white transition-all duration-300 ease-in-out hover:scale-110 border border-white/20"
      >
        <span class="text-lg">Ingresar</span>
        <div
          class="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]"
        >
          <div class="relative h-full w-10 bg-white/30"></div>
        </div>
      </button>
    </div>

    <!-- Logo SmartLend -->
    <div class="relative w-full flex justify-center pb-4 sm:pb-6">
      <h2 class="text-white text-xl sm:text-2xl md:text-3xl">SmartLend</h2>
    </div>
  </div>
</template>

<script setup>
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
