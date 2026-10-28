<template>
  <main class="min-h-screen bg-neutral-950 text-white pt-24 px-4 sm:px-6 pb-20 overflow-x-hidden selection:bg-[#D4AF37] selection:text-black">
    
    <!-- Navbar limpia e institucional (sin buscador en la barra) -->
    <Navbar />

    <header class="text-center max-w-4xl mx-auto mt-6 mb-8 flex flex-col items-center">
      <h1 class="text-3xl md:text-5xl font-serif text-[#D4AF37] uppercase tracking-[0.15em] drop-shadow-lg mb-4">
        {{ t.seoTitle }}
      </h1>
      <p class="text-neutral-400 text-xs md:text-sm tracking-[0.2em] uppercase font-light max-w-2xl">
        {{ t.seoSubtitle }}
      </p>
    </header>

    <div class="w-full flex justify-center mb-8">
      <NuxtImg 
        src="/logon.png" 
        alt="Logotipo Galería de Arte Palacio Nacional Medellín" 
        class="w-36 md:w-44 object-contain opacity-90 drop-shadow-[0_0_20px_rgba(212,175,55,0.15)]" 
        preload
      />
    </div>

    <!-- ======================================================== -->
    <!-- PANEL DE FILTROS UNIFICADO -->
    <!-- ======================================================== -->
    <section class="relative z-30 max-w-7xl mx-auto mb-12 bg-[#0c0c0c]/90 border border-[#D4AF37]/25 rounded-3xl p-5 sm:p-7 md:p-8 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)]" aria-label="Filtros del catálogo">
      
      <!-- FILA 1: Buscador a la izquierda + Filtro de Tipo a la derecha -->
      <div class="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-5 pb-6 border-b border-white/10">
        
        <!-- Buscador general por texto -->
        <div class="relative flex-1 max-w-xl">
          <input 
            v-model="searchQuery"
            type="text" 
            :placeholder="t.searchPlaceholder"
            class="w-full bg-[#141414] border border-white/15 focus:border-[#D4AF37] focus:bg-[#1a1a1a] rounded-full py-3.5 pl-12 pr-10 text-white text-xs md:text-sm outline-none transition-all duration-300 font-light placeholder:text-neutral-500 shadow-inner focus:ring-2 focus:ring-[#D4AF37]/20"
          />
          <span class="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-base pointer-events-none select-none">🔍</span>
          <button 
            v-if="searchQuery" 
            @click="searchQuery = ''"
            class="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-sm p-1 transition-colors"
            title="Limpiar búsqueda"
            aria-label="Limpiar búsqueda"
          >
            ✕
          </button>
        </div>

        <!-- Filtro por Tipo de Obra -->
        <div class="flex flex-wrap items-center gap-2 sm:gap-3">
          <span class="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-bold mr-1 select-none">
            {{ t.categoryLabel }}:
          </span>

          <button 
            @click="cambiarFiltro('Todos')" 
            :class="[
              'px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40',
              filtroTipo === 'Todos' 
                ? 'bg-[#D4AF37] text-black shadow-[0_0_20px_rgba(212,175,55,0.4)]' 
                : 'bg-[#181818] border border-white/10 text-neutral-300 hover:text-white hover:border-[#D4AF37]/50'
            ]"
          >
            {{ t.filterAll }}
          </button>

          <button 
            @click="cambiarFiltro('Pintura')" 
            :class="[
              'px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40',
              filtroTipo === 'Pintura' 
                ? 'bg-[#D4AF37] text-black shadow-[0_0_20px_rgba(212,175,55,0.4)]' 
                : 'bg-[#181818] border border-white/10 text-neutral-300 hover:text-white hover:border-[#D4AF37]/50'
            ]"
          >
            {{ t.filterPaintings }}
          </button>

          <button 
            @click="cambiarFiltro('Escultura')" 
            :class="[
              'px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40',
              filtroTipo === 'Escultura' 
                ? 'bg-[#D4AF37] text-black shadow-[0_0_20px_rgba(212,175,55,0.4)]' 
                : 'bg-[#181818] border border-white/10 text-neutral-300 hover:text-white hover:border-[#D4AF37]/50'
            ]"
          >
            {{ t.filterSculptures }}
          </button>
        </div>

      </div>

      <!-- FILA 2: Encabezado con destello + Selectores específicos -->
      <div class="pt-6">
        
        <!-- Encabezado de la subsección de filtros -->
        <div class="flex items-center gap-2 mb-4">
          <span class="text-[#D4AF37] text-sm select-none" aria-hidden="true"></span>
          <span class="text-[11px] uppercase tracking-[0.25em] text-[#D4AF37] font-bold select-none">
            {{ t.secondaryFiltersLabel }}
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center">
          
          <!-- 1. SELECTOR DE ARTISTA -->
          <div :class="['relative', dropdownArtistaAbierto ? 'z-50' : 'z-20']" ref="artistaComboboxRef">
            <div class="relative">
              <input 
                v-model="busquedaArtistaTexto"
                @focus="abrirDropdownArtista"
                @input="onInputArtista"
                type="text"
                :placeholder="filtroArtista === 'Todos' ? t.artistPlaceholder : filtroArtista"
                class="w-full bg-[#141414] border border-white/15 focus:border-[#D4AF37] rounded-2xl py-3 pl-10 pr-9 text-white text-xs outline-none transition-all font-light placeholder:text-neutral-400 shadow-inner"
                :class="{ 'border-[#D4AF37] ring-2 ring-[#D4AF37]/20': dropdownArtistaAbierto }"
              />
              <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-xs pointer-events-none select-none">👤</span>
              <button 
                type="button" 
                @click="toggleDropdownArtista"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#D4AF37] text-xs transition-transform duration-200"
                :class="{ 'rotate-180 text-[#D4AF37]': dropdownArtistaAbierto }"
                aria-label="Abrir listado de artistas"
              >
                ▼
              </button>
            </div>

            <!-- Menú desplegable con scroll de artistas -->
            <transition name="dropdown-slide">
              <div 
                v-if="dropdownArtistaAbierto" 
                class="absolute left-0 right-0 mt-2 bg-[#0d0d0d] border border-[#D4AF37]/30 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.95)] z-50 max-h-60 overflow-y-auto py-2 backdrop-blur-xl custom-scrollbar"
              >
                <button 
                  type="button"
                  @click="seleccionarArtista('Todos')"
                  class="w-full text-left px-4 py-2.5 text-xs text-neutral-300 hover:bg-[#D4AF37]/15 hover:text-[#D4AF37] transition-colors flex items-center justify-between"
                  :class="{ 'text-[#D4AF37] font-bold bg-[#D4AF37]/10': filtroArtista === 'Todos' }"
                >
                  <span>{{ t.allArtists }}</span>
                  <span v-if="filtroArtista === 'Todos'">✓</span>
                </button>

                <div class="h-px bg-white/10 my-1"></div>

                <div v-if="artistasFiltrados.length === 0" class="px-4 py-3 text-xs text-neutral-500 italic">
                  {{ t.noArtistsFound }}
                </div>

                <button 
                  v-for="artista in artistasFiltrados" 
                  :key="artista"
                  type="button"
                  @click="seleccionarArtista(artista)"
                  class="w-full text-left px-4 py-2 text-xs text-neutral-300 hover:bg-[#D4AF37]/15 hover:text-[#D4AF37] transition-colors flex items-center justify-between"
                  :class="{ 'text-[#D4AF37] font-bold bg-[#D4AF37]/10': filtroArtista === artista }"
                >
                  <span class="truncate">{{ artista }}</span>
                  <span v-if="filtroArtista === artista">✓</span>
                </button>
              </div>
            </transition>
          </div>

          <!-- 2. SELECTOR DE TÉCNICA -->
          <div :class="['relative', dropdownTecnicaAbierto ? 'z-50' : 'z-20']" ref="tecnicaDropdownRef">
            <div class="relative">
              <button 
                type="button" 
                @click="toggleDropdownTecnica"
                class="w-full bg-[#141414] border border-white/15 hover:border-[#D4AF37]/50 focus:border-[#D4AF37] rounded-2xl py-3 pl-10 pr-9 text-white text-xs outline-none transition-all font-light shadow-inner flex items-center justify-between text-left cursor-pointer"
                :class="{ 'border-[#D4AF37] ring-2 ring-[#D4AF37]/20': dropdownTecnicaAbierto }"
                aria-label="Filtrar por técnica"
                :aria-expanded="dropdownTecnicaAbierto"
              >
                <span class="truncate" :class="{ 'text-[#D4AF37] font-medium': filtroTecnica !== 'Todos', 'text-neutral-300': filtroTecnica === 'Todos' }">
                  {{ filtroTecnica === 'Todos' ? t.allTechniques : filtroTecnica }}
                </span>
              </button>
              <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-xs pointer-events-none select-none">🎨</span>
              <button
                type="button"
                @click="toggleDropdownTecnica"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#D4AF37] text-xs transition-transform duration-200 select-none"
                :class="{ 'rotate-180 text-[#D4AF37]': dropdownTecnicaAbierto }"
                aria-label="Abrir listado de técnicas"
              >
                ▼
              </button>
            </div>

            <!-- Menú desplegable con scroll de técnicas -->
            <transition name="dropdown-slide">
              <div 
                v-if="dropdownTecnicaAbierto" 
                class="absolute left-0 right-0 mt-2 bg-[#0d0d0d] border border-[#D4AF37]/30 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.95)] z-50 max-h-60 overflow-y-auto py-2 backdrop-blur-xl custom-scrollbar"
              >
                <button 
                  type="button"
                  @click="seleccionarTecnica('Todos')"
                  class="w-full text-left px-4 py-2.5 text-xs text-neutral-300 hover:bg-[#D4AF37]/15 hover:text-[#D4AF37] transition-colors flex items-center justify-between"
                  :class="{ 'text-[#D4AF37] font-bold bg-[#D4AF37]/10': filtroTecnica === 'Todos' }"
                >
                  <span>{{ t.allTechniques }}</span>
                  <span v-if="filtroTecnica === 'Todos'">✓</span>
                </button>

                <div class="h-px bg-white/10 my-1"></div>

                <button 
                  v-for="tecnica in listaTecnicas" 
                  :key="tecnica"
                  type="button"
                  @click="seleccionarTecnica(tecnica)"
                  class="w-full text-left px-4 py-2 text-xs text-neutral-300 hover:bg-[#D4AF37]/15 hover:text-[#D4AF37] transition-colors flex items-center justify-between"
                  :class="{ 'text-[#D4AF37] font-bold bg-[#D4AF37]/10': filtroTecnica === tecnica }"
                >
                  <span class="truncate">{{ tecnica }}</span>
                  <span v-if="filtroTecnica === tecnica">✓</span>
                </button>
              </div>
            </transition>
          </div>

          <!-- 3. SELECTOR DE PRECIO -->
          <div :class="['relative', dropdownPrecioAbierto ? 'z-50' : 'z-20']" ref="precioDropdownRef">
            <div class="relative">
              <button 
                type="button" 
                @click="toggleDropdownPrecio"
                class="w-full bg-[#141414] border border-white/15 hover:border-[#D4AF37]/50 focus:border-[#D4AF37] rounded-2xl py-3 pl-10 pr-9 text-white text-xs outline-none transition-all font-light shadow-inner flex items-center justify-between text-left cursor-pointer"
                :class="{ 'border-[#D4AF37] ring-2 ring-[#D4AF37]/20': dropdownPrecioAbierto }"
                aria-label="Filtrar por rango de precio"
                :aria-expanded="dropdownPrecioAbierto"
              >
                <span class="truncate" :class="{ 'text-[#D4AF37] font-medium': filtroPrecio !== 'Todos', 'text-neutral-300': filtroPrecio === 'Todos' }">
                  {{ etiquetaPrecioActual }}
                </span>
              </button>
              <span class="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-xs pointer-events-none select-none">🏷️</span>
              <button
                type="button"
                @click="toggleDropdownPrecio"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#D4AF37] text-xs transition-transform duration-200 select-none"
                :class="{ 'rotate-180 text-[#D4AF37]': dropdownPrecioAbierto }"
                aria-label="Abrir listado de rangos de precio"
              >
                ▼
              </button>
            </div>

            <!-- Menú desplegable de rangos de precio -->
            <transition name="dropdown-slide">
              <div 
                v-if="dropdownPrecioAbierto" 
                class="absolute left-0 right-0 mt-2 bg-[#0d0d0d] border border-[#D4AF37]/30 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.95)] z-50 max-h-60 overflow-y-auto py-2 backdrop-blur-xl custom-scrollbar"
              >
                <button 
                  v-for="(opc, idx) in opcionesPrecio" 
                  :key="opc.valor"
                  type="button"
                  @click="seleccionarPrecio(opc.valor)"
                  class="w-full text-left px-4 py-2 text-xs text-neutral-300 hover:bg-[#D4AF37]/15 hover:text-[#D4AF37] transition-colors flex items-center justify-between"
                  :class="{ 
                    'text-[#D4AF37] font-bold bg-[#D4AF37]/10': filtroPrecio === opc.valor,
                    'border-b border-white/10 pb-2.5 mb-1': idx === 0
                  }"
                >
                  <span class="truncate">{{ opc.label }}</span>
                  <span v-if="filtroPrecio === opc.valor">✓</span>
                </button>
              </div>
            </transition>
          </div>

          <!-- 4. BOTÓN LIMPIAR FILTROS / CONTADOR -->
          <div>
            <button 
              v-if="hayFiltrosActivos"
              @click="limpiarTodosLosFiltros"
              class="w-full py-3 px-4 bg-white/5 hover:bg-red-500/10 border border-white/15 hover:border-red-500/40 text-neutral-300 hover:text-red-400 rounded-2xl text-xs uppercase tracking-widest font-semibold transition-all flex items-center justify-center gap-2 focus:outline-none active:scale-95"
            >
              <span class="text-sm leading-none">✕</span>
              <span>{{ t.clearFilter }}</span>
            </button>
            <div v-else class="text-center sm:text-left text-[11px] text-neutral-500 uppercase tracking-widest px-2 select-none">
              {{ obrasProcesadas.length }} {{ t.resultsCount }}
            </div>
          </div>

        </div>

      </div>

    </section>

    <!-- Indicador de carga SSR y Cliente -->
    <div v-if="status === 'pending'" class="flex flex-col items-center justify-center py-20 space-y-4 text-[#D4AF37]">
      <div class="animate-spin rounded-full h-10 w-10 border-2 border-current border-t-transparent"></div>
      <span class="uppercase tracking-[0.2em] text-xs font-bold animate-pulse">{{ t.syncing }}</span>
    </div>

    <!-- Catálogo de Obras Indexable por Google -->
    <section id="catalogo-obras" v-else-if="obrasFiltradas.length > 0" class="relative z-10 max-w-7xl mx-auto flex flex-col" aria-label="Catálogo de Obras de Arte">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mb-12">
        
        <article 
          v-for="(obra, index) in obrasFiltradas" 
          :key="obra.id" 
          itemscope itemtype="https://schema.org/VisualArtwork"
          class="obra-card group bg-neutral-900/40 border border-white/5 rounded-3xl overflow-hidden hover:border-[#D4AF37]/40 hover:bg-neutral-900/80 hover:shadow-[0_15px_40px_rgba(212,175,55,0.15)] transition-all duration-500 flex flex-col relative"
        >
          
          <div class="absolute top-4 left-4 z-10 bg-black/70 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest">
            {{ obra.tipo === 'Escultura' ? t.sculptureLabel : t.paintingLabel }}
          </div>

          <figure class="relative aspect-square overflow-hidden bg-black/50">
            <!-- FALLBACK SSR PARA SEO: Google verá esta imagen nativa -->
            <div v-if="!componenteActivo" class="w-full h-full relative flex items-center justify-center bg-neutral-950">
              <NuxtImg 
                v-if="obra.listaImagenes[0] !== 'sin-imagen'" 
                :src="obra.listaImagenes[0]" 
                :alt="`${obtenerTitulo(obra)} - Arte en Palacio Nacional Medellín`" 
                itemprop="image" 
                class="w-full h-full object-cover"
              />
              <div v-else class="text-neutral-600 text-xs uppercase tracking-widest">Sin Imagen</div>
            </div>
            
            <!-- SWIPER INTERACTIVO PARA EL USUARIO -->
            <swiper
              v-else
              :modules="modules"
              :slides-per-view="1"
              :loop="obra.listaImagenes.length > 1"
              :autoplay="obra.listaImagenes.length > 1 ? { delay: 3500, disableOnInteraction: false } : false"
              effect="fade"
              class="w-full h-full"
            >
              <swiper-slide v-for="(img, idx) in obra.listaImagenes" :key="idx" class="w-full h-full bg-neutral-950 overflow-hidden relative flex items-center justify-center">
                <NuxtImg 
                  v-if="img !== 'sin-imagen'" 
                  :src="img" 
                  :alt="`${obtenerTitulo(obra)} - Galería Palacio Nacional Medellín`" 
                  itemprop="image" 
                  :loading="index < 3 && idx === 0 ? 'eager' : 'lazy'" 
                  class="w-full h-full object-cover select-none"
                />
                <div v-else class="text-neutral-600 text-xs uppercase tracking-widest">Sin Imagen</div>
              </swiper-slide>
            </swiper>
          </figure>

          <!-- Información de la Obra -->
          <div class="p-6 md:p-8 flex-1 flex flex-col justify-between">
            <div>
              <h2 itemprop="name" class="text-2xl font-serif text-white group-hover:text-[#D4AF37] transition-colors duration-300 mb-2 leading-tight">
                {{ obtenerTitulo(obra) }}
              </h2>
              <p itemprop="creator" class="text-xs uppercase tracking-widest text-neutral-400 font-light mb-6">
                {{ t.by }} <span class="text-white font-medium">{{ obra.autor }}</span>
              </p>

              <div class="grid grid-cols-2 gap-4 py-4 border-y border-white/10 mb-6">
                
                <div class="text-left">
                  <span class="text-[9px] uppercase text-[#D4AF37] tracking-[0.2em] font-bold block mb-1.5">{{ t.techniqueLabel }}</span>
                  <p itemprop="artMedium" class="text-xs text-neutral-300 font-medium line-clamp-2 leading-relaxed lowercase">{{ obtenerTecnica(obra) }}</p>
                </div>

                <div class="text-left border-l border-white/10 pl-4">
                  <span class="text-[9px] uppercase text-[#D4AF37] tracking-[0.2em] font-bold block mb-1.5">{{ t.dimensionsLabel }}</span>
                  <p itemprop="artDimensions" class="text-xs text-neutral-300 font-medium line-clamp-2 leading-relaxed lowercase">{{ obra.medidas }}</p>
                </div>

              </div>
            </div>

            <div class="mt-auto flex items-center justify-between">
              <span itemprop="offers" itemscope itemtype="https://schema.org/Offer" class="text-xl md:text-2xl font-serif text-white tracking-wider flex items-baseline">
                <meta itemprop="priceCurrency" content="USD" />
                <meta itemprop="price" :content="isNaN(obra.precio) ? '0' : String(obra.precio).replace(/[^0-9.]/g, '')" />
                {{ isNaN(obra.precio) ? obra.precio : '$' + Number(obra.precio).toLocaleString('es-CO') }}
                <span class="text-[10px] text-neutral-500 ml-1 font-sans font-bold uppercase tracking-widest">USD</span>
              </span>

              <!-- ENLACE A DETALLE DE LA OBRA -->
              <NuxtLink 
                :to="'/DetalleObra/' + obra.id" 
                class="flex items-center justify-center px-6 py-3 border border-white/20 bg-white/5 text-white rounded-full hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-black focus:ring-2 focus:ring-[#D4AF37]/50 focus:outline-none transition-all duration-300 shadow-lg active:scale-95"
              >
                <span class="text-[10px] font-bold uppercase tracking-widest leading-none">{{ t.detailsBtn }}</span>
              </NuxtLink>
            </div>
          </div>
        </article>
      </div>

      <!-- ======================================================== -->
      <!-- SISTEMA DE PAGINACIÓN NUMÉRICA CON SALTO (1 2 3 ... n)   -->
      <!-- ======================================================== -->
      <nav 
        v-if="totalPaginas > 1" 
        aria-label="Paginación de la galería"
        class="w-full flex flex-wrap justify-center items-center gap-2 pt-6 pb-12 select-none"
      >
        <!-- Botón Anterior -->
        <button 
          @click="irAPagina(paginaActual - 1)" 
          :disabled="paginaActual === 1" 
          class="flex items-center gap-1.5 px-4 py-2.5 border border-white/15 bg-[#121212] text-neutral-300 rounded-full hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-black disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[#121212] disabled:hover:border-white/15 disabled:hover:text-neutral-300 transition-all duration-300 text-xs font-semibold uppercase tracking-wider focus:outline-none active:scale-95"
          aria-label="Página anterior"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
          <span class="hidden sm:inline">{{ t.prevPage }}</span>
        </button>

        <!-- Botones Numéricos y Elipsis -->
        <template v-for="(p, idx) in paginasVisibles" :key="idx">
          <span 
            v-if="p === '...'" 
            class="w-10 h-10 flex items-center justify-center text-neutral-500 font-bold select-none text-xs"
          >
            •••
          </span>
          <button 
            v-else
            @click="irAPagina(p)"
            :class="[
              'w-10 h-10 rounded-full text-xs font-bold transition-all duration-300 flex items-center justify-center active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50',
              paginaActual === p 
                ? 'bg-[#D4AF37] text-black shadow-[0_0_15px_rgba(212,175,55,0.4)] border border-[#D4AF37]' 
                : 'bg-[#121212] border border-white/15 text-neutral-300 hover:border-[#D4AF37]/60 hover:text-white hover:bg-white/5'
            ]"
            :aria-current="paginaActual === p ? 'page' : undefined"
            :aria-label="'Ir a la página ' + p"
          >
            {{ p }}
          </button>
        </template>

        <!-- Botón Siguiente -->
        <button 
          @click="irAPagina(paginaActual + 1)" 
          :disabled="paginaActual === totalPaginas" 
          class="flex items-center gap-1.5 px-4 py-2.5 border border-white/15 bg-[#121212] text-neutral-300 rounded-full hover:bg-[#D4AF37] hover:border-[#D4AF37] hover:text-black disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-[#121212] disabled:hover:border-white/15 disabled:hover:text-neutral-300 transition-all duration-300 text-xs font-semibold uppercase tracking-wider focus:outline-none active:scale-95"
          aria-label="Página siguiente"
        >
          <span class="hidden sm:inline">{{ t.nextPage }}</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
      </nav>
    </section>

    <!-- Estado sin resultados -->
    <div v-else class="max-w-7xl mx-auto text-center py-28 space-y-4">
      <div class="text-5xl mb-4 opacity-40">🖼️</div>
      <p class="text-neutral-400 font-serif text-2xl italic">{{ t.noResults }}</p>
      <button 
        @click="limpiarTodosLosFiltros" 
        class="inline-flex items-center gap-2 px-6 py-3 bg-[#D4AF37] text-black uppercase tracking-widest text-xs font-bold rounded-full mt-4 hover:bg-white transition-all shadow-[0_0_15px_rgba(212,175,55,0.3)] focus:outline-none"
      >
        <span>Ver todas las obras</span>
      </button>
    </div>

  </main>
</template>

<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';

// === 1. SEO AGRESIVO Y FOCALIZADO ===
useSeoMeta({
  title: 'Galería de Arte Palacio Nacional | Exposiciones Medellín',
  description: 'Visita la Galería de Arte Palacio Nacional en Medellín. Disfruta de nuestras exposiciones, museo y venta de pinturas y esculturas de artistas locales e internacionales.',
  ogTitle: '🖼️ Galería de Arte Palacio Nacional | Medellín',
  ogDescription: 'Descubre el epicentro del arte en Medellín. Exposiciones, museo y obras exclusivas en el histórico Palacio Nacional. ¡Planifica tu visita y explora la colección!',
  ogImage: 'https://palacionacionalmedellin.com/logon.png',
  twitterCard: 'summary_large_image',
})

const route = useRoute();
const modules = [Autoplay, EffectFade];
const supabase = useSupabaseClient()
const idiomaGlobal = useState('idiomaGlobal', () => 'es')

const componenteActivo = ref(false)
const artistaComboboxRef = ref(null)
const tecnicaDropdownRef = ref(null)
const precioDropdownRef = ref(null)

// ESTADOS REACTIVOS DE FILTROS
const searchQuery = ref('')
const filtroTipo = ref('Todos')
const filtroArtista = ref('Todos')
const busquedaArtistaTexto = ref('')
const dropdownArtistaAbierto = ref(false)
const dropdownTecnicaAbierto = ref(false)
const dropdownPrecioAbierto = ref(false)
const filtroTecnica = ref('Todos')
const filtroPrecio = ref('Todos')

const paginaActual = ref(1)
const limitePorPagina = 12

// === TRADUCCIONES EN 4 IDIOMAS ===
const traducciones = {
  es: { 
    seoTitle: 'Galería de Arte', 
    seoSubtitle: 'Exposiciones, Museo y Venta de Obras en Medellín',
    searchPlaceholder: 'Busca por título, artista o palabras clave...',
    categoryLabel: 'Colección',
    secondaryFiltersLabel: 'Filtrar por artista, técnica y precio',
    artistPlaceholder: 'Escribe o elige un artista...',
    allArtists: 'Todos los Artistas',
    noArtistsFound: 'No hay coincidencias',
    allTechniques: 'Todas las Técnicas',
    allPrices: 'Todos los Precios',
    filterAll: 'Todas', 
    filterPaintings: 'Pinturas', 
    filterSculptures: 'Esculturas', 
    clearFilter: 'Quitar Filtros', 
    syncing: 'Sincronizando galería...', 
    paintingLabel: 'Pintura', 
    sculptureLabel: 'Escultura', 
    by: 'Por', 
    techniqueLabel: 'Técnica', 
    dimensionsLabel: 'Medidas', 
    detailsBtn: 'Ver detalles', 
    noResults: 'No encontramos obras con estos parámetros.', 
    priceLow: 'Menos de $1,000 USD', 
    priceMed: '$1,000 - $5,000 USD', 
    priceHigh: 'Más de $5,000 USD', 
    prevPage: 'Anterior', 
    nextPage: 'Siguiente',
    resultsCount: 'obras encontradas'
  },
  en: { 
    seoTitle: 'Art Gallery', 
    seoSubtitle: 'Exhibitions, Museum and Art Sales in Medellin',
    searchPlaceholder: 'Search by title, artist or keywords...',
    categoryLabel: 'Collection',
    secondaryFiltersLabel: 'Filter by artist, technique and price',
    artistPlaceholder: 'Type or choose an artist...',
    allArtists: 'All Artists',
    noArtistsFound: 'No matches found',
    allTechniques: 'All Techniques',
    allPrices: 'All Prices',
    filterAll: 'All', 
    filterPaintings: 'Paintings', 
    filterSculptures: 'Sculptures', 
    clearFilter: 'Clear Filters', 
    syncing: 'Syncing gallery...', 
    paintingLabel: 'Painting', 
    sculptureLabel: 'Sculpture', 
    by: 'By', 
    techniqueLabel: 'Technique', 
    dimensionsLabel: 'Dimensions', 
    detailsBtn: 'View details', 
    noResults: 'No artworks found matching these parameters.', 
    priceLow: 'Under $1,000 USD', 
    priceMed: '$1,000 - $5,000 USD', 
    priceHigh: 'Over $5,000 USD', 
    prevPage: 'Previous', 
    nextPage: 'Next',
    resultsCount: 'artworks found'
  },
  fr: { 
    seoTitle: 'Galerie d\'Art', 
    seoSubtitle: 'Expositions, Musée et Vente d\'Art à Medellín',
    searchPlaceholder: 'Rechercher par titre, artiste ou mots-clés...',
    categoryLabel: 'Collection',
    secondaryFiltersLabel: 'Filtrer par artiste, technique et prix',
    artistPlaceholder: 'Tapez ou choisissez un artiste...',
    allArtists: 'Tous les Artistes',
    noArtistsFound: 'Aucune correspondance',
    allTechniques: 'Toutes les Techniques',
    allPrices: 'Tous les Prix',
    filterAll: 'Toutes', 
    filterPaintings: 'Peintures', 
    filterSculptures: 'Sculptures', 
    clearFilter: 'Effacer les filtres', 
    syncing: 'Synchronisation...', 
    paintingLabel: 'Peinture', 
    sculptureLabel: 'Sculpture', 
    by: 'Par', 
    techniqueLabel: 'Technique', 
    dimensionsLabel: 'Dimensions', 
    detailsBtn: 'Voir les détails', 
    noResults: 'Aucune œuvre trouvée.', 
    priceLow: 'Moins de 1 000 $ USD', 
    priceMed: '1 000 $ - 5 000 $ USD', 
    priceHigh: 'Plus de 5 000 $ USD', 
    prevPage: 'Précédent', 
    nextPage: 'Suivant',
    resultsCount: 'œuvres trouvées'
  },
  ja: { 
    seoTitle: 'アートギャラリー', 
    seoSubtitle: 'メデジンの展覧会、美術館、アート販売',
    searchPlaceholder: 'タイトル、アーティスト、キーワードで検索...',
    categoryLabel: 'コレクション',
    secondaryFiltersLabel: 'アーティスト、手法、価格で絞り込み',
    artistPlaceholder: 'アーティスト名を入力または選択...',
    allArtists: 'すべてのアーティスト',
    noArtistsFound: '一致するアーティストはいません',
    allTechniques: 'すべての手法',
    allPrices: 'すべての価格',
    filterAll: 'すべて', 
    filterPaintings: '絵画', 
    filterSculptures: '彫刻', 
    clearFilter: 'フィルター解除', 
    syncing: 'ギャラリーを同期中...', 
    paintingLabel: '絵画', 
    sculptureLabel: '彫刻', 
    by: '作', 
    techniqueLabel: '手法', 
    dimensionsLabel: '寸法', 
    detailsBtn: '詳細を見る', 
    noResults: '条件に一致する作品はありません。', 
    priceLow: '1,000 USD未満', 
    priceMed: '1,000 - 5,000 USD', 
    priceHigh: '5,000 USD以上', 
    prevPage: '前へ', 
    nextPage: '次へ',
    resultsCount: '件の作品'
  }
}

const t = computed(() => traducciones[idiomaGlobal.value] || traducciones['es'])

const obtenerTitulo = (obra) => {
  if (idiomaGlobal.value === 'en' && obra.titulo_en) return obra.titulo_en;
  if (idiomaGlobal.value === 'fr' && obra.titulo_fr) return obra.titulo_fr;
  if (idiomaGlobal.value === 'ja' && obra.titulo_ja) return obra.titulo_ja;
  return obra.titulo; 
}

const obtenerTecnica = (obra) => {
  if (idiomaGlobal.value === 'en' && obra.tecnica_en) return obra.tecnica_en;
  if (idiomaGlobal.value === 'fr' && obra.tecnica_fr) return obra.tecnica_fr;
  if (idiomaGlobal.value === 'ja' && obra.tecnica_ja) return obra.tecnica_ja;
  return obra.tecnica; 
}

// === 2. FETCH SSR: DATOS DESDE SUPABASE ===
const { data: obrasData, status } = await useAsyncData('obras-galeria', async () => {
  const { data, error } = await supabase
    .from('obras')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data || []
})

// === 3. LISTAS DERIVADAS PARA LOS SELECTORES ===
// Lista de artistas únicos ordenada alfabéticamente
const listaArtistas = computed(() => {
  if (!obrasData.value) return []
  const autores = [...new Set(obrasData.value.map(o => o.autor).filter(a => a && a.trim() !== ''))]
  return autores.sort((a, b) => a.localeCompare(b))
})

// Artistas filtrados por el texto que escribe el usuario en el combobox
const artistasFiltrados = computed(() => {
  const q = busquedaArtistaTexto.value.toLowerCase().trim()
  if (!q) return listaArtistas.value
  return listaArtistas.value.filter(a => a.toLowerCase().includes(q))
})

// Lista de técnicas únicas ordenadas alfabéticamente
const listaTecnicas = computed(() => {
  if (!obrasData.value) return []
  const tecnicas = [...new Set(obrasData.value.map(o => o.tecnica).filter(t => t && t.trim() !== ''))]
  return tecnicas.sort((a, b) => a.localeCompare(b))
})

// Control del combobox de artistas
const abrirDropdownArtista = () => {
  dropdownArtistaAbierto.value = true
  dropdownTecnicaAbierto.value = false
  dropdownPrecioAbierto.value = false
}

const toggleDropdownArtista = () => {
  dropdownArtistaAbierto.value = !dropdownArtistaAbierto.value
  if (dropdownArtistaAbierto.value) {
    dropdownTecnicaAbierto.value = false
    dropdownPrecioAbierto.value = false
  }
}

const toggleDropdownTecnica = () => {
  dropdownTecnicaAbierto.value = !dropdownTecnicaAbierto.value
  if (dropdownTecnicaAbierto.value) {
    dropdownArtistaAbierto.value = false
    dropdownPrecioAbierto.value = false
  }
}

const toggleDropdownPrecio = () => {
  dropdownPrecioAbierto.value = !dropdownPrecioAbierto.value
  if (dropdownPrecioAbierto.value) {
    dropdownArtistaAbierto.value = false
    dropdownTecnicaAbierto.value = false
  }
}

const onInputArtista = () => {
  dropdownArtistaAbierto.value = true
  dropdownTecnicaAbierto.value = false
  dropdownPrecioAbierto.value = false
  if (busquedaArtistaTexto.value === '') {
    filtroArtista.value = 'Todos'
  }
}

const seleccionarArtista = (artista) => {
  filtroArtista.value = artista
  busquedaArtistaTexto.value = artista === 'Todos' ? '' : artista
  dropdownArtistaAbierto.value = false
}

const seleccionarTecnica = (tecnica) => {
  filtroTecnica.value = tecnica
  dropdownTecnicaAbierto.value = false
}

const opcionesPrecio = computed(() => [
  { valor: 'Todos', label: t.value.allPrices },
  { valor: 'bajo', label: t.value.priceLow },
  { valor: 'medio', label: t.value.priceMed },
  { valor: 'alto', label: t.value.priceHigh }
])

const etiquetaPrecioActual = computed(() => {
  const opc = opcionesPrecio.value.find(o => o.valor === filtroPrecio.value)
  return opc ? opc.label : t.value.allPrices
})

const seleccionarPrecio = (precio) => {
  filtroPrecio.value = precio
  dropdownPrecioAbierto.value = false
}

// Comprueba si hay algún filtro activo
const hayFiltrosActivos = computed(() => {
  return (
    (searchQuery.value && searchQuery.value.trim() !== '') ||
    filtroTipo.value !== 'Todos' ||
    filtroArtista.value !== 'Todos' ||
    filtroTecnica.value !== 'Todos' ||
    filtroPrecio.value !== 'Todos'
  )
})

const limpiarTodosLosFiltros = () => {
  searchQuery.value = ''
  filtroTipo.value = 'Todos'
  filtroArtista.value = 'Todos'
  busquedaArtistaTexto.value = ''
  filtroTecnica.value = 'Todos'
  filtroPrecio.value = 'Todos'
  dropdownArtistaAbierto.value = false
  dropdownTecnicaAbierto.value = false
  dropdownPrecioAbierto.value = false
  paginaActual.value = 1
}

// === 4. LÓGICA DE FILTRADO MULTIDIMENSIONAL ===
const obrasProcesadas = computed(() => {
  if (!obrasData.value) return []
  let filtradas = obrasData.value

  // Filtro por Tipo de Obra (Pintura / Escultura)
  if (filtroTipo.value !== 'Todos') {
    filtradas = filtradas.filter(o => o.tipo === filtroTipo.value)
  }

  // Filtro por Artista
  if (filtroArtista.value !== 'Todos') {
    filtradas = filtradas.filter(o => o.autor === filtroArtista.value)
  }

  // Filtro por Técnica
  if (filtroTecnica.value !== 'Todos') {
    filtradas = filtradas.filter(o => o.tecnica === filtroTecnica.value)
  }

  // Filtro por Rango de Precio
  if (filtroPrecio.value !== 'Todos') {
    filtradas = filtradas.filter(o => {
      const precioNumerico = Number(String(o.precio).replace(/[^0-9.]/g, ''))
      if (filtroPrecio.value === 'bajo') return precioNumerico < 1000
      if (filtroPrecio.value === 'medio') return precioNumerico >= 1000 && precioNumerico <= 5000
      if (filtroPrecio.value === 'alto') return precioNumerico > 5000
      return true
    })
  }

  // Búsqueda general por texto (título, autor, técnica o palabras clave)
  if (searchQuery.value && searchQuery.value.trim() !== '') {
    const term = searchQuery.value.toLowerCase().trim()
    filtradas = filtradas.filter(o => 
      o.titulo?.toLowerCase().includes(term) || 
      o.autor?.toLowerCase().includes(term) || 
      o.tecnica?.toLowerCase().includes(term) ||
      o.titulo_en?.toLowerCase().includes(term)
    )
  }

  return filtradas.map(o => {
    const imgs = [o.imagen_1, o.imagen_2, o.imagen_3].filter(Boolean)
    return { ...o, listaImagenes: imgs.length > 0 ? imgs : ['sin-imagen'] }
  })
})

// === 5. PAGINACIÓN NUMÉRICA CON SALTO (1 2 3 ... n) ===
const totalPaginas = computed(() => Math.ceil(obrasProcesadas.value.length / limitePorPagina) || 1)

const paginasVisibles = computed(() => {
  const total = totalPaginas.value
  const actual = paginaActual.value

  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  const paginas = []
  const delta = 1 // Páginas contiguas a la activa
  const izquierda = Math.max(2, actual - delta)
  const derecha = Math.min(total - 1, actual + delta)

  // Siempre la primera página
  paginas.push(1)

  // Elipsis izquierda
  if (izquierda > 2) {
    paginas.push('...')
  }

  // Páginas del rango central
  for (let i = izquierda; i <= derecha; i++) {
    paginas.push(i)
  }

  // Elipsis derecha
  if (derecha < total - 1) {
    paginas.push('...')
  }

  // Siempre la última página
  paginas.push(total)

  return paginas
})

const obrasFiltradas = computed(() => {
  const inicio = (paginaActual.value - 1) * limitePorPagina
  return obrasProcesadas.value.slice(inicio, inicio + limitePorPagina)
})

watch([filtroTipo, filtroArtista, filtroTecnica, filtroPrecio, searchQuery], () => {
  paginaActual.value = 1
})

const irAPagina = (nuevaPagina) => {
  if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas.value) {
    paginaActual.value = nuevaPagina
    if (import.meta.client) {
      const catalogoEl = document.getElementById('catalogo-obras')
      if (catalogoEl) {
        catalogoEl.scrollIntoView({ behavior: 'smooth' })
      } else {
        window.scrollTo({ top: 350, behavior: 'smooth' })
      }
    }
  }
}

const cambiarFiltro = (nuevoTipo) => {
  filtroTipo.value = nuevoTipo
}

// === 6. METADATOS Y SCHEMA SEO ===
useHead({
  link: [
    { rel: 'canonical', href: 'https://palacionacionalmedellin.com/exposiciones' }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ArtGallery",
        "name": "Galería de Arte Palacio Nacional Medellín",
        "description": "Galería de arte, museo y venta de pinturas y esculturas exclusivas en Medellín.",
        "url": "https://palacionacionalmedellin.com/exposiciones",
        "image": "https://palacionacionalmedellin.com/logon.png",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Carrera 52 # 52-43",
          "addressLocality": "Medellín",
          "addressRegion": "Antioquia",
          "addressCountry": "CO"
        }
      })
    }
  ]
})

onMounted(() => {
  componenteActivo.value = true
  if (import.meta.client && route && !route.hash) {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  // Cerrar los dropdowns al hacer clic fuera
  const handleClickFuera = (e) => {
    if (artistaComboboxRef.value && !artistaComboboxRef.value.contains(e.target)) {
      dropdownArtistaAbierto.value = false
    }
    if (tecnicaDropdownRef.value && !tecnicaDropdownRef.value.contains(e.target)) {
      dropdownTecnicaAbierto.value = false
    }
    if (precioDropdownRef.value && !precioDropdownRef.value.contains(e.target)) {
      dropdownPrecioAbierto.value = false
    }
  }
  document.addEventListener('click', handleClickFuera)
  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickFuera)
    componenteActivo.value = false
  })
})

definePageMeta({
  layout: false 
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');

.font-serif {
  font-family: 'Playfair Display', serif;
}

.obra-card {
  animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) both;
}

.obra-card:nth-child(1) { animation-delay: 0.05s; }
.obra-card:nth-child(2) { animation-delay: 0.1s; }
.obra-card:nth-child(3) { animation-delay: 0.15s; }
.obra-card:nth-child(4) { animation-delay: 0.2s; }
.obra-card:nth-child(5) { animation-delay: 0.25s; }
.obra-card:nth-child(6) { animation-delay: 0.3s; }

@keyframes slideUpFade {
  from { 
    opacity: 0; 
    transform: translateY(40px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

.swiper-slide {
  width: 100% !important;
  height: 100% !important;
  overflow: hidden;
  background-color: #0a0a0a;
  position: relative;
}

.swiper-slide img {
  width: 100% !important;
  height: 100% !important;
  object-fit: cover;
  object-position: center;
  display: block;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  transform: translateZ(0);
}

select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(212, 175, 55, 0.35);
  border-radius: 9999px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: rgba(212, 175, 55, 0.6);
}

.dropdown-slide-enter-active {
  transition: opacity 0.2s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}
.dropdown-slide-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.dropdown-slide-enter-from,
.dropdown-slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>