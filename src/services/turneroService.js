import API_BASE_URL from './config/api'

export const getTurnoActual = async () => {
  const response = await fetch(`${API_BASE_URL}/operaciones/api/turnero/actual/`)
  if (!response.ok) {
    throw new Error('Error al obtener el turno actual')
  }
  return response.json()
}

// siguiente turno en la cola, marcando el actual como saltado
export const saltarTurnoSiguiente = async (token) => {
  const response = await fetch(`${API_BASE_URL}/operaciones/api/turnero/siguiente/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) {
    throw new Error('Error al saltar al siguiente turno')
  }
  return response.json()
}

// cola de turnos
export const getColaTurnos = async () => {
  const response = await fetch(`${API_BASE_URL}/operaciones/api/turnero/cola/`)
  if (!response.ok) {
    throw new Error('Error al obtener la cola de turnos')
  }
  return response.json()
}
