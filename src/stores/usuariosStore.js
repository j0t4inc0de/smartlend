// src/stores/usuariosStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { usuariosService } from '@/services/usuariosService'

export const useUsuariosStore = defineStore('usuarios', () => {
  const usuarios = ref([])
  const isLoading = ref(false)

  // Obtiene los datos desde la API y actualiza el estado local
  const fetchUsuarios = async () => {
    isLoading.value = true
    try {
      usuarios.value = await usuariosService.getUsuarios()
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
