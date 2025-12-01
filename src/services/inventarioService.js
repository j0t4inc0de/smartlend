import axios from 'axios'

const API_BASE_URL = 'http://72.60.167.16:8000'

export const inventarioService = {
  // Obtener todas las categorías de herramientas
  async getCategorias() {
    try {
      const response = await axios.get(`${API_BASE_URL}/inventario/api/categorias-herramienta/`)
      return response.data
    } catch (error) {
      console.error('Error al obtener categorías:', error)
      throw new Error('No se pudieron cargar las categorías de herramientas')
    }
  },

  // Obtener tipos de herramientas por categoría
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

  // Obtener herramientas individuales disponibles
  async getHerramientasDisponibles() {
    try {
      const response = await axios.get(`${API_BASE_URL}/inventario/api/herramientas/`)
      // Filtrar solo herramientas en buen estado y disponibles
      return response.data.filter((herramienta) =>
        ['Nuevo', 'Excelente', 'Bueno'].includes(herramienta.estado_herramienta),
      )
    } catch (error) {
      console.error('Error al obtener herramientas:', error)
      throw new Error('No se pudieron cargar las herramientas disponibles')
    }
  },

  // Buscar herramientas por código de barras
  async buscarPorCodigoBarras(codigoBarras) {
    try {
      const response = await axios.get(`${API_BASE_URL}/inventario/api/herramientas/`)
      return response.data.find((herramienta) => herramienta.codigo_barras === codigoBarras)
    } catch (error) {
      console.error('Error al buscar herramienta:', error)
      throw new Error('No se pudo encontrar la herramienta')
    }
  },

  // Verificar stock disponible por tipo de herramienta
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
}
