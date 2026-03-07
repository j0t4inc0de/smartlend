// src\services\usuariosService.js
// Service para manejo de usuarios
import axios from 'axios'
import API_BASE_URL from './config/api.js'

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

  async createUsuario(usuarioData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/usuarios/api/usuarios/`, usuarioData)
      return response.data
    } catch (error) {
      console.error('Error al crear usuario:', error)
      throw new Error('Error al crear usuario')
    }
  },

  async updateUsuario(idUsuario, usuarioData) {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/usuarios/api/usuarios/${idUsuario}/`,
        usuarioData,
      )
      return response.data
    } catch (error) {
      console.error('Error al actualizar usuario:', error)
      throw new Error('Error al actualizar usuario')
    }
  },

  async deleteUsuario(idUsuario) {
    try {
      await axios.delete(`${API_BASE_URL}/usuarios/api/usuarios/${idUsuario}/`)
      return true
    } catch (error) {
      console.error('Error al eliminar usuario:', error)
      throw new Error('Error al eliminar usuario')
    }
  },
  async actualizarEstadoUsuario(id, baneo) {
    // Asumiendo que tu backend recibe un booleano 'baneado'
    return await axios.patch(`${API_BASE_URL}/usuarios/api/usuarios/${id}/`, { baneado: baneo })
  },
}
