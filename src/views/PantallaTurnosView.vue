<template>
    <div class="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div class="bg-white rounded-lg shadow-xl w-full max-w-4xl text-center p-12">
            <h1 class="text-4xl font-bold text-gray-800 mb-8">Turno Actual</h1>

            <div v-if="turnoData.hay_turno" class="space-y-6">
                <div class="text-8xl font-extrabold text-blue-600 tracking-wider">
                    {{ turnoData.turno.codigo_publico }}
                </div>
                <div class="text-2xl text-gray-600 font-semibold uppercase">
                    {{ turnoData.turno.estado_prestamo }}
                </div>
            </div>

            <div v-else class="text-4xl font-medium text-gray-500 py-12">
                No hay turnos pendientes
            </div>

            <div class="mt-12 text-xl text-gray-500">
                Personas en espera: <span class="font-bold">{{ turnoData.pendientes_listos }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { getTurnoActual } from '@/services/turneroService'

const turnoData = ref({
    hay_turno: false,
    turno: null,
    pendientes_listos: 0
})

let intervalId = null

const fetchTurno = async () => {
    try {
        const data = await getTurnoActual()
        turnoData.value = data
    } catch (error) {
        console.error(error)
    }
}

onMounted(() => {
    fetchTurno()
    // Se configura el polling para consultar el endpoint cada 4 segundos
    intervalId = setInterval(fetchTurno, 4000)
})

onUnmounted(() => {
    if (intervalId) {
        clearInterval(intervalId)
    }
})
</script>