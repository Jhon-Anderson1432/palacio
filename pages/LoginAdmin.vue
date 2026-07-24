<template>
  <main class="min-h-screen bg-[#0a0a0a] text-white font-sans flex items-center justify-center p-4 selection:bg-[#D4AF37] selection:text-black relative overflow-hidden">
    
    <div class="absolute top-[20%] left-[50%] -translate-x-1/2 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none"></div>

    <div class="relative z-10 w-full max-w-md bg-[#111] border border-white/10 p-8 md:p-10 rounded-[2rem] shadow-2xl backdrop-blur-xl animate-fade-in-up">
      
      <header class="text-center mb-10">
        <div class="w-16 h-16 border border-[#D4AF37]/50 rounded-full flex items-center justify-center mx-auto mb-6 bg-[#D4AF37]/10 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
          <svg class="w-8 h-8 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
        </div>
        <h1 class="text-2xl font-serif text-[#D4AF37] uppercase tracking-[0.15em] drop-shadow-sm">Palacio Nacional</h1>
        <p class="text-[10px] text-neutral-500 mt-2 uppercase tracking-[0.3em] font-bold">Portal Administrativo</p>
      </header>

      <form @submit.prevent="handleLogin" class="space-y-6" autocomplete="off" novalidate>
        
        <div class="space-y-2 group">
          <label for="username" class="text-[10px] text-neutral-400 uppercase tracking-widest ml-1 font-bold group-focus-within:text-[#D4AF37] transition-colors">Usuario</label>
          <input 
            id="username"
            v-model="username" 
            type="text" 
            required 
            spellcheck="false"
            autocomplete="username"
            placeholder="Ej: JorgeHacienda" 
            class="w-full bg-black/50 border border-white/10 text-white px-4 py-3.5 rounded-xl focus:border-[#D4AF37]/80 focus:bg-black focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all duration-300 text-sm placeholder:text-neutral-700" 
          />
        </div>

        <div class="space-y-2 group">
          <label for="password" class="text-[10px] text-neutral-400 uppercase tracking-widest ml-1 font-bold group-focus-within:text-[#D4AF37] transition-colors">Código de Acceso</label>
          <input 
            id="password"
            v-model="password" 
            type="password" 
            required 
            autocomplete="current-password"
            placeholder="••••••••" 
            class="w-full bg-black/50 border border-white/10 text-white px-4 py-3.5 rounded-xl focus:border-[#D4AF37]/80 focus:bg-black focus:ring-2 focus:ring-[#D4AF37]/20 outline-none transition-all duration-300 text-sm placeholder:text-neutral-700" 
          />
        </div>

        <transition name="fade">
          <div v-if="errorMensaje" class="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] text-center rounded-xl uppercase tracking-widest font-bold shadow-[0_0_10px_rgba(239,68,68,0.1)]">
            {{ errorMensaje }}
          </div>
        </transition>

        <button 
          type="submit" 
          :disabled="cargando" 
          class="w-full py-4 mt-4 bg-[#D4AF37] text-black font-bold uppercase tracking-[0.2em] rounded-xl hover:bg-yellow-500 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-xs relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-[#D4AF37]"
        >
          <span v-if="cargando" class="flex items-center justify-center gap-2">
            <div class="w-3 h-3 border-2 border-black border-t-transparent animate-spin rounded-full"></div>
            Verificando...
          </span>
          <span v-else>Iniciar Sesión</span>
        </button>

      </form>
    </div>
  </main>
</template>

<script setup>
// Evitamos el layout público por defecto
definePageMeta({
  layout: false
})

// Auto-imports inyectados por Nuxt 3
const router = useRouter()
const supabase = useSupabaseClient()

const username = ref('')
const password = ref('')
const cargando = ref(false)
const errorMensaje = ref('') 

// Blindaje Anti-SEO SSR (Renderizado desde el servidor)
useHead({
  title: 'Acceso Restringido',
  meta: [
    { name: 'robots', content: 'noindex, nofollow, noarchive, nosnippet' },
    { name: 'googlebot', content: 'noindex, nofollow' },
    { 'http-equiv': 'Cache-Control', content: 'no-cache, no-store, must-revalidate' },
    { 'http-equiv': 'Pragma', content: 'no-cache' },
    { 'http-equiv': 'Expires', content: '0' }
  ]
})

// Lógica de negocio (Intacta)
const handleLogin = async () => {
  cargando.value = true
  errorMensaje.value = '' 
  
  const emailParaSupabase = username.value.toLowerCase().trim() + '@palacio.com'

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: emailParaSupabase,
    password: password.value,
  })

  if (authError) {
    errorMensaje.value = "Credenciales incorrectas."
    cargando.value = false
    return
  }

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

  if (perfil.nombre !== username.value.trim()) {
    errorMensaje.value = "Usuario incorrecto. Verifica mayúsculas y minúsculas."
    await supabase.auth.signOut() 
    cargando.value = false
    return
  }

  if (perfil.rol === 'mesera' || perfil.rol === 'mesera_temporal') {
    errorMensaje.value = "Acceso denegado. Utiliza el Portal POS para meseras."
    await supabase.auth.signOut() 
  } else if (perfil.rol === 'admin_seguridad') {
    router.push('/adminpanel02402110')
  } else {
    router.push('/adminpanel02402110')
  }
  
  cargando.value = false
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { 
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); 
}
.fade-enter-from, .fade-leave-to { 
  opacity: 0; 
  transform: translateY(-10px);
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>