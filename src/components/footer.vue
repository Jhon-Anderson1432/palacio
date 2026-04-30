<template>
  <footer class="bg-black/40 backdrop-blur-md text-gray-400 py-8 border-t border-[#D4AF37]/20 font-sans relative z-50 w-full mt-auto">
    <div class="max-w-7xl mx-auto px-6">
      
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6">
        
        <div class="space-y-4">
          <img src="@/assets/logon.png" alt="Palacio Nacional" class="w-32 object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.2)]" />
          <p class="text-[11px] leading-relaxed text-justify">
            {{ t.desc }}
          </p>
        </div>

        <div>
          <h3 class="text-base text-white font-serif mb-4">{{ t.explore }}</h3>
          <div class="grid grid-cols-2 gap-x-4 text-[11px]">
            <ul class="space-y-2">
              <li class="flex items-center gap-2 hover:text-[#D4AF37] transition-colors cursor-pointer"><span class="w-1 h-1 bg-[#D4AF37] rounded-full"></span>{{ t.history }}</li>
              <li class="flex items-center gap-2 hover:text-[#D4AF37] transition-colors cursor-pointer"><span class="w-1 h-1 bg-[#D4AF37] rounded-full"></span>{{ t.collections }}</li>
              <li class="flex items-center gap-2 hover:text-[#D4AF37] transition-colors cursor-pointer"><span class="w-1 h-1 bg-[#D4AF37] rounded-full"></span>{{ t.events }}</li>
              <li class="flex items-center gap-2 hover:text-[#D4AF37] transition-colors cursor-pointer"><span class="w-1 h-1 bg-[#D4AF37] rounded-full"></span>{{ t.galleries }}</li>
            </ul>
            <ul class="space-y-2">
              <li class="flex items-center gap-2 hover:text-[#D4AF37] transition-colors cursor-pointer"><span class="w-1 h-1 bg-[#D4AF37] rounded-full"></span>{{ t.news }}</li>
              <li class="flex items-center gap-2 hover:text-[#D4AF37] transition-colors cursor-pointer"><span class="w-1 h-1 bg-[#D4AF37] rounded-full"></span>{{ t.faq }}</li>
              <li class="flex items-center gap-2 hover:text-[#D4AF37] transition-colors cursor-pointer"><span class="w-1 h-1 bg-[#D4AF37] rounded-full"></span>{{ t.contact }}</li>
            </ul>
          </div>
        </div>

        <div>
          <h3 class="text-base text-white font-serif mb-4">{{ t.contactTitle }}</h3>
          <div class="space-y-2 text-[11px]">
            <p>{{ t.address }}</p>
            <p>+57 315 077 05 08</p>
            <p class="hover:text-[#D4AF37] cursor-pointer transition-colors truncate">Contacto@palacionacional.com.co</p>
          </div>
        </div>

        <div>
          <h3 class="text-base text-white font-serif mb-4">{{ t.hoursTitle }}</h3>
          <p class="text-[11px]">{{ t.hours }}</p>
        </div>
      </div>

      <div class="mt-8 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-gray-500">
        <p>{{ t.rights }}</p>
        <div class="flex items-center gap-4">
          <p class="hover:text-white cursor-pointer transition-colors text-center">{{ t.terms }}</p>
          <button @click="scrollToTop" class="bg-white/10 hover:bg-[#D4AF37] hover:text-black transition-all p-2 rounded-full flex items-center justify-center border border-white/5 shadow-lg hover:scale-110 flex-shrink-0 backdrop-blur-sm">
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path></svg>
          </button>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'
import { idiomaGlobal } from '../lib/supabase'

const traducciones = {
  es: {
    desc: 'Bienvenido a uno de los tesoros arquitectónicos más icónicos de Medellín. Inaugurado en 1933 y diseñado por el arquitecto belga Agustín Goovaerts.',
    explore: 'Explorar', history: 'Nuestra Historia', collections: 'Colecciones', events: 'Nuestros eventos', galleries: 'Galerías', news: 'Últimas Noticias', faq: 'Preguntas frecuentes', contact: 'Contacto',
    contactTitle: 'Contacto', address: 'Cra. 52 #48-45, La Candelaria, Medellín',
    hoursTitle: 'Horario', hours: 'Diario: 9.00 AM–6.00 PM',
    rights: 'Copyright © Palacio Nacional, Todos los derechos reservados.',
    terms: 'Términos & condiciones | Política de privacidad | Términos de uso'
  },
  en: {
    desc: 'Welcome to one of the most iconic architectural treasures of Medellin. Opened in 1933 and designed by Belgian architect Agustín Goovaerts.',
    explore: 'Explore', history: 'Our History', collections: 'Collections', events: 'Our Events', galleries: 'Galleries', news: 'Latest News', faq: 'FAQ', contact: 'Contact',
    contactTitle: 'Contact', address: 'Cra. 52 #48-45, La Candelaria, Medellin',
    hoursTitle: 'Hours', hours: 'Daily: 9.00 AM–6.00 PM',
    rights: 'Copyright © Palacio Nacional, All rights reserved.',
    terms: 'Terms & conditions | Privacy policy | Terms of use'
  },
  fr: {
    desc: 'Bienvenue dans l\'un des trésors architecturaux les plus emblématiques de Medellín. Inauguré en 1933 et conçu par l\'architecte belge Agustín Goovaerts.',
    explore: 'Explorer', history: 'Notre Histoire', collections: 'Collections', events: 'Nos Événements', galleries: 'Galeries', news: 'Dernières Nouvelles', faq: 'FAQ', contact: 'Contact',
    contactTitle: 'Contact', address: 'Cra. 52 #48-45, La Candelaria, Medellín',
    hoursTitle: 'Horaires', hours: 'Tous les jours: 9.00 AM–6.00 PM',
    rights: 'Copyright © Palacio Nacional, Tous droits réservés.',
    terms: 'Termes & conditions | Politique de confidentialité | Conditions d\'utilisation'
  },
  ja: {
    desc: 'メデジンで最も象徴的な建築の宝物の一つへようこそ。1933年にオープンし、ベルギーの建築家アグスティン・ゴーヴァルツによって設計されました。',
    explore: '探索', history: '私たちの歴史', collections: 'コレクション', events: 'イベント', galleries: 'ギャラリー', news: '最新ニュース', faq: 'よくある質問', contact: '連絡先',
    contactTitle: '連絡先', address: 'Cra. 52 #48-45, La Candelaria, Medellín',
    hoursTitle: '営業時間', hours: '毎日: 9.00 AM–6.00 PM',
    rights: '著作権 © Palacio Nacional、無断複写・転載を禁じます。',
    terms: '利用規約 | プライバシーポリシー | 利用条件'
  }
}

const t = computed(() => traducciones[idiomaGlobal.value] || traducciones['es'])

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>