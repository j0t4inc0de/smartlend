<template>
  <div class="relative min-h-screen w-full overflow-hidden flex flex-col bg-gray-900 font-sans select-none">
    <div class="absolute inset-0 pointer-events-none z-0">
      <div class="particles">
        <div v-for="n in 30" :key="n" class="particle"></div>
      </div>
    </div>
    <div class="absolute inset-0 z-[-1]">
      <img :src="sedeBackground" alt="Fondo" class="animate-ken-burns h-full w-full object-cover opacity-40" />
      <div class="absolute inset-0 bg-gradient-to-b from-gray-900/80 via-gray-900/90 to-black"></div>
    </div>

    <header
      class="fixed top-0 left-0 w-full bg-black/30 backdrop-blur-xl border-b border-white/10 z-30 pb-2 transition-all duration-300">

      <div class="flex justify-between items-center px-5 py-4">
        <div class="flex items-center gap-3">
          <div class="bg-white/10 p-1.5 rounded-lg">
            <img :src="inacapLogo" alt="INACAP" class="h-6" />
          </div>
          <div>
            <h1 class="text-base font-bold text-white leading-tight">Hola, {{ usuario.nombres }}</h1>
            <p class="text-gray-400 text-xs">Selecciona tus herramientas</p>
          </div>
        </div>

        <div
          class="bg-red-600/20 border border-red-500/50 rounded-lg px-3 py-1 flex flex-col items-center shadow-[0_0_15px_rgba(220,38,38,0.3)]">
          <span class="text-[10px] text-red-300 uppercase font-bold tracking-wider">Sesión</span>
          <span class="text-base font-mono text-white font-bold">{{ tiempoRestante }}</span>
        </div>
      </div>

      <div class="flex-none py-1 pl-5 overflow-x-auto no-scrollbar">
        <div class="flex gap-2 pr-5">
          <button @click="filtrarPorCategoria(null)" :class="[
            'flex-none px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 border shadow-lg active:scale-95',
            categoriaSeleccionada === null
              ? 'bg-red-600 text-white border-red-500 shadow-red-900/50 scale-105'
              : 'bg-gray-800/80 text-gray-400 border-white/10 hover:bg-gray-700'
          ]">
            Todas
          </button>
          <button v-for="categoria in categorias" :key="categoria.id_categoria"
            @click="filtrarPorCategoria(categoria.id_categoria)" :class="[
              'flex-none px-4 py-2 rounded-full text-sm font-bold transition-all duration-300 border shadow-lg active:scale-95',
              categoriaSeleccionada === categoria.id_categoria
                ? 'bg-red-600 text-white border-red-500 shadow-red-900/50 scale-105'
                : 'bg-gray-800/80 text-gray-400 border-white/10 hover:bg-gray-700'
            ]">
            {{ categoria.nombre }}
          </button>
        </div>
      </div>
    </header>

    <main class="flex-1 overflow-y-auto p-4 pt-36 pb-28 z-10 custom-scrollbar">
      <div v-if="herramientasFiltradas.length > 0" class="grid grid-cols-3 gap-3">
        <div v-for="herramienta in herramientasFiltradas" :key="herramienta.id_tipo_herramienta"
          class="group relative bg-gray-800/60 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden flex flex-col h-full transition-all duration-200 active:scale-[0.98]">

          <div class="aspect-video bg-gray-700/50 relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent z-10"></div>

            <img v-if="herramienta.imagen_url" :src="herramienta.imagen_url" loading="lazy" decoding="async"
              @error="herramienta.imagen_url = null"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />

            <div v-else class="w-full h-full flex items-center justify-center">
              <svg class="w-10 h-10 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>

            <div
              class="absolute top-2 right-2 z-20 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded-full border border-white/10 flex items-center gap-1">
              <span
                :class="['w-1.5 h-1.5 rounded-full animate-pulse', herramienta.stock > 0 ? 'bg-green-500' : 'bg-red-500']"></span>
              <span class="text-[9px] font-bold text-white">{{ herramienta.stock }}</span>
            </div>
          </div>

          <div class="p-2.5 flex-1 flex flex-col">
            <h3 class="text-xs font-bold text-white leading-tight mb-1 line-clamp-2 h-8">{{ herramienta.nombre }}</h3>

            <button @click="agregarAlCarrito(herramienta)"
              :disabled="herramienta.stock === 0 || yaEnCarrito(herramienta.id_tipo_herramienta)" :class="[
                'w-full py-2 mt-auto rounded-lg font-bold text-xs shadow-md flex items-center justify-center gap-1 transition-all',
                yaEnCarrito(herramienta.id_tipo_herramienta)
                  ? 'bg-green-600/20 text-green-400 border border-green-500/50'
                  : herramienta.stock === 0
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-white text-gray-900 hover:bg-gray-200 active:scale-95'
              ]">
              <span v-if="yaEnCarrito(herramienta.id_tipo_herramienta)">✓ Listo</span>
              <span v-else-if="herramienta.stock === 0">Agotado</span>
              <span v-else>Agregar</span>
            </button>
          </div>
        </div>
      </div>

      <div v-else class="flex flex-col items-center justify-center h-48 text-gray-500">
        <svg class="w-12 h-12 mb-3 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <p class="text-base font-medium">Sin resultados</p>
      </div>
    </main>

    <div class="fixed bottom-0 left-0 right-0 p-3 z-40 bg-gradient-to-t from-black via-black/90 to-transparent pb-6">
      <button @click="carrito.length > 0 ? carritoVisible = true : null" :disabled="carrito.length === 0" :class="[
        'w-full h-16 rounded-xl flex items-center justify-between px-5 shadow-2xl border transition-all duration-300',
        carrito.length > 0
          ? 'bg-red-600 border-red-400 text-white shadow-[0_0_30px_rgba(220,38,38,0.4)] active:scale-98'
          : 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed'
      ]">
        <div class="flex items-center gap-3">
          <div class="relative">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m4.5-6h8m-8 0V9a3 3 0 116 0v4M9 19a1 1 0 102 0 1 1 0 00-2 0zm10 0a1 1 0 102 0 1 1 0 00-2 0z" />
            </svg>
            <span v-if="carrito.length > 0"
              class="absolute -top-2 -right-2 w-5 h-5 bg-white text-red-600 rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
              {{ carrito.length }}
            </span>
          </div>
          <div class="flex flex-col items-start">
            <span class="text-base font-bold">{{ carrito.length > 0 ? 'Ver Mi Pedido' : 'Carrito Vacío' }}</span>
            <span class="text-[10px] opacity-80 font-medium">{{ carrito.length }} Items</span>
          </div>
        </div>
        <div class="bg-white/20 rounded-full p-1.5">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 15l7-7 7 7" />
          </svg>
        </div>
      </button>
    </div>

    <transition name="slide-up">
      <div v-if="carritoVisible" class="fixed inset-0 z-50 flex flex-col justify-end">
        <div @click="carritoVisible = false" class="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity">
        </div>
        <div
          class="relative bg-gray-900 border-t border-white/10 rounded-t-3xl p-5 shadow-2xl max-h-[85vh] flex flex-col animate-slide-up">
          <div class="w-12 h-1 bg-gray-700 rounded-full mx-auto mb-5"></div>

          <div class="flex justify-between items-center mb-5">
            <h2 class="text-xl font-bold text-white flex items-center gap-2">
              <svg class="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Confirmar
            </h2>
            <button @click="carritoVisible = false"
              class="p-1.5 bg-gray-800 rounded-full text-gray-400 hover:text-white">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="flex-1 overflow-y-auto space-y-2 mb-5 custom-scrollbar pr-1">
            <div v-for="item in carrito" :key="item.id_tipo_herramienta"
              class="bg-gray-800/50 border border-white/5 p-3 rounded-xl flex justify-between items-center">
              <div class="flex items-center gap-3">
                <img v-if="item.imagen_url" :src="item.imagen_url" loading="lazy" decoding="async"
                  @error="item.imagen_url = null" class="w-10 h-10 rounded-lg object-cover bg-gray-700" />
                <div>
                  <h4 class="text-white font-bold text-sm">{{ item.nombre }}</h4>
                  <p class="text-xs text-gray-400">{{ item.categoria }}</p>
                </div>
              </div>
              <button @click="removerDelCarrito(item.id_tipo_herramienta)"
                class="p-2 text-red-500 bg-red-500/10 rounded-lg hover:bg-red-500/20 active:scale-95 transition-all">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>

          <div class="bg-gray-800/50 p-3 rounded-xl mb-5 border border-white/5">
            <label class="block text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">Fecha de
              Devolución</label>
            <input v-model="fechaDevolucion" type="date" :min="minDate" :max="maxDate"
              class="w-full bg-black/40 border border-gray-600 text-white rounded-lg px-3 py-3 text-base focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none appearance-none" />
          </div>

          <button @click="confirmarPrestamo" :disabled="procesando || !fechaDevolucion"
            class="w-full bg-green-600 hover:bg-green-500 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-green-900/30 transition-all active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            <span v-if="procesando"
              class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
            <span v-else>Confirmar Solicitud</span>
            <svg v-if="!procesando" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
            </svg>
          </button>
        </div>
      </div>
    </transition>

    <div v-if="mostrarConfirmacion"
      class="fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center z-[60] p-6 animate-fade-in">
      <div class="text-center w-full max-w-md">
        <div
          class="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-[0_0_50px_rgba(34,197,94,0.4)] animate-bounce">
          <svg class="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-white mb-2">¡Solicitud Exitosa!</h2>
        <p class="text-gray-400 text-base mb-6">Dirígete al pañol y presenta este código:</p>
        <div class="bg-white/10 border border-white/20 rounded-2xl p-6 mb-6">
          <span class="text-4xl font-mono font-bold text-green-400 tracking-widest">{{ codigoPrestamo }}</span>
        </div>
        <button @click="finalizarSesion"
          class="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-4 rounded-xl border border-gray-600 text-base transition-all active:scale-95">
          Cerrar Sesión
        </button>
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
import sedeBackground from '../assets/images/sede-background.jpg'

const router = useRouter()
const usuario = ref(JSON.parse(localStorage.getItem('user') || '{"nombres": "Estudiante"}'))

// Estados
const categorias = ref([])
const herramientas = ref([])
const carrito = ref([])
const categoriaSeleccionada = ref(null)
const carritoVisible = ref(false)
const procesando = ref(false)
const mostrarConfirmacion = ref(false)
const codigoPrestamo = ref('')
const fechaDevolucion = ref('')

// Timer
const tiempoSesion = ref(300)
const tiempoRestante = computed(() => {
  const minutos = Math.floor(tiempoSesion.value / 60)
  const segundos = tiempoSesion.value % 60
  return `${minutos}:${segundos.toString().padStart(2, '0')}`
})

// Fechas
const minDate = computed(() => {
  const d = new Date(); d.setDate(d.getDate() + 1); return d.toISOString().split('T')[0]
})
const maxDate = computed(() => {
  const d = new Date(); d.setDate(d.getDate() + 7); return d.toISOString().split('T')[0]
})

// Lógica de Filtrado
const herramientasFiltradas = computed(() => {
  if (categoriaSeleccionada.value === null) return herramientas.value
  return herramientas.value.filter(h => h.id_categoria === categoriaSeleccionada.value)
})

const filtrarPorCategoria = (id) => {
  categoriaSeleccionada.value = id
}

// Carrito
const agregarAlCarrito = (item) => {
  if (!yaEnCarrito(item.id_tipo_herramienta) && item.stock > 0) {
    carrito.value.push(item)
    // Feedback vibración en móviles si es soportado
    if (navigator.vibrate) navigator.vibrate(50)
  }
}

const removerDelCarrito = (id) => {
  carrito.value = carrito.value.filter(i => i.id_tipo_herramienta !== id)
  if (carrito.value.length === 0) carritoVisible.value = false
}

const yaEnCarrito = (id) => carrito.value.some(i => i.id_tipo_herramienta === id)

// Acciones
const confirmarPrestamo = async () => {
  procesando.value = true
  try {
    // 1. Obtener herramientas individuales disponibles para cada tipo
    const herramientasIndividuales = []
    for (const item of carrito.value) {
      const disponibles = await inventarioService.getHerramientasDisponiblesPorTipo(
        item.id_tipo_herramienta
      )
      if (disponibles.length > 0) {
        herramientasIndividuales.push(disponibles[0].id_herramienta)
      }
    }

    // 2. Crear el préstamo
    const prestamo = await prestamosService.crearPrestamo({
      fecha_prestamo: new Date().toISOString(),
      fecha_devolucion_esperada: new Date(fechaDevolucion.value).toISOString(),
      estado_prestamo: 'Activo',
      id_usuario: usuario.value.id,
      id_tipo_herramienta: carrito.value[0].id_tipo_herramienta,
      herramientas: herramientasIndividuales
    })

    codigoPrestamo.value = prestamo.codigo
    procesando.value = false
    carritoVisible.value = false
    mostrarConfirmacion.value = true
  } catch (error) {
    console.error('Error:', error)
    alert('Error al crear préstamo: ' + error.message)
    procesando.value = false
  }
}

const finalizarSesion = () => {
  localStorage.removeItem('user')
  localStorage.removeItem('isAuthenticated')
  router.push('/')
}

// Carga de Datos
const cargarDatos = async () => {
  try {
    categorias.value = await inventarioService.getCategorias()
    const resumen = await inventarioService.getTiposHerramientaResumen()

    herramientas.value = resumen.map(tipo => ({
      id_tipo_herramienta: tipo.id_tipo_herramienta,
      id_categoria: tipo.id_categoria || categorias.value[0]?.id_categoria,
      nombre: tipo.nombre,
      imagen_url: tipo.imagen,
      stock: tipo.herramientas_disponibles // ← ESTO ES CLAVE
    }))
  } catch (e) {
    console.error('Error al cargar datos:', e)
  }
}

let timerInterval
onMounted(() => {
  cargarDatos()
  fechaDevolucion.value = minDate.value
  timerInterval = setInterval(() => {
    if (tiempoSesion.value > 0) tiempoSesion.value--
    else finalizarSesion()
  }, 1000)
})

onUnmounted(() => clearInterval(timerInterval))
</script>

<style scoped>
/* Ocultar scrollbars pero mantener funcionalidad */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* Animaciones */
@keyframes ken-burns {
  0% {
    transform: scale(1);
  }

  100% {
    transform: scale(1.1);
  }
}

.animate-ken-burns {
  animation: ken-burns 40s infinite alternate;
}

/* Transiciones del Drawer */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease-out, opacity 0.3s;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
