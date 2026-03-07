<template>
  <div class="relative flex flex-col items-center justify-between min-h-screen w-full overflow-hidden">
    <!-- Partículas animadas -->
    <div class="absolute inset-0 pointer-events-none z-10">
      <div class="particles">
        <div v-for="n in 30" :key="n" class="particle"></div>
      </div>
    </div>

    <!-- Imagen de fondo con overlay oscuro -->
    <div class="absolute inset-0 z-0">
      <img :src="sedeBackground" alt="Sede INACAP" class="animate-ken-burns h-full w-full object-cover" />
      <div class="absolute inset-0 bg-black bg-opacity-60"></div>
    </div>

    <!-- Logo INACAP y FABLAB -->
    <div class="relative w-full flex items-center justify-center pt-4 sm:pt-8 gap-6 sm:gap-10">

      <img :src="fablabLogo" alt="FabLab" class="w-[43px] sm:w-[72px] md:w-[100px] lg:w-[115px] object-contain drop-shadow-md animate-fade-in-down" style="animation-delay: 0.1s;" />

      <div class="h-12 sm:h-16 md:h-20 w-px bg-white/20 rounded-full animate-fade-in-down" style="animation-delay: 0.3s;"></div>

      <img :src="inacapLogo" alt="INACAP" class="w-40 sm:w-48 md:w-56 lg:w-64 object-contain drop-shadow-md animate-fade-in-down" style="animation-delay: 0.5s;" />

    </div>

    <!-- Botón "Ingresar" centrado -->
    <div class="relative flex-1 flex items-center justify-center px-4">
      <button @click="startProcess" class="animate-pulse-slow group/button relative inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-md bg-red-500/30 backdrop-blur-lg px-8 py-2.5 text-base font-semibold text-white transition-all duration-300 ease-in-out scale-125 hover:scale-125 hover:animate-none border border-white/20">
        <span class="text-xl">Ingresar</span>
        <div class="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover/button:duration-1000 group-hover/button:[transform:skew(-13deg)_translateX(100%)]">
          <div class="relative h-full w-10 bg-white/30"></div>
        </div>
      </button>
    </div>

    <!-- Logo SmartLend y creditos a mi y omar -->
    <div class="relative w-full flex justify-center">
      <footer class="mx-auto w-full max-w-container sm:px-6 lg:px-8">

        <div class="border-t border-white/10 py-6 text-white">
          <h1 class="text-center text-lg font-medium select-none text-white/90">
            <span class="text-base font-normal">© 2026</span> SmartLend
          </h1>

          <div class="mt-2 flex flex-wrap items-center justify-center gap-x-1.5 text-base font-normal select-none text-white/60">
            <span>Desarrollado por</span>

            <span class="relative inline-flex overflow-hidden rounded-sm cursor-pointer font-normal text-white/90 transition-all duration-300 hover:scale-105 hover:text-white active:scale-95 animate-fade-in-up" style="animation-delay: 0.8s;">
              Juan Erices Fuentealba
              <span class="absolute inset-0 z-10 pointer-events-none translate-x-[-150%] animate-shine">
                <span class="block h-full w-6 bg-white/40 skew-x-[-20deg] blur-[1px]"></span>
              </span>
            </span>

            <span>y</span>

            <span class="inline-flex cursor-pointer font-normal text-white/85 transition-all duration-300 hover:scale-105 hover:text-white active:scale-95 animate-fade-in-up" style="animation-delay: 1.0s;">
              Omar Montanares
            </span>
          </div>

        </div>
      </footer>
    </div>
  </div>
</template>

<script setup>
import sedeBackground from '../assets/images/sede-background.jpg'
import fablabLogo from '../assets/images/logo-fablab.jpeg'
import inacapLogo from '../assets/images/inacap-logo.png'

import { useRouter } from 'vue-router'

const router = useRouter()

const startProcess = () => {
  router.push('/facial-recognition')
}
</script>

<style scoped>
/* Animación de entrada desde abajo para el footer */
@keyframes fadeInUp {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  /* opacity: 0 asegura que los nombres no se vean antes de su turno */
  opacity: 0;
  animation: fadeInUp 0.8s ease-out forwards;
}

/* Animación de entrada para los logos */
@keyframes fadeInDown {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-down {
  /* opacity: 0 asegura que los elementos sean invisibles antes de que comience su animación */
  opacity: 0;
  animation: fadeInDown 0.8s ease-out forwards;
}

@keyframes shine {

  /* Del 0% al 90% del tiempo (13.5 segundos), se mantiene oculto a la izquierda */
  0%,
  90% {
    transform: translateX(-150%);
  }

  /* En el 10% restante (1.5 segundos), cruza rápidamente hacia la derecha */
  100% {
    transform: translateX(150%);
  }
}

.animate-shine {
  animation: shine 15s ease-in-out infinite;
}

/* Animación de pulso para el botón */
@keyframes pulse-slow {

  0%,
  100% {
    box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
  }

  50% {
    box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
  }
}

.animate-pulse-slow {
  animation: pulse-slow 3s infinite;
}

/* Animación de Ken Burns (zoom y paneo lento) para el fondo */
@keyframes ken-burns {
  0% {
    transform: scale(1) translate(0, 0);
  }

  100% {
    transform: scale(1.1) translate(-10px, -5px);
  }
}

.animate-ken-burns {
  animation: ken-burns 30s ease-in-out infinite alternate;
}

/* Sistema de partículas */
.particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.particle {
  position: absolute;
  bottom: -20px;
  /* Empezar desde fuera de la pantalla */
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  animation: float 25s infinite ease-in-out;
  will-change: transform, opacity;
}

@keyframes float {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0.15;
  }

  50% {
    transform: translateY(-100vh) translateX(50px);
    opacity: 0.5;
  }

  100% {
    transform: translateY(-200vh) translateX(-50px);
    opacity: 0;
  }
}

/* Generación aleatoria de partículas (tamaño, posición, delay) */
.particle:nth-child(1) {
  width: 5px;
  height: 5px;
  left: 10%;
  animation-duration: 20s;
  animation-delay: -2s;
}

.particle:nth-child(2) {
  width: 2px;
  height: 2px;
  left: 25%;
  animation-duration: 30s;
  animation-delay: -5s;
}

.particle:nth-child(3) {
  width: 4px;
  height: 4px;
  left: 40%;
  animation-duration: 22s;
  animation-delay: -10s;
}

.particle:nth-child(4) {
  width: 3px;
  height: 3px;
  left: 55%;
  animation-duration: 28s;
  animation-delay: -3s;
}

.particle:nth-child(5) {
  width: 6px;
  height: 6px;
  left: 70%;
  animation-duration: 18s;
  animation-delay: -8s;
}

.particle:nth-child(6) {
  width: 2px;
  height: 2px;
  left: 85%;
  animation-duration: 32s;
  animation-delay: -1s;
}

.particle:nth-child(7) {
  width: 4px;
  height: 4px;
  left: 5%;
  animation-duration: 26s;
  animation-delay: -12s;
}

.particle:nth-child(8) {
  width: 3px;
  height: 3px;
  left: 20%;
  animation-duration: 23s;
  animation-delay: -6s;
}

.particle:nth-child(9) {
  width: 5px;
  height: 5px;
  left: 50%;
  animation-duration: 29s;
  animation-delay: -15s;
}

.particle:nth-child(10) {
  width: 2px;
  height: 2px;
  left: 75%;
  animation-duration: 21s;
  animation-delay: -4s;
}

.particle:nth-child(11) {
  width: 6px;
  height: 6px;
  left: 90%;
  animation-duration: 24s;
  animation-delay: -9s;
}

.particle:nth-child(12) {
  width: 3px;
  height: 3px;
  left: 30%;
  animation-duration: 27s;
  animation-delay: -18s;
}

.particle:nth-child(13) {
  width: 4px;
  height: 4px;
  left: 60%;
  animation-duration: 19s;
  animation-delay: -7s;
}

.particle:nth-child(14) {
  width: 2px;
  height: 2px;
  left: 80%;
  animation-duration: 31s;
  animation-delay: -11s;
}

.particle:nth-child(15) {
  width: 5px;
  height: 5px;
  left: 15%;
  animation-duration: 25s;
  animation-delay: -14s;
}

.particle:nth-child(16) {
  width: 3px;
  height: 3px;
  left: 35%;
  animation-duration: 20s;
  animation-delay: -1s;
}

.particle:nth-child(17) {
  width: 4px;
  height: 4px;
  left: 65%;
  animation-duration: 33s;
  animation-delay: -13s;
}

.particle:nth-child(18) {
  width: 2px;
  height: 2px;
  left: 95%;
  animation-duration: 22s;
  animation-delay: -16s;
}

.particle:nth-child(19) {
  width: 6px;
  height: 6px;
  left: 45%;
  animation-duration: 28s;
  animation-delay: -5s;
}

.particle:nth-child(20) {
  width: 3px;
  height: 3px;
  left: 88%;
  animation-duration: 26s;
  animation-delay: -19s;
}

.particle:nth-child(21) {
  width: 4px;
  height: 4px;
  left: 12%;
  animation-duration: 23s;
  animation-delay: -3s;
}

.particle:nth-child(22) {
  width: 2px;
  height: 2px;
  left: 33%;
  animation-duration: 29s;
  animation-delay: -7s;
}

.particle:nth-child(23) {
  width: 5px;
  height: 5px;
  left: 58%;
  animation-duration: 21s;
  animation-delay: -11s;
}

.particle:nth-child(24) {
  width: 3px;
  height: 3px;
  left: 78%;
  animation-duration: 27s;
  animation-delay: -16s;
}

.particle:nth-child(25) {
  width: 6px;
  height: 6px;
  left: 92%;
  animation-duration: 19s;
  animation-delay: -6s;
}

.particle:nth-child(26) {
  width: 2px;
  height: 2px;
  left: 8%;
  animation-duration: 31s;
  animation-delay: -17s;
}

.particle:nth-child(27) {
  width: 4px;
  height: 4px;
  left: 28%;
  animation-duration: 24s;
  animation-delay: -1s;
}

.particle:nth-child(28) {
  width: 3px;
  height: 3px;
  left: 48%;
  animation-duration: 26s;
  animation-delay: -14s;
}

.particle:nth-child(29) {
  width: 5px;
  height: 5px;
  left: 68%;
  animation-duration: 20s;
  animation-delay: -9s;
}

.particle:nth-child(30) {
  width: 3px;
  height: 3px;
  left: 82%;
  animation-duration: 25s;
  animation-delay: -19s;
}
</style>
