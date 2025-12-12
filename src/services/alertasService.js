// Este servicio manejara las oeraciones para las notificaiones para el bodeguero
import axios from 'axios'

const API_BASE_URL = 'http://72.60.167.16:8000'

export const alertasService = {
  // Obtener todas las alertas
  async getAlertas() {
    try {
      const response = await axios.get(`${API_BASE_URL}/operaciones/api/alertas/`)
      return response.data
    } catch (error) {
      console.error('Error al obtener alertas:', error)
      throw new Error('No se pudieron cargar las alertas')
    }
  },

  // Obtener solo alertas no resueltas
  async getAlertasNoResueltas() {
    try {
      const response = await axios.get(`${API_BASE_URL}/operaciones/api/alertas/`)
      return response.data.filter((alerta) => !alerta.resuelta)
    } catch (error) {
      console.error('Error al obtener alertas:', error)
      throw new Error('No se pudieron cargar las alertas')
    }
  },

  // Obtener información del usuario de una alerta
  async getUsuarioDeAlerta(alerta) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/usuarios/api/usuarios/${alerta.prestamo_detalle.id_usuario}/`,
      )
      return response.data
    } catch (error) {
      console.error('Error al obtener usuario:', error)
      return { nombres: 'Usuario', apellidos: 'Desconocido' }
    }
  },

  // Enriquecer alertas con información adicional
  async getAlertasEnriquecidas() {
    try {
      const alertas = await this.getAlertasNoResueltas()
      console.log('Alertas sin resolver encontradas:', alertas.length)

      const alertasEnriquecidas = await Promise.all(
        alertas.map(async (alerta) => {
          try {
            const usuario = await this.getUsuarioDeAlerta(alerta)

            return {
              ...alerta,
              usuario_nombre: `${usuario.nombres} ${usuario.apellidos}`,
              codigo_prestamo: alerta.prestamo_detalle.codigo, // ← CÓDIGO DEL PRÉSTAMO
              dias_vencido: this.calcularDiasVencido(
                alerta.prestamo_detalle.fecha_devolucion_esperada,
              ),
              fecha_formateada: new Date(alerta.creada_en).toLocaleString('es-CL'),
            }
          } catch (error) {
            console.error(`Error al enriquecer alerta ${alerta.id_alerta}:`, error)
            return {
              ...alerta,
              usuario_nombre: 'Error al cargar',
              codigo_prestamo: 'N/A',
              dias_vencido: 0,
              fecha_formateada: 'Error',
            }
          }
        }),
      )

      console.log('Alertas enriquecidas:', alertasEnriquecidas.length)
      return alertasEnriquecidas
    } catch (error) {
      console.error('Error al obtener alertas enriquecidas:', error)
      throw error
    }
  },

  // Calcular días vencidos
  calcularDiasVencido(fechaDevolucionEsperada) {
    const ahora = new Date()
    const fechaEsperada = new Date(fechaDevolucionEsperada)
    const diferencia = ahora - fechaEsperada
    return Math.floor(diferencia / (1000 * 60 * 60 * 24))
  },
}
