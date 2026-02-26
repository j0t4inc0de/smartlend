<template>
    <!-- Contenedor tipo tarjeta -->
    <div class="bg-gray-800 rounded-xl border border-gray-700 p-6 shadow-xl">
        <!-- Título -->
        <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-white">Listado de Usuarios</h3>
        </div>

        <!-- Estado: cargando -->
        <div v-if="usuariosStore.isLoading" class="text-center text-gray-400 py-8">
            Cargando usuarios...
        </div>

        <!-- Estado: datos cargados -->
        <div v-else class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <!-- Cabecera -->
                <thead>
                    <tr class="border-b border-gray-700 text-gray-400 text-sm">
                        <th class="py-3 px-4">Usuario</th>
                        <th class="py-3 px-4">Rol / Carrera</th>
                        <th class="py-3 px-4">Registro</th>
                        <th class="py-3 px-4">Estado</th>
                        <th class="py-3 px-4 text-center">Acciones</th>
                    </tr>
                </thead>

                <!-- Cuerpo -->
                <tbody class="text-white text-sm">
                    <!-- Filas por usuario -->
                    <tr v-for="usuario in usuariosStore.usuarios" :key="usuario.id"
                        class="border-b border-gray-700/50 hover:bg-gray-700/30 transition-colors">
                        <!-- Nombre + correo -->
                        <td class="py-3 px-4">
                            <div class="font-medium">{{ usuario.nombres }} {{ usuario.apellidos }}</div>
                            <div class="text-xs text-gray-400">{{ usuario.correo }}</div>
                        </td>

                        <!-- Rol + carrera (si existe) -->
                        <td class="py-3 px-4">
                            <div>{{ obtenerNombreRol(usuario.id_rol) }}</div>
                            <div v-if="usuario.carrera" class="text-xs text-gray-400">
                                {{ usuario.carrera.nombre }}
                            </div>
                        </td>

                        <!-- Fecha de registro formateada -->
                        <td class="py-3 px-4 text-gray-300">
                            {{ formatearFecha(usuario.date_joined) }}
                        </td>

                        <!-- Estado: baneado/activo + detalles opcionales -->
                        <td class="py-3 px-4">
                            <div v-if="usuario.esta_baneado" class="flex flex-col items-start gap-1">
                                <span
                                    class="bg-red-500/20 text-red-400 border border-red-500/50 px-2 py-1 rounded-full text-xs font-semibold">
                                    Baneado
                                </span>
                                <span v-if="usuario.baneado_en" class="text-[10px] text-gray-400">
                                    Desde: {{ formatearFecha(usuario.baneado_en) }}
                                </span>
                                <span v-if="usuario.aviso_ban_enviado" class="text-[10px] text-yellow-500">
                                    Aviso enviado
                                </span>
                            </div>

                            <div v-else>
                                <span
                                    class="bg-green-500/20 text-green-400 border border-green-500/50 px-2 py-1 rounded-full text-xs font-semibold">
                                    Activo
                                </span>
                            </div>
                        </td>

                        <!-- Acciones -->
                        <td class="py-3 px-4 text-center space-x-3">
                            <button @click="editarUsuario(usuario)"
                                class="text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium">
                                Editar
                            </button>
                            <button @click="eliminarUsuario(usuario.id)"
                                class="text-red-400 hover:text-red-300 transition-colors text-sm font-medium">
                                Eliminar
                            </button>
                        </td>
                    </tr>

                    <!-- Estado: tabla vacía -->
                    <tr v-if="usuariosStore.usuarios.length === 0">
                        <td colspan="5" class="py-8 text-center text-gray-400">
                            No hay usuarios registrados en el sistema.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useUsuariosStore } from '@/stores/usuariosStore'

// Instancia del store (Pinia)
const usuariosStore = useUsuariosStore()

// Mapea id_rol -> nombre legible
const obtenerNombreRol = (idRol) => {
    const roles = { 1: 'Estudiante', 2: 'Docente', 3: 'Bodeguero' }
    return roles[idRol] || 'Desconocido'
}

// Convierte fecha ISO a formato es-CL (abreviado)
const formatearFecha = (fechaString) => {
    if (!fechaString) return 'N/A'
    const fecha = new Date(fechaString)
    return fecha.toLocaleDateString('es-CL', { year: 'numeric', month: 'short', day: 'numeric' })
}

// Placeholder: iniciar flujo de edición (modal/ruta)
const editarUsuario = (usuario) => {
    console.log('Iniciando edición para el usuario:', usuario.id)
}

// Confirmación + placeholder para eliminación vía store
const eliminarUsuario = async (idUsuario) => {
    const confirmacion = confirm('¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.')
    if (confirmacion) {
        // await usuariosStore.deleteUsuario(idUsuario)
        console.log('Eliminando usuario con ID:', idUsuario)
    }
}

// Al montar: traer usuarios
onMounted(async () => {
    await usuariosStore.fetchUsuarios()
})
</script>