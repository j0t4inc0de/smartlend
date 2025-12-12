<template>
  <div class="p-8">
    <!-- HEADER CON BUSCADOR -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">

      <!-- Estado de conexión -->
      <div>
        <div v-if="loading"
          class="flex items-center gap-2 bg-blue-500/20 border border-blue-500/30 rounded-lg px-3 py-1">
          <div class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
          <span class="text-blue-300 text-xs font-medium">Cargando...</span>
        </div>

        <div v-else-if="error"
          class="flex items-center gap-2 bg-red-500/20 border border-red-500/30 rounded-lg px-3 py-1">
          <div class="w-2 h-2 rounded-full bg-red-500"></div>
          <span class="text-red-300 text-xs font-medium">Error de conexión</span>
        </div>

        <div v-else class="flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-lg px-3 py-1">
          <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span class="text-green-300 text-xs font-medium">Conectado</span>
        </div>
      </div>

      <!-- Controles -->
      <div class="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">

        <!-- Buscador -->
        <div class="relative flex-1 md:w-64">
          <input v-model="busqueda" type="text" placeholder="Buscar por código o usuario..."
            class="w-full bg-gray-800 text-white pl-10 pr-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm" />
          <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <!-- Filtro de estado -->
        <select v-model="filtroEstado"
          class="bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm">
          <option value="todos">Todos ({{ prestamos.length }})</option>
          <option value="activo">Activos ({{ contarPorEstado('activo') }})</option>
          <option value="vencido">Vencidos ({{ contarPorEstado('vencido') }})</option>
          <option value="completado">Completados ({{ contarPorEstado('completado') }})</option>
        </select>

        <!-- Botón recargar -->
        <button @click="recargarPrestamos" :disabled="loading"
          class="p-2 rounded-lg bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-colors disabled:opacity-50 text-gray-300 hover:text-white">
          <svg class="w-5 h-5" :class="{ 'animate-spin': loading }" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>
    </div>

    <!-- MENSAJE DE ERROR -->
    <div v-if="error" class="mb-6 bg-red-500/10 border border-red-500/50 rounded-lg p-4">
      <div class="flex items-start gap-3">
        <svg class="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <h4 class="text-red-200 font-medium">Error de conexión</h4>
          <p class="text-red-300 text-sm mt-1">{{ error }}</p>
        </div>
      </div>
    </div>

    <!-- ESTADÍSTICAS RÁPIDAS -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div class="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-green-500/50 transition-colors">
        <div class="flex items-center justify-between mb-2">
          <p class="text-gray-400 text-sm">Activos</p>
          <div class="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p class="text-green-400 text-3xl font-bold">{{ contarPorEstado('activo') }}</p>
      </div>

      <div class="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-red-500/50 transition-colors">
        <div class="flex items-center justify-between mb-2">
          <p class="text-gray-400 text-sm">Vencidos</p>
          <div class="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p class="text-red-400 text-3xl font-bold">{{ contarPorEstado('vencido') }}</p>
      </div>

      <div class="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-500/50 transition-colors">
        <div class="flex items-center justify-between mb-2">
          <p class="text-gray-400 text-sm">Completados</p>
          <div class="w-10 h-10 bg-gray-500/20 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <p class="text-gray-400 text-3xl font-bold">{{ contarPorEstado('completado') }}</p>
      </div>
    </div>

    <!-- TABLA DE PRÉSTAMOS -->
    <div>
      <!-- LOADING SKELETON -->
      <div v-if="loading && prestamos.length === 0" class="bg-gray-800 rounded-xl border border-gray-700">
        <div class="p-8 space-y-4">
          <div v-for="i in 5" :key="i" class="animate-pulse flex space-x-4">
            <div class="rounded-full bg-gray-700 h-10 w-10"></div>
            <div class="flex-1 space-y-2 py-1">
              <div class="h-4 bg-gray-700 rounded w-3/4"></div>
              <div class="h-4 bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- SIN DATOS -->
      <div v-else-if="prestamosFiltrados.length === 0"
        class="bg-gray-800 rounded-xl border border-gray-700 p-12 text-center">
        <div class="text-6xl mb-4">📦</div>
        <p class="text-gray-400 text-lg">No hay préstamos para mostrar</p>
      </div>

      <!-- CON DATOS -->
      <div v-else class="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-700">
              <tr>
                <th class="px-6 py-4 text-left text-gray-300 font-semibold text-sm">Código</th>
                <th class="px-6 py-4 text-left text-gray-300 font-semibold text-sm">Usuario</th>
                <th class="px-6 py-4 text-left text-gray-300 font-semibold text-sm">Herramienta</th>
                <th class="px-6 py-4 text-left text-gray-300 font-semibold text-sm">Fecha Préstamo</th>
                <th class="px-6 py-4 text-left text-gray-300 font-semibold text-sm">Fecha Esperada</th>
                <th class="px-6 py-4 text-left text-gray-300 font-semibold text-sm">Estado</th>
                <th class="px-6 py-4 text-left text-gray-300 font-semibold text-sm">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="prestamo in prestamosFiltrados" :key="prestamo.id_prestamo"
                class="border-t border-gray-700 hover:bg-gray-700/30 transition-colors">

                <!-- Código -->
                <td class="px-6 py-4">
                  <span class="text-white font-mono text-sm font-bold bg-gray-700 px-2 py-1 rounded">
                    {{ prestamo.codigo }}
                  </span>
                </td>

                <!-- Usuario -->
                <td class="px-6 py-4">
                  <div v-if="prestamo.usuario_data" class="flex items-center gap-3">
                    <div
                      class="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {{ prestamo.usuario_data.nombres?.charAt(0) || '?' }}
                    </div>
                    <div>
                      <div class="text-white font-medium">
                        {{ prestamo.usuario_data.nombres }} {{ prestamo.usuario_data.apellidos }}
                      </div>
                      <div class="text-gray-500 text-xs">{{ prestamo.usuario_data.correo }}</div>
                    </div>
                  </div>
                  <div v-else class="text-gray-500 text-sm">Cargando...</div>
                </td>

                <!-- Herramienta -->
                <td class="px-6 py-4">
                  <div v-if="prestamo.tipo_herramienta_data" class="flex items-center gap-2">
                    <div class="text-white">{{ prestamo.tipo_herramienta_data.nombre }}</div>
                    <button @click="abrirModalHerramientas(prestamo)"
                      class="text-xs text-blue-400 hover:text-blue-300 underline">
                      ({{ prestamo.herramientas_detalle?.length || 0 }})
                    </button>
                  </div>
                  <div v-else class="text-gray-500 text-sm">Cargando...</div>
                </td>

                <!-- Fecha Préstamo -->
                <td class="px-6 py-4">
                  <div class="text-gray-400 text-sm">{{ prestamo.fecha_prestamo }}</div>
                </td>

                <!-- Fecha Esperada -->
                <td class="px-6 py-4">
                  <div class="text-gray-400 text-sm">{{ prestamo.fecha_devolucion_esperada }}</div>
                </td>

                <!-- Estado -->
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold" :class="{
                    'bg-green-500/20 text-green-400 border border-green-500/50': prestamo.estado === 'activo',
                    'bg-red-500/20 text-red-400 border border-red-500/50': prestamo.estado === 'vencido',
                    'bg-gray-500/20 text-gray-400 border border-gray-500/50': prestamo.estado === 'completado'
                  }">
                    {{ prestamo.estado?.toUpperCase() || 'DESCONOCIDO' }}
                  </span>
                </td>

                <!-- Acciones -->
                <td class="px-6 py-4">
                  <button v-if="prestamo.estado !== 'completado'" @click="abrirModalDevolucion(prestamo)"
                    :disabled="procesandoDevolucion === prestamo.id_prestamo"
                    class="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                    <span v-if="procesandoDevolucion === prestamo.id_prestamo"
                      class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    <span>{{ procesandoDevolucion === prestamo.id_prestamo ? 'Procesando...' : 'Devolver' }}</span>
                  </button>

                  <span v-else class="text-gray-500 text-sm flex items-center gap-1">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd" />
                    </svg>
                    Completado
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- MODAL DE HERRAMIENTAS -->
    <div v-if="modalHerramientas" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div class="bg-gray-800 rounded-xl p-6 max-w-2xl w-full border border-gray-700 max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold text-white">Herramientas del Préstamo</h3>
          <button @click="cerrarModalHerramientas" class="text-gray-400 hover:text-white">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div v-if="prestamoSeleccionadoHerramientas" class="space-y-3">
          <div v-for="herramienta in prestamoSeleccionadoHerramientas.herramientas_detalle"
            :key="herramienta.id_herramienta" class="bg-gray-700 rounded-lg p-4 flex items-center gap-4">
            <img v-if="herramienta.imagen" :src="herramienta.imagen"
              class="w-16 h-16 rounded-lg object-cover bg-gray-600" @error="herramienta.imagen = null" />
            <div v-else class="w-16 h-16 rounded-lg bg-gray-600 flex items-center justify-center">
              <svg class="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-white font-medium">Código: {{ herramienta.codigo_barras }}</p>
              <p class="text-gray-400 text-sm">Estado: {{ herramienta.estado_herramienta }}</p>
              <p class="text-gray-500 text-xs">Adquirida: {{ new
                Date(herramienta.fecha_adquisicion).toLocaleDateString('es-CL') }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL DE DEVOLUCIÓN -->
    <div v-if="modalDevolucion" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div class="bg-gray-800 rounded-xl p-6 max-w-md w-full border border-gray-700">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold text-white">Registrar Devolución</h3>
          <button @click="cerrarModalDevolucion" class="text-gray-400 hover:text-white">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div v-if="prestamoSeleccionado" class="space-y-4">
          <!-- Info del préstamo -->
          <div class="bg-gray-700 rounded-lg p-4">
            <p class="text-white font-medium mb-2">Código: {{ prestamoSeleccionado.codigo }}</p>
            <p class="text-gray-400 text-sm">{{ prestamoSeleccionado.herramientas_detalle?.length || 0 }} herramienta(s)
            </p>
          </div>

          <!-- Estado de devolución -->
          <div>
            <label class="block text-sm font-medium text-white mb-2">Estado de devolución</label>
            <select v-model="estadoDevolucion"
              class="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500">
              <option value="Excelente">Excelente</option>
              <option value="Bueno">Bueno</option>
              <option value="Regular">Regular</option>
              <option value="Defectuoso">Defectuoso</option>
              <option value="Dañado">Dañado</option>
            </select>
          </div>

          <!-- Observaciones -->
          <div>
            <label class="block text-sm font-medium text-white mb-2">Observaciones (opcional)</label>
            <textarea v-model="observaciones"
              class="w-full bg-gray-700 text-white rounded-lg px-3 py-2 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              rows="3" placeholder="Describe cualquier daño o problema observado..."></textarea>
          </div>

          <!-- Botones -->
          <div class="flex gap-3 pt-4">
            <button @click="cerrarModalDevolucion"
              class="flex-1 px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors">
              Cancelar
            </button>
            <button @click="confirmarDevolucion" :disabled="procesandoDevolucion"
              class="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {{ procesandoDevolucion ? 'Procesando...' : 'Confirmar Devolución' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { prestamosService } from '@/services/prestamosService'

// Estados reactivos
const prestamos = ref([])
const filtroEstado = ref('todos')
const busqueda = ref('')
const loading = ref(true)
const error = ref('')
const procesandoDevolucion = ref(null)

// Estados para modal de herramientas
const modalHerramientas = ref(false)
const prestamoSeleccionadoHerramientas = ref(null)

// Estados para modal de devolución
const modalDevolucion = ref(false)
const prestamoSeleccionado = ref(null)
const estadoDevolucion = ref('Bueno')
const observaciones = ref('')

// Cargar datos de usuario y tipo de herramienta para cada préstamo
const enriquecerPrestamos = async () => {
  for (const prestamo of prestamos.value) {
    // Cargar usuario
    if (!prestamo.usuario_data) {
      prestamo.usuario_data = await prestamosService.getUsuario(prestamo.id_usuario)
    }
    // Cargar tipo de herramienta
    if (!prestamo.tipo_herramienta_data) {
      prestamo.tipo_herramienta_data = await prestamosService.getTipoHerramienta(prestamo.id_tipo_herramienta)
    }
  }
}

// Función principal de carga
const cargarPrestamos = async (useCache = true) => {
  try {
    loading.value = true
    error.value = ''

    prestamos.value = await prestamosService.getPrestamos(useCache)
    await enriquecerPrestamos()

    console.log('✅ Préstamos cargados:', prestamos.value.length)
  } catch (err) {
    console.error('❌ Error al cargar préstamos:', err)
    error.value = err.message || 'Error al cargar los préstamos'
  } finally {
    loading.value = false
  }
}

// Forzar recarga
const recargarPrestamos = () => {
  cargarPrestamos(false)
}

// Modal de herramientas
const abrirModalHerramientas = (prestamo) => {
  prestamoSeleccionadoHerramientas.value = prestamo
  modalHerramientas.value = true
}

const cerrarModalHerramientas = () => {
  modalHerramientas.value = false
  prestamoSeleccionadoHerramientas.value = null
}

// Modal de devolución
const abrirModalDevolucion = (prestamo) => {
  prestamoSeleccionado.value = prestamo
  estadoDevolucion.value = 'Bueno'
  observaciones.value = ''
  modalDevolucion.value = true
}

const cerrarModalDevolucion = () => {
  modalDevolucion.value = false
  prestamoSeleccionado.value = null
  estadoDevolucion.value = 'Bueno'
  observaciones.value = ''
}

const confirmarDevolucion = async () => {
  if (!prestamoSeleccionado.value) return

  try {
    procesandoDevolucion.value = prestamoSeleccionado.value.id_prestamo

    await prestamosService.marcarComoDevuelto(
      prestamoSeleccionado.value.id_prestamo,
      estadoDevolucion.value,
      observaciones.value
    )

    await cargarPrestamos(false)
    cerrarModalDevolucion()

    console.log('✅ Préstamo devuelto exitosamente')
  } catch (err) {
    console.error('❌ Error al marcar devolución:', err)
    alert('Error al procesar la devolución: ' + (err.message || 'Error desconocido'))
  } finally {
    procesandoDevolucion.value = null
  }
}

// Computed - Filtrado y búsqueda
const prestamosFiltrados = computed(() => {
  let resultado = prestamos.value

  // Filtrar por estado
  if (filtroEstado.value !== 'todos') {
    resultado = resultado.filter(p => p.estado === filtroEstado.value)
  }

  // Buscar por código o usuario
  if (busqueda.value.trim()) {
    const termino = busqueda.value.toLowerCase()
    resultado = resultado.filter(p => {
      const codigo = p.codigo?.toLowerCase() || ''
      const usuario = `${p.usuario_data?.nombres || ''} ${p.usuario_data?.apellidos || ''}`.toLowerCase()
      return codigo.includes(termino) || usuario.includes(termino)
    })
  }

  return resultado
})

const contarPorEstado = (estado) => {
  return prestamos.value.filter(p => p.estado === estado).length
}

// Lifecycle
onMounted(async () => {
  await cargarPrestamos()
})
</script>

<style scoped>
@keyframes pulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 1.5s ease-in-out infinite;
}
</style>
