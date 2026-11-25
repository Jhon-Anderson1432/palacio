<template>
  <section class="relative z-30 max-w-7xl mx-auto mb-12 bg-[#0c0c0c]/90 border border-[#D4AF37]/25 rounded-3xl p-5 sm:p-7 md:p-8 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)]" aria-label="Filtros del catálogo">
    
    <!-- FILA 1: Buscador general + Filtro de Tipo -->
    <div class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5 pb-6 border-b border-white/10">
      
      <!-- Buscador general por texto -->
      <div class="relative flex-1 max-w-xl">
        <input 
          :value="searchQuery"
          @input="$emit('update:searchQuery', $event.target.value)"
          type="text" 
          :placeholder="t.searchPlaceholder"
          class="w-full bg-[#141414] border border-white/15 focus:border-[#D4AF37] focus:bg-[#1a1a1a] rounded-full py-3.5 pl-12 pr-10 text-white text-xs md:text-sm outline-none transition-all duration-300 font-light placeholder:text-neutral-500 shadow-inner focus:ring-2 focus:ring-[#D4AF37]/20"
        />
        <span class="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-base pointer-events-none select-none">🔍</span>
        <button 
          v-if="searchQuery" 
          @click="$emit('update:searchQuery', '')"
          class="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-sm p-1 transition-colors"
          title="Limpiar búsqueda"
          aria-label="Limpiar búsqueda"
        >
          ✕
        </button>
      </div>

      <!-- Filtro por Tipo de Obra -->
      <div class="flex flex-wrap items-center gap-2 sm:gap-3">
        <span class="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-bold mr-1 select-none">
          {{ t.categoryLabel }}:
        </span>

        <button 
          @click="$emit('update:filtroTipo', 'Todos')" 
          :class="[
            'px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40',
            filtroTipo === 'Todos' 
              ? 'bg-[#D4AF37] text-black shadow-[0_0_20px_rgba(212,175,55,0.4)]' 
              : 'bg-[#181818] border border-white/10 text-neutral-300 hover:text-white hover:border-[#D4AF37]/50'
          ]"
        >
          {{ t.filterAll }}
        </button>

        <button 
          @click="$emit('update:filtroTipo', 'Pintura')" 
          :class="[
            'px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40',
            filtroTipo === 'Pintura' 
              ? 'bg-[#D4AF37] text-black shadow-[0_0_20px_rgba(212,175,55,0.4)]' 
              : 'bg-[#181818] border border-white/10 text-neutral-300 hover:text-white hover:border-[#D4AF37]/50'
          ]"
        >
          {{ t.filterPaintings }}
        </button>

        <button 
          @click="$emit('update:filtroTipo', 'Escultura')" 
          :class="[
            'px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40',
            filtroTipo === 'Escultura' 
              ? 'bg-[#D4AF37] text-black shadow-[0_0_20px_rgba(212,175,55,0.4)]' 
              : 'bg-[#181818] border border-white/10 text-neutral-300 hover:text-white hover:border-[#D4AF37]/50'
          ]"
        >
          {{ t.filterSculptures }}
        </button>
      </div>

    </div>

    <!-- FILA 2: Encabezado + Selectores secundarios -->
    <div class="pt-6">
      
      <div class="flex items-center gap-2 mb-4">
        <span class="text-[#D4AF37] text-sm select-none" aria-hidden="true"></span>
        <span class="text-[11px] uppercase tracking-[0.25em] text-[#D4AF37] font-bold select-none">
          {{ t.secondaryFiltersLabel }}
        </span>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
        
        <!-- 1. SELECTOR DE ARTISTA -->
        <div :class="['relative', dropdownArtistaAbierto ? 'z-50' : 'z-20']" ref="artistaComboboxRef">
          <div class="relative">
            <input 
              :value="busquedaArtistaTexto"
              @focus="abrirDropdownArtista"
              @input="onInputArtista"
              type="text" 
              :placeholder="filtroArtista === 'Todos' ? t.artistPlaceholder : filtroArtista"
              class="w-full bg-[#141414] border border-white/15 focus:border-[#D4AF37] rounded-2xl py-3 pl-10 pr-9 text-white text-xs outline-none transition-all font-light placeholder:text-neutral-400 shadow-inner"
              :class="{ 'border-[#D4AF37] ring-2 ring-[#D4AF37]/20': dropdownArtistaAbierto }"
            />
            <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-xs pointer-events-none select-none">👤</span>
            <button 
              type="button" 
              @click="toggleDropdownArtista"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#D4AF37] text-xs transition-transform duration-200"
              :class="{ 'rotate-180 text-[#D4AF37]': dropdownArtistaAbierto }"
              aria-label="Abrir listado de artistas"
            >
              ▼
            </button>
          </div>

          <!-- Menú desplegable con scroll de artistas -->
          <transition name="dropdown-slide">
            <div 
              v-if="dropdownArtistaAbierto" 
              class="absolute left-0 right-0 mt-2 bg-[#0d0d0d] border border-[#D4AF37]/30 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.95)] z-50 max-h-60 overflow-y-auto py-2 backdrop-blur-xl custom-scrollbar"
            >
              <button 
                type="button"
                @click="seleccionarArtista('Todos')"
                class="w-full text-left px-4 py-2.5 text-xs text-neutral-300 hover:bg-[#D4AF37]/15 hover:text-[#D4AF37] transition-colors flex items-center justify-between"
                :class="{ 'text-[#D4AF37] font-bold bg-[#D4AF37]/10': filtroArtista === 'Todos' }"
              >
                <span>{{ t.allArtists }}</span>
                <span v-if="filtroArtista === 'Todos'">✓</span>
              </button>

              <div class="h-px bg-white/10 my-1"></div>

              <div v-if="artistasFiltrados.length === 0" class="px-4 py-3 text-xs text-neutral-500 italic">
                {{ t.noArtistsFound }}
              </div>

              <button 
                v-for="artista in artistasFiltrados" 
                :key="artista"
                type="button"
                @click="seleccionarArtista(artista)"
                class="w-full text-left px-4 py-2 text-xs text-neutral-300 hover:bg-[#D4AF37]/15 hover:text-[#D4AF37] transition-colors flex items-center justify-between"
                :class="{ 'text-[#D4AF37] font-bold bg-[#D4AF37]/10': filtroArtista === artista }"
              >
                <span class="truncate">{{ artista }}</span>
                <span v-if="filtroArtista === artista">✓</span>
              </button>
            </div>
          </transition>
        </div>

        <!-- 2. SELECTOR DE TÉCNICA -->
        <div :class="['relative', dropdownTecnicaAbierto ? 'z-50' : 'z-20']" ref="tecnicaDropdownRef">
          <div class="relative">
            <button 
              type="button" 
              @click="toggleDropdownTecnica"
              class="w-full bg-[#141414] border border-white/15 hover:border-[#D4AF37]/50 focus:border-[#D4AF37] rounded-2xl py-3 pl-10 pr-9 text-white text-xs outline-none transition-all font-light shadow-inner flex items-center justify-between text-left cursor-pointer"
              :class="{ 'border-[#D4AF37] ring-2 ring-[#D4AF37]/20': dropdownTecnicaAbierto }"
              aria-label="Filtrar por técnica"
              :aria-expanded="dropdownTecnicaAbierto"
            >
              <span class="truncate" :class="{ 'text-[#D4AF37] font-medium': filtroTecnica !== 'Todos', 'text-neutral-300': filtroTecnica === 'Todos' }">
                {{ filtroTecnica === 'Todos' ? t.allTechniques : filtroTecnica }}
              </span>
            </button>
            <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-xs pointer-events-none select-none">🎨</span>
            <button
              type="button"
              @click="toggleDropdownTecnica"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#D4AF37] text-xs transition-transform duration-200 select-none"
              :class="{ 'rotate-180 text-[#D4AF37]': dropdownTecnicaAbierto }"
              aria-label="Abrir listado de técnicas"
            >
              ▼
            </button>
          </div>

          <!-- Menú desplegable con scroll de técnicas -->
          <transition name="dropdown-slide">
            <div 
              v-if="dropdownTecnicaAbierto" 
              class="absolute left-0 right-0 mt-2 bg-[#0d0d0d] border border-[#D4AF37]/30 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.95)] z-50 max-h-60 overflow-y-auto py-2 backdrop-blur-xl custom-scrollbar"
            >
              <button 
                type="button"
                @click="seleccionarTecnica('Todos')"
                class="w-full text-left px-4 py-2.5 text-xs text-neutral-300 hover:bg-[#D4AF37]/15 hover:text-[#D4AF37] transition-colors flex items-center justify-between"
                :class="{ 'text-[#D4AF37] font-bold bg-[#D4AF37]/10': filtroTecnica === 'Todos' }"
              >
                <span>{{ t.allTechniques }}</span>
                <span v-if="filtroTecnica === 'Todos'">✓</span>
              </button>

              <div class="h-px bg-white/10 my-1"></div>

              <button 
                v-for="tecnica in listaTecnicas" 
                :key="tecnica"
                type="button"
                @click="seleccionarTecnica(tecnica)"
                class="w-full text-left px-4 py-2 text-xs text-neutral-300 hover:bg-[#D4AF37]/15 hover:text-[#D4AF37] transition-colors flex items-center justify-between"
                :class="{ 'text-[#D4AF37] font-bold bg-[#D4AF37]/10': filtroTecnica === tecnica }"
              >
                <span class="truncate">{{ tecnica }}</span>
                <span v-if="filtroTecnica === tecnica">✓</span>
              </button>
            </div>
          </transition>
        </div>

        <!-- 3. SELECTOR DE PRECIO -->
        <div :class="['relative', dropdownPrecioAbierto ? 'z-50' : 'z-20']" ref="precioDropdownRef">
          <div class="relative">
            <button 
              type="button" 
              @click="toggleDropdownPrecio"
              class="w-full bg-[#141414] border border-white/15 hover:border-[#D4AF37]/50 focus:border-[#D4AF37] rounded-2xl py-3 pl-10 pr-9 text-white text-xs outline-none transition-all font-light shadow-inner flex items-center justify-between text-left cursor-pointer"
              :class="{ 'border-[#D4AF37] ring-2 ring-[#D4AF37]/20': dropdownPrecioAbierto }"
              aria-label="Filtrar por rango de precio"
              :aria-expanded="dropdownPrecioAbierto"
            >
              <span class="truncate" :class="{ 'text-[#D4AF37] font-medium': filtroPrecio !== 'Todos', 'text-neutral-300': filtroPrecio === 'Todos' }">
                {{ etiquetaPrecioActual }}
              </span>
            </button>
            <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-xs pointer-events-none select-none">🏷️</span>
            <button
              type="button"
              @click="toggleDropdownPrecio"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#D4AF37] text-xs transition-transform duration-200 select-none"
              :class="{ 'rotate-180 text-[#D4AF37]': dropdownPrecioAbierto }"
              aria-label="Abrir listado de rangos de precio"
            >
              ▼
            </button>
          </div>

          <!-- Menú desplegable de rangos de precio -->
          <transition name="dropdown-slide">
            <div 
              v-if="dropdownPrecioAbierto" 
              class="absolute left-0 right-0 mt-2 bg-[#0d0d0d] border border-[#D4AF37]/30 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.95)] z-50 max-h-60 overflow-y-auto py-2 backdrop-blur-xl custom-scrollbar"
            >
              <button 
                v-for="(opc, idx) in opcionesPrecio" 
                :key="opc.valor"
                type="button"
                @click="seleccionarPrecio(opc.valor)"
                class="w-full text-left px-4 py-2 text-xs text-neutral-300 hover:bg-[#D4AF37]/15 hover:text-[#D4AF37] transition-colors flex items-center justify-between"
                :class="{ 
                  'text-[#D4AF37] font-bold bg-[#D4AF37]/10': filtroPrecio === opc.valor,
                  'border-b border-white/10 pb-2.5 mb-1': idx === 0
                }"
              >
                <span class="truncate">{{ opc.label }}</span>
                <span v-if="filtroPrecio === opc.valor">✓</span>
              </button>
            </div>
          </transition>
        </div>

        <!-- 4. BOTÓN LIMPIAR FILTROS / CONTADOR -->
        <div>
          <button 
            v-if="hayFiltrosActivos"
            @click="$emit('limpiarFiltros')"
            class="w-full py-3 px-4 bg-white/5 hover:bg-red-500/10 border border-white/15 hover:border-red-500/40 text-neutral-300 hover:text-red-400 rounded-2xl text-xs uppercase tracking-widest font-semibold transition-all flex items-center justify-center gap-2 focus:outline-none active:scale-95"
          >
            <span class="text-sm leading-none">✕</span>
            <span>{{ t.clearFilter }}</span>
          </button>
          <div v-else class="text-center sm:text-left text-[11px] text-neutral-500 uppercase tracking-widest px-2 select-none">
            {{ totalResultados }} {{ t.resultsCount }}
          </div>
        </div>

      </div>

    </div>

  </section>
</template>

<script setup>
const props = defineProps({
  searchQuery: {
    type: String,
    default: ''
  },
  filtroTipo: {
    type: String,
    default: 'Todos'
  },
  filtroArtista: {
    type: String,
    default: 'Todos'
  },
  filtroTecnica: {
    type: String,
    default: 'Todos'
  },
  filtroPrecio: {
    type: String,
    default: 'Todos'
  },
  busquedaArtistaTexto: {
    type: String,
    default: ''
  },
  artistasFiltrados: {
    type: Array,
    default: () => []
  },
  listaTecnicas: {
    type: Array,
    default: () => []
  },
  opcionesPrecio: {
    type: Array,
    default: () => []
  },
  etiquetaPrecioActual: {
    type: String,
    default: ''
  },
  hayFiltrosActivos: {
    type: Boolean,
    default: false
  },
  totalResultados: {
    type: Number,
    default: 0
  },
  t: {
    type: Object,
    required: true
  }
})

const emit = defineEmits([
  'update:searchQuery',
  'update:filtroTipo',
  'update:filtroArtista',
  'update:filtroTecnica',
  'update:filtroPrecio',
  'update:busquedaArtistaTexto',
  'limpiarFiltros'
])

const artistaComboboxRef = ref(null)
const tecnicaDropdownRef = ref(null)
const precioDropdownRef = ref(null)

const dropdownArtistaAbierto = ref(false)
const dropdownTecnicaAbierto = ref(false)
const dropdownPrecioAbierto = ref(false)

const abrirDropdownArtista = () => {
  dropdownArtistaAbierto.value = true
  dropdownTecnicaAbierto.value = false
  dropdownPrecioAbierto.value = false
}

const toggleDropdownArtista = () => {
  dropdownArtistaAbierto.value = !dropdownArtistaAbierto.value
  if (dropdownArtistaAbierto.value) {
    dropdownTecnicaAbierto.value = false
    dropdownPrecioAbierto.value = false
  }
}

const toggleDropdownTecnica = () => {
  dropdownTecnicaAbierto.value = !dropdownTecnicaAbierto.value
  if (dropdownTecnicaAbierto.value) {
    dropdownArtistaAbierto.value = false
    dropdownPrecioAbierto.value = false
  }
}

const toggleDropdownPrecio = () => {
  dropdownPrecioAbierto.value = !dropdownPrecioAbierto.value
  if (dropdownPrecioAbierto.value) {
    dropdownArtistaAbierto.value = false
    dropdownTecnicaAbierto.value = false
  }
}

const onInputArtista = (e) => {
  emit('update:busquedaArtistaTexto', e.target.value)
  dropdownArtistaAbierto.value = true
  dropdownTecnicaAbierto.value = false
  dropdownPrecioAbierto.value = false
  if (e.target.value === '') {
    emit('update:filtroArtista', 'Todos')
  }
}

const seleccionarArtista = (artista) => {
  emit('update:filtroArtista', artista)
  emit('update:busquedaArtistaTexto', artista === 'Todos' ? '' : artista)
  dropdownArtistaAbierto.value = false
}

const seleccionarTecnica = (tecnica) => {
  emit('update:filtroTecnica', tecnica)
  dropdownTecnicaAbierto.value = false
}

const seleccionarPrecio = (precio) => {
  emit('update:filtroPrecio', precio)
  dropdownPrecioAbierto.value = false
}

const cerrarTodosLosDropdowns = () => {
  dropdownArtistaAbierto.value = false
  dropdownTecnicaAbierto.value = false
  dropdownPrecioAbierto.value = false
}

onMounted(() => {
  const handleClickFuera = (e) => {
    if (artistaComboboxRef.value && !artistaComboboxRef.value.contains(e.target)) {
      dropdownArtistaAbierto.value = false
    }
    if (tecnicaDropdownRef.value && !tecnicaDropdownRef.value.contains(e.target)) {
      dropdownTecnicaAbierto.value = false
    }
    if (precioDropdownRef.value && !precioDropdownRef.value.contains(e.target)) {
      dropdownPrecioAbierto.value = false
    }
  }
  document.addEventListener('click', handleClickFuera)
  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickFuera)
  })
})

defineExpose({
  cerrarTodosLosDropdowns
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(212, 175, 55, 0.35);
  border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(212, 175, 55, 0.6);
}

.dropdown-slide-enter-active {
  transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.dropdown-slide-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.dropdown-slide-enter-from,
.dropdown-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
