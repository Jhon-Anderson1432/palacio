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
        class="inline-flex flex-col items-center gap-2 text-neutral-400 hover:text-[#D4AF37] transition-colors duration-300 mt-4 group focus:outline-none"
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
    <!-- 4. SECCIÓN: HISTORIA Y PATRIMONIO          -->
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
    // Historia
    historyBadge: '国定記念物 • 1920年より',
    historyTitle: '遺産と記憶の一世紀',
    historyExcerpt: '1933年に開館し、ベルギーの先見の明のある建築家アグスティン・ゴーヴァルツによって構想されたパラシオ・ナシオナルは、比類なきネオ・ロマネスクの宝石です。かつての裁判所から芸術の聖域へと生まれ変わり、1世紀を超える歴史を見守っています。',
    btnMoreHistory: '詳しく知る'
  }
}

const t = computed(() => traducciones[idiomaGlobal.value] || traducciones['es'])

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
          "streetAddress": "Carrera 52 # 52-43",
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