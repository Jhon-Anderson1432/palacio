<template>
  <div class="fixed inset-0 z-[999] bg-[#0a0a0a] overflow-y-auto text-white font-sans flex">
    
    <aside class="w-64 bg-black border-r border-white/10 p-8 hidden md:flex flex-col">
      <div class="flex items-center gap-3 mb-10 text-yellow-500">
        <span class="font-serif text-xl tracking-tighter uppercase">Palacio Admin</span>
      </div>
      <nav class="space-y-2 flex-1">
        <div class="text-yellow-500 bg-yellow-500/10 p-3 rounded-xl flex items-center gap-3">
           <span class="font-medium text-sm uppercase tracking-widest">Inventario</span>
        </div>
      </nav>
      
      <button @click="handleLogout" class="text-red-500 hover:bg-red-500/10 p-3 rounded-xl flex items-center gap-3 mb-4 transition-all text-[10px] font-bold uppercase tracking-widest">
        CERRAR SESIÓN
      </button>

      <router-link to="/exposiciones" class="text-neutral-500 hover:text-white transition-colors flex items-center gap-2 text-[10px] uppercase font-bold pt-4 border-t border-white/10 tracking-widest">
        ← GALERÍA PÚBLICA
      </router-link>
    </aside>

    <main class="flex-1 flex flex-col">
      
      <nav class="sticky top-0 z-20 bg-black/80 backdrop-blur-md border-b border-white/5 p-6 flex items-center justify-between gap-6">
        <div class="flex-1 max-w-xl relative group">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Buscar por autor, título o técnica..." 
            class="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-4 text-sm outline-none focus:border-yellow-500/50 transition-all"
          />
          <span class="absolute left-5 top-3.5 text-neutral-500 group-focus-within:text-yellow-500">🔍</span>
        </div>
        
        <button @click="openForm()" class="bg-yellow-500 text-black px-6 py-3 rounded-full font-bold hover:bg-yellow-400 transition-transform active:scale-95 text-xs uppercase tracking-widest flex items-center gap-2">
          <span>+</span> AGREGAR OBRA
        </button>
      </nav>

      <div class="p-8 md:p-12">
        <header class="mb-12">
          <h1 class="text-4xl font-serif text-white">Gestión de Catálogo</h1>
          <p class="text-neutral-500 text-xs mt-2 uppercase tracking-[0.2em]">Sincronizado con Supabase Cloud</p>
        </header>

        <div v-if="!cargando" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="obra in obrasFiltradas" :key="obra.id" class="bg-neutral-900 border border-white/5 rounded-3xl p-5 hover:border-yellow-500/20 transition-all">
            
            <div class="relative mb-5 overflow-hidden rounded-2xl aspect-square bg-black shadow-inner">
              <video :src="obra.video_url" class="w-full h-full object-cover" muted loop onmouseover="this.play()" onmouseout="this.pause()"></video>
              <div class="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] text-yellow-500 font-bold uppercase tracking-tighter">
                {{ obra.precio }}
              </div>
            </div>

            <div class="space-y-3">
              <h3 class="text-white font-serif text-xl leading-tight">{{ obra.titulo }}</h3>
              <p v-if="obra.titulo_en" class="text-neutral-500 text-[10px] italic -mt-2">{{ obra.titulo_en }}</p>
              
              <p class="text-yellow-500 text-[10px] font-bold uppercase tracking-[0.2em]">{{ obra.autor }}</p>
              
              <div class="grid grid-cols-2 gap-4 pt-4 border-t border-white/5 text-[10px] uppercase tracking-widest text-neutral-400 font-medium">
                <div>
                  <span class="block text-neutral-600 mb-1">Técnica:</span>
                  <span class="text-white italic">{{ obra.tecnica }}</span>
                </div>
                <div>
                  <span class="block text-neutral-600 mb-1">Medidas:</span>
                  <span class="text-white italic">{{ obra.medidas }}</span>
                </div>
              </div>
            </div>
            
            <div class="flex gap-2 mt-6 pt-4 border-t border-white/5">
              <button @click="openForm(obra)" class="flex-1 p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all">Editar</button>
              <button @click="deleteObra(obra)" class="p-2 border border-red-500/30 text-red-500 hover:bg-red-500/10 rounded-xl text-[10px] font-bold uppercase transition-all">Eliminar</button>
            </div>
          </div>
        </div>

        <div v-if="cargando" class="text-center py-20 text-neutral-500 animate-pulse text-xs uppercase tracking-widest">Conectando...</div>
      </div>
    </main>

    <div v-if="showForm" class="fixed inset-0 bg-black/95 flex items-center justify-center p-4 z-[1001] backdrop-blur-lg">
      <div class="bg-neutral-900 border border-white/10 w-full max-w-xl rounded-3xl p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        <h2 class="text-2xl font-serif text-yellow-500 mb-6 uppercase tracking-tighter">
          {{ obraEditandoId ? 'Editar Obra' : 'Nueva Obra' }}
        </h2>
        
        <form @submit.prevent="guardarObra" class="space-y-4">
          <div class="p-6 border-2 border-dashed border-white/10 rounded-xl text-center bg-white/5 relative hover:border-yellow-500/30">
            <input type="file" @change="handleFileChange" accept="video/*" class="absolute inset-0 opacity-0 cursor-pointer">
            <p class="text-[10px] uppercase tracking-widest text-neutral-400">
              {{ videoFile ? '✅ ' + videoFile.name : (obraEditandoId ? 'CAMBIAR VIDEO (OPCIONAL)' : 'SUBIR VIDEO DE LA OBRA') }}
            </p>
          </div>

          <div class="space-y-3">
            <input v-model="form.titulo" placeholder="TÍTULO (ESPAÑOL)" class="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none text-sm focus:border-yellow-500/50 uppercase" required>
            
            <input v-model="form.titulo_en" placeholder="TÍTULO (INGLÉS / ENGLISH TITLE)" class="w-full bg-white/10 border border-yellow-500/20 p-3 rounded-xl outline-none text-sm focus:border-yellow-500/50 uppercase italic text-yellow-100/70" required>
            
            <input v-model="form.autor" placeholder="AUTOR" class="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none text-sm focus:border-yellow-500/50 uppercase" required>
            <input v-model="form.precio" placeholder="PRECIO (EJ: 5,500 USD)" class="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none text-sm focus:border-yellow-500/50 uppercase" required>
            <input v-model="form.tecnica" placeholder="TÉCNICA (EJ: ÓLEO SOBRE LIENZO)" class="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none text-sm focus:border-yellow-500/50 uppercase" required>
            <input v-model="form.medidas_en" placeholder="TÉCNICA (EJ: ENGLISH TITLE)" class="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none text-sm focus:border-yellow-500/50 uppercase" required>
            <input v-model="form.medidas" placeholder="MEDIDAS (EJ: 120 X 80 CM)" class="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none text-sm focus:border-yellow-500/50 uppercase" required>
          </div>

          <div class="flex gap-4 mt-6">
            <button type="submit" class="flex-1 bg-yellow-500 text-black font-bold py-4 rounded-xl hover:bg-yellow-400 disabled:bg-neutral-700 text-xs uppercase tracking-widest" :disabled="enviando">
              {{ enviando ? 'PROCESANDO...' : (obraEditandoId ? 'ACTUALIZAR OBRA' : 'PUBLICAR OBRA') }}
            </button>
            <button @click="showForm = false" type="button" class="flex-1 bg-white/5 py-4 rounded-xl text-xs uppercase tracking-widest">CANCELAR</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase, searchQuery } from '../lib/supabase'
import { useRouter } from 'vue-router'

const router = useRouter()
const todasLasObras = ref([])
const cargando = ref(true)
const showForm = ref(false)
const enviando = ref(false)
const videoFile = ref(null)
const obraEditandoId = ref(null)

// Se agrega 'titulo_en' al estado inicial del formulario
const form = ref({ titulo: '', titulo_en: '', autor: '', precio: '', tecnica: '', medidas: '', medidas_en: "" })

const obrasFiltradas = computed(() => {
  if (!searchQuery.value) return todasLasObras.value
  const term = searchQuery.value.toLowerCase()
  return todasLasObras.value.filter(o => 
    o.autor.toLowerCase().includes(term) || o.titulo.toLowerCase().includes(term) || o.tecnica.toLowerCase().includes(term)
  )
})

const fetchObras = async () => {
  cargando.value = true
  const { data } = await supabase.from('obras').select('*').order('created_at', { ascending: false })
  todasLasObras.value = data || []
  cargando.value = false
}

onMounted(() => fetchObras())

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (file) videoFile.value = file
}

const openForm = (obra = null) => {
  if (obra) {
    obraEditandoId.value = obra.id
    // Al editar, se cargan todos los campos incluyendo titulo_en
    form.value = { ...obra }
  } else {
    obraEditandoId.value = null
    form.value = { titulo: '', titulo_en: '', autor: '', precio: '', tecnica: '', medidas: '', medidas_en: "" }
  }
  videoFile.value = null
  showForm.value = true
}

const guardarObra = async () => {
  enviando.value = true
  try {
    let finalVideoUrl = form.value.video_url

    if (videoFile.value) {
      const fileName = `${Date.now()}_${videoFile.value.name}`
      const { error: uploadError } = await supabase.storage.from('videos-obras').upload(fileName, videoFile.value)
      if (uploadError) throw uploadError
      const { data: { publicUrl } } = supabase.storage.from('videos-obras').getPublicUrl(fileName)
      finalVideoUrl = publicUrl
    }

    const payload = { ...form.value, video_url: finalVideoUrl }
    delete payload.id 
    delete payload.created_at

    if (obraEditandoId.value) {
      const { error } = await supabase.from('obras').update(payload).eq('id', obraEditandoId.value)
      if (error) throw error
    } else {
      if (!videoFile.value) throw new Error("Debes subir un video para la nueva obra")
      const { error } = await supabase.from('obras').insert([payload])
      if (error) throw error
    }

    alert("¡Éxito!"); showForm.value = false; fetchObras()
  } catch (err) {
    alert("Error: " + err.message)
  } finally {
    enviando.value = false
  }
}

const deleteObra = async (obra) => {
  if (confirm(`¿Eliminar ${obra.titulo}?`)) {
    await supabase.from('obras').delete().eq('id', obra.id)
    fetchObras()
  }
}

const handleLogout = async () => {
  await supabase.auth.signOut()
  router.push('/login-privado')
}
</script>