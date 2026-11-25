<template>
  <nav 
    v-if="totalPaginas > 1" 
    aria-label="Paginación de la galería"
    class="w-full flex flex-wrap justify-center items-center gap-2 pt-6 pb-12 select-none"
  >
    <!-- Botón Anterior -->
    <button 
      @click="$emit('cambiarPagina', paginaActual - 1)" 
      :disabled="paginaActual === 1" 
      class="flex items-center gap-1.5 px-4 py-2.5 border border-white/15 bg-[#121212] text-neutral-300 rounded-full hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-black disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[#121212] disabled:hover:border-white/15 disabled:hover:text-neutral-300 transition-all duration-300 text-xs font-semibold uppercase tracking-wider focus:outline-none active:scale-95"
      aria-label="Página anterior"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
      <span class="hidden sm:inline">{{ t.prevPage }}</span>
    </button>

    <!-- Botones Numéricos y Elipsis -->
    <template v-for="(p, idx) in paginasVisibles" :key="idx">
      <span 
        v-if="p === '...'" 
        class="w-10 h-10 flex items-center justify-center text-neutral-500 font-bold select-none text-xs"
      >
        •••
      </span>
      <button 
        v-else
        @click="$emit('cambiarPagina', p)"
        :class="[
          'w-10 h-10 rounded-full text-xs font-bold transition-all duration-300 flex items-center justify-center active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50',
          paginaActual === p 
            ? 'bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)] border border-[#D4AF37]' 
            : 'bg-[#121212] border border-white/15 text-neutral-300 hover:border-[#D4AF37]/60 hover:text-white hover:bg-white/5'
        ]"
        :aria-current="paginaActual === p ? 'page' : undefined"
        :aria-label="'Ir a la página ' + p"
      >
        {{ p }}
      </button>
    </template>

    <!-- Botón Siguiente -->
    <button 
      @click="$emit('cambiarPagina', paginaActual + 1)" 
      :disabled="paginaActual === totalPaginas" 
      class="flex items-center gap-1.5 px-4 py-2.5 border border-white/15 bg-[#121212] text-neutral-300 rounded-full hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-black disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[#121212] disabled:hover:border-white/15 disabled:hover:text-neutral-300 transition-all duration-300 text-xs font-semibold uppercase tracking-wider focus:outline-none active:scale-95"
      aria-label="Página siguiente"
    >
      <span class="hidden sm:inline">{{ t.nextPage }}</span>
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
    </button>
  </nav>
</template>

<script setup>
defineProps({
  paginaActual: {
    type: Number,
    required: true
  },
  totalPaginas: {
    type: Number,
    required: true
  },
  paginasVisibles: {
    type: Array,
    required: true
  },
  t: {
    type: Object,
    required: true
  }
})

defineEmits(['cambiarPagina'])
</script>
