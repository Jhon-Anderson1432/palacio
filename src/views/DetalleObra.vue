<template>
  <div class="min-h-screen w-full bg-neutral-950 text-white flex flex-col overflow-y-auto font-sans pb-10">
    
    <div v-if="obra" class="flex-1 flex flex-col max-w-md mx-auto w-full relative">
      
      <router-link 
        to="/exposiciones" 
        class="absolute top-6 left-6 z-[110] bg-black/40 backdrop-blur-md p-2 rounded-full border border-white/10 text-white hover:text-yellow-500 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </router-link>

      <div class="h-[40vh] w-full relative bg-black shadow-2xl">
        <video 
          :src="obra.video_url" 
          autoplay 
          loop 
          muted 
          playsinline 
          class="w-full h-full object-cover"
        ></video>
        <div class="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-neutral-950 to-transparent"></div>
      </div>

      <div class="flex flex-col p-6 space-y-8 bg-neutral-950">
        
        <div class="text-center space-y-2">
          <h1 class="text-3xl font-serif text-yellow-500 leading-tight">{{ obra.titulo }}</h1>
          <p class="text-sm text-neutral-400 italic">Por {{ obra.autor }} / By {{ obra.autor }}</p>
        </div>

        <div class="px-2 grid grid-cols-2 gap-4">
          <div class="text-right border-r border-white/10 pr-4">
            <p class="text-neutral-400 text-xs italic leading-relaxed">
              Masterfully created by the author.
            </p>
          </div>
          <div class="text-left pl-4">
            <p class="text-neutral-300 text-xs italic leading-relaxed">
              Realizada con maestría por el autor.
            </p>
          </div>
        </div>

        <div class="bg-white/5 py-5 px-4 rounded-xl border border-white/5 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div class="text-right border-r border-white/10 pr-4">
              <span class="text-neutral-500 text-[9px] uppercase tracking-widest block mb-1">Technique</span>
              <p class="text-neutral-200 text-xs font-medium">{{ obra.tecnica }}</p>
            </div>
            <div class="text-left pl-4">
              <span class="text-neutral-500 text-[9px] uppercase tracking-widest block mb-1">Técnica</span>
              <p class="text-neutral-200 text-xs font-medium">{{ obra.tecnica }}</p>
            </div>
          </div>
          
          <div class="h-[1px] w-full bg-white/5"></div>

          <div class="grid grid-cols-2 gap-4">
            <div class="text-right border-r border-white/10 pr-4">
              <span class="text-neutral-500 text-[9px] uppercase tracking-widest block mb-1">Dimensions</span>
              <p class="text-neutral-200 text-xs font-medium">{{ obra.medidas }}</p>
            </div>
            <div class="text-left pl-4">
              <span class="text-neutral-500 text-[9px] uppercase tracking-widest block mb-1">Medidas</span>
              <p class="text-neutral-200 text-xs font-medium">{{ obra.medidas }}</p>
            </div>
          </div>
        </div>

        <div class="space-y-6 pt-2">
          <div class="text-center">
            <p class="text-3xl font-mono text-white tracking-tighter">
              {{ isNaN(obra.precio) ? obra.precio : '$' + Number(obra.precio).toLocaleString() }}
              <span class="text-xs text-neutral-500 ml-1">USD</span>
            </p>
          </div>

          <a 
            :href="'https://wa.me/573002493543?text=Hola, me interesa la obra: ' + obra.titulo" 
            target="_blank"
            class="flex flex-col items-center justify-center w-full py-4 bg-yellow-600 text-black font-bold rounded-xl active:scale-95 transition-transform shadow-lg shadow-yellow-900/20"
          >
            <span class="uppercase tracking-[0.15em] text-[11px] mb-1">Consultar Adquisición</span>
            <span class="uppercase tracking-[0.1em] text-[8px] opacity-75">Inquire about acquisition</span>
          </a>
        </div>

      </div>
    </div>

    <div v-else class="h-screen flex flex-col items-center justify-center bg-neutral-950">
      <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-yellow-500"></div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { supabase } from '../lib/supabase'

const route = useRoute()
const obra = ref(null)

const obtenerDetalleObra = async () => {
  const idBusca = route.params.id
  
  try {
    const { data, error } = await supabase
      .from('obras')
      .select('*')
      .eq('id', idBusca)
      .single()

    if (error) throw error
    obra.value = data
  } catch (err) {
    console.error("Error al obtener la obra:", err.message)
  }
}

onMounted(() => {
  obtenerDetalleObra()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&display=swap');

h1, .font-serif {
  font-family: 'Playfair Display', serif;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;  
  overflow: hidden;
}
</style>