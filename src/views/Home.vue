<template>
  <main class="relative h-screen w-full overflow-hidden font-sans">
    <video
      autoplay
      loop
      muted
      playsinline
      class="absolute top-0 left-0 w-full h-full object-cover z-0"
    >
      <source src="/fondo.mp4" type="video/mp4" />
      Tu navegador no soporta videos.
    </video>

    <div class="absolute top-0 left-0 w-full h-full bg-black/75 z-10"></div>

    <div class="relative z-20 flex flex-col items-center justify-center h-full px-4">
      
      <img 
        :src="logo" 
        alt="Palacio Logo" 
        class="w-48 md:w-64 mb-6 object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]"
      />

      <p class="text-lg md:text-xl font-light tracking-[0.2em] mb-12 text-[#D4AF37] drop-shadow-md text-center uppercase flex flex-col gap-1 items-center">
        <span>El arte en movimiento</span>
        <span class="text-[10px] tracking-[0.3em] opacity-70">Art in motion</span>
      </p>

      <div class="flex flex-col md:flex-row flex-wrap gap-4 md:gap-6 w-full max-w-5xl justify-center">
        
        <button 
          @click="navegarA('exposiciones')" 
          class="min-w-[200px] px-6 py-3 border border-[#D4AF37] bg-black/40 text-[#D4AF37] backdrop-blur-md hover:bg-[#D4AF37] hover:text-black transition-all duration-500 uppercase tracking-widest font-medium shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] flex flex-col items-center justify-center gap-1"
        >
          <span class="text-sm">Galería</span>
          <span class="text-[9px] tracking-[0.2em] opacity-75 font-light">Gallery</span>
        </button>

        <button 
          @click="navegarA('historia')" 
          class="min-w-[200px] px-6 py-3 border border-[#D4AF37] bg-black/40 text-[#D4AF37] backdrop-blur-md hover:bg-[#D4AF37] hover:text-black transition-all duration-500 uppercase tracking-widest font-medium shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] flex flex-col items-center justify-center gap-1"
        >
          <span class="text-sm">Nuestra Historia</span>
          <span class="text-[9px] tracking-[0.2em] opacity-75 font-light">Our History</span>
        </button>

        <button 
          @click="navegarA('sedes')" 
          class="min-w-[200px] px-6 py-3 border border-[#D4AF37] bg-black/40 text-[#D4AF37] backdrop-blur-md hover:bg-[#D4AF37] hover:text-black transition-all duration-500 uppercase tracking-widest font-medium shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] flex flex-col items-center justify-center gap-1"
        >
          <span class="text-sm">Otras Sedes</span>
          <span class="text-[9px] tracking-[0.2em] opacity-75 font-light">Other Locations</span>
        </button>

        <button 
          @click="navegarA('contactos')" 
          class="min-w-[200px] px-6 py-3 border border-[#D4AF37] bg-black/40 text-[#D4AF37] backdrop-blur-md hover:bg-[#D4AF37] hover:text-black transition-all duration-500 uppercase tracking-widest font-medium shadow-[0_0_15px_rgba(212,175,55,0.1)] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] flex flex-col items-center justify-center gap-1"
        >
          <span class="text-sm">Contactos</span>
          <span class="text-[9px] tracking-[0.2em] opacity-75 font-light">Contacts</span>
        </button>

      </div>
    </div>
  </main>
</template>

<script setup>
import { useRouter } from 'vue-router'
import logo from '@/assets/logon.png' 

const router = useRouter()

const navegarA = (ruta) => {
  router.push(`/${ruta}`)
}
</script>

<style scoped>
button {
  backface-visibility: hidden;
  transform: translateZ(0);
}
</style>