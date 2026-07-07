<template>
  <!-- ESTRUCTURA & SEO: Uso de <main> e inclusión de atributos aria para accesibilidad -->
  <main class="min-h-screen bg-neutral-950 text-white pt-24 px-6 pb-20 overflow-x-hidden selection:bg-[#D4AF37] selection:text-black">
    
    <Navbar />

    <!-- SEO: Un <h1> visible pero sumamente elegante. Es CRUCIAL para que Google entienda de qué va la página -->
    <header class="text-center max-w-4xl mx-auto mt-6 mb-8 flex flex-col items-center">
      <h1 class="text-3xl md:text-5xl font-serif text-[#D4AF37] uppercase tracking-[0.15em] drop-shadow-lg mb-4">
        {{ t.seoTitle }}
      </h1>
      <p class="text-neutral-400 text-xs md:text-sm tracking-[0.2em] uppercase font-light max-w-2xl">
        {{ t.seoSubtitle }}
      </p>
    </header>

    <div class="w-full flex justify-center mb-10">
      <img 
        src="@/assets/logon.png" 
        alt="Logotipo Galería Palacio Nacional Medellín" 
        class="w-40 md:w-48 object-contain opacity-90 drop-shadow-[0_0_20px_rgba(212,175,55,0.15)]" 
        fetchpriority="high"
      />
    </div>

    <!-- Navegación de Filtros Semántica -->
    <nav aria-label="Filtros de exposición" class="max-w-7xl mx-auto mb-10 flex flex-wrap justify-center gap-4">
      <button 
        @click="cambiarFiltro('Todos')" 
        :class="filtroTipo === 'Todos' ? 'bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'bg-transparent border border-white/20 text-white hover:border-[#D4AF37]/60 hover:bg-white/5'"
        class="px-8 py-3 rounded-full transition-all duration-300 flex items-center group active:scale-95"
      >
        <span class="text-xs font-bold uppercase tracking-widest">{{ t.filterAll }}</span>
      </button>

      <button 
        @click="cambiarFiltro('Pintura')" 
        :class="filtroTipo === 'Pintura' ? 'bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'bg-transparent border border-white/20 text-white hover:border-[#D4AF37]/60 hover:bg-white/5'"
        class="px-8 py-3 rounded-full transition-all duration-300 flex items-center group active:scale-95"
      >
        <span class="text-xs font-bold uppercase tracking-widest">{{ t.filterPaintings }}</span>
      </button>

      <button 
        @click="cambiarFiltro('Escultura')" 
        :class="filtroTipo === 'Escultura' ? 'bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]' : 'bg-transparent border border-white/20 text-white hover:border-[#D4AF37]/60 hover:bg-white/5'"
        class="px-8 py-3 rounded-full transition-all duration-300 flex items-center group active:scale-95"
      >
        <span class="text-xs font-bold uppercase tracking-widest">{{ t.filterSculptures }}</span>
      </button>
    </nav>

    <div v-if="searchQuery" class="max-w-7xl mx-auto mb-10 flex flex-col sm:flex-row items-center justify-between bg-white/[0.02] backdrop-blur-sm p-4 rounded-xl border border-white/10 gap-4 shadow-lg">
      <p class="text-sm text-neutral-400 tracking-wide">
        {{ t.filteringBy }}
        <span class="text-[#D4AF37] font-bold text-base ml-1">"{{ searchQuery }}"</span>
      </p>
      <button @click="limpiarBusqueda" class="text-neutral-500 hover:text-[#D4AF37] transition-colors text-xs uppercase tracking-widest font-bold flex items-center gap-2">
        <span class="text-lg leading-none">×</span> {{ t.clearFilter }}
      </button>
    </div>

    <div v-if="cargandoInicial" class="flex flex-col items-center justify-center py-20 space-y-4 text-[#D4AF37]">
      <div class="animate-spin rounded-full h-10 w-10 border-2 border-current border-t-transparent"></div>
      <span class="uppercase tracking-[0.2em] text-xs font-bold animate-pulse">{{ t.syncing }}</span>
    </div>

    <!-- SEO: section general que agrupa los artículos (obras) -->
    <section v-else-if="obrasFiltradas.length > 0" class="max-w-7xl mx-auto flex flex-col" aria-label="Catálogo de Obras de Arte">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mb-12">
        
        <!-- SEO: Cada tarjeta es un <article> con su itemscope de VisualArtwork -->
        <article 
          v-for="(obra, index) in obrasFiltradas" 
          :key="obra.id" 
          itemscope itemtype="https://schema.org/VisualArtwork"
          class="obra-card group bg-neutral-900/40 border border-white/5 rounded-2xl overflow-hidden hover:border-[#D4AF37]/50 hover:bg-neutral-900/80 hover:shadow-[0_10px_30px_rgba(212,175,55,0.1)] transition-all duration-500 flex flex-col relative"
        >
          
          <div class="absolute top-4 left-4 z-10 bg-black/70 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest">
            {{ obra.tipo === 'Escultura' ? t.sculptureLabel : t.paintingLabel }}
          </div>

          <figure class="relative aspect-square overflow-hidden bg-black/50">
            <!-- FIX NAVEGACIÓN BLINDADA: Swiper solo se renderiza si el componente está activo en el DOM -->
            <swiper
              v-if="componenteActivo"
              :modules="modules"
              :slides-per-view="1"
              :loop="obra.listaImagenes.length > 1"
              :autoplay="obra.listaImagenes.length > 1 ? { delay: 3500, disableOnInteraction: false } : false"
              effect="fade"
              class="w-full h-full"
            >
              <!-- FIX RENDIMIENTO: Iteramos sobre el array fijo en memoria sin generar funciones infinitas -->
              <swiper-slide v-for="(img, idx) in obra.listaImagenes" :key="idx" class="w-full h-full bg-neutral-950 overflow-hidden relative flex items-center justify-center">
                <img v-if="img !== 'sin-imagen'" :src="img" :alt="`${obtenerTitulo(obra)} - Venta de Arte en Medellín`" itemprop="image" :loading="index < 3 ? 'eager' : 'lazy'" :fetchpriority="index < 3 ? 'high' : 'auto'" decoding="async" class="w-full h-full object-cover object-center block transition-transform duration-1000 group-hover:scale-105">
                <div v-else class="w-full h-full flex items-center justify-center bg-neutral-900 text-neutral-600 text-xs uppercase tracking-widest">Sin Imagen</div>
              </swiper-slide>
            </swiper>
            <div class="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent opacity-90 pointer-events-none z-10"></div>
          </figure>

          <div class="p-6 flex-1 flex flex-col relative z-20 -mt-16">
            <div class="text-center mb-6">
              <h3 itemprop="name" class="text-2xl md:text-3xl font-serif text-white mb-2 group-hover:text-[#D4AF37] transition-colors lowercase capitalize drop-shadow-md line-clamp-2">
                {{ obtenerTitulo(obra) }}
              </h3>
              <p itemprop="creator" itemscope itemtype="https://schema.org/Person" class="text-neutral-300 text-sm italic lowercase capitalize">
                {{ t.by }} <span itemprop="name">{{ obra.autor }}</span>
              </p>
            </div>

            <div class="py-4 border-y border-white/10 mb-6 flex-1 flex flex-col justify-center bg-black/20 rounded-xl px-4">
              <div class="grid grid-cols-2 gap-4 items-start">
                
                <div class="text-left pr-2">
                  <span class="text-[9px] uppercase text-[#D4AF37] tracking-[0.2em] font-bold block mb-1">{{ t.techniqueLabel }}</span>
                  <p itemprop="artMedium" class="text-xs text-neutral-300 font-medium line-clamp-2 leading-relaxed capitalize">
                    {{ obtenerTecnica(obra) }}
                  </p>
                </div>
                
                <div class="text-left border-l border-white/10 pl-4">
                  <span class="text-[9px] uppercase text-[#D4AF37] tracking-[0.2em] font-bold block mb-1">{{ t.dimensionsLabel }}</span>
                  <p itemprop="artDimensions" class="text-xs text-neutral-300 font-medium line-clamp-2 leading-relaxed lowercase">{{ obra.medidas }}</p>
                </div>

              </div>
            </div>

            <div class="mt-auto flex items-center justify-between">
              <!-- SEO: itemprop="offers" oculto pero válido para Google. PRECIO CON PUNTO DE MILES -->
              <span itemprop="offers" itemscope itemtype="https://schema.org/Offer" class="text-xl md:text-2xl font-serif text-white tracking-wider flex items-baseline">
                <meta itemprop="priceCurrency" content="USD" />
                <meta itemprop="price" :content="isNaN(obra.precio) ? '0' : String(obra.precio).replace(/[^0-9.]/g, '')" />
                {{ isNaN(obra.precio) ? obra.precio : '$' + Number(obra.precio).toLocaleString('es-CO') }}
                <span class="text-[10px] text-neutral-500 ml-1 font-sans font-bold uppercase tracking-widest">USD</span>
              </span>

              <router-link 
                :to="'/DetalleObra/' + obra.id" 
                class="flex items-center justify-center px-6 py-3 border border-white/20 bg-white/5 text-white rounded-full hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-black transition-all duration-300 shadow-lg"
              >
                <span class="text-[10px] font-bold uppercase tracking-widest leading-none">{{ t.detailsBtn }}</span>
              </router-link>
            </div>
          </div>
        </article>
      </div>

      <div v-if="hayMasObras" class="w-full flex justify-center pb-8">
        <button @click="cargarMasObras" :disabled="cargandoMas" class="group flex flex-col items-center justify-center px-10 py-4 bg-transparent border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black rounded-full transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-[0_0_20px_rgba(212,175,55,0.05)] hover:shadow-[0_0_30px_rgba(212,175,55,0.3)]">
          <span v-if="cargandoMas" class="flex items-center gap-3">
            <div class="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
            <span class="text-xs uppercase tracking-widest font-bold">{{ t.loading }}</span>
          </span>
          <span v-else class="text-xs font-bold uppercase tracking-widest transition-transform group-hover:scale-105">
            {{ t.loadMore }}
          </span>
        </button>
      </div>
    </section>

    <div v-else class="max-w-7xl mx-auto text-center py-32 space-y-4">
      <div class="text-4xl mb-4 opacity-50">🖼️</div>
      <p class="text-neutral-400 font-serif text-xl italic">{{ t.noResults }}</p>
      <button @click="limpiarBusqueda" class="text-[#D4AF37] hover:text-white uppercase tracking-widest text-xs font-bold mt-4 transition-colors">Ver todas las obras</button>
    </div>

  </main>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import Navbar from '../components/Navbar.vue' 
import { supabase, searchQuery, idiomaGlobal } from '../lib/supabase'

import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
const modules = [Autoplay, EffectFade];

// FIX: Flag reactivo que apaga Swiper antes de que Vue Router desmonte la página
const componenteActivo = ref(true)

const traducciones = {
  es: { seoTitle: 'Galería de Arte', seoSubtitle: 'Exposiciones, Museo y Venta de Obras en Medellín', filterAll: 'Todas', filterPaintings: 'Pinturas', filterSculptures: 'Esculturas', filteringBy: 'Filtrando por:', clearFilter: 'Quitar Filtro', syncing: 'Sincronizando galería...', paintingLabel: 'Pintura', sculptureLabel: 'Escultura', by: 'Por', techniqueLabel: 'Técnica', dimensionsLabel: 'Medidas', detailsBtn: 'Ver detalles', loadMore: 'Descubrir más obras', loading: 'Cargando...', noResults: 'No encontramos obras con estos parámetros.' },
  en: { seoTitle: 'Art Gallery', seoSubtitle: 'Exhibitions, Museum and Art Sales in Medellin', filterAll: 'All', filterPaintings: 'Paintings', filterSculptures: 'Sculptures', filteringBy: 'Filtering by:', clearFilter: 'Clear Filter', syncing: 'Syncing gallery...', paintingLabel: 'Painting', sculptureLabel: 'Sculpture', by: 'By', techniqueLabel: 'Technique', dimensionsLabel: 'Dimensions', detailsBtn: 'View details', loadMore: 'Discover more artworks', loading: 'Loading...', noResults: 'No artworks found matching these parameters.' },
  fr: { seoTitle: 'Galerie d\'Art', seoSubtitle: 'Expositions, Musée et Vente d\'Art à Medellín', filterAll: 'Toutes', filterPaintings: 'Peintures', filterSculptures: 'Sculptures', filteringBy: 'Filtrage par:', clearFilter: 'Effacer le filtre', syncing: 'Synchronisation...', paintingLabel: 'Peinture', sculptureLabel: 'Sculpture', by: 'Par', techniqueLabel: 'Technique', dimensionsLabel: 'Dimensions', detailsBtn: 'Voir les détails', loadMore: 'Découvrir plus d\'œuvres', loading: 'Chargement...', noResults: 'Aucune œuvre trouvée.' },
  ja: { seoTitle: 'アートギャラリー', seoSubtitle: 'メデジンの展覧会、美術館、アート販売', filterAll: 'すべて', filterPaintings: '絵画', filterSculptures: '彫刻', filteringBy: 'フィルター:', clearFilter: 'フィルター解除', syncing: 'ギャラリーを同期中...', paintingLabel: '絵画', sculptureLabel: '彫刻', by: '作', techniqueLabel: '手法', dimensionsLabel: '寸法', detailsBtn: '詳細を見る', loadMore: 'もっと作品を見る', loading: '読み込み中...', noResults: '条件に一致する作品はありません。' }
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

// === INYECCIÓN SEO MAESTRA ===
const inyectarSEO = () => {
  document.title = "Galerías de Arte en Medellín | Venta de Obras y Museo | Palacio Nacional";
  
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.name = "description";
    document.head.appendChild(metaDesc);
  }
  metaDesc.content = "Descubre la mejor galería de arte en Medellín en el Palacio Nacional. Venta de obras de arte, pinturas, esculturas y exposiciones en un museo histórico.";

  let canonical = document.querySelector("link[rel='canonical']");
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  canonical.setAttribute("href", "https://palacionacionalmedellin.com/exposiciones");

  const schemaData = {
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
    },
    "keywords": "galerias de arte en medellin, museos de arte, venta de obras de arte, galeria palacio nacional"
  };

  const scriptId = 'schema-exposiciones';
  const existingScript = document.getElementById(scriptId);
  if (existingScript) existingScript.remove();

  const script = document.createElement('script');
  script.id = scriptId;
  script.setAttribute('type', 'application/ld+json');
  script.textContent = JSON.stringify(schemaData);
  document.head.appendChild(script);
}

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
      // FIX CRITICO: Pre-procesamos las imágenes de antemano para no generar arrays infinitos al navegar
      const obrasProcesadas = data.map(o => {
        const imgs = [o.imagen_1, o.imagen_2, o.imagen_3].filter(Boolean);
        return {
          ...o,
          listaImagenes: imgs.length > 0 ? imgs : ['sin-imagen']
        };
      });

      if (esCargaInicial) {
        todasLasObras.value = obrasProcesadas
      } else {
        todasLasObras.value = [...todasLasObras.value, ...obrasProcesadas]
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

onMounted(() => {
  componenteActivo.value = true
  window.scrollTo({ top: 0, behavior: 'instant' })
  inyectarSEO()
  fetchObras(true)
})

// FIX BLINDAJE: Al salir de la ruta, apagamos Swiper limpiamente antes de que el router destruya el DOM
onBeforeUnmount(() => {
  componenteActivo.value = false
})

const obrasFiltradas = computed(() => todasLasObras.value)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');

.font-serif {
  font-family: 'Playfair Display', serif;
}

/* ESTILOS: Animación de entrada en cascada para las tarjetas */
.obra-card {
  animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
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
    transform: translateY(40px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

/* RENDIMIENTO & FIX DE SOLAPAMIENTO DE IMÁGENES: Aislamiento GPU para evitar superposición */
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
</style>