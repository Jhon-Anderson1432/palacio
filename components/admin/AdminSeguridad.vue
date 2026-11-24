<template>
  <div>
    <header class="mb-8 md:mb-12 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
      <div>
        <h1 class="text-3xl md:text-4xl font-serif text-white">Vigilancia Diaria</h1>
        <p class="text-neutral-500 text-[10px] md:text-xs mt-2 uppercase tracking-[0.2em] font-bold">Control de Puntos QR</p>
      </div>

      <div class="flex items-center gap-3">
        <input type="date" v-model="fechaFiltroSeguridad" @change="fetchSeguridad()"
          class="bg-black border border-white/20 text-[#D4AF37] px-4 py-3 rounded-full text-xs font-bold uppercase tracking-widest outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all cursor-pointer color-scheme-dark"
          style="color-scheme: dark;" />
      </div>
    </header>

    <div v-if="cargandoSeguridad"
      class="text-center py-20 text-[#D4AF37] animate-pulse text-xs uppercase tracking-widest">Cargando
      registros...</div>

    <div v-else class="max-w-6xl mx-auto space-y-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div
          class="bg-neutral-900 p-5 rounded-3xl border border-white/10 flex flex-col justify-between h-32 shadow-md">
          <span class="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Total Escaneos (Hoy)</span>
          <span class="text-4xl font-serif text-white drop-shadow-sm">{{ statsSeguridad.totalEscaneos }}</span>
        </div>
        <div
          class="bg-neutral-900 p-5 rounded-3xl border border-orange-500/20 flex flex-col justify-between h-32 relative shadow-md overflow-hidden">
          <div class="absolute -right-10 -bottom-10 bg-orange-500/10 w-32 h-32 rounded-full blur-2xl"></div>
          <span class="text-[10px] text-orange-400 uppercase tracking-widest font-bold z-10">Observaciones Reportadas</span>
          <span class="text-4xl font-serif text-orange-400 z-10 drop-shadow-sm">{{ statsSeguridad.observaciones }}</span>
        </div>
      </div>

      <div class="bg-neutral-900 border border-white/5 rounded-3xl p-5 md:p-8 shadow-xl">
        <h3 class="text-base md:text-lg font-serif text-[#D4AF37] mb-6 border-b border-white/10 pb-4">Detalle de Escaneos</h3>

        <div v-if="registrosSeguridad.length === 0"
          class="text-center text-neutral-500 text-xs md:text-sm py-8 border border-dashed border-white/10 rounded-2xl bg-black/20">
          No hay escaneos registrados recientes.
        </div>

        <div v-else class="overflow-x-auto rounded-xl">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr
                class="border-b border-white/10 text-xs uppercase tracking-widest text-neutral-400 bg-white/[0.02]">
                <th class="py-4 px-4 font-bold rounded-tl-xl">Hora</th>
                <th class="py-4 px-4 font-bold">Vigilante</th>
                <th class="py-4 px-4 font-bold">Punto</th>
                <th class="py-4 px-4 font-bold rounded-tr-xl">Observación</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="registro in registrosSeguridad" :key="registro.id"
                class="border-b border-white/5 hover:bg-white/[0.04] transition-colors duration-200">
                <td class="py-4 px-4 text-[#D4AF37] font-bold">{{ formatearHora(registro.hora_registro) }}</td>
                <td class="py-4 px-4 text-white">
                  <span
                    class="bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-[#D4AF37]/20">
                    {{ registro.nombre_vigilante || 'N/A' }}
                  </span>
                </td>
                <td class="py-4 px-4 text-white">
                  {{ registro.puntos_control?.nombre }}
                  <span class="text-xs text-neutral-500 block mt-1">{{ registro.puntos_control?.piso }}</span>
                </td>
                <td class="py-4 px-4 text-neutral-300 text-sm max-w-xs truncate" :title="registro.observacion">{{
                  registro.observacion }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Puntos QR Activos -->
    <div class="bg-neutral-900 border border-white/5 rounded-3xl p-5 md:p-8 mt-10 shadow-xl">
      <div class="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
        <h3 class="text-base md:text-lg font-serif text-white">Puntos QR Activos</h3>
        <button @click="fetchPuntosControl"
          class="text-[10px] text-[#D4AF37] uppercase tracking-widest font-bold hover:text-white transition-colors focus:outline-none">Actualizar
          Lista</button>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-for="punto in puntosDeControl" :key="punto.id"
          class="bg-black/50 border border-white/10 p-4 rounded-xl flex flex-col justify-between hover:border-white/20 transition-all duration-300 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div>
              <p class="text-sm font-bold text-white flex items-center gap-2">
                {{ punto.nombre }}
                <span v-if="punto.es_punto_final"
                  class="w-2 h-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"
                  title="Punto Final"></span>
              </p>
              <p class="text-[10px] text-neutral-400 uppercase tracking-widest">{{ punto.piso }}</p>
            </div>
            <div
              class="w-12 h-12 bg-white rounded-md overflow-hidden flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-[#D4AF37] hover:scale-105 transition-all duration-300 shadow-md"
              @click="mostrarQRGrande(punto)" title="Ver QR en grande">
              <ClientOnly>
                <qrcode-vue :value="punto.codigo_qr" :size="48" level="L" />
              </ClientOnly>
            </div>
          </div>
          <div class="flex gap-2 pt-3 border-t border-white/5 mt-auto">
            <button @click="abrirModalQR(punto)"
              class="flex-1 p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white/30">Editar</button>
            <button @click="deletePuntoControl(punto)"
              class="p-2 border border-red-500/30 text-red-500 hover:bg-red-500/10 rounded-xl text-[10px] font-bold uppercase transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500/50">Eliminar</button>
          </div>
        </div>
      </div>
    </div>

    <!-- MODAL GENERAR / EDITAR QR -->
    <div v-if="mostrandoModalQR"
      class="fixed inset-0 bg-black/95 flex items-center justify-center p-4 z-[1001] backdrop-blur-lg transition-opacity duration-300">
      <div class="bg-neutral-900 border border-white/10 w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl relative">
        <button @click="mostrandoModalQR = false"
          class="absolute top-4 right-4 text-neutral-500 hover:text-white text-xl transition-colors focus:outline-none">✕</button>

        <h2 class="text-xl font-serif text-[#D4AF37] mb-6 uppercase tracking-widest text-center">
          {{ nuevoQRGuardado ? 'QR Generado' : (qrEditandoId ? 'Editar Punto de Control' : 'Crear Punto de Control') }}
        </h2>

        <form v-if="!nuevoQRGuardado" @submit.prevent="generarYGuardarQR" class="space-y-4">
          <div>
            <label class="block text-[10px] uppercase tracking-widest text-neutral-400 mb-2">Nombre del Punto (Ej:
              Puerta Principal, Pasillo 2)</label>
            <input v-model="formQR.nombre" type="text" required
              class="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all uppercase text-sm">
          </div>

          <div>
            <label class="block text-[10px] uppercase tracking-widest text-neutral-400 mb-2">Piso / Nivel (Ej: Piso 1,
              Mezzanine, Sótano)</label>
            <input v-model="formQR.piso" type="text" required
              class="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all text-sm uppercase">
          </div>

          <div
            class="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10 mt-2 hover:bg-white/10 transition-colors">
            <input v-model="formQR.es_punto_final" type="checkbox" id="esFinal"
              class="w-4 h-4 accent-[#D4AF37] cursor-pointer">
            <label for="esFinal"
              class="text-xs text-white uppercase tracking-widest cursor-pointer leading-tight flex-1">
              Marcar como Punto Final <br>
              <span class="text-[9px] text-neutral-500">Al escanearlo, inicia la hora de descanso.</span>
            </label>
          </div>

          <button type="submit" :disabled="generandoQR"
            class="w-full bg-[#D4AF37] text-black font-bold py-4 rounded-xl hover:bg-yellow-600 disabled:opacity-50 text-xs uppercase tracking-widest transition-all duration-300 mt-6 shadow-[0_0_15px_rgba(212,175,55,0.3)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-[#D4AF37]">
            {{ generandoQR ? 'Procesando...' : (qrEditandoId ? 'Actualizar Punto' : 'Generar Código QR') }}
          </button>
        </form>

        <div v-else class="flex flex-col items-center">
          <div class="bg-white p-4 rounded-xl mb-4 qr-container shadow-lg">
            <ClientOnly>
              <qrcode-vue :value="nuevoQRGuardado.codigo_qr" :size="200" level="H" />
            </ClientOnly>
          </div>
          <p class="text-white text-sm font-bold uppercase tracking-widest text-center">{{ nuevoQRGuardado.nombre }}</p>
          <p class="text-neutral-400 text-xs uppercase tracking-widest mt-1">{{ nuevoQRGuardado.piso }}</p>

          <span v-if="nuevoQRGuardado.es_punto_final"
            class="mt-3 bg-red-500/20 text-red-500 border border-red-500/50 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
            Punto de Descanso
          </span>

          <div class="flex gap-3 w-full mt-8">
            <button @click="imprimirQRActual"
              class="flex-1 bg-[#D4AF37] text-black font-bold py-3 rounded-xl hover:bg-yellow-600 text-[10px] uppercase tracking-widest shadow-[0_0_15px_rgba(212,175,55,0.3)] transition-all flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50">
              <span class="text-base">🖨️</span> Imprimir
            </button>
            <button @click="abrirModalQR()"
              class="flex-1 bg-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/20 transition-all text-[10px] uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-white/30">
              Crear Otro
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import QrcodeVue from 'qrcode.vue'

const supabase = useSupabaseClient()

const getHoyStr = () => {
  const d = new Date()
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
}

const registrosSeguridad = ref([])
const cargandoSeguridad = ref(false)
const statsSeguridad = reactive({ totalEscaneos: 0, observaciones: 0 })
const puntosDeControl = ref([])
const fechaFiltroSeguridad = ref(getHoyStr())
let subscripcionSeguridad = null

const mostrandoModalQR = ref(false)
const nuevoQRGuardado = ref(null)
const generandoQR = ref(false)
const qrEditandoId = ref(null)
const formQR = ref({ piso: '', nombre: '', es_punto_final: false })

const fetchPuntosControl = async () => {
  const { data, error } = await supabase.from('puntos_control').select('*').order('created_at', { ascending: false }).limit(10000)
  if (!error) puntosDeControl.value = data || []
}

const fetchSeguridad = async (mostrarLoader = true) => {
  if (mostrarLoader) cargandoSeguridad.value = true

  if (!fechaFiltroSeguridad.value) fechaFiltroSeguridad.value = getHoyStr()
  const [yyyy, mm, dd] = fechaFiltroSeguridad.value.split('-')
  const inicioDia = new Date(yyyy, mm - 1, dd, 0, 0, 0, 0).toISOString()
  const finDia = new Date(yyyy, mm - 1, dd, 23, 59, 59, 999).toISOString()

  const { data, error } = await supabase
    .from('registros_punto_control')
    .select(`
      id,
      hora_registro,
      nombre_vigilante,
      observacion,
      puntos_control ( nombre, piso )
    `)
    .gte('hora_registro', inicioDia)
    .lte('hora_registro', finDia)
    .order('hora_registro', { ascending: false })

  if (!error && data) {
    registrosSeguridad.value = data
    statsSeguridad.totalEscaneos = data.length
    statsSeguridad.observaciones = data.filter(r => r.observacion && r.observacion !== 'Sin novedad').length
  } else {
    registrosSeguridad.value = []
    statsSeguridad.totalEscaneos = 0
    statsSeguridad.observaciones = 0
  }
  if (mostrarLoader) cargandoSeguridad.value = false
}

const formatearHora = (fechaISO) => {
  if (!fechaISO) return 'Sin hora'
  return new Date(fechaISO).toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

const inicializarRealtimeSeguridad = () => {
  if (subscripcionSeguridad) return;
  subscripcionSeguridad = supabase
    .channel('seguridad_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'registros_punto_control' }, (payload) => {
      fetchSeguridad(false);
    })
    .subscribe((status) => {
      if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
        subscripcionSeguridad = null;
        setTimeout(() => inicializarRealtimeSeguridad(), 3000);
      }
    });
}

const abrirModalQR = (punto = null) => {
  if (punto && punto.id) {
    qrEditandoId.value = punto.id
    formQR.value = {
      piso: punto.piso,
      nombre: punto.nombre,
      es_punto_final: punto.es_punto_final
    }
  } else {
    qrEditandoId.value = null
    formQR.value = { piso: '', nombre: '', es_punto_final: false }
  }
  nuevoQRGuardado.value = null
  mostrandoModalQR.value = true
}

const mostrarQRGrande = (punto) => {
  qrEditandoId.value = punto.id
  nuevoQRGuardado.value = punto
  mostrandoModalQR.value = true
}

const generarYGuardarQR = async () => {
  if (formQR.value.piso === '' || !formQR.value.nombre) return alert('Llena todos los campos')
  generandoQR.value = true

  try {
    const payload = {
      piso: formQR.value.piso.toString(),
      nombre: formQR.value.nombre,
      es_punto_final: formQR.value.es_punto_final
    }

    let data;

    if (qrEditandoId.value) {
      const { data: res, error } = await supabase
        .from('puntos_control')
        .update(payload)
        .eq('id', qrEditandoId.value)
        .select()
        .single()

      if (error) throw error
      data = res
    } else {
      const codigoAleatorio = 'PALACIO-' + Math.random().toString(36).substring(2, 10).toUpperCase()
      payload.codigo_qr = codigoAleatorio

      const { data: res, error } = await supabase
        .from('puntos_control')
        .insert([payload])
        .select()
        .single()

      if (error) throw error
      data = res
    }

    nuevoQRGuardado.value = data
    fetchPuntosControl()
  } catch (error) {
    console.error(error)
    alert('Error al procesar el punto de control: ' + error.message)
  } finally {
    generandoQR.value = false
  }
}

const deletePuntoControl = async (punto) => {
  if (confirm(`¿Peligro: Eliminar definitivamente el punto de control "${punto.nombre}"? Esto podría afectar métricas pasadas si hay registros asociados.`)) {
    try {
      const { error } = await supabase.from('puntos_control').delete().eq('id', punto.id)
      if (error) throw error
      fetchPuntosControl()
    } catch (error) {
      console.error(error)
      alert('Error al eliminar: ' + error.message)
    }
  }
}

const imprimirQRActual = () => {
  const canvas = document.querySelector('.qr-container canvas')
  if (!canvas) return
  const imgData = canvas.toDataURL("image/png")

  let contenido = `
    <div style="text-align: center; font-family: Arial, sans-serif; padding: 20px;">
      <h2 style="margin: 0; font-size: 24px; font-weight: 900;">PALACIO NACIONAL</h2>
      <h3 style="margin: 5px 0 15px 0; font-size: 18px;">${nuevoQRGuardado.value.piso} Punto: ${nuevoQRGuardado.value.nombre}</h3>
      <img src="${imgData}" style="width: 200px; height: 200px;" />
      <p style="margin-top: 15px; font-weight: bold; font-size: 14px;">
        ${nuevoQRGuardado.value.es_punto_final ? '🔴 PUNTO FINAL DE RONDA' : '🟢 PUNTO DE CONTROL'}
      </p>
      <p style="font-size: 10px; color: #666; margin-top: 5px;">CÓDIGO SISTEMA: ${nuevoQRGuardado.value.codigo_qr}</p>
    </div>
  `

  let iframe = document.getElementById('impresora-oculta');
  if (iframe) document.body.removeChild(iframe);

  iframe = document.createElement('iframe');
  iframe.id = 'impresora-oculta';
  iframe.style.position = 'fixed';
  iframe.style.right = '0';
  iframe.style.bottom = '0';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = '0';
  document.body.appendChild(iframe);

  iframe.contentDocument.open();
  iframe.contentDocument.write(`
    <html>
      <head><title>Imprimir QR</title></head>
      <body onload="window.print(); setTimeout(() => window.parent.document.body.removeChild(window.frameElement), 1000)">${contenido}</body>
    </html>
  `);
  iframe.contentDocument.close();
}

onMounted(() => {
  fetchSeguridad()
  fetchPuntosControl()
  inicializarRealtimeSeguridad()
})

onUnmounted(() => {
  if (subscripcionSeguridad) {
    supabase.removeChannel(subscripcionSeguridad)
    subscripcionSeguridad = null
  }
})

defineExpose({
  abrirModalQR,
  fetchSeguridad,
  fetchPuntosControl,
  recargar: () => {
    fetchSeguridad(false)
    fetchPuntosControl()
  }
})
</script>

<style scoped>
input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1);
  cursor: pointer;
}
</style>
