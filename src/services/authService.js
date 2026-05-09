// src\services\authService.js
import axios from 'axios'
import API_BASE_URL from './config/api.js'
import { alertaService } from './alertasService.js'

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

  // Registro alternativo con correo y contraseña (sin biometría)
  async registerUserWithEmail(payload) {
    try {
      const response = await axios.post(`${API_BASE_URL}/usuarios/api/usuarios/`, payload)
      return response.data
    } catch (error) {
      console.error('Error completo:', error.response || error)
      alertaService.error('Error al registrar usuario, el usuario ya existe')
      const errorMessage = error.response?.data?.error || error.message || 'Error desconocido'
      throw new Error(errorMessage)
    }
  },

  // Para registrar usuarios por ROL definido según la universidad
  async registrarInstitucional(form) {
    const response = await fetch(`${API_BASE_URL}/usuarios/api/registro-institucional/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rut: form.rut,
        nombres: form.nombres,
        apellidos: form.apellidos,
        correo: form.correo,
        password: form.password,
        id_carrera: form.idCarrera || undefined,
        codigo_acceso: form.codigoAcceso.trim(),
      }),
    })
    const data = await response.json()
    if (!response.ok) {
      throw data
    }
    return data
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
  // Inicia sesión con correo y contraseña (modal de correo)
  async loginWithEmail(correo, password) {
    try {
      const response = await axios.post(`${API_BASE_URL}/usuarios/auth/login-usuario/`, {
        correo,
        password,
      })
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
