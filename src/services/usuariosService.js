// Service para manejo de usuarios
import axios from 'axios'

const API_BASE_URL = 'http://72.60.167.16:8000'

export const usuariosService = {
  // Obtiene todos los usuarios registrados en el sistema
  // Útil para: mostrar información de usuarios en historiales, reportes, etc.
  // Retorna: Array de usuarios con toda su información
  async getUsuarios() {
    try {
      const response = await axios.get(`${API_BASE_URL}/usuarios/api/usuarios/`)
      return response.data
    } catch (error) {
      console.error('Error al obtener usuarios:', error)
      throw new Error('No se pudieron cargar los usuarios')
    }
  },

  // Obtiene un usuario específico por su ID
  // Útil para: obtener detalles de un usuario específico
  // Retorna: Objeto usuario o null si no existe
  async getUsuarioPorId(idUsuario) {
    try {
      const response = await axios.get(`${API_BASE_URL}/usuarios/api/usuarios/`)
      return response.data.find((u) => u.id === idUsuario) || null
    } catch (error) {
      console.error('Error al obtener usuario:', error)
      throw new Error('No se pudo obtener el usuario')
    }
  },
}
