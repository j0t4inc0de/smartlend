import API_BASE_URL from './config/api'

export const getTurnoActual = async () => {
  const response = await fetch(`${API_BASE_URL}/operaciones/api/turnero/actual/`)
  if (!response.ok) {
    throw new Error('Error al obtener el turno actual')
  }
  return response.json()
}
