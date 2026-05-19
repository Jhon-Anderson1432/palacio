<template>
  <div class="fixed inset-0 z-[999] bg-[#0a0a0a] overflow-y-auto text-white font-sans flex">
    
    <div v-if="menuAbierto" @click="menuAbierto = false" class="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm transition-opacity"></div>

    <aside :class="['w-64 bg-black border-r border-white/10 p-6 md:p-8 flex flex-col fixed top-0 left-0 bottom-0 md:relative z-50 transition-transform duration-300', menuAbierto ? 'translate-x-0' : '-translate-x-full md:translate-x-0']">
      
      <div class="flex items-center justify-between gap-3 mb-10 text-[#D4AF37]">
        <span class="font-serif text-xl tracking-tighter uppercase">Palacio Admin</span>
        <button @click="menuAbierto = false" class="md:hidden text-white/50 hover:text-white p-2">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
      </div>
      
      <nav class="space-y-4 flex-1 overflow-y-auto hide-scrollbar">
        <div v-if="rolUsuario === 'admin_galeria' || rolUsuario === 'superadmin'" class="space-y-4">
          <button
            @click="pestañaActiva = 'inventario'; menuAbierto = false"
            :class="['w-full p-3 rounded-xl flex items-center gap-3 transition-all', pestañaActiva === 'inventario' ? 'text-[#D4AF37] bg-[#D4AF37]/10' : 'text-neutral-500 hover:text-white hover:bg-white/5']"
          >
             <span class="font-medium text-sm uppercase tracking-widest">Inventario</span>
          </button>

          <button
            @click="pestañaActiva = 'mensajes'; fetchMensajes(); menuAbierto = false"
            :class="['w-full p-3 rounded-xl flex items-center justify-between transition-all', pestañaActiva === 'mensajes' ? 'text-[#D4AF37] bg-[#D4AF37]/10' : 'text-neutral-500 hover:text-white hover:bg-white/5']"
          >
             <span class="font-medium text-sm uppercase tracking-widest">Buzón</span>
             <span v-if="mensajesNoLeidos > 0" class="bg-[#D4AF37] text-black text-[10px] font-bold px-2 py-0.5 rounded-full">{{ mensajesNoLeidos }}</span>
          </button>

          <button
            @click="pestañaActiva = 'estadisticas'; calcularEstadisticas(); menuAbierto = false"
            :class="['w-full p-3 rounded-xl flex items-center gap-3 transition-all', pestañaActiva === 'estadisticas' ? 'text-[#D4AF37] bg-[#D4AF37]/10' : 'text-neutral-500 hover:text-white hover:bg-white/5']"
          >
             <span class="font-medium text-sm uppercase tracking-widest">Métricas</span>
          </button>
        </div>

        <div v-if="rolUsuario === 'admin_gastro' || rolUsuario === 'superadmin'" class="space-y-4 pt-4 border-t border-white/5">
          <button
            @click="pestañaActiva = 'gastronomia'; fetchGastronomia(); menuAbierto = false"
            :class="['w-full p-3 rounded-xl flex items-center gap-3 transition-all', pestañaActiva === 'gastronomia' ? 'text-[#D4AF37] bg-[#D4AF37]/10' : 'text-neutral-500 hover:text-white hover:bg-white/5']"
          >
             <span class="font-medium text-sm uppercase tracking-widest">Menú Piso 5</span>
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
            {{ pestañaActiva === 'mensajes' ? 'Buzón' : 'Estadísticas' }}
          </h2>
        </div>
        
        <button v-if="pestañaActiva === 'inventario'" @click="openForm()" class="bg-[#D4AF37] text-black px-4 py-2.5 md:px-6 md:py-3 rounded-full font-bold hover:bg-yellow-600 transition-transform active:scale-95 text-[10px] md:text-xs uppercase tracking-widest flex items-center gap-2 whitespace-nowrap">
          <span class="text-sm md:text-base">+</span> <span class="hidden sm:inline">AGREGAR</span> OBRA
        </button>

        <button v-if="pestañaActiva === 'gastronomia'" @click="openGastroForm()" class="bg-[#D4AF37] text-black px-4 py-2.5 md:px-6 md:py-3 rounded-full font-bold hover:bg-yellow-600 transition-transform active:scale-95 text-[10px] md:text-xs uppercase tracking-widest flex items-center gap-2 whitespace-nowrap">
          <span class="text-sm md:text-base">+</span> <span class="hidden sm:inline">AGREGAR</span> PLATO
        </button>
      </nav>

      <div class="p-4 md:p-8 lg:p-12 overflow-y-auto">
        
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
          <header class="mb-8 md:mb-12">
            <h1 class="text-3xl md:text-4xl font-serif text-white">Gestión Gastronómica</h1>
            <p class="text-neutral-500 text-[10px] md:text-xs mt-2 uppercase tracking-[0.2em]">Menú Piso 5</p>
          </header>

          <div v-if="!cargandoGastro" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <div v-for="item in gastroFiltrados" :key="item.id" class="bg-neutral-900 border border-white/5 rounded-3xl p-4 md:p-5 hover:border-[#D4AF37]/20 transition-all relative flex flex-col justify-between">
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
                    <span class="bg-[#D4AF37]/20 text-[#D4AF37] px-2 py-1 rounded-sm">{{ item.local.replace(/-/g, ' ').replace(/,/g, ' | ') }}</span>
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
          <div v-if="cargandoGastro" class="text-center py-20 text-neutral-500 animate-pulse text-xs uppercase tracking-widest">Cargando Menús...</div>
        </div>

        <div v-if="pestañaActiva === 'mensajes'">
          <div v-if="cargandoMensajes" class="text-center py-20 text-neutral-500 animate-pulse text-xs uppercase tracking-widest">Cargando buzón...</div>
          <div v-else-if="mensajes.length === 0" class="text-center py-20 text-neutral-500 border border-dashed border-white/10 rounded-3xl">
            No hay mensajes en la bandeja de entrada.
          </div>
          <div v-else class="space-y-4 max-w-4xl mx-auto">
            <div v-for="msj in mensajes" :key="msj.id" :class="['p-5 md:p-6 rounded-2xl border transition-all', msj.leido ? 'bg-white/5 border-white/5 opacity-70' : 'bg-neutral-900 border-[#D4AF37]/30 shadow-[0_0_15px_rgba(212,175,55,0.05)]']">
              <div class="flex flex-col md:flex-row md:justify-between md:items-start mb-4 gap-2">
                <div>
                  <h4 class="text-white font-bold text-base md:text-lg flex items-center gap-2">
                    {{ formatoTitulo(msj.nombre) }}
                    <span v-if="!msj.leido" class="bg-[#D4AF37] w-2 h-2 rounded-full inline-block"></span>
                  </h4>
                  <a :href="'mailto:' + msj.email" class="text-[#D4AF37] text-xs hover:underline break-all">{{ msj.email }}</a>
                </div>
                <span class="text-neutral-500 text-[10px] md:text-xs">{{ new Date(msj.creado_en).toLocaleDateString() }}</span>
              </div>
              <p class="text-neutral-300 text-xs md:text-sm leading-relaxed whitespace-pre-wrap">{{ msj.mensaje }}</p>
              <div class="mt-6 flex flex-wrap gap-3 border-t border-white/5 pt-4">
                <button @click="marcarLeido(msj)" v-if="!msj.leido" class="flex-1 md:flex-none text-[10px] uppercase tracking-widest font-bold text-white hover:text-[#D4AF37] transition-colors text-left">✔ Marcar leído</button>
                <button @click="eliminarMensaje(msj.id)" class="text-[10px] uppercase tracking-widest font-bold text-red-500 hover:text-red-400 transition-colors">🗑 Eliminar</button>
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
          
          <div class="w-full bg-white/5 border border-white/10 p-3 rounded-xl flex flex-col justify-center gap-2 mb-3">
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
              <h4 class="text-[10px] text-neutral-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-2"><span class="text-lg">🇯ப்புகள்</span> 日本語</h4>
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

  </div>
</template>

<script setup>
import { ref, onMounted, computed, reactive } from 'vue'
import { supabase, searchQuery } from '../lib/supabase'
import { useRouter } from 'vue-router'

const router = useRouter()
const pestañaActiva = ref('inventario')

const rolUsuario = ref('superadmin') 
const menuAbierto = ref(false) 

// ==========================================
// 1. LÓGICA DE GALERÍA DE ARTE 
// ==========================================
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

const mensajes = ref([])
const cargandoMensajes = ref(false)
const stats = reactive({ total: 0, pinturas: 0, esculturas: 0 })
const logsActividad = ref([])

const fetchObras = async () => {
  cargando.value = true
  const { data } = await supabase.from('obras').select('*').order('created_at', { ascending: false })
  todasLasObras.value = data || []
  cargando.value = false
  calcularEstadisticas()
}

const fetchMensajes = async () => {
  cargandoMensajes.value = true
  const { data } = await supabase.from('mensajes_contacto').select('*').order('creado_en', { ascending: false })
  mensajes.value = data || []
  cargandoMensajes.value = false
}

const calcularEstadisticas = () => {
  stats.total = todasLasObras.value.length
  stats.pinturas = todasLasObras.value.filter(o => o.tipo === 'Pintura').length
  stats.esculturas = todasLasObras.value.filter(o => o.tipo === 'Escultura').length

  const ultimas = [...todasLasObras.value].slice(0, 5)
  logsActividad.value = ultimas.map(obra => {
    const fecha = new Date(obra.created_at)
    return { accion: 'Creación', titulo: obra.titulo, fechaFormateada: fecha.toLocaleDateString(), horaFormateada: fecha.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
  })
}

const mensajesNoLeidos = computed(() => mensajes.value.filter(m => !m.leido).length)

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

const marcarLeido = async (msj) => {
  const { error } = await supabase.from('mensajes_contacto').update({ leido: true }).eq('id', msj.id)
  if (!error) msj.leido = true
}

const eliminarMensaje = async (id) => {
  if(confirm("¿Eliminar este mensaje permanentemente?")) { await supabase.from('mensajes_contacto').delete().eq('id', id); fetchMensajes() }
}

// ==========================================
// 2. LÓGICA DE GASTRONOMÍA (NUEVA ESTRUCTURA)
// ==========================================
const todosLosPlatos = ref([])
const cargandoGastro = ref(false)
const showGastroForm = ref(false)
const enviandoGastro = ref(false)
const gastroEditandoId = ref(null)

const categoriasDisponibles = [
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
      { id: 'adiciones', nombre: 'ADICIONES' }
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

const fetchGastronomia = async () => {
  cargandoGastro.value = true
  const { data } = await supabase.from('menu_gastronomia').select('*').order('created_at', { ascending: false })
  todosLosPlatos.value = data || []
  cargandoGastro.value = false
}

const gastroFiltrados = computed(() => {
  const query = searchQuery?.value ? searchQuery.value.toLowerCase().trim() : ''
  if (!query) return todosLosPlatos.value
  return todosLosPlatos.value.filter(o => o.nombre.toLowerCase().includes(query) || (o.nombre_en && o.nombre_en.toLowerCase().includes(query)) || o.categoria.toLowerCase().includes(query))
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
    { id: 'adiciones', nombre: 'ADICIONES' },
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
    
    if (!payload.locales || payload.locales.length === 0) {
      alert("Por favor, selecciona al menos un establecimiento.")
      enviandoGastro.value = false
      return
    }

    payload.local = payload.locales.join(',')
    delete payload.locales 
    
    // Verificación inteligente: Si la categoría no tiene subcategorías disponibles, limpiamos el campo
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

onMounted(() => { fetchObras(); fetchMensajes(); fetchGastronomia() })
</script>