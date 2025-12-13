// Este servici maneja las operaciones relacionadas con los préstamos de herramientas
import axios from 'axios'

const API_BASE_URL = 'http://72.60.167.16:8000'

export const prestamosService = {
  _cache: {
    prestamos: [],
    lastUpdate: null,
    ttl: 30000, // 5 minutos de Tiempo de vida: NO CAMBIAR
  },

  clearCache() {
    this._cache.prestamos = []
    this._cache.lastUpdate = null
    console.log('🗑️ Cache limpiado')
  },

  isCacheValid() {
    if (!this._cache.lastUpdate) return false
    return Date.now() - this._cache.lastUpdate < this._cache.ttl
  },

  async getPrestamos(useCache = true) {
    try {
      // 1. Verificar cache válido
      if (useCache && this.isCacheValid() && this._cache.prestamos.length > 0) {
        console.log('📦 Usando préstamos desde cache')
        return this._cache.prestamos
      }

      console.log('🔍 Cargando préstamos desde servidor...')

      // 2. Obtener préstamos (ya vienen enriquecidos del backend)
      const response = await axios.get(`${API_BASE_URL}/operaciones/api/prestamos/`, {
        timeout: 10000,
      })

      if (!response.data || response.data.length === 0) {
        console.log('📭 No hay préstamos')
        return []
      }

      // 3. Formatear fechas y determinar estado
      const prestamosFormateados = response.data.map((prestamo) => ({
        ...prestamo,
        fecha_prestamo: new Date(prestamo.fecha_prestamo).toLocaleString('es-CL'),
        fecha_devolucion_esperada: new Date(prestamo.fecha_devolucion_esperada).toLocaleString(
          'es-CL',
        ),
        fecha_devolucion_real: prestamo.fecha_devolucion_real
          ? new Date(prestamo.fecha_devolucion_real).toLocaleString('es-CL')
          : null,
        estado: this.determinarEstado(prestamo),
      }))

      // 4. Actualizar cache
      this._cache.prestamos = prestamosFormateados
      this._cache.lastUpdate = Date.now()

      console.log(`✅ ${prestamosFormateados.length} préstamos cargados`)
      return prestamosFormateados
    } catch (error) {
      console.error('❌ Error al obtener préstamos:', error)

      // Fallback: devolver cache si existe
      if (this._cache.prestamos.length > 0) {
        console.log('🔄 Usando cache por error de conexión')
        return this._cache.prestamos
      }

      throw new Error('No se pudieron cargar los préstamos')
    }
  },

  // Obtener datos de un usuario específico
  async getUsuario(usuarioId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/usuarios/api/usuarios/${usuarioId}/`, {
        timeout: 5000,
      })
      return response.data
    } catch (error) {
      console.error('Error al obtener usuario:', error)
      return { nombres: 'Usuario', apellidos: 'Desconocido', correo: '' }
    }
  },

  // Obtener tipo de herramienta
  async getTipoHerramienta(tipoId) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/inventario/api/tipos-herramienta/${tipoId}/`,
        {
          timeout: 5000,
        },
      )
      return response.data
    } catch (error) {
      console.error('Error al obtener tipo de herramienta:', error)
      return { nombre: 'Herramienta Desconocida' }
    }
  },

  async getTodosLosTipos() {
    try {
      const response = await axios.get(`${API_BASE_URL}/inventario/api/tipos-herramienta/`, {
        timeout: 5000,
      })
      return response.data
    } catch (error) {
      console.error('Error al obtener tipos de herramienta:', error)
      return []
    }
  },

  // CREAR NUEVO PRÉSTAMO
  async crearPrestamo(data) {
    const response = await axios.post(`${API_BASE_URL}/operaciones/api/prestamos/`, {
      fecha_prestamo: data.fecha_prestamo,
      fecha_devolucion_esperada: data.fecha_devolucion_esperada,
      estado_prestamo: 'Pendiente',
      id_usuario: data.id_usuario,
      tipos: data.tipos,
    })
    return response.data
  },

  async buscarPorCodigo(codigo) {
    const response = await axios.get(
      `${API_BASE_URL}/operaciones/api/prestamos/buscar/?codigo=${codigo}`,
    )
    return response.data
  },

  async getPendientes() {
    const response = await axios.get(`${API_BASE_URL}/operaciones/api/prestamos/pendientes/`)
    return response.data
  },

  async asignarHerramientas(prestamoId, codigos) {
    const response = await axios.post(
      `${API_BASE_URL}/operaciones/api/prestamos/${prestamoId}/asignar_herramientas/`,
      { codigos },
    )
    return response.data
  },

  async devolverHerramientas(prestamoId, codigos, estados = {}) {
    const response = await axios.post(
      `${API_BASE_URL}/operaciones/api/prestamos/${prestamoId}/devolver_herramientas/`,
      { codigos, estados },
    )
    return response.data
  },

  async marcarComoDevuelto(prestamoId, estadoDevolucion = 'Bueno', observaciones = '') {
    try {
      const updateData = {
        fecha_devolucion_real: new Date().toISOString(),
        estado_prestamo: 'Completado',
        estado_devolucion: estadoDevolucion,
        observaciones: observaciones,
      }

      const response = await axios.patch(
        `${API_BASE_URL}/operaciones/api/prestamos/${prestamoId}/`,
        updateData,
        { timeout: 10000 },
      )

      // Invalidar cache para forzar recarga
      this._cache.lastUpdate = null

      return response.data
    } catch (error) {
      console.error('Error al marcar préstamo como devuelto:', error)
      throw new Error('No se pudo actualizar el préstamo')
    }
  },

  // Determinar estado del préstamo
  determinarEstado(prestamo) {
    if (prestamo.estado_prestamo.toLowerCase() === 'completado') {
      return 'completado'
    } else if (prestamo.esta_vencido) {
      return 'vencido'
    } else {
      return 'activo'
    }
  },

  async getEstadisticas() {
    try {
      const prestamos = await this.getPrestamos()

      const stats = {
        total: prestamos.length,
        activos: prestamos.filter((p) => p.estado === 'activo').length,
        vencidos: prestamos.filter((p) => p.estado === 'vencido').length,
        completados: prestamos.filter((p) => p.estado === 'completado').length,
      }

      console.log('📊 Estadísticas:', stats)
      return stats
    } catch (error) {
      console.error('Error al obtener estadísticas:', error)
      return { total: 0, activos: 0, vencidos: 0, completados: 0 }
    }
  },
}
