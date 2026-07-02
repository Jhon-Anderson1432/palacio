<template>
  <main class="relative min-h-screen w-full overflow-x-hidden font-sans flex flex-col bg-black selection:bg-[#D4AF37] selection:text-black">
    
    <Navbar :ocultarBuscador="true" :ocultarBotonVolver="true" :fondoTranslucido="true" />

    <!-- SEO: H1 Oculto visualmente pero 100% visible para Google. 
         Aquí concentramos todas las palabras clave pesadas sin romper tu diseño minimalista. -->
    <h1 class="sr-only">
      Palacio Nacional Medellín - Centro Comercial, Arte, Moda, Gastronomía y Museo de Historia
    </h1>

    <!-- RENDIMIENTO: Se añadió disablePictureInPicture y preload -->
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
      
      <!-- RENDIMIENTO & SEO: fetchpriority alto para el renderizado inicial y atributo alt fuerte -->
      <img 
        :src="logo" 
        alt="Logotipo Centro Comercial Palacio Nacional Medellín" 
        fetchpriority="high"
        class="w-48 md:w-64 mb-8 object-contain drop-shadow-[0_0_20px_rgba(212,175,55,0.4)] animate-fade-in-down"
      />
      
      <!-- ESTRUCTURA: Subtítulo semántico <h2> -->
      <h2 class="text-lg md:text-xl font-light tracking-[0.25em] mb-14 text-[#D4AF37] drop-shadow-lg text-center uppercase animate-fade-in">
        {{ t.mainTitle }}
      </h2>

      <!-- SEO FIX CRÍTICO: Reemplazo de <button> por <router-link>. 
           Esto renderiza etiquetas <a> reales, permitiendo a Google rastrear todo el sitio. -->
      <nav class="flex flex-col md:flex-row flex-wrap gap-5 md:gap-6 w-full max-w-5xl justify-center animate-slide-up" aria-label="Secciones del Palacio">
        
        <router-link to="/exposiciones" class="nav-btn group">
          <span class="text-sm transition-transform duration-300 group-hover:scale-105">{{ t.btnGallery }}</span>
        </router-link>
        
        <router-link to="/homegastro" class="nav-btn group">
          <span class="text-sm transition-transform duration-300 group-hover:scale-105">{{ t.btnGastro }}</span>
        </router-link>

        <router-link to="/historia" class="nav-btn group">
          <span class="text-sm transition-transform duration-300 group-hover:scale-105">{{ t.btnHistory }}</span>
        </router-link>
        
        <router-link to="/sedes" class="nav-btn group">
          <span class="text-sm transition-transform duration-300 group-hover:scale-105">{{ t.btnLocations }}</span>
        </router-link>
        
        <router-link to="/contactos" class="nav-btn group">
          <span class="text-sm transition-transform duration-300 group-hover:scale-105">{{ t.btnContacts }}</span>
        </router-link>

      </nav>
    </section>

    <Footer />
  </main>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import Navbar from '../components/Navbar.vue' 
import Footer from '../components/footer.vue'
import logo from '@/assets/logon.png' 
import { idiomaGlobal } from '../lib/supabase'

// 1. LÓGICA DE NEGOCIO (Intacta)
const traducciones = {
  es: {
    mainTitle: 'El arte en movimiento',
    btnGallery: 'Galería',
    btnGastro: 'Gastronomía',
    btnHistory: 'Nuestra Historia',
    btnLocations: 'Otras Sedes',
    btnContacts: 'Contactos'
  },
  en: {
    mainTitle: 'Art in motion',
    btnGallery: 'Gallery',
    btnGastro: 'Gastronomy',
    btnHistory: 'Our History',
    btnLocations: 'Other Locations',
    btnContacts: 'Contacts'
  },
  fr: {
    mainTitle: 'L\'art en mouvement',
    btnGallery: 'Galerie',
    btnGastro: 'Gastronomie',
    btnHistory: 'Notre Histoire',
    btnLocations: 'Autres Sites',
    btnContacts: 'Contacts'
  },
  ja: {
    mainTitle: '動く芸術',
    btnGallery: 'ギャラリー',
    btnGastro: 'ガストロノミー',
    btnHistory: '私たちの歴史',
    btnLocations: 'その他の場所',
    btnContacts: '連絡先'
  }
}

const t = computed(() => traducciones[idiomaGlobal.value] || traducciones['es'])

// 2. LÓGICA SEO MAESTRA (La araña de Google)
const inyectarSEO = () => {
  // Title y Description perfectos para la página de inicio
  document.title = "Palacio Nacional Medellín | Centro Comercial, Arte, Moda y Gastronomía";
  
  let metaDesc = document.querySelector('meta[name="description"]');
  if (!metaDesc) {
    metaDesc = document.createElement('meta');
    metaDesc.name = "description";
    document.head.appendChild(metaDesc);
  }
  metaDesc.content = "Descubre el Palacio Nacional de Medellín. El epicentro donde la moda, el arte, la gastronomía y la historia convergen en el centro comercial más hermoso de la ciudad.";

  // Forzar Canonical en el Home
  let canonical = document.querySelector("link[rel='canonical']");
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.setAttribute("rel", "canonical");
    document.head.appendChild(canonical);
  }
  canonical.setAttribute("href", "https://palacionacionalmedellin.com/");

  // Schema.org de ShoppingCenter indicando múltiples facetas
  const schemaData = {
    "@context": "https://schema.org",
    "@type": ["ShoppingCenter", "TouristAttraction"],
    "name": "Palacio Nacional Medellín",
    "description": "Centro comercial histórico en Medellín que fusiona galerías de arte, zonas gastronómicas, moda y un profundo valor arquitectónico.",
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
    "sameAs": [
      // Aquí puedes agregar links a las redes sociales del Palacio si las tienes
    ],
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
  };

  const scriptId = 'schema-home-palacio';
  const existingScript = document.getElementById(scriptId);
  if (existingScript) existingScript.remove();

  const script = document.createElement('script');
  script.id = scriptId;
  script.setAttribute('type', 'application/ld+json');
  script.textContent = JSON.stringify(schemaData);
  document.head.appendChild(script);
}

onMounted(() => {
  window.scrollTo(0, 0);
  inyectarSEO();
})
</script>

<style scoped>
/* ESTILOS: Modularización de clases repetitivas y animaciones sutiles */
.nav-btn {
  @apply min-w-[200px] px-6 py-4 border border-[#D4AF37]/80 bg-black/30 text-[#D4AF37] backdrop-blur-xl flex items-center justify-center uppercase tracking-widest font-medium shadow-[0_0_15px_rgba(212,175,55,0.1)] transition-all duration-500 rounded-sm;
}

.nav-btn:hover {
  @apply bg-[#D4AF37] text-black shadow-[0_0_30px_rgba(212,175,55,0.4)] border-[#D4AF37];
}

/* Clases utilitarias nativas para accesibilidad de pantalla (SEO) */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* Keyframes para una entrada ultra-elegante al estilo museo */
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