<template>
    <div class="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6">
        <div class="bg-gray-800 border-2 border-gray-700 rounded-3xl shadow-2xl w-full max-w-6xl text-center p-16">
            <h1 class="text-5xl font-bold text-white mb-12 tracking-wide">Turno Actual</h1>

            <div v-if="turnoData.hay_turno" class="space-y-8">
                <div class="text-[10rem] leading-none font-extrabold text-red-500 tracking-widest">
                    {{ turnoData.turno.codigo_publico }}
                </div>
                <div class="text-5xl text-gray-300 font-semibold uppercase tracking-widest">
                    {{ turnoData.turno.estado_prestamo }}
                </div>
            </div>

            <div v-else class="text-6xl font-medium text-gray-500 py-24">
                No hay turnos pendientes
            </div>

            <div class="mt-20 text-4xl text-gray-400 border-t border-gray-700 pt-10">
                Personas en espera: <span class="font-bold text-white">{{ turnoData.pendientes_listos }}</span>
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