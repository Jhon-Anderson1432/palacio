<template>
  <main class="relative min-h-screen w-full overflow-x-hidden font-sans flex flex-col bg-[#050505] text-white selection:bg-[#D4AF37] selection:text-black">
    
    <Navbar :fondoTranslucido="true" />

    <!-- SEO: H1 Oculto visualmente pero 100% visible para Google. -->
    <h1 class="sr-only">
      Palacio Nacional Medellín - Arte, Historia y Gastronomía.
    </h1>

    <!-- Video de fondo ambiental para la sección Hero -->
    <div class="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
      <video
        autoplay
        loop
        muted
        playsinline
        disablePictureInPicture
        preload="auto"
        class="w-full h-full object-cover opacity-60"
      >
        <source src="/fondo.mp4" type="video/mp4" />
        <span class="sr-only">Video de fondo del Palacio Nacional</span>
      </video>
      <div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/85 to-[#070707]"></div>
    </div>

    <!-- ========================================== -->
    <!-- 1. HERO SECTION                            -->
    <!-- ========================================== -->
    <section class="relative z-10 flex flex-col items-center justify-center min-h-[90vh] md:min-h-screen px-4 pt-28 pb-16 text-center" aria-label="Bienvenida al Palacio Nacional">
      
      <NuxtImg 
        src="/logon.png" 
        alt="Logotipo Palacio Nacional Medellín - Arte, Historia y Gastronomía" 
        fetchpriority="high"
        class="w-44 sm:w-56 md:w-64 mb-6 object-contain drop-shadow-[0_0_25px_rgba(212,175,55,0.4)] animate-fade-in-down"
      />
      
      <p class="text-xs md:text-sm tracking-[0.4em] uppercase text-[#D4AF37] font-semibold mb-3 select-none">
        Monumento Nacional • Est. 1920
      </p>

      <h2 class="text-xl sm:text-2xl md:text-4xl font-serif font-light tracking-[0.15em] mb-8 text-white drop-shadow-lg max-w-3xl leading-relaxed uppercase animate-fade-in">
        {{ t.mainTitle }}
      </h2>

      <!-- Indicador visual sutil para invitar a hacer scroll -->
      <a 
        href="#galeria" 
        @click.prevent="scrollHaciaGaleria"
        class="inline-flex flex-col items-center gap-2 text-neutral-400 hover:text-[#D4AF37] transition-colors duration-300 mt-4 group focus:outline-none cursor-pointer"
        :aria-label="t.scrollDown"
      >
        <span class="text-[10px] uppercase tracking-[0.25em] font-medium">{{ t.scrollDown }}</span>
        <svg class="w-5 h-5 animate-bounce text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </a>

    </section>

    <!-- ========================================== -->
    <!-- 2. SECCIÓN: GALERÍA DE ARTE (4 OBRAS)      -->
    <!-- ========================================== -->
    <section id="galeria" class="relative z-10 py-20 px-4 md:px-8 bg-[#070707]/95 border-t border-white/10 backdrop-blur-md" aria-label="Obras en Galería">
      <div class="max-w-7xl mx-auto">
        
        <!-- Encabezado de la sección -->
        <header class="text-center mb-14 max-w-2xl mx-auto">
          <span class="text-[10px] md:text-xs uppercase tracking-[0.35em] text-[#D4AF37] font-bold block mb-2">
            {{ t.artBadge }}
          </span>
          <h2 class="text-2xl md:text-4xl font-serif font-light uppercase tracking-wider text-white mb-4">
            {{ t.artTitle }}
          </h2>
          <p class="text-neutral-400 text-xs md:text-sm font-light leading-relaxed">
            {{ t.artDesc }}
          </p>
        </header>

        <!-- Grid de 4 Cards de obras aleatorias -->
        <div v-if="obrasHome && obrasHome.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <article 
            v-for="obra in obrasHome" 
            :key="obra.id"
            class="group bg-[#111111] border border-white/10 hover:border-[#D4AF37]/60 rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_35px_rgba(212,175,55,0.2)] flex flex-col"
          >
            <!-- Imagen de la obra -->
            <NuxtLink :to="'/DetalleObra/' + obra.id" class="relative aspect-[4/3] w-full overflow-hidden bg-neutral-900 block" :aria-label="'Ver detalle de ' + obtenerTituloObra(obra)">
              <NuxtImg 
                :src="obra.imagenPrincipal" 
                :alt="obtenerTituloObra(obra) + ' - Palacio Nacional Medellín'"
                class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
              />
              <span 
                v-if="obra.tipo" 
                class="absolute top-3 left-3 px-2.5 py-1 bg-black/75 backdrop-blur-md border border-[#D4AF37]/30 rounded-full text-[9px] uppercase tracking-widest text-[#D4AF37] font-bold select-none"
              >
                {{ obra.tipo }}
              </span>
            </NuxtLink>

            <!-- Datos de la obra -->
            <div class="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h3 class="text-base font-serif font-medium text-white group-hover:text-[#D4AF37] transition-colors truncate mb-1" :title="obtenerTituloObra(obra)">
                  {{ obtenerTituloObra(obra) }}
                </h3>
                <p class="text-xs text-neutral-400 font-light truncate mb-3">
                  <span class="text-neutral-600 font-normal">{{ t.by }}</span> {{ obra.autor || 'Autor Anónimo' }}
                </p>
              </div>

              <div class="pt-3 border-t border-white/10 flex items-center justify-between">
                <span class="text-sm font-serif text-[#D4AF37] font-bold">
                  {{ obra.precio ? ('$' + Number(String(obra.precio).replace(/[^0-9.]/g, '') || 0).toLocaleString('es-CO') + ' USD') : 'Colección' }}
                </span>
                <NuxtLink 
                  :to="'/DetalleObra/' + obra.id" 
                  class="text-[10px] uppercase tracking-widest text-neutral-300 hover:text-white flex items-center gap-1 group-hover:text-[#D4AF37] transition-colors font-medium"
                >
                  <span>{{ t.detailsBtn }}</span>
                  <span>→</span>
                </NuxtLink>
              </div>
            </div>
          </article>
        </div>

        <!-- Skeleton o Estado de Carga -->
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div v-for="n in 4" :key="n" class="h-72 bg-white/5 rounded-2xl animate-pulse border border-white/10"></div>
        </div>

        <!-- Botón Ver más obras -->
        <div class="text-center">
          <NuxtLink 
            to="/exposiciones" 
            class="inline-flex items-center gap-3 px-8 py-4 bg-[#D4AF37] text-black font-bold uppercase tracking-widest text-xs rounded-full hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.25)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#D4AF37]/40"
          >
            <span>{{ t.btnMoreArt }}</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </NuxtLink>
        </div>

      </div>
    </section>

    <!-- ========================================== -->
    <!-- 3. SECCIÓN: GASTRONOMÍA (PISO 5)           -->
    <!-- ========================================== -->
    <section class="relative z-10 py-24 px-4 md:px-8 bg-[#0a0a0a] border-t border-white/10" aria-label="Portal Gastronómico">
      <div class="max-w-6xl mx-auto">
        
        <header class="text-center mb-16 max-w-2xl mx-auto">
          <span class="text-[10px] md:text-xs uppercase tracking-[0.35em] text-[#D4AF37] font-bold block mb-2">
            {{ t.gastroBadge }}
          </span>
          <h2 class="text-2xl md:text-4xl font-serif font-light uppercase tracking-wider text-white mb-4">
            {{ t.gastroTitle }}
          </h2>
          <p class="text-neutral-400 text-xs md:text-sm font-light leading-relaxed">
            {{ t.gastroDesc }}
          </p>
        </header>

        <!-- Grid de los 3 Restaurantes -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-14">
          
          <!-- Chao Café -->
          <NuxtLink 
            to="/gastronomia/chao-cafe"
            class="group flex flex-col items-center text-center p-8 bg-[#111111] border border-white/10 hover:border-[#D4AF37] rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_35px_rgba(212,175,55,0.2)] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30"
          >
            <div class="w-24 h-24 mb-6 rounded-full border border-[#D4AF37]/30 bg-black p-3 flex items-center justify-center shadow-inner group-hover:border-[#D4AF37] transition-colors">
              <NuxtImg src="/logonc.png" alt="Logo Chao Café Artesanal" class="w-full h-full object-contain drop-shadow-md" loading="lazy" />
            </div>
            <h3 class="text-xl font-serif uppercase tracking-widest text-white group-hover:text-[#D4AF37] transition-colors mb-2">
              Chao Cafe
            </h3>
            <span class="text-[9px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold mb-3">
              Cafetería Artesanal
            </span>
            <p class="text-xs text-neutral-400 font-light leading-relaxed">
              {{ t.descCafe }}
            </p>
          </NuxtLink>

          <!-- Chao Pescao -->
          <NuxtLink 
            to="/gastronomia/chao-pescado"
            class="group flex flex-col items-center text-center p-8 bg-[#111111] border border-white/10 hover:border-[#D4AF37] rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_35px_rgba(212,175,55,0.2)] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30"
          >
            <div class="w-24 h-24 mb-6 rounded-full border border-[#D4AF37]/30 bg-black p-3 flex items-center justify-center shadow-inner group-hover:border-[#D4AF37] transition-colors">
              <NuxtImg src="/logonp.png" alt="Logo Chao Pescao Restaurante" class="w-full h-full object-contain drop-shadow-md" loading="lazy" />
            </div>
            <h3 class="text-xl font-serif uppercase tracking-widest text-white group-hover:text-[#D4AF37] transition-colors mb-2">
              Chao Pescao
            </h3>
            <span class="text-[9px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold mb-3">
              Restaurante & Bar
            </span>
            <p class="text-xs text-neutral-400 font-light leading-relaxed">
              {{ t.descPescado }}
            </p>
          </NuxtLink>

          <!-- Sky Bar -->
          <NuxtLink 
            to="/gastronomia/sky-bar"
            class="group flex flex-col items-center text-center p-8 bg-[#111111] border border-white/10 hover:border-[#D4AF37] rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_15px_35px_rgba(212,175,55,0.2)] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/30"
          >
            <div class="w-24 h-24 mb-6 rounded-full border border-[#D4AF37]/30 bg-black p-3 flex items-center justify-center shadow-inner group-hover:border-[#D4AF37] transition-colors">
              <NuxtImg src="/logons.png" alt="Logo Sky Bar Rooftop" class="w-full h-full object-contain drop-shadow-md" loading="lazy" />
            </div>
            <h3 class="text-xl font-serif uppercase tracking-widest text-white group-hover:text-[#D4AF37] transition-colors mb-2">
              Sky Bar
            </h3>
            <span class="text-[9px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold mb-3">
              Terraza Rooftop
            </span>
            <p class="text-xs text-neutral-400 font-light leading-relaxed">
              {{ t.descSky }}
            </p>
          </NuxtLink>

        </div>

        <!-- Botón Saber más -->
        <div class="text-center">
          <NuxtLink 
            to="/homegastro" 
            class="inline-flex items-center gap-3 px-8 py-4 bg-transparent border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black font-bold uppercase tracking-widest text-xs rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.15)] hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#D4AF37]/40"
          >
            <span>{{ t.btnMoreGastro }}</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </NuxtLink>
        </div>

      </div>
    </section>

    <!-- ========================================== -->
    <!-- 4. SECCIÓN: NUESTROS EVENTOS (PISO 5)      -->
    <!-- ========================================== -->
    <section class="relative z-10 py-24 px-4 md:px-8 bg-[#070707] border-t border-white/10" aria-label="Nuestros Eventos y Agenda Cultural">
      <div class="max-w-6xl mx-auto">
        
        <!-- Encabezado de la sección -->
        <header class="text-center mb-16 max-w-2xl mx-auto">
          <span class="text-[10px] md:text-xs uppercase tracking-[0.35em] text-[#D4AF37] font-bold block mb-2">
            {{ t.eventsBadge }}
          </span>
          <h2 class="text-2xl md:text-4xl font-serif font-light uppercase tracking-wider text-white mb-4">
            {{ t.eventsTitle }}
          </h2>
          <p class="text-neutral-400 text-xs md:text-sm font-light leading-relaxed">
            {{ t.eventsDesc }}
          </p>
        </header>

        <!-- Card Destacada: La Noche de Galerías -->
        <div class="bg-gradient-to-br from-[#111111] via-[#0a0a0a] to-[#14120b] border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 rounded-3xl p-6 sm:p-10 md:p-12 transition-all duration-500 shadow-2xl relative overflow-hidden group">
          <!-- Luz ambiental dorada sutil -->
          <div class="absolute -right-20 -top-20 w-72 h-72 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[#D4AF37]/15 transition-all duration-700"></div>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            
            <!-- Columna Izquierda: Información, Pilares y Botones -->
            <div class="lg:col-span-7 space-y-6">
              
              <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] sm:text-xs uppercase tracking-[0.2em] font-bold">
                <span>🌙</span>
                <span>{{ t.eventsCardBadge }}</span>
              </div>

              <h3 class="text-2xl sm:text-3xl font-serif uppercase tracking-wide text-white leading-tight">
                {{ t.eventsCardHeading }}
              </h3>

              <p class="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed text-justify sm:text-left">
                {{ t.eventsCardText }}
              </p>

              <!-- Grid de 4 Atributos Destacados -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div class="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span class="text-lg">🎖️</span>
                  <div>
                    <h4 class="text-xs font-semibold text-white">{{ t.eventsPillar1Title }}</h4>
                    <p class="text-[11px] text-neutral-400 font-light">{{ t.eventsPillar1Desc }}</p>
                  </div>
                </div>

                <div class="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span class="text-lg">🎨</span>
                  <div>
                    <h4 class="text-xs font-semibold text-white">{{ t.eventsPillar2Title }}</h4>
                    <p class="text-[11px] text-neutral-400 font-light">{{ t.eventsPillar2Desc }}</p>
                  </div>
                </div>

                <div class="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span class="text-lg">🎹</span>
                  <div>
                    <h4 class="text-xs font-semibold text-white">{{ t.eventsPillar3Title }}</h4>
                    <p class="text-[11px] text-neutral-400 font-light">{{ t.eventsPillar3Desc }}</p>
                  </div>
                </div>

                <div class="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <span class="text-lg">🍸</span>
                  <div>
                    <h4 class="text-xs font-semibold text-white">{{ t.eventsPillar4Title }}</h4>
                    <p class="text-[11px] text-neutral-400 font-light">{{ t.eventsPillar4Desc }}</p>
                  </div>
                </div>
              </div>

              <!-- Botones de Acción -->
              <div class="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <NuxtLink 
                  to="/eventos" 
                  class="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#D4AF37] text-black font-bold uppercase tracking-widest text-xs rounded-full hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.25)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#D4AF37]/40 text-center"
                >
                  <span>{{ t.btnMoreEvents }}</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </NuxtLink>

                <a 
                  href="https://wa.me/573116390177?text=Hola%20Palacio%20Nacional,%20deseo%20informaci%C3%B3n%20sobre%20la%20Noche%20de%20Galer%C3%ADas" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/15 hover:border-[#D4AF37]/50 font-bold uppercase tracking-widest text-xs rounded-full transition-all duration-300 text-center"
                >
                  <span>💬</span>
                  <span>WhatsApp</span>
                </a>
              </div>

            </div>

            <!-- Columna Derecha: Tarjeta Fotográfica de la Noche -->
            <div class="lg:col-span-5 flex justify-center">
              <div class="relative w-full max-w-sm rounded-2xl overflow-hidden border border-[#D4AF37]/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)] group/img">
                <NuxtImg 
                  src="/pa4.jpg" 
                  alt="Noche de Galerías en el Palacio Nacional Medellín" 
                  class="w-full h-80 sm:h-96 object-cover grayscale opacity-75 group-hover/img:grayscale-0 group-hover/img:opacity-100 group-hover/img:scale-105 transition-all duration-700"
                  loading="lazy"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent pointer-events-none"></div>
                
                <!-- Badge flotante de Piso y Horario -->
                <div class="absolute top-4 right-4 px-3 py-1 bg-black/80 backdrop-blur-md border border-[#D4AF37]/40 rounded-full text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest">
                  📍 Piso 5
                </div>

                <div class="absolute bottom-5 left-5 right-5 text-center sm:text-left space-y-1">
                  <span class="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold block">
                    Horario Extendido
                  </span>
                  <p class="text-sm font-serif text-white uppercase tracking-wider">
                    Hasta las 12 de la Noche
                  </p>
                  <p class="text-[10px] text-neutral-400 font-light">
                    Entrada 100% Libre y Gratuita
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>

    <!-- ========================================== -->
    <!-- 5. SECCIÓN: HISTORIA Y PATRIMONIO          -->
    <!-- ========================================== -->
    <section class="relative z-10 py-24 px-4 md:px-8 bg-[#070707] border-t border-white/10" aria-label="Historia del Palacio Nacional">
      <div class="max-w-6xl mx-auto">
        
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <!-- Columna Izquierda: Narrativa e Hitos -->
          <div class="lg:col-span-7 flex flex-col items-start">
            <span class="text-[10px] md:text-xs uppercase tracking-[0.35em] text-[#D4AF37] font-bold block mb-3">
              {{ t.historyBadge }}
            </span>
            <h2 class="text-2xl md:text-4xl font-serif font-light uppercase tracking-wider text-white mb-6 leading-tight">
              {{ t.historyTitle }}
            </h2>
            <p class="text-neutral-300 text-sm md:text-base font-light leading-relaxed mb-8 text-justify">
              {{ t.historyExcerpt }}
            </p>

            <!-- Hitos cronológicos breves -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mb-8">
              <div class="p-3 bg-white/[0.03] border border-white/10 rounded-xl">
                <span class="text-[11px] font-bold text-[#D4AF37] block mb-1">1920</span>
                <span class="text-[10px] text-neutral-400 uppercase tracking-wider block">Agustín Goovaerts</span>
              </div>
              <div class="p-3 bg-white/[0.03] border border-white/10 rounded-xl">
                <span class="text-[11px] font-bold text-[#D4AF37] block mb-1">1933</span>
                <span class="text-[10px] text-neutral-400 uppercase tracking-wider block">Palacio de Justicia</span>
              </div>
              <div class="p-3 bg-white/[0.03] border border-white/10 rounded-xl">
                <span class="text-[11px] font-bold text-[#D4AF37] block mb-1">1988</span>
                <span class="text-[10px] text-neutral-400 uppercase tracking-wider block">Monumento Nacional</span>
              </div>
            </div>

            <!-- Botón Conoce más -->
            <NuxtLink 
              to="/historia" 
              class="inline-flex items-center gap-3 px-8 py-4 bg-[#D4AF37] text-black font-bold uppercase tracking-widest text-xs rounded-full hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.25)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#D4AF37]/40"
            >
              <span>{{ t.btnMoreHistory }}</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </NuxtLink>
          </div>

          <!-- Columna Derecha: Fotografía histórica enmarcada -->
          <div class="lg:col-span-5 flex justify-center">
            <div class="relative w-full max-w-md rounded-3xl overflow-hidden border border-[#D4AF37]/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)] group">
              <NuxtImg 
                src="/pa1.jpg" 
                alt="Fotografía histórica del Palacio Nacional Medellín - 1920" 
                class="w-full h-80 sm:h-96 object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                loading="lazy"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none"></div>
              <div class="absolute bottom-4 left-4 right-4 text-center">
                <p class="text-[11px] uppercase tracking-widest text-[#D4AF37] font-semibold">
                  Palacio Nacional • Medellín
                </p>
                <p class="text-[9px] text-neutral-400 font-light">
                  Diseño de Agustín Goovaerts
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>

    <!-- ========================================== -->
    <!-- FOOTER                                     -->
    <!-- ========================================== -->
    <Footer />
  </main>
</template>

<script setup>
definePageMeta({
  layout: false
})

// === 1. SEO REACTIVO EN NUXT 3 (MÁXIMO CTR Y AUTORIDAD DE DOMINIO) ===
useSeoMeta({
  title: 'Palacio Nacional Medellín | Arte, Historia y Gastronomía',
  description: 'Descubre el histórico Palacio Nacional de Medellín. Galerías de arte contemporáneo, monumentos arquitectónicos y la mejor gastronomía en el piso 5.',
  ogTitle: '✨ Palacio Nacional Medellín | Arte, Historia y Gastronomía',
  ogDescription: 'Explora galerías de arte, descubre nuestra fascinante historia y disfruta de la mejor oferta gastronómica en el monumento más icónico de Medellín.',
  ogImage: 'https://palacionacionalmedellin.com/logon.png',
  twitterCard: 'summary_large_image',
})

const idiomaGlobal = useIdiomaGlobal()
const supabase = useSupabaseClient()

// === 2. CARGA SSR DE OBRAS ALEATORIAS ===
const { data: obrasHome } = await useAsyncData('obras-home-aleatorias', async () => {
  try {
    const { data, error } = await supabase
      .from('obras')
      .select('id, titulo, titulo_en, titulo_fr, titulo_ja, autor, tecnica, precio, imagen_1, imagen_2, imagen_3, tipo')
      .order('created_at', { ascending: false })
      .limit(40)

    if (error || !data || data.length === 0) return []

    // Filtrar aquellas que tengan al menos una imagen
    const conFoto = data.filter(o => o.imagen_1 || o.imagen_2 || o.imagen_3)
    const universo = conFoto.length >= 4 ? conFoto : data

    // Barajado aleatorio para tomar 4
    const barajadas = [...universo].sort(() => 0.5 - Math.random()).slice(0, 4)
    return barajadas.map(o => ({
      ...o,
      imagenPrincipal: o.imagen_1 || o.imagen_2 || o.imagen_3 || '/logon.png'
    }))
  } catch (err) {
    return []
  }
})

// Función reactiva para obtener el título según el idioma global
const obtenerTituloObra = (obra) => {
  if (idiomaGlobal.value === 'en' && obra.titulo_en) return obra.titulo_en
  if (idiomaGlobal.value === 'fr' && obra.titulo_fr) return obra.titulo_fr
  if (idiomaGlobal.value === 'ja' && obra.titulo_ja) return obra.titulo_ja
  return obra.titulo || 'Obra en Exhibición'
}

// === 3. TRADUCCIONES EN 4 IDIOMAS ===
const traducciones = {
  es: {
    mainTitle: 'Arte, Historia y Gastronomía en un solo lugar',
    scrollDown: 'Descubre el Palacio',
    // Obras
    artBadge: 'Colección de Arte',
    artTitle: 'Obras en Exhibición',
    artDesc: 'Descubre creaciones únicas de artistas contemporáneos que habitan los históricos pasillos del Palacio.',
    btnMoreArt: 'Ver más obras',
    by: 'Por',
    detailsBtn: 'Ver obra',
    // Gastronomía
    gastroBadge: 'Piso 5 • Zona Gastronómica',
    gastroTitle: 'Sabores en las Alturas',
    gastroDesc: 'Una cuidada propuesta culinaria que reúne café artesanal, delicias del mar y cócteles de autor con vista al corazón de Medellín.',
    btnMoreGastro: 'Saber más',
    descCafe: 'Café de especialidad colombiano, repostería exclusiva y un refugio de calma en el centro.',
    descPescado: 'El auténtico sabor del mar, mariscos frescos y cocina ejecutiva de primer nivel.',
    descSky: 'Cócteles de autor, terraza al aire libre y la vista más emblemática de la ciudad.',
    // Eventos
    eventsBadge: 'Agenda Cultural • Noche de Galerías',
    eventsTitle: 'Nuestros Eventos',
    eventsDesc: 'Vive veladas donde convergen las artes plásticas, condecoraciones al mérito cultural, música en vivo y gastronomía en el emblemático Piso 5.',
    eventsCardBadge: 'Último Jueves del Mes • 6:00 PM a 12:00 AM',
    eventsCardHeading: 'La Noche de Galerías',
    eventsCardText: 'Cada último jueves de mes, el Palacio Nacional extiende su horario habitual hasta la medianoche en el Piso 5. Una noche de bohemia artística donde se rinde homenaje a los mecenas, se sortean pinturas originales en vivo y se disfruta de música en directo y gastronomía.',
    eventsPillar1Title: 'Condecoraciones al Arte',
    eventsPillar1Desc: 'Reconocimiento solemne a quienes apoyan la cultura.',
    eventsPillar2Title: 'Sorteo de Pinturas',
    eventsPillar2Desc: 'Obras originales rifadas entre los asistentes.',
    eventsPillar3Title: 'Música en Vivo',
    eventsPillar3Desc: 'Piano acústico y sesiones de DJ en directo.',
    eventsPillar4Title: 'Gastronomía y Rooftop',
    eventsPillar4Desc: 'Chao Café, Chao Pescao y Sky Bar hasta tarde.',
    btnMoreEvents: 'Descubrir Noche de Galerías',
    // Historia
    historyBadge: 'Monumento Nacional • Desde 1920',
    historyTitle: 'Un Siglo de Memoria y Patrimonio',
    historyExcerpt: 'Inaugurado en 1933 y concebido por el visionario arquitecto belga Agustín Goovaerts, el Palacio Nacional es una joya neo-románica irrepetible. De tribunal de justicia a epicentro del arte y la cultura, sus arcos custodian más de un siglo de historia viva.',
    btnMoreHistory: 'Conoce más'
  },
  en: {
    mainTitle: 'Art, History, and Gastronomy in one place',
    scrollDown: 'Discover the Palace',
    // Obras
    artBadge: 'Art Collection',
    artTitle: 'Featured Artworks',
    artDesc: 'Discover unique creations by contemporary artists inhabiting the historic halls of the Palace.',
    btnMoreArt: 'View more artworks',
    by: 'By',
    detailsBtn: 'View artwork',
    // Gastronomía
    gastroBadge: '5th Floor • Gastronomic Area',
    gastroTitle: 'Flavors Above the City',
    gastroDesc: 'A curated culinary experience bringing together artisanal coffee, ocean delicacies, and signature cocktails overlooking Medellin.',
    btnMoreGastro: 'Learn more',
    descCafe: 'Colombian specialty coffee, exclusive pastries, and a peaceful haven in downtown.',
    descPescado: 'The authentic taste of the sea, fresh seafood, and top-tier executive cuisine.',
    descSky: 'Signature cocktails, open-air terrace, and the city\'s most iconic panoramic view.',
    // Eventos
    eventsBadge: 'Cultural Agenda • Gallery Night',
    eventsTitle: 'Our Events',
    eventsDesc: 'Experience evenings where fine arts, cultural honors, live music, and dining merge on the iconic 5th floor.',
    eventsCardBadge: 'Last Thursday of the Month • 6:00 PM to 12:00 AM',
    eventsCardHeading: 'Gallery Night (Noche de Galerías)',
    eventsCardText: 'Every last Thursday of the month, Palacio Nacional extends its schedule until midnight on Floor 5. An artistic evening honoring cultural patrons, featuring live original painting giveaways, live music, and rooftop dining.',
    eventsPillar1Title: 'Cultural Honors',
    eventsPillar1Desc: 'Solemn recognition to arts benefactors and patrons.',
    eventsPillar2Title: 'Painting Giveaways',
    eventsPillar2Desc: 'Original paintings raffled live among attendees.',
    eventsPillar3Title: 'Live Music',
    eventsPillar3Desc: 'Acoustic grand piano and live DJ sets.',
    eventsPillar4Title: 'Dining & Rooftop',
    eventsPillar4Desc: 'Chao Café, Chao Pescao, and Sky Bar open late.',
    btnMoreEvents: 'Explore Gallery Night',
    // Historia
    historyBadge: 'National Monument • Since 1920',
    historyTitle: 'A Century of Heritage and Memory',
    historyExcerpt: 'Opened in 1933 and conceived by visionary Belgian architect Agustín Goovaerts, the Palacio Nacional is an irreplaceable Neo-Romanesque jewel. From high court of justice to cultural sanctuary, its arches guard over a century of living history.',
    btnMoreHistory: 'Learn more'
  },
  fr: {
    mainTitle: 'Art, Histoire et Gastronomie en un seul lieu',
    scrollDown: 'Découvrez le Palais',
    // Obras
    artBadge: 'Collection d\'Art',
    artTitle: 'Œuvres en Exposition',
    artDesc: 'Découvrez les créations uniques d\'artistes contemporains qui animent les couloirs historiques du Palais.',
    btnMoreArt: 'Voir plus d\'œuvres',
    by: 'Par',
    detailsBtn: 'Voir l\'œuvre',
    // Gastronomía
    gastroBadge: '5ème Étage • Zone Gastronomique',
    gastroTitle: 'Saveurs sur les Hauteurs',
    gastroDesc: 'Une expérience culinaire raffinée réunissant café artisanal, délices de la mer et cocktails signature au cœur de Medellín.',
    btnMoreGastro: 'En savoir plus',
    descCafe: 'Café de spécialité colombien, pâtisserie exclusive et havre de paix au centre-ville.',
    descPescado: 'Le goût authentique de la mer, fruits de mer frais et cuisine de haute volée.',
    descSky: 'Cocktails signature, terrasse à ciel ouvert et vue panoramique emblématique.',
    // Eventos
    eventsBadge: 'Agenda Culturel • Nuit des Galeries',
    eventsTitle: 'Nos Événements',
    eventsDesc: 'Vivez des soirées où convergent les beaux-arts, les hommages culturels, la musique en direct et la gastronomie au 5e étage.',
    eventsCardBadge: 'Dernier Jeudi du Mois • 18h00 à 00h00',
    eventsCardHeading: 'La Nuit des Galeries',
    eventsCardText: 'Chaque dernier jeudi du mois, le Palacio Nacional prolonge ses horaires jusqu\'à minuit au 5e étage. Une soirée artistique rendant hommage aux mécènes, avec tirage au sort de peintures originales, musique en direct et gastronomie.',
    eventsPillar1Title: 'Mérite Culturel',
    eventsPillar1Desc: 'Hommage solennel aux bienfaiteurs de la création.',
    eventsPillar2Title: 'Tirage de Peintures',
    eventsPillar2Desc: 'Peintures originales offertes aux visiteurs inscrits.',
    eventsPillar3Title: 'Musique en Direct',
    eventsPillar3Desc: 'Piano acoustique et élégantes sessions de DJ.',
    eventsPillar4Title: 'Gastronomie & Terrasse',
    eventsPillar4Desc: 'Chao Café, Chao Pescao et Sky Bar ouverts tard.',
    btnMoreEvents: 'Découvrir la Nuit des Galeries',
    // Historia
    historyBadge: 'Monument National • Depuis 1920',
    historyTitle: 'Un Siècle de Mémoire et Patrimoine',
    historyExcerpt: 'Inauguré en 1933 et conçu par l\'architecte belge visionnaire Agustín Goovaerts, le Palacio Nacional est un joyau néo-roman unique. D\'ancien palais de justice à sanctuaire artistique, ses arches racontent un siècle d\'histoire.',
    btnMoreHistory: 'En savoir plus'
  },
  ja: {
    mainTitle: '芸術、歴史、美食がひとつに',
    scrollDown: '宮殿を探索する',
    // Obras
    artBadge: 'アートコレクション',
    artTitle: '展示作品',
    artDesc: '宮殿の歴史的な回廊を彩る現代アーティストの個性豊かな作品の数々。',
    btnMoreArt: 'もっと作品を見る',
    by: '作',
    detailsBtn: '詳細を見る',
    // Gastronomía
    gastroBadge: '5階 • ガストロノミーエリア',
    gastroTitle: '高台の味覚',
    gastroDesc: '職人技のコーヒー、新鮮なシーフード、メデジンの中心街を望むシグネチャーカクテルをご堪能ください。',
    btnMoreGastro: '詳細はこちら',
    descCafe: 'コロンビア特選コーヒー、手作りスイーツ、都心の静寂な隠れ家。',
    descPescado: '海の本格的な風味、新鮮な魚介類、最高峰の料理。',
    descSky: '特製カクテル、オープンエアテラス、市内随一のパノラマビュー。',
    // Eventos
    eventsBadge: '公式文化イベント • ギャラリー・ナイト',
    eventsTitle: '注目のイベント',
    eventsDesc: '5階フロアで繰り広げられる美術、文化功労者への顕彰、生演奏、そして美食が融合する特別な夜。',
    eventsCardBadge: '毎月最終木曜日 • 午後6:00 ～ 深夜12:00',
    eventsCardHeading: 'ギャラリー・ナイト（Noche de Galerias）',
    eventsCardText: '毎月最終木曜日、メデジン国立宮殿は5階フロアで深夜12時まで開館時間を特別延長します。芸術支援者への叙勲式、本物の絵画作品が当たる生抽選会、ピアノ生演奏やDJセット、そしてテラスでの美食をお楽しみいただけます。',
    eventsPillar1Title: '文化功労者への顕彰',
    eventsPillar1Desc: '芸術の振興に尽力した支援者を称える叙勲式。',
    eventsPillar2Title: '絵画作品の生抽選会',
    eventsPillar2Desc: '来場者の中から本物の絵画作品をその場で抽選。',
    eventsPillar3Title: '生演奏',
    eventsPillar3Desc: 'アコースティックピアノ演奏とDJライブセット。',
    eventsPillar4Title: '美食＆ルーフトップ',
    eventsPillar4Desc: 'Chao Cafe、Chao Pescao、Sky Barが深夜まで営業。',
    btnMoreEvents: 'イベント詳細を見る',
    // Historia
    historyBadge: '国定記念物 • 1920年より',
    historyTitle: '遺産と記憶の一世紀',
    historyExcerpt: '1933年に開館し、ベルギーの先見の明のある建築家アグスティン・ゴーヴァルツによって構想されたパラシオ・ナシオナルは、比類なきネオ・ロマネスクの宝石です。かつての裁判所から芸術の聖域へと生まれ変わり、1世紀を超える歴史を見守っています。',
    btnMoreHistory: '詳しく知る'
  }
}

const t = computed(() => traducciones[idiomaGlobal.value] || traducciones['es'])

// Desplazamiento suave y cinematográfico hacia la sección de Galería
const scrollHaciaGaleria = () => {
  if (!import.meta.client) return
  const destino = document.getElementById('galeria')
  if (!destino) return

  const inicio = window.scrollY || window.pageYOffset
  // Margen superior para compensar la barra de navegación persistente
  const margenSuperior = 60
  const fin = destino.getBoundingClientRect().top + inicio - margenSuperior
  const distancia = fin - inicio
  const duracion = 950 // ms para una transición elegante y pausada
  let inicioTiempo = null
  let animacionId = null

  const limpiarEventos = () => {
    window.removeEventListener('wheel', interrumpir)
    window.removeEventListener('touchmove', interrumpir)
  }

  const interrumpir = () => {
    if (animacionId) cancelAnimationFrame(animacionId)
    limpiarEventos()
  }

  window.addEventListener('wheel', interrumpir, { passive: true, once: true })
  window.addEventListener('touchmove', interrumpir, { passive: true, once: true })

  const animar = (tiempoActual) => {
    if (!inicioTiempo) inicioTiempo = tiempoActual
    const transcurrido = tiempoActual - inicioTiempo
    const progreso = Math.min(transcurrido / duracion, 1)

    // Curva easeInOutCubic: inicio suave, aceleración sutil y frenado orgánico
    const ease = progreso < 0.5
      ? 4 * progreso * progreso * progreso
      : 1 - Math.pow(-2 * progreso + 2, 3) / 2

    window.scrollTo(0, inicio + distancia * ease)

    if (progreso < 1) {
      animacionId = requestAnimationFrame(animar)
    } else {
      limpiarEventos()
    }
  }

  animacionId = requestAnimationFrame(animar)
}

// === 4. SCHEMA LOCAL BUSINESS (Optimizando para Google Maps y Búsquedas) ===
useHead({
  link: [
    { rel: "canonical", href: "https://palacionacionalmedellin.com/" }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TouristAttraction",
        "name": "Palacio Nacional Medellín",
        "description": "Monumento histórico en Medellín dedicado a la exhibición de arte contemporáneo, la preservación de la historia y la alta gastronomía.",
        "url": "https://palacionacionalmedellin.com/",
        "logo": "https://palacionacionalmedellin.com/logon.png",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Carrera 52 # 48-45",
          "addressLocality": "Medellín",
          "addressRegion": "Antioquia",
          "addressCountry": "CO"
        },
        "hasMap": "https://www.google.com/maps?cid=14092102146313754178",
        "department": [
          {
            "@type": "ArtGallery",
            "name": "Galería de Arte Palacio Nacional"
          },
          {
            "@type": "FoodEstablishment",
            "name": "Zona Gastronómica"
          }
        ]
      })
    }
  ]
})
</script>

<style>
html {
  scroll-behavior: smooth;
}
</style>

<style scoped>
.animate-fade-in-down {
  animation: fadeInDown 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.animate-fade-in {
  opacity: 0;
  animation: fadeIn 1.2s ease-in forwards 0.3s;
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>