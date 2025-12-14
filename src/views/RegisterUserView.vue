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

          <div v-if="registrationMethod === 'face'"
            class="flex items-center gap-2 bg-white/5 rounded-full px-4 py-2 border border-white/5">
            <span
              :class="['px-3 py-1 rounded-full text-xs font-bold transition-colors', currentStep === 1 ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400']">1.
              Datos</span>
            <div class="w-8 h-[1px] bg-white/20"></div>
            <span
              :class="['px-3 py-1 rounded-full text-xs font-bold transition-colors', currentStep === 2 ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400']">2.
              Rostro</span>
          </div>
          <div v-else class="flex items-center gap-2 bg-white/5 rounded-full px-4 py-2 border border-white/5">
            <span class="px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white shadow-lg">Registro por
              correo</span>
          </div>
        </div>

        <div class="p-6 md:p-8">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">

            <div class="space-y-6">
              <h3 class="text-xl font-semibold text-white mb-4 flex items-center">
                <span class="w-1 h-6 bg-red-500 rounded-full mr-3"></span>
                Información Personal
              </h3>

              <!-- Método de registro: Facial (principal) / Correo (opcional) -->
              <div class="flex items-center justify-between gap-3">
                <p class="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                  Método de registro
                </p>

                <!-- Selector compacto -->
                <div class="inline-flex items-center rounded-full border border-white/10 bg-white/5 p-1">
                  <button type="button" @click="registrationMethod = 'face'"
                    class="px-3 py-1.5 rounded-full text-xs font-semibold transition-all" :class="registrationMethod === 'face'
                      ? 'bg-red-600/70 text-white shadow'
                      : 'text-gray-300 hover:text-white'" aria-pressed="registrationMethod === 'face'">
                    Facial
                  </button>

                  <button type="button" @click="registrationMethod = 'email'"
                    class="px-3 py-1.5 rounded-full text-xs font-semibold transition-all" :class="registrationMethod === 'email'
                      ? 'bg-red-600/70 text-white shadow'
                      : 'text-gray-300 hover:text-white'" aria-pressed="registrationMethod === 'email'">
                    Correo
                  </button>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div class="col-span-1 md:col-span-2 group">
                  <label
                    class="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase tracking-wider group-focus-within:text-red-400 transition-colors">RUT</label>
                  <input v-model="formData.rut" type="text" placeholder="12345678-9" maxlength="10"
                    class="w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 focus:bg-white/10 transition-all duration-300"
                    :class="rutError ? 'border-red-500/80' : 'border-white/10'" />
                  <p v-if="rutError" class="text-red-400 text-xs mt-2 ml-1 h-4">{{ rutError }}</p>
                </div>

                <div class="group">
                  <label
                    class="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase tracking-wider group-focus-within:text-red-400 transition-colors">Nombres</label>
                  <input v-model="formData.nombres" type="text" maxlength="30"
                    class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 focus:bg-white/10 transition-all duration-300" />
                </div>

                <div class="group">
                  <label
                    class="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase tracking-wider group-focus-within:text-red-400 transition-colors">Apellidos</label>
                  <input v-model="formData.apellidos" type="text" maxlength="30"
                    class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 focus:bg-white/10 transition-all duration-300" />
                </div>

                <div class="col-span-1 md:col-span-2 group">
                  <label
                    class="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase tracking-wider group-focus-within:text-red-400 transition-colors">Correo
                    Institucional</label>
                  <div class="relative">
                    <input v-model="formData.correo" type="email" placeholder="nombre.apellido@inacapmail.cl"
                      maxlength="50"
                      class="w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 focus:bg-white/10 transition-all duration-300"
                      :class="emailError ? 'border-red-500/80' : 'border-white/10'" />
                  </div>
                  <p v-if="emailError" class="text-red-400 text-xs mt-2 ml-1 h-4">{{ emailError }}</p>
                </div>

                <!-- Campos opcionales para registro por correo -->
                <template v-if="registrationMethod === 'email'">
                  <div class="group">
                    <label
                      class="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase tracking-wider group-focus-within:text-red-400 transition-colors">Contraseña</label>
                    <input v-model="password" type="password" autocomplete="new-password"
                      class="w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 focus:bg-white/10 transition-all duration-300"
                      :class="passwordError ? 'border-red-500/80' : 'border-white/10'"
                      placeholder="Mínimo 8 caracteres" />
                    <p v-if="passwordError" class="text-red-400 text-xs mt-2 ml-1 h-4">{{ passwordError }}</p>
                  </div>

                  <div class="group">
                    <label
                      class="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase tracking-wider group-focus-within:text-red-400 transition-colors">Confirmar
                      contraseña</label>
                    <input v-model="passwordConfirm" type="password" autocomplete="new-password"
                      class="w-full bg-white/5 border rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 focus:bg-white/10 transition-all duration-300"
                      :class="passwordConfirmError ? 'border-red-500/80' : 'border-white/10'"
                      placeholder="Repite la contraseña" />
                    <p v-if="passwordConfirmError" class="text-red-400 text-xs mt-2 ml-1 h-4">{{ passwordConfirmError }}
                    </p>
                  </div>
                </template>

                <div class="group">
                  <label
                    class="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase tracking-wider group-focus-within:text-red-400 transition-colors">
                    Rol
                  </label>
                  <div class="relative">
                    <select v-model="formData.rol" :disabled="loadingData"
                      class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 focus:bg-white/10 appearance-none transition-all duration-300 disabled:opacity-50">
                      <option value="" disabled class="bg-gray-900 text-gray-500">
                        {{ loadingData ? 'Cargando...' : 'Seleccionar...' }}
                      </option>
                      <option v-for="rol in roles" :key="rol.id" :value="rol.nombre" class="bg-gray-900">
                        {{ rol.nombre.charAt(0).toUpperCase() + rol.nombre.slice(1) }}
                      </option>
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
                    class="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase tracking-wider group-focus-within:text-red-400 transition-colors">
                    Carrera
                  </label>
                  <div class="relative">
                    <select v-model="formData.carrera"
                      :disabled="formData.rol.toLowerCase() !== 'estudiante' || loadingData"
                      class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 focus:bg-white/10 appearance-none transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                      <option value="" class="bg-gray-900">N/A u Opcional</option>
                      <option v-for="carrera in carreras" :key="carrera.id" :value="carrera.nombre" class="bg-gray-900">
                        {{ carrera.nombre }}
                      </option>
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

              <!-- Si se registra por correo, se deshabilita la sección de cámara -->
              <div v-if="registrationMethod === 'email'"
                class="flex-1 bg-black/40 rounded-2xl border border-white/10 p-6 flex items-center justify-center">
                <div class="text-center">
                  <div class="text-white font-semibold">Te estas registrando con correo y contraseña</div>
                  <div class="text-gray-400 text-sm mt-1">La captura facial es opcional aunque 3 veces más rápida.
                  </div>
                </div>
              </div>

              <div v-else
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

              <div class="mt-4 flex gap-3" v-if="registrationMethod === 'face'">
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
                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z">
                      </path>
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
const rutError = ref('')
const emailError = ref('')
const passwordError = ref('')
const passwordConfirmError = ref('')

// Método de registro: por defecto facial
const registrationMethod = ref('face')
const password = ref('')
const passwordConfirm = ref('')

// Listas dinámicas desde el backend
const carreras = ref([])
const roles = ref([])
const loadingData = ref(true)
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
  // En modo correo no hay paso biométrico
  if (registrationMethod.value === 'email') return 1
  if (formData.value.rut && formData.value.nombres && formData.value.rol) return 2
  return 1
})

const isFormValid = computed(() => {
  const baseOk = formData.value.rut &&
    formData.value.nombres &&
    formData.value.apellidos &&
    formData.value.correo &&
    formData.value.rol &&
    !rutError.value &&
    !emailError.value

  if (!baseOk) return false

  if (registrationMethod.value === 'email') {
    return !!password.value &&
      !!passwordConfirm.value &&
      !passwordError.value &&
      !passwordConfirmError.value
  }

  return capturedImage.value !== null
})

// Cargar datos del backend
const loadInitialData = async () => {
  loadingData.value = true
  try {
    const [carrerasData, rolesData] = await Promise.all([
      authService.getCarreras(),
      authService.getRoles()
    ])
    carreras.value = carrerasData
    roles.value = rolesData
    console.log('Carreras cargadas:', carreras.value)
    console.log('Roles cargados:', roles.value)
  } catch (error) {
    console.error('Error cargando datos iniciales:', error)
    alert('Error al cargar los datos del formulario. Por favor, recarga la página.')
  } finally {
    loadingData.value = false
  }
}

// --- VALIDACIONES ---
const validateRut = (rut) => {
  if (!rut) return "El RUT es obligatorio."

  // Limpiar RUT de puntos y guión
  const cleanRut = rut.replace(/[^0-9kK]/g, '').toLowerCase();
  if (cleanRut.length < 2) return "El RUT es muy corto.";

  const body = cleanRut.slice(0, -1);
  const dv = cleanRut.slice(-1);

  if (!/^[0-9]+$/.test(body)) return "Formato de RUT inválido.";

  // Bloquear RUTs con números repetidos (ej: 11.111.111-1) para evitar datos falsos
  if (/^(\d)\1+$/.test(body)) {
    return "RUT no válido (secuencia repetida).";
  }

  // Algoritmo de validación Módulo 11
  let suma = 0;
  let multiplo = 2;
  for (let i = body.length - 1; i >= 0; i--) {
    suma += multiplo * body.charAt(i);
    if (multiplo < 7) {
      multiplo++;
    } else {
      multiplo = 2;
    }
  }

  const dvEsperado = 11 - (suma % 11);
  let dvFinal = dvEsperado.toString();

  if (dvEsperado === 11) dvFinal = '0';
  else if (dvEsperado === 10) dvFinal = 'k';

  if (dvFinal !== dv) {
    return "El RUT es inválido (dígito verificador no coincide).";
  }

  return ""; // No hay error
};

const validateEmail = (email) => {
  if (!email) return "El correo es obligatorio.";
  const emailRegex = /^[a-zA-Z0-9._%+-]+@inacapmail\.cl$/;
  if (!emailRegex.test(email)) {
    return "Debe ser un correo @inacapmail.cl válido.";
  }
  return ""; // No hay error
};

const formatRut = (value) => {
  if (!value) return '';
  // Si es muy corto, no hay nada que formatear con guion.
  if (value.length < 2) {
    return value;
  }
  // Inserta un guion antes del último caracter.
  return `${value.slice(0, -1)}-${value.slice(-1)}`;
};

watch(() => formData.value.rut, (newValue, oldValue) => {
  // Si el usuario está borrando, no reformatear para evitar comportamientos extraños.
  if (oldValue && newValue.length < oldValue.length) {
    rutError.value = validateRut(newValue);
    return;
  }

  const cleanRut = (newValue || '').replace(/[^0-9kK]/gi, '');
  const formattedRut = formatRut(cleanRut);

  formData.value.rut = formattedRut;
  rutError.value = validateRut(formattedRut);
});

watch(() => formData.value.correo, (newEmail) => { emailError.value = validateEmail(newEmail) });

const validatePassword = (pwd) => {
  if (registrationMethod.value !== 'email') return ''
  if (!pwd) return 'La contraseña es obligatoria.'
  if (pwd.length < 8) return 'La contraseña debe tener al menos 8 caracteres.'
  return ''
}

const validatePasswordConfirm = (pwd2) => {
  if (registrationMethod.value !== 'email') return ''
  if (!pwd2) return 'Confirma la contraseña.'
  if (pwd2 !== password.value) return 'Las contraseñas no coinciden.'
  return ''
}

watch(password, (newPwd) => {
  passwordError.value = validatePassword(newPwd)
  // Revalidar confirmación
  passwordConfirmError.value = validatePasswordConfirm(passwordConfirm.value)
})

watch(passwordConfirm, (newPwd2) => {
  passwordConfirmError.value = validatePasswordConfirm(newPwd2)
})

watch(registrationMethod, async (mode) => {
  // Limpieza y control de cámara al cambiar el modo
  passwordError.value = ''
  passwordConfirmError.value = ''

  if (mode === 'email') {
    // Detener cámara y limpiar captura
    if (stream.value) stream.value.getTracks().forEach(t => t.stop())
    stream.value = null
    isCameraActive.value = false
    retryCapture()
  } else {
    // Limpiar contraseñas y activar cámara
    password.value = ''
    passwordConfirm.value = ''
    await startCamera()
  }
})

// --- LÓGICA DE CÁMARA MEJORADA ---
const startCamera = async () => {
  try {
    console.log('🎥 Iniciando cámara...')

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
      console.log('Cámara iniciada correctamente')
      console.log('Stream info:', {
        active: stream.value.active,
        tracks: stream.value.getTracks().length
      })
    }
  } catch (error) {
    console.error('❌ Error al acceder a la cámara:', error)
    alert('No se pudo acceder a la cámara. Verifica los permisos del navegador.')
  }
}

const captureImage = () => {
  if (!videoElement.value || !canvasElement.value) return

  const canvas = canvasElement.value
  const video = videoElement.value

  canvas.width = video.videoWidth
  canvas.height = video.videoHeight

  const ctx = canvas.getContext('2d')
  ctx.translate(canvas.width, 0)
  ctx.scale(-1, 1)
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

  canvas.toBlob((blob) => {
    capturedImage.value = blob
    capturedImageURL.value = URL.createObjectURL(blob)
    showPreview.value = true

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
    let result

    if (registrationMethod.value === 'email') {
      // Registro alternativo por correo/contraseña
      const payload = {
        rut: formData.value.rut,
        nombres: formData.value.nombres,
        apellidos: formData.value.apellidos,
        correo: formData.value.correo,
        rol: formData.value.rol,
        carrera: formData.value.carrera || '',
        password: password.value,
      }

      result = await authService.registerUserWithEmail(payload)
      console.log('Resultado:', result)
      alert(`Registro completado. Ya puedes iniciar sesión con tu correo.`)
      router.push('/')
      return
    }

    // Registro principal por reconocimiento facial
    const data = new FormData()
    data.append('image', capturedImage.value, 'face.jpg')
    data.append('rut', formData.value.rut)
    data.append('nombres', formData.value.nombres)
    data.append('apellidos', formData.value.apellidos)
    data.append('correo', formData.value.correo)
    data.append('rol', formData.value.rol)

    if (formData.value.carrera) {
      data.append('carrera', formData.value.carrera)
    }

    result = await authService.registerUserWithFace(data)
    console.log('Resultado:', result)

    const mensaje = result.created
      ? `¡Bienvenido ${formData.value.nombres}! Tu registro biométrico fue completado exitosamente.`
      : `¡Perfecto ${formData.value.nombres}! Tu información y datos biométricos fueron actualizados.`

    alert(mensaje)
    router.push('/')

  } catch (error) {
    console.error('Error en registro:', error)
    alert(`Error: ${error.message}`)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(async () => {
  await loadInitialData()
  if (registrationMethod.value === 'face') startCamera()
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
