<template>
    <div class="min-h-screen w-full flex items-center justify-center p-4 bg-black/90">
        <div class="w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl p-8">
            <h2 class="text-2xl font-bold text-white mb-2">Recuperar Contraseña</h2>
            <p class="text-gray-400 text-sm mb-6">Ingrese su correo de bodeguero para recibir un código de recuperación.</p>

            <form @submit.prevent="handleSolicitud" class="space-y-6">
                <div class="space-y-2">
                    <label class="text-xs font-bold text-gray-300 uppercase">Correo Electrónico</label>
                    <input v-model="correo" type="email" required placeholder="ejemplo@inacap.cl" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50" />
                </div>

                <div v-if="mensaje" class="bg-blue-500/10 border border-blue-500/50 rounded-lg p-3">
                    <span class="text-sm text-blue-200">{{ mensaje }}</span>
                </div>
                <div v-if="error" class="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                    <span class="text-sm text-red-200">{{ error }}</span>
                </div>

                <button type="submit" :disabled="isLoading" class="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3.5 rounded-xl transition-all disabled:opacity-50">
                    {{ isLoading ? 'Enviando...' : 'Solicitar Código' }}
                </button>
                <button type="button" @click="$router.push('/bodeguero/login')" class="w-full bg-transparent hover:bg-white/5 text-gray-300 font-medium py-3 rounded-xl border border-white/10 transition-colors">
                    Volver al Login
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { bodegueroAuthService } from '@/services/bodegueroAuthService'

const router = useRouter()
const correo = ref('')
const mensaje = ref('')
const error = ref('')
const isLoading = ref(false)

const handleSolicitud = async () => {
    error.value = ''
    mensaje.value = ''
    isLoading.value = true

    try {
        await bodegueroAuthService.solicitarRecuperacion(correo.value)
        mensaje.value = 'Si el correo existe, se envió un código de recuperación.'
        setTimeout(() => {
            router.push({
                path: '/bodeguero/login/recuperar/confirmar',
                query: { email: correo.value }
            })
        }, 2500)
    } catch (err) {
        error.value = 'Ocurrió un error al procesar la solicitud.'
    } finally {
        isLoading.value = false
    }
}
</script>