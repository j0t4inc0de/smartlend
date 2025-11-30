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
        <router-link to="/bodeguero/dashboard/prestamos" v-slot="{ isActive }" class="block">
          <div :class="[
            'flex items-center px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden',
            isCollapsed ? 'justify-center' : 'gap-3',
            isActive
              ? 'bg-gradient-to-r from-red-600 to-red-500 shadow-lg shadow-red-900/50'
              : 'hover:bg-gray-700/50 hover:translate-x-1'
          ]">
            <!-- Efecto brillo -->
            <div v-if="isActive"
              class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700">
            </div>

            <!-- Icono -->
            <svg class="w-6 h-6 shrink-0 z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>

            <!-- Texto -->
            <span v-if="!isCollapsed" class="font-medium z-10">
              Préstamos
            </span>

            <!-- Badge -->
            <span v-if="!isCollapsed && isActive" class="ml-auto bg-white/20 text-xs px-2 py-1 rounded-full z-10">
              12
            </span>
          </div>
        </router-link>

        <!-- Reservas (Próximamente) -->
        <div :class="[
          'flex items-center px-4 py-3 rounded-xl transition-all duration-200 opacity-50 cursor-not-allowed hover:bg-gray-700/30',
          isCollapsed ? 'justify-center' : 'gap-3'
        ]">
          <svg class="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span v-if="!isCollapsed" class="font-medium">Reservas</span>
          <span v-if="!isCollapsed" class="ml-auto text-xs text-gray-500">Pronto</span>
        </div>

        <!-- Inventario (Próximamente) -->
        <div :class="[
          'flex items-center px-4 py-3 rounded-xl transition-all duration-200 opacity-50 cursor-not-allowed hover:bg-gray-700/30',
          isCollapsed ? 'justify-center' : 'gap-3'
        ]">
          <svg class="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <span v-if="!isCollapsed" class="font-medium">Inventario</span>
          <span v-if="!isCollapsed" class="ml-auto text-xs text-gray-500">Pronto</span>
        </div>
      </nav>

      <!-- USUARIO + LOGOUT -->
      <div class="p-4 border-t border-gray-700/50 space-y-3">

        <!-- Info Usuario -->
        <div :class="[
          'flex items-center p-3 rounded-xl bg-gray-700/30 backdrop-blur-sm transition-all duration-200',
          isCollapsed ? 'justify-center' : 'gap-3'
        ]">
          <!-- Avatar -->
          <div
            class="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center font-bold text-white shrink-0 shadow-lg">
            B
          </div>

          <!-- Info -->
          <div v-if="!isCollapsed" class="flex-1 min-w-0">
            <p class="font-semibold text-sm text-white truncate">Bodeguero</p>
            <p class="text-xs text-gray-400 truncate">bodeguero@inacap.cl</p>
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
          <h2 class="text-xl font-semibold text-white">Dashboard</h2>

          <!-- Acciones rápidas -->
          <div class="flex items-center gap-4">
            <button class="p-2 rounded-lg hover:bg-gray-700/50 transition-colors group">
              <svg class="w-5 h-5 text-gray-400 group-hover:text-white" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
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
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isCollapsed = ref(false)

const handleLogout = () => {
  // Aquí irá la lógica de logout del store
  router.push('/bodeguero/login')
}
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
