<template>
  <main class="min-h-screen bg-neutral-950 text-white pt-24 px-4 sm:px-6 pb-20 overflow-x-hidden selection:bg-[#D4AF37] selection:text-black">
    
    <!-- Navbar limpia e institucional (sin buscador en la barra) -->
    <Navbar />

    <!-- Encabezado de la Galería -->
    <GaleriaHeader :t="t" />

    <!-- Panel de Filtros Unificado -->
    <GaleriaFiltros
      v-model:searchQuery="searchQuery"
      v-model:filtroTipo="filtroTipo"
      v-model:filtroArtista="filtroArtista"
      v-model:filtroTecnica="filtroTecnica"
      v-model:filtroPrecio="filtroPrecio"
      v-model:busquedaArtistaTexto="busquedaArtistaTexto"
      :artistasFiltrados="artistasFiltrados"
      :listaTecnicas="listaTecnicas"
      :opcionesPrecio="opcionesPrecio"
      :etiquetaPrecioActual="etiquetaPrecioActual"
      :hayFiltrosActivos="hayFiltrosActivos"
      :totalResultados="obrasProcesadas.length"
      :t="t"
      @limpiarFiltros="limpiarTodosLosFiltros"
    />

    <!-- Indicador de carga SSR y Cliente -->
    <div v-if="status === 'pending'" class="flex flex-col items-center justify-center py-20 space-y-4 text-[#D4AF37]">
      <div class="animate-spin rounded-full h-10 w-10 border-2 border-current border-t-transparent"></div>
      <span class="uppercase tracking-[0.2em] text-xs font-bold animate-pulse">{{ t.syncing }}</span>
    </div>

    <!-- Catálogo de Obras Indexable por Google -->
    <section id="catalogo-obras" v-else-if="obrasFiltradas.length > 0" class="relative z-10 max-w-7xl mx-auto flex flex-col" aria-label="Catálogo de Obras de Arte">
      <GaleriaGrid
        :obras="obrasFiltradas"
        :componenteActivo="componenteActivo"
        :idiomaGlobal="idiomaGlobal"
        :t="t"
      />

      <!-- Sistema de Paginación Numérica -->
      <GaleriaPaginacion
        :paginaActual="paginaActual"
        :totalPaginas="totalPaginas"
        :paginasVisibles="paginasVisibles"
        :t="t"
        @cambiarPagina="irAPagina"
      />
    </section>

    <!-- Estado sin resultados -->
    <div v-else class="max-w-7xl mx-auto text-center py-28 space-y-4">
      <div class="text-5xl mb-4 opacity-40">🖼️</div>
      <p class="text-neutral-400 font-serif text-2xl italic">{{ t.noResults }}</p>
      <button 
        @click="limpiarTodosLosFiltros" 
        class="inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-black uppercase tracking-widest text-xs font-bold rounded-full mt-4 hover:bg-white transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)] focus:outline-none"
      >
        <span>Ver todas las obras</span>
      </button>
    </div>

  </main>
</template>

<script setup>
import GaleriaHeader from '~/components/galeria/GaleriaHeader.vue'
import GaleriaFiltros from '~/components/galeria/GaleriaFiltros.vue'
import GaleriaGrid from '~/components/galeria/GaleriaGrid.vue'
import GaleriaPaginacion from '~/components/galeria/GaleriaPaginacion.vue'

// === 1. SEO AGRESIVO Y FOCALIZADO ===
useSeoMeta({
  title: 'Galería de Arte Palacio Nacional | Exposiciones Medellín',
  description: 'Visita la Galería de Arte Palacio Nacional en Medellín. Disfruta de nuestras exposiciones, museo y venta de pinturas y esculturas de artistas locales e internacionales.',
  ogTitle: '🖼️ Galería de Arte Palacio Nacional | Medellín',
  ogDescription: 'Descubre el epicentro del arte en Medellín. Exposiciones, museo y obras exclusivas en el histórico Palacio Nacional. ¡Planifica tu visita y explora la colección!',
  ogImage: 'https://palacionacionalmedellin.com/logon.png',
  twitterCard: 'summary_large_image',
})

const route = useRoute();
const supabase = useSupabaseClient()
const idiomaGlobal = useState('idiomaGlobal', () => 'es')

const componenteActivo = ref(false)

// ESTADOS REACTIVOS DE FILTROS
const searchQuery = ref('')
const filtroTipo = ref('Todos')
const filtroArtista = ref('Todos')
const busquedaArtistaTexto = ref('')
const filtroTecnica = ref('Todos')
const filtroPrecio = ref('Todos')

const paginaActual = ref(1)
const limitePorPagina = 12

// === TRADUCCIONES EN 4 IDIOMAS ===
const traducciones = {
  es: { 
    seoTitle: 'Galería de Arte', 
    seoSubtitle: 'Exposiciones, Museo y Venta de Obras en Medellín',
    searchPlaceholder: 'Busca por título, artista o palabras clave...',
    categoryLabel: 'Colección',
    secondaryFiltersLabel: 'Filtrar por artista, técnica y precio',
    artistPlaceholder: 'Escribe o elige un artista...',
    allArtists: 'Todos los Artistas',
    noArtistsFound: 'No hay coincidencias',
    allTechniques: 'Todas las Técnicas',
    allPrices: 'Todos los Precios',
    filterAll: 'Todas', 
    filterPaintings: 'Pinturas', 
    filterSculptures: 'Esculturas', 
    clearFilter: 'Quitar Filtros', 
    syncing: 'Sincronizando galería...', 
    paintingLabel: 'Pintura', 
    sculptureLabel: 'Escultura', 
    by: 'Por', 
    techniqueLabel: 'Técnica', 
    dimensionsLabel: 'Medidas', 
    detailsBtn: 'Ver detalles', 
    noResults: 'No encontramos obras con estos parámetros.', 
    priceLow: 'Menos de $1,000 USD', 
    priceMed: '$1,000 - $5,000 USD', 
    priceHigh: 'Más de $5,000 USD', 
    prevPage: 'Anterior', 
    nextPage: 'Siguiente',
    resultsCount: 'obras encontradas'
  },
  en: { 
    seoTitle: 'Art Gallery', 
    seoSubtitle: 'Exhibitions, Museum and Art Sales in Medellin',
    searchPlaceholder: 'Search by title, artist or keywords...',
    categoryLabel: 'Collection',
    secondaryFiltersLabel: 'Filter by artist, technique and price',
    artistPlaceholder: 'Type or choose an artist...',
    allArtists: 'All Artists',
    noArtistsFound: 'No matches found',
    allTechniques: 'All Techniques',
    allPrices: 'All Prices',
    filterAll: 'All', 
    filterPaintings: 'Paintings', 
    filterSculptures: 'Sculptures', 
    clearFilter: 'Clear Filters', 
    syncing: 'Syncing gallery...', 
    paintingLabel: 'Painting', 
    sculptureLabel: 'Sculpture', 
    by: 'By', 
    techniqueLabel: 'Technique', 
    dimensionsLabel: 'Dimensions', 
    detailsBtn: 'View details', 
    noResults: 'No artworks found matching these parameters.', 
    priceLow: 'Under $1,000 USD', 
    priceMed: '$1,000 - $5,000 USD', 
    priceHigh: 'Over $5,000 USD', 
    prevPage: 'Previous', 
    nextPage: 'Next',
    resultsCount: 'artworks found'
  },
  fr: { 
    seoTitle: 'Galerie d\'Art', 
    seoSubtitle: 'Expositions, Musée et Vente d\'Art à Medellín',
    searchPlaceholder: 'Rechercher par titre, artiste ou mots-clés...',
    categoryLabel: 'Collection',
    secondaryFiltersLabel: 'Filtrer par artiste, technique et prix',
    artistPlaceholder: 'Tapez ou choisissez un artiste...',
    allArtists: 'Tous les Artistes',
    noArtistsFound: 'Aucune correspondance',
    allTechniques: 'Toutes les Techniques',
    allPrices: 'Tous les Prix',
    filterAll: 'Toutes', 
    filterPaintings: 'Peintures', 
    filterSculptures: 'Sculptures', 
    clearFilter: 'Effacer les filtres', 
    syncing: 'Synchronisation...', 
    paintingLabel: 'Peinture', 
    sculptureLabel: 'Sculpture', 
    by: 'Par', 
    techniqueLabel: 'Technique', 
    dimensionsLabel: 'Dimensions', 
    detailsBtn: 'Voir les détails', 
    noResults: 'Aucune œuvre trouvée.', 
    priceLow: 'Moins de 1 000 $ USD', 
    priceMed: '1 000 $ - 5 000 $ USD', 
    priceHigh: 'Plus de 5 000 $ USD', 
    prevPage: 'Précédent', 
    nextPage: 'Suivant',
    resultsCount: 'œuvres trouvées'
  },
  ja: { 
    seoTitle: 'アートギャラリー', 
    seoSubtitle: 'メデジンの展覧会、美術館、アート販売',
    searchPlaceholder: 'タイトル、アーティスト、キーワードで検索...',
    categoryLabel: 'コレクション',
    secondaryFiltersLabel: 'アーティスト、手法、価格で絞り込み',
    artistPlaceholder: 'アーティスト名を入力または選択...',
    allArtists: 'すべてのアーティスト',
    noArtistsFound: '一致するアーティストはいません',
    allTechniques: 'すべての手法',
    allPrices: 'すべての価格',
    filterAll: 'すべて', 
    filterPaintings: '絵画', 
    filterSculptures: '彫刻', 
    clearFilter: 'フィルター解除', 
    syncing: 'ギャラリーを同期中...', 
    paintingLabel: '絵画', 
    sculptureLabel: '彫刻', 
    by: '作', 
    techniqueLabel: '手法', 
    dimensionsLabel: '寸法', 
    detailsBtn: '詳細を見る', 
    noResults: '条件に一致する作品はありません。', 
    priceLow: '1,000 USD未満', 
    priceMed: '1,000 - 5,000 USD', 
    priceHigh: '5,000 USD以上', 
    prevPage: '前へ', 
    nextPage: '次へ',
    resultsCount: '件の作品'
  }
}

const t = computed(() => traducciones[idiomaGlobal.value] || traducciones['es'])

// === 2. FETCH SSR: DATOS DESDE SUPABASE ===
const { data: obrasData, status } = await useAsyncData('obras-galeria', async () => {
  try {
    const { data, error } = await supabase
      .from('obras')
      .select('id, titulo, titulo_en, titulo_fr, titulo_ja, autor, tecnica, medidas, precio, tipo, imagen_1, imagen_2, imagen_3')
      .order('titulo', { ascending: true })
    
    if (error) {
      console.error('Error cargando galería:', error.message)
      return []
    }
    return data || []
  } catch (err) {
    console.error('Excepción cargando galería:', err)
    return []
  }
})

// === 3. LISTAS DERIVADAS PARA LOS SELECTORES ===
const listaArtistas = computed(() => {
  if (!obrasData.value) return []
  const autores = [...new Set(obrasData.value.map(o => o.autor).filter(a => a && a.trim() !== ''))]
  return autores.sort((a, b) => a.localeCompare(b))
})

const artistasFiltrados = computed(() => {
  const q = busquedaArtistaTexto.value.toLowerCase().trim()
  if (!q) return listaArtistas.value
  return listaArtistas.value.filter(a => a.toLowerCase().includes(q))
})

const listaTecnicas = computed(() => {
  if (!obrasData.value) return []
  const tecnicas = [...new Set(obrasData.value.map(o => o.tecnica).filter(t => t && t.trim() !== ''))]
  return tecnicas.sort((a, b) => a.localeCompare(b))
})

const opcionesPrecio = computed(() => [
  { valor: 'Todos', label: t.value.allPrices },
  { valor: 'bajo', label: t.value.priceLow },
  { valor: 'medio', label: t.value.priceMed },
  { valor: 'alto', label: t.value.priceHigh }
])

const etiquetaPrecioActual = computed(() => {
  const opc = opcionesPrecio.value.find(o => o.valor === filtroPrecio.value)
  return opc ? opc.label : t.value.allPrices
})

const hayFiltrosActivos = computed(() => {
  return (
    (searchQuery.value && searchQuery.value.trim() !== '') ||
    filtroTipo.value !== 'Todos' ||
    filtroArtista.value !== 'Todos' ||
    filtroTecnica.value !== 'Todos' ||
    filtroPrecio.value !== 'Todos'
  )
})

const limpiarTodosLosFiltros = () => {
  searchQuery.value = ''
  filtroTipo.value = 'Todos'
  filtroArtista.value = 'Todos'
  busquedaArtistaTexto.value = ''
  filtroTecnica.value = 'Todos'
  filtroPrecio.value = 'Todos'
  paginaActual.value = 1
}

// === 4. LÓGICA DE FILTRADO MULTIDIMENSIONAL ===
const obrasProcesadas = computed(() => {
  if (!obrasData.value) return []
  let filtradas = obrasData.value

  if (filtroTipo.value !== 'Todos') {
    filtradas = filtradas.filter(o => o.tipo === filtroTipo.value)
  }

  if (filtroArtista.value !== 'Todos') {
    filtradas = filtradas.filter(o => o.autor === filtroArtista.value)
  }

  if (filtroTecnica.value !== 'Todos') {
    filtradas = filtradas.filter(o => o.tecnica === filtroTecnica.value)
  }

  if (filtroPrecio.value !== 'Todos') {
    filtradas = filtradas.filter(o => {
      const precioNumerico = Number(String(o.precio).replace(/[^0-9.]/g, ''))
      if (filtroPrecio.value === 'bajo') return precioNumerico < 1000
      if (filtroPrecio.value === 'medio') return precioNumerico >= 1000 && precioNumerico <= 5000
      if (filtroPrecio.value === 'alto') return precioNumerico > 5000
      return true
    })
  }

  if (searchQuery.value && searchQuery.value.trim() !== '') {
    const term = searchQuery.value.toLowerCase().trim()
    filtradas = filtradas.filter(o => 
      o.titulo?.toLowerCase().includes(term) || 
      o.autor?.toLowerCase().includes(term) || 
      o.tecnica?.toLowerCase().includes(term) ||
      o.titulo_en?.toLowerCase().includes(term)
    )
  }

  return [...filtradas].sort((a, b) => (a.titulo || '').localeCompare(b.titulo || '', 'es', { sensitivity: 'base' }))
})

// === 5. PAGINACIÓN NUMÉRICA CON SALTO (1 2 3 ... n) ===
const totalPaginas = computed(() => Math.ceil(obrasProcesadas.value.length / limitePorPagina) || 1)

const paginasVisibles = computed(() => {
  const total = totalPaginas.value
  const actual = paginaActual.value

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const paginas = []
  const delta = 1
  const izquierda = Math.max(2, actual - delta)
  const derecha = Math.min(total - 1, actual + delta)

  paginas.push(1)
  if (izquierda > 2) paginas.push('...')
  for (let i = izquierda; i <= derecha; i++) paginas.push(i)
  if (derecha < total - 1) paginas.push('...')
  paginas.push(total)

  return paginas
})

const obrasFiltradas = computed(() => {
  const inicio = (paginaActual.value - 1) * limitePorPagina
  const paginaItems = obrasProcesadas.value.slice(inicio, inicio + limitePorPagina)
  return paginaItems.map(o => {
    const imgs = [o.imagen_1, o.imagen_2, o.imagen_3].filter(Boolean)
    return { ...o, listaImagenes: imgs.length > 0 ? imgs : ['sin-imagen'] }
  })
})

watch([filtroTipo, filtroArtista, filtroTecnica, filtroPrecio, searchQuery], () => {
  paginaActual.value = 1
})

let animacionScrollId = null

const scrollSuaveArriba = () => {
  if (!import.meta.client) return

  const inicio = window.scrollY || window.pageYOffset
  const catalogoEl = document.getElementById('catalogo-obras')
  const fin = catalogoEl 
    ? Math.max(0, catalogoEl.getBoundingClientRect().top + inicio - 95)
    : 0

  const distancia = fin - inicio
  if (Math.abs(distancia) < 15) return

  const duracion = 950
  let inicioTiempo = null

  const limpiarEventos = () => {
    window.removeEventListener('wheel', interrumpir)
    window.removeEventListener('touchmove', interrumpir)
  }

  const interrumpir = () => {
    if (animacionScrollId) cancelAnimationFrame(animacionScrollId)
    limpiarEventos()
  }

  window.addEventListener('wheel', interrumpir, { passive: true, once: true })
  window.addEventListener('touchmove', interrumpir, { passive: true, once: true })

  const animar = (tiempoActual) => {
    if (!inicioTiempo) inicioTiempo = tiempoActual
    const transcurrido = tiempoActual - inicioTiempo
    const progreso = Math.min(transcurrido / duracion, 1)

    const ease = progreso < 0.5
      ? 4 * progreso * progreso * progreso
      : 1 - Math.pow(-2 * progreso + 2, 3) / 2

    window.scrollTo(0, inicio + distancia * ease)

    if (progreso < 1) {
      animacionScrollId = requestAnimationFrame(animar)
    } else {
      limpiarEventos()
    }
  }

  animacionScrollId = requestAnimationFrame(animar)
}

const irAPagina = (nuevaPagina) => {
  if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas.value && nuevaPagina !== paginaActual.value) {
    paginaActual.value = nuevaPagina
    scrollSuaveArriba()
  }
}

// === 6. METADATOS Y SCHEMA SEO ===
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
        "description": "Galería de arte, museo y venta de pinturas y esculturas exclusivas en Medellín.",
        "url": "https://palacionacionalmedellin.com/exposiciones",
        "image": "https://palacionacionalmedellin.com/logon.png",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Carrera 52 # 48-45",
          "addressLocality": "Medellín",
          "addressRegion": "Antioquia",
          "addressCountry": "CO"
        }
      })
    }
  ]
})

onMounted(() => {
  componenteActivo.value = true
  if (import.meta.client && route && !route.hash) {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }
})

onBeforeUnmount(() => {
  componenteActivo.value = false
})

definePageMeta({
  layout: false 
})
</script>

<style>
html {
  scroll-behavior: smooth;
}
</style>
