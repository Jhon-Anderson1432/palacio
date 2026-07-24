// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to) => {
  const user = useSupabaseUser()
  const path = to.path.toLowerCase()

  // 1. Si ya estamos en una página de login, no hacemos nada (Evita bucles)
  if (path === '/loginadmin' || path === '/login-meseras') {
    return
  }

  // 2. Si es la página principal u otra pública, dejamos pasar libremente
  if (path === '/' || path.startsWith('/historia') || path.startsWith('/exposiciones') || path.startsWith('/homegastro')) {
    return
  }

  // 3. Detectar rutas protegidas
  const esRutaAdmin = path.startsWith('/adminpanel02402110')
  const esRutaPos = path.startsWith('/terminal-pos')

  // 4. Si intenta entrar a administración sin sesión -> Forzar /loginadmin (NUNCA a /)
  if (esRutaAdmin && !user.value) {
    return navigateTo('/loginadmin')
  }

  // 5. Si intenta entrar al POS sin sesión -> Forzar login de meseras
  if (esRutaPos && !user.value) {
    return navigateTo('/login-meseras')
  }
})