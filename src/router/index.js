import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '../lib/supabase' 

// ==========================================
// 🚀 RENDIMIENTO: Carga Inmediata (Eager Loading)
// Solo cargamos la vista principal de inmediato para que la web abra en milisegundos.
// ==========================================
import Home from '../views/Home.vue'

// ==========================================
// 🚀 RENDIMIENTO: Carga Diferida (Lazy Loading)
// El resto de componentes se cargan solo cuando el usuario hace clic.
// ==========================================
const Exposiciones = () => import('../views/Exposiciones.vue')
const DetalleObra = () => import('../views/DetalleObra.vue')
const Contactos = () => import('../views/contactos.vue')
const Historia = () => import('../views/historia.vue')
const HomeGastro = () => import('../views/gastronimia/homegastro.vue')
const MenuGastro = () => import('../views/gastronimia/MenuGastro.vue')

// Vistas Privadas & POS
const LoginAdmin = () => import('../views/LoginAdmin.vue')
const Adminpanel02402110 = () => import('../views/adminpanel02402110.vue')
const LoginPos = () => import('../views/gastronimia/LoginPos.vue')
const TerminalPos = () => import('../views/gastronimia/TerminalPos.vue')
const VigilanteScan = () => import('../views/seguridad/VigilanteScan.vue')

// ==========================================
// 🗺️ ESTRUCTURA Y SEO: Definición de Rutas
// ==========================================
const routes = [
  // --- ZONA PÚBLICA E INDEXABLE (SEO) ---
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { isPublic: true } // Para indicar a sitemaps/buscadores que es indexable
  },
  {
    path: '/exposiciones', 
    name: 'Exposiciones',
    component: Exposiciones,
    meta: { isPublic: true }
  },
  {
    path: '/DetalleObra/:id', 
    name: 'DetalleObra',
    component: DetalleObra,
    meta: { isPublic: true }
  },
  {
    path: '/contactos',
    name: 'Contactos',
    component: Contactos,
    meta: { isPublic: true }
  },
  {
    path: '/historia',
    name: 'Historia',
    component: Historia,
    meta: { isPublic: true }
  },
  {
    path: '/homegastro',
    name: 'HomeGastro',
    component: HomeGastro,
    meta: { isPublic: true }
  },
  {
    path: '/gastronomia/:local', 
    name: 'MenuGastro',
    component: MenuGastro,
    meta: { isPublic: true }
  },

  // --- ZONA PRIVADA Y RESTRINGIDA (NO-INDEX SEO) ---
  {
    path: '/login-privado',
    name: 'Login',
    component: LoginAdmin,
    meta: { robots: 'noindex, nofollow' } // Bloqueado para Google
  },
  {
    path: '/adminpanel02402110',
    name: 'Adminpanel02402110',
    component: Adminpanel02402110,
    meta: { requiresAuth: true, robots: 'noindex, nofollow' }
  },
  {
    path: '/login-pos',
    name: 'LoginPos',
    component: LoginPos,
    meta: { robots: 'noindex, nofollow' }
  },
  {
    path: '/terminal-pos',
    name: 'TerminalPos',
    component: TerminalPos,
    meta: { requiresAuth: true, robots: 'noindex, nofollow' }
  },
  {
    path: '/vigilancia-scan',
    name: 'VigilanteScan',
    component: VigilanteScan,
    meta: { robots: 'noindex, nofollow' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // ESTRUCTURA: Scroll suave al cambiar de página (UI/UX)
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})

// ==========================================
// 🔐 GUARDIÁN DE SEGURIDAD (Business Logic Intacta)
// ==========================================
router.beforeEach(async (to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
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

// ==========================================
// 🛡️ GUARDIÁN DE SEO (Inyección Dinámica de Robots)
// ==========================================
router.afterEach((to) => {
  // 1. Limpiar etiqueta robots anterior si existe
  let metaRobots = document.querySelector('meta[name="robots"]')
  
  // 2. Si la ruta tiene la etiqueta noindex (Privada), inyectamos la protección
  if (to.meta.robots) {
    if (!metaRobots) {
      metaRobots = document.createElement('meta')
      metaRobots.name = "robots"
      document.head.appendChild(metaRobots)
    }
    metaRobots.content = to.meta.robots
  } else {
    // Si la ruta es pública, permitimos la indexación limpiando el tag restrictivo
    if (metaRobots) {
      metaRobots.remove()
    }
  }
})

export default router