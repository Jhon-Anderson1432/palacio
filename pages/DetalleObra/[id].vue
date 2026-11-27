<template>
  <main class="min-h-screen w-full bg-black text-white flex flex-col overflow-y-auto font-sans pb-20 relative pt-24 selection:bg-[#D4AF37] selection:text-black">
    <Navbar :mostrarBotonVolver="true" rutaVolver="/exposiciones" />
    
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
        <!-- ======================================================== -->
        <!-- CARRUSEL DE OBRA (EXPERIENCIA MEJORADA / ALTA GAMA)     -->
        <!-- ======================================================== -->
        <figure class="w-full relative bg-black my-4 group rounded-2xl shadow-[0_15px_50px_rgba(0,0,0,0.9)] border border-white/10 overflow-hidden">
          <div class="absolute -inset-1 bg-[#D4AF37]/10 blur-3xl opacity-40 transition-opacity duration-700 group-hover:opacity-70 pointer-events-none"></div>
          
          <!-- Contenedor Principal de la Imagen -->
          <div class="relative w-full aspect-square md:aspect-[4/3] z-10 bg-neutral-950 overflow-hidden">
            
            <swiper
              v-if="componenteActivo"
              :modules="modules"
              :slides-per-view="1"
              :loop="tieneMultiplesImagenes"
              :autoplay="tieneMultiplesImagenes && autoPlayActivo ? { delay: 4500, disableOnInteraction: false, pauseOnMouseEnter: true } : false"
              effect="fade"
              class="w-full h-full cursor-zoom-in"
              @swiper="onSwiperInit"
              @slideChange="onSlideChange"
              @click="abrirLightbox(indiceActivo)"
            >
              <swiper-slide 
                v-for="(img, idx) in imagenesCarrusel" 
                :key="idx" 
                class="w-full h-full bg-neutral-950 overflow-hidden relative flex items-center justify-center select-none"
              >
                <NuxtImg
                  v-if="img !== 'sin-imagen'"
                  :src="img"
                  :alt="`${tituloPrincipal} - Imagen ${idx + 1} por ${obra.autor}`"
                  itemprop="image"
                  :preload="idx === 0"
                  :loading="idx === 0 ? 'eager' : 'lazy'"
                  class="w-full h-full object-contain object-center block drop-shadow-2xl transition-transform duration-700 hover:scale-[1.02]"
                />
                <div v-else class="w-full h-full flex items-center justify-center bg-neutral-900 text-neutral-500 uppercase tracking-widest text-xs">
                  Sin Imagen Disponible
                </div>
              </swiper-slide>
            </swiper>

            <!-- 1. Botón Zoom / Pantalla Completa (Top-Right) -->
            <button
              v-if="tieneImagenesReales"
              type="button"
              @click.stop="abrirLightbox(indiceActivo)"
              class="absolute top-3.5 right-3.5 z-20 p-2.5 rounded-full bg-black/70 hover:bg-[#D4AF37] text-white hover:text-black border border-white/20 hover:border-[#D4AF37] backdrop-blur-md transition-all duration-300 shadow-xl focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
              title="Ampliar en pantalla completa"
              aria-label="Ampliar obra en pantalla completa"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path>
              </svg>
            </button>

            <!-- 2. Flechas de Navegación Lateral -->
            <template v-if="tieneMultiplesImagenes">
              <button
                type="button"
                @click.stop="slideAnterior"
                class="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/65 hover:bg-[#D4AF37] text-white hover:text-black border border-[#D4AF37]/30 hover:border-[#D4AF37] backdrop-blur-md transition-all duration-300 flex items-center justify-center shadow-2xl active:scale-90 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] opacity-85 sm:opacity-0 sm:group-hover:opacity-100"
                aria-label="Imagen anterior"
              >
                <svg class="w-4 h-4 sm:w-5 sm:h-5 -translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>

              <button
                type="button"
                @click.stop="slideSiguiente"
                class="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/65 hover:bg-[#D4AF37] text-white hover:text-black border border-[#D4AF37]/30 hover:border-[#D4AF37] backdrop-blur-md transition-all duration-300 flex items-center justify-center shadow-2xl active:scale-90 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] opacity-85 sm:opacity-0 sm:group-hover:opacity-100"
                aria-label="Imagen siguiente"
              >
                <svg class="w-4 h-4 sm:w-5 sm:h-5 translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </template>

            <!-- 3. Bullets / Punticos Indicadores Inferiores -->
            <div 
              v-if="tieneMultiplesImagenes"
              class="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/10 shadow-lg"
            >
              <button
                v-for="(_, idx) in imagenesCarrusel"
                :key="idx"
                type="button"
                @click.stop="irASlide(idx)"
                :class="[
                  'transition-all duration-300 rounded-full focus:outline-none',
                  indiceActivo === idx 
                    ? 'w-6 h-1.5 bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]' 
                    : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/80'
                ]"
                :aria-label="`Ir a imagen ${idx + 1}`"
              ></button>
            </div>

          </div>
        </figure>
        
        <div class="text-center space-y-3 mb-8 mt-8">
          <h1 itemprop="name" class="text-3xl md:text-5xl font-serif text-white leading-tight drop-shadow-2xl">
            {{ tituloPrincipal }}
          </h1>
          <p itemprop="creator" itemscope itemtype="https://schema.org/Person" class="text-xl md:text-2xl text-[#D4AF37] pt-2 font-serif tracking-wider drop-shadow-md">
            <span itemprop="name">{{ autorPrincipal }}</span>
          </p>
        </div>
        
        <div class="max-w-sm mx-auto space-y-4 mb-10 border-t border-white/10 pt-8 text-center bg-white/[0.03] p-8 rounded-3xl backdrop-blur-md shadow-inner">
          <p class="text-sm flex justify-between border-b border-white/5 pb-3 transition-colors hover:text-[#D4AF37]">
            <span class="text-neutral-400 font-light tracking-widest uppercase text-xs">{{ t.techniqueLabel }}</span>
            <span itemprop="artMedium" class="text-white font-medium">{{ tecnicaPrincipal }}</span>
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

    <!-- ======================================================== -->
    <!-- MODAL LIGHTBOX / PANTALLA COMPLETA (ALTA RESOLUCIÓN)    -->
    <!-- ======================================================== -->
    <Teleport to="body">
      <transition name="lightbox-fade">
        <div 
          v-if="lightboxAbierto"
          class="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-6 select-none"
          role="dialog"
          aria-modal="true"
          :aria-label="`Vista ampliada de ${tituloPrincipal}`"
        >
          <!-- Barra superior del Lightbox -->
          <div class="flex items-center justify-between gap-4 z-20 max-w-7xl mx-auto w-full pt-1">
            <div class="truncate pr-4">
              <h2 class="text-white font-serif text-sm sm:text-lg truncate tracking-wide uppercase">{{ tituloPrincipal }}</h2>
              <p class="text-[#D4AF37] text-xs font-serif truncate capitalize">{{ obra?.autor }}</p>
            </div>
            
            <div class="flex items-center gap-3 flex-shrink-0">
              <button
                type="button"
                @click="cerrarLightbox"
                class="p-2.5 rounded-full bg-white/10 hover:bg-[#D4AF37] text-white hover:text-black border border-white/20 hover:border-[#D4AF37] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
                aria-label="Cerrar vista ampliada"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>

          <!-- Imagen Principal Ampliada con Flechas -->
          <div class="flex-1 relative flex items-center justify-center p-2 sm:p-4 my-auto overflow-hidden">
            <template v-if="tieneMultiplesImagenes">
              <button
                type="button"
                @click.stop="slideAnterior"
                class="absolute left-2 sm:left-6 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/75 hover:bg-[#D4AF37] text-white hover:text-black border border-[#D4AF37]/40 hover:border-[#D4AF37] transition-all flex items-center justify-center shadow-[0_0_25px_rgba(0,0,0,0.8)] focus:outline-none active:scale-90"
                aria-label="Imagen anterior"
              >
                <svg class="w-6 h-6 -translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>

              <button
                type="button"
                @click.stop="slideSiguiente"
                class="absolute right-2 sm:right-6 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/75 hover:bg-[#D4AF37] text-white hover:text-black border border-[#D4AF37]/40 hover:border-[#D4AF37] transition-all flex items-center justify-center shadow-[0_0_25px_rgba(0,0,0,0.8)] focus:outline-none active:scale-90"
                aria-label="Imagen siguiente"
              >
                <svg class="w-6 h-6 translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </template>

            <img
              :src="imagenesCarrusel[indiceActivo]"
              :alt="`${tituloPrincipal} - Vista en alta resolución`"
              class="max-w-full max-h-[78vh] sm:max-h-[82vh] object-contain drop-shadow-[0_0_50px_rgba(0,0,0,0.9)] transition-all duration-300 rounded-lg select-none"
            />
          </div>

          <!-- Bullets / Punticos Indicadores Inferiores en el Lightbox -->
          <div 
            v-if="tieneMultiplesImagenes" 
            class="flex items-center justify-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 mx-auto z-20 mb-2 shadow-lg"
          >
            <button
              v-for="(_, idx) in imagenesCarrusel"
              :key="idx"
              type="button"
              @click.stop="irASlide(idx)"
              :class="[
                'transition-all duration-300 rounded-full focus:outline-none',
                indiceActivo === idx 
                  ? 'w-6 h-1.5 bg-[#D4AF37] shadow-[0_0_10px_#D4AF37]' 
                  : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/80'
              ]"
              :aria-label="`Ir a imagen ${idx + 1}`"
            ></button>
          </div>
        </div>
      </transition>
    </Teleport>
  </main>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import { formatoTitulo } from '~/utils/formatoTexto';

const modules = [Autoplay, EffectFade];
const route = useRoute();
const supabase = useSupabaseClient()
const idiomaGlobal = useState('idiomaGlobal', () => 'es')
const componenteActivo = ref(false)

// Estados de control del carrusel y lightbox
const swiperInstancia = ref(null)
const indiceActivo = ref(0)
const lightboxAbierto = ref(false)
const autoPlayActivo = ref(true)

const traducciones = {
  es: { acquireBtn: 'Solicitar Adquisición', techniqueLabel: 'Técnica', dimensionsLabel: 'Dimensión', valueLabel: 'Valor', contactLabel: 'Contacto', infoLabel: 'Info detallada' },
  en: { acquireBtn: 'Request Acquisition', techniqueLabel: 'Technique', dimensionsLabel: 'Dimensions', valueLabel: 'Value', contactLabel: 'Contact', infoLabel: 'Detailed info' },
  fr: { acquireBtn: 'Demander l\'acquisition', techniqueLabel: 'Technique', dimensionsLabel: 'Dimensions', valueLabel: 'Valeur', contactLabel: 'Contact', infoLabel: 'Infos détaillées' },
  ja: { acquireBtn: '取得をリクエスト', techniqueLabel: '手法', dimensionsLabel: '寸法', valueLabel: '価値', contactLabel: '連絡先', infoLabel: '詳細情報' }
}

const t = computed(() => traducciones[idiomaGlobal.value] || traducciones['es'])

// Fetch SSR - Asegura que los datos estén listos antes de renderizar
const { data: obra } = await useAsyncData(
  `obra-${route.params.id}`,
  async () => {
    const { data, error } = await supabase
      .from('obras')
      .select('id, titulo, titulo_en, titulo_fr, titulo_ja, autor, tecnica, medidas, medidas_en, medidas_fr, medidas_ja, precio, imagen_1, imagen_2, imagen_3')
      .eq('id', route.params.id)
      .single()
      
    if (error) return null
    
    const imgs = [data.imagen_1, data.imagen_2, data.imagen_3].filter(Boolean);
    data.listaImagenes = imgs.length > 0 ? imgs : ['sin-imagen'];
    return data
  },
  { watch: [() => route.params.id] }
)

// Lista reactiva segura de imágenes para el carrusel
const imagenesCarrusel = computed(() => {
  if (!obra.value?.listaImagenes || obra.value.listaImagenes.length === 0) return ['sin-imagen']
  const reales = obra.value.listaImagenes.filter(img => img && img !== 'sin-imagen')
  return reales.length > 0 ? reales : ['sin-imagen']
})

const tieneMultiplesImagenes = computed(() => {
  return imagenesCarrusel.value.length > 1 && imagenesCarrusel.value[0] !== 'sin-imagen'
})

const tieneImagenesReales = computed(() => {
  return imagenesCarrusel.value.length > 0 && imagenesCarrusel.value[0] !== 'sin-imagen'
})

// Controladores de eventos del Swiper
const onSwiperInit = (swiper) => {
  swiperInstancia.value = swiper
}

const onSlideChange = (swiper) => {
  indiceActivo.value = typeof swiper.realIndex === 'number' ? swiper.realIndex : swiper.activeIndex
}

const irASlide = (idx) => {
  indiceActivo.value = idx
  autoPlayActivo.value = false
  if (!swiperInstancia.value) return
  if (typeof swiperInstancia.value.slideToLoop === 'function') {
    swiperInstancia.value.slideToLoop(idx)
  } else if (typeof swiperInstancia.value.slideTo === 'function') {
    swiperInstancia.value.slideTo(idx)
  }
}

const slideAnterior = () => {
  autoPlayActivo.value = false
  if (swiperInstancia.value) {
    swiperInstancia.value.slidePrev()
  } else {
    indiceActivo.value = (indiceActivo.value - 1 + imagenesCarrusel.value.length) % imagenesCarrusel.value.length
  }
}

const slideSiguiente = () => {
  autoPlayActivo.value = false
  if (swiperInstancia.value) {
    swiperInstancia.value.slideNext()
  } else {
    indiceActivo.value = (indiceActivo.value + 1) % imagenesCarrusel.value.length
  }
}

// Control del Lightbox / Pantalla Completa
const abrirLightbox = (idx = 0) => {
  if (!tieneImagenesReales.value) return
  irASlide(idx)
  lightboxAbierto.value = true
}

const cerrarLightbox = () => {
  lightboxAbierto.value = false
}

const onKeyDown = (e) => {
  if (!lightboxAbierto.value) return
  if (e.key === 'Escape') cerrarLightbox()
  if (e.key === 'ArrowLeft') slideAnterior()
  if (e.key === 'ArrowRight') slideSiguiente()
}

watch(lightboxAbierto, (abierto) => {
  if (import.meta.client) {
    document.body.style.overflow = abierto ? 'hidden' : ''
  }
})

const tituloPrincipal = computed(() => {
  if (!obra.value) return '';
  if (idiomaGlobal.value === 'en' && obra.value.titulo_en) return formatoTitulo(obra.value.titulo_en);
  if (idiomaGlobal.value === 'fr' && obra.value.titulo_fr) return formatoTitulo(obra.value.titulo_fr);
  if (idiomaGlobal.value === 'ja' && obra.value.titulo_ja) return obra.value.titulo_ja.trim();
  return formatoTitulo(obra.value.titulo);
})

const autorPrincipal = computed(() => {
  if (!obra.value) return '';
  return formatoTitulo(obra.value.autor);
})

const tecnicaPrincipal = computed(() => {
  if (!obra.value) return '';
  if (idiomaGlobal.value === 'en' && obra.value.medidas_en) return formatoTitulo(obra.value.medidas_en);
  if (idiomaGlobal.value === 'fr' && obra.value.medidas_fr) return formatoTitulo(obra.value.medidas_fr);
  if (idiomaGlobal.value === 'ja' && obra.value.medidas_ja) return obra.value.medidas_ja.trim();
  return formatoTitulo(obra.value.tecnica);
})

// === SEO MAESTRO PARA TENTÁCULOS (ELIMINACIÓN DE GOOGLE + WHATSAPP PERFECTO) ===
useSeoMeta({
  // Título elegante en el navegador: "Nombre de Obra | Palacio Nacional"
  title: () => obra.value ? `${tituloPrincipal.value} | Palacio Nacional` : 'Cargando Obra...',
  
  description: () => obra.value ? `Obra: ${tituloPrincipal.value} creada por ${autorPrincipal.value}. Técnica: ${tecnicaPrincipal.value}.` : 'Detalle de la obra de arte.',
  
  // LA CLAVE MAGISTRAL: Le ordena a Google desindexar y eliminar esta página de sus resultados
  robots: 'noindex, nofollow',
  
  // Open Graph optimizado para que al compartir el link en WhatsApp se vea perfecto
  ogTitle: () => obra.value ? `${tituloPrincipal.value} de ${autorPrincipal.value}` : 'Obra de Arte',
  ogDescription: () => obra.value ? `Descubre los detalles, medidas y precio de esta fascinante obra en la Galería del Palacio Nacional.` : 'Explora nuestra galería.',
  ogImage: () => obra.value?.imagen_1 && obra.value.imagen_1 !== 'sin-imagen' ? obra.value.imagen_1 : 'https://palacionacionalmedellin.com/logon.png',
  twitterCard: 'summary_large_image',
})

// === SCHEMA ESTRUCTURAL CON NOINDEX ===
useHead(() => {
  if (!obra.value) return {}
  const currentUrl = `https://palacionacionalmedellin.com/DetalleObra/${route.params.id}`
  return {
    meta: [
      { name: 'googlebot', content: 'noindex, nofollow' } // Refuerzo de seguridad para borrar de Google
    ],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "VisualArtwork",
          "name": tituloPrincipal.value,
          "image": obra.value.imagen_1,
          "creator": {
            "@type": "Person",
            "name": autorPrincipal.value
          },
          "artMedium": tecnicaPrincipal.value,
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

const preguntarPorWhatsApp = () => {
  if (!obra.value) return
  const dominio = typeof window !== 'undefined' ? window.location.origin : 'https://palacionacionalmedellin.com'
  const urlDetalle = `${dominio}/DetalleObra/${obra.value.id}`
  const precioFormat = isNaN(obra.value.precio) ? obra.value.precio : '$' + Number(obra.value.precio).toLocaleString('es-CO') + ' USD'
  const texto = `Hola Palacio, estoy interesado en adquirir esta obra:\n\n*Título:* ${tituloPrincipal.value}\n*Autor:* ${autorPrincipal.value}\n*Precio:* ${precioFormat}\n\n*Enlace:* ${urlDetalle}`
  const urlWa = `https://wa.me/573116390177?text=${encodeURIComponent(texto)}`
  if (typeof window !== 'undefined') {
    window.open(urlWa, '_blank')
  }
}

const registrarVisita = async () => {
  if (!route.params.id) return
  const claveSesion = `visita_obra_${route.params.id}`
  if (typeof window !== 'undefined' && window.sessionStorage) {
    if (sessionStorage.getItem(claveSesion)) return
    sessionStorage.setItem(claveSesion, '1')
  }

  try {
    await supabase.rpc('incrementar_visita_obra', { id_obra: route.params.id })
  } catch (e) {
    console.warn('Registro de visita no disponible:', e)
  }
}

onMounted(() => {
  componenteActivo.value = true
  registrarVisita()
  if (import.meta.client) {
    window.addEventListener('keydown', onKeyDown)
  }
})

onBeforeUnmount(() => {
  componenteActivo.value = false
  if (import.meta.client) {
    document.body.style.overflow = ''
    window.removeEventListener('keydown', onKeyDown)
  }
})

definePageMeta({
  layout: false 
})
</script>

<style scoped>
article { animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
h1 { animation: slideInLeft 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
p[itemprop="creator"] { animation: slideInRight 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
@keyframes slideInLeft { from { opacity: 0; transform: translateX(-20px); } to { opacity: 1; transform: translateX(0); } }
@keyframes slideInRight { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
.swiper-slide { width: 100% !important; height: 100% !important; overflow: hidden; background-color: #0a0a0a; position: relative; }
.swiper-slide img { width: 100% !important; height: 100% !important; object-fit: contain; object-position: center; display: block; backface-visibility: hidden; -webkit-backface-visibility: hidden; transform: translateZ(0); }

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.lightbox-fade-enter-active,
.lightbox-fade-leave-active {
  transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.lightbox-fade-enter-from,
.lightbox-fade-leave-to {
  opacity: 0;
  transform: scale(0.98);
}
</style>