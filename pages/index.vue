<template>
  <main class="relative min-h-screen w-full overflow-x-hidden font-sans flex flex-col bg-black selection:bg-[#D4AF37] selection:text-black">
    
    <Navbar :ocultarBuscador="true" :ocultarBotonVolver="true" :fondoTranslucido="true" />

    <!-- SEO: H1 Oculto visualmente pero 100% visible para Google. -->
    <h1 class="sr-only">
      Palacio Nacional Medellín - Arte, Historia y Gastronomía.
    </h1>

    <video
      autoplay
      loop
      muted
      playsinline
      disablePictureInPicture
      preload="auto"
      class="fixed top-0 left-0 w-full h-full object-cover z-0 opacity-90"
    >
      <source src="/fondo.mp4" type="video/mp4" />
      <span class="sr-only">Video de fondo del Palacio Nacional</span>
    </video>
    
    <div class="fixed inset-0 bg-black/75 z-10 pointer-events-none"></div>

    <section class="relative z-20 flex-1 flex flex-col items-center justify-center min-h-screen px-4 pt-28 pb-20" aria-label="Navegación Principal">
      
      <!-- RENDIMIENTO & SEO: Alt text corregido para enfocarse en arte e historia -->
      <NuxtImg 
        src="/logon.png" 
        alt="Logotipo Palacio Nacional Medellín - Arte, Historia y Gastronomía" 
        fetchpriority="high"
        class="w-48 md:w-64 mb-8 object-contain drop-shadow-[0_0_20px_rgba(212,175,55,0.4)] animate-fade-in-down"
      />
      
      <h2 class="text-lg md:text-xl font-light tracking-[0.25em] mb-14 text-[#D4AF37] drop-shadow-lg text-center uppercase animate-fade-in">
        {{ t.mainTitle }}
      </h2>

      <nav class="flex flex-col md:flex-row flex-wrap gap-5 md:gap-6 w-full max-w-5xl justify-center animate-slide-up" aria-label="Secciones del Palacio">
        
        <NuxtLink to="/exposiciones" class="nav-btn group">
          <span class="text-sm transition-transform duration-300 group-hover:scale-105">{{ t.btnGallery }}</span>
        </NuxtLink>
        
        <NuxtLink to="/homegastro" class="nav-btn group">
          <span class="text-sm transition-transform duration-300 group-hover:scale-105">{{ t.btnGastro }}</span>
        </NuxtLink>

        <NuxtLink to="/historia" class="nav-btn group">
          <span class="text-sm transition-transform duration-300 group-hover:scale-105">{{ t.btnHistory }}</span>
        </NuxtLink>
        
        <NuxtLink to="/sedes" class="nav-btn group">
          <span class="text-sm transition-transform duration-300 group-hover:scale-105">{{ t.btnLocations }}</span>
        </NuxtLink>
        
        <NuxtLink to="/contactos" class="nav-btn group">
          <span class="text-sm transition-transform duration-300 group-hover:scale-105">{{ t.btnContacts }}</span>
        </NuxtLink>

      </nav>
    </section>

    <Footer />
  </main>
</template>

<script setup>
definePageMeta({
  layout: false
})

// === 1. SEO REACTIVO EN NUXT 3 (MÁXIMO CTR Y AUTORIDAD DE DOMINIO) ===
useSeoMeta({
  // Título raíz: Exacto y enfocado en tus 3 pilares.
  title: 'Palacio Nacional Medellín | Arte, Historia y Gastronomía',
  
  // Descripción purgada de "centro comercial" o "moda".
  description: 'Descubre el Palacio Nacional de Medellín. Un monumento histórico donde convergen de manera única el arte contemporáneo, la historia viva y la alta gastronomía.',
  
  // Open Graph (WhatsApp, Facebook, LinkedIn)
  ogTitle: '✨ Palacio Nacional Medellín | Arte, Historia y Gastronomía',
  ogDescription: 'Explora galerías de arte, descubre nuestra fascinante historia y disfruta de la mejor oferta gastronómica en el monumento más icónico de Medellín.',
  ogImage: 'https://palacionacionalmedellin.com/logon.png',
  
  twitterCard: 'summary_large_image',
})

const idiomaGlobal = useIdiomaGlobal()

// LÓGICA DE NEGOCIO
const traducciones = {
  es: {
    mainTitle: 'Arte, Historia y Gastronomía en un solo lugar',
    btnGallery: 'Galería',
    btnGastro: 'Gastronomía',
    btnHistory: 'Nuestra Historia',
    btnLocations: 'Otras Sedes',
    btnContacts: 'Contactos'
  },
  en: {
    mainTitle: 'Art, History, and Gastronomy in one place',
    btnGallery: 'Gallery',
    btnGastro: 'Gastronomy',
    btnHistory: 'Our History',
    btnLocations: 'Other Locations',
    btnContacts: 'Contacts'
  },
  fr: {
    mainTitle: 'Art, Histoire et Gastronomie en un seul lieu',
    btnGallery: 'Galerie',
    btnGastro: 'Gastronomie',
    btnHistory: 'Notre Histoire',
    btnLocations: 'Autres Sites',
    btnContacts: 'Contacts'
  },
  ja: {
    mainTitle: '芸術、歴史、美食がひとつに',
    btnGallery: 'ギャラリー',
    btnGastro: 'ガストロノミー',
    btnHistory: '私たちの歴史',
    btnLocations: 'その他の場所',
    btnContacts: '連絡先'
  }
}

const t = computed(() => traducciones[idiomaGlobal.value] || traducciones['es'])

// === 2. SCHEMA LOCAL BUSINESS (Optimizando para Google Maps y Búsquedas) ===
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

onMounted(() => {
  window.scrollTo(0, 0);
})
</script>

<style scoped>
.nav-btn {
  @apply min-w-[200px] px-6 py-4 border border-[#D4AF37]/80 bg-black/30 text-[#D4AF37] backdrop-blur-xl flex items-center justify-center uppercase tracking-widest font-medium shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all duration-500 rounded-sm;
}

.nav-btn:hover {
  @apply bg-[#D4AF37] text-black shadow-[0_0_30px_rgba(212,175,55,0.4)] border-[#D4AF37];
}

.animate-fade-in-down {
  animation: fadeInDown 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.animate-fade-in {
  opacity: 0;
  animation: fadeIn 1.2s ease-in forwards 0.3s;
}
.animate-slide-up {
  opacity: 0;
  animation: slideUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.5s;
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>