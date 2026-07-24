<template>
  <main class="min-h-screen w-full bg-black text-white flex flex-col overflow-y-auto font-sans pb-20 relative pt-24 selection:bg-[#D4AF37] selection:text-black">
    
    <Navbar :ocultarBuscador="true" rutaVolver="/exposiciones" />
    
    <div class="fixed bottom-0 right-0 w-32 h-32 z-0 pointer-events-none opacity-60">
      <div class="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-[#D4AF37]/20 to-transparent"></div>
      <div class="absolute bottom-[-20px] right-[-40px] w-[150%] h-20 bg-black rotate-[-45deg] border-t border-[#D4AF37]/50 shadow-[0_0_40px_rgba(212,175,55,0.25)]"></div>
    </div>

    <article 
      v-if="obra" 
      itemscope 
      itemtype="https://schema.org/VisualArtwork"
      class="flex-1 flex flex-col max-w-xl mx-auto w-full relative z-10"
    >
      
      <header class="w-full relative z-[100] border-b-[2px] border-b-[#D4AF37]/50 pt-6">
        <NuxtImg 
          src="/logoni.png" 
          alt="Palacio Nacional Galería Header" 
          class="w-full h-auto block drop-shadow-lg"
          preload
        />
      </header>

      <div class="flex-1 flex-col px-4 pt-6">

        <figure class="w-full relative bg-black my-4 group overflow-hidden rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.9)] border border-white/10">
          <div class="absolute -inset-1 bg-[#D4AF37]/10 blur-3xl opacity-40 transition-opacity duration-700 group-hover:opacity-70"></div>
          
          <div class="relative w-full aspect-square md:aspect-[4/3] z-10 bg-neutral-950 rounded-2xl overflow-hidden">
            <swiper
              v-if="componenteActivo"
              :modules="modules"
              :slides-per-view="1"
              :loop="obra.listaImagenes.length > 1"
              :autoplay="obra.listaImagenes.length > 1 ? { delay: 4000, disableOnInteraction: false } : false"
              effect="fade"
              class="w-full h-full"
            >
              <swiper-slide v-for="(img, idx) in obra.listaImagenes" :key="idx" class="w-full h-full bg-neutral-950 overflow-hidden relative flex items-center justify-center">
                <NuxtImg 
                  v-if="img !== 'sin-imagen'" 
                  :src="img" 
                  :alt="`${tituloPrincipal} por ${obra.autor}`" 
                  itemprop="image" 
                  :preload="idx === 0" 
                  :loading="idx === 0 ? 'eager' : 'lazy'" 
                  class="w-full h-full object-contain object-center block drop-shadow-2xl transition-transform duration-700 hover:scale-105"
                />
                <div v-else class="w-full h-full flex items-center justify-center bg-neutral-900 text-neutral-500 uppercase tracking-widest text-xs">Sin Imagen Disponible</div>
              </swiper-slide>
            </swiper>
          </div>
        </figure>

        <div class="text-center space-y-3 mb-8 mt-8">
          <h1 itemprop="name" class="text-3xl md:text-5xl font-serif text-white leading-tight lowercase capitalize drop-shadow-2xl">
            {{ tituloPrincipal }}
          </h1>
          <p itemprop="creator" itemscope itemtype="https://schema.org/Person" class="text-xl md:text-2xl text-[#D4AF37] pt-2 font-serif lowercase capitalize tracking-wider drop-shadow-md">
            <span itemprop="name">{{ obra.autor }}</span>
          </p>
        </div>

        <div class="max-w-sm mx-auto space-y-4 mb-10 border-t border-white/10 pt-8 text-center bg-white/[0.03] p-8 rounded-3xl backdrop-blur-md shadow-inner">
          <p class="text-sm flex justify-between border-b border-white/5 pb-3 transition-colors hover:text-[#D4AF37]">
            <span class="text-neutral-400 font-light tracking-widest uppercase text-xs">{{ t.techniqueLabel }}</span> 
            <span itemprop="artMedium" class="text-white lowercase capitalize font-medium">{{ tecnicaPrincipal }}</span>
          </p>
          <p class="text-sm flex justify-between border-b border-white/5 pb-3 transition-colors hover:text-[#D4AF37]">
            <span class="text-neutral-400 font-light tracking-widest uppercase text-xs">{{ t.dimensionsLabel }}</span> 
            <span itemprop="artDimensions" class="text-white lowercase font-medium">{{ obra.medidas }}</span>
          </p>
          <p class="text-sm flex justify-between pb-3">
            <span class="text-neutral-400 font-light tracking-widest uppercase text-xs">{{ t.valueLabel }}</span> 
            <span class="text-[#D4AF37] font-bold text-xl drop-shadow-md">{{ isNaN(obra.precio) ? obra.precio : Number(obra.precio).toLocaleString('es-CO') }} USD</span>
          </p>
          
          <div class="mt-6 pt-6 border-t border-[#D4AF37]/20 flex flex-col gap-3">
            <p class="text-xs sm:text-sm flex justify-center items-center gap-3">
              <span class="text-[#D4AF37]/70 uppercase tracking-widest text-[10px]">{{ t.contactLabel }}:</span> 
              <span class="text-white font-mono tracking-wider font-medium">311 639 0177</span>
            </p>
            <p class="text-xs sm:text-sm flex justify-center items-center gap-3">
              <span class="text-[#D4AF37]/70 uppercase tracking-widest text-[10px]">{{ t.infoLabel }}:</span> 
              <span class="text-white font-mono tracking-wider font-medium">310 447 0369</span>
            </p>
          </div>
        </div>

        <div class="mt-auto pb-8">
          <button 
            @click="preguntarPorWhatsApp"
            class="group flex items-center justify-center w-full py-4 bg-black border border-[#D4AF37] text-[#D4AF37] font-bold hover:bg-[#D4AF37] hover:text-black focus:outline-none focus:ring-4 focus:ring-[#D4AF37]/30 transition-all duration-500 rounded-2xl shadow-[0_0_20px_rgba(212,175,55,0.1)] hover:shadow-[0_0_35px_rgba(212,175,55,0.4)] active:scale-95"
          >
            <span class="uppercase tracking-[0.2em] text-xs transition-transform duration-300 group-hover:scale-105">{{ t.acquireBtn }}</span>
          </button>
        </div>

      </div>

    </article>

    <div v-else class="min-h-[70vh] flex flex-col items-center justify-center bg-black w-full py-32 z-10 relative">
      <div class="relative w-16 h-16">
        <div class="absolute inset-0 border-2 border-[#D4AF37]/20 rounded-full"></div>
        <div class="absolute inset-0 border-2 border-[#D4AF37] border-t-transparent animate-spin rounded-full"></div>
      </div>
      <p class="mt-6 text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] animate-pulse font-medium">Cargando Obra...</p>
    </div>

  </main>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';

const modules = [Autoplay, EffectFade];
const route = useRoute();

// CLIENTE NATIVE SUPABASE PARA NUXT 3
const supabase = useSupabaseClient()

const idiomaGlobal = useState('idiomaGlobal', () => 'es')
const obra = ref(null)
const componenteActivo = ref(true)

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

// === SEO REACTIVO EN NUXT 3 ===
useHead(() => {
  if (!obra.value) return {}
  const currentUrl = `https://palacionacionalmedellin.com/DetalleObra/${route.params.id}`
  return {
    title: `${obra.value.titulo} por ${obra.value.autor} | Galería Palacio Nacional`,
    link: [
      { rel: 'canonical', href: currentUrl }
    ],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "VisualArtwork",
          "name": obra.value.titulo,
          "image": obra.value.imagen_1,
          "creator": {
            "@type": "Person",
            "name": obra.value.autor
          },
          "artMedium": obra.value.tecnica,
          "artDimensions": obra.value.medidas,
          "offers": {
            "@type": "Offer",
            "price": String(obra.value.precio).replace(/[^0-9.]/g, ''),
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "url": currentUrl
          }
        })
      }
    ]
  }
})

const obtenerDetalleObra = async (idBusca) => {
  try {
    const { data, error } = await supabase
      .from('obras')
      .select('*')
      .eq('id', idBusca)
      .single()

    if (error) throw error
    
    const imgs = [data.imagen_1, data.imagen_2, data.imagen_3].filter(Boolean);
    data.listaImagenes = imgs.length > 0 ? imgs : ['sin-imagen'];
    
    obra.value = data
  } catch (err) {
    console.trace("Error al obtener la obra:", err.message)
  }
}

const preguntarPorWhatsApp = () => {
  if (!obra.value) return

  const dominio = typeof window !== 'undefined' ? window.location.origin : 'https://palacionacionalmedellin.com'
  const urlDetalle = `${dominio}/DetalleObra/${obra.value.id}`
  const precioFormat = isNaN(obra.value.precio) ? obra.value.precio : '$' + Number(obra.value.precio).toLocaleString('es-CO') + ' USD'
  
  const multimediaInfo = obra.value.imagen_1 ? `\n📸 *Imagen:* ${obra.value.imagen_1}` : ''
  const texto = `Hola Palacio, estoy interesado en adquirir esta obra:\n\n*Título:* ${obra.value.titulo}\n*Autor:* ${obra.value.autor}\n*Precio:* ${precioFormat}\n\n🔗 *Enlace:* ${urlDetalle}${multimediaInfo}`

  const urlWa = `https://wa.me/573116390177?text=${encodeURIComponent(texto)}`
  
  if (typeof window !== 'undefined') {
    window.open(urlWa, '_blank')
  }
}

onMounted(() => {
  componenteActivo.value = true
})

onBeforeUnmount(() => {
  componenteActivo.value = false
})

watch(() => route.params.id, (newId) => {
  if (newId) {
    obra.value = null;
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
    obtenerDetalleObra(newId);
  }
}, { immediate: true })
definePageMeta({
  layout: false // Apaga el layout maestro. Ni Navbar ni Footer aparecerán.
})
// ... el resto de tu código ...
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');

.font-serif {
  font-family: 'Playfair Display', serif;
}

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
  object-fit: contain;
  object-position: center;
  display: block;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform: translateZ(0);
}
</style>