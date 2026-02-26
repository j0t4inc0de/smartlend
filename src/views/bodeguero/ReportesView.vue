<template>
    <div class="space-y-6">
        <div class="bg-gray-800 rounded-xl border border-gray-700 p-6 shadow-xl">
            <h3 class="text-lg font-semibold text-white mb-4">Exportar Datos</h3>

            <div class="flex gap-4">
                <button @click="generarPDF"
                    class="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    Exportar a PDF
                </button>
                <button @click="generarExcel"
                    class="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                    Exportar a Excel
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

const generarPDF = () => {
    const doc = new jsPDF()

    doc.text("Reporte de Sistema", 14, 15)

    const headers = [['ID', 'Dato 1', 'Dato 2']]
    const data = [
        ['1', 'Valor A', 'Valor B'],
    ]

    autoTable(doc, {
        head: headers,
        body: data,
        startY: 20,
        theme: 'grid'
    })

    doc.save('reporte_smartlend.pdf')
}

const generarExcel = () => {
    const data = [
        { ID: '1', Dato1: 'Valor A', Dato2: 'Valor B' }
    ]

    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte")
    XLSX.writeFile(workbook, "reporte_smartlend.xlsx")
}
</script>