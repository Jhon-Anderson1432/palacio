import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../lib/supabase' 
import Home from '../views/Home.vue'
import Exposiciones from '../views/Exposiciones.vue'
import DetalleObra from '../views/DetalleObra.vue'
import Contactos from '../views/contactos.vue'
import historia from '@/views/historia.vue' // Cambiado a plural para coincidir con el archivo

// Vistas de administración
import LoginAdmin from '../views/LoginAdmin.vue'
import Adminpanel02402110 from '../views/adminpanel02402110.vue'

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
    path: '/contactos', // CORREGIDO: Ahora coincide con el botón del Home
    name: 'Contactos',
    component: Contactos
  },
  {
    path: '/historia',
    name: 'Historia',
    component: historia
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
      next('/login-privado')
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router