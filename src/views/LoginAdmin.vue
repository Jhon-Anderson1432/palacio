<script setup>
import { ref } from 'vue'
import { supabase } from '../lib/supabase' 
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const router = useRouter()
const cargando = ref(false)
const errorMensaje = ref('') 

const handleLogin = async () => {
  cargando.value = true
  errorMensaje.value = '' 
  
  // 1. El Truco del Dominio: Convertimos el usuario en un correo fantasma para satisfacer a Supabase
  const emailParaSupabase = username.value.toLowerCase().trim() + '@palacio.com'

  // 2. Intentar iniciar sesión en el motor principal
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: emailParaSupabase,
    password: password.value,
  })

  if (authError) {
    errorMensaje.value = "Credenciales incorrectas."
    cargando.value = false
    return
  }

  // 3. Verificar el Perfil en la base de datos
  const { data: perfil, error: perfilError } = await supabase
    .from('perfiles')
    .select('rol, local_asignado, nombre')
    .eq('id', authData.user.id)
    .single()

  if (perfilError || !perfil) {
    errorMensaje.value = "Error al verificar permisos del perfil."
    await supabase.auth.signOut()
    cargando.value = false
    return
  }

  // 4. EL CANDADO DE MAYÚSCULAS/MINÚSCULAS
  // Comparamos el texto exacto que escribió el usuario con el que está en la base de datos
  if (perfil.nombre !== username.value.trim()) {
    errorMensaje.value = "Usuario incorrecto. Verifica mayúsculas y minúsculas."
    await supabase.auth.signOut() // Lo expulsamos inmediatamente
    cargando.value = false
    return
  }

  // 5. Filtro de Roles (Aquí agregamos al admin_seguridad)
  if (perfil.rol === 'mesera' || perfil.rol === 'mesera_temporal') {
    errorMensaje.value = "Acceso denegado. Utiliza el Portal POS para meseras."
    await supabase.auth.signOut() 
  } else if (perfil.rol === 'admin_seguridad') {
    router.push('/adminpanel02402110') // Redirige al panel de seguridads
  } else {
    // Es Superadmin o Admin -> Entra a la interfaz unificada sin problemas
    router.push('/adminpanel02402110')
  }
  
  cargando.value = false
}
</script>

<template>
  <div class="min-h-screen bg-[#0a0a0a] text-white font-sans flex items-center justify-center p-4 selection:bg-[#D4AF37] selection:text-black relative overflow-hidden">
    <div class="absolute top-[20%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none"></div>

    <div class="relative z-10 w-full max-w-md bg-[#111] border border-white/10 p-8 md:p-10 rounded-[2rem] shadow-2xl backdrop-blur-xl">
      <div class="text-center mb-10">
        <div class="w-16 h-16 border border-[#D4AF37]/50 rounded-full flex items-center justify-center mx-auto mb-6 bg-[#D4AF37]/10 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
          <svg class="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
        </div>
        <h1 class="text-2xl font-serif text-[#D4AF37] uppercase tracking-[0.15em]">Palacio Nacional</h1>
        <p class="text-[10px] text-neutral-500 mt-2 uppercase tracking-[0.3em] font-bold">Portal Administrativo</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div class="space-y-2">
          <label class="text-[10px] text-neutral-400 uppercase tracking-widest ml-1 font-bold">Usuario</label>
          <input v-model="username" type="text" required placeholder="Ej: JorgeHacienda" class="w-full bg-black/50 border border-white/10 text-white p-4 rounded-xl focus:border-[#D4AF37] focus:bg-black outline-none transition-all text-sm placeholder:text-neutral-700" />
        </div>

        <div class="space-y-2">
          <label class="text-[10px] text-neutral-400 uppercase tracking-widest ml-1 font-bold">Código de Acceso</label>
          <input v-model="password" type="password" required placeholder="••••••••" class="w-full bg-black/50 border border-white/10 text-white p-4 rounded-xl focus:border-[#D4AF37] focus:bg-black outline-none transition-all text-sm placeholder:text-neutral-700" />
        </div>

        <transition name="fade">
          <div v-if="errorMensaje" class="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] text-center rounded-xl uppercase tracking-widest font-bold">
            {{ errorMensaje }}
          </div>
        </transition>

        <button type="submit" :disabled="cargando" class="w-full py-4 bg-[#D4AF37] text-black font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-white hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed text-xs mt-4">
          {{ cargando ? 'Verificando...' : 'Iniciar Sesión' }}
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>