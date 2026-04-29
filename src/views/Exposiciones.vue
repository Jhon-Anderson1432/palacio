<template>
  <div class="min-h-screen bg-neutral-950 text-white pt-24 px-6 pb-20 overflow-x-hidden">
    
    <Navbar />

    <div class="max-w-7xl mx-auto mb-8 flex flex-wrap justify-center gap-4 mt-4">
      <button 
        @click="cambiarFiltro('Todos')" 
        :class="filtroTipo === 'Todos' ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20' : 'bg-transparent border border-white/20 text-white hover:border-[#D4AF37]/50'"
        class="px-8 py-3 rounded-full transition-all duration-300 flex items-center group"
      >
        <span class="text-xs font-bold uppercase tracking-widest">{{ t.filterAll }}</span>
      </button>

      <button 
        @click="cambiarFiltro('Pintura')" 
        :class="filtroTipo === 'Pintura' ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20' : 'bg-transparent border border-white/20 text-white hover:border-[#D4AF37]/50'"
        class="px-8 py-3 rounded-full transition-all duration-300 flex items-center group"
      >
        <span class="text-xs font-bold uppercase tracking-widest">{{ t.filterPaintings }}</span>
      </button>

      <button 
        @click="cambiarFiltro('Escultura')" 
        :class="filtroTipo === 'Escultura' ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20' : 'bg-transparent border border-white/20 text-white hover:border-[#D4AF37]/50'"
        class="px-8 py-3 rounded-full transition-all duration-300 flex items-center group"
      >
        <span class="text-xs font-bold uppercase tracking-widest">{{ t.filterSculptures }}</span>
      </button>
    </div>

    <div class="w-full flex justify-center mb-12">
      <img src="@/assets/logon.png" alt="Palacio Logo" class="w-40 md:w-56 object-contain opacity-90 drop-shadow-[0_0_15px_rgba(212,175,55,0.2)]" />
    </div>

    <div v-if="searchQuery" class="max-w-7xl mx-auto mb-8 flex flex-col sm:flex-row items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5 gap-4">
      <p class="text-sm text-neutral-400">
        {{ t.filteringBy }}
        <span class="text-white font-bold text-base ml-1">"{{ searchQuery }}"</span>
      </p>
      <button @click="limpiarBusqueda" class="text-[#D4AF37] hover:text-white transition-colors text-xs uppercase tracking-widest font-bold">
        {{ t.clearFilter }}
      </button>
    </div>

    <div v-if="cargandoInicial" class="flex flex-col items-center justify-center py-20 space-y-4 text-neutral-500">
      <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-[#D4AF37]"></div>
      <span class="uppercase tracking-widest text-xs">{{ t.syncing }}</span>
    </div>

    <div v-else-if="obrasFiltradas.length > 0" class="max-w-7xl mx-auto flex flex-col">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
        
        <div v-for="obra in obrasFiltradas" :key="obra.id" class="group bg-neutral-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-[#D4AF37]/40 transition-all duration-500 flex flex-col relative">
          
          <div class="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-xs text-white font-bold uppercase tracking-widest">
            {{ obra.tipo === 'Escultura' ? t.sculptureLabel : t.paintingLabel }}
          </div>

          <div class="relative aspect-square overflow-hidden bg-black">
            <swiper
              :modules="modules"
              :slides-per-view="1"
              :loop="true"
              :autoplay="{ delay: 3500, disableOnInteraction: false }"
              effect="fade"
              class="w-full h-full"
            >
              <swiper-slide v-if="obra.imagen_1"><img :src="obra.imagen_1" class="w-full h-full object-cover"></swiper-slide>
              <swiper-slide v-if="obra.imagen_2"><img :src="obra.imagen_2" class="w-full h-full object-cover"></swiper-slide>
              <swiper-slide v-if="obra.imagen_3"><img :src="obra.imagen_3" class="w-full h-full object-cover"></swiper-slide>
              
              <swiper-slide v-if="!obra.imagen_1 && !obra.imagen_2 && !obra.imagen_3">
                <div class="w-full h-full flex items-center justify-center bg-neutral-800 text-neutral-500">Sin Imagen</div>
              </swiper-slide>
            </swiper>
            <div class="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80 pointer-events-none z-10"></div>
          </div>

          <div class="p-6 flex-1 flex flex-col">
            <div class="text-center mb-4">
              <h3 class="text-3xl font-serif text-white mb-1 group-hover:text-[#D4AF37] transition-colors lowercase capitalize">
                {{ obtenerTitulo(obra) }}
              </h3>
              <p class="text-neutral-400 text-sm italic lowercase capitalize">{{ t.by }} {{ obra.autor }}</p>
            </div>

            <div class="py-4 border-y border-white/5 mb-6 flex-1 flex flex-col justify-center">
              <div class="grid grid-cols-2 gap-4 items-start">
                
                <div class="text-left pr-2">
                  <span class="text-[10px] uppercase text-[#D4AF37]/70 tracking-widest block mb-1">{{ t.techniqueLabel }}</span>
                  <p class="text-sm text-neutral-300 font-medium line-clamp-2 leading-tight capitalize">
                    {{ obtenerTecnica(obra) }}
                  </p>
                </div>
                
                <div class="text-left border-l border-white/10 pl-4">
                  <span class="text-[10px] uppercase text-[#D4AF37]/70 tracking-widest block mb-1">{{ t.dimensionsLabel }}</span>
                  <p class="text-sm text-neutral-300 font-medium line-clamp-2 leading-tight lowercase">{{ obra.medidas }}</p>
                </div>

              </div>
            </div>

            <div class="mt-auto flex items-center justify-between pt-2">
              <span class="text-2xl font-mono text-white tracking-tighter flex items-baseline">
                {{ isNaN(obra.precio) ? obra.precio : '$' + Number(obra.precio).toLocaleString() }}
                <span class="text-xs text-neutral-500 ml-1">USD</span>
              </span>

              <router-link 
                :to="'/DetalleObra/' + obra.id" 
                class="flex items-center justify-center px-6 py-3 bg-white text-black rounded-full hover:bg-[#D4AF37] hover:scale-105 transition-all duration-300 shadow-xl"
              >
                <span class="text-xs font-bold uppercase tracking-widest leading-none">{{ t.detailsBtn }}</span>
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div v-if="hayMasObras" class="w-full flex justify-center pb-8">
        <button @click="cargarMasObras" :disabled="cargandoMas" class="flex flex-col items-center justify-center px-8 py-3 bg-transparent border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37]/10 hover:border-[#D4AF37] rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
          <span v-if="cargandoMas" class="flex items-center gap-2">
            <div class="animate-spin rounded-full h-4 w-4 border-t-2 border-[#D4AF37]"></div>
            <span class="text-xs uppercase tracking-widest">{{ t.loading }}</span>
          </span>
          <span v-else class="text-xs font-bold uppercase tracking-widest">
            {{ t.loadMore }}
          </span>
        </button>
      </div>
    </div>

    <div v-else class="max-w-7xl mx-auto text-center py-24 space-y-2">
      <p class="text-neutral-500 italic text-lg">{{ t.noResults }}</p>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import Navbar from '../components/Navbar.vue' 
import { supabase, searchQuery, idiomaGlobal } from '../lib/supabase'

import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
const modules = [Autoplay, EffectFade];


const traducciones = {
  es: { filterAll: 'Todas', filterPaintings: 'Pinturas', filterSculptures: 'Esculturas', filteringBy: 'Filtrando por:', clearFilter: '✕ Quitar Filtro', syncing: 'Sincronizando galería...', paintingLabel: 'Pintura', sculptureLabel: 'Escultura', by: 'Por', techniqueLabel: 'Técnica', dimensionsLabel: 'Medidas', detailsBtn: 'Ver detalles', loadMore: 'Descubrir más obras', loading: 'Cargando...', noResults: 'No encontramos obras con estos parámetros.' },
  en: { filterAll: 'All', filterPaintings: 'Paintings', filterSculptures: 'Sculptures', filteringBy: 'Filtering by:', clearFilter: '✕ Clear Filter', syncing: 'Syncing gallery...', paintingLabel: 'Painting', sculptureLabel: 'Sculpture', by: 'By', techniqueLabel: 'Technique', dimensionsLabel: 'Dimensions', detailsBtn: 'View details', loadMore: 'Discover more artworks', loading: 'Loading...', noResults: 'No artworks found matching these parameters.' },
  fr: { filterAll: 'Toutes', filterPaintings: 'Peintures', filterSculptures: 'Sculptures', filteringBy: 'Filtrage par:', clearFilter: '✕ Effacer le filtre', syncing: 'Synchronisation...', paintingLabel: 'Peinture', sculptureLabel: 'Sculpture', by: 'Par', techniqueLabel: 'Technique', dimensionsLabel: 'Dimensions', detailsBtn: 'Voir les détails', loadMore: 'Découvrir plus d\'œuvres', loading: 'Chargement...', noResults: 'Aucune œuvre trouvée.' },
  ja: { filterAll: 'すべて', filterPaintings: '絵画', filterSculptures: '彫刻', filteringBy: 'フィルター:', clearFilter: '✕ フィルター解除', syncing: 'ギャラリーを同期中...', paintingLabel: '絵画', sculptureLabel: '彫刻', by: '作', techniqueLabel: '手法', dimensionsLabel: '寸法', detailsBtn: '詳細を見る', loadMore: 'もっと作品を見る', loading: '読み込み中...', noResults: '条件に一致する作品はありません。' }
}

const t = computed(() => traducciones[idiomaGlobal.value] || traducciones['es'])

const obtenerTitulo = (obra) => {
  if (idiomaGlobal.value === 'en' && obra.titulo_en) return obra.titulo_en;
  if (idiomaGlobal.value === 'fr' && obra.titulo_fr) return obra.titulo_fr;
  if (idiomaGlobal.value === 'ja' && obra.titulo_ja) return obra.titulo_ja;
  return obra.titulo; 
}

const obtenerTecnica = (obra) => {
  if (idiomaGlobal.value === 'en' && obra.medidas_en) return obra.medidas_en;
  if (idiomaGlobal.value === 'fr' && obra.medidas_fr) return obra.medidas_fr;
  if (idiomaGlobal.value === 'ja' && obra.medidas_ja) return obra.medidas_ja;
  return obra.tecnica; 
}

const todasLasObras = ref([])
const cargandoInicial = ref(true)
const cargandoMas = ref(false)
const filtroTipo = ref('Todos')

const limitePorPagina = 12
const paginaActual = ref(0)
const hayMasObras = ref(true)

const fetchObras = async (esCargaInicial = true) => {
  try {
    if (esCargaInicial) {
      cargandoInicial.value = true
      todasLasObras.value = []
      paginaActual.value = 0
    } else {
      cargandoMas.value = true
    }

    const inicio = paginaActual.value * limitePorPagina
    const fin = inicio + limitePorPagina - 1

    let query = supabase
      .from('obras')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false }) 
      .range(inicio, fin)

    if (filtroTipo.value !== 'Todos') {
      query = query.eq('tipo', filtroTipo.value)
    }

    if (searchQuery.value && searchQuery.value.trim() !== '') {
      const termino = `%${searchQuery.value.trim()}%`
      query = query.or(`titulo.ilike.${termino},autor.ilike.${termino},titulo_en.ilike.${termino}`)
    }

    const { data, count, error } = await query

    if (error) throw error

    if (data) {
      if (esCargaInicial) {
        todasLasObras.value = data
      } else {
        todasLasObras.value = [...todasLasObras.value, ...data]
      }
      hayMasObras.value = todasLasObras.value.length < count
    }

  } catch (err) {
    console.error("Error al cargar obras:", err.message)
  } finally {
    cargandoInicial.value = false
    cargandoMas.value = false
  }
}

const cargarMasObras = () => {
  paginaActual.value += 1
  fetchObras(false)
}

const cambiarFiltro = (nuevoTipo) => {
  filtroTipo.value = nuevoTipo
  fetchObras(true)
}

const limpiarBusqueda = () => {
  searchQuery.value = ''
}

watch(searchQuery, () => {
  fetchObras(true)
})

onMounted(() => fetchObras(true))

const obrasFiltradas = computed(() => todasLasObras.value)
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