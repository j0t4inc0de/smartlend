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
          correo: correo,
          codigo: codigo,
          nueva_password: nueva_password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      return response.data
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const data = error.response.data
        let mensajesDeError = []

        const diccionarioErrores = {
          'This password is too short. It must contain at least 8 characters.':
            'La contraseña es muy corta. Debe tener al menos 8 caracteres.',
          'This password is too common.':
            'La contraseña es demasiado común. Intente con otra diferente.',
          'This password is entirely numeric.':
            'La contraseña no puede estar compuesta solo por números.',
        }

        if (typeof data === 'object' && data !== null) {
          for (const campo in data) {
            const mensajes = Array.isArray(data[campo]) ? data[campo] : [data[campo]]

            mensajes.forEach((mensaje) => {
              const mensajeTraducido =
                diccionarioErrores[mensaje] || 'Error en el formato de la contraseña o código.'
              mensajesDeError.push(mensajeTraducido)
            })
          }
        }

        if (mensajesDeError.length > 0) {
          throw new Error(mensajesDeError.join(' - '))
        }

        throw new Error('Error en la validación de los datos ingresados.')
      }

      throw new Error('Error al procesar la confirmación')
    }
  },
}
