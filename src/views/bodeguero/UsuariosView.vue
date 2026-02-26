<template>
    <div class="bg-gray-800 rounded-xl border border-gray-700 p-6 shadow-xl">
        <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-semibold text-white">Listado de Usuarios</h3>
            <button class="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                Nuevo Usuario
            </button>
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="border-b border-gray-700 text-gray-400 text-sm">
                        <th class="py-3 px-4">Nombre</th>
                        <th class="py-3 px-4">Correo</th>
                        <th class="py-3 px-4">Estado</th>
                        <th class="py-3 px-4">Acciones</th>
                    </tr>
                </thead>
                <tbody class="text-white text-sm">
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(async () => {
    // Inicialización y carga de datos desde el store
})
</script>