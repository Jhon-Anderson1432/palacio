<template>
  <div class="min-h-screen w-full bg-black text-white flex flex-col overflow-y-auto font-sans pb-20 relative">
    
    <div class="fixed bottom-0 right-0 w-32 h-32 z-0 pointer-events-none">
      <div class="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-yellow-600/20 to-transparent"></div>
      <div class="absolute bottom-[-20px] right-[-40px] w-[150%] h-20 bg-black rotate-[-45deg] border-t border-yellow-600/50"></div>
    </div>

    <div v-if="obra" class="flex-1 flex flex-col max-w-xl mx-auto w-full relative z-10">
      
      <div class="w-full relative z-[100] border-b-[2px] border-b-yellow-600/50 pt-6">
        <img 
          src="@/assets/logoni.png" 
          alt="Palacio Nacional Galería Header" 
          class="w-full h-auto block"
        />
      </div>

      <div class="flex-1 flex-col px-4 pt-4">

        <router-link 
          to="/exposiciones" 
          class="absolute top-6 left-4 z-[110] bg-white/5 backdrop-blur-md p-2 rounded-full border border-white/10 hover:text-yellow-500 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </router-link>

        <div class="w-full relative bg-black my-4 group">
          <div class="absolute -inset-1 bg-yellow-600/10 blur-xl opacity-50"></div>
          <video 
            :src="obra.video_url" 
            autoplay 
            loop 
            muted 
            playsinline 
            class="w-full h-auto max-h-[40vh] object-contain relative z-10"
          ></video>
        </div>

        <div class="text-center space-y-2 mb-6">
          <h1 class="text-3xl md:text-4xl font-serif text-white leading-tight lowercase capitalize">{{ obra.titulo }}</h1>
  
          <p class="text-lg md:text-xl text-neutral-300 font-serif italic lowercase capitalize">
            {{ obra.titulo_en || 'Translation pending' }}
          </p>
          <p class="text-xl md:text-2xl text-neutral-200 pt-1 font-serif lowercase capitalize">{{ obra.autor }}</p>
        </div>

        <div class="grid grid-cols-2 gap-x-4 gap-y-4 px-1 mb-8 border-t border-white/5 pt-4">
          <div class="space-y-2 text-left">
            <p class="text-[10px] xs:text-xs sm:text-sm">
              <span class="text-neutral-400">Técnica:</span> 
              <span class="text-white lowercase capitalize">{{ obra.tecnica }}</span>
            </p>
            <p class="text-[10px] xs:text-xs sm:text-sm"><span class="text-neutral-400">Dimensión:</span> <span class="text-white lowercase">{{ obra.medidas }}</span></p>
            <p class="text-[10px] xs:text-xs sm:text-sm"><span class="text-neutral-400">Valor:</span> <span class="text-white">{{ isNaN(obra.precio) ? obra.precio : Number(obra.precio).toLocaleString() }} USD</span></p>
            <p class="text-[10px] xs:text-xs sm:text-sm"><span class="text-neutral-400">Contacto:</span> <span class="text-white">3116390177</span></p>
            <p class="text-[10px] xs:text-xs sm:text-sm"><span class="text-neutral-400">Info detallada:</span> <span class="text-white">3104470369</span></p>
          </div>

          <div class="space-y-2 text-left">
            <p class="text-[10px] xs:text-xs sm:text-sm">
              <span class="text-neutral-400">Technique:</span> 
              <span class="text-white lowercase capitalize">{{ obra.medidas_en }}</span>
            </p>
            <p class="text-[10px] xs:text-xs sm:text-sm"><span class="text-neutral-400">Dimensions:</span> <span class="text-white lowercase">{{ obra.medidas }}</span></p>
            <p class="text-[10px] xs:text-xs sm:text-sm"><span class="text-neutral-400">Value:</span> <span class="text-white">{{ isNaN(obra.precio) ? obra.precio : Number(obra.precio).toLocaleString() }} USD</span></p>
            <p class="text-[10px] xs:text-xs sm:text-sm"><span class="text-neutral-400">Contact:</span> <span class="text-white">3116390177</span></p>
            <p class="text-[10px] xs:text-xs sm:text-sm"><span class="text-neutral-400">Detailed info:</span> <span class="text-white">3104470369</span></p>
          </div>
        </div>

        <div class="mt-auto px-4">
          <a 
            :href="'https://wa.me/573116390177?text=Hola, me interesa la obra: ' + obra.titulo" 
            target="_blank"
            class="flex flex-col items-center justify-center w-full py-4 bg-transparent border border-yellow-600 text-yellow-500 font-bold hover:bg-yellow-600 hover:text-black transition-all duration-300"
          >
            <span class="uppercase tracking-[0.2em] text-xs mb-1">Solicitar Adquisición</span>
            <span class="uppercase tracking-[0.1em] text-[10px] opacity-70">Request Acquisition</span>
          </a>
        </div>

      </div>

    </div>

    <div v-else class="h-screen flex flex-col items-center justify-center bg-black">
      <div class="w-12 h-12 border-2 border-yellow-600 border-t-transparent animate-spin rounded-full"></div>
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
    console.trace("Error al obtener la obra:", err.message)
  }
}

onMounted(() => {
  window.scrollTo(0, 0)
  obtenerDetalleObra()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');

.font-serif {
  font-family: 'Playfair Display', serif;
}

h1, p {
  animation: fadeIn 1.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>