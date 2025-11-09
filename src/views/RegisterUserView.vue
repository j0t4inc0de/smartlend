<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4">
    <!-- Contenedor principal -->
    <div class="w-full max-w-4xl bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden">

      <!-- Header -->
      <div class="bg-gradient-to-r from-red-600 to-red-700 p-6">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-2xl md:text-3xl font-bold text-white">
              Registro de Usuario
            </h1>
            <p class="text-red-100 mt-1">
              Configuración de Reconocimiento Facial
            </p>
          </div>
          <div class="bg-white/20 p-3 rounded-lg">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
      </div>

      <!-- Contenido principal -->
      <div class="p-6 md:p-8">

        <!-- Paso 1: Información del Usuario -->
        <div class="mb-8">
          <div class="flex items-center mb-4">
            <div class="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
              1
            </div>
            <h2 class="text-xl font-semibold text-gray-800">Información del Usuario</h2>
          </div>

          <div class="bg-gray-50 p-6 rounded-lg space-y-4">
            <!-- RUT -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                RUT
              </label>
              <input type="text" placeholder="12.345.678-9"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all" />
            </div>

            <!-- Nombres -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nombres
              </label>
              <input type="text" placeholder="Juan Pablo"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all" />
            </div>

            <!-- Apellidos -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Apellidos
              </label>
              <input type="text" placeholder="González Pérez"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all" />
            </div>

            <!-- Correo -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <input type="email" placeholder="usuario@inacapmail.cl"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all" />
            </div>

            <!-- Rol -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Rol
              </label>
              <select
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all">
                <option value="">Seleccionar rol...</option>
                <option value="estudiante">Estudiante</option>
                <option value="docente">Docente</option>
                <option value="administrativo">Administrativo</option>
              </select>
            </div>

            <!-- Carrera (solo si es estudiante) -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Carrera (opcional)
              </label>
              <select
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all">
                <option value="">Seleccionar carrera...</option>
                <option value="ingenieria">Ingeniería en Informática</option>
                <option value="electronica">Ingeniería en Electrónica</option>
                <option value="mecanica">Ingeniería Mecánica</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Paso 2: Captura Facial -->
        <div class="mb-8">
          <div class="flex items-center mb-4">
            <div class="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold mr-3">
              2
            </div>
            <h2 class="text-xl font-semibold text-gray-800">Captura Facial</h2>
          </div>

          <div class="bg-gray-50 p-6 rounded-lg">
            <!-- Área de video/cámara -->
            <div class="relative bg-gray-900 rounded-lg overflow-hidden aspect-video mb-4">
              <!-- Video element (se activará con JavaScript) -->
              <video ref="videoElement" class="w-full h-full object-cover" autoplay playsinline></video>

              <!-- Canvas oculto para captura -->
              <canvas ref="canvasElement" class="hidden"></canvas>

              <!-- Overlay con guías -->
              <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div class="w-64 h-80 border-4 border-white/50 rounded-full flex items-center justify-center">
                  <div class="text-center text-white">
                    <svg class="w-16 h-16 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clip-rule="evenodd" />
                    </svg>
                    <p class="text-sm font-medium">Centra tu rostro</p>
                  </div>
                </div>
              </div>

              <!-- Indicador de estado de cámara -->
              <div
                class="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-lg flex items-center space-x-2">
                <div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span class="text-white text-sm font-medium">Cámara activa</span>
              </div>
            </div>

            <!-- Instrucciones -->
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div class="flex">
                <svg class="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clip-rule="evenodd" />
                </svg>
                <div class="text-sm text-blue-800">
                  <p class="font-semibold mb-1">Instrucciones para la captura:</p>
                  <ul class="list-disc list-inside space-y-1">
                    <li>Ubica tu rostro dentro del círculo guía</li>
                    <li>Asegúrate de tener buena iluminación</li>
                    <li>Mira directamente a la cámara</li>
                    <li>Mantén una expresión neutra</li>
                    <li>Retira lentes de sol o mascarillas</li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- Botones de acción -->
            <div class="flex flex-col sm:flex-row gap-3">
              <button
                class="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Capturar Foto</span>
              </button>

              <button
                class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Reintentar</span>
              </button>
            </div>

            <!-- Preview de imagen capturada -->
            <div class="mt-4 hidden">
              <p class="text-sm font-medium text-gray-700 mb-2">Vista previa:</p>
              <div class="relative bg-gray-100 rounded-lg p-4">
                <img ref="previewImage" class="w-full max-w-sm mx-auto rounded-lg shadow-lg" alt="Preview" />
                <button
                  class="absolute top-6 right-6 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg transition-all">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Botones finales -->
        <div class="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
          <button
            class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Cancelar</span>
          </button>

          <button
            class="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Registrar Usuario</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Notificación de éxito/error (oculta por defecto) -->
    <div class="fixed bottom-4 right-4 max-w-md hidden">
      <div class="bg-green-500 text-white px-6 py-4 rounded-lg shadow-2xl flex items-start space-x-3">
        <svg class="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd" />
        </svg>
        <div>
          <p class="font-semibold">¡Usuario registrado exitosamente!</p>
          <p class="text-sm text-green-100 mt-1">El reconocimiento facial ha sido configurado.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Referencias a elementos del DOM
const videoElement = ref(null)
const canvasElement = ref(null)
const previewImage = ref(null)

// Estado
const stream = ref(null)

// Lifecycle hooks
onMounted(() => {
  // Aquí irá la lógica para iniciar la cámara
  console.log('Componente montado - Listo para iniciar cámara')
})

onUnmounted(() => {
  // Limpiar stream de cámara al destruir componente
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop())
  }
})
</script>

<style scoped>
/* Animaciones personalizadas si son necesarias */
</style>
