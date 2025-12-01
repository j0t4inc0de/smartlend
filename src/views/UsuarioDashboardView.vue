<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 flex flex-col">

    <!-- HEADER -->
    <div class="bg-black/40 backdrop-blur-sm border-b border-white/10 px-8 py-4 sticky top-0 z-20">
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-4">
          <img :src="inacapLogo" alt="INACAP" class="h-10" />
          <div>
            <h1 class="text-2xl font-bold text-white">SmartLend</h1>
            <p class="text-gray-400 text-sm">¡Hola {{ usuario.nombres }}! Selecciona tus herramientas</p>
          </div>
        </div>

        <div class="flex items-center gap-4">
          <!-- Timer -->
          <div class="bg-red-600/20 border border-red-500/30 rounded-lg px-4 py-2">
            <span class="text-red-300 text-sm font-mono">{{ tiempoRestante }}</span>
          </div>

          <!-- Carrito Badge -->
          <div class="relative">
            <button @click="toggleCarrito" class="bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all">
              <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m4.5-6h8m-8 0V9a3 3 0 116 0v4M9 19a1 1 0 102 0 1 1 0 00-2 0zm10 0a1 1 0 102 0 1 1 0 00-2 0z" />
              </svg>
              <span v-if="carrito.length > 0"
                class="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {{ carrito.length }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="flex-1 flex">

      <!-- PANEL IZQUIERDO: CATEGORÍAS Y HERRAMIENTAS -->
      <div class="flex-1 p-8 overflow-y-auto">

        <!-- Filtros -->
        <div class="mb-8">
          <h2 class="text-xl font-bold text-white mb-4">Categorías</h2>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button v-for="categoria in categorias" :key="categoria.id_categoria"
              @click="filtrarPorCategoria(categoria.id_categoria)" :class="[
                'p-4 rounded-xl text-left transition-all',
                categoriaSeleccionada === categoria.id_categoria
                  ? 'bg-red-600 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              ]">
              <span class="font-medium">{{ categoria.nombre }}</span>
            </button>
            <button @click="filtrarPorCategoria(null)" :class="[
              'p-4 rounded-xl text-left transition-all',
              categoriaSeleccionada === null
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            ]">
              <span class="font-medium">Todas</span>
            </button>
          </div>
        </div>

        <!-- Lista de Herramientas -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="herramienta in herramientasFiltradas" :key="herramienta.id_tipo_herramienta"
            class="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-red-500/50 transition-all">

            <div class="aspect-video bg-gray-700 rounded-lg mb-4 overflow-hidden">
              <img v-if="herramienta.imagen_url" :src="herramienta.imagen_url" :alt="herramienta.nombre"
                class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center">
                <svg class="w-12 h-12 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
            </div>

            <h3 class="text-lg font-semibold text-white mb-2">{{ herramienta.nombre }}</h3>
            <p class="text-gray-400 text-sm mb-4">{{ herramienta.descripcion }}</p>

            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2">
                <span :class="[
                  'w-3 h-3 rounded-full',
                  herramienta.stock > 5 ? 'bg-green-500' :
                    herramienta.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'
                ]"></span>
                <span class="text-sm text-gray-400">
                  {{ herramienta.stock }} disponibles
                </span>
              </div>

              <button @click="agregarAlCarrito(herramienta)"
                :disabled="herramienta.stock === 0 || yaEnCarrito(herramienta.id_tipo_herramienta)" :class="[
                  'px-4 py-2 rounded-lg font-medium transition-all',
                  herramienta.stock === 0 || yaEnCarrito(herramienta.id_tipo_herramienta)
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-500 text-white hover:scale-105'
                ]">
                {{ yaEnCarrito(herramienta.id_tipo_herramienta) ? 'Agregado' : 'Agregar' }}
              </button>
            </div>
          </div>
        </div>

        <div v-if="herramientasFiltradas.length === 0" class="text-center py-12">
          <div class="text-6xl mb-4">🔍</div>
          <p class="text-gray-400 text-lg">No hay herramientas disponibles</p>
        </div>
      </div>

      <!-- PANEL DERECHO: CARRITO -->
      <div v-if="carritoVisible" class="w-80 bg-gray-800/50 backdrop-blur border-l border-gray-700 p-6 overflow-y-auto">

        <div class="flex justify-between items-center mb-6">
          <h3 class="text-lg font-bold text-white">Tu Carrito</h3>
          <button @click="toggleCarrito" class="text-gray-400 hover:text-white">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div v-if="carrito.length === 0" class="text-center py-8">
          <div class="text-4xl mb-2">🛒</div>
          <p class="text-gray-400">Tu carrito está vacío</p>
        </div>

        <div v-else class="space-y-4">
          <div v-for="item in carrito" :key="item.id_tipo_herramienta"
            class="bg-gray-700 rounded-lg p-4 flex justify-between items-center">
            <div class="flex-1">
              <h4 class="text-white font-medium text-sm">{{ item.nombre }}</h4>
              <p class="text-gray-400 text-xs">{{ item.categoria }}</p>
            </div>
            <button @click="removerDelCarrito(item.id_tipo_herramienta)" class="text-red-400 hover:text-red-300 ml-2">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>

          <!-- Fecha de Devolución -->
          <div class="bg-gray-700 rounded-lg p-4">
            <label class="block text-sm font-medium text-white mb-2">Fecha de Devolución</label>
            <input v-model="fechaDevolucion" type="date" :min="minDate" :max="maxDate"
              class="w-full bg-gray-600 text-white rounded-lg px-3 py-2 text-sm" />
          </div>

          <!-- Botón Confirmar -->
          <button @click="confirmarPrestamo" :disabled="procesando || carrito.length === 0 || !fechaDevolucion"
            class="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed">
            <span v-if="procesando" class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              Procesando...
            </span>
            <span v-else>Confirmar Préstamo</span>
          </button>
        </div>
      </div>

    </div>

    <!-- MODAL DE CONFIRMACIÓN -->
    <div v-if="mostrarConfirmacion" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div class="bg-gray-800 rounded-xl p-8 max-w-md w-full border border-gray-700">
        <div class="text-center">
          <div class="text-6xl mb-4">✅</div>
          <h3 class="text-xl font-bold text-white mb-4">¡Préstamo Confirmado!</h3>
          <p class="text-gray-300 mb-6">
            Tu solicitud de préstamo ha sido registrada.
            Presenta este código al encargado de pañol:
          </p>
          <div class="bg-gray-700 rounded-lg p-4 mb-6">
            <span class="text-2xl font-mono text-green-400">#{{ codigoPrestamo }}</span>
          </div>
          <button @click="finalizarSesion"
            class="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3 rounded-lg transition-all">
            Finalizar Sesión
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { inventarioService } from '@/services/inventarioService'
import { prestamosService } from '@/services/prestamosService'

import inacapLogo from '../assets/images/inacap-logo.png'

const router = useRouter()

// Estados reactivos
const usuario = ref(JSON.parse(localStorage.getItem('user') || '{}'))
const categorias = ref([])
const herramientas = ref([])
const carrito = ref([])
const categoriaSeleccionada = ref(null)
const carritoVisible = ref(false)
const procesando = ref(false)
const mostrarConfirmacion = ref(false)
const codigoPrestamo = ref('')

// Timer de sesión
const tiempoSesion = ref(300) // 5 minutos
const tiempoRestante = computed(() => {
  const minutos = Math.floor(tiempoSesion.value / 60)
  const segundos = tiempoSesion.value % 60
  return `${minutos}:${segundos.toString().padStart(2, '0')}`
})

// Fecha de devolución
const fechaDevolucion = ref('')
const minDate = computed(() => {
  const mañana = new Date()
  mañana.setDate(mañana.getDate() + 1)
  return mañana.toISOString().split('T')[0]
})
const maxDate = computed(() => {
  const semana = new Date()
  semana.setDate(semana.getDate() + 7)
  return semana.toISOString().split('T')[0]
})

// Herramientas filtradas
const herramientasFiltradas = computed(() => {
  if (categoriaSeleccionada.value === null) {
    return herramientas.value
  }
  return herramientas.value.filter(h => h.id_categoria === categoriaSeleccionada.value)
})

// Timer countdown
let timerInterval = null

const iniciarTimer = () => {
  timerInterval = setInterval(() => {
    if (tiempoSesion.value > 0) {
      tiempoSesion.value--
    } else {
      finalizarSesion()
    }
  }, 1000)
}

// Cargar datos iniciales
const cargarDatos = async () => {
  try {
    // Cargar categorías
    categorias.value = await inventarioService.getCategorias()

    // Cargar todos los tipos de herramientas con stock
    const tiposHerramientas = await inventarioService.getTiposHerramienta()

    // Enriquecer con información de stock
    herramientas.value = await Promise.all(
      tiposHerramientas.map(async (tipo) => {
        const stockInfo = await inventarioService.verificarStock(tipo.id_tipo_herramienta)
        const categoria = categorias.value.find(c => c.id_categoria === tipo.id_categoria)

        return {
          ...tipo,
          stock: stockInfo.disponibles,
          categoria: categoria?.nombre || 'Sin categoría'
        }
      })
    )
  } catch (error) {
    console.error('Error al cargar datos:', error)
    alert('Error al cargar los datos. Intenta nuevamente.')
  }
}

// Funciones del carrito
const toggleCarrito = () => {
  carritoVisible.value = !carritoVisible.value
}

const agregarAlCarrito = (herramienta) => {
  if (!yaEnCarrito(herramienta.id_tipo_herramienta) && herramienta.stock > 0) {
    carrito.value.push(herramienta)
  }
}

const removerDelCarrito = (tipoHerramientaId) => {
  const index = carrito.value.findIndex(item => item.id_tipo_herramienta === tipoHerramientaId)
  if (index > -1) {
    carrito.value.splice(index, 1)
  }
}

const yaEnCarrito = (tipoHerramientaId) => {
  return carrito.value.some(item => item.id_tipo_herramienta === tipoHerramientaId)
}

const filtrarPorCategoria = (categoriaId) => {
  categoriaSeleccionada.value = categoriaId
}

// Confirmar préstamo
const confirmarPrestamo = async () => {
  if (carrito.value.length === 0 || !fechaDevolucion.value) return

  procesando.value = true

  try {
    // Generar código único
    const timestamp = Date.now()
    codigoPrestamo.value = `SL${timestamp.toString().slice(-6)}`

    // Simular creación de préstamos (aquí conectarías con prestamosService)
    for (const item of carrito.value) {
      // En producción: await prestamosService.crearPrestamo(...)
      console.log('Creando préstamo para:', item.nombre)
    }

    // Mostrar confirmación
    mostrarConfirmacion.value = true

  } catch (error) {
    console.error('Error al confirmar préstamo:', error)
    alert('Error al procesar el préstamo. Intenta nuevamente.')
  } finally {
    procesando.value = false
  }
}

const finalizarSesion = () => {
  // Limpiar datos de sesión
  localStorage.removeItem('user')
  localStorage.removeItem('isAuthenticated')

  // Redirigir al inicio
  router.push('/')
}

// Lifecycle
onMounted(() => {
  if (!usuario.value.id) {
    router.push('/facial-recognition')
    return
  }

  cargarDatos()
  iniciarTimer()

  // Establecer fecha por defecto (mañana)
  const mañana = new Date()
  mañana.setDate(mañana.getDate() + 1)
  fechaDevolucion.value = mañana.toISOString().split('T')[0]
})

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})
</script>
