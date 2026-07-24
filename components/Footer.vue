<template>
  <footer 
    class="bg-[#0a0a0a]/80 backdrop-blur-xl text-gray-400 py-10 border-t border-[#D4AF37]/20 font-sans relative z-50 w-full mt-auto antialiased shadow-[0_-10px_30px_rgba(0,0,0,0.5)]"
    role="contentinfo"
    aria-label="Pie de página del Palacio Nacional"
  >
    <div class="max-w-7xl mx-auto px-6 md:px-8">
      
      <div class="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8">
        
        <div class="space-y-5" itemscope itemtype="https://schema.org/LocalBusiness">
          <NuxtImg 
            src="/logon.png" 
            alt="Logo oficial del Palacio Nacional Medellín" 
            class="w-36 object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.2)]"
            itemprop="logo"
            loading="lazy"
          />
          <p class="text-[11px] leading-relaxed text-justify font-light" itemprop="description">
            {{ t.desc }}
          </p>
          <meta itemprop="name" content="Palacio Nacional Medellín" />
        </div>

        <nav aria-label="Enlaces rápidos">
          <h3 class="text-base text-white font-serif mb-5 tracking-wide">{{ t.explore }}</h3>
          <div class="grid grid-cols-2 gap-x-4 text-[11px] font-medium">
            <ul class="space-y-3">
              <li class="flex items-center gap-2 group">
                <span class="w-1.5 h-1.5 bg-[#D4AF37] rounded-full group-hover:scale-150 transition-all duration-300"></span>
                <NuxtLink to="/historia" class="hover:text-[#D4AF37] transition-colors focus:outline-none focus:text-[#D4AF37]">{{ t.history }}</NuxtLink>
              </li>
              <li class="flex items-center gap-2 group">
                <span class="w-1.5 h-1.5 bg-[#D4AF37] rounded-full group-hover:scale-150 transition-all duration-300"></span>
                <NuxtLink to="/exposiciones" class="hover:text-[#D4AF37] transition-colors focus:outline-none focus:text-[#D4AF37]">{{ t.collections }}</NuxtLink>
              </li>
              <li class="flex items-center gap-2 group">
                <span class="w-1.5 h-1.5 bg-[#D4AF37] rounded-full group-hover:scale-150 transition-all duration-300"></span>
                <NuxtLink to="/eventos" class="hover:text-[#D4AF37] transition-colors focus:outline-none focus:text-[#D4AF37]">{{ t.events }}</NuxtLink>
              </li>
            </ul>
            <ul class="space-y-3">
              <li class="flex items-center gap-2 group">
                <span class="w-1.5 h-1.5 bg-[#D4AF37] rounded-full group-hover:scale-150 transition-all duration-300"></span>
                <NuxtLink to="/noticias" class="hover:text-[#D4AF37] transition-colors focus:outline-none focus:text-[#D4AF37]">{{ t.news }}</NuxtLink>
              </li>
              <li class="flex items-center gap-2 group">
                <span class="w-1.5 h-1.5 bg-[#D4AF37] rounded-full group-hover:scale-150 transition-all duration-300"></span>
                <NuxtLink to="/faq" class="hover:text-[#D4AF37] transition-colors focus:outline-none focus:text-[#D4AF37]">{{ t.faq }}</NuxtLink>
              </li>
              <li class="flex items-center gap-2 group">
                <span class="w-1.5 h-1.5 bg-[#D4AF37] rounded-full group-hover:scale-150 transition-all duration-300"></span>
                <NuxtLink to="/contactos" class="hover:text-[#D4AF37] transition-colors focus:outline-none focus:text-[#D4AF37]">{{ t.contact }}</NuxtLink>
              </li>
            </ul>
          </div>
        </nav>

        <address class="not-italic" itemscope itemtype="https://schema.org/PostalAddress">
          <h3 class="text-base text-white font-serif mb-5 tracking-wide">{{ t.contactTitle }}</h3>
          <div class="space-y-3 text-[11px] font-light">
            <p itemprop="streetAddress">{{ t.address }}</p>
            <p>
              <a href="tel:+573150770508" class="hover:text-[#D4AF37] transition-colors focus:outline-none" aria-label="Llamar al Palacio Nacional">+57 315 077 05 08</a>
            </p>
            <p>
              <a href="mailto:Contacto@palacionacional.com.co" class="hover:text-[#D4AF37] transition-colors truncate focus:outline-none" aria-label="Enviar correo al Palacio Nacional">Contacto@palacionacional.com.co</a>
            </p>
          </div>
          <meta itemprop="addressLocality" content="Medellín" />
          <meta itemprop="addressCountry" content="CO" />
        </address>

        <div>
          <h3 class="text-base text-white font-serif mb-5 tracking-wide">{{ t.hoursTitle }}</h3>
          <p class="text-[11px] font-light">
            {{ t.hours }}
          </p>
        </div>
      </div>

      <div class="mt-10 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-5 text-[10px] text-gray-500">
        <p>{{ t.rights }}</p>
        <div class="flex items-center gap-5">
          <NuxtLink to="/terminos" class="hover:text-white transition-colors text-center focus:outline-none">{{ t.terms }}</NuxtLink>
          <button 
            @click="scrollToTop" 
            class="bg-white/10 hover:bg-[#D4AF37] hover:text-black transition-all duration-500 p-3 rounded-full flex items-center justify-center border border-white/5 shadow-lg hover:shadow-[0_5px_20px_rgba(212,175,55,0.4)] hover:-translate-y-1 flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]"
            aria-label="Volver arriba"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path></svg>
          </button>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
// ESTADO GLOBAL SSR NUXT 3
const idiomaGlobal = useState('idiomaGlobal', () => 'es')

const TRADUCCIONES = {
  es: {
    desc: 'Bienvenido a uno de los tesoros arquitectónicos más icónicos de Medellín. Inaugurado en 1933 y diseñado por el arquitecto belga Agustín Goovaerts.',
    explore: 'Explorar', history: 'Nuestra Historia', collections: 'Colecciones', events: 'Nuestros eventos', galleries: 'Galerías', news: 'Últimas Noticias', faq: 'Preguntas frecuentes', contact: 'Contacto',
    contactTitle: 'Contacto', address: 'Cra. 52 #48-45, La Candelaria, Medellín',
    hoursTitle: 'Horario', hours: 'Diario: 9.00 AM–7.00 PM',
    rights: 'Copyright © Palacio Nacional, Todos los derechos reservados.',
    terms: 'Términos & condiciones | Política de privacidad | Términos de uso'
  },
  en: {
    desc: 'Welcome to one of the most iconic architectural treasures of Medellin. Opened in 1933 and designed by Belgian architect Agustín Goovaerts.',
    explore: 'Explore', history: 'Our History', collections: 'Collections', events: 'Our Events', galleries: 'Galleries', news: 'Latest News', faq: 'FAQ', contact: 'Contact',
    contactTitle: 'Contact', address: 'Cra. 52 #48-45, La Candelaria, Medellin',
    hoursTitle: 'Hours', hours: 'Daily: 9.00 AM–7.00 PM',
    rights: 'Copyright © Palacio Nacional, All rights reserved.',
    terms: 'Terms & conditions | Privacy policy | Terms of use'
  },
  fr: {
    desc: 'Bienvenue dans l\'un des trésors architecturaux les plus emblématiques de Medellín. Inauguré en 1933 et conçu par l\'architecte belge Agustín Goovaerts.',
    explore: 'Explorer', history: 'Notre Histoire', collections: 'Collections', events: 'Nos Événements', galleries: 'Galeries', news: 'Dernières Nouvelles', faq: 'FAQ', contact: 'Contact',
    contactTitle: 'Contact', address: 'Cra. 52 #48-45, La Candelaria, Medellín',
    hoursTitle: 'Horaires', hours: 'Tous les jours: 7.00 AM–6.00 PM',
    rights: 'Copyright © Palacio Nacional, Tous droits réservés.',
    terms: 'Termes & conditions | Politique de confidentialité | Conditions d\'utilisation'
  },
  ja: {
    desc: 'メデジンで最も象徴的な建築の宝物の一つへようこそ。1933年にオープンし、ベルギーの建築家アグスティン・ゴーヴァルツによって設計されました。',
    explore: '探索', history: '私たちの歴史', collections: 'コレクション', events: 'イベント', galleries: 'ギャラリー', news: '最新ニュース', faq: 'よくある質問', contact: '連絡先',
    contactTitle: '連絡先', address: 'Cra. 52 #48-45, La Candelaria, Medellín',
    hoursTitle: '営業時間', hours: '毎日: 9.00 AM–7.00 PM',
    rights: '著作権 © Palacio Nacional、無断複写・転載を禁じます。',
    terms: '利用規約 | プライバシーポリシー | 利用条件'
  }
}

const t = computed(() => TRADUCCIONES[idiomaGlobal.value] || TRADUCCIONES.es)

const scrollToTop = () => {
  if (import.meta.client) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

// === SEO SSR NUXT 3 (Schema Entity Inyectado en el Servidor) ===
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TouristAttraction",
        "name": "Palacio Nacional Medellín",
        "description": "Joya arquitectónica e histórica de Medellín, con galerías de arte, locales comerciales y una variada oferta gastronómica.",
        "image": "https://palacionacionalmedellin.com/logon.png",
        "url": "https://palacionacionalmedellin.com/",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Cra. 52 #48-45, La Candelaria",
          "addressLocality": "Medellín",
          "addressRegion": "Antioquia",
          "addressCountry": "CO"
        },
        "telephone": "+573150770508"
      })
    }
  ]
})
</script>

<style scoped>
.antialiased {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>