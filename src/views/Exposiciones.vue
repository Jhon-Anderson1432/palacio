<template>
  <div class="min-h-screen bg-neutral-950 text-white pt-28 px-6 pb-20">
    
    <div class="max-w-7xl mx-auto mb-12 flex flex-wrap justify-center gap-4">
      <button 
        @click="filtroTipo = 'Todos'" 
        :class="filtroTipo === 'Todos' ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'bg-transparent border border-white/20 text-white hover:border-yellow-500/50'"
        class="px-6 py-3 rounded-full transition-all duration-300 flex flex-col items-center group"
      >
        <span class="text-xs font-bold uppercase tracking-widest mb-1">Todas</span>
        <span class="text-[9px] uppercase tracking-widest opacity-60">All Artworks</span>
      </button>

      <button 
        @click="filtroTipo = 'Pintura'" 
        :class="filtroTipo === 'Pintura' ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'bg-transparent border border-white/20 text-white hover:border-yellow-500/50'"
        class="px-6 py-3 rounded-full transition-all duration-300 flex flex-col items-center group"
      >
        <span class="text-xs font-bold uppercase tracking-widest mb-1">Pinturas</span>
        <span class="text-[9px] uppercase tracking-widest opacity-60">Paintings</span>
      </button>

      <button 
        @click="filtroTipo = 'Escultura'" 
        :class="filtroTipo === 'Escultura' ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/20' : 'bg-transparent border border-white/20 text-white hover:border-yellow-500/50'"
        class="px-6 py-3 rounded-full transition-all duration-300 flex flex-col items-center group"
      >
        <span class="text-xs font-bold uppercase tracking-widest mb-1">Esculturas</span>
        <span class="text-[9px] uppercase tracking-widest opacity-60">Sculptures</span>
      </button>
    </div>

    <div v-if="searchQuery" class="max-w-7xl mx-auto mb-8 flex flex-col sm:flex-row items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5 gap-4">
      <p class="text-sm text-neutral-400">
        Filtrando por <span class="text-[10px] uppercase tracking-widest opacity-60 mx-1">/ Filtering by:</span>
        <span class="text-white font-bold text-base ml-1">"{{ searchQuery }}"</span>
      </p>
      <button @click="searchQuery = ''" class="flex flex-col items-center text-yellow-600 hover:text-yellow-500 transition-colors">
        <span class="text-xs uppercase tracking-widest font-bold">✕ Quitar Filtro</span>
        <span class="text-[9px] uppercase tracking-widest opacity-70">Clear Filter</span>
      </button>
    </div>

    <div v-if="cargando" class="flex flex-col items-center justify-center py-20 space-y-2 text-neutral-500">
      <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-yellow-500 mb-4"></div>
      <span class="uppercase tracking-widest text-xs">Sincronizando galería...</span>
      <span class="uppercase tracking-widest text-[10px] opacity-60">Syncing gallery...</span>
    </div>

    <div v-else-if="obrasFiltradas.length > 0" class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      
      <div 
        v-for="obra in obrasFiltradas" 
        :key="obra.id"
        class="group bg-neutral-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-yellow-500/40 transition-all duration-500 flex flex-col relative"
      >
        <div class="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[9px] text-white font-bold uppercase tracking-widest">
          {{ obra.tipo === 'Escultura' ? 'Escultura / Sculpture' : 'Pintura / Painting' }}
        </div>

        <div class="relative aspect-square overflow-hidden bg-black">
          <video :src="obra.video_url" autoplay loop muted playsinline class="w-full h-full object-cover"></video>
          <div class="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80"></div>
        </div>

        <div class="p-6 flex-1 flex flex-col">
          <div class="text-center mb-4">
            <h3 class="text-2xl font-serif text-white mb-1 group-hover:text-yellow-500 transition-colors lowercase capitalize">
              {{ obra.titulo }}
            </h3>
            <p v-if="obra.titulo_en" class="text-neutral-500 text-xs italic lowercase capitalize mb-1">
              {{ obra.titulo_en }}
            </p>
            <p class="text-neutral-400 text-xs italic lowercase capitalize">Por {{ obra.autor }} <span class="opacity-50 mx-1">/</span> By {{ obra.autor }}</p>
          </div>

          <div class="space-y-4 py-4 border-y border-white/5 mb-6 flex-1 flex flex-col justify-center">
            <div class="grid grid-cols-2 gap-3 items-center">
              <div class="text-right border-r border-white/10 pr-3">
                <span class="text-[8px] uppercase text-yellow-600/70 tracking-widest block mb-0.5">Technique</span>
                <p class="text-[11px] text-neutral-300 font-medium line-clamp-2 leading-tight lowercase capitalize">{{ obra.medida_en }}</p>
              </div>
              <div class="text-left pl-3">
                <span class="text-[8px] uppercase text-yellow-600/70 tracking-widest block mb-0.5">Técnica</span>
                <p class="text-[11px] text-neutral-300 font-medium line-clamp-2 leading-tight lowercase capitalize">{{ obra.tecnica }}</p>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3 items-center">
              <div class="text-right border-r border-white/10 pr-3">
                <span class="text-[8px] uppercase text-yellow-600/70 tracking-widest block mb-0.5">Dimensions</span>
                <p class="text-[11px] text-neutral-300 font-medium line-clamp-2 leading-tight lowercase">{{ obra.medidas }}</p>
              </div>
              <div class="text-left pl-3">
                <span class="text-[8px] uppercase text-yellow-600/70 tracking-widest block mb-0.5">Medidas</span>
                <p class="text-[11px] text-neutral-300 font-medium line-clamp-2 leading-tight lowercase">{{ obra.medidas }}</p>
              </div>
            </div>
          </div>

          <div class="mt-auto flex items-center justify-between pt-2">
            <span class="text-2xl font-mono text-white tracking-tighter flex items-baseline">
              {{ isNaN(obra.precio) ? obra.precio : '$' + Number(obra.precio).toLocaleString() }}
              <span class="text-[10px] text-neutral-500 ml-1">USD</span>
            </span>

            <router-link 
              :to="'/DetalleObra/' + obra.id"
              class="flex flex-col items-center justify-center px-6 py-3 bg-white text-black rounded-full hover:bg-yellow-500 hover:scale-105 transition-all duration-300 group-hover:bg-yellow-500 shadow-xl"
            >
              <span class="text-xs font-bold uppercase tracking-widest leading-none mb-1.5">Ver detalles</span>
              <span class="text-[8.5px] font-bold uppercase tracking-widest opacity-60 leading-none">View details</span>
            </router-link>
          </div>
        </div>
      </div>

    </div>

    <div v-else class="max-w-7xl mx-auto text-center py-24 space-y-2">
      <p class="text-neutral-500 italic text-lg">No encontramos obras en esta categoría.</p>
      <p class="text-neutral-500/50 italic text-sm">No artworks found in this category.</p>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase, searchQuery } from '../lib/supabase'

const todasLasObras = ref([])
const cargando = ref(true)

// NUEVO: Variable para controlar si vemos Todo, Pintura o Escultura
const filtroTipo = ref('Todos')

const fetchObras = async () => {
  try {
    cargando.value = true
    const { data, error } = await supabase
      .from('obras')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    todasLasObras.value = data || []
  } catch (err) {
    console.error("Error:", err.message)
  } finally {
    cargando.value = false
  }
}

onMounted(() => fetchObras())

const obrasFiltradas = computed(() => {
  let resultado = todasLasObras.value

  // 1. Filtrar primero por el TIPO (Pintura o Escultura)
  if (filtroTipo.value !== 'Todos') {
    resultado = resultado.filter(o => o.tipo === filtroTipo.value)
  }

  // 2. Filtrar luego por la barra de BÚSQUEDA (si hay algo escrito)
  const query = searchQuery.value.toLowerCase().trim()
  if (query) {
    resultado = resultado.filter(o => 
      (o.titulo && o.titulo.toLowerCase().includes(query)) || 
      (o.titulo_en && o.titulo_en.toLowerCase().includes(query)) || 
      (o.autor && o.autor.toLowerCase().includes(query)) ||
      (o.tecnica && o.tecnica.toLowerCase().includes(query))
    )
  }

  return resultado
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');

.font-serif {
  font-family: 'Playfair Display', serif;
}

.group {
  animation: slideUp 0.8s ease-out forwards;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>