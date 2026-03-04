// src/services/reportesService.js
import axios from 'axios'
import API_BASE_URL from './config/api.js'

export const reportesService = {
  // Obtener usuarios
  async getUsuariosDatos() {
    try {
      const response = await axios.get(`${API_BASE_URL}/usuarios/api/usuarios/`)
      return response.data
    } catch (error) {
      console.error('Error al obtener datos de usuarios:', error)
      throw error
    }
  },

  // Obtener Tipos de Herramientas (Agrupado: stock, reservado, nombre)
  async getInventarioDatos() {
    try {
      const response = await axios.get(`${API_BASE_URL}/inventario/api/tipos-herramienta/`)
      return Array.isArray(response.data) ? response.data : []
    } catch (error) {
      console.error('Error al obtener tipos de inventario:', error)
      throw error
    }
  },

  // Obtener Herramientas Individuales (Detalle: código de barras, estado)
  async getHerramientasDatos() {
    try {
      const response = await axios.get(`${API_BASE_URL}/inventario/api/herramientas/`)
      return Array.isArray(response.data) ? response.data : []
    } catch (error) {
      console.error('Error al obtener herramientas individuales:', error)
      throw error
    }
  },
  //   Obtener historial de herramientas para calcular último préstamo
  async getHistorialHerramientasDatos() {
    try {
      const response = await axios.get(`${API_BASE_URL}/inventario/api/historial-herramientas/`)
      return Array.isArray(response.data) ? response.data : []
    } catch (error) {
      console.error('Error al obtener el historial de herramientas:', error)
      throw error
    }
  },
}
