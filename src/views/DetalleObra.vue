<template>
  <!-- ESTRUCTURA & SEO: Cambiamos <div> por <main> y le damos un rol semántico -->
  <main class="min-h-screen w-full bg-black text-white flex flex-col overflow-y-auto font-sans pb-20 relative pt-24 selection:bg-[#D4AF37] selection:text-black">
    
    <Navbar :ocultarBuscador="true" rutaVolver="/exposiciones" />
    
    <!-- ESTILOS: Fondo decorativo optimizado con backdrop-blur -->
    <div class="fixed bottom-0 right-0 w-32 h-32 z-0 pointer-events-none opacity-60">
      <div class="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-[#D4AF37]/20 to-transparent"></div>
      <div class="absolute bottom-[-20px] right-[-40px] w-[150%] h-20 bg-black rotate-[-45deg] border-t border-[#D4AF37]/50 shadow-[0_0_30px_rgba(212,175,55,0.2)]"></div>
    </div>

    <!-- SEO: <article> con itemscope indicando que es una Obra de Arte Visual -->
    <article 
      v-if="obra" 
      itemscope 
      itemtype="https://schema.org/VisualArtwork"
      class="flex-1 flex flex-col max-w-xl mx-auto w-full relative z-10"
    >
      
      <header class="w-full relative z-[100] border-b-[2px] border-b-[#D4AF37]/50 pt-6">
        <img 
          src="@/assets/logoni.png" 
          alt="Palacio Nacional Galería Header" 
          class="w-full h-auto block drop-shadow-md"
          fetchpriority="high"
        />
      </header>

      <div class="flex-1 flex-col px-4 pt-6">

        <!-- Carrusel de Imágenes -->
        <figure class="w-full relative bg-black my-4 group overflow-hidden rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)] border border-white/5">
          <div class="absolute -inset-1 bg-[#D4AF37]/10 blur-2xl opacity-50 transition-opacity duration-700 group-hover:opacity-80"></div>
          
          <div class="relative w-full aspect-square md:aspect-[4/3] z-10 bg-neutral-950">
            <swiper
              :modules="modules"
              :slides-per-view="1"
              :loop="true"
              :autoplay="{ delay: 4000, disableOnInteraction: false }"
              effect="fade"
              class="w-full h-full"
            >
              <!-- RENDIMIENTO Y SEO: fetchpriority="high" para la primera imagen (LCP), loading="lazy" para las demás. itemprop="image" -->
              <swiper-slide v-if="obra.imagen_1">
                <img :src="obra.imagen_1" :alt="`${tituloPrincipal} por ${obra.autor}`" itemprop="image" fetchpriority="high" class="w-full h-full object-contain drop-shadow-2xl transition-transform duration-700 hover:scale-105">
              </swiper-slide>
              <swiper-slide v-if="obra.imagen_2">
                <img :src="obra.imagen_2" :alt="`Detalle 1 de ${tituloPrincipal}`" loading="lazy" decoding="async" class="w-full h-full object-contain drop-shadow-2xl">
              </swiper-slide>
              <swiper-slide v-if="obra.imagen_3">
                <img :src="obra.imagen_3" :alt="`Detalle 2 de ${tituloPrincipal}`" loading="lazy" decoding="async" class="w-full h-full object-contain drop-shadow-2xl">
              </swiper-slide>
              
              <swiper-slide v-if="!obra.imagen_1 && !obra.imagen_2 && !obra.imagen_3">
                <div class="w-full h-full flex items-center justify-center bg-neutral-900 text-neutral-500 uppercase tracking-widest text-xs">Sin Imagen Disponible</div>
              </swiper-slide>
            </swiper>
          </div>
        </figure>

        <!-- Información de la Obra -->
        <div class="text-center space-y-3 mb-8 mt-6">
          <h1 itemprop="name" class="text-3xl md:text-4xl font-serif text-white leading-tight lowercase capitalize drop-shadow-lg">
            {{ tituloPrincipal }}
          </h1>
          <!-- SEO: Indicamos que el autor es una "Persona" -->
          <p itemprop="creator" itemscope itemtype="https://schema.org/Person" class="text-xl md:text-2xl text-[#D4AF37] pt-1 font-serif lowercase capitalize tracking-wide">
            <span itemprop="name">{{ obra.autor }}</span>
          </p>
        </div>

        <div class="max-w-sm mx-auto space-y-4 mb-10 border-t border-white/10 pt-8 text-center bg-white/[0.02] p-6 rounded-2xl backdrop-blur-sm">
          <p class="text-sm flex justify-between border-b border-white/5 pb-2">
            <span class="text-neutral-400 font-light tracking-widest uppercase text-xs">{{ t.techniqueLabel }}</span> 
            <span itemprop="artMedium" class="text-white lowercase capitalize font-medium">{{ tecnicaPrincipal }}</span>
          </p>
          <p class="text-sm flex justify-between border-b border-white/5 pb-2">
            <span class="text-neutral-400 font-light tracking-widest uppercase text-xs">{{ t.dimensionsLabel }}</span> 
            <span itemprop="artDimensions" class="text-white lowercase font-medium">{{ obra.medidas }}</span>
          </p>
          <p class="text-sm flex justify-between pb-2">
            <span class="text-neutral-400 font-light tracking-widest uppercase text-xs">{{ t.valueLabel }}</span> 
            <span class="text-[#D4AF37] font-bold text-lg">{{ isNaN(obra.precio) ? obra.precio : Number(obra.precio).toLocaleString() }} USD</span>
          </p>
          
          <div class="mt-6 pt-6 border-t border-[#D4AF37]/20 flex flex-col gap-2">
            <p class="text-xs sm:text-sm flex justify-center items-center gap-2">
              <span class="text-[#D4AF37]/70 uppercase tracking-widest text-[10px]">{{ t.contactLabel }}:</span> 
              <span class="text-white font-mono tracking-wider">311 639 0177</span>
            </p>
            <p class="text-xs sm:text-sm flex justify-center items-center gap-2">
              <span class="text-[#D4AF37]/70 uppercase tracking-widest text-[10px]">{{ t.infoLabel }}:</span> 
              <span class="text-white font-mono tracking-wider">310 447 0369</span>
            </p>
          </div>
        </div>

        <div class="mt-auto pb-6">
          <button 
            @click="preguntarPorWhatsApp"
            class="group flex items-center justify-center w-full py-4 bg-black border border-[#D4AF37] text-[#D4AF37] font-bold hover:bg-[#D4AF37] hover:text-black transition-all duration-500 rounded-xl shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] active:scale-[0.98]"
          >
            <span class="uppercase tracking-[0.2em] text-xs transition-transform duration-300 group-hover:scale-105">{{ t.acquireBtn }}</span>
          </button>
        </div>

      </div>

    </article>

    <!-- Loader Optimizado -->
    <div v-else class="h-screen flex flex-col items-center justify-center bg-black absolute inset-0 z-50">
      <div class="relative w-16 h-16">
        <div class="absolute inset-0 border-2 border-[#D4AF37]/20 rounded-full"></div>
        <div class="absolute inset-0 border-2 border-[#D4AF37] border-t-transparent animate-spin rounded-full"></div>
      </div>
      <p class="mt-4 text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] animate-pulse">Cargando Obra...</p>
    </div>

  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from '../components/Navbar.vue' 
import { supabase, idiomaGlobal } from '../lib/supabase'

import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
const modules = [Autoplay, EffectFade];

const route = useRoute()
const obra = ref(null)

const traducciones = {
  es: { acquireBtn: 'Solicitar Adquisición', techniqueLabel: 'Técnica', dimensionsLabel: 'Dimensión', valueLabel: 'Valor', contactLabel: 'Contacto', infoLabel: 'Info detallada' },
  en: { acquireBtn: 'Request Acquisition', techniqueLabel: 'Technique', dimensionsLabel: 'Dimensions', valueLabel: 'Value', contactLabel: 'Contact', infoLabel: 'Detailed info' },
  fr: { acquireBtn: 'Demander l\'acquisition', techniqueLabel: 'Technique', dimensionsLabel: 'Dimensions', valueLabel: 'Valeur', contactLabel: 'Contact', infoLabel: 'Infos détaillées' },
  ja: { acquireBtn: '取得をリクエスト', techniqueLabel: '手法', dimensionsLabel: '寸法', valueLabel: '価格', contactLabel: '連絡先', infoLabel: '詳細情報' }
}

const t = computed(() => traducciones[idiomaGlobal.value] || traducciones['es'])

const tituloPrincipal = computed(() => {
  if (!obra.value) return '';
  if (idiomaGlobal.value === 'en' && obra.value.titulo_en) return obra.value.titulo_en;
  if (idiomaGlobal.value === 'fr' && obra.value.titulo_fr) return obra.value.titulo_fr;
  if (idiomaGlobal.value === 'ja' && obra.value.titulo_ja) return obra.value.titulo_ja;
  return obra.value.titulo;
})

const tecnicaPrincipal = computed(() => {
  if (!obra.value) return '';
  if (idiomaGlobal.value === 'en' && obra.value.medidas_en) return obra.value.medidas_en;
  if (idiomaGlobal.value === 'fr' && obra.value.medidas_fr) return obra.value.medidas_fr;
  if (idiomaGlobal.value === 'ja' && obra.value.medidas_ja) return obra.value.medidas_ja;
  return obra.value.tecnica; 
})

// === INYECCIÓN SEO DINÁMICA ===
const inyectarSEO = (datosObra) => {
  // 1. Etiqueta Title Dinámica para Google
  document.title = `${datosObra.titulo} por ${datosObra.autor} | Galería Palacio Nacional`;

  // 2. Canonical dinámico
  let canonical = document.querySelector("link[rel='canonical']");
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  canonical.setAttribute("href", window.location.href);

  // 3. Schema.org de Obra de Arte Visual
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "VisualArtwork",
    "name": datosObra.titulo,
    "image": datosObra.imagen_1,
    "creator": {
      "@type": "Person",
      "name": datosObra.autor
    },
    "artMedium": datosObra.tecnica,
    "artDimensions": datosObra.medidas,
    "offers": {
      "@type": "Offer",
      "price": String(datosObra.precio).replace(/[^0-9.]/g, ''), // Extrae solo los números
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "url": window.location.href
    }
  };

  const scriptId = 'schema-obra-arte';
  const existingScript = document.getElementById(scriptId);
  if (existingScript) existingScript.remove();

  const script = document.createElement('script');
  script.id = scriptId;
  script.setAttribute('type', 'application/ld+json');
  script.textContent = JSON.stringify(schemaData);
  document.head.appendChild(script);
}

const obtenerDetalleObra = async () => {
  const idBusca = route.params.id
  try {
    const { data, error } = await supabase
      .from('obras')
      .select('*')
      .eq('id', idBusca)
      .single()

    if (error) throw error
    obra.value = data
    
    // Llamamos a la función de SEO en cuanto tenemos los datos
    inyectarSEO(data)
  } catch (err) {
    console.trace("Error al obtener la obra:", err.message)
  }
}

const preguntarPorWhatsApp = () => {
  if (!obra.value) return

  const dominio = window.location.origin
  const urlDetalle = `${dominio}/DetalleObra/${obra.value.id}`
  const precioFormat = isNaN(obra.value.precio) ? obra.value.precio : '$' + Number(obra.value.precio).toLocaleString() + ' USD'
  
  const multimediaInfo = obra.value.imagen_1 ? `\n📸 *Imagen:* ${obra.value.imagen_1}` : ''
  const texto = `Hola Palacio, estoy interesado en adquirir esta obra:\n\n*Título:* ${obra.value.titulo}\n*Autor:* ${obra.value.autor}\n*Precio:* ${precioFormat}\n\n🔗 *Enlace:* ${urlDetalle}${multimediaInfo}`

  const urlWa = `https://wa.me/573116390177?text=${encodeURIComponent(texto)}`
  window.open(urlWa, '_blank')
}

onMounted(() => {
  window.scrollTo(0, 0)
  obtenerDetalleObra()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');

.font-serif {
  font-family: 'Playfair Display', serif;
}

/* ESTILOS: Animaciones más pulidas para que parezca una galería premium */
article {
  animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

h1 {
  animation: slideInLeft 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

p[itemprop="creator"] {
  animation: slideInRight 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideInLeft {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}

@keyframes slideInRight {
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
}
</style>