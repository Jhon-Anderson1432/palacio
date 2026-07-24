<template>
  <nav 
    :class="[
      'fixed top-0 left-0 w-full z-50 backdrop-blur-xl border-b border-white/10 px-4 md:px-12 py-3 transition-all duration-500 ease-in-out', 
      fondoTranslucido ? 'bg-black/20 shadow-none' : 'bg-black/85 shadow-[0_4px_30px_rgba(0,0,0,0.6)]'
    ]"
    role="navigation"
    aria-label="Navegación Principal"
  >
    <div class="max-w-7xl mx-auto flex items-center justify-between gap-4 md:grid md:grid-cols-3 md:gap-0">
      
      <div class="flex-shrink-0 flex items-center md:justify-start">
        <NuxtLink 
          v-if="!ocultarBotonVolver"
          :to="rutaVolver" 
          class="group flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 bg-black/40 border border-[#D4AF37]/30 rounded-full text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all duration-500 uppercase tracking-widest text-[10px] font-bold shadow-[0_0_10px_rgba(212,175,55,0.05)] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
          :aria-label="t.back"
        >
          <svg class="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          <span class="hidden md:inline antialiased">{{ t.back }}</span>
        </NuxtLink>
      </div>

      <div class="flex-1 md:w-full flex justify-center">
        <div v-if="!ocultarBuscador" class="relative group w-full max-w-md md:max-w-2xl">
          <input 
            v-model="searchQuery"
            type="text" 
            :placeholder="t.search" 
            class="w-full bg-white/5 border border-white/20 rounded-full py-2.5 md:py-3 px-5 text-white text-xs md:text-sm outline-none transition-all duration-300 focus:bg-white/10 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 placeholder:text-neutral-500 font-light tracking-wide antialiased shadow-inner"
          />
          <span 
            class="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 group-focus-within:opacity-100 group-focus-within:text-[#D4AF37] transition-all text-sm md:text-base select-none"
            aria-hidden="true"
          >
            🔍
          </span>
        </div>
      </div>

      <div class="flex-shrink-0 flex justify-end">
        <div class="relative">
          <button 
            @click="dropdownAbierto = !dropdownAbierto"
            class="flex items-center gap-2 px-3 md:px-4 py-2 bg-black/50 border border-white/10 rounded-full text-[#D4AF37] hover:border-[#D4AF37]/50 transition-colors uppercase tracking-widest text-[10px] font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
            :aria-expanded="dropdownAbierto"
            aria-haspopup="true"
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
              class="absolute right-0 mt-2 w-32 bg-black/95 backdrop-blur-xl border border-[#D4AF37]/20 rounded-lg shadow-[0_15px_40px_rgba(0,0,0,0.8)] overflow-hidden py-1 z-50 origin-top-right transition-all"
            >
              <button @click="cambiarIdioma('es')" :class="['w-full text-left px-4 py-3 text-[10px] uppercase tracking-widest font-bold transition-colors antialiased focus:outline-none', idiomaGlobal === 'es' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'text-neutral-400 hover:bg-white/5 hover:text-white']">Español</button>
              <button @click="cambiarIdioma('en')" :class="['w-full text-left px-4 py-3 text-[10px] uppercase tracking-widest font-bold transition-colors border-t border-white/5 antialiased focus:outline-none', idiomaGlobal === 'en' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'text-neutral-400 hover:bg-white/5 hover:text-white']">English</button>
              <button @click="cambiarIdioma('fr')" :class="['w-full text-left px-4 py-3 text-[10px] uppercase tracking-widest font-bold transition-colors border-t border-white/5 antialiased focus:outline-none', idiomaGlobal === 'fr' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'text-neutral-400 hover:bg-white/5 hover:text-white']">Français</button>
              <button @click="cambiarIdioma('ja')" :class="['w-full text-left px-4 py-3 text-[10px] uppercase tracking-widest font-bold transition-colors border-t border-white/5 antialiased focus:outline-none', idiomaGlobal === 'ja' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'text-neutral-400 hover:bg-white/5 hover:text-white']">日本語 (JA)</button>
            </div>
          </transition>
        </div>
      </div>

    </div>
  </nav>
</template>

<script setup>
// ESTADOS GLOBALES SEGUROS SSR (Reemplazo del antiguo archivo supabase.js)
const searchQuery = useState('searchQuery', () => '')
const idiomaGlobal = useState('idiomaGlobal', () => 'es')

// INYECCIÓN DE ENRUTAMIENTO NATIVO NUXT
const route = useRoute()
const dropdownAbierto = ref(false)

// PROPS
defineProps({
  ocultarBuscador: {
    type: Boolean,
    default: false
  },
  ocultarBotonVolver: { 
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

// CONSTANTES ESTÁTICAS DE RENDIMIENTO
const NOMBRES_IDIOMAS = { es: 'Español', en: 'English', fr: 'Français', ja: '日本語' }

const TRADUCCIONES = {
  es: { back: 'Volver', search: 'Buscar obras, autores...' },
  en: { back: 'Back', search: 'Search artworks, artists...' },
  fr: { back: 'Retour', search: 'Rechercher des œuvres...' },
  ja: { back: '戻る', search: '作品、アーティストを検索...' }
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

// ACCIONES
const cambiarIdioma = (nuevoIdioma) => {
  idiomaGlobal.value = nuevoIdioma
  dropdownAbierto.value = false
}

// COMPUTADOS
const nombreIdiomaActual = computed(() => NOMBRES_IDIOMAS[idiomaGlobal.value] || 'Español')
const t = computed(() => TRADUCCIONES[idiomaGlobal.value] || TRADUCCIONES.es)

// ==========================================
// PILLAR SEO: Inyección Dinámica Server-Side (Nuxt 3)
// ==========================================
// useHead observa reactivamente la ruta. Si cambia, inyecta la meta data instantáneamente.
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

.group:focus-within input {
  border-color: rgba(212, 175, 55, 1);
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
</style>