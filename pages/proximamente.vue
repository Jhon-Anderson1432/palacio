<template>
  <main class="min-h-screen bg-[#050505] text-white font-sans flex flex-col overflow-hidden selection:bg-[#D4AF37] selection:text-black antialiased relative">
    
    <!-- Partículas decorativas -->
    <div class="particles" aria-hidden="true">
      <span v-for="n in 20" :key="n" class="particle" :style="particleStyle(n)"></span>
    </div>

    <!-- Navbar -->
    <Navbar :ocultarBuscador="true" :fondoTranslucido="true" />

    <!-- Contenido principal -->
    <section class="flex-1 flex items-center justify-center px-4 py-20 relative z-10">
      <div class="w-full max-w-lg text-center animate-fade-in">

        <!-- Logo -->
        <NuxtImg
          src="/logon.png"
          alt="Logo Palacio Nacional Medellín"
          class="w-28 md:w-36 mx-auto mb-10 object-contain drop-shadow-[0_0_20px_rgba(212,175,55,0.3)]"
          loading="eager"
        />

        <!-- Card glassmorphism -->
        <div class="bg-white/[0.03] backdrop-blur-2xl border border-[#D4AF37]/15 rounded-2xl p-8 md:p-12 shadow-[0_20px_60px_rgba(0,0,0,0.6)]">

          <!-- Ícono animado de construcción -->
          <div class="w-20 h-20 mx-auto mb-8 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/25 flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.15)] animate-pulse-gold">
            <svg class="w-9 h-9 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085"></path>
            </svg>
          </div>

          <!-- Título -->
          <h1 class="text-2xl md:text-3xl font-serif text-[#D4AF37] uppercase tracking-[0.15em] mb-3 drop-shadow-sm">
            {{ t.title }}
          </h1>

          <!-- Subtítulo -->
          <p class="text-xs text-neutral-500 uppercase tracking-[0.3em] font-bold mb-8">
            {{ t.subtitle }}
          </p>

          <!-- Barra de progreso decorativa -->
          <div class="w-full max-w-xs mx-auto h-1 bg-white/5 rounded-full overflow-hidden mb-8">
            <div class="h-full bg-gradient-to-r from-[#D4AF37]/60 via-[#D4AF37] to-[#D4AF37]/60 rounded-full animate-progress"></div>
          </div>

          <!-- Descripción -->
          <p class="text-sm text-neutral-400 font-light leading-relaxed mb-10 max-w-sm mx-auto">
            {{ t.description }}
          </p>

          <!-- Botón volver -->
          <NuxtLink
            to="/"
            class="inline-flex items-center gap-2 px-8 py-3.5 bg-[#D4AF37] text-black font-bold uppercase tracking-widest text-[11px] rounded-xl hover:bg-white active:scale-[0.97] transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.25)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] focus:outline-none focus:ring-4 focus:ring-[#D4AF37]/40"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            {{ t.backBtn }}
          </NuxtLink>
        </div>

        <!-- Nota al pie -->
        <p class="mt-8 text-[10px] text-neutral-600 font-light tracking-wide">
          {{ t.footnote }}
        </p>
      </div>
    </section>

    <Footer />
  </main>
</template>

<script setup>
definePageMeta({
  layout: false
})

// === SEO: noindex porque el contenido real aún no existe ===
useSeoMeta({
  title: 'En Construcción | Palacio Nacional Medellín',
  description: 'Esta sección del Palacio Nacional Medellín se encuentra actualmente en construcción. Pronto estará disponible con toda la información.',
  robots: 'noindex, follow',
  ogTitle: 'En Construcción | Palacio Nacional Medellín',
  ogDescription: 'Estamos trabajando para traerte nuevo contenido. Vuelve pronto.',
  ogImage: 'https://palacionacionalmedellin.com/logon.png',
  twitterCard: 'summary_large_image',
})

useHead({
  link: [
    { rel: 'canonical', href: 'https://palacionacionalmedellin.com/proximamente' }
  ]
})

// === MULTILENGUAJE ===
const idiomaGlobal = useState('idiomaGlobal', () => 'es')

const traducciones = {
  es: {
    title: 'En Construcción',
    subtitle: 'Estamos trabajando en algo increíble',
    description: 'Nuestro equipo está preparando esta sección con el mismo cuidado y dedicación que cada rincón del Palacio Nacional. Muy pronto podrás disfrutar de todo su contenido.',
    backBtn: 'Volver al Inicio',
    footnote: 'Palacio Nacional Medellín — Arte, Historia y Gastronomía'
  },
  en: {
    title: 'Under Construction',
    subtitle: 'We\'re building something incredible',
    description: 'Our team is preparing this section with the same care and dedication as every corner of the Palacio Nacional. You\'ll be able to enjoy all its content very soon.',
    backBtn: 'Back to Home',
    footnote: 'Palacio Nacional Medellín — Art, History & Gastronomy'
  },
  fr: {
    title: 'En Construction',
    subtitle: 'Nous travaillons sur quelque chose d\'incroyable',
    description: 'Notre équipe prépare cette section avec le même soin et la même passion que chaque recoin du Palacio Nacional. Vous pourrez bientôt profiter de tout son contenu.',
    backBtn: 'Retour à l\'Accueil',
    footnote: 'Palacio Nacional Medellín — Art, Histoire et Gastronomie'
  },
  ja: {
    title: '工事中',
    subtitle: '素晴らしいものを準備しています',
    description: 'パラシオ・ナシオナルのすべての場所と同じ注意と献身をもって、このセクションを準備しています。まもなくすべてのコンテンツをお楽しみいただけます。',
    backBtn: 'ホームに戻る',
    footnote: 'パラシオ・ナシオナル・メデジン — 芸術、歴史、美食'
  }
}

const t = computed(() => traducciones[idiomaGlobal.value] || traducciones['es'])

// Partículas decorativas (posiciones aleatorias determinísticas)
const particleStyle = (n) => {
  const seed = n * 7.3
  const left = ((seed * 13.7) % 100).toFixed(1)
  const top = ((seed * 9.1) % 100).toFixed(1)
  const size = (1 + (seed % 3)).toFixed(1)
  const delay = (seed % 8).toFixed(1)
  const duration = (12 + (seed % 10)).toFixed(1)
  return {
    left: `${left}%`,
    top: `${top}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  }
}
</script>

<style scoped>
/* Suavizado */
.antialiased {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* Partículas flotantes */
.particles {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  overflow: hidden;
}

.particle {
  position: absolute;
  background: radial-gradient(circle, rgba(212, 175, 55, 0.6), transparent);
  border-radius: 50%;
  animation: floatParticle 15s ease-in-out infinite;
  opacity: 0;
}

@keyframes floatParticle {
  0%, 100% {
    opacity: 0;
    transform: translateY(0) scale(0.5);
  }
  25% {
    opacity: 0.8;
  }
  50% {
    opacity: 0.4;
    transform: translateY(-60px) scale(1.2);
  }
  75% {
    opacity: 0.6;
  }
}

/* Pulso dorado del ícono */
.animate-pulse-gold {
  animation: pulseGold 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulseGold {
  0%, 100% {
    box-shadow: 0 0 15px rgba(212, 175, 55, 0.15);
  }
  50% {
    box-shadow: 0 0 35px rgba(212, 175, 55, 0.35), 0 0 60px rgba(212, 175, 55, 0.1);
  }
}

/* Barra de progreso animada */
.animate-progress {
  width: 45%;
  animation: progressPulse 2.5s ease-in-out infinite;
}

@keyframes progressPulse {
  0% {
    transform: translateX(-100%);
    opacity: 0.5;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateX(280%);
    opacity: 0.5;
  }
}

/* Entrada general */
.animate-fade-in {
  opacity: 0;
  animation: fadeIn 1s ease-out forwards 0.2s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
