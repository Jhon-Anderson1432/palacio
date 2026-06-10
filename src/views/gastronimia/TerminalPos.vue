<template>
  <div class="h-[100dvh] w-full bg-[#0a0a0a] text-white font-sans flex flex-col md:flex-row overflow-hidden relative">
    
    <div class="flex-1 flex flex-col h-[100dvh] border-r border-white/10">
      
      <header class="bg-[#111] p-4 md:p-6 flex justify-between items-center border-b border-white/10 relative z-20">
        <div>
          <h1 class="text-[#D4AF37] font-serif text-xl md:text-2xl uppercase tracking-widest">Toma de Pedidos</h1>
          <p class="text-xs md:text-sm text-neutral-400 uppercase mt-1">
            Mesera Activa: <span class="text-white font-bold">{{ nombreMesera }}</span> ({{ localAsignado.replace(/-/g, ' ') }})
          </p>
        </div>
        <div class="flex items-center gap-3">
          <button @click="panelMesasAbierto = true" class="bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37]/20 px-4 py-3 rounded-lg text-xs md:text-sm font-bold uppercase tracking-widest transition-all flex items-center gap-2">
            <span>Mis Mesas</span>
            <span class="bg-[#D4AF37] text-black px-2 py-0.5 rounded-full text-[10px]">{{ misOrdenesActivas.length }}</span>
          </button>
          <button @click="handleLogout" class="text-red-500 hover:bg-red-500/10 px-4 py-3 rounded-lg text-xs md:text-sm font-bold uppercase tracking-widest transition-all hidden md:block">
            Salir
          </button>
        </div>
      </header>

      <div class="p-4 md:p-5 bg-black border-b border-white/5 flex flex-col gap-4 relative z-10">
        <div class="relative">
          <input
            v-model="busquedaMenu"
            type="text"
            placeholder="Buscar plato, bebida, ingrediente..."
            class="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-4 text-sm outline-none focus:border-[#D4AF37]/50 transition-all text-white placeholder:text-neutral-500"
          />
          <span class="absolute left-5 top-3.5 text-neutral-500">🔍</span>
        </div>

        <div class="overflow-x-auto hide-scrollbar flex gap-3 md:gap-4">
          <button 
            v-for="cat in categoriasDisponibles" 
            :key="cat" 
            @click="categoriaActiva = cat"
            :class="['whitespace-nowrap uppercase tracking-widest text-xs md:text-sm px-6 py-3 md:py-4 rounded-xl transition-all font-bold', categoriaActiva === cat ? 'bg-[#D4AF37] text-black shadow-md' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10']"
          >
            {{ formatearCategoria(cat) }}
          </button>
        </div>

        <div v-if="subcategoriasDisponiblesMenu.length > 0 && busquedaMenu.trim() === ''" class="overflow-x-auto hide-scrollbar flex gap-2 md:gap-3">
          <button 
            @click="subcategoriaActiva = 'todas'"
            :class="[
              'whitespace-nowrap uppercase tracking-widest text-[10px] px-4 py-2 rounded-xl transition-all duration-300 font-medium',
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
              'whitespace-nowrap uppercase tracking-widest text-[10px] px-4 py-2 rounded-xl transition-all duration-300 font-medium',
              subcategoriaActiva === sub 
                ? 'bg-[#D4AF37]/80 text-black shadow-sm' 
                : 'bg-white/10 border border-white/10 text-gray-300 hover:text-white hover:bg-white/20'
            ]"
          >
            {{ formatearSubcategoria(sub) }}
          </button>
        </div>

      </div>

      <div class="flex-1 overflow-y-auto p-4 md:p-6 pb-32 md:pb-6 space-y-8 z-0">
        
        <div v-if="cargandoMenu" class="text-center py-10 text-[#D4AF37] text-sm uppercase tracking-widest animate-pulse">
          Cargando Menú...
        </div>

        <div v-else-if="menuFiltradoYBusqueda.length === 0" class="text-center py-12 text-neutral-500 text-xs uppercase tracking-widest border border-dashed border-white/10 rounded-2xl">
          No se encontraron resultados para "{{ busquedaMenu }}"
        </div>
        
        <div v-else v-for="(items, subcat) in menuAgrupado" :key="subcat" class="w-full">
          
          <h3 v-if="subcat !== 'otros' || Object.keys(menuAgrupado).length > 1" class="text-[#D4AF37] font-serif text-xl md:text-2xl mb-4 border-b border-[#D4AF37]/20 pb-2 pl-2 tracking-wide uppercase">
            {{ formatearSubcategoria(subcat) }}
          </h3>

          <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            <div v-for="item in items" :key="item.id" class="bg-[#111] border border-white/5 rounded-2xl p-4 md:p-5 hover:border-[#D4AF37]/30 transition-all flex flex-col justify-between group shadow-sm">
              <div>
                <h3 class="font-serif text-base md:text-lg leading-tight transition-colors">{{ item.nombre }}</h3>
                <span class="text-[#D4AF37] text-sm md:text-base font-bold mt-2 inline-block">${{ item.precio.toLocaleString('es-CO') }}</span>
                <p v-if="item.descripcion" class="text-gray-400 text-xs md:text-sm font-light leading-relaxed mt-2 line-clamp-2">
                  {{ item.descripcion }}
                </p>
              </div>
              <div class="mt-4 flex justify-end">
                <button @click.stop="agregarAlCarrito(item)" class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center font-bold text-xl md:text-2xl hover:bg-[#D4AF37] hover:text-black transition-colors shadow-inner active:scale-90">
                  +
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>

    <div v-if="panelMesasAbierto" @click="panelMesasAbierto = false" class="fixed inset-0 bg-black/80 z-[100] backdrop-blur-sm transition-opacity"></div>
    
    <aside :class="['fixed top-0 right-0 bottom-0 w-full md:w-[400px] bg-[#111] border-l border-white/10 z-[110] transition-transform duration-300 transform flex flex-col shadow-2xl', panelMesasAbierto ? 'translate-x-0' : 'translate-x-full']">
      <header class="p-5 md:p-6 border-b border-white/10 flex justify-between items-center bg-black">
        <h2 class="text-[#D4AF37] font-serif text-xl md:text-2xl uppercase tracking-widest">Mis Mesas Activas</h2>
        <button @click="panelMesasAbierto = false" class="text-neutral-500 hover:text-white p-2 bg-white/5 rounded-full transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </header>

      <div class="flex-1 overflow-y-auto p-5 md:p-6 space-y-4">
        <div v-if="cargandoOrdenes" class="text-center py-10 text-[#D4AF37] text-xs uppercase tracking-widest animate-pulse">Sincronizando mesas...</div>
        
        <div v-else-if="misOrdenesActivas.length === 0" class="text-center py-12 text-neutral-500 text-xs uppercase tracking-widest border border-dashed border-white/10 rounded-2xl">
          No tienes mesas pendientes por cobrar.
        </div>

        <div v-else v-for="orden in misOrdenesActivas" :key="orden.id" @click="editarMesaPendiente(orden)" class="bg-black border border-[#D4AF37]/30 p-5 rounded-2xl cursor-pointer hover:border-[#D4AF37] transition-all flex flex-col justify-between group shadow-sm">
          <div class="flex justify-between items-start mb-3">
            <h3 class="text-xl font-serif text-white group-hover:text-[#D4AF37] transition-colors">Mesa {{ orden.mesa }}</h3>
            <span class="bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-yellow-500/50 shadow-sm">
              Pendiente
            </span>
          </div>
          <div class="text-xs text-neutral-400 uppercase tracking-widest mb-4">
            Abierta: {{ new Date(orden.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) }}
          </div>
          <div class="flex justify-between items-center border-t border-white/10 pt-3 mt-auto">
            <span class="text-xs text-neutral-500 uppercase tracking-widest font-bold">Total Acumulado</span>
            <span class="text-xl md:text-2xl font-serif text-[#D4AF37]">${{ orden.total.toLocaleString('es-CO') }}</span>
          </div>
          <div class="mt-3 text-center text-[10px] text-white/40 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
            Tocar para editar / adicionar
          </div>
        </div>
      </div>
    </aside>

    <div class="w-full md:w-[380px] lg:w-[420px] bg-[#111] h-[100dvh] flex flex-col fixed md:relative bottom-0 z-50 transition-transform duration-300 transform md:translate-y-0 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] md:shadow-none" :class="mostrarCarritoMovil ? 'translate-y-0' : 'translate-y-[85dvh]'">
      
      <div @click="mostrarCarritoMovil = !mostrarCarritoMovil" class="md:hidden bg-[#D4AF37] p-4 text-center text-black font-bold uppercase text-sm flex justify-between items-center rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
        <span>{{ ordenActualId ? 'Editando Mesa' : 'Ver Ticket de Mesa' }}</span>
        <span class="bg-black text-[#D4AF37] px-3 py-1 rounded-full text-xs">{{ carrito.length }} ítems</span>
      </div>

      <div class="p-5 md:p-6 border-b border-white/10 bg-black relative">
        <button @click="handleLogout" class="absolute top-5 right-5 text-red-500 hover:text-red-400 p-2 md:hidden">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
        </button>
        <label class="text-xs md:text-sm text-neutral-400 uppercase font-bold tracking-widest">
          {{ ordenActualId ? 'Editando Mesa (Bloqueado)' : 'Número de Mesa / Cliente' }}
        </label>
        <input v-model="mesaActual" type="text" placeholder="Ej: Mesa 4" :disabled="ordenActualId !== null" class="w-full bg-white/5 border border-[#D4AF37]/30 p-4 md:p-5 rounded-xl focus:border-[#D4AF37] text-white outline-none mt-3 text-center text-xl md:text-2xl font-bold font-serif disabled:opacity-70" />
      </div>

      <div class="flex-1 overflow-y-auto p-4 md:p-5 space-y-4 relative">
        <div v-if="cargandoEdicion" class="absolute inset-0 bg-black/60 backdrop-blur-sm z-10 flex items-center justify-center">
          <span class="text-[#D4AF37] animate-pulse text-xs uppercase tracking-widest font-bold">Cargando pedido...</span>
        </div>

        <div v-if="carrito.length === 0" class="text-center text-neutral-500 text-sm uppercase tracking-widest mt-12 px-4">
          Selecciona platos en el menú para iniciar la orden
        </div>

        <div v-for="(item, index) in carrito" :key="index" class="bg-black border border-white/5 p-4 md:p-5 rounded-2xl shadow-sm">
          <div class="flex justify-between items-start mb-4">
            <h4 class="text-base md:text-lg font-bold text-white w-2/3 leading-tight">{{ item.producto.nombre }}</h4>
            <span class="text-[#D4AF37] text-sm md:text-base font-bold">${{ (item.producto.precio * item.cantidad).toLocaleString('es-CO') }}</span>
          </div>
          
          <div class="flex items-center gap-3 md:gap-4 mb-4">
            <button @click="modificarCantidad(index, -1)" class="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold text-xl active:scale-90 transition-transform">-</button>
            <span class="w-8 text-center text-base md:text-lg font-bold">{{ item.cantidad }}</span>
            <button @click="modificarCantidad(index, 1)" class="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#D4AF37]/20 hover:bg-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center font-bold text-xl active:scale-90 transition-transform">+</button>
            <button @click="eliminarDelCarrito(index)" class="ml-auto text-red-500 hover:bg-red-500/10 p-3 rounded-xl text-lg md:text-xl active:scale-90 transition-transform">🗑️</button>
          </div>

          <input v-model="item.notas" type="text" placeholder="Notas (Ej: Sin cebolla, extra salsa...)" class="w-full bg-white/5 border border-white/10 p-3 rounded-xl text-xs md:text-sm text-white focus:border-[#D4AF37]/50 outline-none placeholder:text-neutral-600 italic" />
        </div>
      </div>

      <div class="p-5 md:p-6 bg-black border-t border-white/10 shadow-[0_-10px_20px_rgba(0,0,0,0.3)] z-10">
        <div class="flex justify-between items-center mb-5 md:mb-6">
          <span class="text-sm text-neutral-400 uppercase tracking-widest font-bold">Total a Pagar</span>
          <span class="text-3xl md:text-4xl font-serif text-[#D4AF37]">${{ totalCarrito.toLocaleString('es-CO') }}</span>
        </div>
        
        <div class="flex gap-3 md:gap-4">
          <button v-if="!ordenActualId" @click="cancelarOrden" class="w-1/3 py-4 md:py-5 rounded-xl border border-red-500/30 text-red-500 text-xs md:text-sm uppercase font-bold tracking-widest hover:bg-red-500/10 active:scale-95 transition-transform">
            Cancelar
          </button>
          <button v-else @click="volverAtras" class="w-1/3 py-4 md:py-5 rounded-xl border border-neutral-500/30 text-neutral-400 text-xs md:text-sm uppercase font-bold tracking-widest hover:bg-neutral-500/10 active:scale-95 transition-transform">
            Volver
          </button>
          
          <button @click="enviarOrden" :disabled="enviando || carrito.length === 0 || !mesaActual" :class="['flex-1 py-4 md:py-5 rounded-xl text-black text-xs md:text-sm uppercase font-bold tracking-widest transition-all active:scale-95', (carrito.length === 0 || !mesaActual) ? 'bg-neutral-600 cursor-not-allowed opacity-50' : 'bg-[#D4AF37] hover:bg-yellow-500 shadow-[0_5px_20px_rgba(212,175,55,0.3)]']">
            {{ enviando ? 'Enviando...' : (ordenActualId ? 'Actualizar Mesa' : 'Mandar a Caja') }}
          </button>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted, watch } from 'vue'
import { supabase } from '../../lib/supabase' 
import { useRouter } from 'vue-router'

const router = useRouter()
const nombreMesera = ref('')
const localAsignado = ref('')
const meseraId = ref(null)

const menuCompleto = ref([])
const cargandoMenu = ref(true)
const categoriasDisponibles = ref([])
const categoriaActiva = ref('')

// NUEVO: ESTADO DE SUBCATEGORÍA PARA MESERAS
const subcategoriaActiva = ref('todas')

watch(categoriaActiva, () => {
  subcategoriaActiva.value = 'todas'
})

const mostrarCarritoMovil = ref(false)
const mesaActual = ref('')
const carrito = ref([])
const enviando = ref(false)
const busquedaMenu = ref('') 

// ESTADOS PARA "MIS MESAS ACTIVAS" Y EDICIÓN
const panelMesasAbierto = ref(false)
const misOrdenesActivas = ref([])
const cargandoOrdenes = ref(false)
let subscripcionMisMesas = null
const ordenActualId = ref(null) 
const cargandoEdicion = ref(false)

// DICCIONARIOS DE TRADUCCIÓN/FORMATO
const dictCategorias = {
  'entraditas': 'Entradas', 'restaurante': 'Restaurante', 'licores': 'Licores', 
  'bebidas': 'Bebidas', 'postres': 'Postres', 'comida': 'Comidas'
}

const dictSubcategorias = {
  'entradas': 'Entradas', 'cremas': 'Cremas', 'ensaladas': 'Ensaladas', 'ceviche': 'Ceviche', 
  'comida_rapida': 'Comida Rápida', 'carnes': 'Carnes', 'pollo': 'Pollo', 'pescados': 'Pescados', 
  'menu_ejecutivo': 'Menú Ejecutivo', 'adiciones': 'Adiciones', 'cocteles': 'Cócteles', 
  'cervezas': 'Cervezas', 'tragos': 'Tragos', 'botellas': 'Botellas', 'refrescantes': 'Refrescantes', 
  'calientes': 'Calientes', 'jugos': 'Jugos', 'otros': 'Otros', 'aguardiente': 'Aguardiente', 
  'ron': 'Ron', 'tequila': 'Tequila', 'mezcal': 'Mezcal', 'whisky': 'Whisky', 'ginebra': 'Ginebra', 
  'vodka': 'Vodka', 'vinos': 'Vinos', 'espumosos': 'Champagne / Espumosos', 'licores_varios': 'Licores Varios'
}

const formatearCategoria = (cat) => dictCategorias[cat] || cat.replace(/_/g, ' ').toUpperCase()
const formatearSubcategoria = (sub) => dictSubcategorias[sub] || sub.replace(/_/g, ' ').toUpperCase()

// 1. INICIALIZAR SESIÓN DE MESERA
const inicializarTerminal = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) { router.push('/login-pos'); return }

  const { data: perfil } = await supabase.from('perfiles').select('*').eq('id', user.id).single()
  
  if (!perfil || (perfil.rol !== 'mesera' && perfil.rol !== 'mesera_temporal')) {
    await supabase.auth.signOut()
    router.push('/login-pos')
    return
  }

  nombreMesera.value = perfil.nombre
  localAsignado.value = perfil.local_asignado || 'chao-pescado'
  meseraId.value = perfil.id

  await fetchMenuLocal()
  await fetchMisOrdenesActivas()
  inicializarRealtimeMisMesas()
}

// TRAER LAS MESAS ACTIVAS DE LA MESERA
const fetchMisOrdenesActivas = async () => {
  cargandoOrdenes.value = true
  const { data, error } = await supabase
    .from('pos_ordenes')
    .select('id, mesa, total, estado, created_at')
    .eq('mesera_id', meseraId.value)
    .eq('local', localAsignado.value)
    .eq('estado', 'pendiente')
    .order('created_at', { ascending: false })

  if (!error && data) {
    misOrdenesActivas.value = data
  }
  cargandoOrdenes.value = false
}

// ESCUCHAR CAMBIOS EN LAS MESAS DE LA MESERA (WebSockets)
const inicializarRealtimeMisMesas = () => {
  if (subscripcionMisMesas) return;
  
  subscripcionMisMesas = supabase
    .channel('mis_mesas_changes')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'pos_ordenes',
      filter: `mesera_id=eq.${meseraId.value}`
    }, () => {
      fetchMisOrdenesActivas(); 
    })
    .subscribe();
}

// CARGAR UNA ORDEN EXISTENTE PARA EDITARLA
const editarMesaPendiente = async (orden) => {
  panelMesasAbierto.value = false
  if(window.innerWidth < 768) mostrarCarritoMovil.value = true
  
  cargandoEdicion.value = true
  mesaActual.value = orden.mesa
  ordenActualId.value = orden.id
  carrito.value = [] 

  try {
    const { data: items, error } = await supabase
      .from('pos_orden_items')
      .select('id, cantidad, precio_unitario, notas, producto_id, menu_gastronomia(id, nombre, precio, categoria)')
      .eq('orden_id', orden.id)

    if (error) throw error

    if (items) {
      carrito.value = items.map(item => ({
        id_unico: Date.now() + Math.random(), 
        producto: item.menu_gastronomia,
        cantidad: item.cantidad,
        notas: item.notas || ''
      }))
    }
  } catch (error) {
    console.error("Error al cargar la mesa:", error)
    alert("No se pudo cargar el detalle de la mesa.")
    cancelarOrden()
  } finally {
    cargandoEdicion.value = false
  }
}

// 2. TRAER EL MENÚ CON CATEGORÍAS Y SUBCATEGORÍAS ORDENADAS
const fetchMenuLocal = async () => {
  cargandoMenu.value = true
  const { data } = await supabase
    .from('menu_gastronomia')
    .select('id, nombre, precio, descripcion, categoria, subcategoria, codigo_pos') 
    .ilike('local', `%${localAsignado.value}%`)
    .eq('disponible', true)
    .order('nombre', { ascending: true })

  if (data) {
    menuCompleto.value = data
    
    let categorias = [...new Set(data.map(item => item.categoria))]
    const ordenTarjetas = ['bebidas', 'entraditas', 'restaurante', 'postres', 'licores']
    
    categorias.sort((a, b) => {
      let indexA = ordenTarjetas.indexOf(a)
      let indexB = ordenTarjetas.indexOf(b)
      if (indexA === -1) indexA = 999
      if (indexB === -1) indexB = 999
      return indexA - indexB
    })

    categoriasDisponibles.value = categorias
    if (categorias.length > 0) categoriaActiva.value = categorias[0]
  }
  cargandoMenu.value = false
}

// NUEVO: COMPUTAR LAS SUBCATEGORÍAS DISPONIBLES SEGÚN LA CATEGORÍA ACTIVA
const subcategoriasDisponiblesMenu = computed(() => {
  if (!categoriaActiva.value) return []
  const itemsDeCategoria = menuCompleto.value.filter(item => item.categoria === categoriaActiva.value)
  let sub = [...new Set(itemsDeCategoria.map(item => item.subcategoria).filter(Boolean))]
  
  const ordenEstricto = [
    'entradas', 'cremas', 'ensaladas', 'ceviche', 'comida_rapida', 'carnes', 'pollo', 'pescados', 'menu_ejecutivo', 'adiciones',
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


// LÓGICA DE FILTRADO, BUSQUEDA Y AGRUPACIÓN
const menuFiltradoYBusqueda = computed(() => {
  let resultado = menuCompleto.value

  if (busquedaMenu.value.trim() !== '') {
    // Normalizar la búsqueda: minúsculas y eliminación de tildes/diacríticos
    const query = busquedaMenu.value.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    
    return resultado.filter(item => {
      // Normalizar el nombre y la descripción del plato
      const nombreNormalizado = item.nombre ? item.nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : ""
      const descNormalizada = item.descripcion ? item.descripcion.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") : ""
      
      // Comparar las versiones limpias (sin tildes)
      return nombreNormalizado.includes(query) || descNormalizada.includes(query)
    })
  }

  // Filtrar primero por categoría principal
  resultado = resultado.filter(item => item.categoria === categoriaActiva.value)

  // Luego filtrar por subcategoría si no está en "todas"
  if (subcategoriaActiva.value !== 'todas') {
    resultado = resultado.filter(item => item.subcategoria === subcategoriaActiva.value)
  }

  return resultado
})

const tieneSubcategorias = computed(() => {
  return menuFiltradoYBusqueda.value.some(item => item.subcategoria && item.subcategoria.trim() !== '')
})

const menuAgrupado = computed(() => {
  if (!tieneSubcategorias.value) {
    return { 'otros': menuFiltradoYBusqueda.value }
  }

  const grupos = {}
  menuFiltradoYBusqueda.value.forEach(item => {
    const sub = item.subcategoria?.trim() || 'otros'
    if (!grupos[sub]) grupos[sub] = []
    grupos[sub].push(item)
  })

  const ordenEstricto = [
    'entradas', 'cremas', 'ensaladas', 'ceviche', 'comida_rapida', 'carnes', 'pollo', 'pescados', 'menu_ejecutivo', 'adiciones',
    'cocteles', 'cervezas', 'tragos', 'botellas',
    'refrescantes', 'calientes', 'jugos',
    'otros'
  ]

  const gruposOrdenados = {}
  ordenEstricto.forEach(subcat => { 
    if (grupos[subcat]) gruposOrdenados[subcat] = grupos[subcat] 
  })
  Object.keys(grupos).forEach(subcat => { 
    if (!gruposOrdenados[subcat]) gruposOrdenados[subcat] = grupos[subcat] 
  })

  return gruposOrdenados
})

// 3. LÓGICA DEL CARRITO
const agregarAlCarrito = (producto) => {
  carrito.value.unshift({ 
    id_unico: Date.now(), 
    producto: producto, 
    cantidad: 1, 
    notas: '' 
  })
  mostrarCarritoMovil.value = true
}

const modificarCantidad = (index, cambio) => {
  const nuevaCantidad = carrito.value[index].cantidad + cambio
  if (nuevaCantidad > 0) {
    carrito.value[index].cantidad = nuevaCantidad
  } else {
    eliminarDelCarrito(index)
  }
}

const eliminarDelCarrito = (index) => {
  carrito.value.splice(index, 1)
}

const totalCarrito = computed(() => {
  return carrito.value.reduce((total, item) => total + (item.producto.precio * item.cantidad), 0)
})

const cancelarOrden = () => {
  if(confirm('¿Deseas vaciar el carrito actual? (Si estabas editando una mesa, los cambios no se guardarán)')) {
    carrito.value = []
    mesaActual.value = ''
    ordenActualId.value = null 
    mostrarCarritoMovil.value = false
  }
}

// Función para dar marcha atrás sin borrar nada de la base de datos
const volverAtras = () => {
  carrito.value = []
  mesaActual.value = ''
  ordenActualId.value = null
  mostrarCarritoMovil.value = false
}

// 4. ENVÍO DE LA ORDEN A CAJA (O ACTUALIZACIÓN EXACTA)
const enviarOrden = async () => {
  if (!mesaActual.value) { alert("Debes ingresar el número de mesa."); return; }
  
  enviando.value = true
  try {
    
    if (ordenActualId.value) {
      
      const { error: deleteError } = await supabase
        .from('pos_orden_items')
        .delete()
        .eq('orden_id', ordenActualId.value)
        
      if (deleteError) throw deleteError

      const itemsParaInsertar = carrito.value.map(item => ({
        orden_id: ordenActualId.value,
        producto_id: item.producto.id,
        cantidad: item.cantidad,
        precio_unitario: item.producto.precio,
        notas: item.notas.trim() || null
      }))

      if(itemsParaInsertar.length > 0) {
        const { error: itemsError } = await supabase.from('pos_orden_items').insert(itemsParaInsertar)
        if (itemsError) throw itemsError
      }

      const { error: updateError } = await supabase
        .from('pos_ordenes')
        .update({ 
          subtotal: totalCarrito.value, 
          total: totalCarrito.value,
          created_at: new Date().toISOString() 
        })
        .eq('id', ordenActualId.value);
        
      if (updateError) throw updateError;
      
      alert(`✅ ¡Mesa ${mesaActual.value} actualizada exitosamente!`);

    } else {
      
      const { data: fantasma } = await supabase.from('pos_ordenes').select('id').eq('local', localAsignado.value).eq('mesa', mesaActual.value).eq('estado', 'pendiente').maybeSingle()
      if(fantasma) {
        alert("Ya existe una orden pendiente para esta mesa. Usa el panel 'Mis Mesas' para editarla o cancelarla primero.")
        enviando.value = false
        return
      }

      const { data: nuevaOrden, error: insertError } = await supabase
        .from('pos_ordenes')
        .insert([{
          local: localAsignado.value,
          mesera_id: meseraId.value,
          mesa: mesaActual.value,
          estado: 'pendiente',
          subtotal: totalCarrito.value,
          total: totalCarrito.value
        }])
        .select()
        .single();

      if (insertError) throw insertError;
      
      const itemsParaInsertar = carrito.value.map(item => ({
        orden_id: nuevaOrden.id,
        producto_id: item.producto.id,
        cantidad: item.cantidad,
        precio_unitario: item.producto.precio,
        notas: item.notas.trim() || null
      }))

      const { error: itemsError } = await supabase.from('pos_orden_items').insert(itemsParaInsertar)
      if (itemsError) throw itemsError

      alert(`✅ ¡Orden nueva enviada a caja exitosamente! (Mesa ${mesaActual.value})`);
    }

    carrito.value = []
    mesaActual.value = ''
    ordenActualId.value = null
    mostrarCarritoMovil.value = false

  } catch (error) {
    console.error("Error al enviar la orden:", error)
    alert("Ocurrió un error al sincronizar con la caja.")
  } finally {
    enviando.value = false
  }
}

const handleLogout = async () => {
  if(carrito.value.length > 0) {
    if(!confirm("Tienes información en el carrito. Si sales ahora, se perderá. ¿Seguro que deseas salir?")) return
  }
  await supabase.auth.signOut()
  router.push('/login-pos')
}

onMounted(() => { inicializarTerminal() })

onUnmounted(() => {
  if (subscripcionMisMesas) {
    supabase.removeChannel(subscripcionMisMesas)
  }
})
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>