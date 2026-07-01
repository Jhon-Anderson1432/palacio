<template>
  <div class="min-h-screen bg-[#050505] text-white font-sans flex items-center justify-center p-4 antialiased">
    <div class="w-full max-w-sm bg-[#111] border border-[#D4AF37]/20 p-8 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-all duration-300">
      
      <div class="text-center mb-8 select-none">
        <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-[#D4AF37]/10 text-[#D4AF37] shadow-inner">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
          </svg>
        </div>
        <h1 class="text-xl font-serif text-[#D4AF37] uppercase tracking-[0.1em] initialism">Terminal POS</h1>
        <p class="text-[10px] text-neutral-500 mt-2 uppercase tracking-widest font-bold">Acceso a Meseras</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5" autocomplete="off">
        
        <div class="space-y-1">
          <label for="username" class="text-[10px] text-neutral-400 uppercase font-bold ml-1">Nombre de Mesera</label>
          <input 
            id="username"
            v-model="username" 
            type="text" 
            required 
            placeholder="Ej: Elizabeth" 
            autocomplete="username"
            :disabled="cargando"
            class="w-full bg-black/50 border border-white/10 p-4 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 outline-none transition-all duration-300 text-sm font-light placeholder:text-neutral-600 disabled:opacity-50" 
          />
        </div>
        
        <div class="space-y-1">
          <label for="password" class="text-[10px] text-neutral-400 uppercase font-bold ml-1">Clave de Acceso</label>
          <input 
            id="password"
            v-model="password" 
            type="password" 
            required 
            placeholder="••••••••" 
            autocomplete="current-password"
            :disabled="cargando"
            class="w-full bg-black/50 border border-white/10 p-4 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 outline-none transition-all duration-300 text-sm font-light placeholder:text-neutral-600 disabled:opacity-50" 
          />
        </div>

        <transition name="fade">
          <div 
            v-if="errorMensaje" 
            role="alert"
            aria-live="assertive"
            class="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] text-center rounded-xl uppercase tracking-widest font-bold shadow-sm"
          >
            {{ errorMensaje }}
          </div>
        </transition>

        <button 
          type="submit" 
          :disabled="cargando" 
          class="w-full py-4 bg-[#D4AF37] text-black font-bold uppercase tracking-widest rounded-xl hover:bg-yellow-500 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all duration-300 text-xs mt-4 shadow-lg hover:shadow-[#D4AF37]/20"
        >
          {{ cargando ? 'Ingresando...' : 'Abrir Turno' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '../../lib/supabase' 
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const router = useRouter()
const cargando = ref(false)
const errorMensaje = ref('') 

// ==========================================
// 🛡️ PILLAR SEO: Ofuscación y Ocultamiento Total
// ==========================================
onMounted(() => {
  // Inyección estricta de metaetiquetas para forzar la desindexación completa de la URL privada del POS
  let metaRobots = document.querySelector('meta[name="robots"]')
  if (!metaRobots) {
    metaRobots = document.createElement('meta')
    metaRobots.name = "robots"
    document.head.appendChild(metaRobots)
  }
  metaRobots.content = "noindex, nofollow, noarchive, nosnippet"
})

// ==========================================
// 🔐 LÓGICA DE NEGOCIO & BLINDAJE DE SEGURIDAD
// ==========================================
const handleLogin = async () => {
  if (cargando.value) return
  
  cargando.value = true
  errorMensaje.value = '' 
  
  let emailParaSupabase = username.value.trim()
  if (!emailParaSupabase.includes('@')) {
    emailParaSupabase = emailParaSupabase.toLowerCase() + '@palacio.com'
  }

  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: emailParaSupabase,
      password: password.value,
    })

    if (authError) {
      errorMensaje.value = "Código o mesera incorrecta."
      cargando.value = false
      return
    }

    // Consulta directa de validación de perfil y rol asignado en la base de datos
    const { data: perfil, error: perfilError } = await supabase
      .from('perfiles')
      .select('rol, nombre')
      .eq('id', authData.user.id)
      .single()

    if (perfilError || !perfil) {
      errorMensaje.value = "Error de conexión."
      await supabase.auth.signOut()
      cargando.value = false
      return
    }

    if (!username.value.includes('@') && perfil.nombre !== username.value.trim()) {
      errorMensaje.value = "Usuario incorrecto. Revisa mayúsculas y minúsculas."
      await supabase.auth.signOut() 
      cargando.value = false
      return
    }

    // BLINDAJE ULTRA ESTRICTO: Control de acceso basado en roles por software
    // Si un administrador o cualquier otro usuario intenta colarse mediante esta interfaz, el sistema lo eyecta inmediatamente.
    if (perfil.rol !== 'mesera' && perfil.rol !== 'mesera_temporal') {
      errorMensaje.value = "Acceso denegado. Este portal es exclusivo para el personal de servicio autorizado."
      await supabase.auth.signOut() 
    } else {
      // Éxito: Redirección instantánea a la terminal operativa
      router.push('/terminal-pos')
    }
  } catch (error) {
    errorMensaje.value = "Error interno de seguridad."
    await supabase.auth.signOut()
  } finally {
    cargando.value = false
  }
}
</script>

<style scoped>
/* RENDIMIENTO: Suavizado por hardware para prevenir saltos cromáticos */
.antialiased {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Transición animada y fluida para el renderizado del mensaje de error */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.98);
}
</style>