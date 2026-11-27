// middleware/pos-auth.js
export default defineNuxtRouteMiddleware(async () => {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const perfilPos = useState('perfilPos', () => null)

  let userId = user.value?.id

  // Respaldo: si aún no se hidrató useSupabaseUser en cliente, consultamos getUser()
  if (!userId && import.meta.client) {
    const { data } = await supabase.auth.getUser()
    userId = data?.user?.id
  }

  if (!userId) {
    perfilPos.value = null
    return navigateTo('/login-meseras')
  }

  // Reutilizar si ya está validado para el mismo usuario
  if (perfilPos.value && perfilPos.value.id === userId) {
    return
  }

  const { data: perfil, error } = await supabase
    .from('perfiles')
    .select('id, nombre, rol, local_asignado')
    .eq('id', userId)
    .single()

  if (error || !perfil || (perfil.rol !== 'mesera' && perfil.rol !== 'mesera_temporal')) {
    perfilPos.value = null
    if (import.meta.client) {
      await supabase.auth.signOut()
    }
    return navigateTo('/login-meseras')
  }

  perfilPos.value = {
    id: perfil.id,
    nombre: perfil.nombre,
    rol: perfil.rol,
    local_asignado: perfil.local_asignado || 'chao-pescado'
  }
})
