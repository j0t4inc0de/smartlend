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
          <option value="Pendiente">Pendientes ({{ contarPorEstado('Pendiente') }})</option>
          <option value="Entregado">Entregados ({{ contarPorEstado('Entregado') }})</option>
          <option value="Vencido">Vencidos ({{ contarPorEstado('Vencido') }})</option>
          <option value="Finalizado">Finalizados ({{ contarPorEstado('Finalizado') }})</option>
          <option value="Expirado">Expirados ({{ contarPorEstado('Expirado') }})</option>
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
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <!-- Pendientes -->
      <div class="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-yellow-500/50 transition-colors">
        <div class="flex items-center justify-between mb-2">
          <p class="text-gray-400 text-sm">Pendientes</p>
          <div class="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <p class="text-yellow-400 text-3xl font-bold">{{ contarPorEstado('Pendiente') }}</p>
      </div>

      <!-- Entregados -->
      <div class="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-blue-500/50 transition-colors">
        <div class="flex items-center justify-between mb-2">
          <p class="text-gray-400 text-sm">Entregados</p>
          <div class="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
        </div>
        <p class="text-blue-400 text-3xl font-bold">{{ contarPorEstado('Entregado') }}</p>
      </div>

      <!-- Vencidos -->
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
        <p class="text-red-400 text-3xl font-bold">{{ contarPorEstado('Vencido') }}</p>
      </div>

      <!-- Finalizados -->
      <div class="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-green-500/50 transition-colors">
        <div class="flex items-center justify-between mb-2">
          <p class="text-gray-400 text-sm">Finalizados</p>
          <div class="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
            <svg class="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <p class="text-green-400 text-3xl font-bold">{{ contarPorEstado('Finalizado') }}</p>
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
                    'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50': prestamo.estado_prestamo === 'Pendiente',
                    'bg-blue-500/20 text-blue-400 border border-blue-500/50': prestamo.estado_prestamo === 'Entregado',
                    'bg-red-500/20 text-red-400 border border-red-500/50': prestamo.estado_prestamo === 'Vencido',
                    'bg-green-500/20 text-green-400 border border-green-500/50': prestamo.estado_prestamo === 'Finalizado',
                    'bg-gray-500/20 text-gray-400 border border-gray-500/50': prestamo.estado_prestamo === 'Expirado'
                  }">
                    {{ prestamo.estado_prestamo?.toUpperCase() || 'DESCONOCIDO' }}
                  </span>
                </td>

                <!-- Acciones -->
                <td class="px-6 py-4">
                  <!-- Pendiente: Marcar como entregado -->
                  <button v-if="prestamo.estado_prestamo === 'Pendiente'" @click="abrirModalEntrega(prestamo)"
                    class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
                    Entregar
                  </button>

                  <!-- Entregado o Vencido: Devolver -->
                  <button v-else-if="['Entregado', 'Vencido'].includes(prestamo.estado_prestamo)"
                    @click="abrirModalDevolucion(prestamo)"
                    class="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium">
                    Devolver
                  </button>

                  <!-- Finalizado o Expirado: Sin acciones -->
                  <span v-else class="text-gray-500 text-sm flex items-center gap-1">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clip-rule="evenodd" />
                    </svg>
                    {{ prestamo.estado_prestamo }}
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
      <div class="bg-gray-800 rounded-xl p-6 max-w-lg w-full border border-gray-700 max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-bold text-white">Herramientas del Préstamo</h3>
          <button @click="cerrarModalHerramientas" class="text-gray-400 hover:text-white">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div v-if="prestamoSeleccionadoHerramientas" class="space-y-3">
          <!-- Info general del préstamo -->
          <div class="bg-gray-700/50 rounded-lg p-3 mb-4">
            <p class="text-gray-400 text-xs uppercase tracking-wider mb-1">Código del Préstamo</p>

            <div class="flex items-center justify-between gap-3">
              <p class="text-white font-mono font-bold text-lg">
                {{ prestamoSeleccionadoHerramientas.codigo }}
              </p>

              <button @click="copiarCodigo(prestamoSeleccionadoHerramientas.codigo)" :class="[
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                codigoCopiado
                  ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                  : 'bg-gray-600 text-gray-300 hover:bg-gray-500 border border-gray-500'
              ]">
                <!-- Icono de check cuando está copiado -->
                <svg v-if="codigoCopiado" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>

                <!-- Icono de copiar cuando no está copiado -->
                <svg v-else class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>

                <span>{{ codigoCopiado ? '¡Copiado!' : 'Copiar' }}</span>
              </button>
            </div>

            <p class="text-gray-500 text-sm mt-1">
              Total: {{ prestamoSeleccionadoHerramientas.herramientas_detalle?.length || 0 }} herramienta(s)
            </p>
          </div>

          <!-- Lista de herramientas -->
          <div v-for="(herramienta, index) in prestamoSeleccionadoHerramientas.herramientas_detalle"
            :key="herramienta.id_herramienta"
            class="bg-gray-700 rounded-lg p-4 border border-gray-600 hover:border-gray-500 transition-colors">

            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center gap-2">
                <span class="bg-gray-600 text-gray-300 px-2 py-1 rounded text-xs font-bold">
                  #{{ index + 1 }}
                </span>
                <span class="text-white font-medium">
                  {{ getNombreTipo(herramienta.id_tipo_herramienta) }}
                </span>
              </div>
              <span :class="[
                'px-2 py-1 rounded text-xs font-semibold whitespace-nowrap',
                herramienta.estado_herramienta === 'Nuevo' ? 'bg-green-500/20 text-green-400 border border-green-500/50' :
                  herramienta.estado_herramienta === 'Excelente' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' :
                    herramienta.estado_herramienta === 'Bueno' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' :
                      herramienta.estado_herramienta === 'Regular' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' :
                        'bg-red-500/20 text-red-400 border border-red-500/50'
              ]">
                {{ herramienta.estado_herramienta }}
              </span>
            </div>

            <div class="space-y-1">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
                <span class="text-gray-400 text-sm">Código:</span>
                <span class="text-white font-mono font-bold">{{ herramienta.codigo_barras }}</span>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!prestamoSeleccionadoHerramientas?.herramientas_detalle?.length" class="text-center py-8">
          <svg class="w-12 h-12 text-gray-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p class="text-gray-500">No hay herramientas registradas</p>
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

const tiposHerramienta = ref([])
const tiposMap = ref({})

// Estados para modal de herramientas
const modalHerramientas = ref(false)
const prestamoSeleccionadoHerramientas = ref(null)
const codigoCopiado = ref(false)

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
    // Cargar tipo de herramienta principal (para mostrar en la tabla)
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

const cargarTiposHerramienta = async () => {
  tiposHerramienta.value = await prestamosService.getTodosLosTipos()

  // Crear mapa para acceso rápido
  tiposMap.value = {}
  tiposHerramienta.value.forEach(tipo => {
    tiposMap.value[tipo.id_tipo_herramienta] = tipo
  })

  console.log('✅ Tipos de herramienta cargados:', tiposHerramienta.value.length)
}

const getNombreTipo = (idTipo) => {
  return tiposMap.value[idTipo]?.nombre || 'Tipo Desconocido'
}

// Modal de herramientas
const abrirModalHerramientas = (prestamo) => {
  prestamoSeleccionadoHerramientas.value = prestamo
  codigoCopiado.value = false
  modalHerramientas.value = true
}

const cerrarModalHerramientas = () => {
  modalHerramientas.value = false
  prestamoSeleccionadoHerramientas.value = null
}

const copiarCodigo = async (codigo) => {
  try {
    await navigator.clipboard.writeText(codigo)
    codigoCopiado.value = true

    // Resetear después de 2 segundos
    setTimeout(() => {
      codigoCopiado.value = false
    }, 2000)
  } catch (err) {
    console.error('Error al copiar:', err)
    alert('No se pudo copiar el código')
  }
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
  await axios.post(
    `/operaciones/api/prestamos/${prestamo.id_prestamo}/devolver_herramientas/`,
    {
      codigos: codigosEscaneados.value,
      estados: {  // ← OPCIONAL
        "135791": estadosHerramientas.value["135791"] || "Bueno"
      }
    }
  )
}

// Computed - Filtrado y búsqueda
const prestamosFiltrados = computed(() => {
  let resultado = prestamos.value

  // Filtrar por estado
  if (filtroEstado.value !== 'todos') {
    resultado = resultado.filter(p => p.estado_prestamo === filtroEstado.value)
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
  return prestamos.value.filter(p => p.estado_prestamo === estado).length
}

// Lifecycle
onMounted(async () => {
  await cargarTiposHerramienta()
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
