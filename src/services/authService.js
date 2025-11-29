import axios from 'axios'

const API_BASE_URL = 'http://72.60.167.16:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})
// Función que registra a un nuevo usuario: No funciona el calculo de embedding, ni seleccion de Carrera y Rol.
export const authService = {
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

  async loginWithFace(imageBlob) {
    try {
      const formData = new FormData()
      formData.append('image', imageBlob, 'face.jpg')

      const response = await axios.post(`${API_BASE_URL}/auth/login-face/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    } catch (error) {
      const errorMessage = error.response?.data?.error || error.message || 'Error desconocido'
      throw new Error(errorMessage)
    }
  },
}
