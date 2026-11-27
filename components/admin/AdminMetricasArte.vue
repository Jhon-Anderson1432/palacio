<template>
  <div class="max-w-5xl mx-auto space-y-8">
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
      <div
        class="bg-neutral-900 p-5 md:p-6 rounded-3xl border border-white/5 flex flex-col justify-between h-32 md:h-40 shadow-md">
        <span class="text-[10px] md:text-xs text-neutral-400 uppercase tracking-widest font-bold">Total Catálogo</span>
        <span class="text-4xl md:text-5xl font-serif text-white">{{ stats.total }}</span>
      </div>
      <div
        class="bg-neutral-900 p-5 md:p-6 rounded-3xl border border-[#D4AF37]/20 flex flex-col justify-between h-32 md:h-40 shadow-md">
        <span class="text-[10px] md:text-xs text-[#D4AF37]/70 uppercase tracking-widest font-bold">Total Pinturas</span>
        <span class="text-4xl md:text-5xl font-serif text-[#D4AF37]">{{ stats.pinturas }}</span>
      </div>
      <div
        class="bg-neutral-900 p-5 md:p-6 rounded-3xl border border-white/5 flex flex-col justify-between h-32 md:h-40 shadow-md">
        <span class="text-[10px] md:text-xs text-neutral-400 uppercase tracking-widest font-bold">Total Esculturas</span>
        <span class="text-4xl md:text-5xl font-serif text-white">{{ stats.esculturas }}</span>
      </div>
    </div>

    <!-- PODIO TOP 3 OBRAS DESTACADAS (MÁS VISITADAS) -->
    <div
      class="bg-neutral-900 border border-[#D4AF37]/30 rounded-3xl p-5 md:p-8 shadow-xl relative overflow-hidden">
      <div
        class="absolute -right-10 -bottom-10 bg-[#D4AF37]/5 w-48 h-48 rounded-full blur-3xl pointer-events-none">
      </div>

      <div
        class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-white/10 pb-4 relative z-10 gap-4">
        <div>
          <div class="flex items-center gap-2">
            <span class="text-xl">🏆</span>
            <h3 class="text-base md:text-lg font-serif text-[#D4AF37]">Obras Destacadas</h3>
          </div>
          <p class="text-[10px] text-neutral-400 uppercase tracking-widest mt-1">
            Top 3 obras con mayor interés en el detalle público
          </p>
        </div>
        <button @click="cargarObrasDestacadas" :disabled="cargandoDestacadas"
          class="text-[10px] font-bold uppercase tracking-widest text-neutral-400 hover:text-[#D4AF37] border border-white/10 hover:border-[#D4AF37]/40 px-3 py-1.5 rounded-xl transition-all duration-300 flex items-center gap-1.5 focus:outline-none">
          <span :class="{ 'animate-spin': cargandoDestacadas }">🔄</span>
          <span>{{ cargandoDestacadas ? 'Actualizando...' : 'Actualizar' }}</span>
        </button>
      </div>

      <!-- Estado Cargando -->
      <div v-if="cargandoDestacadas" class="py-12 text-center text-neutral-400 text-xs">
        <div
          class="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-[#D4AF37] border-r-transparent mb-3">
        </div>
        <p class="uppercase tracking-widest text-[10px]">Cargando obras destacadas...</p>
      </div>

      <!-- Podio Top 3 -->
      <div v-else-if="obrasDestacadas.length > 0"
        class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 relative z-10">
        <div v-for="(obra, idx) in obrasDestacadas" :key="obra.id" :class="[
          'rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 relative group overflow-hidden',
          idx === 0
            ? 'bg-gradient-to-b from-[#D4AF37]/15 to-neutral-900 border-2 border-[#D4AF37] shadow-lg shadow-[#D4AF37]/10'
            : idx === 1
              ? 'bg-neutral-900/90 border border-neutral-400/40 hover:border-neutral-300'
              : 'bg-neutral-900/90 border border-amber-600/40 hover:border-amber-500'
        ]">

          <!-- Insignia de Medalla / Puesto -->
          <div class="flex items-center justify-between mb-3">
            <span :class="[
              'px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1',
              idx === 0
                ? 'bg-[#D4AF37] text-black shadow-md'
                : idx === 1
                  ? 'bg-neutral-300 text-black'
                  : 'bg-amber-700 text-white'
            ]">
              <span>{{ idx === 0 ? '🥇 1º Puesto' : (idx === 1 ? '🥈 2º Puesto' : '🥉 3º Puesto') }}</span>
            </span>
            <div class="flex items-center gap-1 bg-black/40 px-2.5 py-1 rounded-full border border-white/5">
              <span class="text-xs">👁️</span>
              <span class="text-xs font-bold text-white">{{ obra.visitas }}</span>
              <span class="text-[9px] text-neutral-400 uppercase tracking-tighter">visitas</span>
            </div>
          </div>

          <!-- Imagen de la Obra -->
          <div class="relative w-full h-44 rounded-xl overflow-hidden bg-black/50 mb-3 border border-white/5">
            <img v-if="obra.imagen_1" :src="obra.imagen_1" :alt="obra.titulo"
              class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy" />
            <div v-else class="w-full h-full flex items-center justify-center text-neutral-600 text-xs">
              Sin Imagen
            </div>
            <span
              class="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-[9px] text-neutral-300 uppercase px-2 py-0.5 rounded-md font-mono">
              {{ obra.tipo || 'Arte' }}
            </span>
          </div>

          <!-- Información de la Obra -->
          <div class="space-y-1 mb-4 flex-1">
            <h4
              class="font-serif text-sm md:text-base text-white font-bold line-clamp-1 group-hover:text-[#D4AF37] transition-colors"
              :title="obra.titulo">
              {{ formatoTitulo(obra.titulo) }}
            </h4>
            <p class="text-xs text-neutral-300 truncate">
              {{ obra.autor || 'Autor no especificado' }}
            </p>
            <p class="text-[10px] text-neutral-500 uppercase tracking-wider truncate">
              {{ obra.tecnica || 'Técnica no especificada' }}
            </p>
          </div>

          <!-- Botones de Acción -->
          <div class="flex gap-2 pt-3 border-t border-white/5">
            <button @click="$emit('editarObra', obra)"
              class="flex-1 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 text-center">
              Editar
            </button>
            <a :href="`/DetalleObra/${obra.id}`" target="_blank"
              class="px-3 py-1.5 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[#D4AF37] rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-1"
              title="Ver en página pública">
              <span>Ver</span>
              <span class="text-xs">↗</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Estado Vacío -->
      <div v-else
        class="py-10 text-center text-neutral-400 bg-white/[0.02] border border-dashed border-white/10 rounded-2xl relative z-10 px-4">
        <span class="text-3xl mb-2 block">✨</span>
        <p class="text-xs md:text-sm font-medium text-neutral-300 mb-1">Aún no hay visitas registradas</p>
        <p class="text-[10px] md:text-xs text-neutral-500 max-w-md mx-auto">
          A medida que el público explore las obras en la galería y acceda al detalle de cada una, aquí se
          mostrarán automáticamente las 3 más populares.
        </p>
      </div>
    </div>

    <!-- Rendimiento y Honorarios -->
    <div
      class="bg-neutral-900 border border-[#D4AF37]/30 rounded-3xl p-5 md:p-8 shadow-xl relative overflow-hidden">
      <div class="absolute -right-10 -top-10 bg-[#D4AF37]/5 w-40 h-40 rounded-full blur-3xl"></div>

      <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-white/10 pb-4 relative z-10">
        <div>
          <h3 class="text-base md:text-lg font-serif text-[#D4AF37]">Rendimiento y Honorarios</h3>
          <p class="text-[10px] text-neutral-400 uppercase tracking-widest mt-1">
            Ciclo iniciado: {{ fechaInicioCobro ? fechaInicioCobro.toLocaleDateString() : '...' }}
          </p>
        </div>
        <button @click="marcarCobrado"
          class="mt-4 md:mt-0 bg-green-500/20 text-green-500 border border-green-500/50 hover:bg-green-500 hover:text-black px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300">
          Marcar como Cobrado
        </button>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
        <div class="bg-black/30 p-4 rounded-xl border border-white/5">
          <span class="text-[9px] text-neutral-500 uppercase tracking-widest block mb-1">Obras Hoy</span>
          <span class="text-2xl font-bold text-white">{{ statsActividad.hoy }}</span>
        </div>
        <div class="bg-black/30 p-4 rounded-xl border border-white/5">
          <span class="text-[9px] text-neutral-500 uppercase tracking-widest block mb-1">Obras (7 Días)</span>
          <span class="text-2xl font-bold text-white">{{ statsActividad.semana }}</span>
        </div>
        <div class="bg-black/30 p-4 rounded-xl border border-white/5">
          <span class="text-[9px] text-[#D4AF37]/70 uppercase tracking-widest block mb-1">Obras (Este Ciclo)</span>
          <span class="text-2xl font-bold text-[#D4AF37]">{{ statsActividad.ciclo }}</span>
        </div>
        <div class="bg-[#D4AF37]/10 p-4 rounded-xl border border-[#D4AF37]/30">
          <span class="text-[9px] text-[#D4AF37] uppercase tracking-widest font-bold block mb-1">Total a Cobrar</span>
          <span class="text-2xl font-serif text-[#D4AF37]">${{ statsActividad.pago.toLocaleString('es-CO') }}</span>
        </div>
      </div>
    </div>

    <!-- Registro de Modificaciones -->
    <div class="bg-neutral-900 border border-white/5 rounded-3xl p-5 md:p-8 shadow-xl">
      <h3 class="text-base md:text-lg font-serif text-white mb-6 border-b border-white/10 pb-4">Registro de Modificaciones</h3>
      <div v-if="logsActividad.length > 0" class="space-y-4">
        <div v-for="(log, index) in logsActividad" :key="index"
          class="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-white/[0.02] rounded-xl border border-white/5 gap-4 hover:bg-white/[0.04] transition-colors duration-300">
          <div class="flex items-center gap-4">
            <span class="text-xl">{{ log.accion === 'Creación' ? '✨' : '📝' }}</span>
            <div>
              <p class="text-xs md:text-sm text-white font-bold">{{ log.accion }} de Obra</p>
              <p class="text-[10px] md:text-xs text-neutral-400">{{ formatoTitulo(log.titulo) }}</p>
            </div>
          </div>
          <div
            class="sm:text-right flex sm:block justify-between items-center border-t border-white/5 sm:border-0 pt-2 sm:pt-0">
            <p class="text-[10px] text-[#D4AF37] uppercase tracking-widest font-bold">{{ log.fechaFormateada }}</p>
            <p class="text-[10px] text-neutral-500 uppercase">{{ log.horaFormateada }}</p>
          </div>
        </div>
      </div>
      <div v-else
        class="text-center text-neutral-500 text-xs md:text-sm py-8 bg-white/[0.02] border border-dashed border-white/10 rounded-2xl">
        Aún no hay registros de actividad.
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatoTitulo } from '~/utils/formatoTexto'

defineEmits(['editarObra'])

const supabase = useSupabaseClient()

const stats = reactive({ total: 0, pinturas: 0, esculturas: 0 })
const statsActividad = reactive({ hoy: 0, semana: 0, ciclo: 0, pago: 0 })
const fechaInicioCobro = ref(null)
const logsActividad = ref([])
const obrasDestacadas = ref([])
const cargandoDestacadas = ref(false)

const cargarObrasDestacadas = async () => {
  cargandoDestacadas.value = true
  try {
    const { data, error } = await supabase
      .from('obras')
      .select('id, titulo, titulo_en, titulo_fr, titulo_ja, autor, precio, tecnica, medidas, medidas_en, medidas_fr, medidas_ja, tipo, imagen_1, imagen_2, imagen_3, visitas')
      .gt('visitas', 0)
      .order('visitas', { ascending: false })
      .limit(3)

    if (!error && data) {
      obrasDestacadas.value = data.map((obra, index) => ({
        ...obra,
        visitas: obra.visitas || 0,
        posicion: index + 1
      }))
    } else {
      obrasDestacadas.value = []
    }
  } catch (err) {
    console.error('Error al cargar obras destacadas:', err)
    obrasDestacadas.value = []
  } finally {
    cargandoDestacadas.value = false
  }
}

const inicializarFechaCobro = async () => {
  if (import.meta.server) return;
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: perfil } = await supabase.from('perfiles').select('*').eq('id', user.id).single()
  const fechaLocalStr = localStorage.getItem('fechaInicioCobroGaleria') || localStorage.getItem('fechaInicioCobro') || localStorage.getItem('fecha_inicio_cobro')
  const fechaLocal = fechaLocalStr ? new Date(fechaLocalStr) : null

  if (perfil?.fecha_inicio_cobro) {
    const fechaDB = new Date(perfil.fecha_inicio_cobro)
    if (fechaLocal && fechaLocal > fechaDB) {
      fechaInicioCobro.value = fechaLocal
      supabase.from('perfiles').update({ fecha_inicio_cobro: fechaLocal.toISOString() }).eq('id', user.id).then()
    } else {
      fechaInicioCobro.value = fechaDB
      if (fechaDB) localStorage.setItem('fechaInicioCobroGaleria', fechaDB.toISOString())
    }
  } else {
    if (fechaLocal) {
      fechaInicioCobro.value = fechaLocal
      await supabase.from('perfiles').update({ fecha_inicio_cobro: fechaLocal.toISOString() }).eq('id', user.id)
    } else {
      const d = new Date()
      fechaInicioCobro.value = new Date(d.getFullYear(), d.getMonth(), 1)
    }
  }
}

const calcularEstadisticas = async () => {
  cargarObrasDestacadas()
  try {
    await inicializarFechaCobro()

    const [resTotal, resPinturas, resEsculturas] = await Promise.all([
      supabase.from('obras').select('*', { count: 'exact', head: true }),
      supabase.from('obras').select('*', { count: 'exact', head: true }).eq('tipo', 'Pintura'),
      supabase.from('obras').select('*', { count: 'exact', head: true }).eq('tipo', 'Escultura')
    ])
    stats.total = resTotal.count ?? 0
    stats.pinturas = resPinturas.count ?? 0
    stats.esculturas = resEsculturas.count ?? 0

    const { data: ultimasObras } = await supabase
      .from('obras')
      .select('id, titulo, created_at')
      .order('created_at', { ascending: false })
      .limit(5)

    if (ultimasObras) {
      logsActividad.value = ultimasObras.map(obra => {
        const fecha = new Date(obra.created_at || Date.now())
        return {
          accion: 'Creación',
          titulo: obra.titulo,
          fechaFormateada: fecha.toLocaleDateString(),
          horaFormateada: fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      })
    }

    if (!fechaInicioCobro.value) return

    const ahora = new Date()
    const inicioHoy = new Date(ahora.getFullYear(), ahora.getMonth(), ahora.getDate())
    const inicioSemana = new Date(inicioHoy)
    inicioSemana.setDate(inicioSemana.getDate() - 7)

    const fechaMinima = new Date(Math.min(inicioSemana.getTime(), fechaInicioCobro.value.getTime()))
    const { data: obrasRecientes } = await supabase
      .from('obras')
      .select('id, created_at')
      .gte('created_at', fechaMinima.toISOString())

    let cuentaHoy = 0
    let cuentaSemana = 0
    let cuentaCiclo = 0

    if (obrasRecientes) {
      obrasRecientes.forEach(obra => {
        const fechaObra = new Date(obra.created_at)
        if (fechaObra >= inicioHoy) cuentaHoy++
        if (fechaObra >= inicioSemana) cuentaSemana++
        if (fechaObra >= fechaInicioCobro.value) cuentaCiclo++
      })
    }

    statsActividad.hoy = cuentaHoy
    statsActividad.semana = cuentaSemana
    statsActividad.ciclo = cuentaCiclo
    statsActividad.pago = cuentaCiclo * 3000
  } catch (err) {
    console.error('Error calculando estadísticas:', err)
  }
}

const marcarCobrado = async () => {
  if (confirm(`¿Confirmas que se ha cobrado el monto de $${statsActividad.pago.toLocaleString('es-CO')}? Se reiniciará el contador del ciclo.`)) {
    const ahora = new Date()
    fechaInicioCobro.value = ahora

    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      await supabase.from('perfiles').update({ fecha_inicio_cobro: ahora.toISOString() }).eq('id', user.id)
    }

    localStorage.setItem('fechaInicioCobroGaleria', ahora.toISOString())
    localStorage.setItem('fecha_inicio_cobro', ahora.toISOString())

    calcularEstadisticas()
  }
}

onMounted(() => {
  calcularEstadisticas()
})

defineExpose({
  calcularEstadisticas
})
</script>
