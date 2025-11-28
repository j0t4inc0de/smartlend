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

    <div class="relative z-20 w-full max-w-5xl animate-fade-in-up">

      <div class="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden">

        <div
          class="relative p-6 md:p-8 border-b border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-4">
            <div class="bg-red-600/80 p-3 rounded-xl shadow-lg shadow-red-900/20 backdrop-blur-sm">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div>
              <h1 class="text-2xl md:text-3xl font-bold text-white tracking-tight">Registro de Usuario</h1>
              <p class="text-gray-300 text-sm mt-1">Sistema de reconocimiento biométrico SmartLend</p>
            </div>
          </div>

          <div class="flex items-center gap-2 bg-white/5 rounded-full px-4 py-2 border border-white/5">
            <span
              :class="['px-3 py-1 rounded-full text-xs font-bold transition-colors', currentStep === 1 ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400']">1.
              Datos</span>
            <div class="w-8 h-[1px] bg-white/20"></div>
            <span
              :class="['px-3 py-1 rounded-full text-xs font-bold transition-colors', currentStep === 2 ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400']">2.
              Rostro</span>
          </div>
        </div>

        <div class="p-6 md:p-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">

            <div class="space-y-6">
              <h3 class="text-xl font-semibold text-white mb-4 flex items-center">
                <span class="w-1 h-6 bg-red-500 rounded-full mr-3"></span>
                Información Personal
              </h3>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div class="col-span-1 md:col-span-2 group">
                  <label
                    class="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase tracking-wider group-focus-within:text-red-400 transition-colors">RUT</label>
                  <input v-model="formData.rut" type="text" placeholder="12.345.678-9"
                    class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 focus:bg-white/10 transition-all duration-300" />
                </div>

                <div class="group">
                  <label
                    class="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase tracking-wider group-focus-within:text-red-400 transition-colors">Nombres</label>
                  <input v-model="formData.nombres" type="text"
                    class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 focus:bg-white/10 transition-all duration-300" />
                </div>

                <div class="group">
                  <label
                    class="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase tracking-wider group-focus-within:text-red-400 transition-colors">Apellidos</label>
                  <input v-model="formData.apellidos" type="text"
                    class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 focus:bg-white/10 transition-all duration-300" />
                </div>

                <div class="col-span-1 md:col-span-2 group">
                  <label
                    class="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase tracking-wider group-focus-within:text-red-400 transition-colors">Correo
                    Institucional</label>
                  <input v-model="formData.correo" type="email" placeholder="nombre@inacapmail.cl"
                    class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 focus:bg-white/10 transition-all duration-300" />
                </div>

                <div class="group">
                  <label
                    class="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase tracking-wider group-focus-within:text-red-400 transition-colors">Rol</label>
                  <div class="relative">
                    <select v-model="formData.rol"
                      class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 focus:bg-white/10 appearance-none transition-all duration-300">
                      <option value="" disabled class="bg-gray-900 text-gray-500">Seleccionar...</option>
                      <option value="estudiante" class="bg-gray-900">Estudiante</option>
                      <option value="docente" class="bg-gray-900">Docente</option>
                      <option value="administrativo" class="bg-gray-900">Administrativo</option>
                    </select>
                    <div class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                <div class="group">
                  <label
                    class="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase tracking-wider group-focus-within:text-red-400 transition-colors">Carrera</label>
                  <div class="relative">
                    <select v-model="formData.carrera" :disabled="formData.rol !== 'estudiante'"
                      class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 focus:bg-white/10 appearance-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                      <option value="" class="bg-gray-900">N/A u Opcional</option>
                      <option value="ingenieria" class="bg-gray-900">Ingeniería Informática</option>
                      <option value="electronica" class="bg-gray-900">Electrónica</option>
                      <option value="mecanica" class="bg-gray-900">Mecánica</option>
                    </select>
                    <div class="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-400">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-col h-full">
              <h3 class="text-xl font-semibold text-white mb-4 flex items-center">
                <span class="w-1 h-6 bg-red-500 rounded-full mr-3"></span>
                Captura Biométrica
              </h3>

              <div
                class="flex-1 bg-black/60 rounded-2xl border border-white/10 overflow-hidden relative shadow-inner group">
                <video ref="videoElement" class="w-full h-full object-cover transform scale-x-[-1]" autoplay
                  playsinline></video>
                <canvas ref="canvasElement" class="hidden"></canvas>

                <div class="absolute inset-0 pointer-events-none">
                  <div class="absolute inset-0 flex items-center justify-center">
                    <div
                      :class="['w-56 h-72 border-2 rounded-[3rem] transition-all duration-500 box-content shadow-[0_0_100px_rgba(0,0,0,0.5)_inset]',
                        isCameraActive ? 'border-red-500/50 shadow-[0_0_30px_rgba(220,38,38,0.3)]' : 'border-gray-600/30']">

                      <div
                        class="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-red-500 rounded-tl-2xl -mt-1 -ml-1">
                      </div>
                      <div
                        class="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-red-500 rounded-tr-2xl -mt-1 -mr-1">
                      </div>
                      <div
                        class="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-red-500 rounded-bl-2xl -mb-1 -ml-1">
                      </div>
                      <div
                        class="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-red-500 rounded-br-2xl -mb-1 -mr-1">
                      </div>
                    </div>
                  </div>

                  <div class="absolute top-4 left-4 right-4 flex justify-between items-start">
                    <div v-if="isCameraActive"
                      class="px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 backdrop-blur-md flex items-center gap-2">
                      <div class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                      <span class="text-xs font-bold text-red-100 tracking-wide uppercase">En Vivo</span>
                    </div>
                    <div v-else
                      class="px-3 py-1 rounded-full bg-gray-800/50 border border-white/10 backdrop-blur-md flex items-center gap-2">
                      <div class="w-2 h-2 rounded-full bg-gray-500"></div>
                      <span class="text-xs font-bold text-gray-300 tracking-wide uppercase">Inactivo</span>
                    </div>
                  </div>
                </div>

                <div v-if="showPreview"
                  class="absolute bottom-4 right-4 w-28 aspect-video rounded-lg border-2 border-green-500 overflow-hidden shadow-2xl z-30 bg-black">
                  <img ref="previewImage" class="w-full h-full object-cover" />
                  <div class="absolute inset-0 flex items-center justify-center bg-black/40">
                    <svg class="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </div>
              </div>

              <div class="mt-4 flex gap-3">
                <button @click="captureImage" :disabled="!isCameraActive || capturedImage"
                  class="flex-1 group relative overflow-hidden rounded-xl bg-white text-gray-900 font-bold py-3 px-4 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100">
                  <div
                    class="absolute inset-0 bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover:opacity-100 transition-opacity">
                  </div>
                  <span class="relative flex items-center justify-center gap-2">
                    <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z">
                      </path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    Capturar
                  </span>
                </button>

                <button @click="retryCapture" :disabled="!capturedImage"
                  class="px-4 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-all disabled:opacity-30 disabled:cursor-not-allowed">
                  <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
                    </path>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div class="mt-10 pt-6 border-t border-white/10 flex flex-col-reverse md:flex-row justify-end gap-4">

            <button @click="cancelRegistration"
              class="px-8 py-3 rounded-xl text-gray-300 font-medium hover:text-white hover:bg-white/5 transition-all">
              Cancelar
            </button>

            <button @click="registerUser" :disabled="!isFormValid || isSubmitting"
              class="group relative overflow-hidden rounded-xl bg-red-600 px-8 py-3 text-white font-bold shadow-lg transition-all hover:bg-red-500 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-red-600 disabled:cursor-not-allowed min-w-[200px]">

              <div
                class="absolute inset-0 flex h-full w-full justify-center [transform:skew(-13deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-13deg)_translateX(100%)]">
                <div class="relative h-full w-8 bg-white/20"></div>
              </div>

              <span class="relative flex items-center justify-center gap-2">
                <span v-if="isSubmitting"
                  class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                <span>{{ isSubmitting ? 'Procesando...' : 'Finalizar Registro' }}</span>
                <svg v-if="!isSubmitting" class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none"
                  stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3">
                  </path>
                </svg>
              </span>
            </button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/authService'
// Importa la imagen de fondo igual que en WelcomeScreen
import sedeBackground from '@/assets/images/sede-background.jpg'

const router = useRouter()

// Referencias DOM
const videoElement = ref(null)
const canvasElement = ref(null)
const previewImage = ref(null)

// Estado Reactivo
const stream = ref(null)
const isCameraActive = ref(false)
const capturedImage = ref(null)
const capturedImageURL = ref(null)
const showPreview = ref(false)
const isSubmitting = ref(false)

const formData = ref({
  rut: '',
  nombres: '',
  apellidos: '',
  correo: '',
  rol: '',
  carrera: ''
})

// Control visual de "Pasos" basado en qué campos están llenos
const currentStep = computed(() => {
  if (formData.value.rut && formData.value.nombres && formData.value.rol) return 2
  return 1
})

const isFormValid = computed(() => {
  return formData.value.rut &&
    formData.value.nombres &&
    formData.value.apellidos &&
    formData.value.correo &&
    formData.value.rol &&
    capturedImage.value !== null
})

// --- LÓGICA DE CÁMARA MEJORADA ---
const startCamera = async () => {
  try {
    stream.value = await navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 1280 }, height: { ideal: 720 }, facingMode: 'user' }
    })
    if (videoElement.value) {
      videoElement.value.srcObject = stream.value
      isCameraActive.value = true
    }
  } catch (error) {
    console.error('Error cámara:', error)
    alert('No se pudo acceder a la cámara. Revisa los permisos.')
  }
}

const captureImage = () => {
  if (!videoElement.value || !canvasElement.value) return

  const canvas = canvasElement.value
  const video = videoElement.value

  // Ajustar dimensiones para alta calidad
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight

  const ctx = canvas.getContext('2d')

  // Espejo horizontal para que la captura coincida con lo que ve el usuario
  ctx.translate(canvas.width, 0)
  ctx.scale(-1, 1)

  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

  canvas.toBlob((blob) => {
    capturedImage.value = blob
    capturedImageURL.value = URL.createObjectURL(blob)
    showPreview.value = true

    // Pequeño delay para asegurar que el DOM del preview existe
    setTimeout(() => {
      if (previewImage.value) previewImage.value.src = capturedImageURL.value
    }, 50)
  }, 'image/jpeg', 0.95)
}

const retryCapture = () => {
  capturedImage.value = null
  showPreview.value = false
  if (capturedImageURL.value) URL.revokeObjectURL(capturedImageURL.value)
  capturedImageURL.value = null
}

const cancelRegistration = () => {
  if (stream.value) stream.value.getTracks().forEach(t => t.stop())
  router.push('/')
}

const registerUser = async () => {
  if (!isFormValid.value) return
  isSubmitting.value = true

  try {
    const data = new FormData()
    data.append('image', capturedImage.value, 'face.jpg')
    // Agregamos campos
    Object.keys(formData.value).forEach(key => {
      if (formData.value[key]) data.append(key, formData.value[key])
    })

    const result = await authService.registerUserWithFace(data)

    alert(`¡Bienvenido ${formData.value.nombres}! Registro completado.`)
    router.push('/')

  } catch (error) {
    alert(`Error: ${error.message}`)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  startCamera()
})

onUnmounted(() => {
  if (stream.value) stream.value.getTracks().forEach(t => t.stop())
  if (capturedImageURL.value) URL.revokeObjectURL(capturedImageURL.value)
})
</script>

<style scoped>
/* Reutilizamos los estilos de partículas y animación del fondo */
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

/* Sistema de Partículas (Copia exacta para consistencia) */
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

/* Generamos algunas partículas de ejemplo en CSS para no alargar el código */
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
