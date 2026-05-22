<template>
  <div class="h-[100dvh] w-full bg-[#0a0a0a] text-white font-sans flex flex-col md:flex-row overflow-hidden">
    
    <div class="flex-1 flex flex-col h-[100dvh] border-r border-white/10">
      
      <header class="bg-[#111] p-4 md:p-6 flex justify-between items-center border-b border-white/10">
        <div>
          <h1 class="text-[#D4AF37] font-serif text-xl md:text-2xl uppercase tracking-widest">Toma de Pedidos</h1>
          <p class="text-xs md:text-sm text-neutral-400 uppercase mt-1">
            Mesera Activa: <span class="text-white font-bold">{{ nombreMesera }}</span> ({{ localAsignado.replace(/-/g, ' ') }})
          </p>
        </div>
        <button @click="handleLogout" class="text-red-500 hover:bg-red-500/10 px-4 py-3 rounded-lg text-xs md:text-sm font-bold uppercase tracking-widest transition-all">
          Salir
        </button>
      </header>

      <div class="p-4 md:p-5 bg-black border-b border-white/5 overflow-x-auto hide-scrollbar flex gap-3 md:gap-4">
        <button 
          v-for="cat in categoriasDisponibles" 
          :key="cat" 
          @click="categoriaActiva = cat"
          :class="['whitespace-nowrap uppercase tracking-widest text-xs md:text-sm px-6 py-3 md:py-4 rounded-xl transition-all font-bold', categoriaActiva === cat ? 'bg-[#D4AF37] text-black shadow-md' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10']"
        >
          {{ formatearCategoria(cat) }}
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-4 md:p-6 pb-32 md:pb-6 space-y-8">
        
        <div v-if="cargandoMenu" class="text-center py-10 text-[#D4AF37] text-sm uppercase tracking-widest animate-pulse">
          Cargando Menú...
        </div>
        
        <div v-for="(items, subcat) in menuAgrupado" :key="subcat" class="w-full">
          
          <h3 v-if="subcat !== 'otros' || Object.keys(menuAgrupado).length > 1" class="text-[#D4AF37] font-serif text-xl md:text-2xl mb-4 border-b border-[#D4AF37]/20 pb-2 pl-2 tracking-wide uppercase">
            {{ formatearSubcategoria(subcat) }}
          </h3>

          <div class="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            <div v-for="item in items" :key="item.id" @click="agregarAlCarrito(item)" class="bg-[#111] border border-white/5 rounded-2xl p-4 md:p-5 cursor-pointer hover:border-[#D4AF37]/50 hover:bg-white/5 transition-all flex flex-col justify-between group active:scale-95 shadow-sm">
              <div>
                <h3 class="font-serif text-base md:text-lg leading-tight group-hover:text-[#D4AF37] transition-colors">{{ item.nombre }}</h3>
                <span class="text-[#D4AF37] text-sm md:text-base font-bold mt-2 inline-block">${{ item.precio.toLocaleString('es-CO') }}</span>
              </div>
              <div class="mt-4 flex justify-end">
                <div class="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center font-bold text-xl md:text-2xl group-hover:bg-[#D4AF37] group-hover:text-black transition-colors shadow-inner">
                  +
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>

    <div class="w-full md:w-[380px] lg:w-[420px] bg-[#111] h-[100dvh] flex flex-col fixed md:relative bottom-0 z-50 transition-transform duration-300 transform md:translate-y-0 shadow-[-10px_0_30px_rgba(0,0,0,0.5)] md:shadow-none" :class="mostrarCarritoMovil ? 'translate-y-0' : 'translate-y-[85dvh]'">
      
      <div @click="mostrarCarritoMovil = !mostrarCarritoMovil" class="md:hidden bg-[#D4AF37] p-4 text-center text-black font-bold uppercase text-sm flex justify-between items-center rounded-t-3xl shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
        <span>Ver Ticket de Mesa</span>
        <span class="bg-black text-[#D4AF37] px-3 py-1 rounded-full text-xs">{{ carrito.length }} ítems</span>
      </div>

      <div class="p-5 md:p-6 border-b border-white/10 bg-black">
        <label class="text-xs md:text-sm text-neutral-400 uppercase font-bold tracking-widest">Número de Mesa / Cliente</label>
        <input v-model="mesaActual" type="text" placeholder="Ej: Mesa 4" class="w-full bg-white/5 border border-[#D4AF37]/30 p-4 md:p-5 rounded-xl focus:border-[#D4AF37] text-white outline-none mt-3 text-center text-xl md:text-2xl font-bold font-serif" />
      </div>

      <div class="flex-1 overflow-y-auto p-4 md:p-5 space-y-4">
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
          <button @click="cancelarOrden" class="w-1/3 py-4 md:py-5 rounded-xl border border-red-500/30 text-red-500 text-xs md:text-sm uppercase font-bold tracking-widest hover:bg-red-500/10 active:scale-95 transition-transform">
            Cancelar
          </button>
          <button @click="enviarOrden" :disabled="enviando || carrito.length === 0 || !mesaActual" :class="['flex-1 py-4 md:py-5 rounded-xl text-black text-xs md:text-sm uppercase font-bold tracking-widest transition-all active:scale-95', (carrito.length === 0 || !mesaActual) ? 'bg-neutral-600 cursor-not-allowed opacity-50' : 'bg-[#D4AF37] hover:bg-yellow-500 shadow-[0_5px_20px_rgba(212,175,55,0.3)]']">
            {{ enviando ? 'Enviando...' : 'Mandar a Caja' }}
          </button>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
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

const mostrarCarritoMovil = ref(false)
const mesaActual = ref('')
const carrito = ref([])
const enviando = ref(false)

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
}

// 2. TRAER EL MENÚ CON CATEGORÍAS Y SUBCATEGORÍAS ORDENADAS
const fetchMenuLocal = async () => {
  cargandoMenu.value = true
  const { data } = await supabase
    .from('menu_gastronomia')
    .select('id, nombre, precio, categoria, subcategoria, codigo_pos') // IMPORTANTE: Se añadió subcategoria
    .ilike('local', `%${localAsignado.value}%`)
    .eq('disponible', true)
    .order('nombre', { ascending: true })

  if (data) {
    menuCompleto.value = data
    
    // Obtener y ordenar las categorías principales (Para las pestañas)
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

// LÓGICA DE FILTRADO Y AGRUPACIÓN
const menuFiltrado = computed(() => {
  return menuCompleto.value.filter(item => item.categoria === categoriaActiva.value)
})

const tieneSubcategorias = computed(() => {
  return menuFiltrado.value.some(item => item.subcategoria && item.subcategoria.trim() !== '')
})

const menuAgrupado = computed(() => {
  if (!tieneSubcategorias.value) {
    return { 'otros': menuFiltrado.value }
  }

  const grupos = {}
  menuFiltrado.value.forEach(item => {
    const sub = item.subcategoria?.trim() || 'otros'
    if (!grupos[sub]) grupos[sub] = []
    grupos[sub].push(item)
  })

  // Aplicamos el orden estricto de las subcategorías
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
  if(confirm('¿Vaciar la orden actual por completo?')) {
    carrito.value = []
    mesaActual.value = ''
    mostrarCarritoMovil.value = false
  }
}

// 4. ENVÍO DE LA ORDEN A CAJA
const enviarOrden = async () => {
  if (!mesaActual.value) { alert("Debes ingresar el número de mesa."); return; }
  
  enviando.value = true
  try {
    const { data: ordenData, error: ordenError } = await supabase
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
      .single()

    if (ordenError) throw ordenError

    const itemsParaInsertar = carrito.value.map(item => ({
      orden_id: ordenData.id,
      producto_id: item.producto.id,
      cantidad: item.cantidad,
      precio_unitario: item.producto.precio,
      notas: item.notas.trim() || null
    }))

    const { error: itemsError } = await supabase
      .from('pos_orden_items')
      .insert(itemsParaInsertar)

    if (itemsError) throw itemsError

    alert(`✅ ¡Orden enviada a caja exitosamente! (Mesa ${mesaActual.value})`)
    carrito.value = []
    mesaActual.value = ''
    mostrarCarritoMovil.value = false

  } catch (error) {
    console.error("Error al enviar la orden:", error)
    alert("Ocurrió un error al enviar la orden a caja.")
  } finally {
    enviando.value = false
  }
}

const handleLogout = async () => {
  if(carrito.value.length > 0) {
    if(!confirm("Tienes una orden pendiente sin enviar. ¿Seguro que deseas salir?")) return
  }
  await supabase.auth.signOut()
  router.push('/login-pos')
}

onMounted(() => { inicializarTerminal() })
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>