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
                RUT <span class="text-red-500">*</span>
              </label>
              <input v-model="formData.rut" type="text" placeholder="21351502-9"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                required />
            </div>

            <!-- Nombres -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Nombres <span class="text-red-500">*</span>
              </label>
              <input v-model="formData.nombres" type="text" placeholder="Juan Pablo"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                required />
            </div>

            <!-- Apellidos -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Apellidos <span class="text-red-500">*</span>
              </label>
              <input v-model="formData.apellidos" type="text" placeholder="Erices Fuentealba"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                required />
            </div>

            <!-- Correo -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico <span class="text-red-500">*</span>
              </label>
              <input v-model="formData.correo" type="email" placeholder="usuario@inacapmail.cl"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                required />
            </div>

            <!-- Rol -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Rol <span class="text-red-500">*</span>
              </label>
              <select v-model="formData.rol"
                class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                required>
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
              <select v-model="formData.carrera"
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
              <div v-if="isCameraActive"
                class="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-lg flex items-center space-x-2">
                <div class="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span class="text-white text-sm font-medium">Cámara activa</span>
              </div>
              <div v-else
                class="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-lg flex items-center space-x-2">
                <div class="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span class="text-white text-sm font-medium">Iniciando cámara...</span>
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
              <button @click="captureImage" :disabled="!isCameraActive"
                class="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>Capturar Foto</span>
              </button>

              <button @click="retryCapture" :disabled="!capturedImage"
                class="flex-1 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Reintentar</span>
              </button>
            </div>

            <!-- Preview de imagen capturada -->
            <div v-if="showPreview" class="mt-4">
              <p class="text-sm font-medium text-gray-700 mb-2">Vista previa:</p>
              <div class="relative bg-gray-100 rounded-lg p-4">
                <img ref="previewImage" class="w-full max-w-sm mx-auto rounded-lg shadow-lg" alt="Preview" />
                <button @click="retryCapture"
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
          <button @click="cancelRegistration"
            class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Cancelar</span>
          </button>

          <button @click="registerUser" :disabled="!isFormValid || isSubmitting"
            class="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl">
            <svg v-if="!isSubmitting" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
              </path>
            </svg>
            <span>{{ isSubmitting ? 'Registrando...' : 'Registrar Usuario' }}</span>
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
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Referencias a elementos del DOM
const videoElement = ref(null)
const canvasElement = ref(null)
const previewImage = ref(null)

// Estado de la cámara
const stream = ref(null)
const isCameraActive = ref(false)
const capturedImage = ref(null)
const capturedImageURL = ref(null)

// Datos del formulario
const formData = ref({
  rut: '',
  nombres: '',
  apellidos: '',
  correo: '',
  rol: '',
  carrera: ''
})

// Estados de UI
const isCapturing = ref(false)
const showPreview = ref(false)
const isSubmitting = ref(false)

// Validación del formulario
const isFormValid = computed(() => {
  return formData.value.rut &&
    formData.value.nombres &&
    formData.value.apellidos &&
    formData.value.correo &&
    formData.value.rol &&
    capturedImage.value !== null
})

// Iniciar cámara
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
      console.log('✅ Cámara iniciada correctamente')
      console.log('📹 Stream info:', {
        active: stream.value.active,
        tracks: stream.value.getTracks().length
      })
    }
  } catch (error) {
    console.error('❌ Error al acceder a la cámara:', error)
    alert('No se pudo acceder a la cámara. Verifica los permisos del navegador.')
  }
}

// Capturar imagen
const captureImage = () => {
  try {
    console.log('📸 Capturando imagen...')

    const canvas = canvasElement.value
    const video = videoElement.value

    if (!canvas || !video) {
      console.error('❌ Canvas o video no disponibles')
      return
    }

    // Configurar tamaño del canvas
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    console.log('📐 Dimensiones de captura:', {
      width: canvas.width,
      height: canvas.height
    })

    // Capturar frame actual
    const context = canvas.getContext('2d')
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Convertir a blob
    canvas.toBlob((blob) => {
      capturedImage.value = blob
      capturedImageURL.value = URL.createObjectURL(blob)
      showPreview.value = true

      console.log('✅ Imagen capturada exitosamente')
      console.log('📦 Blob info:', {
        size: blob.size,
        type: blob.type,
        sizeInKB: (blob.size / 1024).toFixed(2) + ' KB'
      })

      // Mostrar preview
      if (previewImage.value) {
        previewImage.value.src = capturedImageURL.value
      }
    }, 'image/jpeg', 0.95)

  } catch (error) {
    console.error('❌ Error al capturar imagen:', error)
  }
}

// Reintentar captura
const retryCapture = () => {
  console.log('🔄 Reintentando captura...')
  capturedImage.value = null
  capturedImageURL.value = null
  showPreview.value = false

  if (previewImage.value) {
    previewImage.value.src = ''
  }
}

// Cancelar registro
const cancelRegistration = () => {
  console.log('❌ Cancelando registro...')
  if (confirm('¿Estás seguro de que deseas cancelar el registro?')) {
    // Detener cámara
    if (stream.value) {
      stream.value.getTracks().forEach(track => track.stop())
    }
    // Regresar a la pantalla anterior o home
    router.push('/')
  }
}

// Registrar usuario
const registerUser = () => {
  console.log('\n🚀 ============ INICIANDO REGISTRO DE USUARIO ============')
  console.log('Timestamp:', new Date().toISOString())

  // Validar formulario
  if (!isFormValid.value) {
    console.error('\n❌ ============ FORMULARIO INCOMPLETO ============')
    console.log('📋 Estado de validación:', {
      rut: !!formData.value.rut,
      nombres: !!formData.value.nombres,
      apellidos: !!formData.value.apellidos,
      correo: !!formData.value.correo,
      rol: !!formData.value.rol,
      imagenCapturada: !!capturedImage.value
    })
    alert('⚠️ Por favor completa todos los campos requeridos y captura una foto')
    return
  }

  isSubmitting.value = true

  // ============================================
  // LOGS DETALLADOS DE TODOS LOS DATOS
  // ============================================

  console.log('\n📋 ============ DATOS DEL FORMULARIO ============')
  console.table({
    'RUT': formData.value.rut,
    'Nombres': formData.value.nombres,
    'Apellidos': formData.value.apellidos,
    'Correo': formData.value.correo,
    'Rol': formData.value.rol,
    'Carrera': formData.value.carrera || 'No especificada'
  })

  console.log('\n📸 ============ DATOS DE LA IMAGEN ============')
  if (capturedImage.value) {
    console.log('✅ Imagen capturada exitosamente')
    console.table({
      'Tipo': capturedImage.value.type,
      'Tamaño (KB)': (capturedImage.value.size / 1024).toFixed(2),
      'Tamaño (bytes)': capturedImage.value.size,
      'Nombre': 'face.jpg'
    })
    console.log('📐 Dimensiones del canvas:', {
      width: canvasElement.value?.width,
      height: canvasElement.value?.height
    })

    // Mostrar preview en consola (como data URL)
    const reader = new FileReader()
    reader.onload = (e) => {
      console.log('\n🖼️  Preview de la imagen (puedes abrir en nueva pestaña):')
      console.log(e.target.result)
    }
    reader.readAsDataURL(capturedImage.value)
  } else {
    console.error('❌ No hay imagen capturada')
  }

  console.log('\n📦 ============ FORMDATA QUE SE ENVIARÍA AL BACKEND ============')
  const formDataToSend = new FormData()
  formDataToSend.append('image', capturedImage.value, 'face.jpg')
  formDataToSend.append('rut', formData.value.rut)
  formDataToSend.append('nombres', formData.value.nombres)
  formDataToSend.append('apellidos', formData.value.apellidos)
  formDataToSend.append('correo', formData.value.correo)
  formDataToSend.append('rol', formData.value.rol)
  if (formData.value.carrera) {
    formDataToSend.append('carrera', formData.value.carrera)
  }

  console.log('Campos en FormData:')
  for (let [key, value] of formDataToSend.entries()) {
    if (key === 'image') {
      console.log(`  - ${key}:`, {
        type: value.type,
        size: `${(value.size / 1024).toFixed(2)} KB`,
        name: value.name
      })
    } else {
      console.log(`  - ${key}: "${value}"`)
    }
  }

  console.log('\n🌐 ============ INFORMACIÓN PARA EL BACKEND ============')
  console.log('Endpoint: POST http://72.60.167.16:8000/api/auth/register-face/')
  console.log('Content-Type: multipart/form-data (automático)')
  console.log('Método: POST')

  console.log('\n📡 ============ OBJETO JSON EQUIVALENTE ============')
  const jsonData = {
    usuario: {
      rut: formData.value.rut,
      nombres: formData.value.nombres,
      apellidos: formData.value.apellidos,
      correo: formData.value.correo,
      rol: formData.value.rol,
      carrera: formData.value.carrera || null
    },
    imagen: {
      tipo: capturedImage.value.type,
      tamaño_kb: (capturedImage.value.size / 1024).toFixed(2),
      tamaño_bytes: capturedImage.value.size,
      formato: 'JPEG',
      dimensiones: {
        width: canvasElement.value?.width,
        height: canvasElement.value?.height
      }
    },
    metadata: {
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      idioma: navigator.language,
      plataforma: navigator.platform
    }
  }

  console.log(JSON.stringify(jsonData, null, 2))

  console.log('\n💾 ============ RESUMEN DE LO QUE SE GUARDARÁ EN BD ============')
  console.log('En tabla USUARIO:')
  console.log(`  - rut: "${formData.value.rut}"`)
  console.log(`  - nombres: "${formData.value.nombres}"`)
  console.log(`  - apellidos: "${formData.value.apellidos}"`)
  console.log(`  - correo: "${formData.value.correo}"`)
  console.log(`  - id_rol: [ID del rol "${formData.value.rol}"]`)
  console.log(`  - id_carrera: ${formData.value.carrera ? `[ID de "${formData.value.carrera}"]` : 'NULL'}`)
  console.log(`  - embedding: [EMBEDDING ENCRIPTADO - ~500 caracteres]`)
  console.log(`  - created_at: ${new Date().toISOString()}`)

  console.log('\n⚡ ============ FLUJO DEL BACKEND (Opción 2) ============')
  console.log('1. ✅ Recibir FormData con imagen (~250 KB)')
  console.log('2. ✅ Validar campos requeridos')
  console.log('3. ✅ Verificar que RUT no exista')
  console.log('4. ✅ Extraer embedding de imagen (face_recognition - 0.3s)')
  console.log('5. ✅ Encriptar embedding (cryptography.Fernet - 0.05s)')
  console.log('6. ✅ Guardar en BD (0.1s)')
  console.log('7. ✅ Responder success con user_id')
  console.log('   TIEMPO TOTAL ESTIMADO: ~0.8 segundos')

  console.log('\n📝 ============ CÓDIGO PARA CONECTAR CON BACKEND ============')
  console.log(`
// En RegisterUserView.vue, reemplazar esta función con:

import { authService } from '@/services/authService'

const registerUser = async () => {
  if (!isFormValid.value) {
    alert('⚠️ Completa todos los campos y captura una foto')
    return
  }

  isSubmitting.value = true

  try {
    // Preparar FormData
    const formDataToSend = new FormData()
    formDataToSend.append('image', capturedImage.value, 'face.jpg')
    formDataToSend.append('rut', formData.value.rut)
    formDataToSend.append('nombres', formData.value.nombres)
    formDataToSend.append('apellidos', formData.value.apellidos)
    formDataToSend.append('correo', formData.value.correo)
    formDataToSend.append('rol', formData.value.rol)
    if (formData.value.carrera) {
      formDataToSend.append('carrera', formData.value.carrera)
    }

    // LLAMADA REAL AL BACKEND
    const result = await authService.registerUserWithFace(formDataToSend)

    console.log('✅ Usuario registrado:', result)
    alert(\`✅ Usuario registrado!\\nID: \${result.user_id}\\nRUT: \${result.rut}\`)

    resetForm()

  } catch (error) {
    console.error('❌ Error:', error)
    alert('❌ Error: ' + error.message)
  } finally {
    isSubmitting.value = false
  }
}
  `)

  // Simulación de éxito
  setTimeout(() => {
    console.log('\n✅ ============ SIMULACIÓN COMPLETADA ============')
    console.log('🎉 Todos los datos fueron mostrados en consola')
    console.log('📌 Revisa los logs de arriba para ver TODOS los detalles')
    console.log('🔗 Cuando estés listo, conecta con el backend usando authService')
    console.log('=' * 70 + '\n')

    isSubmitting.value = false

    // Mostrar alerta con resumen
    alert(`✅ DATOS GUARDADOS EN CONSOLA

📋 Usuario: ${formData.value.nombres} ${formData.value.apellidos}
🆔 RUT: ${formData.value.rut}
📧 Correo: ${formData.value.correo}
👤 Rol: ${formData.value.rol}
📸 Imagen: ${(capturedImage.value.size / 1024).toFixed(2)} KB

Revisa la consola (F12) para ver TODOS los detalles.
Cuando estés listo, conecta el backend.`)

    // NO resetear el formulario para que puedas ver los datos
    // resetForm()
  }, 500)
}

// Resetear formulario
const resetForm = () => {
  console.log('🔄 Reseteando formulario...')

  formData.value = {
    rut: '',
    nombres: '',
    apellidos: '',
    correo: '',
    rol: '',
    carrera: ''
  }

  capturedImage.value = null
  capturedImageURL.value = null
  showPreview.value = false
  isSubmitting.value = false

  if (previewImage.value) {
    previewImage.value.src = ''
  }

  console.log('✅ Formulario reseteado')
}

// Lifecycle hooks
onMounted(async () => {
  console.log('🎬 Componente RegisterUserView montado')
  await startCamera()
})

onUnmounted(() => {
  console.log('🛑 Componente desmontado, limpiando recursos...')

  // Detener cámara
  if (stream.value) {
    stream.value.getTracks().forEach(track => {
      track.stop()
      console.log('🎥 Track de cámara detenido')
    })
  }

  // Limpiar URLs de objetos
  if (capturedImageURL.value) {
    URL.revokeObjectURL(capturedImageURL.value)
  }
})
</script>

<style scoped>
/* Animaciones personalizadas si son necesarias */
</style>
