import { createRouter, createWebHistory } from 'vue-router'
import { requiresBodegueroAuth, redirectIfAuthenticated, guestOnly } from '@/utils/authGuards'

// Vistas Usuarios
import WelcomeScreen from '@/views/WelcomeScreen.vue'
import RegisterUserView from '@/views/RegisterUserView.vue'
import RegisterInstitucionalView from '@/views/RegisterInstitucionalView.vue'
import FacialLoginView from '@/views/LoginFacialView.vue'
import UsuarioDashboardView from '@/views/UsuarioDashboardView.vue'
// Vistas del bodeguero
import LoginBodegueroView from '@/views/bodeguero/LoginBodegueroView.vue'
import RecuperarPasswordView from '@/views/bodeguero/RecuperarPasswordView.vue'
import ConfirmarRecuperacionPasswordView from '@/views/bodeguero/ConfirmarRecuperacionPasswordView.vue'
import PrestamosView from '@/views/bodeguero/PrestamosView.vue'
// Layouts
import DashboardBodegueroLayout from '@/layouts/DashboardBodegueroLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // RUTAS USUARIOS
    {
      path: '/',
      name: 'welcome',
      component: WelcomeScreen,
      beforeEnter: guestOnly,
    },
    {
      path: '/registrar-usuario',
      name: 'registrar-usuario',
      component: RegisterUserView,
      beforeEnter: requiresBodegueroAuth,
    },
    {
      path: '/registro-institucional',
      name: 'registro-institucional',
      component: RegisterInstitucionalView,
      beforeEnter: guestOnly,
    },
    {
      path: '/facial-recognition',
      name: 'facial-recognition',
      component: FacialLoginView,
      beforeEnter: guestOnly,
    },
    {
      path: '/pantalla-turnos',
      name: 'pantalla-turnos',
      component: () => import('@/views/PantallaTurnosView.vue'),
    },
    {
      path: '/dashboard',
      name: 'usuario-dashboard',
      component: UsuarioDashboardView,
      beforeEnter: (to, from, next) => {
        // Verificar que el usuario esté autenticado (facial)
        const isAuthenticated = localStorage.getItem('isAuthenticated')
        const user = localStorage.getItem('user')

        if (isAuthenticated === 'true' && user) {
          next()
        } else {
          next('/facial-recognition')
        }
      },
    },

    // RUTAS DEL BODEGUERO
    {
      path: '/bodeguero/login',
      name: 'login-bodeguero',
      component: LoginBodegueroView,
      beforeEnter: redirectIfAuthenticated,
    },
    {
      path: '/bodeguero/login/recuperar',
      name: 'recuperar-bodeguero',
      component: RecuperarPasswordView,
      beforeEnter: redirectIfAuthenticated,
    },
    {
      path: '/bodeguero/login/recuperar/confirmar',
      name: 'confirmar-recuperar-bodeguero',
      component: ConfirmarRecuperacionPasswordView,
      beforeEnter: redirectIfAuthenticated,
    },
    {
      path: '/bodeguero/dashboard',
      component: DashboardBodegueroLayout,
      beforeEnter: requiresBodegueroAuth,
      children: [
        {
          path: 'prestamos',
          name: 'dashboard-prestamos',
          component: PrestamosView,
        },
        {
          path: '', // /bodeguero/dashboard solo
          redirect: 'prestamos',
        },
        {
          path: 'inventario',
          name: 'dashboard-inventario',
          component: () => import('@/views/bodeguero/InventarioView.vue'),
        },
        {
          path: 'usuarios',
          name: 'dashboard-usuarios',
          component: () => import('@/views/bodeguero/UsuariosView.vue'),
        },
        {
          path: 'reportes',
          name: 'dashboard-reportes',
          component: () => import('@/views/bodeguero/ReportesView.vue'),
        },
        {
          path: '/bodeguero/dashboard/asistencia',
          name: 'bodeguero-asistencia',
          component: () => import('@/views/bodeguero/AsistenciaView.vue'),
          meta: { requiresAuth: true, role: 'bodeguero' },
        },
      ],
    },

    // REDIRECCIONES Y 404
    {
      path: '/bodeguero',
      redirect: '/bodeguero/dashboard',
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

// Guard global para inicializar stores
router.beforeEach(async (to, from, next) => {
  // Aquí puedes agregar lógica global si es necesario
  // Por ejemplo, inicializar stores
  next()
})

export default router
