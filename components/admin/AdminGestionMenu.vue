<template>
  <div class="w-full min-w-0 max-w-full">
    <header class="mb-4 sm:mb-6">
      <h1 class="text-2xl sm:text-3xl md:text-4xl font-serif text-white">Gestión Gastronómica</h1>
      <p v-if="localAsignado" class="text-neutral-500 text-[10px] md:text-xs mt-1.5 sm:mt-2 uppercase tracking-[0.2em]">
        Filtrado por sede: {{ localAsignado.replace(/-/g, ' ') }}</p>
      <p v-else class="text-neutral-500 text-[10px] md:text-xs mt-1.5 sm:mt-2 uppercase tracking-[0.2em]">Gestión Global</p>
    </header>

    <div class="mb-3 sm:mb-4 flex overflow-x-auto gap-2 sm:gap-3 hide-scrollbar pb-2 w-full min-w-0 max-w-full">
      <button @click="categoriaActivaGastro = 'todas'" :class="[
        'shrink-0 whitespace-nowrap uppercase tracking-widest text-[10px] sm:text-[11px] px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-all duration-300 font-medium focus:outline-none',
        categoriaActivaGastro === 'todas'
          ? 'bg-[#D4AF37] text-black shadow-[0_4px_15px_rgba(212,175,55,0.3)]'
          : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
      ]">
        Todas las categorías
      </button>
      <button v-for="cat in categoriasGastroDisponiblesMenu" :key="cat" @click="categoriaActivaGastro = cat"
        :class="[
          'shrink-0 whitespace-nowrap uppercase tracking-widest text-[10px] sm:text-[11px] px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-all duration-300 font-medium focus:outline-none',
          categoriaActivaGastro === cat
            ? 'bg-[#D4AF37] text-black shadow-[0_4px_15px_rgba(212,175,55,0.3)]'
            : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
        ]">
        {{ obtenerNombreCategoria(cat) }}
      </button>
    </div>

    <div v-if="categoriaActivaGastro !== 'todas' && subcategoriasGastroDisponiblesMenu.length > 0"
      class="mb-6 sm:mb-8 flex overflow-x-auto gap-2 sm:gap-3 hide-scrollbar pb-2 w-full min-w-0 max-w-full">
      <button @click="subcategoriaActivaGastro = 'todas'" :class="[
        'shrink-0 whitespace-nowrap uppercase tracking-widest text-[9px] sm:text-[10px] px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl transition-all duration-300 font-medium focus:outline-none',
        subcategoriaActivaGastro === 'todas'
          ? 'bg-[#D4AF37]/80 text-black shadow-sm'
          : 'bg-white/10 border border-white/10 text-gray-300 hover:text-white hover:bg-white/20'
      ]">
        Todas
      </button>
      <button v-for="sub in subcategoriasGastroDisponiblesMenu" :key="sub" @click="subcategoriaActivaGastro = sub"
        :class="[
          'shrink-0 whitespace-nowrap uppercase tracking-widest text-[9px] sm:text-[10px] px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl transition-all duration-300 font-medium focus:outline-none',
          subcategoriaActivaGastro === sub
            ? 'bg-[#D4AF37]/80 text-black shadow-sm'
            : 'bg-white/10 border border-white/10 text-gray-300 hover:text-white hover:bg-white/20'
        ]">
        {{ obtenerNombreSubcategoria(sub) }}
      </button>
    </div>

    <div v-if="cargandoGastro"
      class="text-center py-20 text-neutral-500 animate-pulse text-xs uppercase tracking-widest">
      Cargando Menús...</div>

    <div v-else class="space-y-8 sm:space-y-10 w-full min-w-0">
      <div v-if="gastroFiltrados.length === 0"
        class="text-center py-20 text-neutral-500 border border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
        No se encontraron platos con ese filtro.
      </div>

      <div v-for="(subcategorias, categoriaId) in menuAgrupado" :key="categoriaId" class="mb-8 sm:mb-10 w-full min-w-0">
        <h2 class="text-xl sm:text-2xl md:text-3xl font-serif text-[#D4AF37] mb-4 sm:mb-6 border-b border-[#D4AF37]/20 pb-2.5 sm:pb-3">{{
          obtenerNombreCategoria(categoriaId) }}</h2>

        <div v-for="(platos, subcategoriaId) in subcategorias" :key="subcategoriaId" class="mb-6 sm:mb-8 last:mb-0 w-full min-w-0">
          <h3 v-if="subcategoriaId !== 'general' && subcategoriaId !== 'null'"
            class="text-xs sm:text-sm md:text-base text-white/80 font-bold uppercase tracking-[0.15em] mb-3 sm:mb-4 pl-2 border-l-2 border-[#D4AF37]">
            {{ obtenerNombreSubcategoria(subcategoriaId) }}
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6 md:gap-8 w-full min-w-0">
            <div v-for="item in platos" :key="item.id"
              class="bg-neutral-900 border border-white/5 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 hover:border-[#D4AF37]/20 transition-all duration-300 relative flex flex-col justify-between shadow-lg hover:shadow-xl w-full min-w-0 overflow-hidden box-border">
              <div>
                <div class="flex justify-between items-start gap-2 mb-3 sm:mb-4 border-b border-white/10 pb-3 sm:pb-4">
                  <div class="min-w-0 flex-1 pr-1 sm:pr-2">
                    <h3 class="text-white font-serif text-base sm:text-lg md:text-xl leading-tight break-words">{{
                      formatoTitulo(item.nombre) }}
                    </h3>
                    <p v-if="item.nombre_en" class="text-neutral-500 text-[10px] italic mt-1 break-words">{{
                      formatoTitulo(item.nombre_en) }}</p>
                  </div>
                  <span
                    class="shrink-0 bg-black/60 backdrop-blur-md px-2.5 py-1 md:px-3 rounded-full border border-white/10 text-[10px] sm:text-xs text-[#D4AF37] font-bold tracking-tighter whitespace-nowrap shadow-sm">${{
                      item.precio }}</span>
                </div>

                <div class="space-y-2 mb-4 sm:mb-6">
                  <p v-if="item.descripcion" class="text-gray-400 text-[10px] sm:text-xs line-clamp-3 sm:line-clamp-2 break-words">{{
                    formatoParrafo(item.descripcion) }}</p>
                  <div
                    class="flex flex-wrap gap-1.5 sm:gap-2 text-[8px] text-white font-bold uppercase tracking-widest mt-2 sm:mt-3">
                    <span
                      class="bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-0.5 sm:py-1 rounded-sm border border-[#D4AF37]/20 max-w-full truncate">{{
                        item.local ? item.local.replace(/-/g, ' ').replace(/,/g, ' | ') : 'Global' }}</span>
                    <span class="bg-white/10 px-2 py-0.5 sm:py-1 rounded-sm border border-white/10 max-w-full truncate">{{
                      obtenerNombreCategoria(item.categoria) }}</span>
                    <span v-if="item.subcategoria"
                      class="bg-white/20 text-white px-2 py-0.5 sm:py-1 rounded-sm border border-white/10 max-w-full truncate">{{
                        obtenerNombreSubcategoria(item.subcategoria) }}</span>
                    <span v-if="item.etiqueta"
                      class="bg-blue-500/20 text-blue-400 px-2 py-0.5 sm:py-1 rounded-sm border border-blue-500/20 max-w-full truncate">{{
                        item.etiqueta
                      }}</span>
                  </div>
                </div>
              </div>

              <div class="flex items-center gap-2 mt-auto pt-3 sm:pt-4 border-t border-white/5">
                <button @click="openGastroForm(item)"
                  class="flex-1 min-w-0 py-2 sm:py-2.5 px-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 truncate text-center focus:outline-none focus:ring-2 focus:ring-white/30">Editar</button>
                <button @click="deleteProductoGastro(item)"
                  class="shrink-0 py-2 sm:py-2.5 px-3 border border-red-500/30 text-red-500 hover:bg-red-500/10 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500/50">Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL FORMULARIO DE PLATOS -->
    <div v-if="showGastroForm"
      class="fixed inset-0 bg-black/95 flex items-center justify-center p-2 md:p-4 z-[1001] backdrop-blur-lg transition-opacity duration-300">
      <div
        class="bg-neutral-900 border border-white/10 w-full max-w-4xl rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-2xl overflow-y-auto max-h-[95vh] md:max-h-[90vh]">
        <h2 class="text-xl md:text-2xl font-serif text-[#D4AF37] mb-6 uppercase tracking-tighter">{{ gastroEditandoId ?
          'Editar Plato' : 'Nuevo Plato' }}</h2>

        <form @submit.prevent="guardarGastro" class="space-y-6">

          <div v-if="rolUsuario === 'superadmin'"
            class="w-full bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col justify-center gap-3 mb-3">
            <span class="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">LOCALES (Múltiple)</span>
            <div class="flex flex-wrap gap-4">
              <label
                class="flex items-center gap-2 cursor-pointer text-xs md:text-sm text-white uppercase hover:text-[#D4AF37] transition-colors">
                <input type="checkbox" v-model="formGastro.locales" value="chao-cafe"
                  class="accent-[#D4AF37] w-4 h-4 cursor-pointer"> CHAO CAFE
              </label>
              <label
                class="flex items-center gap-2 cursor-pointer text-xs md:text-sm text-white uppercase hover:text-[#D4AF37] transition-colors">
                <input type="checkbox" v-model="formGastro.locales" value="chao-pescado"
                  class="accent-[#D4AF37] w-4 h-4 cursor-pointer"> CHAO PESCAO
              </label>
              <label
                class="flex items-center gap-2 cursor-pointer text-xs md:text-sm text-white uppercase hover:text-[#D4AF37] transition-colors">
                <input type="checkbox" v-model="formGastro.locales" value="sky-bar"
                  class="accent-[#D4AF37] w-4 h-4 cursor-pointer"> SKY BAR
              </label>
            </div>
          </div>
          <div v-else class="w-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 p-3 rounded-xl mb-3">
            <span class="text-[10px] text-[#D4AF37] uppercase tracking-widest font-bold">Bloqueado a tu sede: {{
              localAsignado ? localAsignado.replace(/-/g, ' ') : '' }}</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">

            <select v-model="formGastro.categoria" @change="formGastro.subcategoria = ''"
              class="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none text-xs md:text-sm focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[#D4AF37]/20 uppercase appearance-none text-white cursor-pointer transition-all"
              required>
              <option value="" disabled class="bg-neutral-900 text-neutral-500">CATEGORÍA...</option>
              <option v-for="cat in categoriasDisponibles" :key="cat.id" :value="cat.id" class="bg-neutral-900">{{
                cat.nombre }}</option>
            </select>

            <select v-if="subcategoriasDisponibles.length > 0" v-model="formGastro.subcategoria"
              class="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none text-xs md:text-sm focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[#D4AF37]/20 uppercase appearance-none text-white cursor-pointer transition-all"
              required>
              <option value="" disabled class="bg-neutral-900 text-neutral-500">SUBCATEGORÍA...</option>
              <option v-for="sub in subcategoriasDisponibles" :key="sub.id" :value="sub.id" class="bg-neutral-900">{{
                sub.nombre }}</option>
            </select>

            <input v-model.number="formGastro.precio" type="number" placeholder="PRECIO (NÚMEROS)"
              class="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none text-xs md:text-sm text-white focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[#D4AF37]/20 uppercase transition-all"
              required>
          </div>

          <input v-model="formGastro.etiqueta" placeholder="ETIQUETA (EJ: NUEVO, RECOMENDADO)"
            class="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none text-xs md:text-sm text-white focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[#D4AF37]/20 uppercase transition-all">

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 border-t border-white/10 pt-6">

            <div class="space-y-3 bg-white/5 p-4 rounded-xl border border-white/5">
              <h4 class="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                <span class="text-lg">🇪🇸</span> ESPAÑOL
              </h4>
              <input v-model="formGastro.nombre" placeholder="NOMBRE DEL PLATO"
                class="w-full bg-black/50 border border-white/10 p-3 rounded-lg outline-none text-xs md:text-sm text-white focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[#D4AF37]/20 uppercase transition-all"
                required>
              <textarea v-model="formGastro.descripcion" placeholder="DESCRIPCIÓN" rows="2"
                class="w-full bg-black/50 border border-white/10 p-3 rounded-lg outline-none text-xs md:text-sm text-white focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[#D4AF37]/20 uppercase resize-none transition-all"></textarea>
            </div>

            <div class="space-y-3 bg-white/5 p-4 rounded-xl border border-white/5">
              <h4 class="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                <span class="text-lg">🇺🇸</span> ENGLISH
              </h4>
              <input v-model="formGastro.nombre_en" placeholder="DISH NAME"
                class="w-full bg-black/50 border border-white/10 p-3 rounded-lg outline-none text-xs md:text-sm text-[#D4AF37] focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[#D4AF37]/20 uppercase italic transition-all">
              <textarea v-model="formGastro.descripcion_en" placeholder="DESCRIPTION" rows="2"
                class="w-full bg-black/50 border border-white/10 p-3 rounded-lg outline-none text-xs md:text-sm text-[#D4AF37] focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[#D4AF37]/20 uppercase italic resize-none transition-all"></textarea>
            </div>

            <div class="space-y-3 bg-white/5 p-4 rounded-xl border border-white/5">
              <h4 class="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                <span class="text-lg">🇫🇷</span> FRANÇAIS
              </h4>
              <input v-model="formGastro.nombre_fr" placeholder="NOM DU PLAT"
                class="w-full bg-black/50 border border-white/10 p-3 rounded-lg outline-none text-xs md:text-sm text-white focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[#D4AF37]/20 uppercase transition-all">
              <textarea v-model="formGastro.descripcion_fr" placeholder="DESCRIPTION" rows="2"
                class="w-full bg-black/50 border border-white/10 p-3 rounded-lg outline-none text-xs md:text-sm text-white focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[#D4AF37]/20 uppercase resize-none transition-all"></textarea>
            </div>

            <div class="space-y-3 bg-white/5 p-4 rounded-xl border border-white/5">
              <h4 class="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                <span class="text-lg">🇯🇵</span> 日本語
              </h4>
              <input v-model="formGastro.nombre_ja" placeholder="料理の名前"
                class="w-full bg-black/50 border border-white/10 p-3 rounded-lg outline-none text-xs md:text-sm text-white focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[#D4AF37]/20 uppercase transition-all">
              <textarea v-model="formGastro.descripcion_ja" placeholder="説明" rows="2"
                class="w-full bg-black/50 border border-white/10 p-3 rounded-lg outline-none text-xs md:text-sm text-white focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[#D4AF37]/20 uppercase resize-none transition-all"></textarea>
            </div>

          </div>

          <div class="flex gap-3 md:gap-4 mt-8">
            <button type="submit"
              class="flex-1 bg-[#D4AF37] text-black font-bold py-3 md:py-4 rounded-xl hover:bg-yellow-600 hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] disabled:bg-neutral-700 text-[10px] md:text-xs uppercase tracking-widest transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
              :disabled="enviandoGastro">
              {{ enviandoGastro ? 'PROCESANDO...' : (gastroEditandoId ? 'ACTUALIZAR PLATO' : 'PUBLICAR PLATO') }}
            </button>
            <button @click="showGastroForm = false" type="button"
              class="w-1/3 bg-red-500/10 py-3 md:py-4 rounded-xl text-[10px] md:text-xs uppercase text-red-500 font-bold tracking-widest hover:bg-red-500/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500/50">CANCELAR</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatoTitulo, formatoParrafo } from '~/utils/formatoTexto'

const props = defineProps({
  rolUsuario: {
    type: String,
    default: 'superadmin'
  },
  localAsignado: {
    type: String,
    default: null
  },
  searchQuery: {
    type: String,
    default: ''
  }
})

const supabase = useSupabaseClient()

const todosLosPlatos = ref([])
const cargandoGastro = ref(false)
const showGastroForm = ref(false)
const enviandoGastro = ref(false)
const gastroEditandoId = ref(null)

const categoriaActivaGastro = ref('todas')
const subcategoriaActivaGastro = ref('todas')

watch(categoriaActivaGastro, () => {
  subcategoriaActivaGastro.value = 'todas'
})

const categoriasDisponibles = [
  { id: 'entraditas', nombre: 'ENTRADITAS' },
  { id: 'restaurante', nombre: 'RESTAURANTE' },
  { id: 'licores', nombre: 'LICORES' },
  { id: 'bebidas', nombre: 'BEBIDAS' },
  { id: 'postres', nombre: 'POSTRES' }
]

const subcategoriasDisponibles = computed(() => {
  if (formGastro.value.categoria === 'restaurante') {
    return [
      { id: 'entradas', nombre: 'ENTRADAS' }, { id: 'cremas', nombre: 'CREMAS' }, { id: 'ensaladas', nombre: 'ENSALADAS' },
      { id: 'ceviche', nombre: 'CEVICHE' }, { id: 'comida_rapida', nombre: 'COMIDA RÁPIDA' }, { id: 'carnes', nombre: 'CARNES' },
      { id: 'pollo', nombre: 'POLLO' }, { id: 'pescados', nombre: 'PESCADOS' }, { id: 'menu_ejecutivo', nombre: 'MENÚ EJECUTIVO' },
      { id: 'añadidos', nombre: 'AÑADIDOS' }
    ]
  } else if (formGastro.value.categoria === 'licores') {
    return [
      { id: 'cocteles', nombre: 'CÓCTELES' }, { id: 'cervezas', nombre: 'CERVEZAS' },
      { id: 'tragos', nombre: 'TRAGOS' }, { id: 'botellas', nombre: 'BOTELLAS' }
    ]
  } else if (formGastro.value.categoria === 'bebidas') {
    return [
      { id: 'refrescantes', nombre: 'REFRESCANTES' },
      { id: 'calientes', nombre: 'CALIENTES' },
      { id: 'jugos', nombre: 'JUGOS' }
    ]
  }
  return []
})

const formGastro = ref({
  locales: [],
  categoria: '', subcategoria: '', precio: null, etiqueta: '',
  nombre: '', descripcion: '', nombre_en: '', descripcion_en: '',
  nombre_fr: '', descripcion_fr: '', nombre_ja: '', descripcion_ja: ''
})

const fetchGastronomia = async () => {
  cargandoGastro.value = true
  let query = supabase.from('menu_gastronomia').select('*').order('created_at', { ascending: false }).limit(10000)

  if (props.rolUsuario === 'admin_cafe' && props.localAsignado) {
    query = query.ilike('local', `%${props.localAsignado}%`)
  }

  const { data } = await query
  todosLosPlatos.value = data || []

  if (todosLosPlatos.value.length > 0 && categoriaActivaGastro.value === 'todas') {
    categoriaActivaGastro.value = 'todas';
  }
  cargandoGastro.value = false
}

const categoriasGastroDisponiblesMenu = computed(() => {
  let cat = [...new Set(todosLosPlatos.value.map(item => item.categoria).filter(Boolean))]
  const ordenTarjetas = ['bebidas', 'entraditas', 'restaurante', 'postres', 'licores']
  cat.sort((a, b) => {
    let indexA = ordenTarjetas.indexOf(a)
    let indexB = ordenTarjetas.indexOf(b)
    if (indexA === -1) indexA = 999
    if (indexB === -1) indexB = 999
    return indexA - indexB
  })
  return cat
})

const subcategoriasGastroDisponiblesMenu = computed(() => {
  if (!categoriaActivaGastro.value || categoriaActivaGastro.value === 'todas') return []
  const itemsDeCategoria = todosLosPlatos.value.filter(item => item.categoria === categoriaActivaGastro.value)
  let sub = [...new Set(itemsDeCategoria.map(item => item.subcategoria).filter(Boolean))]

  const ordenEstricto = [
    'entradas', 'cremas', 'ensaladas', 'ceviche', 'comida_rapida', 'carnes', 'pollo', 'pescados', 'menu_ejecutivo', 'añadidos',
    'cocteles', 'cervezas', 'tragos', 'botellas',
    'refrescantes', 'calientes', 'jugos',
    'otros'
  ]
  sub.sort((a, b) => {
    let indexA = ordenEstricto.indexOf(a)
    let indexB = ordenEstricto.indexOf(b)
    if (indexA === -1) indexA = 999
    if (indexB === -1) indexB = 999
    return indexA - indexB
  })

  return sub
})

const gastroFiltrados = computed(() => {
  let filtrados = todosLosPlatos.value

  if (categoriaActivaGastro.value !== 'todas') {
    filtrados = filtrados.filter(item => item.categoria === categoriaActivaGastro.value)
  }

  if (subcategoriaActivaGastro.value !== 'todas') {
    filtrados = filtrados.filter(item => item.subcategoria === subcategoriaActivaGastro.value)
  }

  const query = props.searchQuery ? props.searchQuery.toLowerCase().trim() : ''
  if (query) {
    filtrados = filtrados.filter(o => o.nombre.toLowerCase().includes(query) || (o.nombre_en && o.nombre_en.toLowerCase().includes(query)) || o.categoria.toLowerCase().includes(query))
  }

  return filtrados
})

const menuAgrupado = computed(() => {
  const agrupado = {}
  gastroFiltrados.value.forEach(item => {
    const cat = item.categoria || 'otros'
    const sub = item.subcategoria || 'general'

    if (!agrupado[cat]) agrupado[cat] = {}
    if (!agrupado[cat][sub]) agrupado[cat][sub] = []

    agrupado[cat][sub].push(item)
  })
  return agrupado
})

const obtenerNombreCategoria = (id) => {
  const cat = categoriasDisponibles.find(c => c.id === id)
  return cat ? cat.nombre : id
}

const obtenerNombreSubcategoria = (id) => {
  const todasSubcategorias = [
    { id: 'entradas', nombre: 'ENTRADAS' }, { id: 'cremas', nombre: 'CREMAS' }, { id: 'ensaladas', nombre: 'ENSALADAS' },
    { id: 'ceviche', nombre: 'CEVICHE' }, { id: 'comida_rapida', nombre: 'COMIDA RÁPIDA' }, { id: 'carnes', nombre: 'CARNES' },
    { id: 'pollo', nombre: 'POLLO' }, { id: 'pescados', nombre: 'PESCADOS' }, { id: 'menu_ejecutivo', nombre: 'MENÚ EJECUTIVO' },
    { id: 'añadidos', nombre: 'AÑADIDOS' },
    { id: 'cocteles', nombre: 'CÓCTELES' }, { id: 'cervezas', nombre: 'CERVEZAS' },
    { id: 'tragos', nombre: 'TRAGOS' }, { id: 'botellas', nombre: 'BOTELLAS' },
    { id: 'refrescantes', nombre: 'REFRESCANTES' }, { id: 'calientes', nombre: 'CALIENTES' }, { id: 'jugos', nombre: 'JUGOS' }
  ]
  const sub = todasSubcategorias.find(s => s.id === id)
  return sub ? sub.nombre : id
}

const openGastroForm = (item = null) => {
  if (item) {
    gastroEditandoId.value = item.id
    formGastro.value = {
      ...item,
      locales: item.local ? item.local.split(',').map(l => l.trim()) : [],
      subcategoria: item.subcategoria || '',
      nombre_en: item.nombre_en || '', descripcion_en: item.descripcion_en || '',
      nombre_fr: item.nombre_fr || '', descripcion_fr: item.descripcion_fr || '',
      nombre_ja: item.nombre_ja || '', descripcion_ja: item.descripcion_ja || ''
    }
  } else {
    gastroEditandoId.value = null
    formGastro.value = {
      locales: [], categoria: '', subcategoria: '', precio: null, etiqueta: '',
      nombre: '', descripcion: '', nombre_en: '', descripcion_en: '',
      nombre_fr: '', descripcion_fr: '', nombre_ja: '', descripcion_ja: ''
    }
  }
  showGastroForm.value = true
}

const guardarGastro = async () => {
  enviandoGastro.value = true
  try {
    const payload = { ...formGastro.value }

    if (props.rolUsuario === 'admin_cafe') {
      payload.local = props.localAsignado
    } else {
      if (!payload.locales || payload.locales.length === 0) {
        alert("Por favor, selecciona al menos un establecimiento.")
        enviandoGastro.value = false
        return
      }
      payload.local = payload.locales.join(',')
    }
    delete payload.locales

    if (subcategoriasDisponibles.value.length === 0) {
      payload.subcategoria = null
    } else if (!payload.subcategoria) {
      alert("Debes seleccionar una subcategoría para esta sección.");
      enviandoGastro.value = false;
      return;
    }

    payload.nombre = formatoTitulo(payload.nombre)
    payload.descripcion = formatoParrafo(payload.descripcion)
    if (payload.nombre_en) payload.nombre_en = formatoTitulo(payload.nombre_en)
    if (payload.descripcion_en) payload.descripcion_en = formatoParrafo(payload.descripcion_en)
    if (payload.nombre_fr) payload.nombre_fr = formatoTitulo(payload.nombre_fr)
    if (payload.descripcion_fr) payload.descripcion_fr = formatoParrafo(payload.descripcion_fr)
    if (payload.nombre_ja) payload.nombre_ja = payload.nombre_ja.trim()
    if (payload.descripcion_ja) payload.descripcion_ja = payload.descripcion_ja.trim()
    if (payload.etiqueta) payload.etiqueta = formatoTitulo(payload.etiqueta)

    delete payload.id; delete payload.created_at;

    if (gastroEditandoId.value) {
      const { error } = await supabase.from('menu_gastronomia').update(payload).eq('id', gastroEditandoId.value)
      if (error) throw error
    } else {
      const { error } = await supabase.from('menu_gastronomia').insert([payload])
      if (error) throw error
    }

    alert("¡Plato procesado con éxito!")
    showGastroForm.value = false
    fetchGastronomia()
  } catch (err) { alert("Error de subida: " + err.message); console.error(err) } finally { enviandoGastro.value = false }
}

const deleteProductoGastro = async (item) => {
  if (confirm(`¿Peligro: Eliminar definitivamente "${item.nombre}"?`)) {
    await supabase.from('menu_gastronomia').delete().eq('id', item.id)
    fetchGastronomia()
  }
}

onMounted(() => {
  fetchGastronomia()
})

defineExpose({
  openGastroForm,
  fetchGastronomia
})
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
