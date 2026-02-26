<template>
    <div class="bg-gray-800 rounded-xl border border-gray-700 p-6 shadow-xl relative">
        <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-white">Listado de Usuarios</h3>

            <div class="flex gap-3">
                <button @click="router.push('/registrar-usuario')"
                    class="bg-gray-700 hover:bg-gray-600 border border-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm">
                    Registrar Estudiante/Docente
                </button>
                <button @click="abrirModalCrear"
                    class="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm">
                    Nuevo Bodeguero
                </button>
            </div>
        </div>

        <div v-if="usuariosStore.isLoading" class="text-center text-gray-400 py-8">
            Cargando usuarios...
        </div>

        <div v-else class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="border-b border-gray-700 text-gray-400 text-sm">
                        <th class="py-3 px-4">Usuario</th>
                        <th class="py-3 px-4">Rol / Carrera</th>
                        <th class="py-3 px-4">Registro</th>
                        <th class="py-3 px-4">Estado</th>
                        <th class="py-3 px-4 text-center">Acciones</th>
                    </tr>
                </thead>
                <tbody class="text-white text-sm">
                    <tr v-for="usuario in usuariosStore.usuarios" :key="usuario.id"
                        class="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">

                        <td class="py-3 px-4">
                            <div class="font-medium">{{ usuario.nombres }} {{ usuario.apellidos }}</div>
                            <div class="text-xs text-gray-400">{{ usuario.correo }}</div>
                        </td>

                        <td class="py-3 px-4">
                            <div>{{ obtenerNombreRol(usuario.id_rol) }}</div>
                            <div v-if="usuario.carrera" class="text-xs text-gray-400">
                                {{ usuario.carrera.nombre }}
                            </div>
                        </td>

                        <td class="py-3 px-4 text-gray-300">
                            {{ formatearFecha(usuario.date_joined) }}
                        </td>

                        <td class="py-3 px-4">
                            <div v-if="usuario.esta_baneado" class="flex flex-col items-start gap-1">
                                <span
                                    class="bg-red-500/20 text-red-400 border border-red-500/50 px-2 py-1 rounded-full text-xs font-semibold">
                                    Baneado
                                </span>
                                <span v-if="usuario.baneado_en" class="text-[10px] text-gray-400">
                                    Desde: {{ formatearFecha(usuario.baneado_en) }}
                                </span>
                            </div>
                            <div v-else>
                                <span
                                    class="bg-green-500/20 text-green-400 border border-green-500/50 px-2 py-1 rounded-full text-xs font-semibold">
                                    Activo
                                </span>
                            </div>
                        </td>

                        <td class="py-3 px-4 text-center space-x-3">
                            <button @click="abrirModalEditar(usuario)"
                                class="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium">
                                Editar
                            </button>
                            <button @click="eliminarUsuario(usuario)"
                                class="text-red-400 hover:text-red-300 transition-colors text-sm font-medium">
                                Eliminar
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="mostrarModal"
            class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div class="bg-gray-800 border border-gray-700 rounded-xl p-6 w-full max-w-md shadow-2xl">
                <h3 class="text-lg font-bold text-white mb-4">
                    {{ usuarioEditando ? 'Editar Usuario' : 'Nuevo Bodeguero' }}
                </h3>

                <form @submit.prevent="guardarUsuario" class="space-y-4">
                    <div>
                        <label class="block text-sm text-gray-400 mb-1">Nombres</label>
                        <input v-model="formUsuario.nombres" type="text" required
                            class="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:border-red-500">
                    </div>
                    <div>
                        <label class="block text-sm text-gray-400 mb-1">Apellidos</label>
                        <input v-model="formUsuario.apellidos" type="text" required
                            class="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:border-red-500">
                    </div>
                    <div>
                        <label class="block text-sm text-gray-400 mb-1">Correo Electrónico</label>
                        <input v-model="formUsuario.correo" type="email" required
                            class="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:border-red-500">
                    </div>

                    <div v-if="usuarioEditando">
                        <label class="block text-sm text-gray-400 mb-1">Rol</label>
                        <select v-model="formUsuario.id_rol"
                            class="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-white outline-none focus:border-red-500">
                            <option value="1">Estudiante</option>
                            <option value="2">Docente</option>
                            <option value="3">Bodeguero</option>
                        </select>
                    </div>

                    <div class="flex justify-end gap-3 mt-6">
                        <button type="button" @click="cerrarModal"
                            class="px-4 py-2 rounded-lg text-gray-400 hover:text-white transition-colors">
                            Cancelar
                        </button>
                        <button type="submit"
                            class="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                            Guardar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUsuariosStore } from '@/stores/usuariosStore'

const router = useRouter()
const usuariosStore = useUsuariosStore()

const mostrarModal = ref(false)
const usuarioEditando = ref(null)

const esmicodigo = 'Acción denegada: Este usuario administrador no puede ser modificado.'

const formUsuario = ref({
    nombres: '',
    apellidos: '',
    correo: '',
    id_rol: 3
})

const obtenerNombreRol = (idRol) => {
    const roles = {
        1: 'Estudiante',
        2: 'Docente',
        3: 'Bodeguero'
    }
    return roles[idRol] || 'Desconocido'
}

const formatearFecha = (fechaString) => {
    if (!fechaString) return 'N/A'
    const fecha = new Date(fechaString)
    return fecha.toLocaleDateString('es-CL', {
        year: 'numeric', month: 'short', day: 'numeric'
    })
}

const abrirModalCrear = () => {
    usuarioEditando.value = null
    formUsuario.value = { nombres: '', apellidos: '', correo: '', id_rol: 3 }
    mostrarModal.value = true
}

const abrirModalEditar = (usuario) => {
    if (usuario.correo === 'jericesb5@gmail.com') {
        alert(esmicodigo)
        return
    }
    if (usuario.correo === 'jericesb5@protonmail.com') {
        alert(esmicodigo)
        return
    }

    usuarioEditando.value = usuario.id
    formUsuario.value = { ...usuario }
    mostrarModal.value = true
}

const cerrarModal = () => {
    mostrarModal.value = false
    usuarioEditando.value = null
}

const guardarUsuario = async () => {
    if (usuarioEditando.value) {
        await usuariosStore.editUsuario(usuarioEditando.value, formUsuario.value)
    } else {
        await usuariosStore.addUsuario(formUsuario.value)
    }
    cerrarModal()
}

const eliminarUsuario = async (usuario) => {
    if (usuario.correo === 'jericesb5@gmail.com') {
        alert(esmicodigo)
        return
    }
    if (usuario.correo === 'jericesb5@protonmail.com') {
        alert(esmicodigo)
        return
    }

    const confirmacion = confirm(`¿Estás seguro de que deseas eliminar al usuario ${usuario.nombres}? Esta acción no se puede deshacer.`)
    if (confirmacion) {
        await usuariosStore.removeUsuario(usuario.id)
    }
}

onMounted(async () => {
    await usuariosStore.fetchUsuarios()
})
</script>