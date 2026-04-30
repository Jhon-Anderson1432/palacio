<template>
  <main class="relative min-h-screen w-full overflow-x-hidden font-sans flex flex-col bg-black">
    
    <Navbar :ocultarBuscador="true" :ocultarBotonVolver="true" :fondoTranslucido="true" />

    <video
      autoplay
      loop
      muted
      playsinline
      class="fixed top-0 left-0 w-full h-full object-cover z-0"
    >
      <source src="/fondo.mp4" type="video/mp4" />
      Tu navegador no soporta videos.
    </video>
    <div class="fixed top-0 left-0 w-full h-full bg-black/75 z-10"></div>

    <div class="relative z-20 flex-1 flex flex-col items-center justify-center min-h-screen px-4 pt-28 pb-20">
      <img 
        :src="logo" 
        alt="Palacio Logo" 
        class="w-48 md:w-64 mb-6 object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]"
      />
      <p class="text-lg md:text-xl font-light tracking-[0.2em] mb-12 text-[#D4AF37] drop-shadow-md text-center uppercase">
        {{ t.mainTitle }}
      </p>

      <div class="flex flex-col md:flex-row flex-wrap gap-4 md:gap-6 w-full max-w-5xl justify-center">
        <button @click="navegarA('exposiciones')" class="min-w-[200px] px-6 py-4 border border-[#D4AF37] bg-black/40 text-[#D4AF37] backdrop-blur-md hover:bg-[#D4AF37] hover:text-black transition-all duration-500 uppercase tracking-widest font-medium shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] flex items-center justify-center">
          <span class="text-sm">{{ t.btnGallery }}</span>
        </button>
        <button @click="navegarA('historia')" class="min-w-[200px] px-6 py-4 border border-[#D4AF37] bg-black/40 text-[#D4AF37] backdrop-blur-md hover:bg-[#D4AF37] hover:text-black transition-all duration-500 uppercase tracking-widest font-medium shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] flex items-center justify-center">
          <span class="text-sm">{{ t.btnHistory }}</span>
        </button>
        <button @click="navegarA('sedes')" class="min-w-[200px] px-6 py-4 border border-[#D4AF37] bg-black/40 text-[#D4AF37] backdrop-blur-md hover:bg-[#D4AF37] hover:text-black transition-all duration-500 uppercase tracking-widest font-medium shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] flex items-center justify-center">
          <span class="text-sm">{{ t.btnLocations }}</span>
        </button>
        <button @click="navegarA('contactos')" class="min-w-[200px] px-6 py-4 border border-[#D4AF37] bg-black/40 text-[#D4AF37] backdrop-blur-md hover:bg-[#D4AF37] hover:text-black transition-all duration-500 uppercase tracking-widest font-medium shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] flex items-center justify-center">
          <span class="text-sm">{{ t.btnContacts }}</span>
        </button>
      </div>
    </div>

    <Footer />
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from '../components/Navbar.vue' 
import Footer from '../components/footer.vue'
import logo from '@/assets/logon.png' 
import { idiomaGlobal } from '../lib/supabase'

const router = useRouter()

const navegarA = (ruta) => {
  router.push(`/${ruta}`)
}

// Diccionario de traducciones simplificado
const traducciones = {
  es: {
    mainTitle: 'El arte en movimiento',
    btnGallery: 'Galería',
    btnHistory: 'Nuestra Historia',
    btnLocations: 'Otras Sedes',
    btnContacts: 'Contactos'
  },
  en: {
    mainTitle: 'Art in motion',
    btnGallery: 'Gallery',
    btnHistory: 'Our History',
    btnLocations: 'Other Locations',
    btnContacts: 'Contacts'
  },
  fr: {
    mainTitle: 'L\'art en mouvement',
    btnGallery: 'Galerie',
    btnHistory: 'Notre Histoire',
    btnLocations: 'Autres Sites',
    btnContacts: 'Contacts'
  },
  ja: {
    mainTitle: '動く芸術',
    btnGallery: 'ギャラリー',
    btnHistory: '私たちの歴史',
    btnLocations: 'その他の場所',
    btnContacts: '連絡先'
  }
}

const t = computed(() => traducciones[idiomaGlobal.value] || traducciones['es'])
</script>