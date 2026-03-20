<template>
  <section class="relative h-screen">

    <!-- Imagen de fondo -->
    <video 
      src="/fondo.mp4" 
      autoplay 
      loop 
      muted 
      playsinline 
      class="fixed inset-0 -z-10 w-full h-full object-cover"
    ></video>
    
    <div>
    <button src="../views/Exposiciones.vue"
    class="relative group text-white font-medium py-2">
     <span>Exposiciones</span>
     <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full"></span>
    </button>
    </div>

  </section>
</template>