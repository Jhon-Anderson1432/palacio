<template>
  <main 
    class="min-h-screen w-full bg-black text-[#D4AF37] font-sans flex flex-col items-center justify-center relative overflow-hidden selection:bg-[#D4AF37] selection:text-black antialiased"
    role="main"
    aria-label="Portal Gastronómico Palacio Nacional"
  >
    
    <!-- Selector de Idioma -->
    <div class="absolute top-6 left-6 z-50">
      <button 
        @click="toggleDropdown"
        class="flex items-center gap-2 px-5 py-2.5 border border-[#D4AF37]/20 rounded-full bg-black/50 backdrop-blur-xl text-[#D4AF37]/80 hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 shadow-lg"
        :aria-expanded="dropdownOpen"
        aria-haspopup="true"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span class="text-sm font-medium tracking-wider uppercase">{{ idiomaGlobal }}</span>
        <svg class="w-4 h-4 transition-transform duration-300" :class="{ 'rotate-180': dropdownOpen }" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>

      <transition name="dropdown-fade">
        <div v-if="dropdownOpen" class="absolute top-full left-0 mt-3 w-44 bg-[#0a0a0a]/95 backdrop-blur-2xl border border-[#D4AF37]/20 rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.9)] overflow-hidden py-1">
          <button 
            v-for="lang in idiomas" 
            :key="lang.code"
            @click="seleccionarIdioma(lang.code)"
            class="w-full text-left px-5 py-3.5 text-sm text-neutral-400 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] transition-colors duration-300 border-b border-white/5 last:border-none focus:outline-none focus:bg-[#D4AF37]/10 focus:text-[#D4AF37]"
            :class="{ 'text-[#D4AF37] bg-[#D4AF37]/5 font-medium': idiomaGlobal === lang.code }"
          >
            {{ lang.label }}
          </button>
        </div>
      </transition>
    </div>

    <!-- Botón Volver -->
    <NuxtLink 
      to="/" 
      class="absolute top-6 right-6 z-50 p-3 border border-[#D4AF37]/20 rounded-full text-[#D4AF37]/60 bg-black/40 backdrop-blur-md hover:text-black hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-[#D4AF37]/30 shadow-lg"
      title="Volver al Palacio"
      aria-label="Volver a la página de inicio del Palacio"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </NuxtLink>

    <div class="w-full max-w-7xl px-6 py-16 flex flex-col items-center z-10">
      
      <header class="text-center mb-16 md:mb-24 flex flex-col items-center">
        <h1 class="sr-only">Restaurantes, Bares y Cafés en el Centro de Medellín | Palacio Nacional</h1>
        
        <NuxtImg 
          src="/logon.png" 
          alt="Palacio Nacional Medellín - Centro Cultural y Gastronómico" 
          class="w-48 md:w-64 mb-8 object-contain drop-shadow-[0_0_20px_rgba(212,175,55,0.4)]"
          preload
        />
        
        <div class="flex items-center gap-5 mb-4">
          <div class="h-px w-16 md:w-24 bg-gradient-to-r from-transparent to-[#D4AF37]/40" aria-hidden="true"></div>
          <p class="text-[11px] md:text-xs tracking-[0.4em] text-neutral-400 uppercase font-medium select-none drop-shadow-sm">
            {{ t.subtitulo }}
          </p>
          <div class="h-px w-16 md:w-24 bg-gradient-to-l from-transparent to-[#D4AF37]/40" aria-hidden="true"></div>
        </div>
      </header>

      <nav class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 w-full" aria-label="Locales Gastronómicos del Piso 5">
        
        <NuxtLink 
          to="/gastronomia/chao-cafe" 
          class="group flex flex-col items-center justify-center p-8 md:p-12 border border-[#D4AF37]/20 bg-[#050505] rounded-[2rem] transition-all duration-500 hover:border-[#D4AF37] hover:-translate-y-2 hover:shadow-[0_15px_50px_-10px_rgba(212,175,55,0.3)] focus:outline-none focus:ring-4 focus:ring-[#D4AF37]/20"
          aria-label="Visitar el menú de Chao Café - Cafetería Artesanal en el Centro de Medellín"
        >
          <div class="w-28 h-28 md:w-40 md:h-40 mb-8 rounded-full border border-[#D4AF37]/20 bg-[#0a0a0a] p-4 flex items-center justify-center shadow-inner group-hover:border-[#D4AF37]/60 group-hover:bg-black transition-colors duration-500">
            <NuxtImg src="/logonc.png" alt="Logo de Chao Café Artesanal" class="w-full h-full object-contain drop-shadow-md" loading="lazy" />
          </div>
          
          <h2 class="text-2xl md:text-3xl font-serif tracking-[0.15em] uppercase text-white group-hover:text-[#D4AF37] transition-colors drop-shadow-sm">
            Chao Cafe
          </h2>
          <p class="text-[10px] md:text-xs tracking-[0.2em] text-neutral-500 mt-3 uppercase font-bold group-hover:text-neutral-300 transition-colors">
            {{ t.descCafe }}
          </p>
        </NuxtLink>

        <NuxtLink 
          to="/gastronomia/chao-pescado" 
          class="group flex flex-col items-center justify-center p-8 md:p-12 border border-[#D4AF37]/20 bg-[#050505] rounded-[2rem] transition-all duration-500 hover:border-[#D4AF37] hover:-translate-y-2 hover:shadow-[0_15px_50px_-10px_rgba(212,175,55,0.3)] focus:outline-none focus:ring-4 focus:ring-[#D4AF37]/20"
          aria-label="Visitar el menú de Chao Pescao - Restaurante y Bar en el Centro de Medellín"
        >
          <div class="w-28 h-28 md:w-40 md:h-40 mb-8 rounded-full border border-[#D4AF37]/20 bg-[#0a0a0a] p-4 flex items-center justify-center shadow-inner group-hover:border-[#D4AF37]/60 group-hover:bg-black transition-colors duration-500">
            <NuxtImg src="/logonp.png" alt="Logo de Chao Pescao Restaurante" class="w-full h-full object-contain drop-shadow-md" loading="lazy" />
          </div>
          
          <h2 class="text-2xl md:text-3xl font-serif tracking-[0.15em] uppercase text-white group-hover:text-[#D4AF37] transition-colors drop-shadow-sm">
            Chao Pescao
          </h2>
          <p class="text-[10px] md:text-xs tracking-[0.2em] text-neutral-500 mt-3 uppercase font-bold group-hover:text-neutral-300 transition-colors">
            {{ t.descPescado }}
          </p>
        </NuxtLink>

        <NuxtLink 
          to="/gastronomia/sky-bar" 
          class="group flex flex-col items-center justify-center p-8 md:p-12 border border-[#D4AF37]/20 bg-[#050505] rounded-[2rem] transition-all duration-500 hover:border-[#D4AF37] hover:-translate-y-2 hover:shadow-[0_15px_50px_-10px_rgba(212,175,55,0.3)] focus:outline-none focus:ring-4 focus:ring-[#D4AF37]/20"
          aria-label="Visitar el menú de Sky Bar - Terraza y Cócteles de Autor en el Centro de Medellín"
        >
          <div class="w-28 h-28 md:w-40 md:h-40 mb-8 rounded-full border border-[#D4AF37]/20 bg-[#0a0a0a] p-4 flex items-center justify-center shadow-inner group-hover:border-[#D4AF37]/60 group-hover:bg-black transition-colors duration-500">
           <NuxtImg src="/logons.png" alt="Logo de Sky Bar Café Medellín" class="w-full h-full object-contain drop-shadow-md" loading="lazy" />
          </div>
          
          <h2 class="text-2xl md:text-3xl font-serif tracking-[0.15em] uppercase text-white group-hover:text-[#D4AF37] transition-colors drop-shadow-sm">
            Sky Bar
          </h2>
          <p class="text-[10px] md:text-xs tracking-[0.2em] text-neutral-500 mt-3 uppercase font-bold group-hover:text-neutral-300 transition-colors">
            {{ t.descSky }}
          </p>
        </NuxtLink>

      </nav>
    </div>
  </main>
</template>

<script setup>
const dropdownOpen = ref(false)

// ESTADO GLOBAL SSR NUXT 3
const idiomaGlobal = useState('idiomaGlobal', () => 'es')

const idiomas = [
  { code: 'es', label: 'Español' },
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'ja', label: '日本語' }
]

const traducciones = {
  es: { subtitulo: 'Piso 5 • Gastronomía', descCafe: 'Cafetería Artesanal', descPescado: 'Restaurante & Bar', descSky: 'Cócteles de Autor' },
  en: { subtitulo: '5th Floor • Gastronomy', descCafe: 'Artisanal Coffee Shop', descPescado: 'Restaurant & Bar', descSky: 'Signature Cocktails' },
  fr: { subtitulo: '5ème Étage • Gastronomie', descCafe: 'Café Artisanal', descPescado: 'Restaurant & Bar', descSky: 'Cocktails Signature' },
  ja: { subtitulo: '5階 • ガストロノミー', descCafe: '職人技のカフェ', descPescado: 'レストラン＆バー', descSky: 'シグネチャーカクテル' }
}

const t = computed(() => traducciones[idiomaGlobal.value] || traducciones.es)

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const seleccionarIdioma = (codigo) => {
  idiomaGlobal.value = codigo
  dropdownOpen.value = false
}

// === SEO MAESTRO SSR ===
useHead({
  title: "Bares, Restaurantes y Cafés en el Centro de Medellín | Palacio Nacional",
  meta: [
    { name: 'description', content: 'Vive una experiencia única en el centro de Medellín. Disfruta del mejor café artesanal, almuerza en nuestro restaurante o relájate con cócteles en el bar del piso 5 del Palacio Nacional mientras admiras galerías de arte históricas.' }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Place",
        "name": "Zona Gastronómica Palacio Nacional Medellín",
        "description": "Un ecosistema cultural y gastronómico en el piso 5 del Palacio Nacional donde se unen la cafetería de especialidad, restaurantes de alta cocina, terrazas de cócteles y galerías de arte.",
        "url": "https://palacionacionalmedellin.com/homegastro",
        "image": "https://palacionacionalmedellin.com/logon.png",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Cra. 52 #48-45 Piso 5, La Candelaria",
          "addressLocality": "Medellín",
          "addressRegion": "Antioquia",
          "addressCountry": "CO"
        },
        "containsPlace": [
          {
            "@type": "CafeOrCoffeeShop",
            "name": "Chao Café",
            "description": "Cafetería artesanal de especialidad en el centro de Medellín."
          },
          {
            "@type": "Restaurant",
            "name": "Chao Pescao",
            "description": "Restaurante gourmet con opciones a la carta y menú ejecutivo de alta calidad."
          },
          {
            "@type": "BarOrPub",
            "name": "Sky Bar",
            "description": "Terraza bar con coctelería de autor y ambiente exclusivo en el corazón de la ciudad."
          }
        ]
      })
    }
  ]
})
definePageMeta({
  layout: false // Apaga el layout maestro. Ni Navbar ni Footer aparecerán.
})
// ... el resto de tu código ...
</script>

<style scoped>
.antialiased {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2 {
  text-rendering: optimizeLegibility;
}

.dropdown-fade-enter-active {
  transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.dropdown-fade-leave-active {
  transition: opacity 0.2s cubic-bezier(0.7, 0, 0.84, 0), transform 0.2s cubic-bezier(0.7, 0, 0.84, 0);
}
.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>