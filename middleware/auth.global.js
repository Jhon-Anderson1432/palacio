export default defineNuxtRouteMiddleware((to, from) => {
  // 1. ARQUITECTURA: Usamos el composable nativo de Nuxt Supabase
  // Es síncrono, súper rápido, y lee la sesión directamente de la cookie segura.
  const user = useSupabaseUser();

  const currentPath = to.path.toLowerCase();

  // 2. ROBUSTEZ: Usamos startsWith() para asegurar que CUALQUIER sub-ruta 
  // dentro de estos paneles también esté estrictamente protegida.
  const esRutaAdmin = currentPath.startsWith('/adminpanel02402110');
  const esRutaPos = currentPath.startsWith('/terminal-pos');

  // 3. LÓGICA DE PROTECCIÓN Y REDIRECCIÓN
  if (esRutaAdmin || esRutaPos) {
    
    // Si no hay un usuario autenticado (la cookie de sesión no existe o expiró)
    if (!user.value) {
      if (esRutaPos) {
        return navigateTo('/login-pos');
      } else {
        return navigateTo('/loginadmin');
      }
    }
    
    // Aquí puedes agregar roles en el futuro (ej. si user.value.role !== 'admin')
  }
});