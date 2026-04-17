<!-- src\views\bodeguero\ReportesView.vue -->
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

                <button @click="generarExcelDanadas" :disabled="cargandoExcelDanadas" class="bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                    <span v-if="cargandoExcelDanadas">Generando...</span>
                    <span v-else>Herramientas Dañadas (Excel)</span>
                </button>

                <button @click="generarPDFInventario" :disabled="cargandoPDF" class="bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2">
                    <span v-if="cargandoPDF">Generando PDF...</span>
                    <span v-else>Inventario Resumen (PDF)</span>
                </button>
            </div>
        </div>
        <div class="min-h-screen text-white">

            <div class="bg-gray-900 border border-white/10 p-6 rounded-2xl shadow-xl max-w-md">
                <h2 class="text-lg font-semibold mb-4 text-gray-300">Estado de Préstamos</h2>
                <apexchart type="donut" height="300" :options="estadoPrestamosOptions" :series="estadoPrestamosSeries" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { reportesService } from '@/services/reportesService'
import { alertaService } from '@/services/alertasService'
import { prestamosService } from '@/services/prestamosService'

import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import VueApexCharts from 'vue3-apexcharts'

// Estados de carga independientes
const cargandoExcel = ref(false)
const cargandoExcelInv = ref(false)
const cargandoPDF = ref(false)
const cargandoExcelDanadas = ref(false)

// Variables para el gráfico
const apexchart = VueApexCharts

const cargando = ref(true)
const estadoPrestamosSeries = ref([])
const estadoPrestamosOptions = ref({
    chart: {
        type: 'donut',
        foreColor: '#FFFFFF'
    },
    labels: ['Completados', 'Pendientes', 'Entregado', 'Vencidos'],
    colors: ['#10B981', '#B8CC06', '#007BFF', '#F96262'],
    stroke: {
        show: false
    },
    dataLabels: {
        enabled: false
    },
    plotOptions: {
        pie: {
            donut: {
                size: '70%'
            }
        }
    },
    tooltip: {
        theme: 'dark'
    }
})

// CARGAR DATOS PA EL GRAFICO DE ESTADO DE PRÉSTAMOS
const cargarDatosDelGrafico = async () => {
    try {
        cargando.value = true
        const estadisticas = await prestamosService.getEstadisticas()

        estadoPrestamosSeries.value = [
            estadisticas.finalizado,
            estadisticas.pendiente,
            estadisticas.entregado,
            estadisticas.vencidos
        ]
    } catch (error) {
        console.error('Fallo al obtener las estadísticas de préstamos', error)
    } finally {
        cargando.value = false
    }
}

// --- GENERAR EXCEL DE USUARIOS ---
const generarExcelUsuarios = async () => {
    try {
        cargandoExcel.value = true
        const [usuariosRaw, historialRaw] = await Promise.all([
            reportesService.getUsuariosDatos(),
            reportesService.getHistorialHerramientasDatos()
        ])

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

        const datosFormateados = usuariosRaw.map(usuario => {
            const fechaRegistro = usuario.date_joined
                ? new Date(usuario.date_joined).toLocaleDateString('es-CL')
                : 'Desconocida';

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
        alertaService.error('Hubo un error al generar el Excel de inventario.')
    } finally {
        cargandoExcelInv.value = false
    }
}

// --- FUNCIÓN AUXILIAR PRECARGAR IMÁGENES COMO BLOB ---
const cargarImagen = async (url) => {
    if (!url) return null;

    try {
        const response = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache'
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const blob = await response.blob();

        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                resolve(reader.result);
            };
            reader.onerror = () => {
                console.error('Error al convertir la imagen a Base64');
                resolve(null);
            };
            reader.readAsDataURL(blob);
        });

    } catch (error) {
        console.error('Falló la descarga de la imagen:', url, error);
        return null;
    }
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
                        try {
                            const format = item.imgElement.includes('image/png') ? 'PNG' : 'JPEG';
                            doc.addImage(item.imgElement, format, x, y, dim, dim);
                        } catch (e) {
                            console.error('Error al insertar imagen en jsPDF', e);
                        }
                    } else {
                        doc.text('Sin img', data.cell.x + 4, data.cell.y + 12)
                    }
                }
            }
        })

        doc.save('reporte_inventario_resumen.pdf')

    } catch (error) {
        console.error(error)
        alertaService.error('Hubo un error al generar el PDF.')
    } finally {
        cargandoPDF.value = false
    }
}

// --- GENERAR EXCEL DE HERRAMIENTAS DAÑADAS ---
const generarExcelDanadas = async () => {
    try {
        cargandoExcelDanadas.value = true

        const [noUsablesRaw, tiposRaw] = await Promise.all([
            reportesService.getHerramientasNoUsables(),
            reportesService.getInventarioDatos() // Asumo que este método trae los tipos de herramienta
        ])

        const tiposMap = {}
        tiposRaw.forEach(tipo => {
            tiposMap[tipo.id_tipo_herramienta] = tipo
        })

        const datosFormateados = noUsablesRaw.map(h => {
            const tipo = tiposMap[h.id_tipo_herramienta] || {}
            return {
                'Tipo de Herramienta': tipo.nombre || 'Desconocido',
                'Código de Barras': h.codigo_barras || 'Sin código',
                'Estado Físico': h.estado_herramienta || 'Desconocido',
                'Fecha Adquisición': h.fecha_adquisicion
                    ? new Date(h.fecha_adquisicion).toLocaleDateString('es-CL')
                    : 'N/A'
            }
        })

        datosFormateados.sort((a, b) => {
            return a['Tipo de Herramienta'].localeCompare(b['Tipo de Herramienta'], 'es')
        })

        const worksheet = XLSX.utils.json_to_sheet(datosFormateados)

        worksheet['!cols'] = [
            { wch: 30 }, // Tipo de Herramienta
            { wch: 20 }, // Código de Barras
            { wch: 15 }, // Estado Físico
            { wch: 18 }  // Fecha Adquisición
        ]

        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, "Dañadas y Defectuosas")
        XLSX.writeFile(workbook, "reporte_herramientas_danadas.xlsx")

        alertaService.success('Reporte de herramientas dañadas generado con éxito')

    } catch (error) {
        console.error(error)
        alertaService.error('Hubo un error al generar el Excel de herramientas dañadas.')
    } finally {
        cargandoExcelDanadas.value = false
    }
}

onMounted(() => {
    cargarDatosDelGrafico()
})
</script>