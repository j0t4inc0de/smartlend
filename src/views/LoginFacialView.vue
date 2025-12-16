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
              class="px-6 py-3 rounded-xl text-gray-400 font-medium hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-white/10">
              Volver
            </button>

            <button @click="openEmailLoginModal"
              class="px-6 py-3 rounded-xl text-gray-300 font-medium hover:text-white hover:bg-white/5 transition-all border border-white/10">
              Usar Correo
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

    <!-- MODAL DE LOGIN CON CORREO -->
    <div v-if="showEmailLoginModal" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div class="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700 animate-fade-in-up">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold text-white">Iniciar Sesión</h3>
          <button @click="closeEmailLoginModal" class="text-gray-400 hover:text-white">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleEmailLogin" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-white mb-2">Correo Institucional</label>
            <div class="relative">
              <input ref="emailInput" v-model="email" type="email" required readonly @click="openKeyboard('email')"
                placeholder="nombre@inacapmail.cl"
                class="w-full bg-gray-700 text-white rounded-lg px-3 py-2 pr-10 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer" />
              <button type="button" @click="openKeyboard('email')"
                class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-white mb-2">Contraseña</label>
            <div class="relative">
              <input ref="passwordInput" v-model="password" :type="showPassword ? 'text' : 'password'" required readonly
                @click="openKeyboard('password')" placeholder="••••••••"
                class="w-full bg-gray-700 text-white rounded-lg px-3 py-2 pr-20 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer" />
              <div class="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <button type="button" @click="showPassword = !showPassword" class="text-gray-400 hover:text-white">
                  <svg v-if="!showPassword" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                </button>
                <button type="button" @click="openKeyboard('password')" class="text-gray-400 hover:text-white">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div class="flex gap-3 pt-4">
            <button type="button" @click="closeEmailLoginModal"
              class="flex-1 px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors">
              Cancelar
            </button>
            <button type="submit" :disabled="isEmailSubmitting"
              class="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              <span v-if="isEmailSubmitting"
                class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              <span>{{ isEmailSubmitting ? 'Ingresando...' : 'Ingresar' }}</span>
            </button>
          </div>
        </form>

        <div class="mt-6 text-center">
          <button @click="goBack" class="text-sm text-gray-400 hover:text-red-400 transition-colors">
            Volver a la pantalla de inicio
          </button>
        </div>

      </div>
    </div>

    <!-- TECLADO VIRTUAL -->
    <div v-if="showKeyboard" class="fixed inset-0 bg-black/90 flex items-end justify-center z-[60] p-4"
      @click.self="closeKeyboard">
      <div class="bg-gray-900 rounded-t-2xl w-full max-w-3xl border-t-2 border-red-600 shadow-2xl animate-slide-up">

        <!-- Header del teclado -->
        <div class="flex justify-between items-center p-4 border-b border-gray-700">
          <div class="text-white font-medium">
            {{ activeField === 'email' ? 'Correo Institucional' : 'Contraseña' }}
          </div>
          <button @click="closeKeyboard" class="text-gray-400 hover:text-white">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Display del texto -->
        <div class="p-4 bg-gray-800 border-b border-gray-700">
          <div class="bg-gray-700 rounded-lg px-4 py-3 text-white font-mono text-lg break-all">
            {{ activeField === 'email' ? email : (showPassword ? password : '•'.repeat(password.length)) }}
            <span class="animate-pulse">|</span>
          </div>
        </div>

        <!-- Teclas -->
        <div class="p-4 space-y-2">

          <!-- Fila de números -->
          <div class="grid grid-cols-10 gap-2">
            <button v-for="num in ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0']" :key="num" @click="addChar(num)"
              class="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-2 rounded-lg transition-colors active:scale-95">
              {{ num }}
            </button>
          </div>

          <!-- Fila 1 -->
          <div class="grid grid-cols-10 gap-2">
            <button v-for="letter in (capsLock ? 'QWERTYUIOP' : 'qwertyuiop').split('')" :key="letter"
              @click="addChar(letter)"
              class="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-2 rounded-lg transition-colors active:scale-95">
              {{ letter }}
            </button>
          </div>

          <!-- Fila 2 -->
          <div class="grid grid-cols-10 gap-2">
            <div class="col-span-1"></div>
            <button v-for="letter in (capsLock ? 'ASDFGHJKL' : 'asdfghjkl').split('')" :key="letter"
              @click="addChar(letter)"
              class="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-2 rounded-lg transition-colors active:scale-95">
              {{ letter }}
            </button>
          </div>

          <!-- Fila 3 -->
          <div class="grid grid-cols-10 gap-2">
            <button @click="capsLock = !capsLock" :class="['col-span-1 font-semibold py-3 px-2 rounded-lg transition-colors active:scale-95',
              capsLock ? 'bg-red-600 hover:bg-red-500 text-white' : 'bg-gray-700 hover:bg-gray-600 text-white']">
              <svg class="w-5 h-5 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
            <button v-for="letter in (capsLock ? 'ZXCVBNM' : 'zxcvbnm').split('')" :key="letter"
              @click="addChar(letter)"
              class="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-2 rounded-lg transition-colors active:scale-95">
              {{ letter }}
            </button>
            <button @click="backspace"
              class="col-span-2 bg-red-600 hover:bg-red-500 text-white font-semibold py-3 px-2 rounded-lg transition-colors active:scale-95 flex items-center justify-center gap-1">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M3 12l6.414 6.414a2 2 0 001.414.586H19a2 2 0 002-2V7a2 2 0 00-2-2h-8.172a2 2 0 00-1.414.586L3 12z" />
              </svg>
            </button>
          </div>

          <!-- Fila 4 - Símbolos y espacio -->
          <div class="grid grid-cols-10 gap-2">
            <button @click="addChar('@')"
              class="col-span-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-2 rounded-lg transition-colors active:scale-95">
              @
            </button>
            <button @click="addChar('.')"
              class="col-span-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-2 rounded-lg transition-colors active:scale-95">
              .
            </button>
            <button @click="addChar('_')"
              class="col-span-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-2 rounded-lg transition-colors active:scale-95">
              _
            </button>
            <button @click="addChar('-')"
              class="col-span-1 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-2 rounded-lg transition-colors active:scale-95">
              -
            </button>
            <button @click="addChar(' ')"
              class="col-span-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-3 px-2 rounded-lg transition-colors active:scale-95">
              Espacio
            </button>
            <button @click="closeKeyboard"
              class="col-span-2 bg-green-600 hover:bg-green-500 text-white font-semibold py-3 px-2 rounded-lg transition-colors active:scale-95">
              Listo
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

// Estado para el modal de login con correo
const showEmailLoginModal = ref(false)
const email = ref('')
const password = ref('')
const isEmailSubmitting = ref(false)
const showPassword = ref(false)

// Estado para el teclado virtual
const showKeyboard = ref(false)
const activeField = ref(null) // 'email' o 'password'
const capsLock = ref(false)
const emailInput = ref(null)
const passwordInput = ref(null)

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

const openEmailLoginModal = () => {
  showEmailLoginModal.value = true
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.enabled = false)
  }
}

const closeEmailLoginModal = () => {
  showEmailLoginModal.value = false
  showKeyboard.value = false
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.enabled = true)
  }
}

// Funciones del teclado virtual
const openKeyboard = (field) => {
  activeField.value = field
  showKeyboard.value = true
  capsLock.value = false
}

const closeKeyboard = () => {
  showKeyboard.value = false
  activeField.value = null
}

const addChar = (char) => {
  if (activeField.value === 'email') {
    email.value += char
  } else if (activeField.value === 'password') {
    password.value += char
  }
}

const backspace = () => {
  if (activeField.value === 'email') {
    email.value = email.value.slice(0, -1)
  } else if (activeField.value === 'password') {
    password.value = password.value.slice(0, -1)
  }
}

const handleEmailLogin = async () => {
  if (!email.value || !password.value) {
    alert('Por favor, ingresa tu correo y contraseña.')
    return
  }

  isEmailSubmitting.value = true
  try {
    const response = await authService.loginWithEmail(email.value, password.value)

    const u = response.usuario ?? response.user ?? response

    const normalizedUser = {
      ...u,
      id: u.id ?? u.id_usuario ?? u.usuario_id,
    }

    if (!normalizedUser.id) {
      alert('Error: el servidor no devolvió el id del usuario.')
      return
    }

    localStorage.setItem('user', JSON.stringify(normalizedUser))
    localStorage.setItem('isAuthenticated', 'true')

    alert(`Bienvenido ${normalizedUser.nombres} ${normalizedUser.apellidos}`)
    router.push('/dashboard')

  } catch (error) {
    console.error('Error en login con correo:', error)
    alert(error.message || 'Correo o contraseña incorrectos. Intenta de nuevo.')
  } finally {
    isEmailSubmitting.value = false
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

      const loginResponse = await authService.loginWithFace(blob)

      console.log('Respuesta completa del backend:', loginResponse)
      console.log('existe_embedding:', loginResponse.existe_embedding)
      console.log('usuario_id:', loginResponse.usuario_id)

      if (loginResponse.existe_embedding === false) {
        console.log('No se encontró coincidencia facial')
        alert('No se reconoció tu rostro. Por favor, regístrate primero.')
        router.push('/register')
        return
      }

      if (loginResponse.existe_embedding === true && loginResponse.usuario_id) {
        console.log('Coincidencia encontrada Usuario ID:', loginResponse.usuario_id)

        const usuario = await authService.getUsuarioById(loginResponse.usuario_id)
        console.log('Datos del usuario:', usuario)

        localStorage.setItem('user', JSON.stringify(usuario))
        localStorage.setItem('isAuthenticated', 'true')

        alert(`Bienvenido ${usuario.nombres} ${usuario.apellidos}`)

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

@keyframes slide-up {
  from {
    transform: translateY(100%);
  }

  to {
    transform: translateY(0);
  }
}

.animate-slide-up {
  animation: slide-up 0.3s ease-out forwards;
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
