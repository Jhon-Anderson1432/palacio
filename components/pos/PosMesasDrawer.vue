<template>
  <div>
    <div v-if="abierto" @click="$emit('cerrar')" class="fixed inset-0 bg-black/80 z-[100] backdrop-blur-md transition-opacity" aria-hidden="true"></div>
    
    <aside 
      :class="[
        'fixed top-0 right-0 bottom-0 w-full md:w-[400px] bg-[#111] border-l border-white/10 z-[110] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.9)]', 
        abierto ? 'translate-x-0' : 'translate-x-full'
      ]"
      aria-label="Panel de mesas activas"
    >
      <header class="p-5 md:p-6 border-b border-white/10 flex justify-between items-center bg-black">
        <h2 class="text-[#D4AF37] font-serif text-xl md:text-2xl uppercase tracking-widest drop-shadow-md">Mis Mesas Activas</h2>
        <button @click="$emit('cerrar')" class="text-neutral-500 hover:text-white hover:bg-white/10 p-2.5 bg-white/5 rounded-full transition-colors active:scale-90 focus:outline-none">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </header>

      <div class="flex-1 overflow-y-auto p-5 md:p-6 space-y-4">
        <div v-if="cargando" class="text-center py-10 text-[#D4AF37] text-xs uppercase tracking-widest animate-pulse font-bold">Sincronizando mesas...</div>
        
        <div v-else-if="ordenesActivas.length === 0" class="text-center py-12 text-neutral-500 text-xs uppercase tracking-widest border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
          No tienes mesas pendientes por cobrar.
        </div>

        <article 
          v-else 
          v-for="orden in ordenesActivas" 
          :key="orden.mesa" 
          @click="$emit('seleccionarOrden', orden)" 
          class="bg-[#050505] border border-[#D4AF37]/30 p-5 rounded-2xl cursor-pointer hover:border-[#D4AF37] hover:shadow-[0_8px_25px_rgba(212,175,55,0.15)] transition-all duration-300 flex flex-col justify-between group active:scale-[0.98]"
        >
          <div class="flex justify-between items-start mb-3">
            <h3 class="text-xl font-serif text-white group-hover:text-[#D4AF37] transition-colors">Mesa {{ orden.mesa }}</h3>
            <span class="bg-yellow-500/10 text-yellow-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-yellow-500/30 shadow-sm">
              Pendiente
            </span>
          </div>
          <div class="text-xs text-neutral-400 uppercase tracking-widest mb-4">
            Abierta: {{ new Date(orden.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}
          </div>
          <div class="flex justify-between items-center border-t border-white/10 pt-4 mt-auto">
            <span class="text-xs text-neutral-500 uppercase tracking-widest font-bold">Total Acumulado</span>
            <span class="text-xl md:text-2xl font-serif text-[#D4AF37]">${{ orden.total.toLocaleString('es-CO') }}</span>
          </div>
          <div class="mt-4 text-center text-[10px] text-[#D4AF37]/60 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity font-bold">
            Tocar para editar / adicionar
          </div>
        </article>
      </div>
    </aside>
  </div>
</template>

<script setup>
defineProps({
  abierto: {
    type: Boolean,
    default: false
  },
  cargando: {
    type: Boolean,
    default: false
  },
  ordenesActivas: {
    type: Array,
    default: () => []
  }
})

defineEmits(['cerrar', 'seleccionarOrden'])
</script>
