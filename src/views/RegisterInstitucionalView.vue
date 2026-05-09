<template>
  <div class="relative min-h-screen w-full overflow-hidden flex items-center justify-center p-4">
    <div class="absolute inset-0 pointer-events-none z-10">
      <div class="particles">
        <div v-for="n in 30" :key="n" class="particle"></div>
      </div>
    </div>
    <div class="absolute inset-0 z-0">
      <img
        src="@/assets/images/sede-background.jpg"
        alt="Sede Fondo"
        class="animate-ken-burns h-full w-full object-cover"
      />
      <div class="absolute inset-0 bg-black/70"></div>
    </div>

    <div class="relative z-20 w-full max-w-2xl animate-fade-in-up">
      <div
        class="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden p-6 md:p-8"
      >
        <div class="mb-8 text-center">
          <h1 class="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Registro Institucional
          </h1>
          <p class="text-gray-300 text-sm mt-2">Ingresa tu código de acceso para continuar</p>
        </div>

        <form @submit.prevent="manejarRegistro" class="space-y-5">
          <div class="group">
            <label
              class="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase tracking-wider group-focus-within:text-red-400 transition-colors"
              >Código de Acceso</label
            >
            <input
              v-model="formulario.codigoAcceso"
              type="text"
              placeholder="Ingresa tu código..."
              required
              class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 focus:bg-white/10 transition-all duration-300 text-center font-mono text-lg tracking-widest"
            />

            <p
              v-if="rolDetectado === 'estudiante'"
              class="text-green-400 text-xs mt-2 text-center font-semibold"
            >
              Código válido: Modo Estudiante
            </p>
            <p
              v-else-if="rolDetectado === 'docente'"
              class="text-blue-400 text-xs mt-2 text-center font-semibold"
            >
              Código válido: Modo Docente
            </p>
            <p
              v-else-if="formulario.codigoAcceso.length >= 9"
              class="text-red-400 text-xs mt-2 text-center"
            >
              Código no reconocido
            </p>
          </div>

          <div
            v-if="rolDetectado"
            class="space-y-5 animate-fade-in-up pt-4 border-t border-white/10"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div class="group">
                <label
                  class="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase tracking-wider"
                  >RUT</label
                >
                <input
                  v-model="formulario.rut"
                  type="text"
                  placeholder="12345678-9"
                  required
                  class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                />
              </div>

              <div class="group">
                <label
                  class="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase tracking-wider"
                  >Correo</label
                >
                <input
                  v-model="formulario.correo"
                  type="email"
                  placeholder="correo@inacapmail.cl"
                  required
                  class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                />
              </div>

              <div class="group">
                <label
                  class="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase tracking-wider"
                  >Nombres</label
                >
                <input
                  v-model="formulario.nombres"
                  type="text"
                  required
                  class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                />
              </div>

              <div class="group">
                <label
                  class="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase tracking-wider"
                  >Apellidos</label
                >
                <input
                  v-model="formulario.apellidos"
                  type="text"
                  required
                  class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                />
              </div>

              <div class="group col-span-1 md:col-span-2">
                <label
                  class="block text-xs font-medium text-gray-400 mb-1 ml-1 uppercase tracking-wider"
                  >Contraseña</label
                >
                <input
                  v-model="formulario.password"
                  type="password"
                  required
                  class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white"
                />
              </div>

              <div v-if="rolDetectado === 'estudiante'" class="group col-span-1 md:col-span-2">
                <label
                  class="block text-xs font-medium text-gray mb-1 ml-1 uppercase tracking-wider text-red-400"
                >
                  Carrera (Obligatorio)
                </label>
                <select
                  v-model="formulario.idCarrera"
                  required
                  class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none"
                >
                  <option value="" disabled class="bg-gray-900">Selecciona tu carrera...</option>
                  <option
                    v-for="c in carreras"
                    :key="c.id_carrera"
                    :value="c.id_carrera"
                    class="bg-gray-900"
                  >
                    {{ c.nombre }}
                  </option>
                </select>
              </div>
            </div>

            <div class="pt-6 flex justify-between items-center">
              <router-link to="/" class="text-sm text-gray-400 hover:text-white transition-colors"
                >Volver al inicio</router-link
              >
              <button
                type="submit"
                :disabled="cargando"
                class="bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-xl font-bold transition-all disabled:opacity-50"
              >
                {{ cargando ? 'Registrando...' : 'Finalizar Registro' }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/authService'
import { alertaService } from '@/services/alertasService'

const router = useRouter()
const cargando = ref(false)
const carreras = ref([])

// Estado del formulario (Cumpliendo reglas del backend: NO id_rol)
const formulario = ref({
  codigoAcceso: '',
  rut: '',
  nombres: '',
  apellidos: '',
  correo: '',
  password: '',
  idCarrera: '',
})

// Computada reactiva que evalúa el código de acceso en tiempo real
const rolDetectado = computed(() => {
  const codigo = formulario.value.codigoAcceso.trim()
  if (codigo === '027072003') return 'estudiante'
  if (codigo === '015072003') return 'docente'
  return null
})

// Cargar carreras (necesario si entra un estudiante)
onMounted(async () => {
  try {
    carreras.value = await authService.getCarreras()
  } catch (error) {
    console.error('Error al cargar carreras:', error)
  }
})

const manejarRegistro = async () => {
  cargando.value = true
  try {
    // Si es docente, nos aseguramos de no enviar carrera
    if (rolDetectado.value === 'docente') {
      formulario.value.idCarrera = ''
    }

    // Llamamos al nuevo servicio
    const respuesta = await authService.registrarInstitucional(formulario.value)

    // Mostramos mensaje de éxito del backend
    alertaService.success(respuesta.mensaje || '¡Registro exitoso!')
    router.push('/') // Volvemos al inicio o al login
  } catch (error) {
    // Mostramos el error del backend (por ejemplo: código inválido, o falta carrera)
    const mensajeError = error.error || error.detail || 'Error al intentar registrar el usuario.'
    alertaService.error(mensajeError)
  } finally {
    cargando.value = false
  }
}
</script>

<style scoped>
/* Animaciones y partículas base de tu diseño */
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
  animation: fade-in-up 0.5s ease-out forwards;
}
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
.particle:nth-child(3n + 1) {
  left: 50%;
  animation-delay: -12s;
}
.particle:nth-child(3n + 2) {
  left: 80%;
  animation-delay: -8s;
}
</style>
