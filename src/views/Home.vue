<template>
  <section class="relative h-screen flex items-center justify-center overflow-hidden">

    <video 
      src="/fondo.mp4" 
      autoplay 
      loop 
      muted 
      playsinline 
      class="absolute inset-0 z-0 w-full h-full object-cover"
    ></video>
    
    <div class="absolute inset-0 bg-black/40 z-10"></div>
    
    <div class="relative z-20 flex flex-col items-center">
      
      <router-link 
        to="/exposiciones" 
        class="group flex flex-col items-center transition-all duration-700 hover:scale-105 active:scale-95"
      >
        <img 
          src="@/assets/logon.png" 
          alt="Palacio Nacional Galería" 
          class="w-[220px] md:w-[300px] lg:w-[380px] drop-shadow-2xl transition-all"
        />
        
        <span class="mt-8 text-yellow-500 text-[10px] md:text-xs font-bold uppercase tracking-[0.4em] opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          Entrar a la Galería
        </span>
      </router-link>

    </div>

  </section>
</template>

<script setup>
// Aquí no necesitas mucha lógica por ahora, el router-link hace el trabajo pesado.
</script>