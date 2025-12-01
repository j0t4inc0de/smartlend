<template>
  <div class="relative min-h-screen w-full overflow-hidden flex items-center justify-center p-4">

    <div class="absolute inset-0 pointer-events-none z-10">
      <div class="particles">
        <div v-for="n in 30" :key="n" class="particle"></div>
      </div>
    </div>
    <div class="absolute inset-0 z-0">
      <img :src="sedeBackground" alt="Sede Fondo" class="animate-ken-burns h-full w-full object-cover" />
      <div class="absolute inset-0 bg-black/70"></div>
    </div>

    <div class="relative z-20 w-full max-w-4xl animate-fade-in-up">
      <div class="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">

        <div class="p-6 md:p-8 border-b border-white/10 flex flex-col items-center text-center gap-4">
          <div class="bg-red-600/80 p-3 rounded-xl shadow-lg shadow-red-900/20 backdrop-blur-sm">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 class="text-2xl md:text-3xl font-bold text-white tracking-tight">Bienvenido a SmartLend</h1>
            <p class="text-gray-300 text-sm mt-1">Acércate a la cámara para iniciar sesión</p>
          </div>
        </div>

        <div class="p-6 md:p-8 flex flex-col items-center">
          <div
            class="relative w-full max-w-lg aspect-video bg-black/60 rounded-2xl border border-white/10 overflow-hidden shadow-2xl group">
            <video ref="videoElement" class="w-full h-full object-cover transform scale-x-[-1]" autoplay
              playsinline></video>
            <canvas ref="canvasElement" class="hidden"></canvas>

            <div class="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div :class="['w-48 h-64 border-2 rounded-[2.5rem] transition-all duration-500 box-content',
                isCameraActive ? 'border-red-500/60 shadow-[0_0_40px_rgba(220,38,38,0.2)]' : 'border-gray-600/30']">
                <div
                  class="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-red-500 rounded-tl-2xl -mt-1 -ml-1">
                </div>
                <div
                  class="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-red-500 rounded-tr-2xl -mt-1 -mr-1">
                </div>
                <div
                  class="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-red-500 rounded-bl-2xl -mb-1 -ml-1">
                </div>
                <div
                  class="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-red-500 rounded-br-2xl -mb-1 -mr-1">
                </div>
              </div>
            </div>

            <div class="absolute top-4 left-4">
              <div v-if="isCameraActive"
                class="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 backdrop-blur-md flex items-center gap-2">
                <div class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                <span class="text-xs font-bold text-red-100 uppercase">Cámara Activa</span>
              </div>
            </div>
          </div>

          <div class="mt-8 flex gap-4 w-full max-w-lg">
            <button @click="goBack"
              class="px-6 py-3 rounded-xl text-gray-300 font-medium hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-white/10">
              Volver
            </button>

            <button @click="handleLogin" :disabled="!isCameraActive || isSubmitting"
              class="flex-1 group relative overflow-hidden rounded-xl bg-red-600 px-8 py-3 text-white font-bold shadow-lg transition-all hover:bg-red-500 hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">

              <div
                class="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-13deg)_translateX(100%)]">
                <div class="relative h-full w-8 bg-white/20"></div>
              </div>

              <span class="relative flex items-center justify-center gap-2">
                <span v-if="isSubmitting"
                  class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span v-else>
                  <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z">
                    </path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  Identificarse
                </span>
              </span>
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/authService'
import sedeBackground from '@/assets/images/sede-background.jpg'

const router = useRouter()
const videoElement = ref(null)
const canvasElement = ref(null)
const stream = ref(null)
const isCameraActive = ref(false)
const isSubmitting = ref(false)

const startCamera = async () => {
  try {
    stream.value = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 1280 },
        height: { ideal: 720 },
        facingMode: 'user'
      }
    })
    if (videoElement.value) {
      videoElement.value.srcObject = stream.value
      isCameraActive.value = true
    }
  } catch (error) {
    console.error('Error cámara:', error)
    alert('No se pudo acceder a la cámara.')
  }
}

const handleLogin = async () => {
  if (!videoElement.value || !canvasElement.value) return

  isSubmitting.value = true

  const canvas = canvasElement.value
  const video = videoElement.value
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  const ctx = canvas.getContext('2d')

  ctx.translate(canvas.width, 0)
  ctx.scale(-1, 1)
  ctx.drawImage(video, 0, 0)

  canvas.toBlob(async (blob) => {
    try {
      console.log('Enviando imagen para login, tamaño:', blob.size)

      // PASO 1: Verificar reconocimiento facial
      const loginResponse = await authService.loginWithFace(blob)

      // 🐛 DEBUG: Ver respuesta completa
      console.log('Respuesta completa del backend:', loginResponse)
      console.log('existe_embedding:', loginResponse.existe_embedding)
      console.log('usuario_id:', loginResponse.usuario_id)

      // PASO 2: Validar si existe coincidencia
      if (loginResponse.existe_embedding === false) {
        console.log('No se encontró coincidencia facial')
        alert('No se reconoció tu rostro. Por favor, regístrate primero.')
        router.push('/register')
        return
      }

      if (loginResponse.existe_embedding === true && loginResponse.usuario_id) {
        console.log('Coincidencia encontrada! Usuario ID:', loginResponse.usuario_id)

        // PASO 3: Obtener datos completos del usuario
        const usuario = await authService.getUsuarioById(loginResponse.usuario_id)
        console.log('Datos del usuario:', usuario)

        // PASO 4: Guardar sesión
        localStorage.setItem('user', JSON.stringify(usuario))
        localStorage.setItem('isAuthenticated', 'true')

        // PASO 5: Mostrar bienvenida
        alert(`¡Bienvenido ${usuario.nombres} ${usuario.apellidos}!`)

        // PASO 6: Redirigir
        router.push('/dashboard')
      } else {
        console.log('Respuesta inesperada del backend')
        alert('Error en la respuesta del servidor. Intenta de nuevo.')
      }

    } catch (error) {
      console.error('Error en login:', error)
      console.error('Detalles del error:', error.response?.data)
      alert(error.message || 'Error al intentar iniciar sesión. Intenta de nuevo.')
    } finally {
      isSubmitting.value = false
    }
  }, 'image/jpeg', 0.95)
}

const goBack = () => {
  router.push('/')
}

onMounted(() => {
  startCamera()
})

onUnmounted(() => {
  if (stream.value) stream.value.getTracks().forEach(t => t.stop())
})
</script>

<style scoped>
/* Estilos de animación idénticos al RegisterUserView para consistencia */
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
  animation: fade-in-up 0.8s ease-out forwards;
}

.particles {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.particle {
  position: absolute;
  bottom: -20px;
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 50%;
  animation: float 25s infinite ease-in-out;
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

/* Generación rápida de partículas */
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
