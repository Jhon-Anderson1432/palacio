<template>
  <div class="min-h-screen bg-neutral-950 text-white pt-28 px-6 pb-20">
    
    <div class="max-w-7xl mx-auto mb-12">
      <h2 class="text-4xl font-serif text-yellow-500 mb-2">Exposiciones</h2>
      <p class="text-neutral-400 italic">Explora nuestra colección exclusiva.</p>
    </div>

    <div v-if="searchQuery" class="max-w-7xl mx-auto mb-8 flex items-center gap-4">
      <p class="text-sm text-neutral-500">
        Filtrando por: <span class="text-white font-bold">"{{ searchQuery }}"</span>
      </p>
      <button @click="searchQuery = ''" class="text-xs text-yellow-600 hover:text-yellow-500 uppercase tracking-widest font-bold">
        ✕ Quitar Filtro
      </button>
    </div>

    <div v-if="cargando" class="text-center py-20 text-neutral-500 animate-pulse uppercase tracking-widest text-xs">
      Sincronizando galería...
    </div>

    <div v-else-if="obrasFiltradas.length > 0" class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      
      <div 
        v-for="obra in obrasFiltradas" 
        :key="obra.id"
        class="group bg-neutral-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-yellow-500/40 transition-all duration-500 flex flex-col"
      >
        <div class="relative aspect-square overflow-hidden bg-black">
          <video 
          :src="obra.video_url" 
          autoplay 
          loop 
          muted 
          playsinline 
          class="w-full h-full object-cover"
        ></video>
          <div class="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80"></div>
        </div>

        <div class="p-6 flex-1 flex flex-col">
          <h3 class="text-2xl font-serif text-white mb-1 group-hover:text-yellow-500 transition-colors">
            {{ obra.titulo }}
          </h3>
          
          <p class="text-neutral-400 text-sm italic mb-4">Por {{ obra.autor }}</p>

          <div class="grid grid-cols-2 gap-4 py-4 border-y border-white/5 mb-6">
            <div>
              <span class="text-[10px] uppercase text-yellow-600 tracking-widest block mb-1">Técnica</span>
              <p class="text-xs text-neutral-300 font-medium">{{ obra.tecnica }}</p>
            </div>
            <div>
              <span class="text-[10px] uppercase text-yellow-600 tracking-widest block mb-1">Medidas</span>
              <p class="text-xs text-neutral-300 font-medium">{{ obra.medidas }}</p>
            </div>
          </div>

          <div class="mt-auto flex items-center justify-between">
            <span class="text-xl font-mono text-white tracking-tighter">
              {{ obra.precio }}
            </span>

            <router-link 
              :to="'/DetalleObra/' + obra.id"
              class="px-5 py-2 bg-white text-black text-xs font-bold rounded-full hover:bg-yellow-500 transition-all duration-300 uppercase tracking-tighter"
            >
              Ver más
            </router-link>
          </div>
        </div>
      </div>

    </div>

    <div v-else class="max-w-7xl mx-auto text-center py-24">
      <p class="text-neutral-500 italic text-lg">No encontramos obras que coincidan con tu búsqueda.</p>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase, searchQuery } from '../lib/supabase' // Importamos la conexión real

const todasLasObras = ref([])
const cargando = ref(true)

// Función para traer datos de Supabase
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
    console.error("Error cargando obras:", err.message)
  } finally {
    cargando.value = false
  }
}

onMounted(() => {
  fetchObras()
})

// Lógica de filtrado reactivo usando el searchQuery global
const obrasFiltradas = computed(() => {
  const query = searchQuery.value.toLowerCase().trim()
  if (!query) return todasLasObras.value

  return todasLasObras.value.filter(o => 
    o.titulo.toLowerCase().includes(query) || 
    o.autor.toLowerCase().includes(query) ||
    o.tecnica.toLowerCase().includes(query)
  )
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400&display=swap');

h2, h3, .font-serif {
  font-family: 'Playfair Display', serif;
}

/* Animación de entrada para las tarjetas */
.grid > div {
  animation: fadeIn 0.8s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>