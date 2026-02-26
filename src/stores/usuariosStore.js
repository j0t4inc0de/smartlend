// src\stores\usuariosStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { usuariosService } from '@/services/usuariosService'

export const useUsuariosStore = defineStore('usuarios', () => {
  const usuarios = ref([])
  const isLoading = ref(false)

  const fetchUsuarios = async () => {
    isLoading.value = true
    try {
      usuarios.value = await usuariosService.getUsuarios()
    } catch (error) {
      console.error(error)
    } finally {
      isLoading.value = false
    }
  }

  const addUsuario = async (usuarioData) => {
    try {
      await usuariosService.createUsuario(usuarioData)
      await fetchUsuarios()
    } catch (error) {
      console.error(error)
    }
  }

  const editUsuario = async (id, usuarioData) => {
    try {
      await usuariosService.updateUsuario(id, usuarioData)
      await fetchUsuarios()
    } catch (error) {
      console.error(error)
    }
  }

  const removeUsuario = async (id) => {
    try {
      await usuariosService.deleteUsuario(id)
      usuarios.value = usuarios.value.filter((u) => u.id !== id)
    } catch (error) {
      console.error(error)
    }
  }

  return {
    usuarios,
    isLoading,
    fetchUsuarios,
    addUsuario,
    editUsuario,
    removeUsuario,
  }
})
