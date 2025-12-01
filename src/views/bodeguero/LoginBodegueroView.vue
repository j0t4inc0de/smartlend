<template>
  <div class="relative min-h-screen w-full overflow-hidden flex items-center justify-center p-4">

    <!-- FONDO Y PARTÍCULAS -->
    <div class="absolute inset-0 pointer-events-none z-10">
      <div class="particles">
        <div v-for="n in 30" :key="n" class="particle"></div>
      </div>
    </div>
    <div class="absolute inset-0 z-0">
      <img src="@/assets/images/sede-background.jpg" alt="Fondo" class="animate-ken-burns h-full w-full object-cover" />
      <div class="absolute inset-0 bg-black/70"></div>
    </div>

    <!-- TARJETA DE LOGIN -->
    <div class="relative z-20 w-full max-w-md animate-fade-in-up">
      <div class="bg-black/50 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">

        <!-- Encabezado -->
        <div class="p-8 pb-0 text-center">
          <div
            class="inline-flex justify-center items-center w-16 h-16 bg-red-600 rounded-2xl mb-4 shadow-lg shadow-red-900/30">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-white tracking-tight">Acceso Bodeguero</h2>
          <p class="text-gray-400 text-sm mt-2">Gestión de inventario y préstamos</p>
        </div>

        <!-- Formulario -->
        <form @submit.prevent="handleLogin" class="p-8 space-y-6">

          <!-- Input Correo -->
          <div class="space-y-2">
            <label class="text-xs font-bold text-gray-300 uppercase tracking-wider ml-1">Correo Electrónico</label>
            <input v-model="email" type="email" required placeholder="ejemplo@inacap.cl"
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all" />
          </div>

          <!-- Input Contraseña -->
          <div class="space-y-2">
            <label class="text-xs font-bold text-gray-300 uppercase tracking-wider ml-1">Contraseña</label>
            <input v-model="password" type="password" required placeholder="••••••••"
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all" />
          </div>

          <!-- Mensaje de Error -->
          <div v-if="errorMessage" class="bg-red-500/10 border border-red-500/50 rounded-lg p-3 flex items-start gap-3">
            <svg class="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-sm text-red-200">{{ errorMessage }}</span>
          </div>

          <!-- Botones -->
          <div class="pt-2 space-y-3">
            <button type="submit" :disabled="isLoading"
              class="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-red-900/20 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center">
              <span v-if="isLoading"
                class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></span>
              {{ isLoading ? 'Ingresando...' : 'Iniciar Sesión' }}
            </button>

            <button type="button" @click="goBack"
              class="w-full bg-transparent hover:bg-white/5 text-gray-300 font-medium py-3 px-4 rounded-xl border border-white/10 transition-colors">
              Volver al Inicio
            </button>
          </div>
        </form>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useBodegueroAuthStore } from '@/stores/bodegueroAuthStore'

const router = useRouter()
const authStore = useBodegueroAuthStore()

// Estados del formulario
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

// Lógica de Login SIMPLIFICADA
const handleLogin = async () => {
  errorMessage.value = ''

  if (!email.value || !password.value) {
    errorMessage.value = 'Por favor completa todos los campos'
    return
  }

  isLoading.value = true

  try {
    const success = await authStore.login(email.value, password.value)

    if (success) {
      router.push('/bodeguero/dashboard/prestamos')
    } else {
      errorMessage.value = authStore.error
    }
  } catch (error) {
    errorMessage.value = 'Error inesperado'
  } finally {
    isLoading.value = false
  }
}

const goBack = () => {
  router.push('/')
}
</script>

<style scoped>
/* Animaciones idénticas a las vistas anteriores */
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

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
}

.particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.particle {
  position: absolute;
  bottom: -20px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: float 25s infinite ease-in-out;
}

@keyframes float {
  0% {
    transform: translateY(0) translateX(0);
    opacity: 0.1;
  }

  50% {
    transform: translateY(-100vh) translateX(50px);
    opacity: 0.4;
  }

  100% {
    transform: translateY(-200vh) translateX(-50px);
    opacity: 0;
  }
}

/* Generación de partículas css simple */
.particle:nth-child(even) {
  width: 4px;
  height: 4px;
  animation-duration: 20s;
}

.particle:nth-child(odd) {
  width: 2px;
  height: 2px;
  animation-duration: 30s;
}

.particle:nth-child(3n) {
  left: 20%;
  animation-delay: -5s;
}

.particle:nth-child(3n+1) {
  left: 50%;
  animation-delay: -12s;
}

.particle:nth-child(3n+2) {
  left: 80%;
  animation-delay: -8s;
}
</style>
