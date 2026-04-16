<template>
  <main class="relative min-h-screen w-full font-sans bg-[#0a0a0a] text-white overflow-x-hidden pt-24 pb-16">
    
    <header class="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-[#D4AF37]/20 px-6 py-4 flex items-center justify-between">
      
      <button 
        @click="router.push('/')" 
        class="group flex items-center gap-3 px-5 py-2.5 bg-black/40 border border-[#D4AF37]/30 rounded-full text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all duration-500 uppercase tracking-widest text-[10px] font-bold shadow-[0_0_10px_rgba(212,175,55,0.05)] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
      >
        <svg class="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        {{ t.back }}
      </button>

      <div class="flex items-center gap-3">
        <button 
          @click="idioma = 'es'" 
          :class="['text-[10px] tracking-widest font-bold transition-all', idioma === 'es' ? 'text-[#D4AF37]' : 'text-gray-500 hover:text-white']"
        >
          ES
        </button>
        <span class="text-white/10 text-[10px]">|</span>
        <button 
          @click="idioma = 'en'" 
          :class="['text-[10px] tracking-widest font-bold transition-all', idioma === 'en' ? 'text-[#D4AF37]' : 'text-gray-500 hover:text-white']"
        >
          EN
        </button>
      </div>
      
    </header>

    <div class="text-center mb-20 px-4 mt-8">
      <h1 class="text-4xl md:text-6xl font-light tracking-[0.15em] uppercase mb-4 text-[#D4AF37] drop-shadow-[0_0_15px_rgba(212,175,55,0.2)]">
        {{ t.title }}
      </h1>
      <p class="text-gray-400 font-light tracking-widest uppercase text-xs md:text-sm max-w-2xl mx-auto">
        {{ t.subtitle }}
      </p>
    </div>

    <div class="max-w-6xl mx-auto relative px-4 md:px-8">
      
      <div class="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#D4AF37]/0 via-[#D4AF37]/50 to-[#D4AF37]/0 md:-translate-x-1/2"></div>

      <div 
        v-for="(item, index) in timelineTranslated" 
        :key="index" 
        class="relative flex flex-col md:flex-row items-center w-full mb-16 md:mb-32 group"
      >
        <div class="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-[#0a0a0a] border-2 border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.8)] transform -translate-x-1/2 top-8 md:top-1/2 md:-translate-y-1/2 z-10 transition-transform duration-500 group-hover:scale-150 group-hover:bg-[#D4AF37]"></div>

        <div :class="['w-full md:w-1/2 pl-16 md:px-12', index % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto']">
          
          <div class="bg-black/40 backdrop-blur-md border border-[#D4AF37]/20 rounded-xl p-6 hover:border-[#D4AF37]/60 hover:bg-white/5 transition-all duration-500 shadow-lg hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] group-hover:-translate-y-2 relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div class="relative z-10">
              <div class="w-full h-48 md:h-64 mb-6 rounded-lg overflow-hidden border border-white/5 relative">
                <img :src="item.img" :alt="item.title" class="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 transform group-hover:scale-110" />
              </div>
              
              <div :class="index % 2 === 0 ? 'md:text-right' : 'md:text-left'">
                <span class="text-[#D4AF37] font-bold text-xl tracking-[0.2em] block mb-2">{{ item.year }}</span>
                <h3 class="text-white text-2xl font-light uppercase tracking-widest mb-4">{{ item.title }}</h3>
                <p class="text-gray-400 font-light leading-relaxed text-sm tracking-wide text-justify">
                  {{ item.desc }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const idioma = ref('es')

// Diccionario ajustado con "Nuestra Historia" y "Volver al Inicio"
const textos = {
  es: {
    back: 'Volver al Inicio',
    title: 'Nuestra Historia',
    subtitle: 'Desde los cimientos de la justicia hasta el santuario del arte'
  },
  en: {
    back: 'Back to Home',
    title: 'Our History',
    subtitle: 'From the foundations of justice to the sanctuary of art'
  }
}

const t = computed(() => textos[idioma.value])

// Array de historia con 5 etapas
const timelineData = [
  {
    year: '1920',
    img: '/pa1.jpg',
    es: { title: 'El Llamado a Europa', desc: 'El gobierno departamental encomendó el diseño al arquitecto belga Agustín Goovaerts para imaginar un palacio monumental digno de una ciudad industrial en auge.' },
    en: { title: 'The Call to Europe', desc: 'The regional government commissioned Belgian architect Agustín Goovaerts to design a monumental palace worthy of a booming industrial city.' }
  },
  {
    year: '1925 - 1933',
    img: '/pa2.jpg',
    es: { title: 'Cimientos Románticos', desc: 'Consolidado como el máximo exponente del estilo romántico modernizado. Su fachada de ladrillo y herrajes en bronce marcaron la vanguardia de Medellín.' },
    en: { title: 'Romantic Foundations', desc: 'Established as the finest example of modernized romantic style. Its brick facade and bronze fittings defined Medellin\'s avant-garde architecture.' }
  },
  {
    year: '1933 - 1988',
    img: '/pag3.webp',
    es: { title: 'Sede de la Justicia', desc: 'Durante cinco décadas funcionó como el Palacio de Justicia, albergando 88 juzgados que moldearon la historia legal de Antioquia.' },
    en: { title: 'Seat of Justice', desc: 'For five decades it served as the Palace of Justice, housing 88 courts that shaped the legal history of Antioquia.' }
  },
  {
    year: '1988',
    img: '/pa5.jpg',
    es: { title: 'Patrimonio de la Nación', desc: 'Declarado Patrimonio Histórico y Artístico de la Nación, blindando para siempre sus vitrales de época y su imponente vacío central.' },
    en: { title: 'National Heritage', desc: 'Declared National Historical and Artistic Heritage, permanently protecting its period stained glass and imposing central void.' }
  },
  {
    year: 'Actualidad',
    img: '/pa4.jpg',
    es: { title: 'Santuario del Arte', desc: 'Las antiguas oficinas han sido transformadas en lienzos vivos. Hoy, los pisos superiores resguardan una vibrante galería de arte contemporáneo.' },
    en: { title: 'Art Sanctuary', desc: 'The former offices have been transformed into living canvases. Today, the upper floors house a vibrant contemporary art gallery.' }
  }
]

const timelineTranslated = computed(() => {
  return timelineData.map(item => ({
    year: item.year,
    img: item.img,
    title: item[idioma.value].title,
    desc: item[idioma.value].desc
  }))
})
</script>

<style scoped>
div {
  backface-visibility: hidden;
}
</style>