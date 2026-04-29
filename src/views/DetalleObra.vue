<template>
  <div class="min-h-screen w-full bg-black text-white flex flex-col overflow-y-auto font-sans pb-20 relative pt-24">
    
    <Navbar :ocultarBuscador="true" rutaVolver="/exposiciones" />
    
    <div class="fixed bottom-0 right-0 w-32 h-32 z-0 pointer-events-none">
      <div class="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-[#D4AF37]/20 to-transparent"></div>
      <div class="absolute bottom-[-20px] right-[-40px] w-[150%] h-20 bg-black rotate-[-45deg] border-t border-[#D4AF37]/50"></div>
    </div>

    <div v-if="obra" class="flex-1 flex flex-col max-w-xl mx-auto w-full relative z-10">
      
      <div class="w-full relative z-[100] border-b-[2px] border-b-[#D4AF37]/50 pt-6">
        <img 
          src="@/assets/logoni.png" 
          alt="Palacio Nacional Galería Header" 
          class="w-full h-auto block"
        />
      </div>

      <div class="flex-1 flex-col px-4 pt-4">

        <div class="w-full relative bg-black my-4 group overflow-hidden rounded-lg">
          <div class="absolute -inset-1 bg-[#D4AF37]/10 blur-xl opacity-50"></div>
          
          <div class="relative w-full aspect-square md:aspect-[4/3] z-10">
            <swiper
              :modules="modules"
              :slides-per-view="1"
              :loop="true"
              :autoplay="{ delay: 4000, disableOnInteraction: false }"
              effect="fade"
              class="w-full h-full"
            >
              <swiper-slide v-if="obra.imagen_1"><img :src="obra.imagen_1" class="w-full h-full object-contain bg-black"></swiper-slide>
              <swiper-slide v-if="obra.imagen_2"><img :src="obra.imagen_2" class="w-full h-full object-contain bg-black"></swiper-slide>
              <swiper-slide v-if="obra.imagen_3"><img :src="obra.imagen_3" class="w-full h-full object-contain bg-black"></swiper-slide>
              
              <swiper-slide v-if="!obra.imagen_1 && !obra.imagen_2 && !obra.imagen_3">
                <div class="w-full h-full flex items-center justify-center bg-neutral-900 text-neutral-500">Sin Imagen</div>
              </swiper-slide>
            </swiper>
          </div>
        </div>

        <div class="text-center space-y-2 mb-6">
          <h1 class="text-3xl md:text-4xl font-serif text-white leading-tight lowercase capitalize">{{ tituloPrincipal }}</h1>
          <p class="text-xl md:text-2xl text-neutral-200 pt-1 font-serif lowercase capitalize">{{ obra.autor }}</p>
        </div>

        <div class="max-w-sm mx-auto space-y-3 mb-8 border-t border-white/5 pt-6 text-center">
          <p class="text-xs sm:text-sm">
            <span class="text-neutral-400">{{ t.techniqueLabel }}:</span> 
            <span class="text-white lowercase capitalize"> {{ tecnicaPrincipal }}</span>
          </p>
          <p class="text-xs sm:text-sm">
            <span class="text-neutral-400">{{ t.dimensionsLabel }}:</span> 
            <span class="text-white lowercase">{{ obra.medidas }}</span>
          </p>
          <p class="text-xs sm:text-sm">
            <span class="text-neutral-400">{{ t.valueLabel }}:</span> 
            <span class="text-white">{{ isNaN(obra.precio) ? obra.precio : Number(obra.precio).toLocaleString() }} USD</span>
          </p>
          <p class="text-[10px] xs:text-xs sm:text-sm mt-4 pt-2 border-t border-white/5 inline-block w-full">
            <span class="text-[#D4AF37]/70 uppercase tracking-widest">{{ t.contactLabel }}:</span> 
            <span class="text-white font-mono ml-2">3116390177</span>
          </p>
          <p class="text-[10px] xs:text-xs sm:text-sm">
            <span class="text-[#D4AF37]/70 uppercase tracking-widest">{{ t.infoLabel }}:</span> 
            <span class="text-white font-mono ml-2">3104470369</span>
          </p>
        </div>

        <div class="mt-auto px-4">
          <button 
            @click="preguntarPorWhatsApp"
            class="flex items-center justify-center w-full py-4 bg-transparent border border-[#D4AF37] text-[#D4AF37] font-bold hover:bg-[#D4AF37] hover:text-black transition-all duration-300"
          >
            <span class="uppercase tracking-[0.2em] text-xs">{{ t.acquireBtn }}</span>
          </button>
        </div>

      </div>

    </div>

    <div v-else class="h-screen flex flex-col items-center justify-center bg-black">
      <div class="w-12 h-12 border-2 border-[#D4AF37] border-t-transparent animate-spin rounded-full"></div>
    </div>

  </div>
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

// --- DICCIONARIO ACTUALIZADO (Con Contacto e Info) ---
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

h1, p {
  animation: fadeIn 1.2s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>