<template>
  <div class="fixed inset-0 z-[100] h-screen w-full bg-neutral-950 text-white flex flex-col overflow-hidden font-sans">
    
    <div v-if="obra" class="flex-1 flex flex-col h-full max-w-md mx-auto w-full relative">
      
      <router-link 
        to="/exposiciones" 
        class="absolute top-6 left-6 z-[110] bg-black/40 backdrop-blur-md p-2 rounded-full border border-white/10 text-white hover:text-yellow-500 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </router-link>

      <div class="h-[45vh] w-full relative bg-black shadow-2xl">
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

      <div class="flex-1 flex flex-col justify-between p-6 bg-neutral-950">
        
        <div class="text-center space-y-1">
          <h1 class="text-3xl font-serif text-yellow-500 leading-tight">{{ obra.titulo }}</h1>
          <p class="text-sm text-neutral-400 italic">Por {{ obra.autor }}</p>
        </div>

        <div class="px-2 overflow-hidden">
          <p class="text-neutral-300 text-sm italic leading-relaxed text-center line-clamp-3">
            {{ obra.tecnica }} realizada con maestría por el autor.
          </p>
        </div>

        <div class="flex justify-around items-center bg-white/5 py-3 rounded-xl border border-white/5">
          <div class="text-center">
            <span class="text-neutral-500 text-[8px] uppercase tracking-tighter block mb-1">Técnica</span>
            <p class="text-neutral-200 text-[11px] font-medium leading-none">{{ obra.tecnica }}</p>
          </div>
          <div class="h-8 w-[1px] bg-white/10"></div>
          <div class="text-center">
            <span class="text-neutral-500 text-[8px] uppercase tracking-tighter block mb-1">Medidas</span>
            <p class="text-neutral-200 text-[11px] font-medium leading-none">{{ obra.medidas }}</p>
          </div>
        </div>

        <div class="space-y-4 mb-2">
          <div class="text-center">
            <p class="text-2xl font-mono text-white tracking-tighter">
              {{ isNaN(obra.precio) ? obra.precio : '$' + Number(obra.precio).toLocaleString() }}
            </p>
          </div>

          <a 
            :href="'https://wa.me/573002493543?text=Hola, me interesa la obra: ' + obra.titulo" 
            target="_blank"
            class="flex items-center justify-center w-full py-4 bg-yellow-600 text-black font-bold rounded-xl uppercase tracking-widest text-xs active:scale-95 transition-transform"
          >
            Consultar Adquisición
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
import { supabase } from '../lib/supabase' // Cambio clave: ahora usamos Supabase

const route = useRoute()
const obra = ref(null)

const obtenerDetalleObra = async () => {
  const idBusca = route.params.id
  
  try {
    const { data, error } = await supabase
      .from('obras')
      .select('*')
      .eq('id', idBusca)
      .single() // Solo queremos un resultado

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