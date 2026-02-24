// src\services\config\api.js

const API_BASE_URL = import.meta.env.VITE_API_URL

if (!API_BASE_URL) {
  console.error('VITE_API_URL no está definido en el .env')
}

export default API_BASE_URL
