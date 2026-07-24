<template>
  <div class="h-[100dvh] w-full bg-[#0a0a0a] text-white font-sans flex flex-col md:flex-row overflow-hidden relative antialiased select-none">
    
    <main class="flex-1 flex flex-col h-[100dvh] border-r border-white/10 relative z-10">
      
      <header class="bg-[#111]/95 backdrop-blur-xl p-4 md:p-6 flex justify-between items-center border-b border-white/10 relative z-20 shadow-md">
        <div>
          <h1 class="text-[#D4AF37] font-serif text-xl md:text-2xl uppercase tracking-widest drop-shadow-sm">Toma de Pedidos</h1>
          <p class="text-xs md:text-sm text-neutral-400 uppercase mt-1 tracking-wide">
            Mesera Activa: <span class="text-white font-bold">{{ nombreMesera }}</span> ({{ localAsignado.replace(/-/g, ' ') }})
          </p>
        </div>
        <div class="flex items-center gap-3">
          <button 
            @click="panelMesasAbierto = true" 
            class="bg-[#D4AF37]/10 text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37]/20 hover:shadow-[0_0_15px_rgba(212,175,55,0.15)] px-4 py-3 rounded-lg text-xs md:text-sm font-bold uppercase tracking-widest transition-all duration-300 flex items-center gap-2 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50"
          >
            <span>Mis Mesas</span>
            <span class="bg-[#D4AF37] text-black px-2 py-0.5 rounded-full text-[10px] shadow-inner">{{ misOrdenesActivas.length }}</span>
          </button>
          <button 
            @click="handleLogout" 
            class="text-red-500 hover:bg-red-500/10 px-4 py-3 rounded-lg text-xs md:text-sm font-bold uppercase tracking-widest transition-all duration-300 hidden md:block active:scale-95 focus:outline-none"
          >
            Salir
          </button>
        </div>
      </header>

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
                  @click.stop="agregarAlCarrito(item)" 
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
    </main>

    <div v-if="panelMesasAbierto" @click="panelMesasAbierto = false" class="fixed inset-0 bg-black/80 z-[100] backdrop-blur-md transition-opacity" aria-hidden="true"></div>
    
    <aside 
      :class="[
        'fixed top-0 right-0 bottom-0 w-full md:w-[400px] bg-[#111] border-l border-white/10 z-[110] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.9)]', 
        panelMesasAbierto ? 'translate-x-0' : 'translate-x-full'
      ]"
      aria-label="Panel de mesas activas"
    >
      <header class="p-5 md:p-6 border-b border-white/10 flex justify-between items-center bg-black">
        <h2 class="text-[#D4AF37] font-serif text-xl md:text-2xl uppercase tracking-widest drop-shadow-md">Mis Mesas Activas</h2>
        <button @click="panelMesasAbierto = false" class="text-neutral-500 hover:text-white hover:bg-white/10 p-2.5 bg-white/5 rounded-full transition-colors active:scale-90 focus:outline-none">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </header>

      <div class="flex-1 overflow-y-auto p-5 md:p-6 space-y-4">
        <div v-if="cargandoOrdenes" class="text-center py-10 text-[#D4AF37] text-xs uppercase tracking-widest animate-pulse font-bold">Sincronizando mesas...</div>
        
        <div v-else-if="misOrdenesActivas.length === 0" class="text-center py-12 text-neutral-500 text-xs uppercase tracking-widest border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
          No tienes mesas pendientes por cobrar.
        </div>

        <article 
          v-else 
          v-for="orden in misOrdenesActivas" 
          :key="orden.mesa" 
          @click="editarMesaPendiente(orden)" 
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

    <aside 
      class="w-full md:w-[380px] lg:w-[420px] bg-[#111] h-[100dvh] flex flex-col fixed md:relative bottom-0 z-50 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] transform md:translate-y-0 shadow-[0_-20px_50px_rgba(0,0,0,0.8)] md:shadow-[-10px_0_30px_rgba(0,0,0,0.5)] border-l border-white/10" 
      :class="mostrarCarritoMovil ? 'translate-y-0' : 'translate-y-[85dvh]'"
      aria-label="Ticket de la orden actual"
    >
      <div 
        @click="mostrarCarritoMovil = !mostrarCarritoMovil" 
        class="md:hidden bg-[#D4AF37] p-4 text-center text-black font-bold uppercase text-sm flex justify-between items-center rounded-t-3xl shadow-[0_-5px_20px_rgba(212,175,55,0.4)] cursor-pointer active:bg-yellow-500 transition-colors"
      >
        <span>{{ ordenActualId ? 'Editando Mesa' : 'Ver Ticket de Mesa' }}</span>
        <span class="bg-black text-[#D4AF37] px-3 py-1 rounded-full text-xs shadow-inner">{{ carrito.length }} ítems</span>
      </div>

      <div class="p-5 md:p-6 border-b border-white/10 bg-black relative">
        <button @click="handleLogout" class="absolute top-5 right-5 text-red-500 hover:text-red-400 p-2 md:hidden active:scale-90 transition-transform focus:outline-none">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
        </button>
        <label for="inputMesa" class="text-xs md:text-sm text-neutral-400 uppercase font-bold tracking-widest block text-center">
          {{ ordenActualId ? 'Editando Mesa (Bloqueado)' : 'Número de Mesa / Cliente' }}
        </label>
        <input 
          id="inputMesa"
          v-model="mesaActual" 
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
              <button @click="modificarCantidad(index, -1)" class="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white flex items-center justify-center font-bold text-xl active:scale-90 transition-all focus:outline-none">-</button>
              <span class="w-8 text-center text-base md:text-lg font-bold">{{ item.cantidad }}</span>
              <button @click="modificarCantidad(index, 1)" class="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 hover:bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center font-bold text-xl active:scale-90 transition-all focus:outline-none">+</button>
              <button @click="eliminarDelCarrito(index)" class="ml-auto text-red-500 hover:bg-red-500/10 p-3 rounded-xl text-lg md:text-xl active:scale-90 transition-all focus:outline-none" aria-label="Eliminar ítem">🗑️</button>
            </div>

            <input 
              v-model="item.notas" 
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
            @click="cancelarOrden" 
            class="w-1/3 py-4 md:py-5 rounded-xl border border-red-500/30 text-red-500 text-xs md:text-sm uppercase font-bold tracking-widest hover:bg-red-500/10 active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-red-500/30"
          >
            Cancelar
          </button>
          <button 
            v-else 
            @click="volverAtras" 
            class="w-1/3 py-4 md:py-5 rounded-xl border border-neutral-500/30 text-neutral-400 text-xs md:text-sm uppercase font-bold tracking-widest hover:bg-neutral-500/10 hover:text-white active:scale-95 transition-all focus:outline-none focus:ring-4 focus:ring-white/20"
          >
            Volver
          </button>
          
          <button 
            @click="enviarOrden" 
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

  </div>
</template>

<script setup>
// CLIENTE NATIVE SUPABASE PARA NUXT 3 (Seguro en SSR)
const supabase = useSupabaseClient()

// =====================================
// 🛡️ SEGURIDAD ESTRICTA Y ANTI-SEO (Blindaje SSR de Nuxt)
// =====================================
useHead({
  title: 'Toma de Pedidos | POS Palacio Nacional',
  meta: [
    { name: 'robots', content: 'noindex, nofollow, noarchive, nosnippet' },
    { name: 'googlebot', content: 'noindex, nofollow' }
  ]
})

// =====================================
// RENDIMIENTO Y ESTRUCTURA: Constantes extraídas
// =====================================
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

// =====================================
// ESTADO REACTIVO
// =====================================
const nombreMesera = ref('')
const localAsignado = ref('')
const meseraId = ref(null)

const menuCompleto = ref([])
const cargandoMenu = ref(true)
const categoriasDisponibles = ref([])
const categoriaActiva = ref('')
const subcategoriaActiva = ref('todas')
const busquedaMenu = ref('') 

// Estado del Carrito y UX
const mostrarCarritoMovil = ref(false)
const mesaActual = ref('')
const carrito = ref([])
const enviando = ref(false)

// Estado del Panel de Mesas (Órdenes Activas)
const panelMesasAbierto = ref(false)
const misOrdenesActivas = ref([])
const cargandoOrdenes = ref(false)
let subscripcionMisMesas = null
const ordenActualId = ref(null) 
const cargandoEdicion = ref(false)

// Reiniciar subcategoría al cambiar de categoría principal
watch(categoriaActiva, () => {
  subcategoriaActiva.value = 'todas'
})

// =====================================
// AUTENTICACIÓN
// =====================================
const blindarTerminal = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) { return navigateTo('/login-pos') }

  const { data: perfil, error } = await supabase.from('perfiles').select('id, nombre, rol, local_asignado').eq('id', user.id).single()
  
  if (error || !perfil || (perfil.rol !== 'mesera' && perfil.rol !== 'mesera_temporal')) {
    await supabase.auth.signOut()
    return navigateTo('/login-pos')
  }

  nombreMesera.value = perfil.nombre
  localAsignado.value = perfil.local_asignado || 'chao-pescado'
  meseraId.value = perfil.id

  await fetchMenuLocal()
  await fetchMisOrdenesActivas()
  inicializarRealtimeMisMesas()
}

// =====================================
// LÓGICA DE NEGOCIO SUPABASE
// =====================================
const fetchMisOrdenesActivas = async () => {
  cargandoOrdenes.value = true
  const { data, error } = await supabase
    .from('pos_ordenes')
    .select('id, mesa, total, estado, created_at')
    .eq('mesera_id', meseraId.value)
    .eq('local', localAsignado.value)
    .eq('estado', 'pendiente')
    .order('created_at', { ascending: true })

  if (!error && data) {
    const agrupadas = {}
    data.forEach(orden => {
      if (!agrupadas[orden.mesa]) {
        agrupadas[orden.mesa] = {
          mesa: orden.mesa,
          ids_asociados: [orden.id],
          total: orden.total,
          created_at: orden.created_at
        }
      } else {
        agrupadas[orden.mesa].ids_asociados.push(orden.id)
        agrupadas[orden.mesa].total += orden.total
      }
    })
    misOrdenesActivas.value = Object.values(agrupadas).sort((a,b) => new Date(b.created_at) - new Date(a.created_at))
  }
  cargandoOrdenes.value = false
}

const inicializarRealtimeMisMesas = () => {
  if (subscripcionMisMesas) return
  subscripcionMisMesas = supabase
    .channel('mis_mesas_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'pos_ordenes', filter: `mesera_id=eq.${meseraId.value}` }, () => {
      fetchMisOrdenesActivas()
    })
    .subscribe()
}

const editarMesaPendiente = async (ordenGroup) => {
  panelMesasAbierto.value = false
  if(import.meta.client && window.innerWidth < 768) mostrarCarritoMovil.value = true
  cargandoEdicion.value = true
  mesaActual.value = ordenGroup.mesa
  ordenActualId.value = ordenGroup.ids_asociados
  carrito.value = [] 

  try {
    const { data: items, error } = await supabase
      .from('pos_orden_items')
      .select('id, cantidad, precio_unitario, notas, orden_id, producto_id, menu_gastronomia(id, nombre, precio, categoria)')
      .in('orden_id', ordenGroup.ids_asociados)

    if (error) throw error

    if (items) {
      carrito.value = items.map(item => ({
        id_db: item.id,
        orden_id_db: item.orden_id,
        id_unico: Date.now() + Math.random(), 
        producto: item.menu_gastronomia,
        cantidad: item.cantidad,
        notas: item.notas || '',
        original_cantidad: item.cantidad,
        original_notas: item.notas || ''
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

// =====================================
// RENDIMIENTO: Optimización de Computed Properties
// =====================================
const subcategoriasDisponiblesMenu = computed(() => {
  if (!categoriaActiva.value) return []
  const itemsDeCategoria = menuCompleto.value.filter(item => item.categoria === categoriaActiva.value)
  let sub = [...new Set(itemsDeCategoria.map(item => item.subcategoria).filter(Boolean))]
  
  sub.sort((a, b) => {
    let indexA = ORDEN_ESTRICTO_SUBCAT.indexOf(a)
    let indexB = ORDEN_ESTRICTO_SUBCAT.indexOf(b)
    return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB)
  })
  return sub
})

const menuFiltradoYBusqueda = computed(() => {
  let resultado = menuCompleto.value

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

// =====================================
// ACCIONES DEL CARRITO Y ENVÍO
// =====================================
const agregarAlCarrito = (producto) => {
  carrito.value.unshift({ id_unico: Date.now() + Math.random(), producto: producto, cantidad: 1, notas: '' })
  mostrarCarritoMovil.value = true
}

const modificarCantidad = (index, cambio) => {
  const nuevaCantidad = carrito.value[index].cantidad + cambio
  if (nuevaCantidad > 0) carrito.value[index].cantidad = nuevaCantidad
  else eliminarDelCarrito(index)
}

const eliminarDelCarrito = (index) => carrito.value.splice(index, 1)

const totalCarrito = computed(() => carrito.value.reduce((total, item) => total + (item.producto.precio * item.cantidad), 0))

const cancelarOrden = () => {
  if(import.meta.client && confirm('¿Deseas vaciar el carrito actual? (Si estabas editando una mesa, los cambios no se guardarán)')) {
    carrito.value = []
    mesaActual.value = ''
    ordenActualId.value = null 
    mostrarCarritoMovil.value = false
  }
}

const volverAtras = () => {
  carrito.value = []
  mesaActual.value = ''
  ordenActualId.value = null
  mostrarCarritoMovil.value = false
}

const enviarOrden = async () => {
  if (!mesaActual.value) { 
    if(import.meta.client) alert("Debes ingresar el número de mesa."); 
    return; 
  }
  
  enviando.value = true
  try {
    if (ordenActualId.value && Array.isArray(ordenActualId.value)) {
      const itemsNuevos = carrito.value.filter(item => !item.id_db)
      const itemsExistentes = carrito.value.filter(item => item.id_db)

      const { data: currentDbItems } = await supabase.from('pos_orden_items').select('id, orden_id').in('orden_id', ordenActualId.value)
      const idsEnCarrito = itemsExistentes.map(i => i.id_db)
      const itemsParaBorrar = (currentDbItems || []).filter(dbItem => !idsEnCarrito.includes(dbItem.id))

      if (itemsParaBorrar.length > 0) {
        const idsToDelete = itemsParaBorrar.map(i => i.id)
        await supabase.from('pos_orden_items').delete().in('id', idsToDelete)
      }

      for (const item of itemsExistentes) {
        if (item.cantidad !== item.original_cantidad || item.notas !== item.original_notas) {
          await supabase.from('pos_orden_items').update({ cantidad: item.cantidad, notas: item.notas.trim() || null }).eq('id', item.id_db)
        }
      }

      for (const ordId of ordenActualId.value) {
         const itemsDeEstaOrden = itemsExistentes.filter(i => i.orden_id_db === ordId)
         const sum = itemsDeEstaOrden.reduce((acc, curr) => acc + (curr.producto.precio * curr.cantidad), 0)
         
         if (itemsDeEstaOrden.length === 0) {
            await supabase.from('pos_ordenes').delete().eq('id', ordId)
         } else {
            await supabase.from('pos_ordenes').update({ total: sum, subtotal: sum }).eq('id', ordId)
         }
      }

      if (itemsNuevos.length > 0) {
        const totalNuevos = itemsNuevos.reduce((acc, curr) => acc + (curr.producto.precio * curr.cantidad), 0)
        
        const { data: nuevaOrden, error: insertError } = await supabase
          .from('pos_ordenes')
          .insert([{ local: localAsignado.value, mesera_id: meseraId.value, mesa: mesaActual.value, estado: 'pendiente', subtotal: totalNuevos, total: totalNuevos }])
          .select().single()

        if (insertError) throw insertError
        const itemsParaInsertar = itemsNuevos.map(item => ({ orden_id: nuevaOrden.id, producto_id: item.producto.id, cantidad: item.cantidad, precio_unitario: item.producto.precio, notas: item.notas.trim() || null }))
        await supabase.from('pos_orden_items').insert(itemsParaInsertar)
      }
      if(import.meta.client) alert(`✅ ¡Mesa ${mesaActual.value} actualizada exitosamente!`)

    } else {
      const { data: nuevaOrden, error: insertError } = await supabase
        .from('pos_ordenes')
        .insert([{ local: localAsignado.value, mesera_id: meseraId.value, mesa: mesaActual.value, estado: 'pendiente', subtotal: totalCarrito.value, total: totalCarrito.value }])
        .select().single()

      if (insertError) throw insertError
      
      const itemsParaInsertar = carrito.value.map(item => ({ orden_id: nuevaOrden.id, producto_id: item.producto.id, cantidad: item.cantidad, precio_unitario: item.producto.precio, notas: item.notas.trim() || null }))
      const { error: itemsError } = await supabase.from('pos_orden_items').insert(itemsParaInsertar)
      
      if (itemsError) throw itemsError
      if(import.meta.client) alert(`✅ ¡Orden nueva enviada a caja exitosamente! (Mesa ${mesaActual.value})`)
    }

    carrito.value = []
    mesaActual.value = ''
    ordenActualId.value = null
    mostrarCarritoMovil.value = false

  } catch (error) {
    console.error("Error al enviar la orden:", error)
    if(import.meta.client) alert("Ocurrió un error al sincronizar con la caja.")
  } finally {
    enviando.value = false
  }
}

const handleLogout = async () => {
  if(carrito.value.length > 0) {
    if(import.meta.client && !confirm("Tienes información en el carrito. Si sales ahora, se perderá. ¿Seguro que deseas salir?")) return
  }
  await supabase.auth.signOut()
  return navigateTo('/login-pos')
}

// CICLO DE VIDA
onMounted(() => { blindarTerminal() })

onUnmounted(() => {
  if (subscripcionMisMesas) supabase.removeChannel(subscripcionMisMesas)
})
definePageMeta({
  layout: false // Apaga el layout maestro. Ni Navbar ni Footer aparecerán.
})
</script>

<style scoped>
/* RENDIMIENTO Y SUAVIDAD UI/UX */
.antialiased {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, h4 {
  text-rendering: optimizeLegibility;
}

.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

/* Transiciones elegantes nativas */
.fade-enter-active,
.fade-leave-active { transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.fade-enter-from,
.fade-leave-to { opacity: 0; transform: scale(0.98); }

.list-enter-active,
.list-leave-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.list-enter-from,
.list-leave-to { opacity: 0; transform: translateX(-20px); }

/* Accesibilidad y usabilidad táctil */
input:disabled { cursor: not-allowed; }
</style>