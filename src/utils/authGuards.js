// este guard hace que nadie sin auntenticacion pueda acceder a las rutas que lo requieres, si no cualquiera podria acceder al dashboard del bodeguero escribiendo la URL directamente

import { useBodegueroAuthStore } from '@/stores/bodegueroAuthStore'

// Guard para rutas que requieren autenticación de bodeguero
export const requiresBodegueroAuth = (to, from, next) => {
  const authStore = useBodegueroAuthStore()

  if (!authStore.isAuthenticated) {
    // Redirigir a login del bodeguero si no está autenticado
    next('/bodeguero/login')
  } else {
    next()
  }
}

// Guard para evitar que usuarios autenticados vean login again
export const redirectIfAuthenticated = (to, from, next) => {
  const authStore = useBodegueroAuthStore()

  if (authStore.isAuthenticated) {
    // Si ya está logueado, redirigir al dashboard
    next('/bodeguero/dashboard/prestamos')
  } else {
    next()
  }
}

// Guard para rutas públicas (estudiantes/docentes)
export const guestOnly = (to, from, next) => {
  // Aquí podrías agregar lógica si necesitas restricciones
  // Por ahora permite acceso libre
  next()
}
