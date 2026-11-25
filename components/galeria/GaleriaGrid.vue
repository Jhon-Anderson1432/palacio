<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mb-12">
    <article 
      v-for="(obra, index) in obras" 
      :key="obra.id" 
      itemscope itemtype="https://schema.org/VisualArtwork"
      class="obra-card group bg-neutral-900/40 border border-white/5 rounded-3xl overflow-hidden hover:border-[#D4AF37]/40 hover:bg-neutral-900/80 hover:shadow-[0_15px_40px_rgba(212,175,55,0.15)] transition-all duration-500 flex flex-col relative"
    >
      
      <div class="absolute top-4 left-4 z-10 bg-black/70 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest">
        {{ obra.tipo === 'Escultura' ? t.sculptureLabel : t.paintingLabel }}
      </div>

      <figure class="relative aspect-square overflow-hidden bg-black/50">
        <!-- FALLBACK SSR PARA SEO: Google verá esta imagen nativa en el HTML inicial -->
        <div v-if="!componenteActivo" class="w-full h-full relative flex items-center justify-center bg-neutral-950">
          <NuxtImg 
            v-if="obra.listaImagenes[0] !== 'sin-imagen'" 
            :src="obra.listaImagenes[0]" 
            :alt="`${obtenerTitulo(obra)} - Arte en Palacio Nacional Medellín`" 
            itemprop="image" 
            class="w-full h-full object-cover"
          />
          <div v-else class="text-neutral-600 text-xs uppercase tracking-widest">Sin Imagen</div>
        </div>
        
        <!-- SWIPER INTERACTIVO PARA EL USUARIO -->
        <swiper
          v-else
          :modules="modules"
          :slides-per-view="1"
          :loop="obra.listaImagenes.length > 1"
          :autoplay="obra.listaImagenes.length > 1 ? { delay: 3500, disableOnInteraction: false } : false"
          effect="fade"
          class="w-full h-full"
        >
          <swiper-slide v-for="(img, idx) in obra.listaImagenes" :key="idx" class="w-full h-full bg-neutral-950 overflow-hidden relative flex items-center justify-center">
            <NuxtImg 
              v-if="img !== 'sin-imagen'" 
              :src="img" 
              :alt="`${obtenerTitulo(obra)} - Galería Palacio Nacional Medellín`" 
              itemprop="image" 
              :loading="index < 3 && idx === 0 ? 'eager' : 'lazy'" 
              class="w-full h-full object-cover select-none"
            />
            <div v-else class="text-neutral-600 text-xs uppercase tracking-widest">Sin Imagen</div>
          </swiper-slide>
        </swiper>
      </figure>

      <!-- Información de la Obra -->
      <div class="p-6 md:p-8 flex-1 flex flex-col justify-between">
        <div>
          <h2 itemprop="name" class="text-2xl font-serif text-white group-hover:text-[#D4AF37] transition-colors duration-300 mb-2 leading-tight">
            {{ obtenerTitulo(obra) }}
          </h2>
          <p itemprop="creator" class="text-xs uppercase tracking-widest text-neutral-400 font-light mb-6">
            {{ t.by }} <span class="text-white font-medium">{{ obra.autor }}</span>
          </p>

          <div class="grid grid-cols-2 gap-4 py-4 border-y border-white/10 mb-6">
            
            <div class="text-left">
              <span class="text-[9px] uppercase text-[#D4AF37] tracking-[0.2em] font-bold block mb-1.5">{{ t.techniqueLabel }}</span>
              <p itemprop="artMedium" class="text-xs text-neutral-300 font-medium line-clamp-2 leading-relaxed lowercase">{{ obtenerTecnica(obra) }}</p>
            </div>

            <div class="text-left border-l border-white/10 pl-4">
              <span class="text-[9px] uppercase text-[#D4AF37] tracking-[0.2em] font-bold block mb-1.5">{{ t.dimensionsLabel }}</span>
              <p itemprop="artDimensions" class="text-xs text-neutral-300 font-medium line-clamp-2 leading-relaxed lowercase">{{ obra.medidas }}</p>
            </div>

          </div>
        </div>

        <div class="mt-auto flex items-center justify-between">
          <span itemprop="offers" itemscope itemtype="https://schema.org/Offer" class="text-xl md:text-2xl font-serif text-white tracking-wider flex items-baseline">
            <meta itemprop="priceCurrency" content="USD" />
            <meta itemprop="price" :content="isNaN(obra.precio) ? '0' : String(obra.precio).replace(/[^0-9.]/g, '')" />
            {{ isNaN(obra.precio) ? obra.precio : '$' + Number(obra.precio).toLocaleString('es-CO') }}
            <span class="text-[10px] text-neutral-500 ml-1 font-sans font-bold uppercase tracking-widest">USD</span>
          </span>

          <!-- ENLACE A DETALLE DE LA OBRA -->
          <NuxtLink 
            :to="'/DetalleObra/' + obra.id" 
            class="flex items-center justify-center px-6 py-3 border border-white/20 bg-white/5 text-white rounded-full hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-black focus:ring-2 focus:ring-[#D4AF37]/50 focus:outline-none transition-all duration-300 shadow-lg active:scale-95"
          >
            <span class="text-[10px] font-bold uppercase tracking-widest leading-none">{{ t.detailsBtn }}</span>
          </NuxtLink>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';

const props = defineProps({
  obras: {
    type: Array,
    required: true
  },
  componenteActivo: {
    type: Boolean,
    default: false
  },
  idiomaGlobal: {
    type: String,
    default: 'es'
  },
  t: {
    type: Object,
    required: true
  }
})

const modules = [Autoplay, EffectFade];

const obtenerTitulo = (obra) => {
  if (props.idiomaGlobal === 'en' && obra.titulo_en) return obra.titulo_en;
  if (props.idiomaGlobal === 'fr' && obra.titulo_fr) return obra.titulo_fr;
  if (props.idiomaGlobal === 'ja' && obra.titulo_ja) return obra.titulo_ja;
  return obra.titulo; 
}

const obtenerTecnica = (obra) => {
  if (props.idiomaGlobal === 'en' && obra.tecnica_en) return obra.tecnica_en;
  if (props.idiomaGlobal === 'fr' && obra.tecnica_fr) return obra.tecnica_fr;
  if (props.idiomaGlobal === 'ja' && obra.tecnica_ja) return obra.tecnica_ja;
  return obra.tecnica; 
}
</script>

<style scoped>
.obra-card {
  animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.obra-card:nth-child(1) { animation-delay: 0.05s; }
.obra-card:nth-child(2) { animation-delay: 0.1s; }
.obra-card:nth-child(3) { animation-delay: 0.15s; }
.obra-card:nth-child(4) { animation-delay: 0.2s; }
.obra-card:nth-child(5) { animation-delay: 0.25s; }
.obra-card:nth-child(6) { animation-delay: 0.3s; }

@keyframes slideUpFade {
  from { 
    opacity: 0; 
    transform: translateY(40px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
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
  object-fit: cover;
  object-position: center;
  display: block;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform: translateZ(0);
}
</style>
