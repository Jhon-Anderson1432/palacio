<template>
  <header class="bg-[#111]/95 backdrop-blur-xl p-4 md:p-6 flex justify-between items-center border-b border-white/10 relative z-20 shadow-md">
    <div>
      <h1 class="text-[#D4AF37] font-serif text-xl md:text-2xl uppercase tracking-widest drop-shadow-sm">Toma de Pedidos</h1>
      <p class="text-xs md:text-sm text-neutral-400 uppercase mt-1 tracking-wide">
        Mesera Activa: <span class="text-white font-bold">{{ nombreMesera }}</span> ({{ localAsignado.replace(/-/g, ' ') }})
      </p>
    </div>
    <div class="flex items-center gap-3">
      <button 
        @click="$emit('abrirMesas')" 
        class="bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37]/20 hover:shadow-[0_0_15px_rgba(212,175,55,0.15)] px-4 py-3 rounded-lg text-xs md:text-sm font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-2 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
      >
        <span>Mis Mesas</span>
        <span class="bg-[#D4AF37] text-black px-2 py-0.5 rounded-full text-[10px] shadow-inner">{{ cantidadMesasActivas }}</span>
      </button>
      <button 
        @click="$emit('logout')" 
        class="text-red-500 hover:bg-red-500/10 px-4 py-3 rounded-lg text-xs md:text-sm font-bold uppercase tracking-widest transition-all duration-300 hidden md:block active:scale-95 focus:outline-none"
      >
        Salir
      </button>
    </div>
  </header>
</template>

<script setup>
defineProps({
  nombreMesera: {
    type: String,
    default: ''
  },
  localAsignado: {
    type: String,
    default: ''
  },
  cantidadMesasActivas: {
    type: Number,
    default: 0
  }
})

defineEmits(['abrirMesas', 'logout'])
</script>
