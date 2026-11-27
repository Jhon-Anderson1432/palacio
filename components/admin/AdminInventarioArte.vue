<template>
  <div class="w-full">
    <!-- Header del Catálogo -->
    <header class="mb-8 md:mb-12 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div>
        <h1 class="text-3xl md:text-4xl font-serif text-white">Gestión de Catálogo</h1>
        <p class="text-neutral-500 text-[10px] md:text-xs mt-2 uppercase tracking-[0.2em]">
          {{ totalObrasCount }} obras en inventario • Página {{ paginaActualObras }} de {{ totalPaginasObras }}
        </p>
      </div>

      <!-- Selector de límite por página y botón recargar -->
      <div class="flex items-center gap-3">
        <span class="text-[10px] uppercase tracking-widest text-neutral-400 font-semibold select-none">Mostrar:</span>
        <select :value="limiteObrasPorPagina" @change="cambiarLimiteObras($event.target.value)"
          class="bg-black border border-white/15 hover:border-[#D4AF37]/50 focus:border-[#D4AF37] text-white text-xs px-3 py-1.5 rounded-xl outline-none cursor-pointer transition-colors"
          aria-label="Obras por página">
          <option :value="12">12 obras</option>
          <option :value="24">24 obras</option>
          <option :value="48">48 obras</option>
        </select>
        <button @click="fetchObras(false)"
          class="p-2 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#D4AF37]/50 text-neutral-300 hover:text-white rounded-xl text-xs transition-colors"
          title="Actualizar catálogo" aria-label="Actualizar catálogo">
          🔄
        </button>
      </div>
    </header>

    <!-- Loader de carga -->
    <div v-if="cargando"
      class="text-center py-20 text-neutral-500 animate-pulse text-xs uppercase tracking-widest flex flex-col items-center justify-center gap-3">
      <div class="animate-spin rounded-full h-8 w-8 border-2 border-[#D4AF37] border-t-transparent"></div>
      <span>Cargando obras...</span>
    </div>

    <!-- Grid de Obras -->
    <div v-else-if="obrasFiltradas.length > 0">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        <div v-for="obra in obrasFiltradas" :key="obra.id"
          class="bg-neutral-900 border border-white/5 rounded-3xl p-4 md:p-5 hover:border-[#D4AF37]/30 transition-all duration-300 relative shadow-lg group">
          <div class="relative mb-5 overflow-hidden rounded-2xl aspect-square bg-black shadow-inner">
            <NuxtImg v-if="obra.imagen_1" :src="obra.imagen_1"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
              loading="lazy" />
            <div v-else class="w-full h-full flex items-center justify-center text-neutral-600 text-xs">Sin Imagen</div>

            <div
              class="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] text-[#D4AF37] font-bold uppercase tracking-tighter shadow-sm">
              {{ obra.precio }}</div>
            <div
              class="absolute top-3 left-3 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[8px] text-white font-bold uppercase tracking-widest shadow-sm">
              {{ obra.tipo || 'Pintura' }}</div>

            <!-- Badge Contador de Vistas -->
            <div
              class="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[10px] text-neutral-300 font-medium flex items-center gap-1.5 shadow-sm group-hover:border-[#D4AF37]/40 transition-colors">
              <span class="text-xs">👁️</span>
              <span class="font-bold text-white">{{ obra.visitas || 0 }}</span>
              <span class="text-[8px] uppercase tracking-wider text-neutral-400">vistas</span>
            </div>
          </div>
          <div class="space-y-3">
            <h3
              class="text-white font-serif text-xl leading-tight group-hover:text-[#D4AF37] transition-colors duration-300">
              {{ formatoTitulo(obra.titulo) }}</h3>
            <p v-if="obra.titulo_en" class="text-neutral-500 text-[10px] italic -mt-2">{{
              formatoTitulo(obra.titulo_en) }}
            </p>
            <p class="text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.2em]">{{
              formatoTitulo(obra.autor) }}</p>
          </div>
          <div class="flex gap-2 mt-6 pt-4 border-t border-white/5">
            <button @click="openForm(obra)"
              class="flex-1 p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/30">Editar</button>
            <button @click="deleteObra(obra)"
              class="p-2 border border-red-500/30 text-red-500 hover:bg-red-500/10 rounded-xl text-[10px] font-bold uppercase transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500/50">Eliminar</button>
          </div>
        </div>
      </div>

      <!-- CONTROLES DE PAGINACIÓN NUMÉRICA -->
      <div v-if="totalPaginasObras > 1"
        class="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
        <span class="text-xs text-neutral-400 font-light">
          Mostrando <strong class="text-white">{{ (paginaActualObras - 1) * limiteObrasPorPagina + 1 }}</strong> -
          <strong class="text-white">{{ Math.min(paginaActualObras * limiteObrasPorPagina, totalObrasCount) }}</strong> de
          <strong class="text-[#D4AF37]">{{ totalObrasCount }}</strong> obras
        </span>

        <nav aria-label="Paginación de inventario" class="flex flex-wrap items-center gap-1.5">
          <!-- Botón Anterior -->
          <button @click="irAPaginaObras(paginaActualObras - 1)" :disabled="paginaActualObras === 1"
            class="px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider border border-white/10 bg-white/5 text-neutral-300 hover:border-[#D4AF37]/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-white/10 disabled:hover:text-neutral-300 transition-all flex items-center gap-1 focus:outline-none"
            aria-label="Página anterior">
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            <span class="hidden sm:inline">Ant.</span>
          </button>

          <!-- Páginas Numéricas y Elipsis -->
          <template v-for="(p, idx) in paginasVisiblesObras" :key="idx">
            <span v-if="p === '...'"
              class="w-9 h-9 flex items-center justify-center text-neutral-500 font-bold text-xs select-none">
              •••
            </span>
            <button v-else @click="irAPaginaObras(p)" :class="[
              'w-9 h-9 rounded-xl text-xs font-bold transition-all flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40',
              paginaActualObras === p
                ? 'bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.35)] font-extrabold'
                : 'bg-white/5 border border-white/10 text-neutral-300 hover:text-white hover:border-[#D4AF37]/50 hover:bg-white/10'
            ]" :aria-current="paginaActualObras === p ? 'page' : undefined" :aria-label="'Ir a página ' + p">
              {{ p }}
            </button>
          </template>

          <!-- Botón Siguiente -->
          <button @click="irAPaginaObras(paginaActualObras + 1)"
            :disabled="paginaActualObras === totalPaginasObras"
            class="px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider border border-white/10 bg-white/5 text-neutral-300 hover:border-[#D4AF37]/50 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-white/10 disabled:hover:text-neutral-300 transition-all flex items-center gap-1 focus:outline-none"
            aria-label="Página siguiente">
            <span class="hidden sm:inline">Sig.</span>
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>
        </nav>
      </div>
    </div>

    <!-- Estado vacío (Sin resultados para la búsqueda) -->
    <div v-else class="text-center py-20 bg-neutral-900/50 border border-white/5 rounded-3xl p-8">
      <span class="text-4xl block mb-3 opacity-40">🔍</span>
      <p class="text-white font-serif text-lg mb-1">No se encontraron obras</p>
      <p class="text-neutral-400 text-xs mb-4">No hay resultados para "{{ searchQuery }}"</p>
      <button @click="$emit('update:searchQuery', ''); fetchObras(true)"
        class="px-5 py-2.5 bg-[#D4AF37] text-black font-bold uppercase tracking-widest text-[10px] rounded-full hover:bg-white transition-colors">
        Limpiar Búsqueda
      </button>
    </div>

    <!-- MODAL FORMULARIO DE OBRAS -->
    <div v-if="showForm"
      class="fixed inset-0 bg-black/95 flex items-center justify-center p-2 md:p-4 z-[1001] backdrop-blur-lg transition-opacity duration-300">
      <div
        class="bg-neutral-900 border border-white/10 w-full max-w-4xl rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-2xl overflow-y-auto max-h-[95vh] md:max-h-[90vh]">
        <h2 class="text-xl md:text-2xl font-serif text-[#D4AF37] mb-6 uppercase tracking-tighter">{{ obraEditandoId ?
          'Editar Obra' : 'Nueva Obra' }}</h2>
        <form @submit.prevent="guardarObra" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              class="p-4 border-2 border-dashed border-white/10 rounded-xl text-center bg-white/5 relative hover:border-[#D4AF37]/50 hover:bg-white/10 transition-all duration-300 flex flex-col items-center justify-center min-h-[80px] md:min-h-[100px] cursor-pointer group">
              <input type="file" @change="(e) => handleImageChange(e, 1)" accept="image/*"
                class="absolute inset-0 opacity-0 cursor-pointer">
              <span class="text-lg mb-1 group-hover:scale-110 transition-transform">{{ imgFiles[1] ? '✅' : '📷'
                }}</span>
              <p class="text-[8px] uppercase tracking-widest text-neutral-400 group-hover:text-white transition-colors">
                {{
                  imgFiles[1] ? imgFiles[1].name : (form.imagen_1 ? 'Cambiar Foto 1' : 'Foto Principal') }}</p>
            </div>
            <div
              class="p-4 border-2 border-dashed border-white/10 rounded-xl text-center bg-white/5 relative hover:border-[#D4AF37]/50 hover:bg-white/10 transition-all duration-300 flex flex-col items-center justify-center min-h-[80px] md:min-h-[100px] cursor-pointer group">
              <input type="file" @change="(e) => handleImageChange(e, 2)" accept="image/*"
                class="absolute inset-0 opacity-0 cursor-pointer">
              <span class="text-lg mb-1 group-hover:scale-110 transition-transform">{{ imgFiles[2] ? '✅' : '📷'
                }}</span>
              <p class="text-[8px] uppercase tracking-widest text-neutral-400 group-hover:text-white transition-colors">
                {{
                  imgFiles[2] ? imgFiles[2].name : (form.imagen_2 ? 'Cambiar Foto 2' : 'Foto Detalle A') }}</p>
            </div>
            <div
              class="p-4 border-2 border-dashed border-white/10 rounded-xl text-center bg-white/5 relative hover:border-[#D4AF37]/50 hover:bg-white/10 transition-all duration-300 flex flex-col items-center justify-center min-h-[80px] md:min-h-[100px] cursor-pointer group">
              <input type="file" @change="(e) => handleImageChange(e, 3)" accept="image/*"
                class="absolute inset-0 opacity-0 cursor-pointer">
              <span class="text-lg mb-1 group-hover:scale-110 transition-transform">{{ imgFiles[3] ? '✅' : '📷'
                }}</span>
              <p class="text-[8px] uppercase tracking-widest text-neutral-400 group-hover:text-white transition-colors">
                {{
                  imgFiles[3] ? imgFiles[3].name : (form.imagen_3 ? 'Cambiar Foto 3' : 'Foto Detalle B') }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select v-model="form.tipo"
              class="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none text-xs md:text-sm focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[#D4AF37]/20 uppercase appearance-none text-white cursor-pointer transition-all"
              required>
              <option value="" disabled class="bg-neutral-900 text-neutral-500">TIPO DE OBRA...</option>
              <option value="Pintura" class="bg-neutral-900">PINTURA</option>
              <option value="Escultura" class="bg-neutral-900">ESCULTURA</option>
            </select>

            <!-- Combobox de Autor con Menú Desplegable y Sugerencias -->
            <div :class="['relative', dropdownAutorAbierto ? 'z-40' : 'z-10']" ref="autorComboboxRef">
              <div class="relative">
                <input v-model="form.autor" @focus="dropdownAutorAbierto = true" @input="dropdownAutorAbierto = true"
                  placeholder="AUTOR (BUSCAR O ESCRIBIR NUEVO)"
                  class="w-full bg-white/5 border border-white/10 pl-3 pr-16 py-3 rounded-xl outline-none text-xs md:text-sm text-white focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[#D4AF37]/20 uppercase transition-all placeholder:text-neutral-500"
                  :class="{ 'border-[#D4AF37] ring-2 ring-[#D4AF37]/20': dropdownAutorAbierto }" required
                  autocomplete="off">

                <!-- Botón para limpiar si hay texto -->
                <button v-if="form.autor" type="button" @click="form.autor = ''; dropdownAutorAbierto = true"
                  class="absolute right-8 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1 text-xs transition-colors"
                  title="Limpiar autor">
                  ✕
                </button>

                <!-- Flecha para abrir/cerrar menú desplegable -->
                <button type="button" @click="toggleDropdownAutor"
                  class="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#D4AF37] p-1 text-xs transition-transform duration-200"
                  :class="{ 'rotate-180 text-[#D4AF37]': dropdownAutorAbierto }" aria-label="Abrir listado de autores">
                  ▼
                </button>
              </div>

              <!-- Menú desplegable con sugerencias -->
              <transition name="dropdown-slide">
                <div v-if="dropdownAutorAbierto"
                  class="absolute left-0 right-0 top-full mt-1.5 bg-[#0d0d0d] border border-[#D4AF37]/30 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.95)] z-[60] max-h-56 overflow-y-auto py-1.5 backdrop-blur-xl custom-scrollbar">
                  <!-- Indicador de total / estado -->
                  <div
                    class="px-3 py-1.5 text-[9px] uppercase tracking-widest text-[#D4AF37] font-bold border-b border-white/5 flex justify-between items-center select-none">
                    <span>Artistas registrados</span>
                    <span class="text-neutral-500">{{ autoresSugeridos.length }}</span>
                  </div>

                  <!-- Lista de autores sugeridos -->
                  <button v-for="autor in autoresSugeridos" :key="autor" type="button" @click="seleccionarAutor(autor)"
                    class="w-full text-left px-3.5 py-2 text-xs text-neutral-300 hover:bg-[#D4AF37]/15 hover:text-[#D4AF37] transition-colors flex items-center justify-between group"
                    :class="{ 'text-[#D4AF37] font-bold bg-[#D4AF37]/10': form.autor && form.autor.toLowerCase() === autor.toLowerCase() }">
                    <span class="truncate">{{ autor }}</span>
                    <span v-if="form.autor && form.autor.toLowerCase() === autor.toLowerCase()"
                      class="text-[#D4AF37] text-xs">✓</span>
                  </button>

                  <!-- Mensaje cuando es un autor nuevo -->
                  <div v-if="autoresSugeridos.length === 0"
                    class="px-4 py-3 text-xs text-neutral-400 italic bg-white/[0.02]">
                    <p class="text-amber-400/90 font-medium not-italic">✨ Nuevo autor:</p>
                    <p class="text-white font-semibold mt-0.5 truncate not-italic">"{{ form.autor }}"</p>
                    <p class="text-[10px] text-neutral-500 mt-1">Se guardará como autor de la obra al publicar.</p>
                  </div>
                </div>
              </transition>
            </div>

            <input v-model="form.precio" placeholder="PRECIO (EJ: 5,500)"
              class="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none text-xs md:text-sm text-white focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[#D4AF37]/20 uppercase transition-all"
              required>
          </div>

          <input v-model="form.medidas" placeholder="DIMENSIONES (EJ: 120 X 80 CM)"
            class="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none text-xs md:text-sm text-white focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[#D4AF37]/20 uppercase transition-all"
            required>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 border-t border-white/10 pt-6">

            <div class="space-y-3 bg-white/5 p-4 rounded-xl border border-white/5">
              <h4 class="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                <span class="text-lg">🇪🇸</span> ESPAÑOL
              </h4>
              <input v-model="form.titulo" placeholder="TÍTULO"
                class="w-full bg-black/50 border border-white/10 p-3 rounded-lg outline-none text-xs md:text-sm text-white focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[#D4AF37]/20 uppercase transition-all"
                required>
              <input v-model="form.tecnica" placeholder="TÉCNICA (EJ: ÓLEO)"
                class="w-full bg-black/50 border border-white/10 p-3 rounded-lg outline-none text-xs md:text-sm text-white focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[#D4AF37]/20 uppercase transition-all"
                required>
            </div>

            <div class="space-y-3 bg-white/5 p-4 rounded-xl border border-white/5">
              <h4 class="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                <span class="text-lg">🇺🇸</span> ENGLISH
              </h4>
              <input v-model="form.titulo_en" placeholder="TITLE"
                class="w-full bg-black/50 border border-white/10 p-3 rounded-lg outline-none text-xs md:text-sm text-[#D4AF37] focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[#D4AF37]/20 uppercase italic transition-all"
                required>
              <input v-model="form.medidas_en" placeholder="TECHNIQUE (OIL)"
                class="w-full bg-black/50 border border-white/10 p-3 rounded-lg outline-none text-xs md:text-sm text-[#D4AF37] focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[#D4AF37]/20 uppercase italic transition-all"
                required>
            </div>

            <div class="space-y-3 bg-white/5 p-4 rounded-xl border border-white/5">
              <h4 class="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                <span class="text-lg">🇫🇷</span> FRANÇAIS
              </h4>
              <input v-model="form.titulo_fr" placeholder="TITRE"
                class="w-full bg-black/50 border border-white/10 p-3 rounded-lg outline-none text-xs md:text-sm text-white focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[#D4AF37]/20 uppercase transition-all">
              <input v-model="form.medidas_fr" placeholder="TECHNIQUE"
                class="w-full bg-black/50 border border-white/10 p-3 rounded-lg outline-none text-xs md:text-sm text-white focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[#D4AF37]/20 uppercase transition-all">
            </div>

            <div class="space-y-3 bg-white/5 p-4 rounded-xl border border-white/5">
              <h4 class="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                <span class="text-lg">🇯🇵</span> 日本語
              </h4>
              <input v-model="form.titulo_ja" placeholder="タイトル"
                class="w-full bg-black/50 border border-white/10 p-3 rounded-lg outline-none text-xs md:text-sm text-white focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[#D4AF37]/20 uppercase transition-all">
              <input v-model="form.medidas_ja" placeholder="手法"
                class="w-full bg-black/50 border border-white/10 p-3 rounded-lg outline-none text-xs md:text-sm text-white focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[#D4AF37]/20 uppercase transition-all">
            </div>

          </div>

          <div class="flex gap-3 md:gap-4 mt-8">
            <button type="submit"
              class="flex-1 bg-[#D4AF37] text-black font-bold py-3 md:py-4 rounded-xl hover:bg-yellow-600 hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] disabled:bg-neutral-700 text-[10px] md:text-xs uppercase tracking-widest transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
              :disabled="enviando">
              {{ enviando ? 'PROCESANDO...' : (obraEditandoId ? 'ACTUALIZAR' : 'PUBLICAR') }}
            </button>
            <button @click="showForm = false" type="button"
              class="w-1/3 bg-red-500/10 py-3 md:py-4 rounded-xl text-[10px] md:text-xs uppercase text-red-500 font-bold tracking-widest hover:bg-red-500/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500/50">CANCELAR</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import imageCompression from 'browser-image-compression'
import { formatoTitulo } from '~/utils/formatoTexto'

const props = defineProps({
  searchQuery: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:searchQuery'])

const supabase = useSupabaseClient()

const todasLasObras = ref([])
const cargando = ref(true)
const showForm = ref(false)
const enviando = ref(false)
const obraEditandoId = ref(null)

// Estados reactivos de paginación en servidor para Inventario
const paginaActualObras = ref(1)
const limiteObrasPorPagina = ref(24)
const totalObrasCount = ref(0)
const totalPaginasObras = computed(() => Math.ceil(totalObrasCount.value / limiteObrasPorPagina.value) || 1)

const imgFiles = reactive({ 1: null, 2: null, 3: null })

const form = ref({
  titulo: '', titulo_en: '', titulo_fr: '', titulo_ja: '',
  autor: '', precio: '', tecnica: '', medidas_en: '', medidas_fr: '', medidas_ja: '',
  medidas: '', tipo: '', imagen_1: null, imagen_2: null, imagen_3: null
})

// Estados para Combobox de Autores en el formulario de obras
const listaAutores = ref([])
const dropdownAutorAbierto = ref(false)
const autorComboboxRef = ref(null)

const cargarAutores = async () => {
  try {
    const { data, error } = await supabase
      .from('obras')
      .select('autor')
    if (!error && data) {
      const unicos = [...new Set(data.map(o => (o.autor || '').trim()).filter(Boolean))]
      unicos.sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }))
      listaAutores.value = unicos
    }
  } catch (e) {
    console.error('Error al cargar autores:', e)
  }
}

const autoresSugeridos = computed(() => {
  const query = (form.value.autor || '').trim().toLowerCase()
  if (!query) {
    return listaAutores.value
  }
  const normQuery = query.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  return listaAutores.value.filter(autor => {
    const normAutor = autor.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    return normAutor.includes(normQuery)
  })
})

const seleccionarAutor = (autor) => {
  form.value.autor = autor
  dropdownAutorAbierto.value = false
}

const toggleDropdownAutor = () => {
  dropdownAutorAbierto.value = !dropdownAutorAbierto.value
}

// Navegación numérica con elipsis para la paginación del inventario
const paginasVisiblesObras = computed(() => {
  const total = totalPaginasObras.value
  const actual = paginaActualObras.value

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const paginas = []
  const delta = 1
  const izquierda = Math.max(2, actual - delta)
  const derecha = Math.min(total - 1, actual + delta)

  paginas.push(1)
  if (izquierda > 2) paginas.push('...')
  for (let i = izquierda; i <= derecha; i++) paginas.push(i)
  if (derecha < total - 1) paginas.push('...')
  paginas.push(total)

  return paginas
})

const irAPaginaObras = (nuevaPagina) => {
  if (nuevaPagina >= 1 && nuevaPagina <= totalPaginasObras.value && nuevaPagina !== paginaActualObras.value) {
    paginaActualObras.value = nuevaPagina
    fetchObras(false)
    if (import.meta.client) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }
}

const cambiarLimiteObras = (nuevoLimite) => {
  limiteObrasPorPagina.value = Number(nuevoLimite)
  fetchObras(true)
}

// Búsqueda reactiva con debounce hacia Supabase
let debounceBusquedaObras = null
watch(() => props.searchQuery, () => {
  clearTimeout(debounceBusquedaObras)
  debounceBusquedaObras = setTimeout(() => {
    fetchObras(true)
  }, 350)
})

// Paginación en Servidor: Solo descarga la página solicitada (ej. 24 obras)
const fetchObras = async (resetPagina = false) => {
  if (resetPagina) {
    paginaActualObras.value = 1
  }
  cargando.value = true

  const desde = (paginaActualObras.value - 1) * limiteObrasPorPagina.value
  const hasta = desde + limiteObrasPorPagina.value - 1

  let query = supabase
    .from('obras')
    .select('id, titulo, titulo_en, titulo_fr, titulo_ja, autor, precio, tecnica, medidas, medidas_en, medidas_fr, medidas_ja, tipo, imagen_1, imagen_2, imagen_3, visitas, created_at', { count: 'exact' })
    .order('titulo', { ascending: true })

  const term = props.searchQuery ? props.searchQuery.trim() : ''
  if (term) {
    query = query.or(`titulo.ilike.%${term}%,titulo_en.ilike.%${term}%,autor.ilike.%${term}%`)
  }

  const { data, count, error } = await query.range(desde, hasta)

  if (!error && data) {
    todasLasObras.value = data
    totalObrasCount.value = count || 0
  }
  cargando.value = false
}

const obrasFiltradas = computed(() => todasLasObras.value)

const handleImageChange = (e, index) => {
  const file = e.target.files[0]
  if (file) imgFiles[index] = file
}

const openForm = (obra = null) => {
  if (listaAutores.value.length === 0) {
    cargarAutores()
  }
  imgFiles[1] = null; imgFiles[2] = null; imgFiles[3] = null;
  dropdownAutorAbierto.value = false
  if (obra) {
    obraEditandoId.value = obra.id
    form.value = { ...obra, titulo_fr: obra.titulo_fr || '', titulo_ja: obra.titulo_ja || '', medidas_fr: obra.medidas_fr || '', medidas_ja: obra.medidas_ja || '' }
  } else {
    obraEditandoId.value = null
    form.value = { titulo: '', titulo_en: '', titulo_fr: '', titulo_ja: '', autor: '', precio: '', tecnica: '', medidas_en: '', medidas_fr: '', medidas_ja: '', medidas: '', tipo: '', imagen_1: null, imagen_2: null, imagen_3: null }
  }
  showForm.value = true
}

const uploadImageAndGetUrl = async (file) => {
  if (!file) return null

  const opcionesCompresion = {
    maxSizeMB: 0.3,
    maxWidthOrHeight: 1200,
    useWebWorker: true,
    fileType: 'image/webp'
  }

  const compressedFile = await imageCompression(file, opcionesCompresion)

  const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.webp`
  const { error: uploadError } = await supabase.storage.from('obras-imagenes').upload(fileName, compressedFile)
  if (uploadError) throw uploadError

  const { data: { publicUrl } } = supabase.storage.from('obras-imagenes').getPublicUrl(fileName)
  return publicUrl
}

const guardarObra = async () => {
  enviando.value = true
  try {
    let url1 = imgFiles[1] ? await uploadImageAndGetUrl(imgFiles[1]) : form.value.imagen_1
    let url2 = imgFiles[2] ? await uploadImageAndGetUrl(imgFiles[2]) : form.value.imagen_2
    let url3 = imgFiles[3] ? await uploadImageAndGetUrl(imgFiles[3]) : form.value.imagen_3

    const payload = { ...form.value, imagen_1: url1, imagen_2: url2, imagen_3: url3 }

    payload.titulo = formatoTitulo(payload.titulo)
    payload.autor = formatoTitulo(payload.autor)
    payload.tecnica = formatoTitulo(payload.tecnica)
    if (payload.titulo_en) payload.titulo_en = formatoTitulo(payload.titulo_en)
    if (payload.titulo_fr) payload.titulo_fr = formatoTitulo(payload.titulo_fr)
    if (payload.titulo_ja) payload.titulo_ja = payload.titulo_ja.trim()

    delete payload.id; delete payload.created_at; delete payload.visitas;

    if (obraEditandoId.value) {
      const { error } = await supabase.from('obras').update(payload).eq('id', obraEditandoId.value)
      if (error) throw error
    } else {
      if (!url1) throw new Error("Debes subir al menos la Foto Principal (Foto 1).")
      const { error } = await supabase.from('obras').insert([payload])
      if (error) throw error
    }

    alert("¡Obra procesada con éxito!")
    showForm.value = false
    dropdownAutorAbierto.value = false

    if (payload.autor && !listaAutores.value.some(a => a.toLowerCase() === payload.autor.toLowerCase())) {
      listaAutores.value.push(payload.autor)
      listaAutores.value.sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }))
    }

    fetchObras(obraEditandoId.value ? false : true)
  } catch (err) { alert("Error de subida: " + err.message); console.error(err) } finally { enviando.value = false }
}

const deleteObra = async (obra) => {
  if (confirm(`¿Peligro: Eliminar definitivamente la obra "${obra.titulo}"?`)) {
    await supabase.from('obras').delete().eq('id', obra.id)
    if (todasLasObras.value.length === 1 && paginaActualObras.value > 1) {
      paginaActualObras.value--
    }
    fetchObras(false)
  }
}

let handleClickFueraAutor = null

onMounted(() => {
  fetchObras()
  handleClickFueraAutor = (e) => {
    if (autorComboboxRef.value && !autorComboboxRef.value.contains(e.target)) {
      dropdownAutorAbierto.value = false
    }
  }
  document.addEventListener('click', handleClickFueraAutor)
})

onUnmounted(() => {
  if (handleClickFueraAutor) {
    document.removeEventListener('click', handleClickFueraAutor)
  }
})

defineExpose({
  openForm,
  fetchObras
})
</script>

<style scoped>
.dropdown-slide-enter-active,
.dropdown-slide-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.dropdown-slide-enter-from,
.dropdown-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.02);
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(212, 175, 55, 0.3);
  border-radius: 9999px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(212, 175, 55, 0.6);
}
</style>
