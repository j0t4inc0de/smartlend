// src\stores\bodegueroAuthStore.js
// cerebro que maneja TODO lo relacionado con la autenticación del bodeguero en tu aplicación.
// administrador centralizado que:

//    Sabe si el bodeguero está logueado o no
//    Guarda los datos del bodeguero autenticado
//    Permite que CUALQUIER componente acceda a esta información
//    Persiste la sesión (no se pierde al recargar)

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { bodegueroAuthService } from '@/services/bodegueroAuthService'

export const useBodegueroAuthStore = defineStore('bodegueroAuth', () => {
  // Estado
  const isAuthenticated = ref(false)
  const user = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const token = ref(null)

  // Inicializar desde localStorage al cargar la app
  const initializeAuth = () => {
    const savedAuth = localStorage.getItem('bodegueroAuth')
    const savedUser = localStorage.getItem('bodegueroUser')
    const savedToken = localStorage.getItem('token')

    // Agregamos savedToken a la validación
    if (savedAuth === 'true' && savedUser && savedToken) {
      isAuthenticated.value = true
      user.value = JSON.parse(savedUser)
      token.value = savedToken
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
      token.value = response.token // Guardamos en la variable reactiva

      // Persistir en localStorage
      localStorage.setItem('bodegueroAuth', 'true')
      localStorage.setItem('bodegueroUser', JSON.stringify(user.value))
      localStorage.setItem('token', token.value)

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
    token.value = null
    localStorage.removeItem('bodegueroAuth')
    localStorage.removeItem('bodegueroUser')
    localStorage.removeItem('token')
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
    token,

    // Actions
    initializeAuth,
    login,
    logout,

    // Getters
    fullName,
  }
})
