// cerebro que maneja TODO lo relacionado con la autenticación del bodeguero en tu aplicación.
// administrador centralizado que:

//    Sabe si el bodeguero está logueado o no
//    Guarda los datos del bodeguero autenticado
//    Permite que CUALQUIER componente acceda a esta información
//    Persiste la sesión (no se pierde al recargar)

import { defineStore } from 'pinia'
import { ref } from 'vue'
import { bodegueroAuthService } from '@/services/bodegueroAuthService'

export const useBodegueroAuthStore = defineStore('bodegueroAuth', () => {
  // Estado
  const isAuthenticated = ref(false)
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Inicializar desde localStorage al cargar la app
  const initializeAuth = () => {
    const savedAuth = localStorage.getItem('bodegueroAuth')
    const savedUser = localStorage.getItem('bodegueroUser')

    if (savedAuth === 'true' && savedUser) {
      isAuthenticated.value = true
      user.value = JSON.parse(savedUser)
    }
  }

  // Login
  const login = async (correo, password) => {
    loading.value = true
    error.value = null

    try {
      const response = await bodegueroAuthService.login(correo, password)

      // Guardar en estado
      isAuthenticated.value = true
      user.value = {
        id: response.usuario_id,
        correo: response.correo,
        nombres: response.nombres,
        apellidos: response.apellidos,
        rol: response.rol,
      }

      // Persistir en localStorage
      localStorage.setItem('bodegueroAuth', 'true')
      localStorage.setItem('bodegueroUser', JSON.stringify(user.value))

      return true
    } catch (err) {
      error.value = err.message
      return false
    } finally {
      loading.value = false
    }
  }

  // Logout
  const logout = () => {
    isAuthenticated.value = false
    user.value = null
    localStorage.removeItem('bodegueroAuth')
    localStorage.removeItem('bodegueroUser')
  }

  // Getters
  const fullName = computed(() => {
    if (!user.value) return ''
    return `${user.value.nombres} ${user.value.apellidos}`
  })

  return {
    // Estado
    isAuthenticated,
    user,
    loading,
    error,

    // Actions
    initializeAuth,
    login,
    logout,

    // Getters
    fullName,
  }
})
