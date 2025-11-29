// Este servicio se encarga ÚNICAMENTE de la autenticación del bodeguero (correo + contraseña).
import axios from 'axios'

const API_BASE_URL = 'http://72.60.167.16:8000'

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
}
