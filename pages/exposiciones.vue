<template>
  <main class="min-h-screen bg-neutral-950 text-white pt-24 px-6 pb-20 overflow-x-hidden selection:bg-[#D4AF37] selection:text-black">
    
    <Navbar />

    <header class="text-center max-w-4xl mx-auto mt-6 mb-8 flex flex-col items-center">
      <h1 class="text-3xl md:text-5xl font-serif text-[#D4AF37] uppercase tracking-[0.15em] drop-shadow-lg mb-4">
        {{ t.seoTitle }}
      </h1>
      <p class="text-neutral-400 text-xs md:text-sm tracking-[0.2em] uppercase font-light max-w-2xl">
        {{ t.seoSubtitle }}
      </p>
    </header>

    <div class="w-full flex justify-center mb-10">
      <NuxtImg 
        src="/logon.png" 
        alt="Logotipo Galería Palacio Nacional Medellín" 
        class="w-40 md:w-48 object-contain opacity-90 drop-shadow-[0_0_20px_rgba(212,175,55,0.15)]" 
        preload
      />
    </div>

    <!-- Navegación de Filtros Principales -->
    <nav aria-label="Filtros de exposición" class="max-w-7xl mx-auto mb-6 flex flex-wrap justify-center gap-4">
      <button 
        @click="cambiarFiltro('Todos')" 
        :class="filtroTipo === 'Todos' ? 'bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'bg-transparent border border-white/20 text-white hover:border-[#D4AF37]/60 hover:bg-white/10'"
        class="px-8 py-3 rounded-full transition-all duration-300 flex items-center group active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
      >
        <span class="text-xs font-bold uppercase tracking-widest">{{ t.filterAll }}</span>
      </button>

      <button 
        @click="cambiarFiltro('Pintura')" 
        :class="filtroTipo === 'Pintura' ? 'bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'bg-transparent border border-white/20 text-white hover:border-[#D4AF37]/60 hover:bg-white/10'"
        class="px-8 py-3 rounded-full transition-all duration-300 flex items-center group active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
      >
        <span class="text-xs font-bold uppercase tracking-widest">{{ t.filterPaintings }}</span>
      </button>

      <button 
        @click="cambiarFiltro('Escultura')" 
        :class="filtroTipo === 'Escultura' ? 'bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'bg-transparent border border-white/20 text-white hover:border-[#D4AF37]/60 hover:bg-white/10'"
        class="px-8 py-3 rounded-full transition-all duration-300 flex items-center group active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
      >
        <span class="text-xs font-bold uppercase tracking-widest">{{ t.filterSculptures }}</span>
      </button>
    </nav>

    <!-- Filtros Secundarios (Artista y Precio) -->
    <div class="max-w-7xl mx-auto mb-10 flex flex-col sm:flex-row justify-center gap-4 px-4">
      <div class="relative">
        <select 
          v-model="filtroArtista" 
          @change="aplicarFiltrosAdicionales"
          class="w-full sm:w-auto bg-transparent border border-white/20 text-white px-6 py-3 rounded-full focus:outline-none focus:border-[#D4AF37] hover:border-[#D4AF37]/60 transition-colors appearance-none cursor-pointer text-xs uppercase tracking-widest font-bold pr-10"
        >
          <option value="Todos" class="bg-neutral-900 text-white">{{ t.allArtists }}</option>
          <option v-for="artista in listaArtistas" :key="artista" :value="artista" class="bg-neutral-900 text-white">
            {{ artista }}
          </option>
        </select>
        <span class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#D4AF37]">▼</span>
      </div>

      <div class="relative">
        <select 
          v-model="filtroPrecio" 
          @change="aplicarFiltrosAdicionales"
          class="w-full sm:w-auto bg-transparent border border-white/20 text-white px-6 py-3 rounded-full focus:outline-none focus:border-[#D4AF37] hover:border-[#D4AF37]/60 transition-colors appearance-none cursor-pointer text-xs uppercase tracking-widest font-bold pr-10"
        >
          <option value="Todos" class="bg-neutral-900 text-white">{{ t.allPrices }}</option>
          <option value="bajo" class="bg-neutral-900 text-white">{{ t.priceLow }}</option>
          <option value="medio" class="bg-neutral-900 text-white">{{ t.priceMed }}</option>
          <option value="alto" class="bg-neutral-900 text-white">{{ t.priceHigh }}</option>
        </select>
        <span class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#D4AF37]">▼</span>
      </div>
    </div>

    <div v-if="searchQuery" class="max-w-7xl mx-auto mb-10 flex flex-col sm:flex-row items-center justify-between bg-white/[0.03] backdrop-blur-md p-5 rounded-2xl border border-white/10 gap-4 shadow-xl">
      <p class="text-sm text-neutral-400 tracking-wide">
        {{ t.filteringBy }}
        <span class="text-[#D4AF37] font-bold text-base ml-1">"{{ searchQuery }}"</span>
      </p>
      <button @click="limpiarBusqueda" class="text-neutral-500 hover:text-[#D4AF37] transition-colors text-xs uppercase tracking-widest font-bold flex items-center gap-2 focus:outline-none">
        <span class="text-lg leading-none">×</span> {{ t.clearFilter }}
      </button>
    </div>

    <div v-if="cargando" class="flex flex-col items-center justify-center py-20 space-y-4 text-[#D4AF37]">
      <div class="animate-spin rounded-full h-10 w-10 border-2 border-current border-t-transparent"></div>
      <span class="uppercase tracking-[0.2em] text-xs font-bold animate-pulse">{{ t.syncing }}</span>
    </div>

    <section v-else-if="obrasFiltradas.length > 0" class="max-w-7xl mx-auto flex flex-col" aria-label="Catálogo de Obras de Arte">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mb-12">
        
        <article 
          v-for="(obra, index) in obrasFiltradas" 
          :key="obra.id" 
          itemscope itemtype="https://schema.org/VisualArtwork"
          class="obra-card group bg-neutral-900/40 border border-white/5 rounded-3xl overflow-hidden hover:border-[#D4AF37]/40 hover:bg-neutral-900/80 hover:shadow-[0_15px_40px_rgba(212,175,55,0.15)] transition-all duration-500 flex flex-col relative"
        >
          
          <div class="absolute top-4 left-4 z-10 bg-black/70 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest">
            {{ obra.tipo === 'Escultura' ? t.sculptureLabel : t.paintingLabel }}
          </div>

          <figure class="relative aspect-square overflow-hidden bg-black/50">
            <swiper
              v-if="componenteActivo"
              :modules="modules"
              :slides-per-view="1"
              :loop="obra.listaImagenes.length > 1"
              :autoplay="obra.listaImagenes.length > 1 ? { delay: 3500, disableOnInteraction: false } : false"
              effect="fade"
              class="w-full h-full"
            >
              <swiper-slide v-for="(img, idx) in obra.listaImagenes" :key="idx" class="w-full h-full bg-neutral-950 overflow-hidden relative flex items-center justify-center">
                <NuxtImg 
                  v-if="img !== 'sin-imagen'" 
                  :src="img" 
                  :alt="`${obtenerTitulo(obra)} - Venta de Arte en Medellín`" 
                  itemprop="image" 
                  :loading="index < 3 && idx === 0 ? 'eager' : 'lazy'" 
                  :preload="index < 3 && idx === 0" 
                  class="w-full h-full object-cover object-center block transition-transform duration-1000 group-hover:scale-110"
                />
                <div v-else class="w-full h-full flex items-center justify-center bg-neutral-900 text-neutral-600 text-xs uppercase tracking-widest">Sin Imagen</div>
              </swiper-slide>
            </swiper>
            <div class="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent opacity-90 pointer-events-none z-10"></div>
          </figure>

          <div class="p-6 md:p-8 flex-1 flex flex-col relative z-20 -mt-16">
            <div class="text-center mb-6">
              <h3 itemprop="name" class="text-2xl md:text-3xl font-serif text-white mb-2 group-hover:text-[#D4AF37] transition-colors lowercase capitalize drop-shadow-md line-clamp-2">
                {{ obtenerTitulo(obra) }}
              </h3>
              <p itemprop="creator" itemscope itemtype="https://schema.org/Person" class="text-neutral-300 text-sm italic lowercase capitalize">
                {{ t.by }} <span itemprop="name">{{ obra.autor }}</span>
              </p>
            </div>

            <div class="py-5 border-y border-white/10 mb-6 flex-1 flex flex-col justify-center bg-black/30 rounded-2xl px-5">
              <div class="grid grid-cols-2 gap-4 items-start">
                
                <div class="text-left pr-2">
                  <span class="text-[9px] uppercase text-[#D4AF37] tracking-[0.2em] font-bold block mb-1.5">{{ t.techniqueLabel }}</span>
                  <p itemprop="artMedium" class="text-xs text-neutral-300 font-medium line-clamp-2 leading-relaxed capitalize">
                    {{ obtenerTecnica(obra) }}
                  </p>
                </div>
                
                <div class="text-left border-l border-white/10 pl-4">
                  <span class="text-[9px] uppercase text-[#D4AF37] tracking-[0.2em] font-bold block mb-1.5">{{ t.dimensionsLabel }}</span>
                  <p itemprop="artDimensions" class="text-xs text-neutral-300 font-medium line-clamp-2 leading-relaxed lowercase">{{ obra.medidas }}</p>
                </div>

              </div>
            </div>

            <div class="mt-auto flex items-center justify-between">
              <span itemprop="offers" itemscope itemtype="https://schema.org/Offer" class="text-xl md:text-2xl font-serif text-white tracking-wider flex items-baseline">
                <meta itemprop="priceCurrency" content="USD" />
                <meta itemprop="price" :content="isNaN(obra.precio) ? '0' : String(obra.precio).replace(/[^0-9.]/g, '')" />
                {{ isNaN(obra.precio) ? obra.precio : '$' + Number(obra.precio).toLocaleString('es-CO') }}
                <span class="text-[10px] text-neutral-500 ml-1 font-sans font-bold uppercase tracking-widest">USD</span>
              </span>

              <NuxtLink 
                :to="'/DetalleObra/' + obra.id" 
                class="flex items-center justify-center px-6 py-3 border border-white/20 bg-white/5 text-white rounded-full hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-black focus:ring-2 focus:ring-[#D4AF37]/50 focus:outline-none transition-all duration-300 shadow-lg active:scale-95"
              >
                <span class="text-[10px] font-bold uppercase tracking-widest leading-none">{{ t.detailsBtn }}</span>
              </NuxtLink>
            </div>
          </div>
        </article>
      </div>

      <!-- Sistema de Paginación -->
      <div v-if="totalPaginas > 1" class="w-full flex justify-center items-center gap-6 pb-8">
        <button 
          @click="irAPagina(paginaActual - 1)" 
          :disabled="paginaActual === 1" 
          class="px-6 py-3 border border-white/20 bg-transparent text-white rounded-full hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-black disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-white disabled:hover:border-white/20 transition-all duration-300 focus:outline-none active:scale-95"
        >
          <span class="text-xs font-bold uppercase tracking-widest">{{ t.prevPage }}</span>
        </button>
        
        <span class="text-sm text-neutral-400 font-sans tracking-widest uppercase">
          {{ t.page }} <span class="text-[#D4AF37] font-bold">{{ paginaActual }}</span> {{ t.of }} {{ totalPaginas }}
        </span>

        <button 
          @click="irAPagina(paginaActual + 1)" 
          :disabled="paginaActual === totalPaginas" 
          class="px-6 py-3 border border-white/20 bg-transparent text-white rounded-full hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-black disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-white disabled:hover:border-white/20 transition-all duration-300 focus:outline-none active:scale-95"
        >
          <span class="text-xs font-bold uppercase tracking-widest">{{ t.nextPage }}</span>
        </button>
      </div>
    </section>

    <div v-else class="max-w-7xl mx-auto text-center py-32 space-y-4">
      <div class="text-5xl mb-6 opacity-40">🖼️</div>
      <p class="text-neutral-400 font-serif text-2xl italic">{{ t.noResults }}</p>
      <button @click="limpiarBusqueda" class="text-[#D4AF37] hover:text-white uppercase tracking-widest text-xs font-bold mt-6 transition-colors focus:outline-none">
        Ver todas las obras
      </button>
    </div>

  </main>
</template>

<script setup>
// === 1. SEO REACTIVO EN NUXT 3 (MÁXIMO CTR Y SEO DE CATÁLOGO) ===
useSeoMeta({
  // Título ajustado a 56 caracteres (preciso para no ser cortado por Google)
  title: 'Catálogo de Obras de Arte en Medellín | Palacio Nacional',
  
  // Descripción transaccional con palabras clave locales y de intención (149 caracteres)
  description: 'Explora nuestro catálogo de arte en Medellín. Filtra y adquiere pinturas y esculturas exclusivas de artistas locales en la Galería Palacio Nacional.',
  
  // Open Graph (Ideal para compartir el catálogo por WhatsApp a coleccionistas)
  ogTitle: '🖼️ Catálogo de Obras de Arte | Galería Palacio Nacional',
  ogDescription: '¿Buscas invertir en arte? Descubre nuestra colección exclusiva de pinturas y esculturas en el centro histórico de Medellín. ¡Explora el catálogo!',
  ogImage: 'https://palacionacionalmedellin.com/logon.png',
  
  // Twitter Cards (X)
  twitterCard: 'summary_large_image',
})

import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';

const modules = [Autoplay, EffectFade];

const supabase = useSupabaseClient()

const idiomaGlobal = useState('idiomaGlobal', () => 'es')
const searchQuery = useState('searchQuery', () => '')

const componenteActivo = ref(true)

const traducciones = {
  es: { seoTitle: 'Galería de Arte', seoSubtitle: 'Exposiciones, Museo y Venta de Obras en Medellín', filterAll: 'Todas', filterPaintings: 'Pinturas', filterSculptures: 'Esculturas', filteringBy: 'Filtrando por:', clearFilter: 'Quitar Filtro', syncing: 'Sincronizando galería...', paintingLabel: 'Pintura', sculptureLabel: 'Escultura', by: 'Por', techniqueLabel: 'Técnica', dimensionsLabel: 'Medidas', detailsBtn: 'Ver detalles', loadMore: 'Descubrir más obras', loading: 'Cargando...', noResults: 'No encontramos obras con estos parámetros.', allArtists: 'Todos los Artistas', allPrices: 'Todos los Precios', priceLow: 'Menos de $1,000 USD', priceMed: '$1,000 - $5,000 USD', priceHigh: 'Más de $5,000 USD', prevPage: 'Anterior', nextPage: 'Siguiente', page: 'Página', of: 'de' },
  en: { seoTitle: 'Art Gallery', seoSubtitle: 'Exhibitions, Museum and Art Sales in Medellin', filterAll: 'All', filterPaintings: 'Paintings', filterSculptures: 'Sculptures', filteringBy: 'Filtering by:', clearFilter: 'Clear Filter', syncing: 'Syncing gallery...', paintingLabel: 'Painting', sculptureLabel: 'Sculpture', by: 'By', techniqueLabel: 'Technique', dimensionsLabel: 'Dimensions', detailsBtn: 'View details', loadMore: 'Discover more artworks', loading: 'Loading...', noResults: 'No artworks found matching these parameters.', allArtists: 'All Artists', allPrices: 'All Prices', priceLow: 'Under $1,000 USD', priceMed: '$1,000 - $5,000 USD', priceHigh: 'Over $5,000 USD', prevPage: 'Previous', nextPage: 'Next', page: 'Page', of: 'of' },
  fr: { seoTitle: 'Galerie d\'Art', seoSubtitle: 'Expositions, Musée et Vente d\'Art à Medellín', filterAll: 'Toutes', filterPaintings: 'Peintures', filterSculptures: 'Sculptures', filteringBy: 'Filtrage par:', clearFilter: 'Effacer le filtre', syncing: 'Synchronisation...', paintingLabel: 'Peinture', sculptureLabel: 'Sculpture', by: 'Par', techniqueLabel: 'Technique', dimensionsLabel: 'Dimensions', detailsBtn: 'Voir les détails', loadMore: 'Découvrir plus d\'œuvres', loading: 'Chargement...', noResults: 'Aucune œuvre trouvée.', allArtists: 'Tous les Artistes', allPrices: 'Tous les Prix', priceLow: 'Moins de 1 000 $ USD', priceMed: '1 000 $ - 5 000 $ USD', priceHigh: 'Plus de 5 000 $ USD', prevPage: 'Précédent', nextPage: 'Suivant', page: 'Page', of: 'sur' },
  ja: { seoTitle: 'アートギャラリー', seoSubtitle: 'メデジンの展覧会、美術館、アート販売', filterAll: 'すべて', filterPaintings: '絵画', filterSculptures: '彫刻', filteringBy: 'フィルター:', clearFilter: 'フィルター解除', syncing: 'ギャラリーを同期中...', paintingLabel: '絵画', sculptureLabel: '彫刻', by: '作', techniqueLabel: '手法', dimensionsLabel: '寸法', detailsBtn: '詳細を見る', loadMore: 'もっと作品を見る', loading: '読み込み中...', noResults: '条件に一致する作品はありません。', allArtists: 'すべてのアーティスト', allPrices: 'すべての価格', priceLow: '1,000 USD未満', priceMed: '1,000 - 5,000 USD', priceHigh: '5,000 USD以上', prevPage: '前へ', nextPage: '次へ', page: 'ページ', of: '/' }
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
const cargando = ref(true) 
const filtroTipo = ref('Todos')

const filtroArtista = ref('Todos')
const filtroPrecio = ref('Todos')
const listaArtistas = ref([])

// Configuración de Paginación
const limitePorPagina = 12
const paginaActual = ref(1) 
const totalPaginas = ref(1)

// === 2. SCHEMA Y ARQUITECTURA BASE ===
useHead({
  link: [
    { rel: 'canonical', href: 'https://palacionacionalmedellin.com/exposiciones' }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ArtGallery",
        "name": "Galería de Arte Palacio Nacional Medellín",
        "description": "Galería de arte, museo y venta de pinturas y esculturas en Medellín.",
        "url": "https://palacionacionalmedellin.com/exposiciones",
        "image": "https://palacionacionalmedellin.com/logon.png",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Carrera 52 # 52-43",
          "addressLocality": "Medellín",
          "addressRegion": "Antioquia",
          "addressCountry": "CO"
        }
      })
    }
  ]
})

const cargarArtistas = async () => {
  try {
    const { data, error } = await supabase.from('obras').select('autor')
    if (!error && data) {
      const autoresUnicos = [...new Set(data.map(o => o.autor).filter(a => a && a.trim() !== ''))]
      listaArtistas.value = autoresUnicos.sort()
    }
  } catch (err) {
    console.error("Error al cargar artistas:", err.message)
  }
}

// Fusión: Filtrado Numérico en JS + Paginación (Página 1 de X)
const fetchObras = async (reiniciarPaginacion = true) => {
  try {
    cargando.value = true
    
    if (reiniciarPaginacion) {
      paginaActual.value = 1
    }

    let query = supabase
      .from('obras')
      .select('*')
      .order('created_at', { ascending: false }) 

    if (filtroTipo.value !== 'Todos') {
      query = query.eq('tipo', filtroTipo.value)
    }

    if (filtroArtista.value !== 'Todos') {
      query = query.eq('autor', filtroArtista.value)
    }

    const { data, error } = await query

    if (error) throw error

    if (data) {
      // 1. Filtrado numérico en JavaScript
      const obrasFiltradasJS = data.filter(obra => {
        let coincideBusqueda = true
        if (searchQuery.value && searchQuery.value.trim() !== '') {
          const termino = searchQuery.value.toLowerCase().trim()
          coincideBusqueda = (
            obra.titulo?.toLowerCase().includes(termino) ||
            obra.autor?.toLowerCase().includes(termino) ||
            obra.titulo_en?.toLowerCase().includes(termino)
          )
        }

        let coincidePrecio = true
        if (filtroPrecio.value !== 'Todos') {
          const precioNumerico = Number(String(obra.precio).replace(/[^0-9.]/g, ''))
          
          if (filtroPrecio.value === 'bajo') {
            coincidePrecio = precioNumerico < 1000
          } else if (filtroPrecio.value === 'medio') {
            coincidePrecio = precioNumerico >= 1000 && precioNumerico <= 5000
          } else if (filtroPrecio.value === 'alto') {
            coincidePrecio = precioNumerico > 5000
          }
        }

        return coincideBusqueda && coincidePrecio
      })

      // 2. Calcular total de páginas según los resultados ya filtrados matemáticamente
      totalPaginas.value = Math.ceil(obrasFiltradasJS.length / limitePorPagina) || 1

      // 3. Procesar imágenes
      const obrasProcesadas = obrasFiltradasJS.map(o => {
        const imgs = [o.imagen_1, o.imagen_2, o.imagen_3].filter(Boolean);
        return {
          ...o,
          listaImagenes: imgs.length > 0 ? imgs : ['sin-imagen']
        };
      });

      // 4. Aplicar paginación (Página 1, 2, etc.) sobre el array procesado
      const inicio = (paginaActual.value - 1) * limitePorPagina
      const fin = inicio + limitePorPagina
      
      todasLasObras.value = obrasProcesadas.slice(inicio, fin)
    }

  } catch (err) {
    console.error("Error al cargar obras:", err.message)
  } finally {
    cargando.value = false
  }
}

const irAPagina = (nuevaPagina) => {
  if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas.value) {
    paginaActual.value = nuevaPagina
    fetchObras(false)
    if (import.meta.client) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
}

const cambiarFiltro = (nuevoTipo) => {
  filtroTipo.value = nuevoTipo
  fetchObras(true)
}

const aplicarFiltrosAdicionales = () => {
  fetchObras(true)
}

const limpiarBusqueda = () => {
  searchQuery.value = ''
  filtroArtista.value = 'Todos'
  filtroPrecio.value = 'Todos'
}

watch(searchQuery, () => {
  fetchObras(true)
})

onMounted(() => {
  componenteActivo.value = true
  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }
  cargarArtistas() 
  fetchObras(true)
})

onBeforeUnmount(() => {
  componenteActivo.value = false
})

const obrasFiltradas = computed(() => todasLasObras.value)
definePageMeta({
  layout: false 
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');

.font-serif {
  font-family: 'Playfair Display', serif;
}

.obra-card {
  animation: slideUpFade 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.obra-card:nth-child(1) { animation-delay: 0.1s; }
.obra-card:nth-child(2) { animation-delay: 0.2s; }
.obra-card:nth-child(3) { animation-delay: 0.3s; }
.obra-card:nth-child(4) { animation-delay: 0.4s; }
.obra-card:nth-child(5) { animation-delay: 0.5s; }
.obra-card:nth-child(6) { animation-delay: 0.6s; }

@keyframes slideUpFade {
  from { 
    opacity: 0; 
    transform: translateY(50px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

.swiper-slide {
  width: 100% !important;
  height: 100% !important;
  overflow: hidden;
  background-color: #0a0a0a;
  position: relative;
}

.swiper-slide img {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover;
  object-position: center;
  display: block;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform: translateZ(0);
}

select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
</style>