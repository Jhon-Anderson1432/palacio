<template>
  <nav class="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-xl border-b border-white/10 px-4 md:px-12 py-3">
    <div class="max-w-7xl mx-auto flex items-center justify-between gap-4 md:grid md:grid-cols-3 md:gap-0">
      
      <div class="flex-shrink-0 flex items-center md:justify-start">
        <button 
          @click="router.push(rutaVolver)" 
          class="group flex items-center gap-3 px-4 py-2 bg-black/40 border border-[#D4AF37]/30 rounded-full text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all duration-500 uppercase tracking-widest text-[10px] font-bold shadow-[0_0_10px_rgba(212,175,55,0.05)] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
        >
          <svg class="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          <span class="hidden md:inline">{{ t.back }}</span>
        </button>
      </div>

      <div class="flex-1 md:w-full flex justify-center">
        <div v-if="!ocultarBuscador" class="relative group w-full max-w-md md:max-w-2xl">
          <input 
            v-model="searchQuery"
            type="text" 
            :placeholder="t.search" 
            class="w-full bg-white/10 border border-white/20 rounded-full py-2 md:py-3 px-5 text-white text-xs md:text-base outline-none transition-all duration-300 focus:bg-white/20 focus:border-[#D4AF37]/50 focus:ring-4 focus:ring-[#D4AF37]/10 placeholder:text-white/40"
          />
          <span class="absolute right-4 top-1/2 -translate-y-1/2 opacity-50 group-focus-within:opacity-100 group-focus-within:text-[#D4AF37] transition-all text-sm md:text-lg">
            🔍
          </span>
        </div>
      </div>

      <div class="flex-shrink-0 flex justify-end">
        <div class="relative">
          <button 
            @click="dropdownAbierto = !dropdownAbierto"
            class="flex items-center gap-2 px-4 py-2 bg-black/50 border border-white/10 rounded-full text-[#D4AF37] hover:border-[#D4AF37]/50 transition-colors uppercase tracking-widest text-[10px] font-bold"
          >
            <span class="hidden md:inline">{{ nombreIdiomaActual }}</span>
            <span class="md:hidden">{{ idiomaCortoMayusculas }}</span>
            <svg 
              class="w-3 h-3 transition-transform duration-300" 
              :class="{ 'rotate-180': dropdownAbierto }" 
              fill="none" stroke="currentColor" viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          <div 
            v-if="dropdownAbierto" 
            class="absolute right-0 mt-2 w-32 bg-black/95 backdrop-blur-xl border border-[#D4AF37]/20 rounded-lg shadow-xl overflow-hidden py-1 z-50 origin-top-right transition-all"
          >
            <button @click="cambiarIdioma('es')" :class="['w-full text-left px-4 py-3 text-[10px] uppercase tracking-widest font-bold transition-colors', idiomaGlobal === 'es' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'text-gray-400 hover:bg-white/5 hover:text-white']">Español</button>
            <button @click="cambiarIdioma('en')" :class="['w-full text-left px-4 py-3 text-[10px] uppercase tracking-widest font-bold transition-colors border-t border-white/5', idiomaGlobal === 'en' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'text-gray-400 hover:bg-white/5 hover:text-white']">English</button>
            <button @click="cambiarIdioma('fr')" :class="['w-full text-left px-4 py-3 text-[10px] uppercase tracking-widest font-bold transition-colors border-t border-white/5', idiomaGlobal === 'fr' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'text-gray-400 hover:bg-white/5 hover:text-white']">Français</button>
            <button @click="cambiarIdioma('ja')" :class="['w-full text-left px-4 py-3 text-[10px] uppercase tracking-widest font-bold transition-colors border-t border-white/5', idiomaGlobal === 'ja' ? 'bg-[#D4AF37]/10 text-[#D4AF37]' : 'text-gray-400 hover:bg-white/5 hover:text-white']">日本語 (JA)</button>
          </div>
        </div>
      </div>

    </div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { searchQuery, idiomaGlobal } from '../lib/supabase'

// Añadimos 'rutaVolver' con '/' por defecto para no romper el resto de la app
defineProps({
  ocultarBuscador: {
    type: Boolean,
    default: false
  },
  rutaVolver: {
    type: String,
    default: '/'
  }
})

const router = useRouter()
const dropdownAbierto = ref(false)

const cambiarIdioma = (nuevoIdioma) => {
  idiomaGlobal.value = nuevoIdioma
  dropdownAbierto.value = false
}

const nombreIdiomaActual = computed(() => {
  const nombres = { es: 'Español', en: 'English', fr: 'Français', ja: '日本語' }
  return nombres[idiomaGlobal.value] || 'Español'
})

const idiomaCortoMayusculas = computed(() => {
  return (idiomaGlobal.value || 'es').toUpperCase()
})

const traducciones = {
  es: { back: 'Volver', search: 'Buscar obras, autores...' },
  en: { back: 'Back', search: 'Search artworks, artists...' },
  fr: { back: 'Retour', search: 'Rechercher des œuvres...' },
  ja: { back: '戻る', search: '作品、アーティストを検索...' }
}

const t = computed(() => traducciones[idiomaGlobal.value] || traducciones['es'])
</script>

<style scoped>
.group:hover input {
  border-color: rgba(212, 175, 55, 0.4);
}
</style>