<template>
  <main class="min-h-screen w-full bg-black text-[#D4AF37] font-sans flex flex-col items-center justify-center relative overflow-hidden selection:bg-[#D4AF37] selection:text-black">
    
    <div class="absolute top-6 left-6 z-50">
      <button 
        @click="toggleDropdown"
        class="flex items-center gap-2 px-4 py-2 border border-[#D4AF37]/20 rounded-full bg-black/40 backdrop-blur-md text-[#D4AF37]/80 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all duration-300"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span class="text-sm font-medium tracking-wider uppercase">{{ idiomaGlobal }}</span>
        <svg class="w-4 h-4 transition-transform duration-300" :class="{ 'rotate-180': dropdownOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>

      <transition name="fade-down">
        <div v-if="dropdownOpen" class="absolute top-full left-0 mt-3 w-40 bg-[#0a0a0a]/95 backdrop-blur-xl border border-[#D4AF37]/20 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden">
          <button 
            v-for="lang in idiomas" 
            :key="lang.code"
            @click="seleccionarIdioma(lang.code)"
            class="w-full text-left px-5 py-3 text-sm text-gray-400 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] transition-colors duration-200 border-b border-white/5 last:border-none"
            :class="{ 'text-[#D4AF37] bg-[#D4AF37]/5': idiomaGlobal === lang.code }"
          >
            {{ lang.label }}
          </button>
        </div>
      </transition>
    </div>

    <button 
      @click="router.push('/')" 
      class="absolute top-6 right-6 z-50 p-2 border border-[#D4AF37]/20 rounded-full text-[#D4AF37]/50 hover:text-[#D4AF37] hover:border-[#D4AF37] hover:scale-110 transition-all duration-300"
      title="Volver al Palacio"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>

    <div class="w-full max-w-7xl px-6 py-16 flex flex-col items-center z-10">
      
      <header class="text-center mb-16 md:mb-24 flex flex-col items-center">
        <img 
          :src="logoPalacio" 
          alt="Palacio Nacional" 
          class="w-48 md:w-64 mb-6 object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]"
        />
        
        <div class="flex items-center gap-4 mb-4">
          <div class="h-px w-16 bg-[#D4AF37]/30"></div>
          <p class="text-[11px] md:text-xs tracking-[0.4em] text-gray-500 uppercase font-medium">
            {{ t.subtitulo }}
          </p>
          <div class="h-px w-16 bg-[#D4AF37]/30"></div>
        </div>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 w-full">
        
        <button 
          @click="navegarA('gastronomia/chao-cafe')" 
          class="group flex flex-col items-center justify-center p-8 md:p-12 border border-[#D4AF37]/30 bg-black rounded-3xl transition-all duration-500 hover:border-[#D4AF37] hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(212,175,55,0.3)] cursor-pointer"
        >
          <div class="w-28 h-28 md:w-36 md:h-36 mb-8 rounded-full border border-[#D4AF37]/20 bg-[#050505] p-3 flex items-center justify-center shadow-inner group-hover:border-[#D4AF37]/60 transition-colors duration-500">
            <img :src="logoCafe" alt="Chao Cafe Logo" class="w-full h-full object-contain" />
          </div>
          
          <h2 class="text-2xl md:text-3xl font-serif tracking-[0.15em] uppercase text-white group-hover:text-[#D4AF37] transition-colors">
            Chao Cafe
          </h2>
          <p class="text-xs tracking-[0.2em] text-gray-500 mt-2.5 uppercase font-light group-hover:text-gray-300">
            {{ t.descCafe }}
          </p>
        </button>

        <button 
          @click="navegarA('gastronomia/chao-pescado')" 
          class="group flex flex-col items-center justify-center p-8 md:p-12 border border-[#D4AF37]/30 bg-black rounded-3xl transition-all duration-500 hover:border-[#D4AF37] hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(212,175,55,0.3)] cursor-pointer"
        >
          <div class="w-28 h-28 md:w-36 md:h-36 mb-8 rounded-full border border-[#D4AF37]/20 bg-[#050505] p-3 flex items-center justify-center shadow-inner group-hover:border-[#D4AF37]/60 transition-colors duration-500">
            <img :src="logoPescado" alt="Chao Pescado Logo" class="w-full h-full object-contain" />
          </div>
          
          <h2 class="text-2xl md:text-3xl font-serif tracking-[0.15em] uppercase text-white group-hover:text-[#D4AF37] transition-colors">
            Chao Pescao
          </h2>
          <p class="text-xs tracking-[0.2em] text-gray-500 mt-2.5 uppercase font-light group-hover:text-gray-300">
            {{ t.descPescado }}
          </p>
        </button>

        <button 
          @click="navegarA('gastronomia/sky-bar')" 
          class="group flex flex-col items-center justify-center p-8 md:p-12 border border-[#D4AF37]/30 bg-black rounded-3xl transition-all duration-500 hover:border-[#D4AF37] hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(212,175,55,0.3)] cursor-pointer"
        >
          <div class="w-28 h-28 md:w-36 md:h-36 mb-8 rounded-full border border-[#D4AF37]/20 bg-[#050505] p-3 flex items-center justify-center shadow-inner group-hover:border-[#D4AF37]/60 transition-colors duration-500">
            <img :src="logoSky" alt="Sky Bar Logo" class="w-full h-full object-contain" />
          </div>
          
          <h2 class="text-2xl md:text-3xl font-serif tracking-[0.15em] uppercase text-white group-hover:text-[#D4AF37] transition-colors">
            Sky Bar
          </h2>
          <p class="text-xs tracking-[0.2em] text-gray-500 mt-2.5 uppercase font-light group-hover:text-gray-300">
            {{ t.descSky }}
          </p>
        </button>

      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { idiomaGlobal } from '../../lib/supabase' // Importamos el estado global de tu proyecto

// Importación de todos los logos necesarios
import logoPalacio from '@/assets/logon.png' 
import logoCafe from '@/assets/logonc.png'
import logoPescado from '@/assets/logonp.png'
import logoSky from '@/assets/logons.png'

const router = useRouter()

// ==========================================
// INYECCIÓN DE SEO (HOME GASTRO)
// ==========================================
onMounted(() => {
  // 1. Cambiar el título de la pestaña
  document.title = "Café, Restaurante y Bar en Medellín | Palacio Nacional"
  
  // 2. Buscar o crear la etiqueta <meta name="description">
  let metaDescription = document.querySelector('meta[name="description"]')
  if (!metaDescription) {
    metaDescription = document.createElement('meta')
    metaDescription.name = "description"
    document.head.appendChild(metaDescription)
  }
  
  // 3. Asignar el texto SEO
  metaDescription.content = "Descubre la mejor oferta gastronómica en el centro de Medellín. Visita nuestro café, restaurante y terraza bar ubicados en el icónico Palacio Nacional."
})
// ==========================================

const navegarA = (ruta) => {
  router.push(`/${ruta}`)
}

// Lógica del Dropdown de Idiomas
const dropdownOpen = ref(false)

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const seleccionarIdioma = (codigo) => {
  idiomaGlobal.value = codigo
  dropdownOpen.value = false
}

const idiomas = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'ja', label: '日本語' }
]

// Diccionario de Traducciones
const traducciones = {
  es: {
    subtitulo: 'Piso 5 • Gastronomía',
    descCafe: 'Cafetería Artesanal',
    descPescado: 'Restaurante & Bar',
    descSky: 'Cócteles de Autor'
  },
  en: {
    subtitulo: '5th Floor • Gastronomy',
    descCafe: 'Artisanal Coffee Shop',
    descPescado: 'Restaurant & Bar',
    descSky: 'Signature Cocktails'
  },
  fr: {
    subtitulo: '5ème Étage • Gastronomie',
    descCafe: 'Café Artisanal',
    descPescado: 'Restaurant & Bar',
    descSky: 'Cocktails Signature'
  },
  ja: {
    subtitulo: '5階 • ガストロノミー',
    descCafe: '職人技のカフェ',
    descPescado: 'レストラン＆バー',
    descSky: 'シグネチャーカクテル'
  }
}

// Computed property para reactividad en las traducciones
const t = computed(() => traducciones[idiomaGlobal.value] || traducciones.es)
</script>

<style scoped>
h1, h2 {
  text-rendering: optimizeLegibility;
}

/* Animación para el menú desplegable */
.fade-down-enter-active,
.fade-down-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-down-enter-from,
.fade-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>