// src\services\bodegueroAuthService.js
// Este servicio se encarga ÚNICAMENTE de la autenticación del bodeguero (correo + contraseña).
import axios from 'axios'
import API_BASE_URL from './config/api.js'

export const bodegueroAuthService = {
  async login(correo, password) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/usuarios/auth/login-bodeguero/`,
        {
          correo: correo,
          password: password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )

      return response.data
    } catch (error) {
      // Manejo de errores detallado
      if (error.response) {
        // El servidor respondió con un código de error (ej. 401, 400)
        throw new Error(error.response.data.detail || 'Credenciales incorrectas')
      } else if (error.request) {
        // No hubo respuesta del servidor
        throw new Error('No se pudo conectar con el servidor')
      } else {
        throw new Error('Error al procesar la solicitud')
      }
    }
  },
  async solicitarRecuperacion(correo) {
    try {
      const response = await axios.post(`${API_BASE_URL}/usuarios/auth/recuperar-password/`, {
        correo,
      })
      return response.data
    } catch (error) {
      console.log('Error en solicitud de recuperación:', error)
      throw new Error('Error al procesar la solicitud')
    }
  },
  async confirmarRecuperacion(correo, codigo, nueva_password) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/usuarios/auth/confirmar-recuperacion-password/`,
        {
          correo,
          codigo,
          nueva_password,
        },
      )
      return response.data
    } catch (error) {
      if (error.response && error.response.status === 400) {
        throw new Error(error.response.data.error || 'Error en la validación de los datos')
      }
      throw new Error('Error al procesar la confirmación')
    }
  },
}
