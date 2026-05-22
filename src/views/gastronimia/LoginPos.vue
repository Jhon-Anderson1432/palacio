<script setup>
import { ref } from 'vue'
import { supabase } from '../../lib/supabase' 
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const router = useRouter()
const cargando = ref(false)
const errorMensaje = ref('') 

const handleLogin = async () => {
  cargando.value = true
  errorMensaje.value = '' 
  
  let emailParaSupabase = username.value.trim()
  if (!emailParaSupabase.includes('@')) {
    emailParaSupabase = emailParaSupabase.toLowerCase() + '@palacio.com'
  }

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: emailParaSupabase,
    password: password.value,
  })

  if (authError) {
    errorMensaje.value = "Código o mesera incorrecta."
    cargando.value = false
    return
  }

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

  // EL CANDADO INVERSO: Si es administradora, la rebotamos.
  if (perfil.rol !== 'mesera' && perfil.rol !== 'mesera_temporal') {
    errorMensaje.value = "Acceso denegado. Este portal es solo para toma de pedidos."
    await supabase.auth.signOut() 
  } else {
    // Si es mesera, la mandamos a la Terminal POS
    router.push('/terminal-pos')
  }
  
  cargando.value = false
}
</script>

<template>
  <div class="min-h-screen bg-[#050505] text-white font-sans flex items-center justify-center p-4">
    <div class="w-full max-w-sm bg-[#111] border border-[#D4AF37]/20 p-8 rounded-[2rem] shadow-2xl">
      <div class="text-center mb-8">
        <div class="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-[#D4AF37]/10 text-[#D4AF37]">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
        </div>
        <h1 class="text-xl font-serif text-[#D4AF37] uppercase tracking-[0.1em]">Terminal POS</h1>
        <p class="text-[10px] text-neutral-500 mt-2 uppercase tracking-widest font-bold">Acceso a Meseras</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-5">
        <div class="space-y-1">
          <label class="text-[10px] text-neutral-400 uppercase font-bold ml-1">Nombre de Mesera</label>
          <input v-model="username" type="text" required placeholder="Ej: Elizabeth" class="w-full bg-black/50 border border-white/10 p-4 rounded-xl focus:border-[#D4AF37] outline-none transition-all text-sm" />
        </div>
        <div class="space-y-1">
          <label class="text-[10px] text-neutral-400 uppercase font-bold ml-1">Clave de Acceso</label>
          <input v-model="password" type="password" required placeholder="••••••••" class="w-full bg-black/50 border border-white/10 p-4 rounded-xl focus:border-[#D4AF37] outline-none transition-all text-sm" />
        </div>

        <div v-if="errorMensaje" class="p-3 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] text-center rounded-xl uppercase tracking-widest font-bold">
          {{ errorMensaje }}
        </div>

        <button type="submit" :disabled="cargando" class="w-full py-4 bg-[#D4AF37] text-black font-bold uppercase tracking-widest rounded-xl hover:bg-yellow-500 transition-all text-xs mt-4">
          {{ cargando ? 'Ingresando...' : 'Abrir Turno' }}
        </button>
      </form>
    </div>
  </div>
</template>
