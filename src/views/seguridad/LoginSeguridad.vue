<template>
  <div class="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
    <div class="bg-[#111] p-8 rounded-3xl border border-white/10 w-full max-w-md shadow-2xl relative overflow-hidden">
      <div class="absolute top-0 left-0 w-full h-1 bg-[#D4AF37]"></div>
      
      <div class="text-center mb-8">
        <h1 class="text-3xl font-serif text-[#D4AF37] tracking-widest uppercase mb-2">Seguridad</h1>
        <p class="text-xs text-neutral-500 uppercase tracking-widest">Palacio Nacional</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <label class="block text-[10px] uppercase tracking-widest text-neutral-400 mb-2 font-bold">Correo del Vigilante</label>
          <input 
            v-model="email" 
            type="email" 
            required
            class="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#D4AF37] transition-colors"
            placeholder="ej: guardia1@palacio.com"
          >
        </div>
        
        <div>
          <label class="block text-[10px] uppercase tracking-widest text-neutral-400 mb-2 font-bold">Contraseña</label>
          <input 
            v-model="password" 
            type="password" 
            required
            class="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#D4AF37] transition-colors"
            placeholder="••••••••"
          >
        </div>

        <button 
          type="submit" 
          :disabled="cargando"
          class="w-full bg-[#D4AF37] text-black font-bold uppercase tracking-widest py-4 rounded-xl hover:bg-yellow-500 transition-colors disabled:opacity-50 mt-4"
        >
          {{ cargando ? 'Verificando...' : 'Iniciar Turno' }}
        </button>

        <p v-if="errorMsg" class="text-red-500 text-xs text-center mt-4 uppercase tracking-widest">{{ errorMsg }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')
const cargando = ref(false)
const errorMsg = ref('')

const handleLogin = async () => {
  cargando.value = true
  errorMsg.value = ''

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

    if (error) throw error

    // Verificar rol estricto para esta pantalla
    const { data: perfil } = await supabase
      .from('perfiles')
      .select('rol')
      .eq('id', data.user.id)
      .single()

    if (perfil && (perfil.rol === 'vigilante' || perfil.rol === 'superadmin')) {
      router.push('/vigilancia-scan')
    } else {
      await supabase.auth.signOut()
      errorMsg.value = 'Acceso denegado. No tienes rol de vigilante.'
    }
  } catch (error) {
    errorMsg.value = 'Credenciales incorrectas.'
  } finally {
    cargando.value = false
  }
}
</script>