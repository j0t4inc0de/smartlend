import axios from 'axios'
// Este servicio se encarga ÚNICAMENTE de la autenticación del bodeguero (correo + contraseña).

// Usamos la misma URL base que en authService
const API_BASE_URL = 'http://72.60.167.16:8000'

export const bodegueroAuthService = {
  async login(email, password) {
    try {
      // Ajusta este endpoint ('/auth/login/') según la ruta real de tu Backend Django
      // Si el bodeguero usa el mismo login que los demás, esto servirá.
      // Si tiene un endpoint especial, cámbialo aquí.
      const response = await axios.post(`${API_BASE_URL}/auth/login/`, {
        email: email, // O 'username', depende de cómo lo pida Django
        password: password
      }, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
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
  }
}