<template>
  <nav 
    :class="[
      'fixed top-0 left-0 w-full z-50 border-b border-white/10 px-4 md:px-8 lg:px-12 py-3 transition-all duration-300 ease-in-out', 
      menuMovilAbierto 
        ? 'bg-black shadow-[0_4px_30px_rgba(0,0,0,1)]' 
        : (fondoTranslucido ? 'bg-black/30 backdrop-blur-xl shadow-none' : 'bg-black/90 backdrop-blur-xl shadow-[0_4px_30px_rgba(0,0,0,0.7)]')
    ]"
    role="navigation"
    aria-label="Navegación Principal"
  >
    <div class="max-w-7xl mx-auto flex items-center justify-between gap-4">
      
      <!-- LOGO / INICIO -->
      <div class="flex items-center gap-3 flex-shrink-0">
        <!-- Botón volver contextual (solo si se especifica explícitamente en vistas profundas como DetalleObra) -->
        <NuxtLink 
          v-if="mostrarBotonVolver || (!ocultarBotonVolver && rutaVolver !== '/')"
          :to="rutaVolver" 
          class="group flex items-center gap-1.5 px-3 py-1.5 bg-black/50 border border-[#D4AF37]/30 rounded-full text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all duration-300 uppercase tracking-widest text-[9px] font-bold mr-1 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          :aria-label="t.back"
        >
          <svg class="w-3.5 h-3.5 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          <span class="hidden sm:inline antialiased">{{ t.back }}</span>
        </NuxtLink>

        <!-- Logo Palacio Nacional -->
        <NuxtLink 
          to="/" 
          class="flex items-center gap-2 group focus:outline-none"
          aria-label="Palacio Nacional Medellín - Inicio"
        >
          <NuxtImg 
            src="/logon.png" 
            alt="Logo Palacio Nacional Medellín" 
            class="h-8 md:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_15px_rgba(212,175,55,0.25)]" 
            loading="eager"
          />
        </NuxtLink>
      </div>

      <!-- ENLACES DE NAVEGACIÓN DESKTOP (lg+) -->
      <div class="hidden lg:flex items-center gap-1 xl:gap-2">
        <NuxtLink 
          v-for="item in navItems" 
          :key="item.path" 
          :to="item.path"
          :class="[
            'nav-link px-3 xl:px-4 py-2 rounded-full text-[11px] uppercase tracking-[0.2em] font-medium transition-all duration-300 relative focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40',
            isRouteActive(item.path) 
              ? 'text-[#D4AF37] bg-white/[0.04] font-bold shadow-[0_0_15px_rgba(212,175,55,0.15)] border border-[#D4AF37]/30' 
              : 'text-neutral-300 hover:text-white hover:bg-white/[0.03]'
          ]"
        >
          <span>{{ item.label }}</span>
          <span 
            v-if="isRouteActive(item.path)" 
            class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#D4AF37] shadow-[0_0_8px_#D4AF37]"
            aria-hidden="true"
          ></span>
        </NuxtLink>
      </div>

      <!-- ACCIONES: IDIOMA + MENÚ MÓVIL -->
      <div class="flex items-center gap-2 md:gap-3 flex-shrink-0">

        <!-- Selector de Idioma -->
        <div class="relative">
          <button 
            @click="dropdownAbierto = !dropdownAbierto"
            class="flex items-center gap-1.5 px-3 py-1.5 md:py-2 bg-black/60 border border-white/15 hover:border-[#D4AF37]/60 rounded-full text-[#D4AF37] transition-all uppercase tracking-widest text-[10px] font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
            :aria-expanded="dropdownAbierto"
            aria-haspopup="true"
            aria-label="Seleccionar idioma"
          >
            <span class="antialiased">{{ nombreIdiomaActual }}</span>
            <svg 
              class="w-3 h-3 transition-transform duration-300" 
              :class="{ 'rotate-180': dropdownAbierto }" 
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          <transition name="dropdown-slide">
            <div 
              v-if="dropdownAbierto" 
              class="absolute right-0 mt-2 w-36 bg-black/95 backdrop-blur-2xl border border-[#D4AF37]/30 rounded-xl shadow-[0_15px_40px_rgba(0,0,0,0.9)] overflow-hidden py-1 z-50 origin-top-right transition-all"
            >
              <button 
                v-for="lang in listaIdiomas" 
                :key="lang.code"
                @click="cambiarIdioma(lang.code)" 
                :class="[
                  'w-full text-left px-4 py-2.5 text-[10px] uppercase tracking-widest font-bold transition-colors antialiased focus:outline-none flex items-center justify-between',
                  idiomaGlobal === lang.code 
                    ? 'bg-[#D4AF37]/15 text-[#D4AF37]' 
                    : 'text-neutral-400 hover:bg-white/5 hover:text-white'
                ]"
              >
                <span>{{ lang.label }}</span>
                <span v-if="idiomaGlobal === lang.code" class="text-xs">✓</span>
              </button>
            </div>
          </transition>
        </div>

        <!-- Botón Hamburguesa Móvil (lg:hidden) -->
        <button 
          @click="menuMovilAbierto = !menuMovilAbierto"
          class="lg:hidden p-2 rounded-lg bg-white/5 border border-white/10 hover:border-[#D4AF37]/50 text-white hover:text-[#D4AF37] transition-all focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
          :aria-expanded="menuMovilAbierto"
          aria-label="Abrir menú de navegación"
        >
          <!-- Ícono Hamburguesa / Cerrar -->
          <svg v-if="!menuMovilAbierto" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
          <svg v-else class="w-5 h-5 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

      </div>

    </div>

    <!-- OVERLAY OSCURO DETRÁS DEL MENÚ MÓVIL (para oscurecer la página y evitar transparencias) -->
    <transition name="fade">
      <div 
        v-if="menuMovilAbierto" 
        @click="menuMovilAbierto = false"
        class="lg:hidden fixed inset-0 top-[56px] bg-black/90 z-30"
        aria-hidden="true"
      ></div>
    </transition>

    <!-- MENÚ MÓVIL DESPLEGABLE (lg:hidden) - 100% SÓLIDO Y OPACO -->
    <transition name="mobile-menu">
      <div 
        v-if="menuMovilAbierto" 
        class="lg:hidden fixed inset-x-0 top-[56px] md:top-[64px] bg-[#0c0c0c] border-b-2 border-[#D4AF37]/60 shadow-[0_30px_70px_rgba(0,0,0,1)] z-40 px-5 py-6 flex flex-col gap-2.5 max-h-[calc(100vh-56px)] overflow-y-auto"
      >

        <!-- Enlaces de navegación móvil (Tarjetas sólidas de alto contraste) -->
        <NuxtLink 
          v-for="item in navItems" 
          :key="item.path" 
          :to="item.path"
          @click="menuMovilAbierto = false"
          :class="[
            'flex items-center justify-between px-5 py-3.5 rounded-xl text-xs uppercase tracking-[0.2em] transition-all duration-200 border',
            isRouteActive(item.path) 
              ? 'text-black bg-[#D4AF37] border-[#D4AF37] font-bold shadow-[0_0_20px_rgba(212,175,55,0.4)]' 
              : 'text-white bg-[#171717] border-white/10 hover:border-[#D4AF37]/60 hover:bg-[#222222] font-medium'
          ]"
        >
          <span>{{ item.label }}</span>
          <svg 
            class="w-4 h-4 transition-transform" 
            :class="isRouteActive(item.path) ? 'text-black' : 'text-[#D4AF37]'" 
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"></path>
          </svg>
        </NuxtLink>

        <!-- Pie del menú móvil -->
        <div class="pt-4 mt-2 border-t border-white/15 flex items-center justify-between text-neutral-400 text-[10px]">
          <span class="uppercase tracking-widest">Palacio Nacional Medellín</span>
          <span class="text-[#D4AF37] font-medium">1933</span>
        </div>
      </div>
    </transition>

  </nav>
</template>

<script setup>
// ESTADOS GLOBALES SEGUROS SSR
const searchQuery = useState('searchQuery', () => '')
const idiomaGlobal = useState('idiomaGlobal', () => 'es')

// INYECCIÓN DE ENRUTAMIENTO NATIVO NUXT
const route = useRoute()
const dropdownAbierto = ref(false)
const menuMovilAbierto = ref(false)

// Cerrar menú móvil al cambiar de ruta
watch(() => route.path, () => {
  menuMovilAbierto.value = false
  dropdownAbierto.value = false
})

// PROPS
defineProps({
  ocultarBuscador: {
    type: Boolean,
    default: true
  },
  ocultarBotonVolver: { 
    type: Boolean,
    default: true
  },
  mostrarBotonVolver: { 
    type: Boolean,
    default: false
  },
  rutaVolver: {
    type: String,
    default: '/'
  },
  fondoTranslucido: { 
    type: Boolean,
    default: false
  }
})

// CONSTANTES ESTÁTICAS DE IDIOMAS
const NOMBRES_IDIOMAS = { es: 'ES', en: 'EN', fr: 'FR', ja: 'JA' }

const listaIdiomas = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'ja', label: '日本語' }
]

const TRADUCCIONES = {
  es: { 
    back: 'Volver', 
    search: 'Buscar obras, autores...',
    home: 'Inicio',
    gallery: 'Galería',
    gastro: 'Gastronomía',
    history: 'Historia',
    locations: 'Sedes',
    contact: 'Contactos'
  },
  en: { 
    back: 'Back', 
    search: 'Search artworks, artists...',
    home: 'Home',
    gallery: 'Gallery',
    gastro: 'Gastronomy',
    history: 'History',
    locations: 'Locations',
    contact: 'Contacts'
  },
  fr: { 
    back: 'Retour', 
    search: 'Rechercher des œuvres...',
    home: 'Accueil',
    gallery: 'Galerie',
    gastro: 'Gastronomie',
    history: 'Histoire',
    locations: 'Sites',
    contact: 'Contacts'
  },
  ja: { 
    back: '戻る', 
    search: '作品、アーティストを検索...',
    home: 'ホーム',
    gallery: 'ギャラリー',
    gastro: 'ガストロノミー',
    history: '歴史',
    locations: '拠点',
    contact: '連絡先'
  }
}

const METADATOS_SEO = {
  'home': {
    es: { title: "Palacio Nacional Medellín | Centro Histórico y Gastronomía", desc: "Explora la joya arquitectónica del centro de Medellín. Arte, historia y la mejor gastronomía en un solo lugar." }
  },
  'exposiciones': {
    es: { title: "Galerías de Arte Palacio Nacional | Exposiciones en Medellín", desc: "Visita nuestras salas de exposición permanente y temporal. Un viaje a través del arte local e internacional." }
  },
  'sky-bar': {
    es: { title: "Sky Bar Café | Terraza Bar en el Palacio Nacional", desc: "Disfruta de cócteles de autor, cafés premium y la mejor vista diurna del centro de Medellín en el piso 5." }
  },
  'chao-pescado': {
    es: { title: "Chao Pescao | Restaurante en el Centro de Medellín", desc: "El verdadero sabor del mar y platos ejecutivos de alta calidad en el piso 5 del Palacio Nacional." }
  },
  'chao-cafe': {
    es: { title: "Chao Café | Cafetería Artesanal en el Palacio Nacional", desc: "Bebidas calientes artesanales, repostería exclusiva y un espacio de tranquilidad en el corazón de Medellín." }
  }
}

// COMPUTADOS
const nombreIdiomaActual = computed(() => NOMBRES_IDIOMAS[idiomaGlobal.value] || 'ES')
const t = computed(() => TRADUCCIONES[idiomaGlobal.value] || TRADUCCIONES.es)

const navItems = computed(() => [
  { path: '/', label: t.value.home },
  { path: '/exposiciones', label: t.value.gallery },
  { path: '/homegastro', label: t.value.gastro },
  { path: '/historia', label: t.value.history },
  { path: '/proximamente', label: t.value.locations },
  { path: '/contactos', label: t.value.contact }
])

// Comprueba si la ruta está activa
const isRouteActive = (targetPath) => {
  if (targetPath === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(targetPath)
}

// ACCIONES
const cambiarIdioma = (nuevoIdioma) => {
  idiomaGlobal.value = nuevoIdioma
  dropdownAbierto.value = false
}

// ==========================================
// PILLAR SEO: Inyección Dinámica Server-Side (Nuxt 3)
// ==========================================
useHead(() => {
  const path = route.path
  let claveContexto = 'home'

  if (path.includes('exposiciones')) claveContexto = 'exposiciones'
  else if (path.includes('sky-bar')) claveContexto = 'sky-bar'
  else if (path.includes('chao-pescado')) claveContexto = 'chao-pescado'
  else if (path.includes('chao-cafe')) claveContexto = 'chao-cafe'

  const idiomaActual = idiomaGlobal.value === 'es' ? 'es' : 'es' // Fallback forzado a español por SEO Local
  const metaData = METADATOS_SEO[claveContexto]?.[idiomaActual] || METADATOS_SEO['home']['es']

  return {
    title: metaData.title,
    meta: [
      { name: 'description', content: metaData.desc }
    ]
  }
})
</script>

<style scoped>
.antialiased {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.dropdown-slide-enter-active {
  transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1), transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.dropdown-slide-leave-active {
  transition: opacity 0.15s cubic-bezier(0.7, 0, 0.84, 0), transform 0.15s cubic-bezier(0.7, 0, 0.84, 0);
}
.dropdown-slide-enter-from,
.dropdown-slide-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-8px);
}

.mobile-menu-enter-active {
  transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.mobile-menu-leave-active {
  transition: opacity 0.2s cubic-bezier(0.7, 0, 0.84, 0), transform 0.2s cubic-bezier(0.7, 0, 0.84, 0);
}
.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>