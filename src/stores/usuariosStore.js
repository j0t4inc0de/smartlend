// src/stores/usuariosStore.js
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { usuariosService } from '@/services/usuariosService'
import { alertaService } from '@/services/alertasService'

export const useUsuariosStore = defineStore('usuarios', () => {
  const usuarios = ref([])
  const isLoading = ref(false)

  const cambiarBaneoUsuario = async (id, nuevoEstado) => {
    try {
      await usuariosService.actualizarEstadoUsuario(id, nuevoEstado)

      const index = usuarios.value.findIndex((u) => u.id === id)
      if (index !== -1) {
        // Usamos la propiedad correcta: esta_baneado
        usuarios.value[index].esta_baneado = nuevoEstado
      }

      const msg = nuevoEstado ? 'Usuario baneado' : 'Usuario desbloqueado'
      alertaService.success(msg)
    } catch (error) {
      console.error(error)
      alertaService.error('Error al cambiar estado del usuario')
    }
  }

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
    cambiarBaneoUsuario,
  }
})
