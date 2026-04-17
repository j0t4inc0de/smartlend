<template>
    <div class="min-h-screen w-full flex items-center justify-center p-4 bg-black/90">
        <div class="w-full max-w-md bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl p-8">
            <h2 class="text-2xl font-bold text-white mb-6">Confirmar Recuperación</h2>

            <form @submit.prevent="handleConfirmacion" class="space-y-4">
                <div class="space-y-2">
                    <label class="text-xs font-bold text-gray-300 uppercase">Correo Electrónico</label>
                    <input v-model="form.correo" type="email" required class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50" />
                </div>

                <div class="space-y-2">
                    <label class="text-xs font-bold text-gray-300 uppercase">Código (6 dígitos)</label>
                    <input v-model="form.codigo" type="text" required maxlength="6" class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50" />
                </div>

                <div class="space-y-2">
                    <label class="text-xs font-bold text-gray-300 uppercase">Nueva Contraseña</label>
                    <input v-model="form.nueva_password" type="password" required class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50" />
                </div>

                <div class="space-y-2">
                    <label class="text-xs font-bold text-gray-300 uppercase">Confirmar Contraseña</label>
                    <input v-model="form.confirmar_password" type="password" required class="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50" />
                </div>

                <div v-if="error" class="bg-red-500/10 border border-red-500/50 rounded-lg p-3">
                    <span class="text-sm text-red-200">{{ error }}</span>
                </div>

                <button type="submit" :disabled="isLoading" class="w-full bg-red-600 hover:bg-red-500 text-white font-bold py-3.5 rounded-xl transition-all mt-4 disabled:opacity-50">
                    {{ isLoading ? 'Procesando...' : 'Cambiar Contraseña' }}
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { bodegueroAuthService } from '@/services/bodegueroAuthService'

const router = useRouter()
const route = useRoute()

const form = ref({
    correo: '',
    codigo: '',
    nueva_password: '',
    confirmar_password: ''
})

const error = ref('')
const isLoading = ref(false)

onMounted(() => {
    if (route.query.email) {
        form.value.correo = route.query.email
    }
})

const handleConfirmacion = async () => {
    error.value = ''

    if (form.value.codigo.length !== 6) {
        error.value = 'El código debe tener 6 dígitos'
        return
    }

    if (form.value.nueva_password !== form.value.confirmar_password) {
        error.value = 'Las contraseñas no coinciden'
        return
    }

    isLoading.value = true

    try {
        await bodegueroAuthService.confirmarRecuperacion(
            form.value.correo,
            form.value.codigo,
            form.value.nueva_password
        )
        router.push('/bodeguero/login')
    } catch (err) {
        error.value = err.message
    } finally {
        isLoading.value = false
    }
}
</script>