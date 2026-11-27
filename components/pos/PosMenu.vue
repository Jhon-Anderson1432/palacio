<template>
  <div class="flex-1 flex flex-col min-h-0">
    <!-- Filtros del Menú -->
    <section class="p-4 md:p-5 bg-black border-b border-white/5 flex flex-col gap-4 relative z-10 shadow-sm" aria-label="Filtros del menú">
      <div class="relative group">
        <input 
          v-model="busquedaMenu"
          type="text" 
          placeholder="Buscar plato, bebida, ingrediente..."
          class="w-full bg-white/5 border border-white/10 rounded-full py-3.5 pl-12 pr-4 text-sm outline-none focus:border-[#D4AF37]/50 focus:bg-white/10 focus:ring-4 focus:ring-[#D4AF37]/10 transition-all duration-300 text-white placeholder:text-neutral-500 font-light shadow-inner"
        />
        <span class="absolute left-5 top-4 text-neutral-500 group-focus-within:text-[#D4AF37] transition-colors" aria-hidden="true">🔍</span>
      </div>

      <nav class="overflow-x-auto hide-scrollbar flex gap-3 md:gap-4 pb-1" aria-label="Categorías principales">
        <button 
          v-for="cat in categoriasDisponibles" 
          :key="cat" 
          @click="categoriaActiva = cat"
          :class="[
            'whitespace-nowrap uppercase tracking-widest text-xs md:text-sm px-6 py-3 md:py-4 rounded-xl transition-all duration-300 font-bold focus:outline-none', 
            categoriaActiva === cat 
              ? 'bg-[#D4AF37] text-black shadow-[0_4px_15px_rgba(212,175,55,0.3)]' 
              : 'bg-white/5 text-gray-400 border border-white/5 hover:text-white hover:bg-white/10'
          ]"
        >
          {{ formatearCategoria(cat) }}
        </button>
      </nav>

      <nav v-if="subcategoriasDisponiblesMenu.length > 0 && busquedaMenu.trim() === ''" class="overflow-x-auto hide-scrollbar flex gap-2 md:gap-3 pb-1" aria-label="Subcategorías">
        <button 
          @click="subcategoriaActiva = 'todas'"
          :class="[
            'whitespace-nowrap uppercase tracking-widest text-[10px] px-4 py-2 rounded-xl transition-all duration-300 font-medium focus:outline-none',
            subcategoriaActiva === 'todas'
              ? 'bg-[#D4AF37]/80 text-black shadow-sm' 
              : 'bg-white/10 border border-white/10 text-gray-300 hover:text-white hover:bg-white/20'
          ]"
        >
          Todas
        </button>
        <button 
          v-for="sub in subcategoriasDisponiblesMenu" 
          :key="sub" 
          @click="subcategoriaActiva = sub"
          :class="[
            'whitespace-nowrap uppercase tracking-widest text-[10px] px-4 py-2 rounded-xl transition-all duration-300 font-medium focus:outline-none',
            subcategoriaActiva === sub 
              ? 'bg-[#D4AF37]/80 text-black shadow-sm' 
              : 'bg-white/10 border border-white/10 text-gray-300 hover:text-white hover:bg-white/20'
          ]"
        >
          {{ formatearSubcategoria(sub) }}
        </button>
      </nav>
    </section>

    <!-- Catálogo de Platos -->
    <section class="flex-1 overflow-y-auto p-4 md:p-6 pb-32 md:pb-6 space-y-8 z-0 bg-[#050505]">
      
      <div v-if="cargandoMenu" class="text-center py-10 text-[#D4AF37] text-sm uppercase tracking-widest animate-pulse font-bold">
        Cargando Menú...
      </div>

      <div v-else-if="menuFiltradoYBusqueda.length === 0" class="text-center py-12 text-neutral-500 text-xs uppercase tracking-widest border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
        No se encontraron resultados para "<span class="text-white">{{ busquedaMenu }}</span>"
      </div>
      
      <div v-else v-for="(items, subcat) in menuAgrupado" :key="subcat" class="w-full">
        <h3 v-if="subcat !== 'otros' || Object.keys(menuAgrupado).length > 1" class="text-[#D4AF37] font-serif text-xl md:text-2xl mb-5 border-b border-[#D4AF37]/20 pb-2 pl-2 tracking-wide uppercase">
          {{ formatearSubcategoria(subcat) }}
        </h3>

        <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
          <article 
            v-for="item in items" 
            :key="item.id" 
            class="bg-[#111] border border-white/5 rounded-2xl p-4 md:p-5 hover:border-[#D4AF37]/30 hover:shadow-[0_8px_30px_rgba(212,175,55,0.08)] transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <h4 class="font-serif text-base md:text-lg leading-tight group-hover:text-[#D4AF37] transition-colors">{{ item.nombre }}</h4>
              <span class="text-[#D4AF37] text-sm md:text-base font-bold mt-2 inline-block">${{ item.precio.toLocaleString('es-CO') }}</span>
              <p v-if="item.descripcion" class="text-neutral-400 text-xs md:text-sm font-light leading-relaxed mt-2 line-clamp-2">
                {{ item.descripcion }}
              </p>
            </div>
            <div class="mt-5 flex justify-end">
              <button 
                @click.stop="$emit('agregarProducto', item)" 
                class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] flex items-center justify-center font-bold text-xl md:text-2xl hover:bg-[#D4AF37] hover:text-black transition-all duration-300 shadow-inner active:scale-90 focus:outline-none focus:ring-4 focus:ring-[#D4AF37]/40"
                aria-label="Agregar producto a la orden"
              >
                +
              </button>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const props = defineProps({
  menuCompleto: {
    type: Array,
    default: () => []
  },
  cargandoMenu: {
    type: Boolean,
    default: true
  },
  categoriasDisponibles: {
    type: Array,
    default: () => []
  }
})

defineEmits(['agregarProducto'])

const DICT_CATEGORIAS = {
  'entraditas': 'Entradas', 'restaurante': 'Restaurante', 'licores': 'Licores', 
  'bebidas': 'Bebidas', 'postres': 'Postres', 'comida': 'Comidas'
}

const DICT_SUBCATEGORIAS = {
  'entradas': 'Entradas', 'cremas': 'Cremas', 'ensaladas': 'Ensaladas', 'ceviche': 'Ceviche', 
  'comida_rapida': 'Comida Rápida', 'carnes': 'Carnes', 'pollo': 'Pollo', 'pescados': 'Pescados', 
  'menu_ejecutivo': 'Menú Ejecutivo', 'adiciones': 'Adiciones', 'cocteles': 'Cócteles', 
  'cervezas': 'Cervezas', 'tragos': 'Tragos', 'botellas': 'Botellas', 'refrescantes': 'Refrescantes', 
  'calientes': 'Calientes', 'jugos': 'Jugos', 'otros': 'Otros', 'aguardiente': 'Aguardiente', 
  'ron': 'Ron', 'tequila': 'Tequila', 'mezcal': 'Mezcal', 'whisky': 'Whisky', 'ginebra': 'Ginebra', 
  'vodka': 'Vodka', 'vinos': 'Vinos', 'espumosos': 'Champagne / Espumosos', 'licores_varios': 'Licores Varios'
}

const ORDEN_ESTRICTO_SUBCAT = [
  'entradas', 'cremas', 'ensaladas', 'ceviche', 'comida_rapida', 'carnes', 'pollo', 'pescados', 'menu_ejecutivo', 'adiciones',
  'cocteles', 'cervezas', 'tragos', 'botellas',
  'refrescantes', 'calientes', 'jugos',
  'otros'
]

const formatearCategoria = (cat) => DICT_CATEGORIAS[cat] || cat.replace(/_/g, ' ').toUpperCase()
const formatearSubcategoria = (sub) => DICT_SUBCATEGORIAS[sub] || sub.replace(/_/g, ' ').toUpperCase()

const categoriaActiva = ref('')
const subcategoriaActiva = ref('todas')
const busquedaMenu = ref('')

// Inicializar categoría activa cuando llegan las categorías desde Supabase
watch(() => props.categoriasDisponibles, (nuevas) => {
  if (nuevas && nuevas.length > 0 && !nuevas.includes(categoriaActiva.value)) {
    categoriaActiva.value = nuevas[0]
  }
}, { immediate: true })

// Reiniciar subcategoría al cambiar de categoría principal
watch(categoriaActiva, () => {
  subcategoriaActiva.value = 'todas'
})

const subcategoriasDisponiblesMenu = computed(() => {
  if (!categoriaActiva.value) return []
  const itemsDeCategoria = props.menuCompleto.filter(item => item.categoria === categoriaActiva.value)
  let sub = [...new Set(itemsDeCategoria.map(item => item.subcategoria).filter(Boolean))]
  
  sub.sort((a, b) => {
    let indexA = ORDEN_ESTRICTO_SUBCAT.indexOf(a)
    let indexB = ORDEN_ESTRICTO_SUBCAT.indexOf(b)
    return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB)
  })
  return sub
})

const menuFiltradoYBusqueda = computed(() => {
  let resultado = props.menuCompleto

  if (busquedaMenu.value.trim() !== '') {
    const query = busquedaMenu.value.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    return resultado.filter(item => {
      const nombreNorm = item.nombre ? item.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : ""
      const descNorm = item.descripcion ? item.descripcion.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : ""
      return nombreNorm.includes(query) || descNorm.includes(query)
    })
  }

  resultado = resultado.filter(item => item.categoria === categoriaActiva.value)

  if (subcategoriaActiva.value !== 'todas') {
    resultado = resultado.filter(item => item.subcategoria === subcategoriaActiva.value)
  }

  return resultado
})

const tieneSubcategorias = computed(() => menuFiltradoYBusqueda.value.some(item => item.subcategoria && item.subcategoria.trim() !== ''))

const menuAgrupado = computed(() => {
  if (!tieneSubcategorias.value) return { 'otros': menuFiltradoYBusqueda.value }

  const grupos = {}
  menuFiltradoYBusqueda.value.forEach(item => {
    const sub = item.subcategoria?.trim() || 'otros'
    if (!grupos[sub]) grupos[sub] = []
    grupos[sub].push(item)
  })

  const gruposOrdenados = {}
  ORDEN_ESTRICTO_SUBCAT.forEach(subcat => { if (grupos[subcat]) gruposOrdenados[subcat] = grupos[subcat] })
  Object.keys(grupos).forEach(subcat => { if (!gruposOrdenados[subcat]) gruposOrdenados[subcat] = grupos[subcat] })

  return gruposOrdenados
})
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>
