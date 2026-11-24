<template>
  <div>
    <header class="mb-8 md:mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
      <div>
        <h1 class="text-3xl md:text-4xl font-serif text-white flex items-center gap-3">
          Órdenes Activas
          <span class="relative flex h-3 w-3">
            <span
              class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
        </h1>
        <p class="text-[#D4AF37] text-[10px] md:text-xs mt-2 uppercase tracking-[0.2em] font-bold drop-shadow-sm">
          {{ localAsignado ? 'Sede: ' + localAsignado.replace(/-/g, ' ') : 'Monitoreo Global' }}
        </p>
      </div>

      <div class="flex bg-black border border-white/10 rounded-full p-1 shadow-inner">
        <button @click="estadoCaja = 'pendiente'"
          :class="['px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 focus:outline-none', estadoCaja === 'pendiente' ? 'bg-[#D4AF37] text-black shadow-md' : 'text-neutral-500 hover:text-white']">
          Pendientes ({{ ordenesPendientes.length }})
        </button>
        <button @click="estadoCaja = 'pagado'"
          :class="['px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 focus:outline-none', estadoCaja === 'pagado' ? 'bg-green-500 text-black shadow-md' : 'text-neutral-500 hover:text-white']">
          Facturadas
        </button>
      </div>
    </header>

    <div v-if="cargandoCaja"
      class="text-center py-20 text-neutral-500 animate-pulse text-xs uppercase tracking-widest">Buscando
      comandas...</div>

    <div v-else-if="ordenesCajaFiltradas.length === 0"
      class="text-center py-20 text-neutral-500 border border-dashed border-white/10 rounded-3xl bg-white/[0.02]">
      No hay órdenes en estado "{{ estadoCaja }}" registradas.
    </div>

    <div v-else class="w-full space-y-10">
      <div v-for="(grupo, index) in vistasCaja" :key="index" class="w-full">

        <h3 v-if="estadoCaja === 'pagado'"
          class="text-xl md:text-2xl font-serif text-[#D4AF37] mb-5 border-b border-[#D4AF37]/20 pb-2 capitalize">
          {{ grupo.fecha }}</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div v-for="orden in grupo.ordenes" :key="orden.id"
            class="bg-neutral-900 border border-white/5 rounded-3xl p-6 relative flex flex-col shadow-lg transition-all duration-500 hover:border-white/10"
            :class="{ 'ring-1 ring-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.15)]': orden.estado === 'pendiente' }">

            <div class="flex justify-between items-start mb-4 border-b border-white/10 pb-4">
              <div>
                <h3 class="text-2xl font-serif text-white">Mesa: <span class="text-[#D4AF37] drop-shadow-sm">{{
                  orden.mesa }}</span></h3>
                <p class="text-[11px] text-neutral-400 uppercase tracking-widest mt-1">Mesera: <span
                    class="text-white font-bold">{{ orden.perfiles?.nombre || 'Desconocida' }}</span></p>
                <p class="text-[9px] text-neutral-600 uppercase tracking-widest mt-1">{{ new
                  Date(orden.created_at).toLocaleTimeString() }}</p>
              </div>
              <div class="text-right">
                <span
                  :class="{ 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30': orden.estado === 'pendiente', 'bg-green-500/20 text-green-500 border-green-500/30': orden.estado === 'pagado', 'bg-red-500/20 text-red-500 border-red-500/30': orden.estado === 'cancelado' }"
                  class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border shadow-sm">
                  {{ orden.estado }}
                </span>
              </div>
            </div>

            <div class="flex-1 space-y-3 mb-6 overflow-y-auto max-h-48 hide-scrollbar pr-2">
              <div v-for="item in (orden.pos_orden_items_originales || orden.pos_orden_items)"
                :key="'orig-' + item.id"
                :class="['flex flex-col text-xs md:text-sm transition-all duration-300',
                  (item.menu_gastronomia?.categoria === 'añadidos' || item.menu_gastronomia?.subcategoria === 'añadidos') ? 'bg-orange-500/10 border border-orange-500/30 rounded-xl p-3 mb-2 shadow-sm' : 'border-b border-white/5 pb-3']">
                <div class="flex justify-between items-start">
                  <span class="text-gray-300 pr-4 flex items-center flex-wrap gap-2">
                    <div>
                      <span class="text-[#D4AF37] font-bold text-base mr-1">{{ item.cantidad }}x</span>
                      {{ item.menu_gastronomia?.nombre || 'Plato eliminado' }}
                    </div>
                    <span
                      v-if="item.menu_gastronomia?.categoria === 'añadidos' || item.menu_gastronomia?.subcategoria === 'añadidos'"
                      class="bg-orange-500 text-black px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-widest shadow-[0_0_10px_rgba(249,115,22,0.4)]">
                      + Añadido
                    </span>
                  </span>
                  <span class="text-white font-bold whitespace-nowrap mt-1">${{ (item.precio_unitario *
                    item.cantidad).toLocaleString('es-CO') }}</span>
                </div>
                <div v-if="item.notas"
                  class="text-[11px] text-red-400 italic mt-1.5 pl-6 flex items-start gap-1 font-medium tracking-wide">
                  <span>↳</span> {{ item.notas }}
                </div>
              </div>

              <template v-if="orden.pos_orden_items_anadidos && orden.pos_orden_items_anadidos.length > 0">
                <div
                  class="pt-3 pb-2 mt-2 flex items-center justify-center border-t border-dashed border-[#D4AF37]/50">
                  <span
                    class="bg-red-500 text-white px-4 py-1.5 rounded-md text-[10px] font-extrabold uppercase tracking-widest shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse border border-red-400">
                    🚨 NUEVO PEDIDO AGREGADO
                  </span>
                </div>
                <div v-for="item in orden.pos_orden_items_anadidos" :key="'add-' + item.id"
                  :class="['flex flex-col text-xs md:text-sm transition-all duration-300 relative overflow-hidden',
                    (item.menu_gastronomia?.categoria === 'añadidos' || item.menu_gastronomia?.subcategoria === 'añadidos') ? 'bg-orange-500/20 border border-orange-500/50 rounded-xl p-3 mb-2 shadow-sm' : 'bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-2 shadow-sm']">
                  <div class="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                  <div class="flex justify-between items-start pl-3 pt-1">
                    <span class="text-white pr-4 flex items-center flex-wrap gap-2 font-bold">
                      <div>
                        <span class="text-red-400 font-extrabold text-base mr-1">{{ item.cantidad }}x</span>
                        {{ item.menu_gastronomia?.nombre || 'Plato eliminado' }}
                      </div>
                      <span
                        v-if="item.menu_gastronomia?.categoria === 'añadidos' || item.menu_gastronomia?.subcategoria === 'añadidos'"
                        class="bg-orange-500 text-black px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-widest shadow-[0_0_10px_rgba(249,115,22,0.4)]">
                        + Añadido
                      </span>
                    </span>
                    <span class="text-white font-bold whitespace-nowrap mt-1 pr-1">${{ (item.precio_unitario *
                      item.cantidad).toLocaleString('es-CO') }}</span>
                  </div>
                  <div v-if="item.notas"
                    class="text-[11px] text-red-300 italic mt-1.5 pl-8 pb-1 flex items-start gap-1 font-medium tracking-wide">
                    <span>↳</span> {{ item.notas }}
                  </div>
                </div>
              </template>
            </div>

            <div class="border-t border-white/10 pt-4 flex justify-between items-center mb-6">
              <span class="text-sm text-neutral-400 uppercase tracking-widest">Total</span>
              <span class="text-3xl font-serif text-[#D4AF37] drop-shadow-sm">${{
                orden.total.toLocaleString('es-CO') }}</span>
            </div>

            <div class="grid grid-cols-3 gap-2 mt-auto">
              <button @click="imprimirTicket(orden, orden.estado === 'pagado' ? 'factura' : 'comanda')"
                class="p-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-white/30">
                Imprimir {{ orden.estado === 'pagado' ? 'Factura' : 'Comanda' }}
              </button>
              <button v-if="orden.estado === 'pendiente'"
                @click="actualizarEstadoOrden(orden.ids_asociados || orden.id, 'pagado')"
                class="p-3 bg-green-500/20 hover:bg-green-500/30 text-green-500 border border-green-500/30 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-green-500/50">Cobrar</button>
              <button v-if="orden.estado === 'pendiente'"
                @click="actualizarEstadoOrden(orden.ids_asociados || orden.id, 'cancelado')"
                class="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500/50">Anular</button>
              <button @click="eliminarOrdenFisica(orden.ids_asociados || orden.id)"
                class="col-span-3 p-3 mt-1 bg-red-900/30 hover:bg-red-700/50 text-red-400 border border-red-500/30 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-red-500/50">
                🗑️ Eliminar Orden Definitivamente
              </button>
            </div>
          </div>
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

const ordenesCaja = ref([])
const cargandoCaja = ref(false)
const estadoCaja = ref('pendiente')
let subscripcionPos = null
const ordenesImpresas = new Set()

const fetchOrdenesCaja = async (mostrarLoader = true) => {
  if (mostrarLoader) cargandoCaja.value = true
  let query = supabase
    .from('pos_ordenes')
    .select(`
      *,
      perfiles ( nombre ),
      pos_orden_items (
        id, cantidad, precio_unitario, notas,
        menu_gastronomia (nombre, codigo_pos, categoria, subcategoria)
      )
    `)
    .order('created_at', { ascending: false })
    .limit(200)

  if (props.rolUsuario === 'admin_cafe' && props.localAsignado) {
    query = query.eq('local', props.localAsignado)
  }

  const { data, error } = await query
  if (!error) ordenesCaja.value = data || []
  if (mostrarLoader) cargandoCaja.value = false
}

const ordenesPendientes = computed(() => {
  const pendientes = [...ordenesCaja.value]
    .filter(orden => orden.estado === 'pendiente')
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  const agrupadas = {};

  pendientes.forEach(orden => {
    if (!agrupadas[orden.mesa]) {
      agrupadas[orden.mesa] = {
        ...orden,
        ids_asociados: [orden.id],
        pos_orden_items_originales: [...(orden.pos_orden_items || [])],
        pos_orden_items_anadidos: [],
        total_combinado: orden.total
      };
    } else {
      agrupadas[orden.mesa].ids_asociados.push(orden.id);
      agrupadas[orden.mesa].pos_orden_items_anadidos.push(...(orden.pos_orden_items || []));
      agrupadas[orden.mesa].total_combinado += orden.total;
    }
  });

  return Object.values(agrupadas).map(grupo => ({
    ...grupo,
    total: grupo.total_combinado,
    pos_orden_items: [...grupo.pos_orden_items_originales, ...grupo.pos_orden_items_anadidos]
  })).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
});

const ordenesFacturadas = computed(() => {
  const pagadas = [...ordenesCaja.value]
    .filter(orden => orden.estado === 'pagado')
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at));

  const gruposPorMesa = {};

  pagadas.forEach(orden => {
    const mesa = orden.mesa;
    if (!gruposPorMesa[mesa]) {
      gruposPorMesa[mesa] = [];
    }

    const ordenTime = new Date(orden.created_at).getTime();

    let grupoEncontrado = gruposPorMesa[mesa].find(g => {
      const firstTime = new Date(g.created_at).getTime();
      return (ordenTime - firstTime) < 6 * 60 * 60 * 1000;
    });

    if (grupoEncontrado) {
      grupoEncontrado.ids_asociados.push(orden.id);
      grupoEncontrado.pos_orden_items_anadidos.push(...(orden.pos_orden_items || []));
      grupoEncontrado.total_combinado += orden.total;
    } else {
      gruposPorMesa[mesa].push({
        ...orden,
        ids_asociados: [orden.id],
        pos_orden_items_originales: [...(orden.pos_orden_items || [])],
        pos_orden_items_anadidos: [],
        total_combinado: orden.total
      });
    }
  });

  const resultado = [];
  Object.values(gruposPorMesa).forEach(grupos => {
    grupos.forEach(grupo => {
      resultado.push({
        ...grupo,
        total: grupo.total_combinado,
        pos_orden_items: [...grupo.pos_orden_items_originales, ...grupo.pos_orden_items_anadidos]
      });
    });
  });

  return resultado.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
});

const ordenesCajaFiltradas = computed(() => {
  return estadoCaja.value === 'pendiente' ? ordenesPendientes.value : ordenesFacturadas.value
})

const vistasCaja = computed(() => {
  if (estadoCaja.value === 'pendiente') {
    return [{ fecha: '', ordenes: ordenesPendientes.value }]
  } else {
    const grupos = {}
    ordenesFacturadas.value.forEach(orden => {
      const d = new Date(orden.created_at)
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
      const fechaKey = d.toLocaleDateString('es-CO', options)

      const fechaCapitalizada = fechaKey.charAt(0).toUpperCase() + fechaKey.slice(1)

      if (!grupos[fechaCapitalizada]) grupos[fechaCapitalizada] = []
      grupos[fechaCapitalizada].push(orden)
    })

    return Object.keys(grupos).map(fecha => ({
      fecha,
      ordenes: grupos[fecha]
    }))
  }
})

const actualizarEstadoOrden = async (idOrArray, nuevoEstado) => {
  if (confirm(`¿Confirmas pasar esta orden a estado: ${nuevoEstado.toUpperCase()}?`)) {
    if (Array.isArray(idOrArray)) {
      await supabase.from('pos_ordenes').update({ estado: nuevoEstado }).in('id', idOrArray)
    } else {
      await supabase.from('pos_ordenes').update({ estado: nuevoEstado }).eq('id', idOrArray)
    }
    fetchOrdenesCaja()
  }
}

const eliminarOrdenFisica = async (idOrArray) => {
  if (confirm(`¿Peligro: Eliminar definitivamente esta orden de la base de datos? Esto no se puede deshacer.`)) {
    if (Array.isArray(idOrArray)) {
      await supabase.from('pos_ordenes').delete().in('id', idOrArray)
    } else {
      await supabase.from('pos_ordenes').delete().eq('id', idOrArray)
    }
    fetchOrdenesCaja()
  }
}

const inicializarRealtime = () => {
  if (subscripcionPos) return;
  subscripcionPos = supabase
    .channel('pos_ordenes_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'pos_ordenes' }, (payload) => {

      if (props.rolUsuario === 'admin_cafe' && payload.new && payload.new.local !== props.localAsignado) return;

      if (payload.eventType === 'INSERT') {
        if (ordenesImpresas.has(payload.new.id)) return;
        ordenesImpresas.add(payload.new.id);

        const intentarImprimir = async (intento = 1) => {
          const { data: ordenEspecifica } = await supabase
            .from('pos_ordenes')
            .select(`*, perfiles ( nombre ), pos_orden_items ( id, cantidad, precio_unitario, notas, menu_gastronomia (nombre, codigo_pos, categoria, subcategoria) )`)
            .eq('id', payload.new.id)
            .single();

          if (ordenEspecifica && ordenEspecifica.pos_orden_items && ordenEspecifica.pos_orden_items.length > 0) {
            imprimirTicket(ordenEspecifica, 'comanda');
            fetchOrdenesCaja(false);
          } else if (intento <= 4) {
            setTimeout(() => intentarImprimir(intento + 1), 1000);
          } else {
            fetchOrdenesCaja(false);
          }
        };
        setTimeout(() => intentarImprimir(1), 1000);

      } else {
        setTimeout(() => { fetchOrdenesCaja(false); }, 1000);
      }
    })
    .subscribe((status) => {
      if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
        subscripcionPos = null;
        setTimeout(() => inicializarRealtime(), 3000);
      }
    });
}

const imprimirTicket = (orden, tipo = 'comanda') => {
  const esFactura = tipo === 'factura' || orden.estado === 'pagado';
  const tituloDocumento = esFactura ? 'DOCUMENTO EQUIVALENTE POS' : 'TICKET DE COCINA (COMANDA)';

  let contenido = `
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; color: #000 !important; font-family: 'Courier New', Courier, monospace !important; font-weight: 700 !important; }
      body { width: 280px; padding: 15px 5px 40px 5px; font-size: 14px; text-transform: uppercase; line-height: 1.4; }
      .header { text-align: center; margin-bottom: 15px; }
      .header h2 { font-size: 22px; margin-bottom: 4px; font-weight: 900 !important; }
      .header p { font-size: 13px; margin-bottom: 3px; }
      .divider { border-top: 2px dashed #000; margin: 15px 0; }
      .info-client p { font-size: 13px; margin-bottom: 4px; }
      table { width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 10px; }
      th { text-align: left; padding-bottom: 10px; border-bottom: 2px dashed #000; font-size: 14px; }
      td { vertical-align: top; padding-top: 10px; padding-bottom: 5px; }
      .text-right { text-align: right; }
      .total-section { font-size: 20px; font-weight: 900 !important; text-align: right; margin-top: 15px; margin-bottom: 20px; padding: 10px 0; border-top: 2px dashed #000; border-bottom: 2px dashed #000; }
      .footer-info p { font-size: 13px; margin-bottom: 4px; }
      .legal-text { font-size: 11px; text-align: center; margin-top: 30px; font-weight: 600 !important; line-height: 1.3; }
      .kitchen-title { font-size: 28px; text-align: center; margin: 10px 0; font-weight: 900 !important; background: #000; color: #fff !important; padding: 10px; border-radius: 4px;}
    </style>
  `;

  if (esFactura) {
    contenido += `
    <div class="header">
      <h2>HACIENDA EL PORTAL S.A.S</h2>
      <p>NIT. 800.145.761-1</p>
      <p>TELEFONO: 5134422</p>
      <p>CR 52 # 48-45 PISO 5 MEDELLIN</p>
      <p>NO SOMOS AUTORETENEDORES DE IVA</p>
      <p>SOMOS RESPONSABLES DE IVA</p>
      <div class="divider"></div>
      <h3 style="font-size: 18px;">${orden.local.replace(/-/g, ' ').toUpperCase()}</h3>
      <p style="font-size: 14px; margin-top: 5px;">${tituloDocumento}</p>
    </div>

    <div class="info-client">
      <p><strong>Cliente:</strong> CONSUMIDOR FINAL</p>
      <p><strong>Documento:</strong> 22222222222-3</p>
      <p><strong>Dirección:</strong> CRA 52 # 48-45 PISO 5</p>
      <p><strong>Mesa:</strong> ${orden.mesa}</p>
    </div>

    <div class="divider"></div>
    `;
  } else {
    contenido += `
    <div class="header">
      <div class="kitchen-title">MESA: ${orden.mesa}</div>
      <h3 style="font-size: 16px; margin-top: 5px;">${orden.local.replace(/-/g, ' ').toUpperCase()}</h3>
      <p style="font-size: 16px; margin-top: 5px; border: 2px solid #000; padding: 4px; display: inline-block;">${tituloDocumento}</p>
    </div>

    <div class="info-client">
      <p><strong>Mesera:</strong> ${orden.perfiles?.nombre || 'Desconocida'}</p>
      <p><strong>Hora de pedido:</strong> ${new Date(orden.created_at).toLocaleTimeString()}</p>
    </div>

    <div class="divider"></div>
    `;
  }

  contenido += `
    <table>
      <thead>
        <tr>
          <th style="width: 15%;">Cant.</th>
          <th style="width: ${esFactura ? '50%' : '85%'};">Descripción</th>
          ${esFactura ? '<th style="width: 35%;" class="text-right">Valor</th>' : ''}
        </tr>
      </thead>
      <tbody>
  `;

  orden.pos_orden_items.forEach(item => {
    const codigo = item.menu_gastronomia?.codigo_pos ? `[${item.menu_gastronomia.codigo_pos}] ` : '';
    const fSize = esFactura ? '14px' : '18px';
    contenido += `
      <tr>
        <td><strong style="font-size: ${fSize};">${item.cantidad}</strong></td>
        <td><strong style="font-size: ${fSize};">${codigo}${item.menu_gastronomia?.nombre || 'Plato'}</strong></td>
        ${esFactura ? `<td class="text-right">$${(item.precio_unitario * item.cantidad).toLocaleString('es-CO')}</td>` : ''}
      </tr>
    `;
    if (item.notas) {
      contenido += `
        <tr>
          <td colspan="${esFactura ? '3' : '2'}" style="font-size: 14px; padding-left: 15px; font-style: italic; border-left: 2px solid #000; margin-bottom: 5px; display: block;">
            -> NOTA: ${item.notas.toUpperCase()}
          </td>
          </tr>
      `;
    }
  });

  contenido += `
      </tbody>
    </table>
  `;

  if (esFactura) {
    contenido += `
    <div class="total-section">
      TOTAL: $${orden.total.toLocaleString('es-CO')}
    </div>

    <div class="footer-info">
      <p><strong>Vendedor:</strong> ${orden.perfiles?.nombre || 'Desconocida'}</p>
      <p><strong>Fecha expedición:</strong> ${new Date(orden.created_at).toLocaleString()}</p>
    </div>

    <div class="legal-text">
      <p>Esta factura de venta es un titulo valor en virtud de la ley 1 de julio 2008, los intereses moratorios que se causen seran cobrados mensualmente acorde con las variaciones que sufren las tasas de interés certificadas por la superintendencia financiera de conformidad con el artículo 111 de la ley 510</p>
      <p style="margin-top: 10px; font-size: 13px;">*** COPIA DE CLIENTE ***</p>
    </div>
    `;
  } else {
    contenido += `
    <div class="divider"></div>
    <div class="legal-text">
      <p style="margin-top: 10px; font-size: 14px;">*** COPIA DE COCINA ***</p>
    </div>
    `;
  }

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
      <head><title>Impresión</title></head>
      <body onload="window.print(); setTimeout(() => window.parent.document.body.removeChild(window.frameElement), 1000)">${contenido}</body>
    </html>
  `);
  iframe.contentDocument.close();
}

onMounted(() => {
  fetchOrdenesCaja()
  inicializarRealtime()
})

onUnmounted(() => {
  if (subscripcionPos) {
    supabase.removeChannel(subscripcionPos)
    subscripcionPos = null
  }
})

defineExpose({
  fetchOrdenesCaja,
  recargar: () => fetchOrdenesCaja(false)
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
