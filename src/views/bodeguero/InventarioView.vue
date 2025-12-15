<template>
  <div class="p-8">
    <!-- HEADER -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div>
        <h1 class="text-3xl font-bold text-white mb-2">Inventario de Herramientas</h1>
        <p class="text-gray-400">Gestiona el stock y añade nuevas herramientas</p>
      </div>

      <div class="flex gap-3">
        <button @click="abrirModalNuevoTipo"
          class="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 shadow-lg shadow-blue-900/30">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
          </svg>
          Nuevo Tipo
        </button>
        <button @click="abrirModalNuevaHerramienta"
          class="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-lg font-medium transition-all flex items-center gap-2 shadow-lg shadow-red-900/30">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Añadir Herramienta
        </button>
      </div>
    </div>

    <!-- FILTROS -->
    <div class="mb-6 flex flex-wrap gap-3">
      <button @click="categoriaSeleccionada = null" :class="[
        'px-4 py-2 rounded-lg font-medium transition-all',
        categoriaSeleccionada === null
          ? 'bg-red-600 text-white shadow-lg shadow-red-900/30'
          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
      ]">
        Todas las categorías
      </button>
      <button v-for="categoria in categorias" :key="categoria.id_categoria"
        @click="categoriaSeleccionada = categoria.id_categoria" :class="[
          'px-4 py-2 rounded-lg font-medium transition-all',
          categoriaSeleccionada === categoria.id_categoria
            ? 'bg-red-600 text-white shadow-lg shadow-red-900/30'
            : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
        ]">
        {{ categoria.nombre }}
      </button>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div v-for="i in 8" :key="i" class="bg-gray-800 rounded-xl p-6 border border-gray-700 animate-pulse">
        <div class="aspect-video bg-gray-700 rounded-lg mb-4"></div>
        <div class="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
        <div class="h-3 bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>

    <!-- GRID DE HERRAMIENTAS -->
    <div v-else-if="tiposFiltrados.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <div v-for="tipo in tiposFiltrados" :key="tipo.id_tipo_herramienta"
        class="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-gray-600 transition-all group">

        <!-- Imagen -->
        <div class="aspect-video bg-gray-700 relative overflow-hidden">
          <img v-if="tipo.imagen" :src="tipo.imagen" :alt="tipo.nombre"
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            @error="handleImageError" />
          <div v-else class="w-full h-full flex items-center justify-center">
            <svg class="w-16 h-16 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>

          <!-- Badge de stock -->
          <div
            class="absolute top-3 right-3 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
            <div class="flex items-center gap-2">
              <span :class="[
                'w-2 h-2 rounded-full',
                tipo.herramientas_disponibles > 5 ? 'bg-green-500 animate-pulse' :
                  tipo.herramientas_disponibles > 0 ? 'bg-yellow-500 animate-pulse' :
                    'bg-red-500'
              ]"></span>
              <span class="text-white text-sm font-bold">
                {{ tipo.herramientas_disponibles }}/{{ tipo.total_herramientas }}
              </span>
            </div>
          </div>
        </div>

        <!-- Info -->
        <div class="p-4">
          <h3 class="text-white font-bold text-lg mb-2 line-clamp-2">{{ tipo.nombre }}</h3>
          <p class="text-gray-400 text-sm mb-4 line-clamp-2">{{ tipo.descripcion }}</p>

          <!-- Acciones -->
          <div class="flex gap-2">
            <button @click="verDetalles(tipo)"
              class="flex-1 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all">
              Ver Detalles
            </button>
            <button @click="añadirHerramientaTipo(tipo)"
              class="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- SIN RESULTADOS -->
    <div v-else class="bg-gray-800 rounded-xl border border-gray-700 p-12 text-center">
      <div class="text-6xl mb-4">📦</div>
      <p class="text-gray-400 text-lg">No hay tipos de herramientas en esta categoría</p>
    </div>

    <!-- MODAL NUEVO TIPO DE HERRAMIENTA -->
    <div v-if="modalNuevoTipo" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div class="bg-gray-800 rounded-xl p-6 max-w-lg w-full border border-gray-700">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold text-white">Crear Nuevo Tipo de Herramienta</h3>
          <button @click="cerrarModalNuevoTipo" class="text-gray-400 hover:text-white">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="crearTipoHerramienta" class="space-y-4">
          <!-- Nombre -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Nombre *</label>
            <input v-model="nuevoTipo.nombre" type="text" required placeholder="Ej: Martillo de Goma"
              class="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <!-- Descripción -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Descripción *</label>
            <textarea v-model="nuevoTipo.descripcion" required placeholder="Describe el tipo de herramienta..." rows="3"
              class="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
          </div>

          <!-- Categoría -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Categoría *</label>
            <select v-model="nuevoTipo.id_categoria" required
              class="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Seleccionar categoría...</option>
              <option v-for="categoria in categorias" :key="categoria.id_categoria" :value="categoria.id_categoria">
                {{ categoria.nombre }}
              </option>
            </select>
          </div>

          <!-- Imagen -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Imagen</label>
            <div class="relative">
              <input ref="imageInput" type="file" accept="image/*" @change="handleImageUpload" class="hidden" />
              <button type="button" @click="$refs.imageInput.click()"
                class="w-full bg-gray-700 hover:bg-gray-600 text-white rounded-lg px-4 py-3 border border-gray-600 transition-colors flex items-center justify-center gap-2">
                <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {{ imagenSeleccionada ? 'Cambiar imagen' : 'Seleccionar imagen' }}
              </button>
              <p v-if="imagenSeleccionada" class="text-sm text-green-400 mt-2 flex items-center gap-2">
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                {{ imagenSeleccionada.name }}
              </p>
            </div>
          </div>

          <!-- Preview de imagen -->
          <div v-if="imagenPreview" class="mt-4">
            <p class="text-sm text-gray-400 mb-2">Vista previa:</p>
            <img :src="imagenPreview" alt="Preview"
              class="w-full h-48 object-cover rounded-lg border border-gray-600" />
          </div>

          <!-- Botones -->
          <div class="flex gap-3 pt-4">
            <button type="button" @click="cerrarModalNuevoTipo"
              class="flex-1 px-4 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors">
              Cancelar
            </button>
            <button type="submit" :disabled="procesandoTipo"
              class="flex-1 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {{ procesandoTipo ? 'Creando...' : 'Crear Tipo' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL NUEVA HERRAMIENTA -->
    <div v-if="modalNuevaHerramienta" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div class="bg-gray-800 rounded-xl p-6 max-w-lg w-full border border-gray-700">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold text-white">Añadir Nueva Herramienta</h3>
          <button @click="cerrarModalNuevaHerramienta" class="text-gray-400 hover:text-white">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="crearHerramienta" class="space-y-4">
          <!-- Tipo de herramienta -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Tipo de Herramienta *</label>
            <select v-model="nuevaHerramienta.id_tipo_herramienta" required
              class="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500">
              <option value="">Seleccionar tipo...</option>
              <option v-for="tipo in tiposHerramienta" :key="tipo.id_tipo_herramienta"
                :value="tipo.id_tipo_herramienta">
                {{ tipo.nombre }}
              </option>
            </select>
          </div>

          <!-- Código de barras -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Código de Barras *</label>
            <input v-model="nuevaHerramienta.codigo_barras" type="text" required placeholder="Ej: BAR-001"
              class="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500" />
          </div>

          <!-- Estado -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Estado *</label>
            <select v-model="nuevaHerramienta.estado_herramienta" required
              class="w-full bg-gray-700 text-white rounded-lg px-4 py-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500">
              <option value="Nuevo">Nuevo</option>
              <option value="Excelente">Excelente</option>
              <option value="Bueno">Bueno</option>
              <option value="Regular">Regular</option>
              <option value="Defectuoso">Defectuoso</option>
              <option value="Dañado">Dañado</option>
            </select>
          </div>

          <!-- Botones -->
          <div class="flex gap-3 pt-4">
            <button type="button" @click="cerrarModalNuevaHerramienta"
              class="flex-1 px-4 py-3 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700 transition-colors">
              Cancelar
            </button>
            <button type="submit" :disabled="procesando"
              class="flex-1 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {{ procesando ? 'Guardando...' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL DETALLES -->
    <div v-if="modalDetalles" class="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div class="bg-gray-800 rounded-xl p-6 max-w-2xl w-full border border-gray-700 max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-bold text-white">{{ tipoSeleccionado?.nombre }}</h3>
          <button @click="cerrarModalDetalles" class="text-gray-400 hover:text-white">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Estadísticas -->
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div class="bg-gray-700 rounded-lg p-4">
            <p class="text-gray-400 text-sm mb-1">Total</p>
            <p class="text-white text-2xl font-bold">{{ tipoSeleccionado?.total_herramientas || 0 }}</p>
          </div>
          <div class="bg-gray-700 rounded-lg p-4">
            <p class="text-gray-400 text-sm mb-1">Disponibles</p>
            <p class="text-green-400 text-2xl font-bold">{{ tipoSeleccionado?.herramientas_disponibles || 0 }}</p>
          </div>
        </div>

        <!-- Lista de herramientas -->
        <div v-if="loadingDetalles" class="space-y-2">
          <div v-for="i in 5" :key="i" class="bg-gray-700 rounded-lg p-4 animate-pulse">
            <div class="h-4 bg-gray-600 rounded w-1/2"></div>
          </div>
        </div>

        <div v-else-if="herramientasDetalle.length > 0" class="space-y-2">
          <div v-for="herramienta in herramientasDetalle" :key="herramienta.id_herramienta"
            class="bg-gray-700 rounded-lg p-4 flex items-center justify-between hover:bg-gray-600 transition-colors">
            <div>
              <p class="text-white font-medium font-mono">{{ herramienta.codigo_barras }}</p>
              <p class="text-gray-400 text-sm">Adquirido: {{ formatFecha(herramienta.fecha_adquisicion) }}</p>
            </div>
            <div class="flex items-center gap-3">
              <span :class="[
                'px-3 py-1 rounded-full text-xs font-semibold',
                herramienta.estado_herramienta === 'Nuevo' ? 'bg-green-500/20 text-green-400 border border-green-500/50' :
                  herramienta.estado_herramienta === 'Excelente' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50' :
                    herramienta.estado_herramienta === 'Bueno' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50' :
                      herramienta.estado_herramienta === 'Regular' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50' :
                        'bg-red-500/20 text-red-400 border border-red-500/50'
              ]">
                {{ herramienta.estado_herramienta }}
              </span>
              <span :class="[
                'w-2 h-2 rounded-full',
                herramienta.disponible ? 'bg-green-500' : 'bg-red-500'
              ]" :title="herramienta.disponible ? 'Disponible' : 'En préstamo'"></span>
            </div>
          </div>
        </div>

        <div v-else class="text-center py-8 text-gray-400">
          No hay herramientas registradas para este tipo
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { inventarioService } from '@/services/inventarioService'

// Estados
const loading = ref(true)
const procesando = ref(false)
const procesandoTipo = ref(false)
const categorias = ref([])
const tiposHerramienta = ref([])
const categoriaSeleccionada = ref(null)
const modalNuevaHerramienta = ref(false)
const modalNuevoTipo = ref(false)
const modalDetalles = ref(false)
const tipoSeleccionado = ref(null)
const herramientasDetalle = ref([])
const loadingDetalles = ref(false)
const imageInput = ref(null)
const imagenSeleccionada = ref(null)
const imagenPreview = ref(null)

const nuevaHerramienta = ref({
  codigo_barras: '',
  estado_herramienta: 'Nuevo',
  id_tipo_herramienta: '',
  fecha_adquisicion: new Date().toISOString(),
  disponible: true
})

const nuevoTipo = ref({
  nombre: '',
  descripcion: '',
  id_categoria: '',
})

// Computed
const tiposFiltrados = computed(() => {
  if (categoriaSeleccionada.value === null) return tiposHerramienta.value
  return tiposHerramienta.value.filter(t => t.id_categoria === categoriaSeleccionada.value)
})

// Funciones
const cargarDatos = async () => {
  try {
    loading.value = true
    const [cats, tipos] = await Promise.all([
      inventarioService.getCategorias(),
      inventarioService.getTiposHerramientaResumen()
    ])
    categorias.value = cats
    tiposHerramienta.value = tipos.map(tipo => ({
      ...tipo,
      imagen: tipo.imagen && !tipo.imagen.startsWith('http')
        ? `http://72.60.167.16:8000${tipo.imagen}`
        : tipo.imagen
    }))
  } catch (error) {
    console.error('Error al cargar datos:', error)
    alert('Error al cargar el inventario')
  } finally {
    loading.value = false
  }
}

const handleImageError = (event) => {
  console.warn('Error cargando imagen:', event.target.src)
  event.target.style.display = 'none'
}

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    imagenSeleccionada.value = file
    // Crear preview
    const reader = new FileReader()
    reader.onload = (e) => {
      imagenPreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const abrirModalNuevoTipo = () => {
  nuevoTipo.value = {
    nombre: '',
    descripcion: '',
    id_categoria: '',
  }
  imagenSeleccionada.value = null
  imagenPreview.value = null
  modalNuevoTipo.value = true
}

const cerrarModalNuevoTipo = () => {
  modalNuevoTipo.value = false
  imagenSeleccionada.value = null
  imagenPreview.value = null
}

const crearTipoHerramienta = async () => {
  procesandoTipo.value = true
  try {
    const formData = new FormData()
    formData.append('nombre', nuevoTipo.value.nombre)
    formData.append('descripcion', nuevoTipo.value.descripcion)
    formData.append('id_categoria', nuevoTipo.value.id_categoria)

    if (imagenSeleccionada.value) {
      formData.append('imagen', imagenSeleccionada.value)
    }

    await inventarioService.crearTipoHerramienta(formData)
    alert('Tipo de herramienta creado exitosamente')
    cerrarModalNuevoTipo()
    await cargarDatos()
  } catch (error) {
    console.error('Error:', error)
    alert(error.message || 'Error al crear el tipo de herramienta')
  } finally {
    procesandoTipo.value = false
  }
}

const abrirModalNuevaHerramienta = () => {
  nuevaHerramienta.value = {
    codigo_barras: '',
    estado_herramienta: 'Nuevo',
    id_tipo_herramienta: '',
    fecha_adquisicion: new Date().toISOString(),
    disponible: true
  }
  modalNuevaHerramienta.value = true
}

const cerrarModalNuevaHerramienta = () => {
  modalNuevaHerramienta.value = false
}

const añadirHerramientaTipo = (tipo) => {
  nuevaHerramienta.value.id_tipo_herramienta = tipo.id_tipo_herramienta
  modalNuevaHerramienta.value = true
}

const crearHerramienta = async () => {
  procesando.value = true
  try {
    await inventarioService.crearHerramienta(nuevaHerramienta.value)
    alert('Herramienta creada exitosamente')
    cerrarModalNuevaHerramienta()
    await cargarDatos()
  } catch (error) {
    console.error('Error:', error)
    alert(error.message || 'Error al crear la herramienta')
  } finally {
    procesando.value = false
  }
}

const verDetalles = async (tipo) => {
  tipoSeleccionado.value = tipo
  modalDetalles.value = true
  loadingDetalles.value = true
  herramientasDetalle.value = []

  try {
    const response = await inventarioService.getTiposHerramienta()
    const tipoCompleto = response.find(t => t.id_tipo_herramienta === tipo.id_tipo_herramienta)

    const todas = await inventarioService.getHerramientasDisponibles()
    herramientasDetalle.value = todas.filter(h => h.id_tipo_herramienta === tipo.id_tipo_herramienta)
  } catch (error) {
    console.error('Error:', error)
  } finally {
    loadingDetalles.value = false
  }
}

const cerrarModalDetalles = () => {
  modalDetalles.value = false
  tipoSeleccionado.value = null
  herramientasDetalle.value = []
}

const formatFecha = (fecha) => {
  return new Date(fecha).toLocaleDateString('es-CL', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

onMounted(() => {
  cargarDatos()
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
