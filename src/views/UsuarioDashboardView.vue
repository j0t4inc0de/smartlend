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
          class="group relative bg-gray-800/60 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden flex flex-col h-full transition-all duration-200">

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
              <span class="text-[11px] font-bold text-white">{{ herramienta.stock }}</span>
            </div>
          </div>

          <div class="p-2.5 flex-1 flex flex-col">
            <h3 class="text-xs font-bold text-white leading-tight mb-1 line-clamp-2 h-8">{{ herramienta.nombre }}</h3>

            <!-- NUEVO: Selector de cantidad -->
            <div v-if="herramienta.stock > 0" class="mt-auto flex items-center gap-1">
              <button @click="decrementarCantidad(herramienta.id_tipo_herramienta)"
                :disabled="!cantidadesPorTipo[herramienta.id_tipo_herramienta]"
                class="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-all">
                <span class="text-lg font-bold">−</span>
              </button>

              <div class="flex-1 bg-black/40 border border-gray-600 rounded-lg py-2 text-center">
                <span class="text-white font-bold text-sm">
                  {{ cantidadesPorTipo[herramienta.id_tipo_herramienta] || 0 }}
                </span>
              </div>

              <button @click="incrementarCantidad(herramienta.id_tipo_herramienta, herramienta.stock)"
                :disabled="(cantidadesPorTipo[herramienta.id_tipo_herramienta] || 0) >= herramienta.stock"
                class="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-all">
                <span class="text-lg font-bold">+</span>
              </button>
            </div>

            <!-- Agotado -->
            <div v-else class="mt-auto">
              <div class="w-full py-2 bg-gray-700 text-gray-500 rounded-lg font-bold text-xs text-center">
                Agotado
              </div>
            </div>
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
      <button @click="totalHerramientas > 0 ? carritoVisible = true : null" :disabled="totalHerramientas === 0" :class="[
        'w-full h-16 rounded-xl flex items-center justify-between px-5 shadow-2xl border transition-all duration-300',
        totalHerramientas > 0
          ? 'bg-red-600 border-red-400 text-white shadow-[0_0_30px_rgba(220,38,38,0.4)] active:scale-98'
          : 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed'
      ]">
        <div class="flex items-center gap-3">
          <div class="relative">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m4.5-6h8m-8 0V9a3 3 0 116 0v4M9 19a1 1 0 102 0 1 1 0 00-2 0zm10 0a1 1 0 102 0 1 1 0 00-2 0z" />
            </svg>
            <span v-if="totalHerramientas > 0"
              class="absolute -top-2 -right-2 w-5 h-5 bg-white text-red-600 rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
              {{ totalHerramientas }}
            </span>
          </div>
          <div class="flex flex-col items-start">
            <span class="text-base font-bold">{{ totalHerramientas > 0 ? 'Ver Mi Pedido' : 'Carrito Vacío' }}</span>
            <span class="text-[10px] opacity-80 font-medium">{{ totalHerramientas }} Items</span>
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

          <!-- Lista de herramientas con cantidades -->
          <div class="flex-1 overflow-y-auto space-y-2 mb-5 custom-scrollbar pr-1">
            <div v-for="(cantidad, idTipo) in cantidadesPorTipo" :key="idTipo">
              <div v-if="cantidad > 0"
                class="bg-gray-800/50 border border-white/5 p-3 rounded-xl flex justify-between items-center">
                <div class="flex items-center gap-3">
                  <img v-if="getHerramienta(idTipo)?.imagen_url" :src="getHerramienta(idTipo).imagen_url" loading="lazy"
                    decoding="async" @error="getHerramienta(idTipo).imagen_url = null"
                    class="w-10 h-10 rounded-lg object-cover bg-gray-700" />
                  <div>
                    <h4 class="text-white font-bold text-sm">{{ getHerramienta(idTipo)?.nombre }}</h4>
                    <p class="text-xs text-gray-400">Cantidad: {{ cantidad }}</p>
                  </div>
                </div>
                <button @click="removerDelCarrito(idTipo)"
                  class="p-2 text-red-500 bg-red-500/10 rounded-lg hover:bg-red-500/20 active:scale-95 transition-all">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Mensaje informativo -->
          <div class="bg-blue-500/10 border border-blue-500/50 rounded-lg p-3 mb-4">
            <p class="text-blue-300 text-xs">
              📧 Recibirás un código por correo electrónico
            </p>
            <p class="text-blue-300 text-xs mt-1">
              ⏰ Tendrás 30 minutos para retirar las herramientas
            </p>
          </div>

          <!-- Fecha de devolución -->
          <div class="bg-gray-800/50 p-3 rounded-xl mb-5 border border-white/5">
            <label class="block text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">Fecha de
              Devolución</label>
            <input v-model="fechaDevolucion" type="date" :min="minDate" :max="maxDate"
              class="w-full bg-black/40 border border-gray-600 text-white rounded-lg px-3 py-3 text-base focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none appearance-none" />
          </div>

          <button @click="confirmarPrestamo" :disabled="procesando || !fechaDevolucion || totalHerramientas === 0"
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
        <p class="text-gray-400 text-base mb-2">Dirígete al pañol y presenta este código:</p>
        <div class="bg-white/10 border border-white/20 rounded-2xl p-6 mb-4">
          <span class="text-4xl font-mono font-bold text-green-400 tracking-widest">{{ codigoPrestamo }}</span>
        </div>
        <p class="text-yellow-300 text-sm mb-6">⏰ Tienes 30 minutos para retirar</p>
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
const cantidadesPorTipo = ref({})
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

// Computed
const herramientasFiltradas = computed(() => {
  if (categoriaSeleccionada.value === null) return herramientas.value
  return herramientas.value.filter(h => h.id_categoria === categoriaSeleccionada.value)
})

const totalHerramientas = computed(() => {
  return Object.values(cantidadesPorTipo.value).reduce((sum, cant) => sum + (cant || 0), 0)
})

// Funciones de cantidad
const incrementarCantidad = (idTipo, max) => {
  const actual = cantidadesPorTipo.value[idTipo] || 0
  if (actual < max) {
    cantidadesPorTipo.value[idTipo] = actual + 1
    if (navigator.vibrate) navigator.vibrate(50)
  }
}

const decrementarCantidad = (idTipo) => {
  const actual = cantidadesPorTipo.value[idTipo] || 0
  if (actual > 0) {
    cantidadesPorTipo.value[idTipo] = actual - 1
  }
}

const removerDelCarrito = (idTipo) => {
  cantidadesPorTipo.value[idTipo] = 0
  if (totalHerramientas.value === 0) {
    carritoVisible.value = false
  }
}

const getHerramienta = (idTipo) => {
  return herramientas.value.find(h => h.id_tipo_herramienta === parseInt(idTipo))
}

const filtrarPorCategoria = (id) => {
  categoriaSeleccionada.value = id
}

// Confirmar préstamo con NUEVO formato
const confirmarPrestamo = async () => {
  procesando.value = true
  try {
    // Obtener usuario autenticado
    const stored = localStorage.getItem('user')
    const user = stored ? JSON.parse(stored) : null
    const idUsuario = user?.id ?? user?.id_usuario

    if (!idUsuario) {
      alert('No se encontró el id del usuario autenticado. Vuelve a iniciar sesión.')
      return
    }

    // Convertir objeto de cantidades a array de tipos
    const tipos = Object.entries(cantidadesPorTipo.value)
      .filter(([_, cantidad]) => cantidad > 0)
      .map(([idTipo, cantidad]) => ({
        tipo_herramienta: parseInt(idTipo, 10),
        cantidad,
      }))

    if (tipos.length === 0) {
      alert('Selecciona al menos una herramienta')
      return
    }

    // Crear préstamo
    const prestamo = await prestamosService.crearPrestamo({
      fecha_prestamo: new Date().toISOString(),
      fecha_devolucion_esperada: new Date(fechaDevolucion.value + 'T23:59:59').toISOString(),
      estado_prestamo: 'Pendiente',
      id_usuario: idUsuario,
      tipos,
    })

    codigoPrestamo.value = prestamo.codigo
    carritoVisible.value = false
    mostrarConfirmacion.value = true
    cantidadesPorTipo.value = {}
    await cargarDatos()
  } catch (error) {
    console.error('Error:', error)
    const mensaje =
      error.response?.data?.id_usuario?.[0] ||
      error.response?.data?.tipos ||
      error.response?.data?.detail ||
      'Error al crear el préstamo'
    alert(mensaje)
  } finally {
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

    // Este endpoint trae stock (disponible real) y reservado
    const tipos = await inventarioService.getTiposHerramienta()

    herramientas.value = tipos.map((tipo) => ({
      id_tipo_herramienta: tipo.id_tipo_herramienta ?? tipo.id,
      id_categoria: tipo.id_categoria || categorias.value[0]?.id_categoria,
      nombre: tipo.nombre,
      imagen_url: tipo.imagen ? tipo.imagen : null,
      stock: tipo.stock, // DISPONIBLE real para pedir
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
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

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
