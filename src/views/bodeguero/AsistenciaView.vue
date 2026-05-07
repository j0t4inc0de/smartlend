<template>
  <div class="p-6 min-h-screen text-white">
    <div class="max-w-2xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-2xl font-bold">Soporte Técnico</h1>
        <router-link
          to="/bodeguero/dashboard/prestamos"
          class="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm transition-colors"
        >
          Volver a Préstamos
        </router-link>
      </div>

      <form @submit.prevent="manejarEnvio" class="space-y-4">
        <div>
          <label class="block mb-1 text-sm text-gray-300">Rol del usuario:</label>
          <input
            v-model="formulario.rol"
            type="text"
            placeholder="Ej: bodeguero"
            class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label class="block mb-1 text-sm text-gray-300">Ventana actual:</label>
          <input
            v-model="formulario.ventana"
            type="text"
            placeholder="Ej: Reportes"
            class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label class="block mb-1 text-sm text-gray-300">Descripción del problema:</label>
          <textarea
            v-model="formulario.descripcion"
            placeholder="Explica tu problema aquí..."
            class="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 min-h-[120px]"
            required
          ></textarea>
        </div>

        <button
          type="submit"
          :disabled="cargando"
          class="w-full px-4 py-2 mt-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {{ cargando ? 'Enviando...' : 'Enviar Solicitud' }}
        </button>
      </form>

      <p
        v-if="mensajeExito"
        class="mt-4 p-3 bg-green-500/20 text-green-400 border border-green-500/50 rounded-lg"
      >
        {{ mensajeExito }}
      </p>
      <p
        v-if="mensajeError"
        class="mt-4 p-3 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg"
      >
        {{ mensajeError }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { soporteService } from '@/services/soporteService.js'

const router = useRouter()
const cargando = ref(false)
const mensajeExito = ref('')
const mensajeError = ref('')

const formulario = ref({
  rol: 'bodeguero',
  ventana: '',
  descripcion: '',
})

onMounted(() => {
  /* Captura la ruta anterior o la actual como contexto */
  const pathPrevio = window.history.state?.back || router.currentRoute.value.fullPath
  formulario.value.ventana = pathPrevio
})

const manejarEnvio = async () => {
  cargando.value = true
  mensajeExito.value = ''
  mensajeError.value = ''

  try {
    const respuesta = await soporteService.enviarTicket(formulario.value)

    mensajeExito.value = '¡Solicitud enviada correctamente!'
    // Limpiamos los campos, pero podemos conservar el rol y la ventana si lo deseas
    formulario.value = {
      rol: 'bodeguero',
      ventana: formulario.value.ventana,
      descripcion: '',
    }
  } catch (error) {
    mensajeError.value = error.message
  } finally {
    cargando.value = false
  }
}
</script>
