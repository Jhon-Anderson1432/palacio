import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../lib/supabase' 
import Home from '../views/Home.vue'
import Exposiciones from '../views/Exposiciones.vue'
import DetalleObra from '../views/DetalleObra.vue'
import Contactos from '../views/contactos.vue'
import historia from '@/views/historia.vue'

// Vistas de administración
import LoginAdmin from '../views/LoginAdmin.vue'
import Adminpanel02402110 from '../views/adminpanel02402110.vue'

// Vistas POS (Nuevas)
import LoginPos from '../views/gastronimia/LoginPos.vue'
import TerminalPos from '../views/gastronimia/TerminalPos.vue'

// Vistas Seguridad (Nuevas)
import VigilanteScan from '../views/seguridad/VigilanteScan.vue'
const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/exposiciones', 
    name: 'Exposiciones',
    component: Exposiciones 
  },
  {
    path: '/DetalleObra/:id', 
    name: 'DetalleObra',
    component: DetalleObra
  },
  {
    path: '/login-privado',
    name: 'Login',
    component: LoginAdmin
  },
  {
    path: '/adminpanel02402110',
    name: 'Adminpanel02402110',
    component: Adminpanel02402110,
    meta: { requiresAuth: true }
  },
  {
    path: '/contactos',
    name: 'Contactos',
    component: Contactos
  },
  {
    path: '/historia',
    name: 'Historia',
    component: historia
  },
  // NUEVAS RUTAS POS
  {
    path: '/login-pos',
    name: 'LoginPos',
    component: LoginPos
  },
  {
    path: '/terminal-pos',
    name: 'TerminalPos',
    component: TerminalPos,
    meta: { requiresAuth: true }
  },
  // Módulo de Seguridad
  {
    path: '/vigilancia-scan',
    name: 'VigilanteScan',
    component: VigilanteScan
  },
  // Gastronomía
  {
    path: '/homegastro',
    name: 'HomeGastro',
    component: () => import('../views/gastronimia/homegastro.vue')
  },
  {
    path: '/gastronomia/:local', 
    name: 'MenuGastro',
    component: () => import('../views/gastronimia/MenuGastro.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Guardián de seguridad
router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      // Si intenta entrar a admin o a vigilancia, va a login-privado. Si intenta entrar a POS, va a login-pos.
      if (to.path.includes('terminal')) {
        next('/login-pos')
      } else {
        next('/login-privado')
      }
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router