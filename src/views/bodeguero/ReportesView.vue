<template>
    <div class="space-y-6">
        <div class="bg-gray-800 rounded-xl border border-gray-700 p-6 shadow-xl">
            <h3 class="text-lg font-semibold text-white mb-4">Exportar Reportes Personalizados</h3>

            <div class="flex flex-wrap gap-4">
                <button @click="generarExcelUsuarios" :disabled="cargandoExcel" class="bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                    <span v-if="cargandoExcel">Generando...</span>
                    <span v-else>Usuarios (Excel)</span>
                </button>

                <button @click="generarExcelInventario" :disabled="cargandoExcelInv" class="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                    <span v-if="cargandoExcelInv">Generando...</span>
                    <span v-else>Inventario Detallado (Excel)</span>
                </button>

                <button @click="generarPDFInventario" :disabled="cargandoPDF" class="bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                    <span v-if="cargandoPDF">Generando PDF...</span>
                    <span v-else>Inventario Resumen (PDF)</span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { reportesService } from '@/services/reportesService'
import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// Estados de carga independientes
const cargandoExcel = ref(false)
const cargandoExcelInv = ref(false)
const cargandoPDF = ref(false)
// --- GENERAR EXCEL DE USUARIOS ---
// --- GENERAR EXCEL DE USUARIOS ---
const generarExcelUsuarios = async () => {
    try {
        cargandoExcel.value = true

        // 1. Obtenemos Usuarios e Historial al mismo tiempo
        const [usuariosRaw, historialRaw] = await Promise.all([
            reportesService.getUsuariosDatos(),
            reportesService.getHistorialHerramientasDatos()
        ])

        // 2. Procesamos el historial para encontrar la fecha más reciente por cada usuario
        const ultimosPrestamosMap = {} // Formato: { id_usuario: fecha_mas_reciente (Date) }

        historialRaw.forEach(registro => {
            const idUsuario = registro.usuario
            const fechaRegistro = new Date(registro.registrada_en)

            // Si el usuario aún no está en nuestro mapa, o si la fecha que estamos 
            // iterando es MÁS NUEVA que la que ya teníamos guardada, la actualizamos.
            if (!ultimosPrestamosMap[idUsuario] || fechaRegistro > ultimosPrestamosMap[idUsuario]) {
                ultimosPrestamosMap[idUsuario] = fechaRegistro
            }
        })

        // 3. Mapeamos los usuarios cruzando la información con nuestro mapa
        const datosFormateados = usuariosRaw.map(usuario => {
            const fechaRegistro = usuario.date_joined
                ? new Date(usuario.date_joined).toLocaleDateString('es-CL')
                : 'Desconocida';

            // Buscamos la fecha en nuestro mapa usando el ID del usuario
            const fechaUltimo = ultimosPrestamosMap[usuario.id]

            const fechaUltimoPrestamo = fechaUltimo
                ? fechaUltimo.toLocaleDateString('es-CL')
                : 'No registra';

            return {
                'Nombres': usuario.nombres || 'N/A',
                'Apellidos': usuario.apellidos || 'N/A',
                'Correo Electrónico': usuario.correo || 'N/A',
                'Baneado': usuario.esta_baneado ? 'Sí' : 'No',
                'Fecha de Registro': fechaRegistro,
                'Último Préstamo': fechaUltimoPrestamo
            }
        })

        // 4. Construimos el Excel
        const worksheet = XLSX.utils.json_to_sheet(datosFormateados)

        // Ajustamos los anchos de columna para que el Excel quede presentable
        worksheet['!cols'] = [
            { wch: 20 }, // Nombres
            { wch: 20 }, // Apellidos
            { wch: 35 }, // Correo
            { wch: 10 }, // Baneado
            { wch: 18 }, // Fecha Registro
            { wch: 18 }  // Último Préstamo
        ]

        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios")
        XLSX.writeFile(workbook, "reporte_usuarios.xlsx")

    } catch (error) {
        console.error(error)
            ('Hubo un error al intentar generar el Excel de usuarios.')
    } finally {
        cargandoExcel.value = false
    }
}

// --- GENERAR EXCEL DE INVENTARIO DETALLADO ---
const generarExcelInventario = async () => {
    try {
        cargandoExcelInv.value = true

        // 1. Obtenemos ambos JSON al mismo tiempo para mayor velocidad
        const [tiposRaw, herramientasRaw] = await Promise.all([
            reportesService.getInventarioDatos(),
            reportesService.getHerramientasDatos()
        ])

        // 2. Creamos un diccionario (mapa) de los tipos de herramienta por su ID
        const tiposMap = {}
        tiposRaw.forEach(tipo => {
            tiposMap[tipo.id_tipo_herramienta] = tipo
        })

        // 3. Mapeamos cada herramienta individual cruzándola con los datos de su tipo
        const datosFormateados = herramientasRaw.map(h => {
            const tipo = tiposMap[h.id_tipo_herramienta] || {}

            return {
                'Tipo de Herramienta': tipo.nombre || 'Desconocido',
                'Código de Barras': h.codigo_barras || 'Sin código',
                'Estado Físico': h.estado_herramienta || 'Desconocido',
                'Disponibilidad': h.disponible ? 'Disponible' : 'En Préstamo/No Disponible',
                'Stock General (Tipo)': tipo.stock || 0,
                'Reservados (Tipo)': tipo.reservado || 0,
                'Fecha Adquisición': h.fecha_adquisicion
                    ? new Date(h.fecha_adquisicion).toLocaleDateString('es-CL')
                    : 'N/A'
            }
        })

        // *** NUEVO: Ordenar alfabéticamente (A-Z) por Tipo de Herramienta ***
        datosFormateados.sort((a, b) => {
            return a['Tipo de Herramienta'].localeCompare(b['Tipo de Herramienta'], 'es')
        })

        // 4. Construimos el Excel
        const worksheet = XLSX.utils.json_to_sheet(datosFormateados)

        // Ajustamos un poco el ancho de las columnas
        worksheet['!cols'] = [
            { wch: 25 }, // Tipo
            { wch: 20 }, // Código Barras
            { wch: 15 }, // Estado
            { wch: 25 }, // Disponibilidad
            { wch: 20 }, // Stock
            { wch: 18 }, // Reservados
            { wch: 18 }  // Fecha
        ]

        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, "Inventario Detallado")
        XLSX.writeFile(workbook, "reporte_inventario_completo.xlsx")

    } catch (error) {
        console.error(error)
        alert('Hubo un error al generar el Excel de inventario.')
    } finally {
        cargandoExcelInv.value = false
    }
}

// --- FUNCIÓN AUXILIAR PRECARGAR IMÁGENES ---
const cargarImagen = (url) => {
    return new Promise((resolve) => {
        if (!url) {
            resolve(null)
            return
        }
        const img = new Image()
        img.crossOrigin = 'Anonymous'
        img.onload = () => resolve(img)
        img.onerror = () => resolve(null)
        img.src = url
    })
}

// --- GENERAR PDF DE INVENTARIO RESUMEN ---
const generarPDFInventario = async () => {
    try {
        cargandoPDF.value = true
        const inventarioRaw = await reportesService.getInventarioDatos()

        const doc = new jsPDF()
        doc.text("Reporte Resumen de Inventario", 14, 15)

        const inventarioConImagenes = await Promise.all(inventarioRaw.map(async (item) => {
            const imgElement = await cargarImagen(item.imagen)
            return { ...item, imgElement }
        }))

        const bodyData = inventarioConImagenes.map(item => [
            '',
            item.nombre || 'Desconocido',
            item.stock !== undefined ? item.stock : 0
        ])

        autoTable(doc, {
            head: [['Imagen', 'Tipo de Herramienta', 'Total (Stock)']],
            body: bodyData,
            startY: 20,
            rowPageBreak: 'avoid',
            bodyStyles: { minCellHeight: 25, valign: 'middle' },
            didDrawCell: function (data) {
                if (data.column.index === 0 && data.cell.section === 'body') {
                    const item = inventarioConImagenes[data.row.index]
                    if (item.imgElement) {
                        const dim = data.cell.height - data.cell.padding('vertical') - 4
                        const x = data.cell.x + data.cell.padding('left') + 2
                        const y = data.cell.y + data.cell.padding('top') + 2
                        try { doc.addImage(item.imgElement, 'JPEG', x, y, dim, dim) } catch (e) { }
                    } else {
                        doc.text('Sin img', data.cell.x + 4, data.cell.y + 12)
                    }
                }
            }
        })

        doc.save('reporte_inventario_resumen.pdf')

    } catch (error) {
        console.error(error)
        alert('Hubo un error al generar el PDF.')
    } finally {
        cargandoPDF.value = false
    }
}
</script>