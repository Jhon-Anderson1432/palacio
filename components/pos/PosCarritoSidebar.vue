<template>
  <aside 
    class="w-full md:w-[380px] lg:w-[420px] bg-[#111] h-[100dvh] flex flex-col fixed md:relative bottom-0 z-50 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform md:translate-y-0 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] md:shadow-[-10px_0_30px_rgba(0,0,0,0.5)] border-l border-white/10" 
    :class="mostrarMovil ? 'translate-y-0' : 'translate-y-[85dvh]'"
    aria-label="Ticket de la orden actual"
  >
    <div 
      @click="$emit('toggleMovil')" 
      class="md:hidden bg-[#D4AF37] p-4 text-center text-black font-bold uppercase text-sm flex justify-between items-center rounded-t-3xl shadow-[0_-5px_20px_rgba(212,175,55,0.4)] cursor-pointer active:bg-yellow-500 transition-colors"
    >
      <span>{{ ordenActualId ? 'Editando Mesa' : 'Ver Ticket de Mesa' }}</span>
      <span class="bg-black text-[#D4AF37] px-3 py-1 rounded-full text-xs shadow-inner">{{ carrito.length }} ítems</span>
    </div>

    <div class="p-5 md:p-6 border-b border-white/10 bg-black relative">
      <button @click="$emit('logout')" class="absolute top-5 right-5 text-red-500 hover:text-red-400 p-2 md:hidden active:scale-90 transition-transform focus:outline-none">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
      </button>
      <label for="inputMesa" class="text-xs md:text-sm text-neutral-400 uppercase font-bold tracking-widest block text-center">
        {{ ordenActualId ? 'Editando Mesa (Bloqueado)' : 'Número de Mesa / Cliente' }}
      </label>
      <input 
        id="inputMesa"
        :value="mesaActual"
        @input="$emit('update:mesaActual', $event.target.value)"
        type="text" 
        placeholder="Ej: Mesa 4" 
        :disabled="ordenActualId !== null" 
        class="w-full bg-white/5 border border-[#D4AF37]/30 p-4 md:p-5 rounded-xl focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 text-white outline-none mt-3 text-center text-xl md:text-2xl font-bold font-serif disabled:opacity-50 disabled:bg-black transition-all duration-300 placeholder:text-neutral-600 shadow-inner" 
      />
    </div>

    <div class="flex-1 overflow-y-auto p-4 md:p-5 space-y-4 relative bg-[#0a0a0a]">
      <transition name="fade">
        <div v-if="cargandoEdicion" class="absolute inset-0 bg-black/70 backdrop-blur-xl z-10 flex items-center justify-center">
          <span class="text-[#D4AF37] animate-pulse text-xs uppercase tracking-widest font-bold">Cargando pedido...</span>
        </div>
      </transition>

      <div v-if="carrito.length === 0" class="text-center text-neutral-500 text-sm uppercase tracking-widest mt-12 px-4 font-bold border border-dashed border-white/10 p-6 rounded-2xl bg-white/[0.02]">
        Selecciona platos en el menú para iniciar la orden
      </div>

      <transition-group name="list" tag="div" class="space-y-4">
        <article v-for="(item, index) in carrito" :key="item.id_unico" class="bg-[#111] border border-white/5 p-4 md:p-5 rounded-2xl shadow-sm">
          <div class="flex justify-between items-start mb-5">
            <h4 class="text-base md:text-lg font-bold text-white w-2/3 leading-tight">{{ item.producto.nombre }}</h4>
            <span class="text-[#D4AF37] text-sm md:text-base font-bold">${{ (item.producto.precio * item.cantidad).toLocaleString('es-CO') }}</span>
          </div>
          
          <div class="flex items-center gap-3 md:gap-4 mb-5">
            <button @click="$emit('modificarCantidad', index, -1)" class="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white flex items-center justify-center font-bold text-xl active:scale-90 transition-all focus:outline-none">-</button>
            <span class="w-8 text-center text-base md:text-lg font-bold">{{ item.cantidad }}</span>
            <button @click="$emit('modificarCantidad', index, 1)" class="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 hover:bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center font-bold text-xl active:scale-90 transition-all focus:outline-none">+</button>
            <button @click="$emit('eliminarItem', index)" class="ml-auto text-red-500 hover:bg-red-500/10 p-3 rounded-xl text-lg md:text-xl active:scale-90 transition-all focus:outline-none" aria-label="Eliminar ítem">🗑️</button>
          </div>

          <input 
            :value="item.notas"
            @input="$emit('actualizarNota', index, $event.target.value)"
            type="text" 
            placeholder="Notas (Ej: Sin cebolla...)" 
            class="w-full bg-white/5 border border-white/10 p-3.5 rounded-xl text-xs md:text-sm text-white focus:border-[#D4AF37]/50 focus:bg-white/10 focus:ring-2 focus:ring-[#D4AF37]/20 outline-none placeholder:text-neutral-600 italic transition-all duration-300 shadow-inner" 
          />
        </article>
      </transition-group>
    </div>

    <footer class="p-5 md:p-6 bg-[#050505] border-t border-white/10 shadow-[0_-15px_30px_rgba(0,0,0,0.6)] z-10 relative">
      <div class="flex justify-between items-center mb-5 md:mb-6">
        <span class="text-sm text-neutral-400 uppercase tracking-widest font-bold">Total a Pagar</span>
        <span class="text-3xl md:text-4xl font-serif text-[#D4AF37]">${{ totalCarrito.toLocaleString('es-CO') }}</span>
      </div>
      
      <div class="flex gap-3 md:gap-4">
        <button 
          v-if="!ordenActualId" 
          @click="$emit('cancelar')" 
          class="w-1/3 py-4 md:py-5 rounded-xl border border-red-500/30 text-red-500 text-xs md:text-sm uppercase font-bold tracking-widest hover:bg-red-500/10 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-red-500/30"
        >
          Cancelar
        </button>
        <button 
          v-else 
          @click="$emit('volver')" 
          class="w-1/3 py-4 md:py-5 rounded-xl border border-neutral-500/30 text-neutral-400 text-xs md:text-sm uppercase font-bold tracking-widest hover:bg-neutral-500/10 hover:text-white active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-white/20"
        >
          Volver
        </button>
        
        <button 
          @click="$emit('enviar')" 
          :disabled="enviando || carrito.length === 0 || !mesaActual" 
          :class="[
            'flex-1 py-4 md:py-5 rounded-xl text-black text-xs md:text-sm uppercase font-bold tracking-widest transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-yellow-500/50', 
            (carrito.length === 0 || !mesaActual) 
              ? 'bg-neutral-800 cursor-not-allowed opacity-50 text-neutral-500' 
              : 'bg-[#D4AF37] hover:bg-yellow-500 shadow-[0_5px_20px_rgba(212,175,55,0.4)] active:scale-95 hover:shadow-[0_8px_25px_rgba(212,175,55,0.6)]'
          ]"
        >
          {{ enviando ? 'Enviando...' : (ordenActualId ? 'Actualizar Mesa' : 'Mandar a Caja') }}
        </button>
      </div>
    </footer>
  </aside>
</template>

<script setup>
defineProps({
  mostrarMovil: {
    type: Boolean,
    default: false
  },
  ordenActualId: {
    type: [Array, Number, String, null],
    default: null
  },
  mesaActual: {
    type: String,
    default: ''
  },
  cargandoEdicion: {
    type: Boolean,
    default: false
  },
  carrito: {
    type: Array,
    default: () => []
  },
  totalCarrito: {
    type: Number,
    default: 0
  },
  enviando: {
    type: Boolean,
    default: false
  }
})

defineEmits([
  'toggleMovil',
  'update:mesaActual',
  'logout',
  'modificarCantidad',
  'eliminarItem',
  'actualizarNota',
  'cancelar',
  'volver',
  'enviar'
])
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active { transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.fade-enter-from,
.fade-leave-to { opacity: 0; transform: scale(0.98); }

.list-enter-active,
.list-leave-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.list-enter-from,
.list-leave-to { opacity: 0; transform: translateX(-20px); }

input:disabled { cursor: not-allowed; }
</style>
