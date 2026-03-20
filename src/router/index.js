import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../lib/supabase' // IMPORTANTE: Importamos la conexión para verificar la sesión
import Home from '../views/Home.vue'
import Exposiciones from '../views/Exposiciones.vue'
import DetalleObra from '../views/DetalleObra.vue'

// 1. Importamos las nuevas vistas de administración
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
  // 2. Ruta para el Login (Acceso al admin)
  {
    path: '/login-privado',
    name: 'Login',
    component: LoginAdmin
  },
  // 3. Ruta para el Panel de Administración Protegido
  {
    path: '/adminpanel02402110',
    name: 'Adminpanel02402110',
    component: Adminpanel02402110,
    meta: { requiresAuth: true } // Marcamos que esta ruta necesita estar logueado
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 4. GUARDIÁN DE SEGURIDAD: Se ejecuta antes de cada cambio de página
router.beforeEach(async (to, from, next) => {
  // Verificamos si la ruta a la que vamos tiene la marca 'requiresAuth'
  if (to.matched.some(record => record.meta.requiresAuth)) {
    
    // Le preguntamos a Supabase si hay una sesión activa
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      // Si NO hay sesión, lo mandamos al login
      next('/login-privado')
    } else {
      // Si HAY sesión, lo dejamos pasar
      next()
    }
  } else {
    // Si la ruta no es protegida (como Home o Exposiciones), pasa siempre
    next()
  }
})

export default router