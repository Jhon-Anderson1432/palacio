<template>
  <!-- SEO: Usamos etiquetas semánticas como <main> y <section> -->
  <main class="relative min-h-screen w-full font-sans text-white overflow-x-hidden pt-32">
    
    <!-- RENDIMIENTO: Se eliminó el poster que causaba el error en Vite. Se mantiene disablePictureInPicture -->
    <video
      autoplay
      loop
      muted
      playsinline
      disablePictureInPicture
      class="fixed top-0 left-0 w-full h-full object-cover z-0 opacity-80"
    >
      <source src="/fondo.mp4" type="video/mp4" />
    </video>

    <!-- Overlay oscuro optimizado -->
    <div class="fixed inset-0 bg-black/80 z-10 pointer-events-none"></div>

    <Navbar :ocultarBuscador="true" />

    <section class="relative z-20 flex flex-col items-center justify-center px-4 pb-20">
      
      <header class="text-center mb-12">
        <h1 class="text-4xl md:text-6xl font-light tracking-[0.15em] uppercase mb-4 text-[#D4AF37] drop-shadow-xl">
          {{ t.title }}
        </h1>
        <p class="font-light tracking-widest text-gray-400 uppercase text-sm" aria-hidden="true">
          {{ t.subtitle }}
        </p>
      </header>

      <div class="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-0 bg-black/50 backdrop-blur-2xl border border-[#D4AF37]/30 shadow-[0_15px_50px_rgba(0,0,0,0.8)] rounded-sm overflow-hidden">
        
        <!-- Formulario de Contacto -->
        <div class="p-8 md:p-14 border-b md:border-b-0 md:border-r border-[#D4AF37]/20 flex flex-col justify-center">
          <h2 class="text-2xl font-light tracking-widest mb-10 text-white uppercase">{{ t.writeUs }}</h2>
          
          <form @submit.prevent="enviarMensaje" class="space-y-10" novalidate>
            <!-- Campos optimizados con autocomplete y aria-labels para accesibilidad/rendimiento -->
            <div class="relative group">
              <input 
                type="text" 
                id="nombre" 
                v-model="form.nombre" 
                required 
                autocomplete="name"
                class="w-full bg-transparent border-b border-gray-600 focus:border-[#D4AF37] text-white py-2 outline-none transition-all duration-300 peer placeholder-transparent" 
                placeholder="Nombre"
              />
              <label 
                for="nombre" 
                class="absolute left-0 top-2 text-gray-500 uppercase tracking-widest text-xs transition-all duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:top-2 peer-focus:-top-6 peer-focus:text-[#D4AF37] peer-focus:text-[10px] peer-valid:-top-6 peer-valid:text-[10px] cursor-text">
                {{ t.formNameLabel }}
              </label>
            </div>
            
            <div class="relative group">
              <input 
                type="email" 
                id="email" 
                v-model="form.email" 
                required 
                autocomplete="email"
                class="w-full bg-transparent border-b border-gray-600 focus:border-[#D4AF37] text-white py-2 outline-none transition-all duration-300 peer placeholder-transparent" 
                placeholder="Email"
              />
              <label 
                for="email" 
                class="absolute left-0 top-2 text-gray-500 uppercase tracking-widest text-xs transition-all duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:top-2 peer-focus:-top-6 peer-focus:text-[#D4AF37] peer-focus:text-[10px] peer-valid:-top-6 peer-valid:text-[10px] cursor-text">
                {{ t.formEmailLabel }}
              </label>
            </div>
            
            <div class="relative group">
              <textarea 
                id="mensaje" 
                v-model="form.mensaje" 
                required 
                rows="4" 
                class="w-full bg-transparent border-b border-gray-600 focus:border-[#D4AF37] text-white py-2 outline-none transition-all duration-300 peer resize-none placeholder-transparent custom-scrollbar"
                placeholder="Mensaje"
              ></textarea>
              <label 
                for="mensaje" 
                class="absolute left-0 top-2 text-gray-500 uppercase tracking-widest text-xs transition-all duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:top-2 peer-focus:-top-6 peer-focus:text-[#D4AF37] peer-focus:text-[10px] peer-valid:-top-6 peer-valid:text-[10px] cursor-text">
                {{ t.formMsgLabel }}
              </label>
            </div>

            <button 
              type="submit" 
              class="w-full py-4 mt-6 border border-[#D4AF37] bg-transparent text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all duration-500 uppercase tracking-widest text-sm font-medium shadow-[0_0_10px_rgba(212,175,55,0.05)] hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] active:scale-[0.98]">
              {{ t.submitBtn }}
            </button>
          </form>
        </div>

        <!-- Información de Contacto y Mapa -->
        <div class="p-8 md:p-14 flex flex-col justify-between bg-gradient-to-br from-transparent to-black/30">
          <div>
            <h2 class="text-2xl font-light tracking-widest mb-8 text-white uppercase">{{ t.visitUs }}</h2>
            
            <!-- MAPA CORREGIDO: Se actualizó el SRC para forzar el marcador en el Palacio Nacional -->
            <div class="w-full h-56 mb-10 border border-[#D4AF37]/30 overflow-hidden relative group bg-neutral-900 rounded-sm">
              <iframe 
                title="Mapa de ubicación del Palacio Nacional Medellín"
                src="https://maps.google.com/maps?q=Centro%20Comercial%20Palacio%20Nacional,%20Medell%C3%ADn&t=&z=16&hl=es&ie=UTF8&iwloc=&output=embed" 
                class="w-full h-full grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-1000 ease-in-out" 
                style="border:0;" 
                allowfullscreen="" 
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade">
              </iframe>
            </div>

            <!-- SEO: Etiqueta <address> para que Google interprete los datos de contacto -->
            <address class="space-y-6 font-light tracking-wider text-sm text-gray-300 not-italic">
              <p class="flex items-start gap-4 group">
                <svg class="w-6 h-6 mt-0.5 text-[#D4AF37] flex-shrink-0 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <span class="leading-relaxed">Carrera 52 # 52-43<br/>{{ t.locationCity }}</span>
              </p>
              <a href="mailto:ccpalacional@gmail.com" class="flex items-center gap-4 group hover:text-white transition-colors">
                <svg class="w-6 h-6 text-[#D4AF37] flex-shrink-0 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                ccpalacional@gmail.com
              </a>
              <a href="tel:+573116390177" class="flex items-center gap-4 group hover:text-white transition-colors">
                <svg class="w-6 h-6 text-[#D4AF37] flex-shrink-0 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                +57 (311) 639-0177
              </a>
            </address>
          </div>
        </div>
      </div>
    </section>
    <Footer />
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/footer.vue'
import { idiomaGlobal } from '../lib/supabase'

// 1. LÓGICA DE NEGOCIO (Intacta)
const form = ref({ nombre: '', email: '', mensaje: '' })

const textos = {
  es: {
    title: 'Contacto', subtitle: 'Estamos a su entera disposición',
    writeUs: 'Escríbanos', formNameLabel: 'Nombre Completo', formEmailLabel: 'Correo Electrónico', formMsgLabel: 'Su Mensaje',
    submitBtn: 'Enviar Solicitud', visitUs: 'Visítenos', locationCity: 'Centro, Medellín'
  },
  en: {
    title: 'Contact', subtitle: 'We are entirely at your disposal',
    writeUs: 'Write to us', formNameLabel: 'Full Name', formEmailLabel: 'Email Address', formMsgLabel: 'Your Message',
    submitBtn: 'Send Request', visitUs: 'Visit Us', locationCity: 'Downtown, Medellin'
  },
  fr: {
    title: 'Contact', subtitle: 'Nous sommes entièrement à votre disposition',
    writeUs: 'Écrivez-nous', formNameLabel: 'Nom Complet', formEmailLabel: 'Adresse Email', formMsgLabel: 'Votre Message',
    submitBtn: 'Envoyer la Demande', visitUs: 'Rendez-nous Visite', locationCity: 'Centre-ville, Medellín'
  },
  ja: {
    title: 'お問い合わせ', subtitle: '皆様のサービスのために',
    writeUs: 'メッセージを書く', formNameLabel: 'フルネーム', formEmailLabel: 'メールアドレス', formMsgLabel: 'あなたのメッセージ',
    submitBtn: 'リクエストを送信', visitUs: 'ご訪問', locationCity: 'メデジン、ダウンタウン'
  }
}

const t = computed(() => textos[idiomaGlobal.value] || textos['es'])

const enviarMensaje = () => {
  const texto = `Hola Palacio, soy ${form.value.nombre} (${form.value.email}).%0A%0A${form.value.mensaje}`
  const url = `https://wa.me/573116390177?text=${texto}`
  window.open(url, '_blank')
}

// 2. LÓGICA SEO
onMounted(() => {
  // A. Forzar etiqueta Canonical para que Google sepa que ESTA es la URL principal
  let canonical = document.querySelector("link[rel='canonical']")
  if (!canonical) {
    canonical = document.createElement("link")
    canonical.setAttribute("rel", "canonical")
    document.head.appendChild(canonical)
  }
  canonical.setAttribute("href", "https://palacionacionalmedellin.com/contactos")

  // B. Inyección de JSON-LD (Schema.org). Esto es lo que lee el bot de Google para posicionar la dirección y los contactos exactos de tu URL.
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "ShoppingCenter",
    "name": "Palacio Nacional Medellín",
    "url": "https://palacionacionalmedellin.com/contactos",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Carrera 52 # 52-43",
      "addressLocality": "Medellín",
      "addressRegion": "Antioquia",
      "addressCountry": "CO"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+57-311-639-0177",
      "email": "ccpalacional@gmail.com",
      "contactType": "customer service"
    }
  }

  // Evitar duplicar el script si el componente se desmonta y monta nuevamente
  if (!document.getElementById('schema-contacto')) {
    const script = document.createElement('script')
    script.id = 'schema-contacto'
    script.setAttribute('type', 'application/ld+json')
    script.textContent = JSON.stringify(schemaData)
    document.head.appendChild(script)
  }
})
</script>

<style scoped>
/* ESTILOS: Modernización sutil de scrollbars y animaciones */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(212, 175, 55, 0.3); /* Dorado translúcido */
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(212, 175, 55, 0.6);
}

/* Evitar auto-fill amarillo de Chrome que rompe el diseño oscuro */
input:-webkit-autofill,
textarea:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 30px transparent inset !important;
  -webkit-text-fill-color: white !important;
  transition: background-color 5000s ease-in-out 0s;
}
</style>