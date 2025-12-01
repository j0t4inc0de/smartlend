import axios from 'axios'

const API_BASE_URL = 'http://72.60.167.16:8000'

export const prestamosService = {
  // Obtener todos los préstamos con detalles completos
  async getPrestamos() {
    try {
      const response = await axios.get(`${API_BASE_URL}/operaciones/api/prestamos/`)

      // Enriquecer con información de usuario y herramienta
      const prestamosConDetalles = await Promise.all(
        response.data.map(async (prestamo) => {
          try {
            // Obtener información del usuario
            const usuarioResponse = await axios.get(
              `${API_BASE_URL}/usuarios/api/usuarios/${prestamo.id_usuario}/`,
            )

            // Obtener información de la herramienta individual
            const herramientaResponse = await axios.get(
              `${API_BASE_URL}/inventario/api/herramientas/${prestamo.id_herramienta_individual}/`,
            )

            // Obtener tipo de herramienta
            const tipoResponse = await axios.get(
              `${API_BASE_URL}/inventario/api/tipos-herramienta/${prestamo.id_tipo_herramienta}/`,
            )

            return {
              ...prestamo,
              usuario_nombre: `${usuarioResponse.data.nombres} ${usuarioResponse.data.apellidos}`,
              usuario_correo: usuarioResponse.data.correo,
              usuario_rol: usuarioResponse.data.id_rol,
              herramienta_nombre: tipoResponse.data.nombre,
              codigo_barras: herramientaResponse.data.codigo_barras,
              estado_herramienta: herramientaResponse.data.estado_herramienta,
              fecha_prestamo: new Date(prestamo.fecha_prestamo).toLocaleString('es-CL'),
              fecha_devolucion_esperada: new Date(
                prestamo.fecha_devolucion_esperada,
              ).toLocaleString('es-CL'),
              fecha_devolucion_real: prestamo.fecha_devolucion_real
                ? new Date(prestamo.fecha_devolucion_real).toLocaleString('es-CL')
                : null,
              // Determinar estado basado en fechas
              estado: this.determinarEstado(prestamo),
              condicion_devolucion: prestamo.estado_devolucion || 'Sin Estado',
            }
          } catch (error) {
            console.error(`Error al obtener detalles del préstamo ${prestamo.id_prestamo}:`, error)
            return {
              ...prestamo,
              usuario_nombre: 'Error al cargar',
              herramienta_nombre: 'Error al cargar',
              estado: 'error',
            }
          }
        }),
      )

      return prestamosConDetalles
    } catch (error) {
      console.error('Error al obtener préstamos:', error)
      throw new Error('No se pudieron cargar los préstamos')
    }
  },

  // Crear un nuevo préstamo
  async crearPrestamo(
    usuarioId,
    herramientaIndividualId,
    tipoHerramientaId,
    fechaDevolucionEsperada,
  ) {
    try {
      const prestamoData = {
        fecha_prestamo: new Date().toISOString(),
        fecha_devolucion_esperada: fechaDevolucionEsperada,
        estado_prestamo: 'activo',
        id_usuario: usuarioId,
        id_herramienta_individual: herramientaIndividualId,
        id_tipo_herramienta: tipoHerramientaId,
      }

      const response = await axios.post(`${API_BASE_URL}/operaciones/api/prestamos/`, prestamoData)
      return response.data
    } catch (error) {
      console.error('Error al crear préstamo:', error)
      throw new Error('No se pudo crear el préstamo')
    }
  },

  // Marcar préstamo como devuelto
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
      )
      return response.data
    } catch (error) {
      console.error('Error al marcar préstamo como devuelto:', error)
      throw new Error('No se pudo actualizar el préstamo')
    }
  },

  // Obtener préstamos vencidos
  async getPrestamosVencidos() {
    try {
      const response = await axios.get(`${API_BASE_URL}/operaciones/api/prestamos/vencidos/`)
      return response.data
    } catch (error) {
      console.error('Error al obtener préstamos vencidos:', error)
      throw new Error('No se pudieron cargar los préstamos vencidos')
    }
  },

  // Obtener alertas
  async getAlertas() {
    try {
      const response = await axios.get(`${API_BASE_URL}/operaciones/api/alertas/`)
      return response.data
    } catch (error) {
      console.error('Error al obtener alertas:', error)
      throw new Error('No se pudieron cargar las alertas')
    }
  },

  // Función helper para determinar estado del préstamo
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
}
