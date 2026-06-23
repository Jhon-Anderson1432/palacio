<template>
  <div class="fixed inset-0 z-[999] bg-[#0a0a0a] overflow-y-auto text-white font-sans flex">
    
    <div v-if="menuAbierto" @click="menuAbierto = false" class="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm transition-opacity"></div>

    <aside :class="['w-64 bg-black border-r border-white/10 p-6 md:p-8 flex flex-col fixed top-0 left-0 bottom-0 md:relative z-50 transition-transform duration-300', menuAbierto ? 'translate-x-0' : '-translate-x-full md:translate-x-0']">
      
      <div class="flex flex-col mb-10 text-[#D4AF37]">
        <div class="flex items-center justify-between gap-3">
          <span class="font-serif text-xl tracking-tighter uppercase">Palacio Admin</span>
          <button @click="menuAbierto = false" class="md:hidden text-white/50 hover:text-white p-2">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <span class="text-[9px] uppercase tracking-widest text-neutral-500 mt-1">
          {{ rolUsuario.replace('_', ' ') }} <span v-if="localAsignado">({{ localAsignado }})</span>
        </span>
      </div>
      
      <nav class="space-y-4 flex-1 overflow-y-auto hide-scrollbar">
        <div v-if="rolUsuario === 'admin_galeria' || rolUsuario === 'superadmin'" class="space-y-4">
          <button @click="pestañaActiva = 'inventario'; menuAbierto = false" :class="['w-full p-3 rounded-xl flex items-center gap-3 transition-all', pestañaActiva === 'inventario' ? 'text-[#D4AF37] bg-[#D4AF37]/10' : 'text-neutral-500 hover:text-white hover:bg-white/5']">
             <span class="font-medium text-sm uppercase tracking-widest">Inventario Arte</span>
          </button>

          <button @click="pestañaActiva = 'estadisticas'; calcularEstadisticas(); menuAbierto = false" :class="['w-full p-3 rounded-xl flex items-center gap-3 transition-all', pestañaActiva === 'estadisticas' ? 'text-[#D4AF37] bg-[#D4AF37]/10' : 'text-neutral-500 hover:text-white hover:bg-white/5']">
             <span class="font-medium text-sm uppercase tracking-widest">Métricas Arte</span>
          </button>
        </div>

        <div v-if="rolUsuario === 'admin_cafe' || rolUsuario === 'superadmin'" class="space-y-4 pt-4 border-t border-white/5">
          <button @click="pestañaActiva = 'caja'; fetchOrdenesCaja(); menuAbierto = false" :class="['w-full p-3 rounded-xl flex items-center gap-3 transition-all', pestañaActiva === 'caja' ? 'text-[#D4AF37] bg-[#D4AF37]/10' : 'text-neutral-500 hover:text-white hover:bg-white/5']">
             <span class="font-medium text-sm uppercase tracking-widest">Caja Registradora</span>
          </button>

          <button @click="pestañaActiva = 'estadisticas_pos'; calcularEstadisticasPos(); menuAbierto = false" :class="['w-full p-3 rounded-xl flex items-center gap-3 transition-all', pestañaActiva === 'estadisticas_pos' ? 'text-[#D4AF37] bg-[#D4AF37]/10' : 'text-neutral-500 hover:text-white hover:bg-white/5']">
             <span class="font-medium text-sm uppercase tracking-widest">Métricas POS</span>
          </button>
          
          <button @click="pestañaActiva = 'gastronomia'; fetchGastronomia(); menuAbierto = false" :class="['w-full p-3 rounded-xl flex items-center gap-3 transition-all', pestañaActiva === 'gastronomia' ? 'text-[#D4AF37] bg-[#D4AF37]/10' : 'text-neutral-500 hover:text-white hover:bg-white/5']">
             <span class="font-medium text-sm uppercase tracking-widest">Gestión Menú</span>
          </button>
        </div>

        <div v-if="rolUsuario === 'admin_seguridad' || rolUsuario === 'superadmin'" class="space-y-4 pt-4 border-t border-white/5">
          <button @click="pestañaActiva = 'seguridad'; fetchSeguridad(); menuAbierto = false" :class="['w-full p-3 rounded-xl flex items-center gap-3 transition-all', pestañaActiva === 'seguridad' ? 'text-[#D4AF37] bg-[#D4AF37]/10' : 'text-neutral-500 hover:text-white hover:bg-white/5']">
             <span class="font-medium text-sm uppercase tracking-widest">Monitoreo Seguridad</span>
          </button>
        </div>
      </nav>
      
      <button @click="handleLogout" class="text-red-500 hover:bg-red-500/10 p-3 rounded-xl flex items-center gap-3 mb-4 transition-all text-[10px] font-bold uppercase tracking-widest mt-4">
        CERRAR SESIÓN
      </button>
      
      <router-link to="/exposiciones" class="text-neutral-500 hover:text-white transition-colors flex items-center gap-2 text-[10px] uppercase font-bold pt-4 border-t border-white/10 tracking-widest">
        ← GALERÍA PÚBLICA
      </router-link>
    </aside>

    <main class="flex-1 flex flex-col relative">
      <nav class="sticky top-0 z-20 bg-black/80 backdrop-blur-md border-b border-white/5 p-4 md:p-6 flex items-center justify-between gap-3 md:gap-6">
        
        <button @click="menuAbierto = true" class="md:hidden text-[#D4AF37] p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>

        <div v-if="pestañaActiva === 'inventario' || pestañaActiva === 'gastronomia'" class="flex-1 max-w-xl relative group">
          <input
            v-model="searchQuery"
            type="text"
            :placeholder="pestañaActiva === 'inventario' ? 'Buscar obra...' : 'Buscar plato...'"
            class="w-full bg-white/5 border border-white/10 rounded-full py-2.5 pl-10 md:py-3 md:pl-12 pr-4 text-xs md:text-sm outline-none focus:border-[#D4AF37]/50 transition-all text-white"
          />
          <span class="absolute left-4 top-3 md:left-5 md:top-3.5 text-neutral-500 group-focus-within:text-[#D4AF37]">🔍</span>
        </div>
        <div v-else class="flex-1">
          <h2 class="text-lg md:text-xl font-serif text-white truncate">
            {{ pestañaActiva === 'caja' ? 'Sistema POS' : (pestañaActiva === 'estadisticas_pos' ? 'Métricas de Ventas' : (pestañaActiva === 'seguridad' ? 'Control de Vigilancia' : 'Estadísticas de la Galería')) }}
          </h2>
        </div>
        
        <button v-if="pestañaActiva === 'inventario'" @click="openForm()" class="bg-[#D4AF37] text-black px-4 py-2.5 md:px-6 md:py-3 rounded-full font-bold hover:bg-yellow-600 transition-transform active:scale-95 text-[10px] md:text-xs uppercase tracking-widest flex items-center gap-2 whitespace-nowrap">
          <span class="text-sm md:text-base">+</span> <span class="hidden sm:inline">AGREGAR</span> OBRA
        </button>

        <button v-if="pestañaActiva === 'gastronomia'" @click="openGastroForm()" class="bg-[#D4AF37] text-black px-4 py-2.5 md:px-6 md:py-3 rounded-full font-bold hover:bg-yellow-600 transition-transform active:scale-95 text-[10px] md:text-xs uppercase tracking-widest flex items-center gap-2 whitespace-nowrap">
          <span class="text-sm md:text-base">+</span> <span class="hidden sm:inline">AGREGAR</span> PLATO
        </button>

        <button v-if="pestañaActiva === 'seguridad'" @click="abrirModalQR()" class="bg-[#D4AF37] text-black px-4 py-2.5 md:px-6 md:py-3 rounded-full font-bold hover:bg-yellow-600 transition-transform active:scale-95 text-[10px] md:text-xs uppercase tracking-widest flex items-center gap-2 whitespace-nowrap">
          <span class="text-sm md:text-base">+</span> <span class="hidden sm:inline">NUEVO</span> PUNTO QR
        </button>

        <button v-if="pestañaActiva === 'caja' || pestañaActiva === 'seguridad'" @click="pestañaActiva === 'caja' ? fetchOrdenesCaja() : fetchSeguridad()" class="p-2.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl transition-all">
          🔄
        </button>
      </nav>

      <div class="p-4 md:p-8 lg:p-12 overflow-y-auto">
        
        <div v-if="pestañaActiva === 'caja'">
          <header class="mb-8 md:mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h1 class="text-3xl md:text-4xl font-serif text-white flex items-center gap-3">
                Órdenes Activas
                <span class="relative flex h-3 w-3">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
              </h1>
              <p class="text-[#D4AF37] text-[10px] md:text-xs mt-2 uppercase tracking-[0.2em] font-bold">
                {{ localAsignado ? 'Sede: ' + localAsignado.replace(/-/g, ' ') : 'Monitoreo Global' }}
              </p>
            </div>
            
            <div class="flex bg-black border border-white/10 rounded-full p-1">
              <button @click="estadoCaja = 'pendiente'" :class="['px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all', estadoCaja === 'pendiente' ? 'bg-[#D4AF37] text-black' : 'text-neutral-500 hover:text-white']">
                Pendientes ({{ ordenesPendientes.length }})
              </button>
              <button @click="estadoCaja = 'pagado'" :class="['px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all', estadoCaja === 'pagado' ? 'bg-green-500 text-black' : 'text-neutral-500 hover:text-white']">
                Facturadas
              </button>
            </div>
          </header>

          <div v-if="cargandoCaja" class="text-center py-20 text-neutral-500 animate-pulse text-xs uppercase tracking-widest">Buscando comandas...</div>
          
          <div v-else-if="ordenesCajaFiltradas.length === 0" class="text-center py-20 text-neutral-500 border border-dashed border-white/10 rounded-3xl">
            No hay órdenes en estado "{{ estadoCaja }}" registradas.
          </div>

          <div v-else class="w-full space-y-10">
            <div v-for="(grupo, index) in vistasCaja" :key="index" class="w-full">
              
              <h3 v-if="estadoCaja === 'pagado'" class="text-xl md:text-2xl font-serif text-[#D4AF37] mb-5 border-b border-[#D4AF37]/20 pb-2 capitalize">{{ grupo.fecha }}</h3>

              <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <div v-for="orden in grupo.ordenes" :key="orden.id" class="bg-neutral-900 border border-white/5 rounded-3xl p-6 relative flex flex-col shadow-lg transition-all duration-500" :class="{'ring-1 ring-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.15)]': orden.estado === 'pendiente'}">
                  
                  <div class="flex justify-between items-start mb-4 border-b border-white/10 pb-4">
                    <div>
                      <h3 class="text-2xl font-serif text-white">Mesa: <span class="text-[#D4AF37]">{{ orden.mesa }}</span></h3>
                      <p class="text-[11px] text-neutral-400 uppercase tracking-widest mt-1">Mesera: <span class="text-white font-bold">{{ orden.perfiles?.nombre || 'Desconocida' }}</span></p>
                      <p class="text-[9px] text-neutral-600 uppercase tracking-widest mt-1">{{ new Date(orden.created_at).toLocaleTimeString() }}</p>
                    </div>
                    <div class="text-right">
                      <span :class="{'bg-yellow-500/20 text-yellow-500': orden.estado === 'pendiente', 'bg-green-500/20 text-green-500': orden.estado === 'pagado', 'bg-red-500/20 text-red-500': orden.estado === 'cancelado'}" class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border border-current shadow-sm">
                        {{ orden.estado }}
                      </span>
                    </div>
                  </div>

                  <div class="flex-1 space-y-3 mb-6 overflow-y-auto max-h-48 hide-scrollbar pr-2">
                    <div v-for="item in (orden.pos_orden_items_originales || orden.pos_orden_items)" :key="'orig-'+item.id" 
                         :class="['flex flex-col text-xs md:text-sm transition-all', 
                                  (item.menu_gastronomia?.categoria === 'añadidos' || item.menu_gastronomia?.subcategoria === 'añadidos') ? 'bg-orange-500/10 border border-orange-500/30 rounded-xl p-3 mb-2 shadow-sm' : 'border-b border-white/5 pb-3']">
                      <div class="flex justify-between items-start">
                        <span class="text-gray-300 pr-4 flex items-center flex-wrap gap-2">
                          <div>
                            <span class="text-[#D4AF37] font-bold text-base mr-1">{{ item.cantidad }}x</span> 
                            {{ item.menu_gastronomia?.nombre || 'Plato eliminado' }}
                          </div>
                          <span v-if="item.menu_gastronomia?.categoria === 'añadidos' || item.menu_gastronomia?.subcategoria === 'añadidos'" class="bg-orange-500 text-black px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-widest shadow-[0_0_10px_rgba(249,115,22,0.4)]">
                            + Añadido
                          </span>
                        </span>
                        <span class="text-white font-bold whitespace-nowrap mt-1">${{ (item.precio_unitario * item.cantidad).toLocaleString('es-CO') }}</span>
                      </div>
                      <div v-if="item.notas" class="text-[11px] text-red-400 italic mt-1.5 pl-6 flex items-start gap-1 font-medium tracking-wide">
                        <span>↳</span> {{ item.notas }}
                      </div>
                    </div>

                    <template v-if="orden.pos_orden_items_anadidos && orden.pos_orden_items_anadidos.length > 0">
                      <div class="pt-3 pb-2 mt-2 flex items-center justify-center border-t border-dashed border-[#D4AF37]/50">
                        <span class="bg-red-500 text-white px-4 py-1.5 rounded-md text-[10px] font-extrabold uppercase tracking-widest shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse border border-red-400">
                          🚨 NUEVO PEDIDO AGREGADO
                        </span>
                      </div>
                      <div v-for="item in orden.pos_orden_items_anadidos" :key="'add-'+item.id" 
                           :class="['flex flex-col text-xs md:text-sm transition-all relative overflow-hidden', 
                                    (item.menu_gastronomia?.categoria === 'añadidos' || item.menu_gastronomia?.subcategoria === 'añadidos') ? 'bg-orange-500/20 border border-orange-500/50 rounded-xl p-3 mb-2' : 'bg-red-500/10 border border-red-500/30 rounded-xl p-3 mb-2']">
                        <div class="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                        <div class="flex justify-between items-start pl-3 pt-1">
                          <span class="text-white pr-4 flex items-center flex-wrap gap-2 font-bold">
                            <div>
                              <span class="text-red-400 font-extrabold text-base mr-1">{{ item.cantidad }}x</span> 
                              {{ item.menu_gastronomia?.nombre || 'Plato eliminado' }}
                            </div>
                            <span v-if="item.menu_gastronomia?.categoria === 'añadidos' || item.menu_gastronomia?.subcategoria === 'añadidos'" class="bg-orange-500 text-black px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase tracking-widest shadow-[0_0_10px_rgba(249,115,22,0.4)]">
                              + Añadido
                            </span>
                          </span>
                          <span class="text-white font-bold whitespace-nowrap mt-1 pr-1">${{ (item.precio_unitario * item.cantidad).toLocaleString('es-CO') }}</span>
                        </div>
                        <div v-if="item.notas" class="text-[11px] text-red-300 italic mt-1.5 pl-8 pb-1 flex items-start gap-1 font-medium tracking-wide">
                          <span>↳</span> {{ item.notas }}
                        </div>
                      </div>
                    </template>
                  </div>

                  <div class="border-t border-white/10 pt-4 flex justify-between items-center mb-6">
                    <span class="text-sm text-neutral-400 uppercase tracking-widest">Total</span>
                    <span class="text-3xl font-serif text-[#D4AF37]">${{ orden.total.toLocaleString('es-CO') }}</span>
                  </div>

                  <div class="grid grid-cols-3 gap-2 mt-auto">
                    <button @click="imprimirTicket(orden, orden.estado === 'pagado' ? 'factura' : 'comanda')" class="p-3 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-md">
                      Imprimir {{ orden.estado === 'pagado' ? 'Factura' : 'Comanda' }}
                    </button>
                    <button v-if="orden.estado === 'pendiente'" @click="actualizarEstadoOrden(orden.ids_asociados || orden.id, 'pagado')" class="p-3 bg-green-500/20 hover:bg-green-500/30 text-green-500 border border-green-500/30 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-md">Cobrar</button>
                    <button v-if="orden.estado === 'pendiente'" @click="actualizarEstadoOrden(orden.ids_asociados || orden.id, 'cancelado')" class="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all">Anular</button>
                    <button @click="eliminarOrdenFisica(orden.ids_asociados || orden.id)" class="col-span-3 p-3 mt-1 bg-red-900/30 hover:bg-red-700/50 text-red-400 border border-red-500/30 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all shadow-md">
                      🗑️ Eliminar Orden Definitivamente
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="pestañaActiva === 'estadisticas_pos'">
          <header class="mb-8 md:mb-12 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
            <div>
              <h1 class="text-3xl md:text-4xl font-serif text-white">Cierre de Caja</h1>
              <p class="text-neutral-500 text-[10px] md:text-xs mt-2 uppercase tracking-[0.2em] font-bold">Resumen de Ventas Pagadas</p>
            </div>
            
            <div class="flex items-center gap-3">
              <input type="date" v-model="fechaFiltroMetricas" @change="calcularEstadisticasPos" class="bg-black border border-white/20 text-[#D4AF37] px-4 py-3 rounded-full text-xs font-bold uppercase tracking-widest outline-none focus:border-[#D4AF37] cursor-pointer color-scheme-dark" style="color-scheme: dark;" />
              
              <button @click="imprimirCierreCaja()" class="bg-[#D4AF37] text-black px-6 py-3 rounded-full font-bold hover:bg-yellow-600 transition-all text-xs uppercase tracking-widest whitespace-nowrap shadow-[0_0_15px_rgba(212,175,55,0.3)]">
                🖨️ Imprimir Cierre
              </button>
            </div>
          </header>

          <div v-if="cargandoStatsPos" class="text-center py-20 text-[#D4AF37] animate-pulse text-xs uppercase tracking-widest">Calculando métricas...</div>

          <div v-else class="max-w-5xl mx-auto space-y-8">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              <div class="bg-neutral-900 p-5 md:p-6 rounded-3xl border border-[#D4AF37]/30 flex flex-col justify-between h-32 md:h-40 shadow-lg">
                <span class="text-[10px] md:text-xs text-[#D4AF37] uppercase tracking-widest font-bold">Ventas Totales</span>
                <span class="text-4xl md:text-5xl font-serif text-white">${{ statsPos.totalVentasDia.toLocaleString('es-CO') }}</span>
              </div>
              <div class="bg-neutral-900 p-5 md:p-6 rounded-3xl border border-white/10 flex flex-col justify-between h-32 md:h-40">
                <span class="text-[10px] md:text-xs text-neutral-400 uppercase tracking-widest font-bold">Mesas Atendidas</span>
                <span class="text-4xl md:text-5xl font-serif text-white">{{ statsPos.totalMesasDia }}</span>
              </div>
            </div>

            <div class="bg-neutral-900 border border-white/5 rounded-3xl p-5 md:p-8">
              <h3 class="text-base md:text-lg font-serif text-white mb-6 border-b border-white/10 pb-4">Desempeño por Mesera</h3>
              <div v-if="statsPos.desgloseMeseras.length > 0" class="space-y-6">
                <div v-for="mesera in statsPos.desgloseMeseras" :key="mesera.nombre" class="flex flex-col p-5 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors space-y-4">
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
                    <div v-for="mesa in mesera.desgloseMesas" :key="mesa.nombre" class="bg-black/30 p-3 rounded-xl border border-white/5">
                      <div class="flex justify-between items-center mb-2 border-b border-white/5 pb-2">
                        <span class="text-[11px] uppercase tracking-widest text-white font-bold">Mesa: <span class="text-[#D4AF37]">{{ mesa.nombre }}</span></span>
                        <span class="text-[11px] text-[#D4AF37] font-bold">${{ mesa.total.toLocaleString('es-CO') }}</span>
                      </div>
                      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        <div v-for="(cant, prod) in mesa.productos" :key="prod" class="flex justify-between items-center bg-black/40 px-3 py-2 rounded-xl text-xs border border-white/5">
                          <span class="text-gray-300 truncate pr-2 capitalize">{{ prod.toLowerCase() }}</span>
                          <span class="text-[#D4AF37] font-bold bg-[#D4AF37]/10 px-2 py-0.5 rounded-md whitespace-nowrap">x{{ cant }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-center text-neutral-500 text-xs md:text-sm py-8 border border-dashed border-white/10 rounded-2xl">
                No hay ventas pagadas registradas en esta fecha.
              </div>
            </div>
          </div>
        </div>

        <div v-if="pestañaActiva === 'seguridad'">
          <header class="mb-8 md:mb-12 flex flex-col md:flex-row md:justify-between md:items-end gap-4">
            <div>
              <h1 class="text-3xl md:text-4xl font-serif text-white">Vigilancia Diaria</h1>
              <p class="text-neutral-500 text-[10px] md:text-xs mt-2 uppercase tracking-[0.2em] font-bold">Control de Puntos QR</p>
            </div>
            
            <div class="flex items-center gap-3">
              <input type="date" v-model="fechaFiltroSeguridad" @change="fetchSeguridad" class="bg-black border border-white/20 text-[#D4AF37] px-4 py-3 rounded-full text-xs font-bold uppercase tracking-widest outline-none focus:border-[#D4AF37] cursor-pointer color-scheme-dark" style="color-scheme: dark;" />
            </div>
          </header>

          <div v-if="cargandoSeguridad" class="text-center py-20 text-[#D4AF37] animate-pulse text-xs uppercase tracking-widest">Cargando registros...</div>

          <div v-else class="max-w-6xl mx-auto space-y-8">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div class="bg-neutral-900 p-5 rounded-3xl border border-white/10 flex flex-col justify-between h-32">
                <span class="text-[10px] text-neutral-400 uppercase tracking-widest font-bold">Total Escaneos (Hoy)</span>
                <span class="text-4xl font-serif text-white">{{ statsSeguridad.totalEscaneos }}</span>
              </div>
              <div class="bg-neutral-900 p-5 rounded-3xl border border-orange-500/20 flex flex-col justify-between h-32 relative">
                <span class="text-[10px] text-orange-400 uppercase tracking-widest font-bold">Observaciones Reportadas</span>
                <span class="text-4xl font-serif text-orange-400">{{ statsSeguridad.observaciones }}</span>
              </div>
            </div>

            <div class="bg-neutral-900 border border-white/5 rounded-3xl p-5 md:p-8">
              <h3 class="text-base md:text-lg font-serif text-[#D4AF37] mb-6 border-b border-white/10 pb-4">Detalle de Escaneos</h3>
              
              <div v-if="registrosSeguridad.length === 0" class="text-center text-neutral-500 text-xs md:text-sm py-8 border border-dashed border-white/10 rounded-2xl">
                No hay escaneos registrados recientes.
              </div>

              <div v-else class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="border-b border-white/10 text-xs uppercase tracking-widest text-neutral-400">
                      <th class="pb-4 font-bold">Hora</th>
                      <th class="pb-4 font-bold">Vigilante</th>
                      <th class="pb-4 font-bold">Punto</th>
                      <th class="pb-4 font-bold">Observación</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="registro in registrosSeguridad" :key="registro.id" class="border-b border-white/5 hover:bg-white/5">
                      <td class="py-4 text-[#D4AF37] font-bold">{{ formatearHora(registro.hora_registro) }}</td>
                      <td class="py-4 text-white">
                        <span class="bg-[#D4AF37]/10 text-[#D4AF37] px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                          {{ registro.nombre_vigilante || 'N/A' }}
                        </span>
                      </td>
                      <td class="py-4 text-white">
                        {{ registro.puntos_control?.nombre }} 
                        <span class="text-xs text-neutral-500 block mt-1">Piso: {{ registro.puntos_control?.piso }}</span>
                      </td>
                      <td class="py-4 text-neutral-300 text-sm max-w-xs truncate" :title="registro.observacion">{{ registro.observacion }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <div class="bg-neutral-900 border border-white/5 rounded-3xl p-5 md:p-8 mt-10">
            <div class="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
              <h3 class="text-base md:text-lg font-serif text-white">Puntos QR Activos</h3>
              <button @click="fetchPuntosControl" class="text-[10px] text-[#D4AF37] uppercase tracking-widest font-bold hover:text-white">Actualizar Lista</button>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div v-for="punto in puntosDeControl" :key="punto.id" class="bg-black/50 border border-white/10 p-4 rounded-xl flex flex-col justify-between">
                <div class="flex items-center justify-between mb-4">
                  <div>
                    <p class="text-sm font-bold text-white flex items-center gap-2">
                      {{ punto.nombre }}
                      <span v-if="punto.es_punto_final" class="w-2 h-2 rounded-full bg-red-500" title="Punto Final"></span>
                    </p>
                    <p class="text-[10px] text-neutral-400 uppercase tracking-widest">Piso {{ punto.piso }}</p>
                  </div>
                  <div class="w-12 h-12 bg-white rounded-md overflow-hidden flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-[#D4AF37] transition-all" @click="mostrarQRGrande(punto)" title="Ver QR en grande">
                    <qrcode-vue :value="punto.codigo_qr" :size="48" level="L" />
                  </div>
                </div>
                <div class="flex gap-2 pt-3 border-t border-white/5 mt-auto">
                  <button @click="abrirModalQR(punto)" class="flex-1 p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all">Editar</button>
                  <button @click="deletePuntoControl(punto)" class="p-2 border border-red-500/30 text-red-500 hover:bg-red-500/10 rounded-xl text-[10px] font-bold uppercase transition-all">Eliminar</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="pestañaActiva === 'inventario'">
          <header class="mb-8 md:mb-12">
            <h1 class="text-3xl md:text-4xl font-serif text-white">Gestión de Catálogo</h1>
            <p class="text-neutral-500 text-[10px] md:text-xs mt-2 uppercase tracking-[0.2em]">Sincronizado con Supabase Cloud</p>
          </header>

          <div v-if="!cargando" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <div v-for="obra in obrasFiltradas" :key="obra.id" class="bg-neutral-900 border border-white/5 rounded-3xl p-4 md:p-5 hover:border-[#D4AF37]/20 transition-all relative">
              <div class="relative mb-5 overflow-hidden rounded-2xl aspect-square bg-black shadow-inner">
                <img v-if="obra.imagen_1" :src="obra.imagen_1" class="w-full h-full object-cover" />
                <div v-else class="w-full h-full flex items-center justify-center text-neutral-600 text-xs">Sin Imagen</div>
                
                <div class="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[10px] text-[#D4AF37] font-bold uppercase tracking-tighter">{{ obra.precio }}</div>
                <div class="absolute top-3 left-3 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-[8px] text-white font-bold uppercase tracking-widest">{{ obra.tipo || 'Pintura' }}</div>
              </div>
              <div class="space-y-3">
                <h3 class="text-white font-serif text-xl leading-tight">{{ formatoTitulo(obra.titulo) }}</h3>
                <p v-if="obra.titulo_en" class="text-neutral-500 text-[10px] italic -mt-2">{{ formatoTitulo(obra.titulo_en) }}</p>
                <p class="text-[#D4AF37] text-[10px] font-bold uppercase tracking-[0.2em]">{{ formatoTitulo(obra.autor) }}</p>
              </div>
              <div class="flex gap-2 mt-6 pt-4 border-t border-white/5">
                <button @click="openForm(obra)" class="flex-1 p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all">Editar</button>
                <button @click="deleteObra(obra)" class="p-2 border border-red-500/30 text-red-500 hover:bg-red-500/10 rounded-xl text-[10px] font-bold uppercase transition-all">Eliminar</button>
              </div>
            </div>
          </div>
          <div v-if="cargando" class="text-center py-20 text-neutral-500 animate-pulse text-xs uppercase tracking-widest">Conectando...</div>
        </div>

        <div v-if="pestañaActiva === 'gastronomia'">
          <header class="mb-6">
            <h1 class="text-3xl md:text-4xl font-serif text-white">Gestión Gastronómica</h1>
            <p v-if="localAsignado" class="text-neutral-500 text-[10px] md:text-xs mt-2 uppercase tracking-[0.2em]">Filtrado por sede: {{ localAsignado.replace(/-/g, ' ') }}</p>
            <p v-else class="text-neutral-500 text-[10px] md:text-xs mt-2 uppercase tracking-[0.2em]">Gestión Global</p>
          </header>

          <div class="mb-4 flex overflow-x-auto gap-3 hide-scrollbar pb-2">
            <button 
              @click="categoriaActivaGastro = 'todas'"
              :class="[
                'whitespace-nowrap uppercase tracking-widest text-[11px] px-5 py-2.5 rounded-xl transition-all duration-300 font-medium',
                categoriaActivaGastro === 'todas'
                  ? 'bg-[#D4AF37] text-black shadow-[0_4px_15px_rgba(212,175,55,0.3)]' 
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
              ]"
            >
              Todas las categorías
            </button>
            <button 
              v-for="cat in categoriasGastroDisponiblesMenu" 
              :key="cat" 
              @click="categoriaActivaGastro = cat"
              :class="[
                'whitespace-nowrap uppercase tracking-widest text-[11px] px-5 py-2.5 rounded-xl transition-all duration-300 font-medium',
                categoriaActivaGastro === cat 
                  ? 'bg-[#D4AF37] text-black shadow-[0_4px_15px_rgba(212,175,55,0.3)]' 
                  : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10'
              ]"
            >
              {{ obtenerNombreCategoria(cat) }}
            </button>
          </div>

          <div v-if="categoriaActivaGastro !== 'todas' && subcategoriasGastroDisponiblesMenu.length > 0" class="mb-8 flex overflow-x-auto gap-3 hide-scrollbar pb-2">
            <button 
              @click="subcategoriaActivaGastro = 'todas'"
              :class="[
                'whitespace-nowrap uppercase tracking-widest text-[10px] px-4 py-2 rounded-xl transition-all duration-300 font-medium',
                subcategoriaActivaGastro === 'todas'
                  ? 'bg-[#D4AF37]/80 text-black shadow-sm' 
                  : 'bg-white/10 border border-white/10 text-gray-300 hover:text-white hover:bg-white/20'
              ]"
            >
              Todas
            </button>
            <button 
              v-for="sub in subcategoriasGastroDisponiblesMenu" 
              :key="sub" 
              @click="subcategoriaActivaGastro = sub"
              :class="[
                'whitespace-nowrap uppercase tracking-widest text-[10px] px-4 py-2 rounded-xl transition-all duration-300 font-medium',
                subcategoriaActivaGastro === sub 
                  ? 'bg-[#D4AF37]/80 text-black shadow-sm' 
                  : 'bg-white/10 border border-white/10 text-gray-300 hover:text-white hover:bg-white/20'
              ]"
            >
              {{ obtenerNombreSubcategoria(sub) }}
            </button>
          </div>

          <div v-if="cargandoGastro" class="text-center py-20 text-neutral-500 animate-pulse text-xs uppercase tracking-widest">Cargando Menús...</div>
          
          <div v-else class="space-y-10">
            <div v-if="gastroFiltrados.length === 0" class="text-center py-20 text-neutral-500 border border-dashed border-white/10 rounded-3xl">
              No se encontraron platos con ese filtro.
            </div>
            
            <div v-for="(subcategorias, categoriaId) in menuAgrupado" :key="categoriaId" class="mb-10">
              <h2 class="text-2xl md:text-3xl font-serif text-[#D4AF37] mb-6 border-b border-[#D4AF37]/20 pb-3">{{ obtenerNombreCategoria(categoriaId) }}</h2>
              
              <div v-for="(platos, subcategoriaId) in subcategorias" :key="subcategoriaId" class="mb-8 last:mb-0">
                <h3 v-if="subcategoriaId !== 'general' && subcategoriaId !== 'null'" class="text-sm md:text-base text-white/80 font-bold uppercase tracking-[0.15em] mb-4 pl-2 border-l-2 border-[#D4AF37]">
                  {{ obtenerNombreSubcategoria(subcategoriaId) }}
                </h3>
                
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  <div v-for="item in platos" :key="item.id" class="bg-neutral-900 border border-white/5 rounded-3xl p-4 md:p-5 hover:border-[#D4AF37]/20 transition-all relative flex flex-col justify-between">
                    <div>
                      <div class="flex justify-between items-start mb-4 border-b border-white/10 pb-4">
                        <div class="pr-2">
                          <h3 class="text-white font-serif text-lg md:text-xl leading-tight">{{ formatoTitulo(item.nombre) }}</h3>
                          <p v-if="item.nombre_en" class="text-neutral-500 text-[10px] italic mt-1">{{ formatoTitulo(item.nombre_en) }}</p>
                        </div>
                        <span class="bg-black/60 backdrop-blur-md px-2 py-1 md:px-3 rounded-full border border-white/10 text-[10px] text-[#D4AF37] font-bold tracking-tighter whitespace-nowrap">${{ item.precio }}</span>
                      </div>
                      
                      <div class="space-y-2 mb-6">
                        <p v-if="item.descripcion" class="text-gray-400 text-[10px] md:text-xs line-clamp-2">{{ formatoParrafo(item.descripcion) }}</p>
                        <div class="flex flex-wrap gap-2 text-[8px] text-white font-bold uppercase tracking-widest mt-3">
                          <span class="bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-1 rounded-sm">{{ item.local ? item.local.replace(/-/g, ' ').replace(/,/g, ' | ') : 'Global' }}</span>
                          <span class="bg-white/10 px-2 py-1 rounded-sm">{{ obtenerNombreCategoria(item.categoria) }}</span>
                          <span v-if="item.subcategoria" class="bg-white/20 text-white px-2 py-1 rounded-sm">{{ obtenerNombreSubcategoria(item.subcategoria) }}</span>
                          <span v-if="item.etiqueta" class="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-sm">{{ item.etiqueta }}</span>
                        </div>
                      </div>
                    </div>

                    <div class="flex gap-2 mt-auto pt-4 border-t border-white/5">
                      <button @click="openGastroForm(item)" class="flex-1 p-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all">Editar</button>
                      <button @click="deleteProductoGastro(item)" class="p-2 border border-red-500/30 text-red-500 hover:bg-red-500/10 rounded-xl text-[10px] font-bold uppercase transition-all">Eliminar</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="pestañaActiva === 'estadisticas'">
          <div class="max-w-5xl mx-auto space-y-8">
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
              <div class="bg-neutral-900 p-5 md:p-6 rounded-3xl border border-white/5 flex flex-col justify-between h-32 md:h-40">
                <span class="text-[10px] md:text-xs text-neutral-400 uppercase tracking-widest font-bold">Total Catálogo</span>
                <span class="text-4xl md:text-5xl font-serif text-white">{{ stats.total }}</span>
              </div>
              <div class="bg-neutral-900 p-5 md:p-6 rounded-3xl border border-[#D4AF37]/20 flex flex-col justify-between h-32 md:h-40">
                <span class="text-[10px] md:text-xs text-[#D4AF37]/70 uppercase tracking-widest font-bold">Total Pinturas</span>
                <span class="text-4xl md:text-5xl font-serif text-[#D4AF37]">{{ stats.pinturas }}</span>
              </div>
              <div class="bg-neutral-900 p-5 md:p-6 rounded-3xl border border-white/5 flex flex-col justify-between h-32 md:h-40">
                <span class="text-[10px] md:text-xs text-neutral-400 uppercase tracking-widest font-bold">Total Esculturas</span>
                <span class="text-4xl md:text-5xl font-serif text-white">{{ stats.esculturas }}</span>
              </div>
            </div>

            <div class="bg-neutral-900 border border-white/5 rounded-3xl p-5 md:p-8">
              <h3 class="text-base md:text-lg font-serif text-white mb-6 border-b border-white/10 pb-4">Registro de Modificaciones</h3>
              <div v-if="logsActividad.length > 0" class="space-y-4">
                <div v-for="(log, index) in logsActividad" :key="index" class="flex flex-col sm:flex-row sm:justify-between sm:items-center p-4 bg-white/5 rounded-xl border border-white/5 gap-4">
                  <div class="flex items-center gap-4">
                    <span class="text-xl">{{ log.accion === 'Creación' ? '✨' : '📝' }}</span>
                    <div>
                      <p class="text-xs md:text-sm text-white font-bold">{{ log.accion }} de Obra</p>
                      <p class="text-[10px] md:text-xs text-neutral-400">{{ formatoTitulo(log.titulo) }}</p>
                    </div>
                  </div>
                  <div class="sm:text-right flex sm:block justify-between items-center border-t border-white/5 sm:border-0 pt-2 sm:pt-0">
                    <p class="text-[10px] text-[#D4AF37] uppercase tracking-widest font-bold">{{ log.fechaFormateada }}</p>
                    <p class="text-[10px] text-neutral-500 uppercase">{{ log.horaFormateada }}</p>
                  </div>
                </div>
              </div>
              <div v-else class="text-center text-neutral-500 text-xs md:text-sm py-4">
                Aún no hay registros de actividad.
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>

    <div v-if="showForm" class="fixed inset-0 bg-black/95 flex items-center justify-center p-2 md:p-4 z-[1001] backdrop-blur-lg">
      <div class="bg-neutral-900 border border-white/10 w-full max-w-4xl rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-2xl overflow-y-auto max-h-[95vh] md:max-h-[90vh]">
        <h2 class="text-xl md:text-2xl font-serif text-[#D4AF37] mb-6 uppercase tracking-tighter">{{ obraEditandoId ? 'Editar Obra' : 'Nueva Obra' }}</h2>
        <form @submit.prevent="guardarObra" class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="p-4 border-2 border-dashed border-white/10 rounded-xl text-center bg-white/5 relative hover:border-[#D4AF37]/30 flex flex-col items-center justify-center min-h-[80px] md:min-h-[100px]">
              <input type="file" @change="(e) => handleImageChange(e, 1)" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer">
              <span class="text-lg mb-1">{{ imgFiles[1] ? '✅' : '📷' }}</span>
              <p class="text-[8px] uppercase tracking-widest text-neutral-400">{{ imgFiles[1] ? imgFiles[1].name : (form.imagen_1 ? 'Cambiar Foto 1' : 'Foto Principal') }}</p>
            </div>
            <div class="p-4 border-2 border-dashed border-white/10 rounded-xl text-center bg-white/5 relative hover:border-[#D4AF37]/30 flex flex-col items-center justify-center min-h-[80px] md:min-h-[100px]">
              <input type="file" @change="(e) => handleImageChange(e, 2)" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer">
              <span class="text-lg mb-1">{{ imgFiles[2] ? '✅' : '📷' }}</span>
              <p class="text-[8px] uppercase tracking-widest text-neutral-400">{{ imgFiles[2] ? imgFiles[2].name : (form.imagen_2 ? 'Cambiar Foto 2' : 'Foto Detalle A') }}</p>
            </div>
            <div class="p-4 border-2 border-dashed border-white/10 rounded-xl text-center bg-white/5 relative hover:border-[#D4AF37]/30 flex flex-col items-center justify-center min-h-[80px] md:min-h-[100px]">
              <input type="file" @change="(e) => handleImageChange(e, 3)" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer">
              <span class="text-lg mb-1">{{ imgFiles[3] ? '✅' : '📷' }}</span>
              <p class="text-[8px] uppercase tracking-widest text-neutral-400">{{ imgFiles[3] ? imgFiles[3].name : (form.imagen_3 ? 'Cambiar Foto 3' : 'Foto Detalle B') }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <select v-model="form.tipo" class="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none text-xs md:text-sm focus:border-[#D4AF37]/50 uppercase appearance-none text-white cursor-pointer" required>
              <option value="" disabled class="bg-neutral-900 text-neutral-500">TIPO DE OBRA...</option>
              <option value="Pintura" class="bg-neutral-900">PINTURA</option>
              <option value="Escultura" class="bg-neutral-900">ESCULTURA</option>
            </select>
            <input v-model="form.autor" placeholder="AUTOR" class="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none text-xs md:text-sm text-white focus:border-[#D4AF37]/50 uppercase" required>
            <input v-model="form.precio" placeholder="PRECIO (EJ: 5,500)" class="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none text-xs md:text-sm text-white focus:border-[#D4AF37]/50 uppercase" required>
          </div>
          
          <input v-model="form.medidas" placeholder="DIMENSIONES (EJ: 120 X 80 CM)" class="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none text-xs md:text-sm text-white focus:border-[#D4AF37]/50 uppercase" required>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 border-t border-white/10 pt-6">
            
            <div class="space-y-3 bg-white/5 p-4 rounded-xl border border-white/5">
              <h4 class="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-2"><span class="text-lg">🇪🇸</span> ESPAÑOL</h4>
              <input v-model="form.titulo" placeholder="TÍTULO" class="w-full bg-black/50 border border-white/10 p-3 rounded-lg outline-none text-xs md:text-sm text-white focus:border-[#D4AF37]/50 uppercase" required>
              <input v-model="form.tecnica" placeholder="TÉCNICA (EJ: ÓLEO)" class="w-full bg-black/50 border border-white/10 p-3 rounded-lg outline-none text-xs md:text-sm text-white focus:border-[#D4AF37]/50 uppercase" required>
            </div>

            <div class="space-y-3 bg-white/5 p-4 rounded-xl border border-white/5">
              <h4 class="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-2"><span class="text-lg">🇺🇸</span> ENGLISH</h4>
              <input v-model="form.titulo_en" placeholder="TITLE" class="w-full bg-black/50 border border-white/10 p-3 rounded-lg outline-none text-xs md:text-sm text-[#D4AF37] focus:border-[#D4AF37]/50 uppercase italic" required>
              <input v-model="form.medidas_en" placeholder="TECHNIQUE (OIL)" class="w-full bg-black/50 border border-white/10 p-3 rounded-lg outline-none text-xs md:text-sm text-[#D4AF37] focus:border-[#D4AF37]/50 uppercase italic" required>
            </div>

            <div class="space-y-3 bg-white/5 p-4 rounded-xl border border-white/5">
              <h4 class="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-2"><span class="text-lg">🇫🇷</span> FRANÇAIS</h4>
              <input v-model="form.titulo_fr" placeholder="TITRE" class="w-full bg-black/50 border border-white/10 p-3 rounded-lg outline-none text-xs md:text-sm text-white focus:border-[#D4AF37]/50 uppercase">
              <input v-model="form.medidas_fr" placeholder="TECHNIQUE" class="w-full bg-black/50 border border-white/10 p-3 rounded-lg outline-none text-xs md:text-sm text-white focus:border-[#D4AF37]/50 uppercase">
            </div>

            <div class="space-y-3 bg-white/5 p-4 rounded-xl border border-white/5">
              <h4 class="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-2"><span class="text-lg">🇯🇵</span> 日本語</h4>
              <input v-model="form.titulo_ja" placeholder="タイトル" class="w-full bg-black/50 border border-white/10 p-3 rounded-lg outline-none text-xs md:text-sm text-white focus:border-[#D4AF37]/50 uppercase">
              <input v-model="form.medidas_ja" placeholder="手法" class="w-full bg-black/50 border border-white/10 p-3 rounded-lg outline-none text-xs md:text-sm text-white focus:border-[#D4AF37]/50 uppercase">
            </div>

          </div>

          <div class="flex gap-3 md:gap-4 mt-8">
            <button type="submit" class="flex-1 bg-[#D4AF37] text-black font-bold py-3 md:py-4 rounded-xl hover:bg-yellow-600 disabled:bg-neutral-700 text-[10px] md:text-xs uppercase tracking-widest transition-colors" :disabled="enviando">
              {{ enviando ? 'PROCESANDO...' : (obraEditandoId ? 'ACTUALIZAR' : 'PUBLICAR') }}
            </button>
            <button @click="showForm = false" type="button" class="w-1/3 bg-red-500/10 py-3 md:py-4 rounded-xl text-[10px] md:text-xs uppercase text-red-500 font-bold tracking-widest hover:bg-red-500/20 transition-colors">CANCELAR</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showGastroForm" class="fixed inset-0 bg-black/95 flex items-center justify-center p-2 md:p-4 z-[1001] backdrop-blur-lg">
      <div class="bg-neutral-900 border border-white/10 w-full max-w-4xl rounded-2xl md:rounded-3xl p-5 md:p-8 shadow-2xl overflow-y-auto max-h-[95vh] md:max-h-[90vh]">
        <h2 class="text-xl md:text-2xl font-serif text-[#D4AF37] mb-6 uppercase tracking-tighter">{{ gastroEditandoId ? 'Editar Plato' : 'Nuevo Plato' }}</h2>
        
        <form @submit.prevent="guardarGastro" class="space-y-6">
          
          <div v-if="rolUsuario === 'superadmin'" class="w-full bg-white/5 border border-white/10 p-3 rounded-xl flex flex-col justify-center gap-2 mb-3">
            <span class="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">LOCALES (Múltiple)</span>
            <div class="flex flex-wrap gap-3">
              <label class="flex items-center gap-1.5 cursor-pointer text-xs md:text-sm text-white uppercase">
              <input type="checkbox" v-model="formGastro.locales" value="chao-cafe" class="accent-[#D4AF37] w-3 h-3"> CHAO CAFE
              </label>
              <label class="flex items-center gap-1.5 cursor-pointer text-xs md:text-sm text-white uppercase">
              <input type="checkbox" v-model="formGastro.locales" value="chao-pescado" class="accent-[#D4AF37] w-3 h-3"> CHAO PESCAO
              </label>
              <label class="flex items-center gap-1.5 cursor-pointer text-xs md:text-sm text-white uppercase">
              <input type="checkbox" v-model="formGastro.locales" value="sky-bar" class="accent-[#D4AF37] w-3 h-3"> SKY BAR
              </label>
            </div>
          </div>
          <div v-else class="w-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 p-3 rounded-xl mb-3">
            <span class="text-[10px] text-[#D4AF37] uppercase tracking-widest font-bold">Bloqueado a tu sede: {{ localAsignado ? localAsignado.replace(/-/g, ' ') : '' }}</span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
            
            <select v-model="formGastro.categoria" @change="formGastro.subcategoria = ''" class="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none text-xs md:text-sm focus:border-[#D4AF37]/50 uppercase appearance-none text-white cursor-pointer" required>
              <option value="" disabled class="bg-neutral-900 text-neutral-500">CATEGORÍA...</option>
              <option v-for="cat in categoriasDisponibles" :key="cat.id" :value="cat.id" class="bg-neutral-900">{{ cat.nombre }}</option>
            </select>
            
            <select v-if="subcategoriasDisponibles.length > 0" v-model="formGastro.subcategoria" class="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none text-xs md:text-sm focus:border-[#D4AF37]/50 uppercase appearance-none text-white cursor-pointer" required>
              <option value="" disabled class="bg-neutral-900 text-neutral-500">SUBCATEGORÍA...</option>
              <option v-for="sub in subcategoriasDisponibles" :key="sub.id" :value="sub.id" class="bg-neutral-900">{{ sub.nombre }}</option>
            </select>

            <input v-model.number="formGastro.precio" type="number" placeholder="PRECIO (NÚMEROS)" class="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none text-xs md:text-sm text-white focus:border-[#D4AF37]/50 uppercase" required>
          </div>
          
          <input v-model="formGastro.etiqueta" placeholder="ETIQUETA (EJ: NUEVO, RECOMENDADO)" class="w-full bg-white/5 border border-white/10 p-3 rounded-xl outline-none text-xs md:text-sm text-white focus:border-[#D4AF37]/50 uppercase">

          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 border-t border-white/10 pt-6">
            
            <div class="space-y-3 bg-white/5 p-4 rounded-xl border border-white/5">
              <h4 class="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-2"><span class="text-lg">🇪🇸</span> ESPAÑOL</h4>
              <input v-model="formGastro.nombre" placeholder="NOMBRE DEL PLATO" class="w-full bg-black/50 border border-white/10 p-3 rounded-lg outline-none text-xs md:text-sm text-white focus:border-[#D4AF37]/50 uppercase" required>
              <textarea v-model="formGastro.descripcion" placeholder="DESCRIPCIÓN" rows="2" class="w-full bg-black/50 border border-white/10 p-3 rounded-lg outline-none text-xs md:text-sm text-white focus:border-[#D4AF37]/50 uppercase resize-none"></textarea>
            </div>

            <div class="space-y-3 bg-white/5 p-4 rounded-xl border border-white/5">
              <h4 class="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-2"><span class="text-lg">🇺🇸</span> ENGLISH</h4>
              <input v-model="formGastro.nombre_en" placeholder="DISH NAME" class="w-full bg-black/50 border border-white/10 p-3 rounded-lg outline-none text-xs md:text-sm text-[#D4AF37] focus:border-[#D4AF37]/50 uppercase italic">
              <textarea v-model="formGastro.descripcion_en" placeholder="DESCRIPTION" rows="2" class="w-full bg-black/50 border border-white/10 p-3 rounded-lg outline-none text-xs md:text-sm text-[#D4AF37] focus:border-[#D4AF37]/50 uppercase italic resize-none"></textarea>
            </div>

            <div class="space-y-3 bg-white/5 p-4 rounded-xl border border-white/5">
              <h4 class="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-2"><span class="text-lg">🇫🇷</span> FRANÇAIS</h4>
              <input v-model="formGastro.nombre_fr" placeholder="NOM DU PLAT" class="w-full bg-black/50 border border-white/10 p-3 rounded-lg outline-none text-xs md:text-sm text-white focus:border-[#D4AF37]/50 uppercase">
              <textarea v-model="formGastro.descripcion_fr" placeholder="DESCRIPTION" rows="2" class="w-full bg-black/50 border border-white/10 p-3 rounded-lg outline-none text-xs md:text-sm text-white focus:border-[#D4AF37]/50 uppercase resize-none"></textarea>
            </div>

            <div class="space-y-3 bg-white/5 p-4 rounded-xl border border-white/5">
              <h4 class="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-2"><span class="text-lg">🇯🇵</span> 日本語</h4>
              <input v-model="formGastro.nombre_ja" placeholder="料理の名前" class="w-full bg-black/50 border border-white/10 p-3 rounded-lg outline-none text-xs md:text-sm text-white focus:border-[#D4AF37]/50 uppercase">
              <textarea v-model="formGastro.descripcion_ja" placeholder="説明" rows="2" class="w-full bg-black/50 border border-white/10 p-3 rounded-lg outline-none text-xs md:text-sm text-white focus:border-[#D4AF37]/50 uppercase resize-none"></textarea>
            </div>

          </div>

          <div class="flex gap-3 md:gap-4 mt-8">
            <button type="submit" class="flex-1 bg-[#D4AF37] text-black font-bold py-3 md:py-4 rounded-xl hover:bg-yellow-600 disabled:bg-neutral-700 text-[10px] md:text-xs uppercase tracking-widest transition-colors" :disabled="enviandoGastro">
              {{ enviandoGastro ? 'PROCESANDO...' : (gastroEditandoId ? 'ACTUALIZAR PLATO' : 'PUBLICAR PLATO') }}
            </button>
            <button @click="showGastroForm = false" type="button" class="w-1/3 bg-red-500/10 py-3 md:py-4 rounded-xl text-[10px] md:text-xs uppercase text-red-500 font-bold tracking-widest hover:bg-red-500/20 transition-colors">CANCELAR</button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="mostrandoModalQR" class="fixed inset-0 bg-black/95 flex items-center justify-center p-4 z-[1001] backdrop-blur-lg">
      <div class="bg-neutral-900 border border-white/10 w-full max-w-md rounded-3xl p-6 md:p-8 shadow-2xl relative">
        <button @click="mostrandoModalQR = false" class="absolute top-4 right-4 text-neutral-500 hover:text-white text-xl">✕</button>

        <h2 class="text-xl font-serif text-[#D4AF37] mb-6 uppercase tracking-widest text-center">
          {{ nuevoQRGuardado ? 'QR Generado' : (qrEditandoId ? 'Editar Punto de Control' : 'Crear Punto de Control') }}
        </h2>

        <form v-if="!nuevoQRGuardado" @submit.prevent="generarYGuardarQR" class="space-y-4">
          <div>
            <label class="block text-[10px] uppercase tracking-widest text-neutral-400 mb-2">Nombre del Punto (Ej: Puerta Principal, Pasillo 2)</label>
            <input v-model="formQR.nombre" type="text" required class="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#D4AF37] transition-colors uppercase text-sm">
          </div>

          <div>
            <label class="block text-[10px] uppercase tracking-widest text-neutral-400 mb-2">Piso / Nivel</label>
            <input v-model="formQR.piso" type="number" required class="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-[#D4AF37] transition-colors text-sm">
          </div>

          <div class="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10 mt-2">
            <input v-model="formQR.es_punto_final" type="checkbox" id="esFinal" class="w-4 h-4 accent-[#D4AF37]">
            <label for="esFinal" class="text-xs text-white uppercase tracking-widest cursor-pointer leading-tight">
              Marcar como Punto Final <br>
              <span class="text-[9px] text-neutral-500">Al escanearlo, inicia la hora de descanso.</span>
            </label>
          </div>

          <button type="submit" :disabled="generandoQR" class="w-full bg-[#D4AF37] text-black font-bold py-4 rounded-xl hover:bg-yellow-600 disabled:opacity-50 text-xs uppercase tracking-widest transition-colors mt-6 shadow-[0_0_15px_rgba(212,175,55,0.3)]">
            {{ generandoQR ? 'Procesando...' : (qrEditandoId ? 'Actualizar Punto' : 'Generar Código QR') }}
          </button>
        </form>

        <div v-else class="flex flex-col items-center">
          <div class="bg-white p-4 rounded-xl mb-4 qr-container">
            <qrcode-vue :value="nuevoQRGuardado.codigo_qr" :size="200" level="H" />
          </div>
          <p class="text-white text-sm font-bold uppercase tracking-widest text-center">{{ nuevoQRGuardado.nombre }}</p>
          <p class="text-neutral-400 text-xs uppercase tracking-widest mt-1">Piso {{ nuevoQRGuardado.piso }}</p>
          
          <span v-if="nuevoQRGuardado.es_punto_final" class="mt-3 bg-red-500/20 text-red-500 border border-red-500/50 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
            Punto de Descanso
          </span>

          <div class="flex gap-3 w-full mt-8">
            <button @click="imprimirQRActual" class="flex-1 bg-[#D4AF37] text-black font-bold py-3 rounded-xl hover:bg-yellow-600 text-[10px] uppercase tracking-widest shadow-lg flex items-center justify-center gap-2">
              <span class="text-base">🖨️</span> Imprimir
            </button>
            <button @click="abrirModalQR()" class="flex-1 bg-white/10 text-white font-bold py-3 rounded-xl hover:bg-white/20 text-[10px] uppercase tracking-widest">
              Crear Otro
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive, watch, onUnmounted } from 'vue'
import { supabase } from '../lib/supabase' 
import { useRouter } from 'vue-router'
import QrcodeVue from 'qrcode.vue'

const router = useRouter()
const pestañaActiva = ref('inventario')
const searchQuery = ref('')
const menuAbierto = ref(false) 

// ESTADOS DE SEGURIDAD GENERALES
const rolUsuario = ref('superadmin') 
const localAsignado = ref(null)

// ============================================
// NUEVO: ESTADOS Y LÓGICA DE SEGURIDAD (VIGILANTES)
// ============================================
const registrosSeguridad = ref([])
const cargandoSeguridad = ref(false)
const statsSeguridad = reactive({ totalEscaneos: 0, observaciones: 0 })
const puntosDeControl = ref([])

const fetchPuntosControl = async () => {
  const { data, error } = await supabase.from('puntos_control').select('*').order('created_at', { ascending: false })
  if (!error) puntosDeControl.value = data || []
}

const fetchSeguridad = async () => {
  cargandoSeguridad.value = true
  
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
  cargandoSeguridad.value = false
}

const formatearHora = (fechaISO) => {
  if (!fechaISO) return 'Sin hora'
  return new Date(fechaISO).toLocaleTimeString('es-CO', { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: true 
  })
}

// CAJA REGISTRADORA Y NUEVO FILTRO DE ESTADO
const ordenesCaja = ref([])
const cargandoCaja = ref(false)
const estadoCaja = ref('pendiente') 
let subscripcionPos = null 
const ordenesImpresas = new Set() 

// GALERÍA DE ARTE 
const todasLasObras = ref([])
const cargando = ref(true)
const showForm = ref(false)
const enviando = ref(false)
const obraEditandoId = ref(null)

const imgFiles = reactive({ 1: null, 2: null, 3: null })

const form = ref({
  titulo: '', titulo_en: '', titulo_fr: '', titulo_ja: '',
  autor: '', precio: '', tecnica: '', medidas_en: '', medidas_fr: '', medidas_ja: '',
  medidas: '', tipo: '', imagen_1: null, imagen_2: null, imagen_3: null
})

const stats = reactive({ total: 0, pinturas: 0, esculturas: 0 })
const logsActividad = ref([])

// ESTADOS MÉTRICAS POS
const statsPos = reactive({ totalVentasDia: 0, totalMesasDia: 0, desgloseMeseras: [] })
const cargandoStatsPos = ref(false)

// ESTADO PARA EL FILTRO DE FECHA
const getHoyStr = () => {
  const d = new Date()
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')
}
const fechaFiltroMetricas = ref(getHoyStr())
const fechaFiltroSeguridad = ref(getHoyStr()) 

// GASTRONOMÍA 
const todosLosPlatos = ref([])
const cargandoGastro = ref(false)
const showGastroForm = ref(false)
const enviandoGastro = ref(false)
const gastroEditandoId = ref(null)

// ESTADOS PARA FILTROS POR TARJETAS EN GASTRONOMÍA
const categoriaActivaGastro = ref('todas')
const subcategoriaActivaGastro = ref('todas')

watch(categoriaActivaGastro, () => {
  subcategoriaActivaGastro.value = 'todas'
})

const copyRigid = true

const categoriasDisponibles = [
  { id: 'entraditas', nombre: 'ENTRADITAS' },
  { id: 'restaurante', nombre: 'RESTAURANTE' },
  { id: 'licores', nombre: 'LICORES' },
  { id: 'bebidas', nombre: 'BEBIDAS' },
  { id: 'postres', nombre: 'POSTRES' }
]

const subcategoriasDisponibles = computed(() => {
  if (formGastro.value.categoria === 'restaurante') {
    return [
      { id: 'entradas', nombre: 'ENTRADAS' }, { id: 'cremas', nombre: 'CREMAS' }, { id: 'ensaladas', nombre: 'ENSALADAS' },
      { id: 'ceviche', nombre: 'CEVICHE' }, { id: 'comida_rapida', nombre: 'COMIDA RÁPIDA' }, { id: 'carnes', nombre: 'CARNES' },
      { id: 'pollo', nombre: 'POLLO' }, { id: 'pescados', nombre: 'PESCADOS' }, { id: 'menu_ejecutivo', nombre: 'MENÚ EJECUTIVO' },
      { id: 'añadidos', nombre: 'AÑADIDOS' }
    ]
  } else if (formGastro.value.categoria === 'licores') {
    return [
      { id: 'cocteles', nombre: 'CÓCTELES' }, { id: 'cervezas', nombre: 'CERVEZAS' },
      { id: 'tragos', nombre: 'TRAGOS' }, { id: 'botellas', nombre: 'BOTELLAS' }
    ]
  } else if (formGastro.value.categoria === 'bebidas') {
    return [
      { id: 'refrescantes', nombre: 'REFRESCANTES' },
      { id: 'calientes', nombre: 'CALIENTES' },
      { id: 'jugos', nombre: 'JUGOS' }
    ]
  }
  return []
})

const formGastro = ref({
  locales: [], 
  categoria: '', subcategoria: '', precio: null, etiqueta: '',
  nombre: '', descripcion: '', nombre_en: '', descripcion_en: '',
  nombre_fr: '', descripcion_fr: '', nombre_ja: '', descripcion_ja: ''
})

const cargarPerfilYDatos = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) { router.push('/login-admin'); return }

  const { data: perfil } = await supabase.from('perfiles').select('*').eq('id', user.id).single()
  if (perfil) {
    rolUsuario.value = perfil.rol
    localAsignado.value = perfil.local_asignado

    if (perfil.rol === 'admin_cafe') {
      pestañaActiva.value = 'caja'
      fetchOrdenesCaja()
      inicializarRealtime() 
      fetchGastronomia()
    } else if (perfil.rol === 'admin_galeria') {
      pestañaActiva.value = 'inventario'
      fetchObras()
    } else if (perfil.rol === 'admin_seguridad') {
      pestañaActiva.value = 'seguridad'
      fetchSeguridad()
    } else {
      // SUPERADMIN carga todo
      pestañaActiva.value = 'inventario'
      fetchObras()
      fetchGastronomia()
      fetchOrdenesCaja()
      fetchSeguridad()
      inicializarRealtime() 
    }
  } else {
      fetchObras()
      fetchGastronomia()
  }
}

const inicializarRealtime = () => {
  if (subscripcionPos) return; 
  subscripcionPos = supabase
    .channel('pos_ordenes_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'pos_ordenes' }, (payload) => {
      
      if (rolUsuario.value === 'admin_cafe' && payload.new && payload.new.local !== localAsignado.value) return;

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

  if (rolUsuario.value === 'admin_cafe' && localAsignado.value) {
    query = query.eq('local', localAsignado.value)
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
  return ordenesCaja.value.filter(orden => orden.estado === 'pagado')
})

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

  if (rolUsuario.value === 'admin_cafe' && localAsignado.value) {
    query = query.eq('local', localAsignado.value)
  }

  const { data, error } = await query
  if (!error && data) {
    statsPos.totalVentasDia = data.reduce((acc, curr) => acc + curr.total, 0)
    statsPos.totalMesasDia = data.length

    const agrupado = {}
    data.forEach(orden => {
      const mesera = orden.perfiles?.nombre || 'Desconocida'
      const nombreMesa = orden.mesa || 'Sin Mesa'

      if(!agrupado[mesera]) {
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
        .sort((a, b) => String(a).localeCompare(String(b), undefined, {numeric: true}))
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
    }).sort((a,b) => b.ventas - a.ventas)
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
      <p>${localAsignado.value ? localAsignado.value.replace(/-/g, ' ') : 'GLOBAL'}</p>
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

const imprimirTicket = (orden, tipo = 'comanda') => {
  const esFactura = tipo === 'factura' || orden.estado === 'pagado';
  const tituloDocumento = esFactura ? 'DOCUMENTO EQUIVALENTE POS' : 'TICKET DE COCINA (COMANDA)';

  let contenido = `
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; color: #000 !important; font-family: Arial, Helvetica, sans-serif !important; font-weight: 700 !important; }
      body { width: 280px; padding: 15px 5px 40px 5px; font-size: 14px; text-transform: uppercase; line-height: 1.4; }
      .header { text-align: center; margin-bottom: 15px; }
      .header h2 { font-size: 22px; margin-bottom: 4px; font-weight: 900 !important; }
      .header p { font-size: 13px; margin-bottom: 3px; }
      .divider { border-top: 2px dashed #000; margin: 15px 0; }
      .info-client p { font-size: 13px; margin-bottom: 4px; }
      table { width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 10px; }
      th { text-align: left; padding-bottom: 10px; border-bottom: 2px dashed #000; }
      td { vertical-align: top; padding-top: 10px; padding-bottom: 5px; }
      .text-right { text-align: right; }
      .total-section { font-size: 20px; font-weight: 900 !important; text-align: right; margin-top: 15px; margin-bottom: 20px; padding: 10px 0; border-top: 2px dashed #000; border-bottom: 2px dashed #000; }
      .footer-info p { font-size: 13px; margin-bottom: 4px; }
      .legal-text { font-size: 11px; text-align: center; margin-top: 30px; font-weight: 600 !important; line-height: 1.3; }
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
      <h2 style="font-size: 24px;">MESA: ${orden.mesa}</h2>
      <h3 style="font-size: 16px; margin-top: 5px;">${orden.local.replace(/-/g, ' ').toUpperCase()}</h3>
      <p style="font-size: 14px; margin-top: 5px; text-decoration: underline;">${tituloDocumento}</p>
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
    contenido += `
      <tr>
        <td><strong style="font-size: 16px;">${item.cantidad}</strong></td>
        <td><strong style="font-size: 16px;">${codigo}${item.menu_gastronomia?.nombre || 'Plato'}</strong></td>
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
      <p style="margin-top: 10px;">*** COPIA DE CLIENTE ***</p>
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

const fetchObras = async () => {
  cargando.value = true
  const { data } = await supabase.from('obras').select('*').order('created_at', { ascending: false })
  todasLasObras.value = data || []
  cargando.value = false
  calcularEstadisticas()
}

const calcularEstadisticas = () => {
  stats.total = todasLasObras.value.length
  stats.pinturas = todasLasObras.value.filter(o => o.tipo === 'Pintura').length
  stats.esculturas = todasLasObras.value.filter(o => o.tipo === 'Escultura').length

  const ultimas = [...todasLasObras.value].slice(0, 5)
  logsActividad.value = ultimas.map(obra => {
    const fecha = new Date(obra.created_at || Date.now())
    return { accion: 'Creación', titulo: obra.titulo, fechaFormateada: fecha.toLocaleDateString(), horaFormateada: fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  })
}

const obrasFiltradas = computed(() => {
  const query = searchQuery?.value ? searchQuery.value.toLowerCase().trim() : ''
  if (!query) return todasLasObras.value
  return todasLasObras.value.filter(o => o.titulo.toLowerCase().includes(query) || (o.titulo_en && o.titulo_en.toLowerCase().includes(query)) || o.autor.toLowerCase().includes(query))
})

const handleImageChange = (e, index) => {
  const file = e.target.files[0]
  if (file) imgFiles[index] = file
}

const openForm = (obra = null) => {
  imgFiles[1] = null; imgFiles[2] = null; imgFiles[3] = null;
  if (obra) {
    obraEditandoId.value = obra.id
    form.value = { ...obra, titulo_fr: obra.titulo_fr || '', titulo_ja: obra.titulo_ja || '', medidas_fr: obra.medidas_fr || '', medidas_ja: obra.medidas_ja || '' }
  } else {
    obraEditandoId.value = null
    form.value = { titulo: '', titulo_en: '', titulo_fr: '', titulo_ja: '', autor: '', precio: '', tecnica: '', medidas_en: '', medidas_fr: '', medidas_ja: '', medidas: '', tipo: '', imagen_1: null, imagen_2: null, imagen_3: null }
  }
  showForm.value = true
}

const uploadImageAndGetUrl = async (file) => {
  if (!file) return null
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
  const { error: uploadError } = await supabase.storage.from('obras-imagenes').upload(fileName, file)
  if (uploadError) throw uploadError
  const { data: { publicUrl } } = supabase.storage.from('obras-imagenes').getPublicUrl(fileName)
  return publicUrl
}

const formatoTitulo = (texto) => {
  if (typeof texto !== 'string' || !texto) return '';
  const menores = ['de', 'del', 'con', 'y', 'e', 'o', 'u', 'el', 'la', 'los', 'las', 'en', 'por', 'un', 'una', 'unos', 'unas', 'a', 'al', 'with', 'and', 'of', 'in', 'the', 'et', 'au', 'aux', 'à'];
  return texto.trim().toLowerCase().split(/\s+/).map((word, index) => {
    if (index > 0 && menores.includes(word)) return word;
    return word.charAt(0).toUpperCase() + word.slice(1);
  }).join(' ');
}

const formatoParrafo = (texto) => {
  if (typeof texto !== 'string' || !texto) return '';
  const t = texto.trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
}

const guardarObra = async () => {
  enviando.value = true
  try {
    let url1 = imgFiles[1] ? await uploadImageAndGetUrl(imgFiles[1]) : form.value.imagen_1
    let url2 = imgFiles[2] ? await uploadImageAndGetUrl(imgFiles[2]) : form.value.imagen_2
    let url3 = imgFiles[3] ? await uploadImageAndGetUrl(imgFiles[3]) : form.value.imagen_3

    const payload = { ...form.value, imagen_1: url1, imagen_2: url2, imagen_3: url3 }
    
    payload.titulo = formatoTitulo(payload.titulo)
    payload.autor = formatoTitulo(payload.autor)
    payload.tecnica = formatoTitulo(payload.tecnica)
    if(payload.titulo_en) payload.titulo_en = formatoTitulo(payload.titulo_en)
    if(payload.titulo_fr) payload.titulo_fr = formatoTitulo(payload.titulo_fr)
    if(payload.titulo_ja) payload.titulo_ja = payload.titulo_ja.trim()

    delete payload.id; delete payload.created_at;

    if (obraEditandoId.value) {
      const { error } = await supabase.from('obras').update(payload).eq('id', obraEditandoId.value)
      if (error) throw error
    } else {
      if (!url1) throw new Error("Debes subir al menos la Foto Principal (Foto 1).")
      const { error } = await supabase.from('obras').insert([payload])
      if (error) throw error
    }
    
    alert("¡Obra procesada con éxito!")
    showForm.value = false
    fetchObras()
  } catch (err) { alert("Error de subida: " + err.message); console.error(err) } finally { enviando.value = false }
}

const deleteObra = async (obra) => {
  if (confirm(`¿Peligro: Eliminar definitivamente la obra "${obra.titulo}"?`)) {
    await supabase.from('obras').delete().eq('id', obra.id)
    fetchObras()
  }
}

const fetchGastronomia = async () => {
  cargandoGastro.value = true
  let query = supabase.from('menu_gastronomia').select('*').order('created_at', { ascending: false })
  
  if (rolUsuario.value === 'admin_cafe' && localAsignado.value) {
    query = query.ilike('local', `%${localAsignado.value}%`)
  }
  
  const { data } = await query
  todosLosPlatos.value = data || []
  
  if (todosLosPlatos.value.length > 0 && categoriaActivaGastro.value === 'todas') {
      categoriaActivaGastro.value = 'todas';
  }
  cargandoGastro.value = false
}

const categoriasGastroDisponiblesMenu = computed(() => {
  let cat = [...new Set(todosLosPlatos.value.map(item => item.categoria).filter(Boolean))]
  const ordenTarjetas = ['bebidas', 'entraditas', 'restaurante', 'postres', 'licores']
  cat.sort((a, b) => {
    let indexA = ordenTarjetas.indexOf(a)
    let indexB = ordenTarjetas.indexOf(b)
    if (indexA === -1) indexA = 999
    if (indexB === -1) indexB = 999
    return indexA - indexB
  })
  return cat
})

const subcategoriasGastroDisponiblesMenu = computed(() => {
  if (!categoriaActivaGastro.value || categoriaActivaGastro.value === 'todas') return []
  const itemsDeCategoria = todosLosPlatos.value.filter(item => item.categoria === categoriaActivaGastro.value)
  let sub = [...new Set(itemsDeCategoria.map(item => item.subcategoria).filter(Boolean))]
  
  const ordenEstricto = [
    'entradas', 'cremas', 'ensaladas', 'ceviche', 'comida_rapida', 'carnes', 'pollo', 'pescados', 'menu_ejecutivo', 'añadidos',
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

const gastroFiltrados = computed(() => {
  let filtrados = todosLosPlatos.value
  
  if (categoriaActivaGastro.value !== 'todas') {
    filtrados = filtrados.filter(item => item.categoria === categoriaActivaGastro.value)
  }
  
  if (subcategoriaActivaGastro.value !== 'todas') {
    filtrados = filtrados.filter(item => item.subcategoria === subcategoriaActivaGastro.value)
  }

  const query = searchQuery?.value ? searchQuery.value.toLowerCase().trim() : ''
  if (query) {
    filtrados = filtrados.filter(o => o.nombre.toLowerCase().includes(query) || (o.nombre_en && o.nombre_en.toLowerCase().includes(query)) || o.categoria.toLowerCase().includes(query))
  }
  
  return filtrados
})

const menuAgrupado = computed(() => {
  const agrupado = {}
  gastroFiltrados.value.forEach(item => {
    const cat = item.categoria || 'otros'
    const sub = item.subcategoria || 'general'
    
    if (!agrupado[cat]) agrupado[cat] = {}
    if (!agrupado[cat][sub]) agrupado[cat][sub] = []
    
    agrupado[cat][sub].push(item)
  })
  return agrupado
})

const obtenerNombreCategoria = (id) => {
  const cat = categoriasDisponibles.find(c => c.id === id)
  return cat ? cat.nombre : id
}

const obtenerNombreSubcategoria = (id) => {
  const todasSubcategorias = [
    { id: 'entradas', nombre: 'ENTRADAS' }, { id: 'cremas', nombre: 'CREMAS' }, { id: 'ensaladas', nombre: 'ENSALADAS' },
    { id: 'ceviche', nombre: 'CEVICHE' }, { id: 'comida_rapida', nombre: 'COMIDA RÁPIDA' }, { id: 'carnes', nombre: 'CARNES' },
    { id: 'pollo', nombre: 'POLLO' }, { id: 'pescados', nombre: 'PESCADOS' }, { id: 'menu_ejecutivo', nombre: 'MENÚ EJECUTIVO' },
    { id: 'añadidos', nombre: 'AÑADIDOS' },
    { id: 'cocteles', nombre: 'CÓCTELES' }, { id: 'cervezas', nombre: 'CERVEZAS' },
    { id: 'tragos', nombre: 'TRAGOS' }, { id: 'botellas', nombre: 'BOTELLAS' },
    { id: 'refrescantes', nombre: 'REFRESCANTES' }, { id: 'calientes', nombre: 'CALIENTES' }, { id: 'jugos', nombre: 'JUGOS' }
  ]
  const sub = todasSubcategorias.find(s => s.id === id)
  return sub ? sub.nombre : id
}

const openGastroForm = (item = null) => {
  if (item) {
    gastroEditandoId.value = item.id
    formGastro.value = { 
      ...item,
      locales: item.local ? item.local.split(',').map(l => l.trim()) : [], 
      subcategoria: item.subcategoria || '',
      nombre_en: item.nombre_en || '', descripcion_en: item.descripcion_en || '',
      nombre_fr: item.nombre_fr || '', descripcion_fr: item.descripcion_fr || '',
      nombre_ja: item.nombre_ja || '', descripcion_ja: item.descripcion_ja || ''
    }
  } else {
    gastroEditandoId.value = null
    formGastro.value = {
      locales: [], categoria: '', subcategoria: '', precio: null, etiqueta: '',
      nombre: '', descripcion: '', nombre_en: '', descripcion_en: '',
      nombre_fr: '', descripcion_fr: '', nombre_ja: '', descripcion_ja: ''
    }
  }
  showGastroForm.value = true
}

const guardarGastro = async () => {
  enviandoGastro.value = true
  try {
    const payload = { ...formGastro.value }
    
    if (rolUsuario.value === 'admin_cafe') {
      payload.local = localAsignado.value
    } else {
      if (!payload.locales || payload.locales.length === 0) {
        alert("Por favor, selecciona al menos un establecimiento.")
        enviandoGastro.value = false
        return
      }
      payload.local = payload.locales.join(',')
    }
    delete payload.locales 
    
    if (subcategoriasDisponibles.value.length === 0) {
      payload.subcategoria = null
    } else if (!payload.subcategoria) {
      alert("Debes seleccionar una subcategoría para esta sección.");
      enviandoGastro.value = false;
      return;
    }
    
    payload.nombre = formatoTitulo(payload.nombre)
    payload.descripcion = formatoParrafo(payload.descripcion)
    if(payload.nombre_en) payload.nombre_en = formatoTitulo(payload.nombre_en)
    if(payload.descripcion_en) payload.descripcion_en = formatoParrafo(payload.descripcion_en)
    if(payload.nombre_fr) payload.nombre_fr = formatoTitulo(payload.nombre_fr)
    if(payload.descripcion_fr) payload.descripcion_fr = formatoParrafo(payload.descripcion_fr)
    if(payload.nombre_ja) payload.nombre_ja = payload.nombre_ja.trim()
    if(payload.descripcion_ja) payload.descripcion_ja = payload.descripcion_ja.trim()
    if(payload.etiqueta) payload.etiqueta = formatoTitulo(payload.etiqueta)

    delete payload.id; delete payload.created_at;

    if (gastroEditandoId.value) {
      const { error } = await supabase.from('menu_gastronomia').update(payload).eq('id', gastroEditandoId.value)
      if (error) throw error
    } else {
      const { error } = await supabase.from('menu_gastronomia').insert([payload])
      if (error) throw error
    }
    
    alert("¡Plato procesado con éxito!")
    showGastroForm.value = false
    fetchGastronomia()
  } catch (err) { alert("Error de subida: " + err.message); console.error(err) } finally { enviandoGastro.value = false }
}

const deleteProductoGastro = async (item) => {
  if (confirm(`¿Peligro: Eliminar definitivamente "${item.nombre}"?`)) {
    await supabase.from('menu_gastronomia').delete().eq('id', item.id)
    fetchGastronomia()
  }
}

const handleLogout = async () => {
  await supabase.auth.signOut()
  router.push('/login-privado')
}

// ============================================
// LÓGICA DEL GENERADOR DE CÓDIGOS QR
// ============================================
const mostrandoModalQR = ref(false)
const nuevoQRGuardado = ref(null)
const generandoQR = ref(false)
const qrEditandoId = ref(null)
const formQR = ref({ piso: '', nombre: '', es_punto_final: false })

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
    fetchPuntosControl() // <-- LA LISTA SE ACTUALIZA AQUÍ
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
      <h3 style="margin: 5px 0 15px 0; font-size: 18px;">Punto: ${nuevoQRGuardado.value.nombre} (Piso ${nuevoQRGuardado.value.piso})</h3>
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
  cargarPerfilYDatos()
  fetchPuntosControl() // <-- Y AQUÍ CARGA LOS QR AL INICIAR
})

onUnmounted(() => {
  if (subscripcionPos) {
    supabase.removeChannel(subscripcionPos)
    subscripcionPos = null
  }
})
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(1);
  cursor: pointer;
}
</style>