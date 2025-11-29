import { createRouter, createWebHistory } from 'vue-router'
import WelcomeScreen from '../views/WelcomeScreen.vue'
import RegisterUserView from '../views/RegisterUserView.vue'
import FacialLoginView from '../views/LoginFacialView.vue'
import LoginBodegueroView from '@/views/bodeguero/LoginBodegueroView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'welcome',
      component: WelcomeScreen,
    },
    {
      path: '/registrar-usuario',
      name: 'registrar-usuario',
      component: RegisterUserView,
    },
    {
      path: '/facial-recognition', // <--- RUTA NUEVA
      name: 'facial-recognition',
      component: FacialLoginView,
    },
    {
      path: '/bodeguero/login',
      name: 'login-bodeguero',
      component: LoginBodegueroView,
    },
    // Ruta comodín para manejar rutas no encontradas
    {
      path: '/:pathMatch(.*)*',
      redirect: '/', // Redirige a la pantalla de bienvenida si la ruta no existe
    },
  ]
})

export default router
