<template>
  <div class="p-8">
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
        <p class="text-green-400 text-3xl font-bold">
          {{ contarPorEstado('activo') }}
        </p>
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
        <p class="text-red-400 text-3xl font-bold">
          {{ contarPorEstado('vencido') }}
        </p>
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
        <p class="text-gray-400 text-3xl font-bold">
          {{ contarPorEstado('completado') }}
        </p>
      </div>
    </div>

    <!-- FILTRO POR ESTADO -->
    <div class="flex justify-between items-center mb-8">
      <select v-model="filtroEstado"
        class="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-red-500">
        <option value="todos">Todos</option>
        <option value="activo">Activos</option>
        <option value="vencido">Vencidos</option>
        <option value="completado">Completados</option>
      </select>
    </div>

    <!-- TABLA DE PRÉSTAMOS -->
    <div>
      <!-- SIN DATOS -->
      <div v-if="prestamosFiltrados.length === 0"
        class="bg-gray-800 rounded-xl border border-gray-700 p-12 text-center">
        <div class="text-6xl mb-4">📦</div>
        <p class="text-gray-400 text-lg">No hay préstamos para mostrar</p>
        <p class="text-gray-500 text-sm mt-2">Los préstamos aparecerán aquí cuando se realicen</p>
      </div>

      <!-- CON DATOS -->
      <div v-else class="bg-gray-800 rounded-xl overflow-hidden border border-gray-700">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-700">
              <tr>
                <th class="px-6 py-4 text-left text-gray-300 font-semibold text-sm">ID</th>
                <th class="px-6 py-4 text-left text-gray-300 font-semibold text-sm">Usuario</th>
                <th class="px-6 py-4 text-left text-gray-300 font-semibold text-sm">Herramienta</th>
                <th class="px-6 py-4 text-left text-gray-300 font-semibold text-sm">Fecha Préstamo</th>
                <th class="px-6 py-4 text-left text-gray-300 font-semibold text-sm">Fecha Esperada</th>
                <th class="px-6 py-4 text-left text-gray-300 font-semibold text-sm">Fecha Real</th>
                <th class="px-6 py-4 text-left text-gray-300 font-semibold text-sm">Estado</th>
                <th class="px-6 py-4 text-left text-gray-300 font-semibold text-sm">Condición Dev.</th>
                <th class="px-6 py-4 text-left text-gray-300 font-semibold text-sm">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="prestamo in prestamosFiltrados" :key="prestamo.id"
                class="border-t border-gray-700 hover:bg-gray-700/30 transition-colors">
                <!-- ID -->
                <td class="px-6 py-4">
                  <span class="text-white font-mono text-sm">#{{ prestamo.id }}</span>
                </td>

                <!-- Usuario -->
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div
                      class="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {{ prestamo.usuario_nombre.charAt(0) }}
                    </div>
                    <div class="text-white font-medium">{{ prestamo.usuario_nombre }}</div>
                  </div>
                </td>

                <!-- Herramienta -->
                <td class="px-6 py-4">
                  <div class="text-white">{{ prestamo.herramienta_nombre }}</div>
                  <div class="text-gray-500 text-xs">{{ prestamo.codigo_barras }}</div>
                </td>

                <!-- Fecha Préstamo -->
                <td class="px-6 py-4">
                  <div class="text-gray-400 text-sm">{{ prestamo.fecha_prestamo }}</div>
                </td>

                <!-- Fecha Esperada -->
                <td class="px-6 py-4">
                  <div class="text-gray-400 text-sm">{{ prestamo.fecha_devolucion_esperada }}</div>
                </td>

                <!-- Fecha Real -->
                <td class="px-6 py-4">
                  <div class="text-gray-400 text-sm">{{ prestamo.fecha_devolucion_real || '-' }}</div>
                </td>

                <!-- Estado -->
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold" :class="{
                    'bg-green-500/20 text-green-400 border border-green-500/50': prestamo.estado === 'activo',
                    'bg-red-500/20 text-red-400 border border-red-500/50': prestamo.estado === 'vencido',
                    'bg-gray-500/20 text-gray-400 border border-gray-500/50': prestamo.estado === 'completado'
                  }">
                    {{ prestamo.estado.toUpperCase() }}
                  </span>
                </td>

                <!-- Condición Devolución (NUEVA COLUMNA) -->
                <td class="px-6 py-4">
                  <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold"
                    :class="getCondicionClass(prestamo.condicion_devolucion)">
                    {{ prestamo.condicion_devolucion }}
                  </span>
                </td>

                <!-- Acciones -->
                <td class="px-6 py-4">
                  <button v-if="prestamo.estado !== 'completado'"
                    @click="alert('Marcar como devuelto: #' + prestamo.id)"
                    class="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:scale-105 active:scale-95">
                    Devolver
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
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// DATOS FALSOS (MOCK DATA)
const prestamos = ref([
  {
    id: 1,
    usuario_nombre: 'Juan Pérez',
    herramienta_nombre: 'Taladro Dewalt DCD771',
    codigo_barras: 'TLD-001',
    fecha_prestamo: '25/11/2024 09:30',
    fecha_devolucion_esperada: '02/12/2024 18:00',
    fecha_devolucion_real: null,
    estado: 'activo',
    condicion_devolucion: 'Sin Estado'
  },
  {
    id: 2,
    usuario_nombre: 'María González',
    herramienta_nombre: 'Sierra Circular Makita',
    codigo_barras: 'SRC-005',
    fecha_prestamo: '20/11/2024 14:15',
    fecha_devolucion_esperada: '27/11/2024 18:00',
    fecha_devolucion_real: null,
    estado: 'vencido',
    condicion_devolucion: 'Sin Estado'
  },
  {
    id: 3,
    usuario_nombre: 'Carlos Rodríguez',
    herramienta_nombre: 'Multímetro Digital',
    codigo_barras: 'MLT-012',
    fecha_prestamo: '15/11/2024 10:00',
    fecha_devolucion_esperada: '22/11/2024 18:00',
    fecha_devolucion_real: '21/11/2024 16:45',
    estado: 'completado',
    condicion_devolucion: 'Bueno'
  },
  {
    id: 4,
    usuario_nombre: 'Ana Martínez',
    herramienta_nombre: 'Soldador Eléctrico',
    codigo_barras: 'SLD-008',
    fecha_prestamo: '26/11/2024 11:20',
    fecha_devolucion_esperada: '03/12/2024 18:00',
    fecha_devolucion_real: null,
    estado: 'activo',
    condicion_devolucion: 'Sin Estado'
  },
  {
    id: 5,
    usuario_nombre: 'Pedro Silva',
    herramienta_nombre: 'Llave Impacto Neumática',
    codigo_barras: 'LLV-015',
    fecha_prestamo: '18/11/2024 08:45',
    fecha_devolucion_esperada: '25/11/2024 18:00',
    fecha_devolucion_real: null,
    estado: 'vencido',
    condicion_devolucion: 'Sin Estado'
  },
  {
    id: 6,
    usuario_nombre: 'Laura Torres',
    herramienta_nombre: 'Pulidora Angular Bosch',
    codigo_barras: 'PLD-020',
    fecha_prestamo: '10/11/2024 13:30',
    fecha_devolucion_esperada: '17/11/2024 18:00',
    fecha_devolucion_real: '17/11/2024 15:20',
    estado: 'completado',
    condicion_devolucion: 'Excelente'
  },
  {
    id: 7,
    usuario_nombre: 'Diego Ramírez',
    herramienta_nombre: 'Compresor de Aire',
    codigo_barras: 'CMP-003',
    fecha_prestamo: '27/11/2024 09:00',
    fecha_devolucion_esperada: '04/12/2024 18:00',
    fecha_devolucion_real: null,
    estado: 'activo',
    condicion_devolucion: 'Sin Estado'
  },
  {
    id: 8,
    usuario_nombre: 'Sofía Vargas',
    herramienta_nombre: 'Calibrador Digital',
    codigo_barras: 'CLB-018',
    fecha_prestamo: '12/11/2024 10:15',
    fecha_devolucion_esperada: '19/11/2024 18:00',
    fecha_devolucion_real: '19/11/2024 17:30',
    estado: 'completado',
    condicion_devolucion: 'Regular'
  }
])

const filtroEstado = ref('todos')

// COMPUTED
const prestamosFiltrados = computed(() => {
  if (filtroEstado.value === 'todos') {
    return prestamos.value
  }
  return prestamos.value.filter(p => p.estado === filtroEstado.value)
})

const contarPorEstado = (estado) => {
  return prestamos.value.filter(p => p.estado === estado).length
}

// HELPER PARA CLASES DE CONDICIÓN DEVOLUCIÓN
const getCondicionClass = (condicion) => {
  switch (condicion) {
    case 'Excelente':
      return 'bg-green-500/20 text-green-400 border border-green-500/50'
    case 'Bueno':
      return 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
    case 'Regular':
      return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
    case 'Defectuoso':
    case 'Dañado':
      return 'bg-red-500/20 text-red-400 border border-red-500/50'
    default:
      return 'bg-gray-700/50 text-gray-400 border border-gray-600/50' // Sin Estado
  }
}
</script>
