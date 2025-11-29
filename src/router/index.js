import { createRouter, createWebHistory } from 'vue-router'
// Vistas
import WelcomeScreen from '../views/WelcomeScreen.vue'
import RegisterUserView from '../views/RegisterUserView.vue'
import FacialLoginView from '../views/LoginFacialView.vue'
import LoginBodegueroView from '@/views/bodeguero/LoginBodegueroView.vue'
import PrestamosView from '@/views/bodeguero/PrestamosView.vue'
// Layout
import DashboardBodegueroLayout from '@/layouts/DashboardBodegueroLayout.vue'

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
      path: '/facial-recognition',
      name: 'facial-recognition',
      component: FacialLoginView,
    },
    {
      path: '/bodeguero/login',
      name: 'login-bodeguero',
      component: LoginBodegueroView,
    },
    {
      path: '/bodeguero/dashboard',
      component: DashboardBodegueroLayout,
      children: [
        {
          path: 'prestamos',
          name: 'dashboard-prestamos',
          component: PrestamosView,
        },
        {
          path: '', // /bodeguero/dashboard solo
          redirect: 'prestamos', // Redirige a /bodeguero/dashboard/prestamos
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

export default router
