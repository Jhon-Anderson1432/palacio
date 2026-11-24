<template>
  <div>
    <header class="mb-8 md:mb-12 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
      <div>
        <h1 class="text-3xl md:text-4xl font-serif text-white">Cierre de Caja</h1>
        <p class="text-neutral-500 text-[10px] md:text-xs mt-2 uppercase tracking-[0.2em] font-bold">Resumen de Ventas Pagadas</p>
      </div>

      <div class="flex items-center gap-3">
        <input type="date" v-model="fechaFiltroMetricas" @change="calcularEstadisticasPos"
          class="bg-black border border-white/20 text-[#D4AF37] px-4 py-3 rounded-full text-xs font-bold uppercase tracking-widest outline-none focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all cursor-pointer color-scheme-dark"
          style="color-scheme: dark;" />

        <button @click="imprimirCierreCaja()"
          class="bg-[#D4AF37] text-black px-6 py-3 rounded-full font-bold hover:bg-yellow-600 transition-all duration-300 text-xs uppercase tracking-widest whitespace-nowrap shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-[#D4AF37]">
          🖨️ Imprimir Cierre
        </button>
      </div>
    </header>

    <div v-if="cargandoStatsPos"
      class="text-center py-20 text-[#D4AF37] animate-pulse text-xs uppercase tracking-widest">
      Calculando métricas...</div>

    <div v-else class="max-w-5xl mx-auto space-y-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        <div
          class="bg-neutral-900 p-5 md:p-6 rounded-3xl border border-[#D4AF37]/30 flex flex-col justify-between h-32 md:h-40 shadow-lg relative overflow-hidden">
          <div class="absolute -right-10 -top-10 bg-[#D4AF37]/5 w-32 h-32 rounded-full blur-2xl"></div>
          <span class="text-[10px] md:text-xs text-[#D4AF37] uppercase tracking-widest font-bold z-10">Ventas Totales</span>
          <span class="text-4xl md:text-5xl font-serif text-white z-10 drop-shadow-md">${{
            statsPos.totalVentasDia.toLocaleString('es-CO') }}</span>
        </div>
        <div
          class="bg-neutral-900 p-5 md:p-6 rounded-3xl border border-white/10 flex flex-col justify-between h-32 md:h-40 shadow-md">
          <span class="text-[10px] md:text-xs text-neutral-400 uppercase tracking-widest font-bold">Mesas Atendidas</span>
          <span class="text-4xl md:text-5xl font-serif text-white drop-shadow-md">{{ statsPos.totalMesasDia }}</span>
        </div>
      </div>

      <div class="bg-neutral-900 border border-white/5 rounded-3xl p-5 md:p-8 shadow-xl">
        <h3 class="text-base md:text-lg font-serif text-white mb-6 border-b border-white/10 pb-4">Desempeño por Mesera</h3>
        <div v-if="statsPos.desgloseMeseras.length > 0" class="space-y-6">
          <div v-for="mesera in statsPos.desgloseMeseras" :key="mesera.nombre"
            class="flex flex-col p-5 bg-white/[0.02] rounded-2xl border border-white/5 hover:border-white/10 transition-colors duration-300 space-y-4">
            <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
              <div class="mb-2 sm:mb-0">
                <p class="text-sm md:text-base text-white font-bold">{{ mesera.nombre }}</p>
                <p class="text-[10px] md:text-xs text-neutral-400 uppercase tracking-widest mt-1">
                  {{ mesera.cantidadMesas }} mesas atendidas
                </p>
              </div>
              <div class="sm:text-right">
                <span class="text-2xl font-serif text-[#D4AF37]">${{ mesera.ventas.toLocaleString('es-CO') }}</span>
              </div>
            </div>

            <div class="border-t border-white/10 pt-3 space-y-4">
              <div v-for="mesa in mesera.desgloseMesas" :key="mesa.nombre"
                class="bg-black/30 p-3 rounded-xl border border-white/5">
                <div class="flex justify-between items-center mb-2 border-b border-white/5 pb-2">
                  <span class="text-[11px] uppercase tracking-widest text-white font-bold">Mesa: <span
                      class="text-[#D4AF37]">{{ mesa.nombre }}</span></span>
                  <span class="text-[11px] text-[#D4AF37] font-bold">${{ mesa.total.toLocaleString('es-CO') }}</span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  <div v-for="(cant, prod) in mesa.productos" :key="prod"
                    class="flex justify-between items-center bg-black/40 px-3 py-2 rounded-xl text-xs border border-white/5 transition-colors hover:bg-black/60">
                    <span class="text-gray-300 truncate pr-2 capitalize">{{ prod.toLowerCase() }}</span>
                    <span
                      class="text-[#D4AF37] font-bold bg-[#D4AF37]/10 px-2 py-0.5 rounded-md whitespace-nowrap">x{{
                        cant }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-else
          class="text-center text-neutral-500 text-xs md:text-sm py-8 border border-dashed border-white/10 rounded-2xl bg-black/20">
          No hay ventas pagadas registradas en esta fecha.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  rolUsuario: {
    type: String,
    default: 'superadmin'
  },
  localAsignado: {
    type: String,
    default: null
  }
})

const supabase = useSupabaseClient()

const getHoyStr = () => {
  const d = new Date()
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
}

const fechaFiltroMetricas = ref(getHoyStr())
const cargandoStatsPos = ref(false)
const statsPos = reactive({ totalVentasDia: 0, totalMesasDia: 0, desgloseMeseras: [] })

const calcularEstadisticasPos = async () => {
  cargandoStatsPos.value = true

  if (!fechaFiltroMetricas.value) {
    fechaFiltroMetricas.value = getHoyStr()
  }

  const [yyyy, mm, dd] = fechaFiltroMetricas.value.split('-')
  const inicioDia = new Date(yyyy, mm - 1, dd, 0, 0, 0, 0).toISOString()
  const finDia = new Date(yyyy, mm - 1, dd, 23, 59, 59, 999).toISOString()

  let query = supabase
    .from('pos_ordenes')
    .select(`
      *, 
      perfiles(nombre),
      pos_orden_items(
        cantidad,
        menu_gastronomia(nombre)
      )
    `)
    .gte('created_at', inicioDia)
    .lte('created_at', finDia)
    .eq('estado', 'pagado')

  if (props.rolUsuario === 'admin_cafe' && props.localAsignado) {
    query = query.eq('local', props.localAsignado)
  }

  const { data, error } = await query
  if (!error && data) {
    statsPos.totalVentasDia = data.reduce((acc, curr) => acc + curr.total, 0)
    statsPos.totalMesasDia = data.length

    const agrupado = {}
    data.forEach(orden => {
      const mesera = orden.perfiles?.nombre || 'Desconocida'
      const nombreMesa = orden.mesa || 'Sin Mesa'

      if (!agrupado[mesera]) {
        agrupado[mesera] = {
          nombre: mesera,
          ventas: 0,
          mesasUnicas: new Set(),
          mesasDetalle: {}
        }
      }
      agrupado[mesera].ventas += orden.total
      agrupado[mesera].mesasUnicas.add(nombreMesa)

      if (!agrupado[mesera].mesasDetalle[nombreMesa]) {
        agrupado[mesera].mesasDetalle[nombreMesa] = { total: 0, productos: {} }
      }

      agrupado[mesera].mesasDetalle[nombreMesa].total += orden.total

      if (orden.pos_orden_items) {
        orden.pos_orden_items.forEach(item => {
          const prodNombre = item.menu_gastronomia?.nombre || 'Plato eliminado'
          if (!agrupado[mesera].mesasDetalle[nombreMesa].productos[prodNombre]) {
            agrupado[mesera].mesasDetalle[nombreMesa].productos[prodNombre] = 0
          }
          agrupado[mesera].mesasDetalle[nombreMesa].productos[prodNombre] += item.cantidad
        })
      }
    })

    statsPos.desgloseMeseras = Object.values(agrupado).map(m => {
      const arrayMesas = Object.keys(m.mesasDetalle)
        .sort((a, b) => String(a).localeCompare(String(b), undefined, { numeric: true }))
        .map(nombreMesa => ({
          nombre: nombreMesa,
          total: m.mesasDetalle[nombreMesa].total,
          productos: m.mesasDetalle[nombreMesa].productos
        }))

      return {
        nombre: m.nombre,
        ventas: m.ventas,
        cantidadMesas: m.mesasUnicas.size,
        desgloseMesas: arrayMesas
      }
    }).sort((a, b) => b.ventas - a.ventas)
  }
  cargandoStatsPos.value = false
}

const imprimirCierreCaja = () => {
  const [y, m, d] = fechaFiltroMetricas.value.split('-');
  const fechaImpresion = new Date(y, m - 1, d).toLocaleDateString();

  let contenido = `
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; color: #000 !important; font-family: Arial, Helvetica, sans-serif !important; font-weight: 700 !important; }
      body { width: 280px; padding: 10px 5px 40px 5px; font-size: 14px; text-transform: uppercase; line-height: 1.4; }
      .header { text-align: center; margin-bottom: 15px; }
      .header h2 { font-size: 22px; margin-bottom: 5px; font-weight: 900 !important;}
      .header p { font-size: 13px; margin-bottom: 3px; }
      .divider { border-top: 2px dashed #000; margin: 15px 0; }
    </style>
    <div class="header">
      <h2>CIERRE DE CAJA</h2>
      <p>${props.localAsignado ? props.localAsignado.replace(/-/g, ' ') : 'GLOBAL'}</p>
    </div>
    
    <div class="divider"></div>
    <div style="font-size: 13px; margin-bottom: 15px;">
      <p style="margin: 4px 0;"><strong>FECHA:</strong> ${fechaImpresion}</p>
      <p style="margin: 4px 0;"><strong>MESAS PAGADAS:</strong> ${statsPos.totalMesasDia}</p>
    </div>

    <h3 style="font-size: 15px; margin-bottom: 10px;">DESGLOSE POR MESERA:</h3>
  `

  statsPos.desgloseMeseras.forEach(m => {
    contenido += `
      <div style="margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px dashed #000;">
        <div style="display: flex; justify-content: space-between; font-size: 14px; font-weight: 900 !important;">
          <span>${m.nombre} (${m.cantidadMesas} mesas)</span>
          <span>$${m.ventas.toLocaleString('es-CO')}</span>
        </div>
    `

    m.desgloseMesas.forEach(mesa => {
      contenido += `
        <div style="margin-top: 6px; padding: 4px; border: 1px solid #ccc; border-radius: 4px;">
          <div style="display: flex; justify-content: space-between; font-size: 12px; font-weight: bold; border-bottom: 1px dashed #eee; margin-bottom: 4px; padding-bottom: 2px;">
            <span>MESA: ${mesa.nombre}</span>
            <span>$${mesa.total.toLocaleString('es-CO')}</span>
          </div>
          <div style="padding-left: 6px; font-size: 12px;">
      `
      Object.entries(mesa.productos).forEach(([prod, cant]) => {
        contenido += `
          <div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
            <span>- ${prod}</span>
            <span>X${cant}</span>
          </div>
        `
      })
      contenido += `
          </div>
        </div>
      `
    })

    contenido += `
      </div>
    `
  })

  contenido += `
      <div class="divider"></div>
      <h3 style="text-align: right; margin-top: 15px; font-size: 18px; padding: 10px 0; border-top: 2px dashed #000; border-bottom: 2px dashed #000;">TOTAL VENTAS: $${statsPos.totalVentasDia.toLocaleString('es-CO')}</h3>
      
      <p style="text-align: center; margin-top: 30px; font-size: 12px; font-style: italic;">- Fin del Reporte -</p>
      <div style="text-align: center; margin-top: 10px;">***</div>
  `

  let iframe = document.getElementById('impresora-oculta');

  if (iframe) {
    document.body.removeChild(iframe);
  }

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
      <head><title>Impresión Cierre</title></head>
      <body onload="window.print(); setTimeout(() => window.parent.document.body.removeChild(window.frameElement), 1000)">${contenido}</body>
    </html>
  `);
  iframe.contentDocument.close();
}

onMounted(() => {
  calcularEstadisticasPos()
})

defineExpose({
  calcularEstadisticasPos
})
</script>

<style scoped>
input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1);
  cursor: pointer;
}
</style>
