// ✅ SERVICIO DE PRÉSTAMOS OPTIMIZADO - Sin problemas de performance
import axios from 'axios'

const API_BASE_URL = 'http://72.60.167.16:8000'

export const prestamosService = {
  _cache: {
    usuarios: new Map(),
    herramientas: new Map(),
    tiposHerramientas: new Map(),
    prestamos: [],
    lastUpdate: null,
    ttl: 300000, // 5 minutos TTL
  },

  clearCache() {
    this._cache.usuarios.clear()
    this._cache.herramientas.clear()
    this._cache.tiposHerramientas.clear()
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

      // 2. Obtener préstamos básicos
      const response = await axios.get(`${API_BASE_URL}/operaciones/api/prestamos/`, {
        timeout: 10000,
      })

      if (!response.data || response.data.length === 0) {
        console.log('📭 No hay préstamos')
        return []
      }

      // 3. OPTIMIZACIÓN: Extraer IDs únicos
      const userIds = [...new Set(response.data.map((p) => p.id_usuario).filter(Boolean))]
      const herramientaIds = [
        ...new Set(response.data.map((p) => p.id_herramienta_individual).filter(Boolean)),
      ]
      const tipoIds = [...new Set(response.data.map((p) => p.id_tipo_herramienta).filter(Boolean))]

      console.log(
        `📊 Cargando datos únicos: ${userIds.length} usuarios, ${herramientaIds.length} herramientas, ${tipoIds.length} tipos`,
      )

      // 4. CARGAR EN LOTE CON CACHE
      const [usuarios, herramientas, tipos] = await Promise.all([
        this.getUsuariosBatch(userIds),
        this.getHerramientasBatch(herramientaIds),
        this.getTiposHerramientaBatch(tipoIds),
      ])

      // 5. Crear lookup maps para performance
      const usuariosMap = this.createLookupMap(usuarios, 'id')
      const herramientasMap = this.createLookupMap(herramientas, 'id_herramienta')
      const tiposMap = this.createLookupMap(tipos, 'id_tipo_herramienta')

      // 6. ENRIQUECER PRÉSTAMOS (sin requests adicionales)
      const prestamosEnriquecidos = response.data.map((prestamo) => {
        try {
          const usuario = usuariosMap[prestamo.id_usuario] || {
            nombres: 'Usuario',
            apellidos: 'Desconocido',
            correo: '',
          }
          const herramienta = herramientasMap[prestamo.id_herramienta_individual] || {
            codigo_barras: 'N/A',
            estado_herramienta: 'Desconocido',
          }
          const tipo = tiposMap[prestamo.id_tipo_herramienta] || {
            nombre: 'Herramienta Desconocida',
          }

          return {
            ...prestamo,
            usuario_nombre: `${usuario.nombres} ${usuario.apellidos}`,
            usuario_correo: usuario.correo || '',
            usuario_rol: usuario.id_rol || '',
            herramienta_nombre: tipo.nombre,
            codigo_barras: herramienta.codigo_barras || 'N/A',
            estado_herramienta: herramienta.estado_herramienta || 'Desconocido',
            fecha_prestamo: new Date(prestamo.fecha_prestamo).toLocaleString('es-CL'),
            fecha_devolucion_esperada: new Date(prestamo.fecha_devolucion_esperada).toLocaleString(
              'es-CL',
            ),
            fecha_devolucion_real: prestamo.fecha_devolucion_real
              ? new Date(prestamo.fecha_devolucion_real).toLocaleString('es-CL')
              : null,
            estado: this.determinarEstado(prestamo),
            condicion_devolucion: prestamo.estado_devolucion || 'Sin Estado',
          }
        } catch (error) {
          console.error(`Error al enriquecer préstamo ${prestamo.id_prestamo}:`, error)
          return {
            ...prestamo,
            usuario_nombre: 'Error al cargar',
            herramienta_nombre: 'Error al cargar',
            codigo_barras: 'Error',
            estado: 'error',
            condicion_devolucion: 'Error',
          }
        }
      })

      // 7. Actualizar cache
      this._cache.prestamos = prestamosEnriquecidos
      this._cache.lastUpdate = Date.now()

      console.log(`✅ ${prestamosEnriquecidos.length} préstamos cargados y cacheados`)
      return prestamosEnriquecidos
    } catch (error) {
      console.error('❌ Error al obtener préstamos:', error)

      // Fallback: devolver cache si existe, sino error
      if (this._cache.prestamos.length > 0) {
        console.log('🔄 Usando cache por error de conexión')
        return this._cache.prestamos
      }

      throw new Error('No se pudieron cargar los préstamos')
    }
  },

  // CARGAR USUARIOS EN LOTE CON CACHE
  async getUsuariosBatch(userIds) {
    const usuarios = []
    const idsToFetch = []

    // Verificar cache primero
    userIds.forEach((id) => {
      if (this._cache.usuarios.has(id)) {
        usuarios.push(this._cache.usuarios.get(id))
      } else {
        idsToFetch.push(id)
      }
    })

    // Cargar solo los que no están en cache
    if (idsToFetch.length > 0) {
      console.log(`👥 Cargando ${idsToFetch.length} usuarios nuevos`)

      const responses = await Promise.allSettled(
        idsToFetch.map((id) =>
          axios.get(`${API_BASE_URL}/usuarios/api/usuarios/${id}/`, {
            timeout: 15000,
          }),
        ),
      )

      responses.forEach((result, index) => {
        const id = idsToFetch[index]
        if (result.status === 'fulfilled') {
          const userData = result.value.data
          console.log('👤 Usuario cargado:', userData)
          this._cache.usuarios.set(id, userData)
          usuarios.push(userData)
        } else {
          const fallback = {
            id: id,
            nombres: 'Usuario',
            apellidos: 'Desconocido',
            correo: '',
            id_rol: '',
          }
          this._cache.usuarios.set(id, fallback)
          usuarios.push(fallback)
          console.warn(`⚠️ Error al cargar usuario ${id}:`, result.reason.message)
        }
      })
    }

    return usuarios
  },

  // CARGAR HERRAMIENTAS EN LOTE CON CACHE
  async getHerramientasBatch(herramientaIds) {
    const herramientas = []
    const idsToFetch = []

    herramientaIds.forEach((id) => {
      if (this._cache.herramientas.has(id)) {
        herramientas.push(this._cache.herramientas.get(id))
      } else {
        idsToFetch.push(id)
      }
    })

    if (idsToFetch.length > 0) {
      console.log(`🔧 Cargando ${idsToFetch.length} herramientas nuevas`)

      const responses = await Promise.allSettled(
        idsToFetch.map((id) =>
          axios.get(`${API_BASE_URL}/inventario/api/herramientas/${id}/`, {
            timeout: 15000,
          }),
        ),
      )

      responses.forEach((result, index) => {
        const id = idsToFetch[index]
        if (result.status === 'fulfilled') {
          const herramientaData = result.value.data
          this._cache.herramientas.set(id, herramientaData)
          herramientas.push(herramientaData)
        } else {
          const fallback = {
            id_herramienta_individual: id,
            codigo_barras: 'N/A',
            estado_herramienta: 'Desconocido',
          }
          this._cache.herramientas.set(id, fallback)
          herramientas.push(fallback)
          console.warn(`⚠️ Error al cargar herramienta ${id}:`, result.reason.message)
        }
      })
    }

    return herramientas
  },

  // CARGAR TIPOS DE HERRAMIENTA EN LOTE CON CACHE
  async getTiposHerramientaBatch(tipoIds) {
    const tipos = []
    const idsToFetch = []

    tipoIds.forEach((id) => {
      if (this._cache.tiposHerramientas.has(id)) {
        tipos.push(this._cache.tiposHerramientas.get(id))
      } else {
        idsToFetch.push(id)
      }
    })

    if (idsToFetch.length > 0) {
      console.log(`📋 Cargando ${idsToFetch.length} tipos de herramienta nuevos`)

      const responses = await Promise.allSettled(
        idsToFetch.map((id) =>
          axios.get(`${API_BASE_URL}/inventario/api/tipos-herramienta/${id}/`, {
            timeout: 15000,
          }),
        ),
      )

      responses.forEach((result, index) => {
        const id = idsToFetch[index]
        if (result.status === 'fulfilled') {
          const tipoData = result.value.data
          this._cache.tiposHerramientas.set(id, tipoData)
          tipos.push(tipoData)
        } else {
          const fallback = { id_tipo_herramienta: id, nombre: 'Herramienta Desconocida' }
          this._cache.tiposHerramientas.set(id, fallback)
          tipos.push(fallback)
          console.warn(`⚠️ Error al cargar tipo ${id}:`, result.reason.message)
        }
      })
    }

    return tipos
  },

  // HELPER: Crear lookup map para performance
  createLookupMap(items, keyField) {
    const map = {}
    console.log('🔍 Primer item completo:', items[0])
    items.forEach((item) => {
      if (item && item[keyField]) {
        map[item[keyField]] = item
      }
    })
    console.log('🔍 Map creado:', Object.keys(map))
    return map
  },

  // Obtener solo préstamos básicos (para contadores)
  async getPrestamosBasicos() {
    try {
      const response = await axios.get(`${API_BASE_URL}/operaciones/api/prestamos/`, {
        timeout: 15000,
      })

      return response.data.map((prestamo) => ({
        ...prestamo,
        estado: this.determinarEstado(prestamo),
      }))
    } catch (error) {
      console.error('Error al obtener préstamos básicos:', error)
      throw new Error('No se pudieron cargar los préstamos básicos')
    }
  },

  // CREAR NUEVO PRÉSTAMO
  async crearPrestamo(data) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/operaciones/api/prestamos/`,
        data,
        { timeout: 10000 }
      )

      // Invalidar cache para forzar recarga
      this._cache.lastUpdate = null

      return response.data
    } catch (error) {
      console.error('Error al crear préstamo:', error)
      throw new Error('No se pudo crear el préstamo')
    }
  },

  // MARCAR COMO DEVUELTO
  async marcarComoDevuelto(prestamoId, estadoDevolucion = 'Bueno', observaciones = '') {
    try {
      const updateData = {
        fecha_devolucion_real: new Date().toISOString(),
        estado_prestamo: 'completado',
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

  // OBTENER PRÉSTAMOS VENCIDOS
  async getPrestamosVencidos() {
    try {
      const response = await axios.get(`${API_BASE_URL}/operaciones/api/prestamos/vencidos/`, {
        timeout: 10000,
      })
      return response.data
    } catch (error) {
      console.error('Error al obtener préstamos vencidos:', error)
      throw new Error('No se pudieron cargar los préstamos vencidos')
    }
  },

  // OBTENER ALERTAS
  async getAlertas() {
    try {
      const response = await axios.get(`${API_BASE_URL}/operaciones/api/alertas/`, {
        timeout: 10000,
      })
      return response.data
    } catch (error) {
      console.error('Error al obtener alertas:', error)
      throw new Error('No se pudieron cargar las alertas')
    }
  },

  // Determinar estado del préstamo
  determinarEstado(prestamo) {
    const ahora = new Date()
    const fechaEsperada = new Date(prestamo.fecha_devolucion_esperada)

    if (prestamo.fecha_devolucion_real) {
      return 'completado'
    } else if (fechaEsperada < ahora) {
      return 'vencido'
    } else {
      return 'activo'
    }
  },

  async getEstadisticas() {
    try {
      const prestamos = await this.getPrestamosBasicos()

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
