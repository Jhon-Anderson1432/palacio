<template>
  <div class="h-[100dvh] w-full bg-[#0a0a0a] text-white font-sans flex flex-col md:flex-row overflow-hidden relative antialiased select-none">
    
    <main class="flex-1 flex flex-col h-[100dvh] border-r border-white/10 relative z-10">
      <PosHeader
        :nombreMesera="nombreMesera"
        :localAsignado="localAsignado"
        :cantidadMesasActivas="misOrdenesActivas.length"
        @abrirMesas="panelMesasAbierto = true"
        @logout="handleLogout"
      />

      <PosMenu
        :menuCompleto="menuCompleto"
        :cargandoMenu="cargandoMenu"
        :categoriasDisponibles="categoriasDisponibles"
        @agregarProducto="agregarAlCarrito"
      />
    </main>

    <PosMesasDrawer
      :abierto="panelMesasAbierto"
      :cargando="cargandoOrdenes"
      :ordenesActivas="misOrdenesActivas"
      @cerrar="panelMesasAbierto = false"
      @seleccionarOrden="editarMesaPendiente"
    />

    <PosCarritoSidebar
      :mostrarMovil="mostrarCarritoMovil"
      :ordenActualId="ordenActualId"
      v-model:mesaActual="mesaActual"
      :cargandoEdicion="cargandoEdicion"
      :carrito="carrito"
      :totalCarrito="totalCarrito"
      :enviando="enviando"
      @toggleMovil="mostrarCarritoMovil = !mostrarCarritoMovil"
      @logout="handleLogout"
      @modificarCantidad="modificarCantidad"
      @eliminarItem="eliminarDelCarrito"
      @actualizarNota="actualizarNota"
      @cancelar="cancelarOrden"
      @volver="volverAtras"
      @enviar="enviarOrden"
    />

  </div>
</template>

<script setup>
import PosHeader from '~/components/pos/PosHeader.vue'
import PosMenu from '~/components/pos/PosMenu.vue'
import PosMesasDrawer from '~/components/pos/PosMesasDrawer.vue'
import PosCarritoSidebar from '~/components/pos/PosCarritoSidebar.vue'

definePageMeta({
  layout: false, // Apaga el layout maestro. Ni Navbar ni Footer aparecerán.
  middleware: 'pos-auth'
})

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
// ESTADO REACTIVO
// =====================================
const perfilPos = useState('perfilPos', () => null)

const nombreMesera = ref('')
const localAsignado = ref('')
const meseraId = ref(null)

const menuCompleto = ref([])
const cargandoMenu = ref(true)
const categoriasDisponibles = ref([])

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

// =====================================
// INICIALIZACIÓN (Perfil validado por middleware/pos-auth.js)
// =====================================
const inicializarTerminal = async () => {
  let perfil = perfilPos.value

  // Respaldo de seguridad si por alguna razón el estado no está cargado
  if (!perfil) {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { return navigateTo('/login-meseras') }

    const { data, error } = await supabase
      .from('perfiles')
      .select('id, nombre, rol, local_asignado')
      .eq('id', user.id)
      .single()

    if (error || !data || (data.rol !== 'mesera' && data.rol !== 'mesera_temporal')) {
      await supabase.auth.signOut()
      return navigateTo('/login-meseras')
    }
    perfil = {
      id: data.id,
      nombre: data.nombre,
      rol: data.rol,
      local_asignado: data.local_asignado || 'chao-pescado'
    }
    perfilPos.value = perfil
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
  }
  cargandoMenu.value = false
}

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

const actualizarNota = (index, nota) => {
  if (carrito.value[index]) {
    carrito.value[index].notas = nota
  }
}

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
  perfilPos.value = null
  await supabase.auth.signOut()
  return navigateTo('/login-meseras')
}

// CICLO DE VIDA
onMounted(() => { inicializarTerminal() })

onUnmounted(() => {
  if (subscripcionMisMesas) supabase.removeChannel(subscripcionMisMesas)
})
</script>

<style scoped>
.antialiased {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
