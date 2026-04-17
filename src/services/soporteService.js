import axios from 'axios'
import API_BASE_URL from './config/api.js'

export const soporteService = {
  async enviarTicket(datos) {
    try {
      const response = await axios.post(`${API_BASE_URL}/usuarios/api/soporte/enviar-asistencia/`, {
        ...datos,
        destinatario: 'smartlend.notificacion@gmail.com',
      })
      return response.data
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Error al enviar la solicitud de asistencia')
    }
  },
}
