<script setup>
import { ref } from 'vue'
import { supabase } from '../lib/supabase' // Tu conexión
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const router = useRouter()
const cargando = ref(false)

const handleLogin = async () => {
  cargando.value = true
  const { error } = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  })

  if (error) {
    alert("Error: " + error.message)
  } else {
    // Si los datos son correctos, entramos al panel secreto
    router.push('/adminpanel02402110')
  }
  cargando.value = false
}
</script>

<template>
  <div class="login-box">
    <h1>Acceso Galería</h1>
    <input v-model="email" type="email" placeholder="Correo electrónico" />
    <input v-model="password" type="password" placeholder="Contraseña" />
    <button @click="handleLogin" :disabled="cargando">
      {{ cargando ? 'Entrando...' : 'Iniciar Sesión' }}
    </button>
  </div>
</template>

<style scoped>
.login-box { max-width: 400px; margin: 100px auto; padding: 2rem; border: 1px solid #eee; display: flex; flex-direction: column; gap: 1rem; text-align: center; }
input { padding: 12px; border: 1px solid #ddd; border-radius: 4px; }
button { padding: 12px; background: #000; color: #fff; border: none; cursor: pointer; font-weight: bold; }
button:disabled { background: #666; }
</style>