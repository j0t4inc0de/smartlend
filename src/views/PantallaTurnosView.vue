<template>
    <div class="min-h-screen bg-gray-900 p-6 flex flex-col lg:flex-row gap-8 font-sans">

        <div
            class="flex-1 bg-gray-800 border-2 border-gray-700 rounded-3xl shadow-2xl flex flex-col items-center justify-center p-12 text-center">
            <h1 class="text-5xl font-bold text-gray-400 mb-12 tracking-wide uppercase">Turno Actual</h1>

            <div v-if="colaData.actual" class="space-y-8">
                <div class="text-[9rem] leading-none font-extrabold text-red-500 tracking-widest">
                    {{ colaData.actual.codigo_publico }}
                </div>
                <div class="text-5xl text-gray-300 font-semibold uppercase tracking-widest">
                    {{ colaData.actual.estado_prestamo }}
                </div>
            </div>

            <div v-else class="text-5xl font-medium text-gray-500 py-24">
                No hay turnos en atención
            </div>
        </div>

        <div class="w-full lg:w-1/3 flex flex-col gap-8">

            <div class="flex-1 bg-gray-800 border-2 border-gray-700 rounded-3xl shadow-2xl p-8 flex flex-col">
                <h2
                    class="text-3xl font-bold text-gray-400 mb-6 uppercase tracking-wider border-b border-gray-700 pb-4">
                    En Espera</h2>
                <div class="flex-1 overflow-y-auto space-y-4">
                    <div v-for="(turno, index) in colaData.en_cola" :key="index"
                        class="text-4xl font-bold text-white bg-gray-900/50 p-5 rounded-2xl text-center border border-gray-700/50">
                        {{ turno.codigo_publico }}
                    </div>
                    <div v-if="!colaData.en_cola || colaData.en_cola.length === 0"
                        class="text-gray-500 text-center py-8 text-2xl">
                        Cola vacía
                    </div>
                </div>
            </div>

            <div class="flex-1 bg-gray-800 border-2 border-gray-700 rounded-3xl shadow-2xl p-8 flex flex-col">
                <h2
                    class="text-3xl font-bold text-orange-500 mb-6 uppercase tracking-wider border-b border-gray-700 pb-4">
                    Rezagados</h2>
                <div class="flex-1 overflow-y-auto space-y-4">
                    <div v-for="(turno, index) in colaData.saltados" :key="index"
                        class="text-4xl font-bold text-orange-400 bg-orange-500/10 p-5 rounded-2xl text-center border border-orange-500/20">
                        {{ turno.codigo_publico }}
                    </div>
                    <div v-if="!colaData.saltados || colaData.saltados.length === 0"
                        class="text-gray-500 text-center py-8 text-2xl">
                        Ninguno
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { getColaTurnos, getTurnoActual } from '@/services/turneroService'

const colaData = ref({
    actual: null,
    en_cola: [],
    saltados: []
})

let intervalId = null

const fetchDatosTurnero = async () => {
    try {
        const [actualData, colaResponse] = await Promise.all([
            getTurnoActual(),
            getColaTurnos()
        ])

        let turnoActual = actualData.hay_turno ? actualData.turno : null

        // Descartar el turno actual si su estado cambió a Expirado
        if (turnoActual && turnoActual.estado_prestamo === 'Expirado') {
            turnoActual = null
        }

        let listaEspera = colaResponse.en_cola || colaResponse.pendientes || colaResponse.cola || []
        let listaSaltados = colaResponse.saltados || colaResponse.rezagados || []

        if (Array.isArray(colaResponse)) {
            listaEspera = colaResponse
        }

        // Limpiar las listas descartando cualquier préstamo que ya esté expirado
        listaEspera = listaEspera.filter(t => t.estado_prestamo !== 'Expirado')
        listaSaltados = listaSaltados.filter(t => t.estado_prestamo !== 'Expirado')

        if (listaSaltados.length === 0 && listaEspera.length > 0) {
            listaSaltados = listaEspera.filter(t =>
                t.estado_turno === 'Saltado' ||
                t.estado_turno_pantalla === 'Saltado' ||
                t.saltado === true
            )

            listaEspera = listaEspera.filter(t =>
                t.estado_turno !== 'Saltado' &&
                t.estado_turno_pantalla !== 'Saltado' &&
                t.saltado !== true
            )
        }

        // Remover el turno actual de la lista de espera para no duplicarlo
        if (turnoActual && listaEspera.length > 0) {
            listaEspera = listaEspera.filter(p => p.codigo_publico !== turnoActual.codigo_publico)
        }

        colaData.value = {
            actual: turnoActual,
            en_cola: listaEspera,
            saltados: listaSaltados
        }

        console.log('Datos procesados:', colaData.value)

    } catch (error) {
        console.error('Error al actualizar el turnero:', error)
    }
}

onMounted(() => {
    fetchDatosTurnero()
    intervalId = setInterval(fetchDatosTurnero, 4000)
})

onUnmounted(() => {
    if (intervalId) {
        clearInterval(intervalId)
    }
})
</script>