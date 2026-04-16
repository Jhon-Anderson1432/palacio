<template>
  <div class="fixed inset-0 z-[999] bg-[#0a0a0a] overflow-y-auto text-white font-sans flex">
    
    <aside class="w-64 bg-black border-r border-white/10 p-8 hidden md:flex flex-col">
      <div class="flex items-center gap-3 mb-10 text-yellow-500">
        <span class="font-serif text-xl tracking-tighter uppercase">Palacio Admin</span>
      </div>
      
      <nav class="space-y-4 flex-1">
        <button 
          @click="pestañaActiva = 'inventario'"
          :class="['w-full p-3 rounded-xl flex items-center gap-3 transition-all', pestañaActiva === 'inventario' ? 'text-yellow-500 bg-yellow-500/10' : 'text-neutral-500 hover:text-white hover:bg-white/5']"
        >
           <span class="font-medium text-sm uppercase tracking-widest">Inventario</span>
        </button>

        <button 
          @click="pestañaActiva = 'mensajes'; fetchMensajes()"
          :class="['w-full p-3 rounded-xl flex items-center justify-between transition-all', pestañaActiva === 'mensajes' ? 'text-yellow-500 bg-yellow-500/10' : 'text-neutral-500 hover:text-white hover:bg-white/5']"
        >
           <span class="font-medium text-sm uppercase tracking-widest">Buzón</span>
           <span v-if="mensajesNoLeidos > 0" class="bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full">{{ mensajesNoLeidos }}</span>
        </button>
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
        <div v-if="pestañaActiva === 'inventario'" class="flex-1 max-w-xl relative group">
          <input 
            v-model="searchQuery"
            type="text" 
            placeholder="Buscar obra..." 
            class="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-4 text-sm outline-none focus:border-yellow-500/50 transition-all"
          />
          <span class="absolute left-5 top-3.5 text-neutral-500 group-focus-within:text-yellow-500">🔍</span>
        </div>
        <div v-else class="flex-1">
          <h2 class="text-xl font-serif text-white">Mensajes de Contacto</h2>
        </div>
        
        <button v-if="pestañaActiva === 'inventario'" @click="openForm()" class="bg-yellow-500 text-black px-6 py-3 rounded-full font-bold hover:bg-yellow-400 transition-transform active:scale-95 text-xs uppercase tracking-widest flex items-center gap-2">
          <span>+</span> AGREGAR OBRA
        </button>
      </nav>

      <div class="p-8 md:p-12">
        <div v-if="pestañaActiva === 'inventario'">
          <header class="mb-12">
            <h1 class="text-4xl font-serif text-white">Gestión de Catálogo</h1>
            <p class="text-neutral-500 text-xs mt-2 uppercase tracking-[0.2em]">Sincronizado con Supabase Cloud</p>
          </header>

          <div v-if="!cargando" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div v-for="obra in obrasFiltradas" :key="obra.id" class="bg-neutral-900 border border-white/5 rounded-3xl p-5 hover:border-yellow-500/20 transition-all relative">
              <div class="relative mb-5 overflow-hidden rounded-2xl aspect-square bg-black shadow-inner">
                <video :src="obra.video_url" class="w-full h-full object-cover" muted loop onmouseover="this.play()" onmouseout="this.pause()"></video>
                <div class="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] text-yellow-500 font-bold uppercase tracking-tighter">{{ obra.precio }}</div>
                <div class="absolute top-3 left-3 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[8px] text-white font-bold uppercase tracking-widest">{{ obra.tipo || 'Pintura' }}</div>
              </div>
              <div class="space-y-3">
                <h3 class="text-white font-serif text-xl leading-tight">{{ obra.titulo }}</h3>
                <p v-if="obra.titulo_en" class="text-neutral-500 text-[10px] italic -mt-2">{{ obra.titulo_en }}</p>
                <p class="text-yellow-500 text-[10px] font-bold uppercase tracking-[0.2em]">{{ obra.autor }}</p>
                <div class="grid grid-cols-2 gap-4 pt-4 border-t border-white/5 text-[10px] uppercase tracking-widest text-neutral-400 font-medium">
                  <div><span class="block text-neutral-600 mb-1">Técnica:</span><span class="text-white italic">{{ obra.tecnica }}</span></div>
                  <div><span class="block text-neutral-600 mb-1">Medidas:</span><span class="text-white italic">{{ obra.medidas }}</span></div>
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

        <div v-if="pestañaActiva === 'mensajes'">
          <div v-if="cargandoMensajes" class="text-center py-20 text-neutral-500 animate-pulse text-xs uppercase tracking-widest">Cargando buzón...</div>
          
          <div v-else-if="mensajes.length === 0" class="text-center py-20 text-neutral-500 border border-dashed border-white/10 rounded-3xl">
            No hay mensajes en la bandeja de entrada.
          </div>

          <div v-else class="space-y-4 max-w-4xl">
            <div v-for="msj in mensajes" :key="msj.id" :class="['p-6 rounded-2xl border transition-all', msj.leido ? 'bg-white/5 border-white/5 opacity-70' : 'bg-neutral-900 border-yellow-500/30 shadow-[0_0_15px_rgba(212,175,55,0.05)]']">
              <div class="flex justify-between items-start mb-4">
                <div>
                  <h4 class="text-white font-bold text-lg flex items-center gap-2">
                    {{ msj.nombre }} 
                    <span v-if="!msj.leido" class="bg-yellow-500 w-2 h-2 rounded-full inline-block"></span>
                  </h4>
                  <a :href="'mailto:' + msj.email" class="text-yellow-500 text-xs hover:underline">{{ msj.email }}</a>
                </div>
                <span class="text-neutral-500 text-xs">{{ new Date(msj.creado_en).toLocaleDateString() }}</span>
              </div>
              <p class="text-neutral-300 text-sm leading-relaxed whitespace-pre-wrap">{{ msj.mensaje }}</p>
              
              <div class="mt-6 flex gap-3 border-t border-white/5 pt-4">
                <button @click="marcarLeido(msj)" v-if="!msj.leido" class="text-[10px] uppercase tracking-widest font-bold text-white hover:text-yellow-500 transition-colors">✔ Marcar como leído</button>
                <button @click="eliminarMensaje(msj.id)" class="text-[10px] uppercase tracking-widest font-bold text-red-500 hover:text-red-400 transition-colors">🗑 Eliminar</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>

    <div v-if="showForm" class="fixed inset-0 bg-black/95 flex items-center justify-center p-4 z-[1001] backdrop-blur-lg">
      <div class="bg-neutral-900 border border-white/10 w-full max-w-xl rounded-3xl p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        <h2 class="text-2xl font-serif text-yellow-500 mb-6 uppercase tracking-tighter">{{ obraEditandoId ? 'Editar Obra' : 'Nueva Obra' }}</h2>
        <form @submit.prevent="guardarObra" class="space-y-4">
          <div class="p-6 border-2 border-dashed border-white/10 rounded-xl text-center bg-white/5 relative hover:border-yellow-500/30">
            <input type="file" @change="handleFileChange" accept="video/*" class="absolute inset-0 opacity-0 cursor-pointer">
            <p class="text-[10px] uppercase tracking-widest text-neutral-400">{{ videoFile ? '✅ ' + videoFile.name : (obraEditandoId ? 'CAMBIAR VIDEO (OPCIONAL)' : 'SUBIR VIDEO DE LA OBRA') }}</p>
          </div>
          <div class="space-y-3">
            <select v-model="form.tipo" class="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none text-sm focus:border-yellow-500/50 uppercase appearance-none text-white cursor-pointer" required>
              <option value="" disabled class="bg-neutral-900 text-neutral-500">SELECCIONA EL TIPO DE OBRA...</option>
              <option value="Pintura" class="bg-neutral-900">PINTURA</option>
              <option value="Escultura" class="bg-neutral-900">ESCULTURA</option>
            </select>
            <input v-model="form.titulo" placeholder="TÍTULO (ESPAÑOL)" class="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none text-sm focus:border-yellow-500/50 uppercase" required>
            <input v-model="form.titulo_en" placeholder="TÍTULO (INGLÉS / ENGLISH TITLE)" class="w-full bg-white/10 border border-yellow-500/20 p-3 rounded-xl outline-none text-sm focus:border-yellow-500/50 uppercase italic text-yellow-100/70" required>
            <input v-model="form.autor" placeholder="AUTOR" class="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none text-sm focus:border-yellow-500/50 uppercase" required>
            <input v-model="form.precio" placeholder="PRECIO (EJ: 5,500 USD)" class="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none text-sm focus:border-yellow-500/50 uppercase" required>
            <input v-model="form.tecnica" placeholder="TÉCNICA (EJ: ÓLEO SOBRE LIENZO)" class="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none text-sm focus:border-yellow-500/50 uppercase" required>
            <input v-model="form.medidas_en" placeholder="TÉCNICA EN INGLÉS (EJ: OIL ON CANVAS)" class="w-full bg-white/10 border border-yellow-500/20 p-3 rounded-xl outline-none text-sm focus:border-yellow-500/50 uppercase italic text-yellow-100/70" required>
            <input v-model="form.medidas" placeholder="MEDIDAS (EJ: 120 X 80 CM)" class="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none text-sm focus:border-yellow-500/50 uppercase" required>
          </div>
          <div class="flex gap-4 mt-6">
            <button type="submit" class="flex-1 bg-yellow-500 text-black font-bold py-4 rounded-xl hover:bg-yellow-400 disabled:bg-neutral-700 text-xs uppercase tracking-widest" :disabled="enviando">
              {{ enviando ? 'PROCESANDO...' : (obraEditandoId ? 'ACTUALIZAR OBRA' : 'PUBLICAR OBRA') }}
            </button>
            <button @click="showForm = false" type="button" class="flex-1 bg-white/5 py-4 rounded-xl text-xs uppercase tracking-widest hover:bg-white/10 transition-colors">CANCELAR</button>
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
const pestañaActiva = ref('inventario') // Controla qué vista mostrar

// Estado de Obras
const todasLasObras = ref([])
const cargando = ref(true)
const showForm = ref(false)
const enviando = ref(false)
const videoFile = ref(null)
const obraEditandoId = ref(null)
const form = ref({ titulo: '', titulo_en: '', autor: '', precio: '', tecnica: '', medidas_en: '', medidas: '', tipo: '' })

// Estado de Mensajes
const mensajes = ref([])
const cargandoMensajes = ref(false)

const fetchObras = async () => {
  cargando.value = true
  const { data } = await supabase.from('obras').select('*').order('created_at', { ascending: false })
  todasLasObras.value = data || []
  cargando.value = false
}

// Nueva función para traer mensajes
const fetchMensajes = async () => {
  cargandoMensajes.value = true
  const { data } = await supabase.from('mensajes_contacto').select('*').order('creado_en', { ascending: false })
  mensajes.value = data || []
  cargandoMensajes.value = false
}

const mensajesNoLeidos = computed(() => mensajes.value.filter(m => !m.leido).length)

const marcarLeido = async (msj) => {
  const { error } = await supabase.from('mensajes_contacto').update({ leido: true }).eq('id', msj.id)
  if (!error) msj.leido = true
}

const eliminarMensaje = async (id) => {
  if(confirm("¿Eliminar este mensaje permanentemente?")) {
    await supabase.from('mensajes_contacto').delete().eq('id', id)
    fetchMensajes()
  }
}

onMounted(() => {
  fetchObras()
  fetchMensajes() // Cargamos los mensajes en background al iniciar
})

const obrasFiltradas = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) return todasLasObras.value
  return todasLasObras.value.filter(o => 
    o.titulo.toLowerCase().includes(query) || 
    (o.titulo_en && o.titulo_en.toLowerCase().includes(query)) || 
    o.autor.toLowerCase().includes(query) ||
    o.tecnica.toLowerCase().includes(query) ||
    (o.medidas_en && o.medidas_en.toLowerCase().includes(query)) || 
    (o.tipo && o.tipo.toLowerCase().includes(query))
  )
})

const handleFileChange = (e) => {
  const file = e.target.files[0]
  if (file) videoFile.value = file
}

const openForm = (obra = null) => {
  if (obra) {
    obraEditandoId.value = obra.id
    form.value = { ...obra }
  } else {
    obraEditandoId.value = null
    form.value = { titulo: '', titulo_en: '', autor: '', precio: '', tecnica: '', medidas_en: '', medidas: '', tipo: '' }
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