// src\main.js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import './assets/css/tailwind.css'
import 'vue-sonner/style.css'

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token && token !== 'undefined' && token !== 'null') {
      config.headers.Authorization = `Token ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
