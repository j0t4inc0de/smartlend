<template>
    <div class="p-6 min-h-screen text-white">
        <div class="max-w-2xl mx-auto">
            <div class="flex items-center justify-between mb-8">
                <h1 class="text-2xl font-bold">Soporte Técnico</h1>
                <router-link to="/bodeguero/dashboard/prestamos" class="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm transition-colors">
                    Volver a Préstamos
                </router-link>
            </div>

            <form @submit.prevent="handleEnvio" class="space-y-6 p-8 shadow-2xl">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="space-y-2">
                        <label class="text-xs font-bold uppercase tracking-wider ml-1">Mi Rol</label>
                        <select v-model="form.rol" required class="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all">
                            <option value="bodeguero">Bodeguero</option>
                            <option value="docente">Docente</option>
                            <option value="estudiante">Estudiante</option>
                        </select>
                    </div>

                    <div class="space-y-2">
                        <label class="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Ventana del Problema</label>
                        <input v-model="form.ventana" type="text" required placeholder="Ej: Reportes, Préstamos..." class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all" />
                    </div>
                </div>

                <div class="space-y-2">
                    <label class="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Descripción del Problema</label>
                    <textarea v-model="form.descripcion" required rows="5" placeholder="Describe detalladamente lo que sucedió..." class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"></textarea>
                </div>

                <div v-if="mensaje" :class="esError ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'" class="p-4 rounded-xl border border-current/20 text-sm">
                    {{ mensaje }}
                </div>

                <button type="submit" :disabled="enviando" class="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50">
                    {{ enviando ? 'Enviando Reporte...' : 'Enviar Mensaje de Asistencia' }}
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { soporteService } from '@/services/soporteService'

const router = useRouter()
const enviando = ref(false)
const mensaje = ref('')
const esError = ref(false)

const form = ref({
    rol: 'bodeguero',
    ventana: '',
    descripcion: ''
})

onMounted(() => {
    /* Captura la ruta anterior o la actual como contexto */
    const pathPrevio = window.history.state?.back || router.currentRoute.value.fullPath
    form.value.ventana = pathPrevio
})

const handleEnvio = async () => {
    enviando.value = true
    mensaje.value = ''

    try {
        await soporteService.enviarTicket(form.value)
        mensaje.value = 'Reporte enviado con éxito a smartlend.notificacion@gmail.com'
        esError.value = false
        form.value.descripcion = ''
    } catch (error) {
        mensaje.value = error.message
        esError.value = true
    } finally {
        enviando.value = false
    }
}
</script>