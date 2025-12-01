<template>
  <div class="flex h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800">

    <!-- SIDEBAR -->
    <aside :class="[
      'bg-gradient-to-b from-gray-800 to-gray-900 text-white flex flex-col transition-all duration-300 ease-in-out shadow-2xl border-r border-gray-700/50',
      isCollapsed ? 'w-20' : 'w-72'
    ]">

      <!-- HEADER CON TOGGLE -->
      <div class="p-6 border-b border-gray-700/50">
        <div class="flex items-center justify-between">
          <!-- Título (solo visible cuando NO está colapsado) -->
          <div v-if="!isCollapsed" class="transition-all duration-300">
            <h1 class="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">
              SmartLend
            </h1>
            <p class="text-xs text-gray-400 mt-1">Panel de Control</p>
          </div>

          <!-- Botón Toggle (siempre visible) -->
          <button @click="isCollapsed = !isCollapsed" :class="[
            'p-2 rounded-lg hover:bg-gray-700/50 transition-all duration-200 group shrink-0',
            isCollapsed ? 'mx-auto' : ''
          ]">
            <svg class="w-6 h-6 text-gray-400 group-hover:text-white transition-transform duration-300"
              :class="{ 'rotate-180': isCollapsed }" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>

      <!-- MENÚ -->
      <nav class="flex-1 p-4 space-y-2">
        <!-- Préstamos -->
        <router-link to="/bodeguero/dashboard/prestamos" v-slot="{ isActive }" class="block">
          <div :class="[
            'flex items-center px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden',
            isCollapsed ? 'justify-center' : 'gap-3',
            isActive
              ? 'bg-gradient-to-r from-red-600 to-red-500 shadow-lg shadow-red-900/50'
              : 'hover:bg-gray-700/50 hover:translate-x-1'
          ]">
            <!-- Icono -->
            <svg class="w-6 h-6 shrink-0 z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <!-- Texto -->
            <span v-if="!isCollapsed" class="font-medium z-10">Préstamos</span>
            <!-- Badge con número real -->
            <span v-if="!isCollapsed && prestamosActivos > 0"
              class="ml-auto bg-white/20 text-xs px-2 py-1 rounded-full z-10">
              {{ prestamosActivos }}
            </span>
          </div>
        </router-link>

        <!-- Inventario -->
        <router-link to="/bodeguero/dashboard/inventario" v-slot="{ isActive }" class="block">
          <div :class="[
            'flex items-center px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden',
            isCollapsed ? 'justify-center' : 'gap-3',
            isActive
              ? 'bg-gradient-to-r from-red-600 to-red-500 shadow-lg shadow-red-900/50'
              : 'hover:bg-gray-700/50 hover:translate-x-1'
          ]">
            <svg class="w-6 h-6 shrink-0 z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span v-if="!isCollapsed" class="font-medium z-10">Inventario</span>
          </div>
        </router-link>

        <!-- Usuarios -->
        <router-link to="/bodeguero/dashboard/usuarios" v-slot="{ isActive }" class="block">
          <div :class="[
            'flex items-center px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden',
            isCollapsed ? 'justify-center' : 'gap-3',
            isActive
              ? 'bg-gradient-to-r from-red-600 to-red-500 shadow-lg shadow-red-900/50'
              : 'hover:bg-gray-700/50 hover:translate-x-1'
          ]">
            <svg class="w-6 h-6 shrink-0 z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
            </svg>
            <span v-if="!isCollapsed" class="font-medium z-10">Usuarios</span>
          </div>
        </router-link>

        <!-- Reportes -->
        <router-link to="/bodeguero/dashboard/reportes" v-slot="{ isActive }" class="block">
          <div :class="[
            'flex items-center px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden',
            isCollapsed ? 'justify-center' : 'gap-3',
            isActive
              ? 'bg-gradient-to-r from-red-600 to-red-500 shadow-lg shadow-red-900/50'
              : 'hover:bg-gray-700/50 hover:translate-x-1'
          ]">
            <svg class="w-6 h-6 shrink-0 z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span v-if="!isCollapsed" class="font-medium z-10">Reportes</span>
          </div>
        </router-link>
      </nav>

      <!-- USUARIO + LOGOUT -->
      <div class="p-4 border-t border-gray-700/50 space-y-3">

        <!-- Info Usuario -->
        <div :class="[
          'flex items-center p-3 rounded-xl transition-all duration-200',
          isCollapsed ? 'justify-center' : 'gap-3'
        ]">
          <!-- Avatar -->
          <div
            class="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center font-bold text-white shrink-0 shadow-lg">
            {{ authStore.user?.nombres?.charAt(0) || 'B' }}
          </div>

          <!-- Info -->
          <div v-if="!isCollapsed" class="flex-1 min-w-0">
            <p class="font-semibold text-sm text-white truncate">
              {{ authStore.fullName || 'Bodeguero' }}
            </p>
            <p class="text-xs text-gray-400 truncate">
              {{ authStore.user?.correo || 'bodeguero@inacap.cl' }}
            </p>
          </div>
        </div>

        <!-- Botón Logout -->
        <button @click="handleLogout" :class="[
          'w-full flex items-center px-4 py-3 rounded-xl font-medium transition-all duration-200',
          'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600',
          'shadow-lg shadow-red-900/50 hover:shadow-red-900/70 hover:scale-[1.02] active:scale-[0.98]',
          'group',
          isCollapsed ? 'justify-center' : 'gap-2'
        ]">
          <svg class="w-5 h-5 shrink-0 transition-transform duration-200 group-hover:translate-x-1" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span v-if="!isCollapsed">Cerrar Sesión</span>
        </button>

      </div>

    </aside>

    <!-- CONTENIDO PRINCIPAL -->
    <main class="flex-1 overflow-y-auto">

      <!-- Top Bar -->
      <div class="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700/50 px-8 py-4 sticky top-0 z-10">
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold text-white">{{ pageTitle }}</h2>

          <!-- Acciones rápidas -->
          <div class="flex items-center gap-4">
            <!-- Alertas -->
            <div v-if="alertasCount > 0" class="relative">
              <button @click="mostrarNotificaciones = !mostrarNotificaciones"
                class="p-2 rounded-lg hover:bg-gray-700/50 transition-colors group">
                <svg class="w-5 h-5 text-red-400 group-hover:text-red-300" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <!-- Badge (Solo si hay alertas) -->
                <span v-if="alertasCount > 0"
                  class="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center border-2 border-gray-800">
                  {{ alertasCount }}
                </span>
              </button>
              <div v-if="mostrarNotificaciones"
                class="absolute right-0 mt-2 w-96 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden">

                <!-- Header del modal -->
                <div
                  class="px-4 py-3 border-b border-gray-700 bg-gradient-to-r from-red-900/20 to-red-800/20 flex justify-between items-center">
                  <h3 class="text-sm font-bold text-white flex items-center gap-2">
                    <svg class="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 18.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    Préstamos Vencidos
                  </h3>
                  <button @click="mostrarNotificaciones = false"
                    class="text-xs text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-2 py-1 rounded transition-colors">
                    Cerrar
                  </button>
                </div>

                <!-- Loading de alertas -->
                <div v-if="loadingAlertas" class="p-4">
                  <div class="animate-pulse space-y-3">
                    <div v-for="i in 3" :key="i" class="flex space-x-3">
                      <div class="rounded-full bg-gray-700 h-8 w-8"></div>
                      <div class="flex-1 space-y-2">
                        <div class="h-4 bg-gray-700 rounded w-3/4"></div>
                        <div class="h-3 bg-gray-700 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Lista de alertas (SIN BOTONES DE RESOLVER) -->
                <div v-else-if="alertas.length > 0" class="max-h-80 overflow-y-auto">
                  <div v-for="alerta in alertas" :key="alerta.id_alerta"
                    class="p-4 border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">

                    <div class="flex items-start gap-3">
                      <!-- Avatar del usuario -->
                      <div
                        class="w-8 h-8 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {{ alerta.usuario_nombre?.charAt(0) || '?' }}
                      </div>

                      <div class="flex-1 min-w-0">
                        <!-- Usuario y herramienta -->
                        <p class="text-white text-sm font-medium truncate">
                          {{ alerta.usuario_nombre || 'Usuario desconocido' }}
                        </p>
                        <p class="text-gray-400 text-xs truncate">
                          {{ alerta.herramienta_nombre || 'Herramienta desconocida' }}
                        </p>

                        <!-- Tiempo vencido -->
                        <div class="flex items-center gap-2 mt-1">
                          <span
                            class="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/50">
                            {{ alerta.dias_vencido }} días vencido{{ alerta.dias_vencido !== 1 ? 's' : '' }}
                          </span>
                          <span class="text-gray-500 text-xs">
                            {{ alerta.fecha_formateada }}
                          </span>
                        </div>
                      </div>

                      <!-- Icono de advertencia (en lugar de botón resolver) -->
                      <div class="text-red-400">
                        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 18.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Sin alertas -->
                <div v-else class="p-6 text-center">
                  <p class="text-gray-400 text-sm">¡No hay alertas pendientes!</p>
                  <p class="text-gray-500 text-xs mt-1">Todos los préstamos están al día</p>
                </div>

                <!-- Footer solo informativo (SIN BOTONES DE RESOLVER) -->
                <div v-if="alertas.length > 0" class="px-4 py-3 border-t border-gray-700 bg-gray-900/50">
                  <div class="flex justify-between items-center">
                    <span class="text-xs text-gray-400">{{ alertas.length }} alerta{{ alertas.length !== 1 ? 's' : ''
                    }}</span>
                    <span class="text-xs text-gray-500">Se resuelven automáticamente al devolver</span>
                  </div>
                </div>
              </div>
              <!-- Fondo para cerrar al hacer clic fuera -->
              <div v-if="mostrarNotificaciones" @click="mostrarNotificaciones = false" class="fixed inset-0 z-40"></div>
            </div>

            <!-- Sistema Online -->
            <div class="flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-lg px-3 py-1">
              <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span class="text-green-300 text-xs font-medium">Sistema Online</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Router View -->
      <div class="p-8">
        <router-view />
      </div>

    </main>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useBodegueroAuthStore } from '@/stores/bodegueroAuthStore'
import { alertasService } from '@/services/alertasService'

const router = useRouter()
const route = useRoute()
const authStore = useBodegueroAuthStore()

const isCollapsed = ref(false)

// Estados reactivos para datos en tiempo real
const prestamosActivos = ref(0)
const alertas = ref([])
const loadingAlertas = ref(false)
const mostrarNotificaciones = ref(false)

// Timer para actualización automática
let intervalId = null

// Contador basado en el array real de alertas
const alertasCount = computed(() => alertas.value.length)

// Título dinámico basado en la ruta
const pageTitle = computed(() => {
  const titles = {
    'dashboard-prestamos': 'Gestión de Préstamos',
    'dashboard-inventario': 'Gestión de Inventario',
    'dashboard-usuarios': 'Gestión de Usuarios',
    'dashboard-reportes': 'Reportes y Análisis'
  }
  return titles[route.name] || 'Dashboard'
})

// Cargar alertas reales
const cargarAlertas = async () => {
  try {
    loadingAlertas.value = true
    console.log('🔍 Cargando alertas...')

    alertas.value = await alertasService.getAlertasEnriquecidas()

    console.log('✅ Alertas cargadas:', alertas.value.length)
    console.log('📊 Alertas:', alertas.value)

  } catch (error) {
    console.error('❌ Error al cargar alertas:', error)
    alertas.value = []
  } finally {
    loadingAlertas.value = false
  }
}

// Cargar estadísticas incluyendo alertas
const cargarEstadisticas = async () => {
  try {
    console.log('🔄 Cargando estadísticas...')

    // Cargar alertas reales
    await cargarAlertas()

    // Cargar otros datos (préstamos activos, etc.)
    // const prestamos = await prestamosService.getPrestamos()
    // prestamosActivos.value = prestamos.filter(p => p.estado === 'activo').length

    // Datos mock por ahora
    prestamosActivos.value = 8

    console.log('✅ Estadísticas cargadas')

  } catch (error) {
    console.error('❌ Error al cargar estadísticas:', error)
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/bodeguero/login')
}

// ✅ LIFECYCLE CORREGIDO
onMounted(() => {
  // Inicializar auth store
  authStore.initializeAuth()

  // Cargar estadísticas iniciales (incluye alertas)
  cargarEstadisticas()

  // Actualizar cada 30 segundos
  intervalId = setInterval(cargarEstadisticas, 30000)
})

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

<style scoped>
/* Smooth scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(75, 85, 99, 0.5);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(75, 85, 99, 0.8);
}
</style>
