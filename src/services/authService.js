import axios from 'axios'

const API_BASE_URL = 'http://72.60.167.16:8000'

export const authService = {
  // Manejo de autenticación facial
  // Obtiene todos los datros del formulario y los envia al server para registrar un usuario junto a su embedding facial
  async registerUserWithFace(formData) {
    try {
      const response = await axios.post(`${API_BASE_URL}/usuarios/auth/register-face/`, formData)
      return response.data
    } catch (error) {
      console.error('Error completo:', error.response || error)
      const errorMessage = error.response?.data?.error || error.message || 'Error desconocido'
      throw new Error(errorMessage)
    }
  },
  // Inicia sesion con reconocimiento facial: Toma la imagen y la envia en un formdata al servidor para que la procese
  async loginWithFace(imageBlob) {
    try {
      const formData = new FormData()
      formData.append('image', imageBlob, 'face.jpg')

      const response = await axios.post(`${API_BASE_URL}/usuarios/auth/login/`, formData)
      return response.data
    } catch (error) {
      console.error('Error completo:', error.response || error)
      const errorMessage = error.response?.data?.error || error.message || 'Error desconocido'
      throw new Error(errorMessage)
    }
  },
  // Obtiene un usario por su id
  async getUsuarioById(usuarioId) {
    try {
      const response = await axios.get(`${API_BASE_URL}/usuarios/api/usuarios/${usuarioId}/`)
      return response.data
    } catch (error) {
      console.error('Error al obtener usuario:', error)
      throw new Error('No se pudieron obtener los datos del usuario')
    }
  },

  // Manejo de carreras y roles para el registro de usuarios
  async getCarreras() {
    try {
      const response = await axios.get(`${API_BASE_URL}/usuarios/api/carreras/`)
      return response.data
    } catch (error) {
      console.error('Error al cargar carreras:', error)
      throw new Error('No se pudieron cargar las carreras disponibles')
    }
  },

  async getRoles() {
    try {
      const response = await axios.get(`${API_BASE_URL}/usuarios/api/roles/`)
      return response.data
    } catch (error) {
      console.error('Error al cargar roles:', error)
      throw new Error('No se pudieron cargar los roles disponibles')
    }
  },
}
