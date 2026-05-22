<template>
  <div class="min-h-screen bg-[#0a0a0a] text-white font-sans flex flex-col md:flex-row overflow-hidden">
    
    <div class="flex-1 flex flex-col h-screen border-r border-white/10">
      
      <header class="bg-[#111] p-4 flex justify-between items-center border-b border-white/10">
        <div>
          <h1 class="text-[#D4AF37] font-serif text-xl uppercase tracking-widest">Toma de Pedidos</h1>
          <p class="text-[10px] text-neutral-400 uppercase mt-1">Mesera Activa: <span class="text-white font-bold">{{ nombreMesera }}</span> ({{ localAsignado.replace(/-/g, ' ') }})</p>
        </div>
        <button @click="handleLogout" class="text-red-500 hover:bg-red-500/10 px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all">Salir</button>
      </header>

      <div class="p-4 bg-black border-b border-white/5 overflow-x-auto hide-scrollbar flex gap-2">
        <button 
          v-for="cat in categoriasDisponibles" 
          :key="cat" 
          @click="categoriaActiva = cat"
          :class="['whitespace-nowrap uppercase tracking-widest text-[11px] px-5 py-3 rounded-xl transition-all font-bold', categoriaActiva === cat ? 'bg-[#D4AF37] text-black' : 'bg-white/5 text-gray-400 hover:text-white']"
        >
          {{ cat }}
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-4 md:p-6 grid grid-cols-2 lg:grid-cols-3 gap-4 pb-32 md:pb-6">
        <div v-if="cargandoMenu" class="col-span-full text-center py-10 text-[#D4AF37] text-xs uppercase tracking-widest animate-pulse">Cargando Menú...</div>
        
        <div v-for="item in menuFiltrado" :key="item.id" @click="agregarAlCarrito(item)" class="bg-[#111] border border-white/5 rounded-2xl p-4 cursor-pointer hover:border-[#D4AF37]/50 hover:bg-white/5 transition-all flex flex-col justify-between group active:scale-95">
          <div>
            <h3 class="font-serif text-sm md:text-base leading-tight group-hover:text-[#D4AF37] transition-colors">{{ item.nombre }}</h3>
            <span class="text-[#D4AF37] text-xs font-bold mt-2 inline-block">${{ item.precio.toLocaleString('es-CO') }}</span>
          </div>
          <div class="mt-4 flex justify-end">
            <div class="w-8 h-8 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] flex items-center justify-center font-bold text-lg group-hover:bg-[#D4AF37] group-hover:text-black transition-colors">+</div>
          </div>
        </div>
      </div>
    </div>

    <div class="w-full md:w-96 bg-[#111] h-screen flex flex-col fixed md:relative bottom-0 z-50 transition-transform duration-300 transform md:translate-y-0" :class="mostrarCarritoMovil ? 'translate-y-0' : 'translate-y-[85vh]'">
      
      <div @click="mostrarCarritoMovil = !mostrarCarritoMovil" class="md:hidden bg-[#D4AF37] p-3 text-center text-black font-bold uppercase text-xs flex justify-between items-center rounded-t-2xl shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
        <span>Ver Ticket de Mesa</span>
        <span class="bg-black text-[#D4AF37] px-2 py-1 rounded-full text-[10px]">{{ carrito.length }} ítems</span>
      </div>

      <div class="p-6 border-b border-white/10 bg-black">
        <label class="text-[10px] text-neutral-400 uppercase font-bold tracking-widest">Número de Mesa / Cliente</label>
        <input v-model="mesaActual" type="text" placeholder="Ej: Mesa 4" class="w-full bg-white/5 border border-[#D4AF37]/30 p-4 rounded-xl focus:border-[#D4AF37] text-white outline-none mt-2 text-center text-lg font-bold font-serif" />
      </div>

      <div class="flex-1 overflow-y-auto p-4 space-y-4">
        <div v-if="carrito.length === 0" class="text-center text-neutral-600 text-xs uppercase tracking-widest mt-10">
          Selecciona platos para iniciar la orden
        </div>

        <div v-for="(item, index) in carrito" :key="index" class="bg-black border border-white/5 p-4 rounded-2xl">
          <div class="flex justify-between items-start mb-3">
            <h4 class="text-sm font-bold text-white w-2/3 leading-tight">{{ item.producto.nombre }}</h4>
            <span class="text-[#D4AF37] text-xs font-bold">${{ (item.producto.precio * item.cantidad).toLocaleString('es-CO') }}</span>
          </div>
          
          <div class="flex items-center gap-3 mb-3">
            <button @click="modificarCantidad(index, -1)" class="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold">-</button>
            <span class="w-6 text-center text-sm font-bold">{{ item.cantidad }}</span>
            <button @click="modificarCantidad(index, 1)" class="w-8 h-8 rounded-lg bg-[#D4AF37]/20 hover:bg-[#D4AF37]/40 text-[#D4AF37] flex items-center justify-center font-bold">+</button>
            <button @click="eliminarDelCarrito(index)" class="ml-auto text-red-500 hover:bg-red-500/10 p-2 rounded-lg text-xs">🗑️</button>
          </div>

          <input v-model="item.notas" type="text" placeholder="Notas (Ej: Sin cebolla, extra salsa...)" class="w-full bg-white/5 border border-white/10 p-2 rounded-lg text-[11px] text-white focus:border-blue-500 outline-none placeholder:text-neutral-600 italic" />
        </div>
      </div>

      <div class="p-6 bg-black border-t border-white/10">
        <div class="flex justify-between items-center mb-6">
          <span class="text-xs text-neutral-400 uppercase tracking-widest font-bold">Total a Pagar</span>
          <span class="text-3xl font-serif text-[#D4AF37]">${{ totalCarrito.toLocaleString('es-CO') }}</span>
        </div>
        
        <div class="flex gap-3">
          <button @click="cancelarOrden" class="w-1/3 py-4 rounded-xl border border-red-500/30 text-red-500 text-[10px] uppercase font-bold tracking-widest hover:bg-red-500/10">Cancelar</button>
          <button @click="enviarOrden" :disabled="enviando || carrito.length === 0 || !mesaActual" :class="['flex-1 py-4 rounded-xl text-black text-xs uppercase font-bold tracking-widest transition-all shadow-[0_0_15px_rgba(212,175,55,0.2)]', (carrito.length === 0 || !mesaActual) ? 'bg-neutral-600 cursor-not-allowed opacity-50 shadow-none' : 'bg-[#D4AF37] hover:bg-yellow-500']">
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

// 2. TRAER SOLO EL MENÚ DE SU CAFETERÍA
const fetchMenuLocal = async () => {
  cargandoMenu.value = true
  const { data } = await supabase
    .from('menu_gastronomia')
    .select('id, nombre, precio, categoria, codigo_pos')
    .ilike('local', `%${localAsignado.value}%`)
    .eq('disponible', true)
    .order('nombre', { ascending: true })

  if (data) {
    menuCompleto.value = data
    const categorias = [...new Set(data.map(item => item.categoria))]
    categoriasDisponibles.value = categorias
    if (categorias.length > 0) categoriaActiva.value = categorias[0]
  }
  cargandoMenu.value = false
}

const menuFiltrado = computed(() => {
  return menuCompleto.value.filter(item => item.categoria === categoriaActiva.value)
})

// 3. LÓGICA DEL CARRITO (Con Notas Independientes)
const agregarAlCarrito = (producto) => {
  // Siempre agregamos una línea nueva para que puedan poner notas separadas si quieren
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

// 4. ENVÍO DE LA ORDEN A LA BASE DE DATOS (Mandar a Caja)
const enviarOrden = async () => {
  if (!mesaActual.value) { alert("Debes ingresar el número de mesa."); return; }
  
  enviando.value = true
  try {
    // A. Crear la Orden Padre
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

    // B. Preparar los items hijos (Los platos con sus notas)
    const itemsParaInsertar = carrito.value.map(item => ({
      orden_id: ordenData.id,
      producto_id: item.producto.id,
      cantidad: item.cantidad,
      precio_unitario: item.producto.precio,
      notas: item.notas.trim() || null
    }))

    // C. Insertar los items
    const { error: itemsError } = await supabase
      .from('pos_orden_items')
      .insert(itemsParaInsertar)

    if (itemsError) throw itemsError

    // D. Limpiar e informar éxito
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