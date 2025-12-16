// Este servicio manejara todas las operaciones relacionadas con el inventario de herramientas
import axios from 'axios'

const API_BASE_URL = 'http://72.60.167.16:8000'

export const inventarioService = {
  // Obtiene todas las categorías de herramientas.
  // Retorna: Array de categorías (estructura definida por el backend).
  async getCategorias() {
    try {
      const response = await axios.get(`${API_BASE_URL}/inventario/api/categorias-herramienta/`)
      return response.data
    } catch (error) {
      console.error('Error al obtener categorías:', error)
      throw new Error('No se pudieron cargar las categorías de herramientas')
    }
  },

  // Obtiene un "resumen" de tipos de herramienta.
  // Útil para: vistas que necesiten datos agregados/compactos sin traer todas las unidades físicas.
  // Retorna: Array de tipos resumidos.
  async getTiposHerramientaResumen() {
    try {
      const response = await axios.get(`${API_BASE_URL}/inventario/api/tipos-herramienta/resumen/`)
      return response.data
    } catch (error) {
      console.error('Error al obtener resumen:', error)
      throw new Error('No se pudieron cargar los tipos de herramientas')
    }
  },

  // Obtiene herramientas (unidades físicas) disponibles para un tipo específico.
  // Útil para: cuando se necesite listar las unidades específicas que puedes asignar a un préstamo
  // (por ejemplo, para elegir códigos de barras / seriales).
  // Retorna: Array de herramientas individuales filtradas por el backend usando:
  async getHerramientasDisponiblesPorTipo(tipoHerramientaId) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/inventario/api/herramientas/?id_tipo_herramienta=${tipoHerramientaId}&solo_disponibles=true`,
      )
      return response.data
    } catch (error) {
      console.error('Error al obtener herramientas disponibles:', error)
      throw new Error('No se pudieron cargar las herramientas disponibles')
    }
  },

  // Obtiene tipos de herramienta, opcionalmente filtrados por categoría.
  // Útil para: catálogo principal en dashboard, mostrar stock disponible por tipo, etc.
  // Retorna: Array de tipos de herramienta.
  async getTiposHerramienta(categoriaId = null) {
    try {
      let url = `${API_BASE_URL}/inventario/api/tipos-herramienta/`
      if (categoriaId) {
        url += `?id_categoria=${categoriaId}`
      }
      const response = await axios.get(url)
      return response.data
    } catch (error) {
      console.error('Error al obtener tipos de herramientas:', error)
      throw new Error('No se pudieron cargar los tipos de herramientas')
    }
  },

  // Obtiene herramientas individuales (unidades físicas) - TODAS sin filtrar por estado.
  // Útil para: vistas técnicas/administrativas donde te interese ver unidades físicas.
  // Retorna: Array de todas las herramientas individuales registradas.
  async getHerramientasDisponibles() {
    try {
      const response = await axios.get(`${API_BASE_URL}/inventario/api/herramientas/`)
      return response.data
    } catch (error) {
      console.error('Error al obtener herramientas:', error)
      throw new Error('No se pudieron cargar las herramientas disponibles')
    }
  },

  // Busca una herramienta individual por su código de barras.
  // Útil para: bodeguero / checkout / asignación o devolución por escaneo
  // Implementación actual:
  // - Descarga TODAS las herramientas y luego busca en memoria.
  // Retorna: el objeto herramienta encontrado, o undefined si no existe.
  async buscarPorCodigoBarras(codigoBarras) {
    try {
      const response = await axios.get(`${API_BASE_URL}/inventario/api/herramientas/`)
      return response.data.find((herramienta) => herramienta.codigo_barras === codigoBarras)
    } catch (error) {
      console.error('Error al buscar herramienta:', error)
      throw new Error('No se pudo encontrar la herramienta')
    }
  },

  // Verifica "stock" para un tipo contando herramientas individuales en buen estado.
  // Útil para: validaciones rápidas cuando el backend no te entrega un campo de stock agregado.
  async verificarStock(tipoHerramientaId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/inventario/api/herramientas/`)
      const herramientasDisponibles = response.data.filter(
        (h) =>
          h.id_tipo_herramienta === tipoHerramientaId &&
          ['Nuevo', 'Excelente', 'Bueno'].includes(h.estado_herramienta),
      )
      return {
        disponibles: herramientasDisponibles.length,
        herramientas: herramientasDisponibles,
      }
    } catch (error) {
      console.error('Error al verificar stock:', error)
      throw new Error('No se pudo verificar el stock')
    }
  },

  // Crea una nueva herramienta individual en el inventario.
  // Útil para: bodeguero añadiendo nuevas unidades al stock.
  // Parámetros:
  // - data: objeto con { codigo_barras, estado_herramienta, id_tipo_herramienta, fecha_adquisicion, disponible }
  // Retorna: el objeto herramienta creado con su ID asignado.
  async crearHerramienta(data) {
    try {
      const response = await axios.post(`${API_BASE_URL}/inventario/api/herramientas/`, data)
      return response.data
    } catch (error) {
      console.error('Error al crear herramienta:', error)
      // Manejo de errores específicos del backend
      const errorMsg =
        error.response?.data?.codigo_barras?.[0] ||
        error.response?.data?.detail ||
        'No se pudo crear la herramienta'
      throw new Error(errorMsg)
    }
  },

  // Crea un nuevo TIPO de herramienta con imagen.
  // Útil para: bodeguero añadiendo nuevos tipos al catálogo.
  // Parámetros:
  // - formData: FormData con { nombre, descripcion, id_categoria, imagen (archivo) }
  // Retorna: el objeto tipo de herramienta creado.
  async crearTipoHerramienta(formData) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/inventario/api/tipos-herramienta/`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      return response.data
    } catch (error) {
      console.error('Error al crear tipo de herramienta:', error)
      const errorMsg =
        error.response?.data?.nombre?.[0] ||
        error.response?.data?.detail ||
        'No se pudo crear el tipo de herramienta'
      throw new Error(errorMsg)
    }
  },

  //  NUEVO: Obtiene el historial completo de una herramienta específica.
  // Útil para: trazabilidad, ver quién usó la herramienta, cambios de estado, etc.
  // Parámetros:
  // - idHerramienta: ID de la herramienta individual
  // Retorna: Array de registros históricos con préstamo, usuario y estado.
  async getHistorialHerramienta(idHerramienta) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/inventario/api/historial-herramientas/?herramienta=${idHerramienta}`,
      )
      return response.data
    } catch (error) {
      console.error('Error al obtener historial:', error)
      throw new Error('No se pudo cargar el historial de la herramienta')
    }
  },
}
