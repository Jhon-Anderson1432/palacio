<template>
  <nav
    class="sticky top-0 z-20 bg-black/80 backdrop-blur-md border-b border-white/5 p-3 sm:p-4 md:p-6 flex items-center justify-between gap-2 sm:gap-3 md:gap-6 shadow-sm w-full min-w-0">

    <button @click="$emit('toggleMenu')"
      class="shrink-0 md:hidden text-[#D4AF37] p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
      aria-label="Abrir menú de navegación">
      <svg class="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
      </svg>
    </button>

    <div v-if="pestañaActiva === 'inventario' || pestañaActiva === 'gastronomia'"
      class="flex-1 min-w-0 max-w-xl relative group">
      <input :value="searchQuery" @input="$emit('update:searchQuery', $event.target.value)" type="text"
        :placeholder="pestañaActiva === 'inventario' ? 'Buscar obra...' : 'Buscar plato...'"
        class="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-9 pr-3 sm:py-2.5 sm:pl-10 md:py-3 md:pl-12 md:pr-4 text-xs md:text-sm outline-none focus:border-[#D4AF37]/50 focus:bg-white/10 focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-300 text-white" />
      <span
        class="absolute left-3 top-2.5 sm:left-4 sm:top-3 md:left-5 md:top-3.5 text-neutral-500 group-focus-within:text-[#D4AF37] transition-colors text-xs sm:text-sm">🔍</span>
    </div>
    <div v-else class="flex-1 min-w-0">
      <h2 class="text-base sm:text-lg md:text-xl font-serif text-white truncate drop-shadow-md">
        {{ pestañaActiva === 'caja' ? 'Sistema POS' : (pestañaActiva === 'estadisticas_pos' ? 'Métricas de Ventas' :
          (pestañaActiva === 'seguridad' ? 'Control de Vigilancia' : 'Estadísticas de la Galería')) }}
      </h2>
    </div>

    <button v-if="pestañaActiva === 'inventario'" @click="$emit('abrirFormObra')"
      class="shrink-0 bg-[#D4AF37] text-black px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 rounded-full font-bold hover:bg-yellow-600 hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all duration-300 active:scale-95 text-[10px] md:text-xs uppercase tracking-widest flex items-center gap-1 sm:gap-2 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-[#D4AF37]">
      <span class="text-sm md:text-base">+</span> <span class="hidden sm:inline">AGREGAR</span> OBRA
    </button>

    <button v-if="pestañaActiva === 'gastronomia'" @click="$emit('abrirFormGastro')"
      class="shrink-0 bg-[#D4AF37] text-black px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 rounded-full font-bold hover:bg-yellow-600 hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all duration-300 active:scale-95 text-[10px] md:text-xs uppercase tracking-widest flex items-center gap-1 sm:gap-2 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-[#D4AF37]">
      <span class="text-sm md:text-base">+</span> <span class="hidden sm:inline">AGREGAR</span> PLATO
    </button>

    <button v-if="pestañaActiva === 'seguridad'" @click="$emit('abrirModalQR')"
      class="shrink-0 bg-[#D4AF37] text-black px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-3 rounded-full font-bold hover:bg-yellow-600 hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all duration-300 active:scale-95 text-[10px] md:text-xs uppercase tracking-widest flex items-center gap-1 sm:gap-2 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-[#D4AF37]">
      <span class="text-sm md:text-base">+</span> <span class="hidden sm:inline">NUEVO</span> PUNTO QR
    </button>

    <button v-if="pestañaActiva === 'caja' || pestañaActiva === 'seguridad'"
      @click="$emit('recargar')"
      class="shrink-0 p-2 sm:p-2.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/30"
      title="Actualizar datos">
      🔄
    </button>
  </nav>
</template>

<script setup>
defineProps({
  pestañaActiva: {
    type: String,
    required: true
  },
  searchQuery: {
    type: String,
    default: ''
  }
})

defineEmits(['toggleMenu', 'update:searchQuery', 'abrirFormObra', 'abrirFormGastro', 'abrirModalQR', 'recargar'])
</script>
