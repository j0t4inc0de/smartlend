// src/services/reportesService.js
import axios from 'axios'
import API_BASE_URL from './config/api.js'

export const reportesService = {
  // Reporte de morosos en formato PDF
  async descargarMorososPDF() {
    try {
      const response = await axios.get(`${API_BASE_URL}/operaciones/api/reportes/morosos/`, {
        params: { formato: 'pdf' },
        responseType: 'blob',
      })

      this._descargarArchivo(response.data, 'reporte_morosos.pdf')
    } catch (error) {
      console.error('Error al descargar el PDF de morosos:', error)
      throw error
    }
  },

  // Reporte de inventario en formato Excel
  async descargarInventarioExcel() {
    try {
      const response = await axios.get(`${API_BASE_URL}/operaciones/api/reportes/inventario/`, {
        params: { formato: 'excel' },
        responseType: 'blob',
      })

      this._descargarArchivo(response.data, 'reporte_inventario.xlsx')
    } catch (error) {
      console.error('Error al descargar el Excel de inventario:', error)
      throw error
    }
  },

  // Función auxiliar privada para forzar la descarga en el navegador
  _descargarArchivo(blob, nombreArchivo) {
    const url = window.URL.createObjectURL(new Blob([blob]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', nombreArchivo)
    document.body.appendChild(link)
    link.click()
    link.parentNode.removeChild(link)
    window.URL.revokeObjectURL(url)
  },
}
