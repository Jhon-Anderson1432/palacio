<template>
  <main 
    class="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-[#D4AF37] selection:text-black antialiased relative overflow-hidden flex flex-col pt-28"
    role="main"
    aria-label="Agenda de Eventos Culturales - Palacio Nacional Medellín"
  >
    <!-- Iluminación Ambiental de Fondo -->
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] h-[450px] bg-gradient-to-b from-[#D4AF37]/15 via-[#D4AF37]/5 to-transparent blur-[140px] pointer-events-none rounded-full"></div>
    <div class="absolute top-1/3 -right-40 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none"></div>

    <!-- Barra de Navegación Global -->
    <Navbar />

    <!-- ======================================================== -->
    <!-- 1. ENCABEZADO / HERO DE EVENTOS                          -->
    <!-- ======================================================== -->
    <header class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-6 pb-12 sm:pb-16 w-full">
      
      <!-- Migas de Pan (Breadcrumbs) -->
      <nav aria-label="Migas de pan" class="flex items-center justify-center gap-2 text-[11px] uppercase tracking-widest text-neutral-400 mb-6 font-medium">
        <NuxtLink to="/" class="hover:text-[#D4AF37] transition-colors focus:outline-none focus:text-[#D4AF37]">{{ t.home }}</NuxtLink>
        <span class="text-neutral-600">/</span>
        <span class="text-[#D4AF37]">{{ t.breadcrumb }}</span>
      </nav>

      <!-- Badge de Sección -->
      <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[11px] sm:text-xs uppercase tracking-[0.25em] font-bold mb-6 backdrop-blur-md shadow-[0_0_20px_rgba(212,175,55,0.15)] animate-fade-in">
        <span class="w-2 h-2 rounded-full bg-[#D4AF37] animate-ping"></span>
        <span>✨ {{ t.heroBadge }}</span>
      </div>

      <!-- Título Principal -->
      <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-light tracking-wide text-white uppercase mb-6 leading-tight drop-shadow-md">
        {{ t.heroTitle }}
      </h1>

      <!-- Descripción General -->
      <p class="text-xs sm:text-sm md:text-base text-neutral-300 font-light max-w-3xl mx-auto leading-relaxed mb-8">
        {{ t.heroSubtitle }}
      </p>

    </header>

    <!-- ======================================================== -->
    <!-- 2. BANNER DE CUENTA REGRESIVA & PRÓXIMA EDICIÓN          -->
    <!-- ======================================================== -->
    <section class="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-14" aria-label="Próxima fecha confirmada">
      <div class="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-neutral-900/90 via-black to-neutral-900/90 border border-[#D4AF37]/40 shadow-[0_15px_45px_rgba(212,175,55,0.15)] backdrop-blur-xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-6 sm:gap-8">
        
        <div class="absolute -right-16 -top-16 w-56 h-56 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none"></div>

        <!-- Información de la Fecha -->
        <div class="space-y-2 text-center lg:text-left relative z-10">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] uppercase tracking-widest font-bold">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            {{ t.nextBadge }}
          </div>
          <h2 class="text-xl sm:text-2xl font-serif text-white uppercase tracking-wide">
            {{ t.nextTitle }}
          </h2>
          <p class="text-sm sm:text-base text-[#D4AF37] font-medium tracking-wide flex items-center justify-center lg:justify-start gap-2">
            <span>📅</span>
            <span class="capitalize">{{ fechaFormateada }}</span>
          </p>
          <p class="text-xs text-neutral-400">
            ⏰ {{ t.scheduleTag }} &bull; 📍 {{ t.locationTag }}
          </p>
        </div>

        <!-- Reloj de Cuenta Regresiva -->
        <div class="flex items-center gap-2 sm:gap-3 text-center relative z-10 select-none">
          <div class="bg-black/60 border border-white/10 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 min-w-[60px] sm:min-w-[70px]">
            <span class="block text-xl sm:text-2xl md:text-3xl font-mono font-bold text-[#D4AF37]">{{ diasRestantes }}</span>
            <span class="text-[9px] sm:text-[10px] text-neutral-400 uppercase tracking-widest">{{ t.countdownDays }}</span>
          </div>
          <span class="text-xl text-[#D4AF37]/60 font-mono">:</span>
          <div class="bg-black/60 border border-white/10 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 min-w-[60px] sm:min-w-[70px]">
            <span class="block text-xl sm:text-2xl md:text-3xl font-mono font-bold text-white">{{ horasRestantes }}</span>
            <span class="text-[9px] sm:text-[10px] text-neutral-400 uppercase tracking-widest">{{ t.countdownHours }}</span>
          </div>
          <span class="text-xl text-[#D4AF37]/60 font-mono">:</span>
          <div class="bg-black/60 border border-white/10 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 min-w-[60px] sm:min-w-[70px]">
            <span class="block text-xl sm:text-2xl md:text-3xl font-mono font-bold text-white">{{ minutosRestantes }}</span>
            <span class="text-[9px] sm:text-[10px] text-neutral-400 uppercase tracking-widest">{{ t.countdownMinutes }}</span>
          </div>
          <span class="text-xl text-[#D4AF37]/60 font-mono">:</span>
          <div class="bg-black/60 border border-white/10 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 min-w-[60px] sm:min-w-[70px]">
            <span class="block text-xl sm:text-2xl md:text-3xl font-mono font-bold text-white">{{ segundosRestantes }}</span>
            <span class="text-[9px] sm:text-[10px] text-neutral-400 uppercase tracking-widest">{{ t.countdownSeconds }}</span>
          </div>
        </div>

        <!-- Botones de Acción Inmediata -->
        <div class="flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full sm:w-auto relative z-10">
          <a 
            :href="urlGoogleCalendar" 
            target="_blank" 
            rel="noopener noreferrer"
            class="px-5 py-2.5 bg-[#D4AF37] hover:bg-white text-black font-bold uppercase tracking-widest text-[11px] rounded-xl transition-all duration-300 text-center shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] flex items-center justify-center gap-2"
          >
            <span>🗓️</span>
            <span>{{ t.btnAddToCalendar }}</span>
          </a>
        </div>

      </div>
    </section>

    <!-- ======================================================== -->
    <!-- 3. PRESENTACIÓN DEL EVENTO INSIGNIA: NOCHE DE GALERÍAS   -->
    <!-- ======================================================== -->
    <section class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-20" aria-label="Detalles del Evento Insignia">
      
      <!-- Ficha de Encabezado del Evento -->
      <article class="bg-gradient-to-b from-white/[0.04] to-black border border-white/10 hover:border-[#D4AF37]/40 rounded-3xl p-6 sm:p-10 md:p-12 transition-all duration-500 shadow-2xl relative overflow-hidden mb-12">
        <div class="max-w-3xl space-y-4">
          <span class="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.25em] block">
            🌙 {{ t.eventFlagshipBadge }}
          </span>
          <h2 class="text-3xl sm:text-4xl md:text-5xl font-serif text-white uppercase tracking-wide leading-tight">
            {{ t.eventTitle }}
          </h2>
          <p class="text-neutral-300 text-xs sm:text-sm md:text-base font-light leading-relaxed text-justify sm:text-left">
            {{ t.eventDescription }}
          </p>
        </div>

        <!-- Etiquetas Destacadas (Horario Extendido, Periodicidad, Acceso) -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/10">
          <div class="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <span class="text-2xl block mb-1">⏰</span>
            <h3 class="text-xs uppercase tracking-widest text-[#D4AF37] font-bold mb-1">{{ t.featureHoursTitle }}</h3>
            <p class="text-xs text-neutral-300 font-light">{{ t.featureHoursDesc }}</p>
          </div>
          <div class="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <span class="text-2xl block mb-1">🗓️</span>
            <h3 class="text-xs uppercase tracking-widest text-[#D4AF37] font-bold mb-1">{{ t.featureFreqTitle }}</h3>
            <p class="text-xs text-neutral-300 font-light">{{ t.featureFreqDesc }}</p>
          </div>
          <div class="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
            <span class="text-2xl block mb-1">🎟️</span>
            <h3 class="text-xs uppercase tracking-widest text-[#D4AF37] font-bold mb-1">{{ t.featureAccessTitle }}</h3>
            <p class="text-xs text-neutral-300 font-light">{{ t.featureAccessDesc }}</p>
          </div>
        </div>
      </article>

      <!-- ======================================================== -->
      <!-- 4. LOS 5 PILARES DE LA NOCHE DE GALERÍAS                 -->
      <!-- ======================================================== -->
      <div class="text-center mb-10">
        <h3 class="text-2xl sm:text-3xl font-serif text-white uppercase tracking-wide mb-3">
          {{ t.pillarsHeading }}
        </h3>
        <p class="text-xs sm:text-sm text-neutral-400 font-light max-w-2xl mx-auto">
          {{ t.pillarsSubheading }}
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
        
        <!-- Pilar 1: Condecoraciones -->
        <div class="p-7 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-[#D4AF37]/50 transition-all duration-300 flex flex-col justify-between group">
          <div class="space-y-3">
            <span class="text-3xl block group-hover:scale-110 transition-transform">🎖️</span>
            <h4 class="text-lg font-serif text-white group-hover:text-[#D4AF37] transition-colors uppercase tracking-wider">
              {{ t.pillar1Title }}
            </h4>
            <p class="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed text-justify">
              {{ t.pillar1Desc }}
            </p>
          </div>
          <div class="mt-4 pt-3 border-t border-white/5 text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest">
            {{ t.pillar1Tag }}
          </div>
        </div>

        <!-- Pilar 2: Sorteos de Obras -->
        <div class="p-7 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-[#D4AF37]/50 transition-all duration-300 flex flex-col justify-between group">
          <div class="space-y-3">
            <span class="text-3xl block group-hover:scale-110 transition-transform">🎨</span>
            <h4 class="text-lg font-serif text-white group-hover:text-[#D4AF37] transition-colors uppercase tracking-wider">
              {{ t.pillar2Title }}
            </h4>
            <p class="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed text-justify">
              {{ t.pillar2Desc }}
            </p>
          </div>
          <div class="mt-4 pt-3 border-t border-white/5 text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest">
            {{ t.pillar2Tag }}
          </div>
        </div>

        <!-- Pilar 3: Música en Vivo -->
        <div class="p-7 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-[#D4AF37]/50 transition-all duration-300 flex flex-col justify-between group">
          <div class="space-y-3">
            <span class="text-3xl block group-hover:scale-110 transition-transform">🎹</span>
            <h4 class="text-lg font-serif text-white group-hover:text-[#D4AF37] transition-colors uppercase tracking-wider">
              {{ t.pillar3Title }}
            </h4>
            <p class="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed text-justify">
              {{ t.pillar3Desc }}
            </p>
          </div>
          <div class="mt-4 pt-3 border-t border-white/5 text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest">
            {{ t.pillar3Tag }}
          </div>
        </div>

        <!-- Pilar 4: Recorrido Nocturno -->
        <div class="p-7 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-[#D4AF37]/50 transition-all duration-300 flex flex-col justify-between group">
          <div class="space-y-3">
            <span class="text-3xl block group-hover:scale-110 transition-transform">🏛️</span>
            <h4 class="text-lg font-serif text-white group-hover:text-[#D4AF37] transition-colors uppercase tracking-wider">
              {{ t.pillar4Title }}
            </h4>
            <p class="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed text-justify">
              {{ t.pillar4Desc }}
            </p>
          </div>
          <div class="mt-4 pt-3 border-t border-white/5 text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest">
            {{ t.pillar4Tag }}
          </div>
        </div>

        <!-- Pilar 5: Gastronomía & Piso 5 -->
        <div class="p-7 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 hover:border-[#D4AF37]/50 transition-all duration-300 flex flex-col justify-between group md:col-span-2 lg:col-span-2">
          <div class="space-y-3">
            <span class="text-3xl block group-hover:scale-105 transition-transform">🍸</span>
            <h4 class="text-lg font-serif text-white group-hover:text-[#D4AF37] transition-colors uppercase tracking-wider">
              {{ t.pillar5Title }}
            </h4>
            <p class="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed text-justify">
              {{ t.pillar5Desc }}
            </p>
          </div>
          <div class="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-3">
            <span class="text-[10px] text-[#D4AF37] font-bold uppercase tracking-widest">{{ t.pillar5Tag }}</span>
            <NuxtLink to="/homegastro" class="text-xs text-[#D4AF37] hover:underline font-medium flex items-center gap-1">
              <span>{{ t.exploreGastroLink }}</span>
              <span>&rarr;</span>
            </NuxtLink>
          </div>
        </div>

      </div>

      <!-- ======================================================== -->
      <!-- 5. CTA DE CONTACTO Y RESERVA                             -->
      <!-- ======================================================== -->
      <div class="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-neutral-900 via-black to-neutral-900 border border-[#D4AF37]/40 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
        <div class="absolute -right-12 -top-12 w-48 h-48 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none"></div>

        <div class="space-y-2 max-w-xl relative z-10">
          <span class="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.2em] block">🎟️ {{ t.ctaBadge }}</span>
          <h3 class="text-xl sm:text-2xl font-serif text-white uppercase tracking-wide">
            {{ t.ctaTitle }}
          </h3>
          <p class="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
            {{ t.ctaDesc }}
          </p>
        </div>

        <div class="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto relative z-10">
          <NuxtLink 
            to="/contactos" 
            class="w-full sm:w-auto px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white border border-white/15 hover:border-white/30 font-bold uppercase tracking-widest text-xs rounded-xl transition-all duration-300 text-center"
          >
            {{ t.ctaContactBtn }}
          </NuxtLink>
        </div>
      </div>

    </section>

    <!-- Pie de Página Oficial -->
    <Footer />

  </main>
</template>

<script setup>
// Desactiva el layout global para renderizar la página a medida
definePageMeta({
  layout: false
})

// ESTADO GLOBAL SSR NUXT 3
const idiomaGlobal = useState('idiomaGlobal', () => 'es')

// ========================================================
// 1. BANCO DE TRADUCCIONES INTEGRAL (ES, EN, FR, JA)
// ========================================================
const TRADUCCIONES = {
  es: {
    home: 'Inicio',
    breadcrumb: 'Eventos',
    heroBadge: 'Agenda Cultural Oficial',
    heroTitle: 'Nuestros Eventos',
    heroSubtitle: 'Descubre veladas inolvidables donde convergen el arte contemporáneo, homenajes al mérito cultural, música en vivo y gastronomía en el emblemático Palacio Nacional de Medellín.',
    nextBadge: 'Próxima Edición Confirmada',
    nextTitle: 'La Noche de Galerías',
    scheduleTag: '6:00 PM – 12:00 AM (Medianoche)',
    locationTag: 'Palacio Nacional (Piso 5)',
    countdownDays: 'Días',
    countdownHours: 'Horas',
    countdownMinutes: 'Min',
    countdownSeconds: 'Seg',
    btnAddToCalendar: 'Agendar en Calendario',
    eventFlagshipBadge: 'Evento Insignia del Palacio Nacional',
    eventTitle: 'La Noche de Galerías',
    eventDescription: 'Cada último jueves de mes, el Palacio Nacional se transforma en el epicentro de la bohemia artística de Medellín. En una atmósfera nocturna única con horario extendido hasta las 12:00 de la medianoche, las galerías abren sus puertas para rendir tributo a quienes impulsan la cultura, premiar a los asistentes con sorteos de arte y deleitar con música en directo y gastronomía de altura.',
    featureHoursTitle: 'Horario Extendido',
    featureHoursDesc: 'De 6:00 PM hasta las 12:00 de la noche (acceso continuo a galerías y piso 5).',
    featureFreqTitle: 'Periodicidad',
    featureFreqDesc: 'El último jueves de cada mes ininterrumpidamente (este año en diciembre no aplica por ser 24 y 31, por lo que se adelanta al jueves 17 de diciembre).',
    featureAccessTitle: 'Entrada Libre',
    featureAccessDesc: 'Acceso 100% gratuito y abierto a todo el público hasta completar aforo.',
    pillarsHeading: '¿Qué vivirás en La Noche de Galerías?',
    pillarsSubheading: 'Cinco vivencias diseñadas para conectar al público con la riqueza del arte contemporáneo y el patrimonio arquitectónico.',
    pillar1Title: 'Condecoraciones al Mérito Cultural',
    pillar1Desc: 'Solemne acto de reconocimiento a gestores, mecenas, empresarios y coleccionistas que con su respaldo fortalecen el ecosistema de las artes plásticas en Colombia.',
    pillar1Tag: 'Homenajes & Gratitud',
    pillar2Title: 'Sorteo de Obras de Arte Originales',
    pillar2Desc: 'Durante la velada se realizan rifas y sorteos en vivo de pinturas originales avaladas por nuestra curaduría, obsequiadas a los asistentes registrados.',
    pillar2Tag: 'Coleccionismo en Vivo',
    pillar3Title: 'Música en Vivo',
    pillar3Desc: 'Una cuidada ambientación sonora que fusiona recitales íntimos de piano clásico y contemporáneo con elegantes sesiones de DJ en vivo en los corredores y terrazas.',
    pillar3Tag: 'Atmósfera Sonora',
    pillar4Title: 'Recorrido Nocturno por Galerías',
    pillar4Desc: 'Iluminación patrimonial especial para contemplar con calma más de 300 pinturas y esculturas de maestros consagrados y nuevos talentos en todos los niveles.',
    pillar4Tag: 'Arte & Arquitectura',
    pillar5Title: 'Gastronomía y Rooftop Piso 5',
    pillar5Desc: 'Cocina gourmet en Chao Pescao, café de especialidad en Chao Café y coctelería de autor en la terraza panorámica de Sky Bar, todos con servicio nocturno continuo.',
    pillar5Tag: 'Piso 5 Bohemio',
    exploreGastroLink: 'Ver cartas de gastronomía',
    ctaBadge: 'Asiste a la Próxima Edición',
    ctaTitle: '¿Deseas más información?',
    ctaDesc: 'Escríbenos a nuestra línea oficial de atención para resolver inquietudes sobre el evento.',
    ctaContactBtn: 'Formulario de Contacto'
  },
  en: {
    home: 'Home',
    breadcrumb: 'Events',
    heroBadge: 'Official Cultural Agenda',
    heroTitle: 'Our Events',
    heroSubtitle: 'Discover unforgettable evenings where contemporary fine art, cultural honors, live music, and rooftop dining merge in the historic heart of Medellin.',
    nextBadge: 'Next Edition Confirmed',
    nextTitle: 'Gallery Night',
    scheduleTag: '6:00 PM – 12:00 AM (Midnight)',
    locationTag: 'Palacio Nacional (Floor 5)',
    countdownDays: 'Days',
    countdownHours: 'Hours',
    countdownMinutes: 'Min',
    countdownSeconds: 'Sec',
    btnAddToCalendar: 'Add to Calendar',
    eventFlagshipBadge: 'Flagship Event of Palacio Nacional',
    eventTitle: 'Gallery Night (Noche de Galerías)',
    eventDescription: 'On the last Thursday of every month, Palacio Nacional turns into Medellin\'s nocturnal cultural hub. With extended hours until midnight (12:00 AM), our galleries open to honor art patrons, hold live fine-art giveaways, and treat guests to live piano, DJ sessions, and high-altitude dining.',
    featureHoursTitle: 'Extended Schedule',
    featureHoursDesc: 'From 6:00 PM to 12:00 Midnight (open access to all galleries and 5th floor).',
    featureFreqTitle: 'Frequency',
    featureFreqDesc: 'Every last Thursday of the month year-round (does not apply in December this year as the last Thursdays fall on Dec 24 and 31, moving it forward to Thursday, December 17).',
    featureAccessTitle: 'Free Admission',
    featureAccessDesc: '100% free and open to the public on a first-come, first-served basis.',
    pillarsHeading: 'What to Experience at Gallery Night',
    pillarsSubheading: 'Five curated highlights designed to immerse visitors in contemporary art and architectural heritage.',
    pillar1Title: 'Cultural Patronage Honors',
    pillar1Desc: 'A solemn ceremony presenting decorations to benefactors, patrons, and cultural leaders whose support empowers Colombian visual arts.',
    pillar1Tag: 'Tribute & Gratitude',
    pillar2Title: 'Live Original Artwork Raffles',
    pillar2Desc: 'Throughout the evening, authentic original paintings curated by our team are raffled live to registered guests.',
    pillar2Tag: 'Live Art Collector Experience',
    pillar3Title: 'Live Music',
    pillar3Desc: 'An elegant musical atmosphere blending classical and contemporary grand piano recitals with tasteful live DJ sets along corridors and rooftops.',
    pillar3Tag: 'Sound Atmosphere',
    pillar4Title: 'Nocturnal Gallery Tour',
    pillar4Desc: 'Special night lighting to admire over 300 paintings and sculptures by renowned masters and emerging talents across all architectural floors.',
    pillar4Tag: 'Art & Heritage',
    pillar5Title: 'Dining & Rooftop 5th Floor',
    pillar5Desc: 'Gourmet dining at Chao Pescao, specialty coffee at Chao Café, and signature cocktails at the Sky Bar rooftop terrace, all open late.',
    pillar5Tag: 'Bohemian 5th Floor',
    exploreGastroLink: 'Explore dining menus',
    ctaBadge: 'Join the Next Edition',
    ctaTitle: 'Need more information?',
    ctaDesc: 'Message our official concierge on WhatsApp for questions regarding the event.',
    ctaContactBtn: 'Contact Form'
  },
  fr: {
    home: 'Accueil',
    breadcrumb: 'Événements',
    heroBadge: 'Agenda Culturel Officiel',
    heroTitle: 'Nos Événements',
    heroSubtitle: 'Découvrez des soirées inoubliables où convergent l\'art contemporain, les hommages culturels, la musique en direct et la haute gastronomie au cœur historique de Medellín.',
    nextBadge: 'Prochaine Édition Confirmée',
    nextTitle: 'La Nuit des Galeries',
    scheduleTag: '18h00 – 00h00 (Minuit)',
    locationTag: 'Palacio Nacional (5e Étage)',
    countdownDays: 'Jours',
    countdownHours: 'Heures',
    countdownMinutes: 'Min',
    countdownSeconds: 'Sec',
    btnAddToCalendar: 'Ajouter au Calendrier',
    eventFlagshipBadge: 'Événement Phare du Palais National',
    eventTitle: 'La Nuit des Galeries',
    eventDescription: 'Chaque dernier jeudi du mois, le Palacio Nacional devient l\'épicentre de la bohème artistique de Medellín. Avec des horaires prolongés jusqu\'à minuit (00h00), les galeries ouvrent leurs portes pour rendre hommage aux mécènes, offrir des tirages d\'œuvres d\'art et enchanter avec du piano en direct et une gastronomie de terrasse.',
    featureHoursTitle: 'Horaires Prolongés',
    featureHoursDesc: 'De 18h00 à 00h00 minuit (accès continu aux galeries et au 5e étage).',
    featureFreqTitle: 'Périodicité',
    featureFreqDesc: 'Le dernier jeudi de chaque mois sans interruption (ne s\'applique pas en décembre cette année car les derniers jeudis tombent les 24 et 31 décembre, l\'événement est donc avancé au jeudi 17 décembre).',
    featureAccessTitle: 'Entrée Gratuite',
    featureAccessDesc: 'Accès 100% gratuit et ouvert à tous dans la limite des places disponibles.',
    pillarsHeading: 'Que Vivrez-vous lors de la Nuit des Galeries ?',
    pillarsSubheading: 'Cinq expériences conçues pour relier le public aux richesses de l\'art contemporain et au patrimoine architectural.',
    pillar1Title: 'Décorations du Mérite Culturel',
    pillar1Desc: 'Cérémonie solennelle rendant hommage aux mécènes, collectionneurs et personnalités qui soutiennent activement la création artistique.',
    pillar1Tag: 'Hommage & Gratitude',
    pillar2Title: 'Tirage au Sort d\'Œuvres d\'Art',
    pillar2Desc: 'Tout au long de la soirée, des peintures originales certifiées sont tirées au sort en direct pour les visiteurs inscrits.',
    pillar2Tag: 'Collection en Direct',
    pillar3Title: 'Musique en Direct',
    pillar3Desc: 'Une ambiance sonore raffinée alternant récitals de piano acoustique et élégantes sessions de DJ en direct dans les couloirs et terrasses.',
    pillar3Tag: 'Ambiance Musicale',
    pillar4Title: 'Visite Nocturne des Galeries',
    pillar4Desc: 'Éclairage architectural spécial pour contempler plus de 300 œuvres d\'art de maîtres consacrés et de talents émergents.',
    pillar4Tag: 'Art & Patrimoine',
    pillar5Title: 'Gastronomie & Terrasse au 5e Étage',
    pillar5Desc: 'Cuisine raffinée chez Chao Pescao, café de spécialité chez Chao Café et cocktails signature sur la terrasse du Sky Bar ouverts jusqu\'à minuit.',
    pillar5Tag: '5e Étage Bohème',
    exploreGastroLink: 'Voir les cartes gastronomiques',
    ctaBadge: 'Participez à la Prochaine Édition',
    ctaTitle: 'Vous souhaitez plus d\'informations ?',
    ctaDesc: 'Écrivez à notre équipe sur WhatsApp pour toute question concernant l\'événement.',
    ctaContactBtn: 'Formulaire de Contact'
  },
  ja: {
    home: 'ホーム',
    breadcrumb: 'イベント',
    heroBadge: '公式文化イベント情報',
    heroTitle: '注目のイベント',
    heroSubtitle: '現代美術、文化功労者への顕彰、生演奏、そして美食が歴史的建造物で交差するメデジン屈指の特別な夜をお楽しみください。',
    nextBadge: '次回開催日 確定',
    nextTitle: 'ギャラリー・ナイト',
    scheduleTag: '午後6:00 ～ 深夜12:00（深夜0時まで延長営業）',
    locationTag: 'メデジン国立宮殿（5階）',
    countdownDays: '日',
    countdownHours: '時間',
    countdownMinutes: '分',
    countdownSeconds: '秒',
    btnAddToCalendar: 'カレンダーに追加',
    eventFlagshipBadge: 'メデジン国立宮殿の旗艦イベント',
    eventTitle: 'ギャラリー・ナイト（Noche de Galerias）',
    eventDescription: '毎月最終木曜日、メデジン国立宮殿は芸術と文化の夜の祝祭空間へと変貌します。深夜12時まで開館時間を特別延長し、芸術支援者への叙勲式、本物の現代美術作品が当たる抽選会、ピアノ生演奏やDJセット、そしてルーフトップでの美食をご提供いたします。',
    featureHoursTitle: '深夜特別延長営業',
    featureHoursDesc: '午後6:00から深夜12:00まで、ギャラリーと5階飲食エリアをノンストップで開放。',
    featureFreqTitle: '開催頻度',
    featureFreqDesc: '毎月最終木曜日に定期開催（※今年12月は最終木曜日が31日、その前が24日の祝日にあたるため、特別に12月17日（木）へ前倒しして開催いたします）。',
    featureAccessTitle: '入場無料',
    featureAccessDesc: '国内外のすべてのご来館者様を対象に入場料完全無料（定員に達し次第締切）。',
    pillarsHeading: 'ギャラリー・ナイト 5つの見どころ',
    pillarsSubheading: '現代美術と歴史的建築遺産の魅力を余すことなく堪能できる特別なプログラム。',
    pillar1Title: '文化功労者・メセナへの顕彰式',
    pillar1Desc: 'コロンビアの美術文化の振興に寄与した支援者、企業、コレクターを称える厳粛な顕彰式を執り行います。',
    pillar1Tag: '顕彰と感謝の集い',
    pillar2Title: 'オリジナル美術作品の生抽選会',
    pillar2Desc: '当館キュレーターが厳選した本物のオリジナル絵画作品がその場で来場者に当たる大抽選会を開催いたします。',
    pillar2Tag: 'ライブ抽選イベント',
    pillar3Title: '生演奏',
    pillar3Desc: '歴史的建築の回廊とテラスに響き渡るアコースティックピアノの生演奏と、洗練されたDJライブセット。',
    pillar3Tag: '極上の音響空間',
    pillar4Title: '夜のギャラリーナイトツアー',
    pillar4Desc: '特別ライトアップされた館内で、巨匠から新進気鋭の作家まで300点以上の作品をゆっくりとご鑑賞いただけます。',
    pillar4Tag: '美術と建築の融合',
    pillar5Title: '5階 ルーフトップ＆美食体験',
    pillar5Desc: 'Chao Pescaoの本格シーフード、Chao Cafeの特選コーヒー、そしてSky Barの極上カクテルを深夜12時までお楽しみいただけます。',
    pillar5Tag: 'ボヘミアンな5階フロア',
    exploreGastroLink: '飲食メニューを見る',
    ctaBadge: '次回開催へのご参加',
    ctaTitle: '特別なご相談やご質問について',
    ctaDesc: 'イベントの詳細やご質問につきましては、公式WhatsAppよりお気軽にお問い合わせください。',
    ctaContactBtn: 'お問い合わせフォーム'
  }
}

const t = computed(() => TRADUCCIONES[idiomaGlobal.value] || TRADUCCIONES.es)

// ========================================================
// 2. ALGORITMO REACTIVO DEL PRÓXIMO ÚLTIMO JUEVES DE MES
// ========================================================
function calcularUltimoJueves(fechaReferencia = new Date()) {
  const anio = fechaReferencia.getFullYear()
  const mes = fechaReferencia.getMonth()
  
  // Excepción especial para Diciembre (mes 11): se adelanta al jueves 17 por festividades del 24 y 31
  let ultimoJueves
  if (mes === 11) {
    ultimoJueves = new Date(anio, mes, 17, 18, 0, 0)
  } else {
    // Último día del mes actual
    const ultimoDiaMes = new Date(anio, mes + 1, 0)
    const diaSemana = ultimoDiaMes.getDay() // 0 = Domingo, 4 = Jueves
    
    // Calcular los días que hay que retroceder hasta dar con un jueves (4)
    const diasARestar = (diaSemana >= 4) ? (diaSemana - 4) : (diaSemana + 3)
    ultimoJueves = new Date(anio, mes, ultimoDiaMes.getDate() - diasARestar, 18, 0, 0)
  }
  
  // Si la medianoche del evento ya pasó en el mes actual, calcular para el mes siguiente
  const finEvento = new Date(ultimoJueves.getTime() + (7 * 60 * 60 * 1000)) // 01:00 AM del viernes
  if (fechaReferencia.getTime() > finEvento.getTime()) {
    return calcularUltimoJueves(new Date(anio, mes + 1, 1))
  }
  return ultimoJueves
}

const proximaFechaEvento = ref(calcularUltimoJueves())

// Formateo de Fecha Multilingüe
const fechaFormateada = computed(() => {
  const f = proximaFechaEvento.value
  const lang = idiomaGlobal.value
  const localeMap = { es: 'es-CO', en: 'en-US', fr: 'fr-FR', ja: 'ja-JP' }
  const currentLocale = localeMap[lang] || 'es-CO'

  return f.toLocaleDateString(currentLocale, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

// Reloj de Cuenta Regresiva
const diasRestantes = ref('00')
const horasRestantes = ref('00')
const minutosRestantes = ref('00')
const segundosRestantes = ref('00')
let intervaloCuenta = null

function actualizarCuentaRegresiva() {
  const ahora = new Date().getTime()
  const destino = proximaFechaEvento.value.getTime()
  const diferencia = destino - ahora

  if (diferencia <= 0) {
    // Si ya comenzó o pasó, recalcular el siguiente evento
    proximaFechaEvento.value = calcularUltimoJueves()
    diasRestantes.value = '00'
    horasRestantes.value = '00'
    minutosRestantes.value = '00'
    segundosRestantes.value = '00'
    return
  }

  const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24))
  const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60))
  const segundos = Math.floor((diferencia % (1000 * 60)) / 1000)

  diasRestantes.value = String(dias).padStart(2, '0')
  horasRestantes.value = String(horas).padStart(2, '0')
  minutosRestantes.value = String(minutos).padStart(2, '0')
  segundosRestantes.value = String(segundos).padStart(2, '0')
}

onMounted(() => {
  actualizarCuentaRegresiva()
  intervaloCuenta = setInterval(actualizarCuentaRegresiva, 1000)
})

onUnmounted(() => {
  if (intervaloCuenta) clearInterval(intervaloCuenta)
})

// ========================================================
// 3. ENLACES EXTERNOS (GOOGLE CALENDAR Y WHATSAPP)
// ========================================================
const urlGoogleCalendar = computed(() => {
  const inicio = proximaFechaEvento.value
  const fin = new Date(inicio.getTime() + (6 * 60 * 60 * 1000)) // 6 horas: 18:00 a 00:00

  // Formato UTC YYYYMMDDTHHmmssZ
  const formatearUTC = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, '')

  const titulo = encodeURIComponent('Noche de Galerías | Palacio Nacional Medellín')
  const detalles = encodeURIComponent('La Noche de Galerías en el Palacio Nacional Medellín: condecoraciones a mecenas del arte, sorteo de obras en vivo, recital de piano, DJ sets y horario extendido hasta las 12 de la noche. Entrada 100% libre.')
  const ubicacion = encodeURIComponent('Palacio Nacional, Cra. 52 # 48-45, Medellín, Colombia')
  const fechas = `${formatearUTC(inicio)}/${formatearUTC(fin)}`

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titulo}&dates=${fechas}&details=${detalles}&location=${ubicacion}`
})

// ========================================================
// 4. SEO DE ALTO CTR & SCHEMA.ORG EVENT (JSON-LD)
// ========================================================
useSeoMeta({
  title: 'Noche de Galerías | Nuestros Eventos | Palacio Nacional Medellín',
  description: 'Descubre la Noche de Galerías en el Palacio Nacional de Medellín. Cada último jueves de mes: condecoraciones al mérito cultural, sorteo de obras de arte, música en vivo y horario hasta las 12 de la noche.',
  canonical: 'https://palacionacionalmedellin.com/eventos',
  robots: 'index, follow, max-image-preview:large, max-snippet:-1',
  
  // Open Graph
  ogTitle: '🌙 Noche de Galerías | Palacio Nacional Medellín',
  ogDescription: 'El último jueves de cada mes: condecoraciones, sorteos de arte, música en vivo y horario extendido hasta las 12 de la noche. Entrada libre.',
  ogImage: 'https://palacionacionalmedellin.com/logon.png',
  ogUrl: 'https://palacionacionalmedellin.com/eventos',
  ogType: 'website',
  ogLocale: 'es_CO',
  
  // Twitter Cards
  twitterCard: 'summary_large_image',
  twitterTitle: 'Noche de Galerías | Palacio Nacional Medellín',
  twitterDescription: 'Velada cultural nocturna con horario extendido hasta medianoche. Entrada 100% gratuita.',
  twitterImage: 'https://palacionacionalmedellin.com/logon.png'
})

// Inyección de Schema.org Event para Google Search y Google Events
useHead(() => {
  const inicio = proximaFechaEvento.value
  const fin = new Date(inicio.getTime() + (6 * 60 * 60 * 1000))

  return {
    link: [
      { rel: 'canonical', href: 'https://palacionacionalmedellin.com/eventos' }
    ],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Event",
          "name": "La Noche de Galerías - Palacio Nacional Medellín",
          "startDate": inicio.toISOString(),
          "endDate": fin.toISOString(),
          "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
          "eventStatus": "https://schema.org/EventScheduled",
          "location": {
            "@type": "Place",
            "name": "Palacio Nacional Medellín",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Carrera 52 # 48-45",
              "addressLocality": "Medellín",
              "addressRegion": "Antioquia",
              "postalCode": "050015",
              "addressCountry": "CO"
            }
          },
          "image": [
            "https://palacionacionalmedellin.com/logon.png"
          ],
          "description": "Evento cultural mensual del Palacio Nacional con horario extendido hasta las 12 de la noche: condecoraciones a benefactores del arte, rifa de obras originales, recitales de piano y gastronomía en terraza.",
          "offers": {
            "@type": "Offer",
            "url": "https://palacionacionalmedellin.com/eventos",
            "price": "0",
            "priceCurrency": "COP",
            "availability": "https://schema.org/InStock",
            "validFrom": "2026-01-01T00:00:00Z"
          },
          "organizer": {
            "@type": "Organization",
            "name": "Palacio Nacional Medellín",
            "url": "https://palacionacionalmedellin.com"
          },
          "performer": {
            "@type": "PerformingGroup",
            "name": "Músicos en vivo y Curaduría Palacio Nacional"
          }
        })
      }
    ]
  }
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>

