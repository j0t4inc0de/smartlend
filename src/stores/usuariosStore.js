// src/stores/usuariosStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUsuariosStore = defineStore('usuarios', () => {
  const usuarios = ref([])
  const isLoading = ref(false)

  const fetchUsuarios = async () => {
    isLoading.value = true
    try {
      // Petición al backend
    } catch (error) {
      console.error('Error al cargar usuarios:', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    usuarios,
    isLoading,
    fetchUsuarios,
  }
})
