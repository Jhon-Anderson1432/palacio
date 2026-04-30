<template>
  <main class="relative min-h-screen w-full font-sans bg-[#0a0a0a] text-white overflow-x-hidden pt-32">
    
    <Navbar :ocultarBuscador="true" />

    <div class="text-center mb-16 px-4">
      <h1 class="text-4xl md:text-6xl font-light tracking-[0.15em] uppercase mb-4 text-[#D4AF37] drop-shadow-[0_0_15px_rgba(212,175,55,0.2)]">
        {{ t.title }}
      </h1>
      <p class="text-gray-400 font-light tracking-widest uppercase text-xs md:text-sm max-w-2xl mx-auto">
        {{ t.subtitle }}
      </p>
    </div>

    <div class="max-w-6xl mx-auto relative px-4 md:px-8 mb-20">
      
      <div class="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#D4AF37]/0 via-[#D4AF37]/50 to-[#D4AF37]/0 md:-translate-x-1/2"></div>

      <div 
        v-for="(item, index) in timelineTranslated" 
        :key="index" 
        class="relative flex flex-col md:flex-row items-center w-full mb-16 md:mb-32 group"
      >
        <div class="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-[#0a0a0a] border-2 border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.8)] transform -translate-x-1/2 top-8 md:top-1/2 md:-translate-y-1/2 z-10 transition-transform duration-500 group-hover:scale-150 group-hover:bg-[#D4AF37]"></div>

        <div :class="['w-full md:w-1/2 pl-16 md:px-12', index % 2 === 0 ? 'md:mr-auto' : 'md:ml-auto']">
          
          <div class="bg-black/40 backdrop-blur-md border border-[#D4AF37]/20 rounded-xl p-6 hover:border-[#D4AF37]/60 hover:bg-white/5 transition-all duration-500 shadow-lg hover:shadow-[0_0_30px_rgba(212,175,55,0.15)] group-hover:-translate-y-2 relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-[#D4AF37]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

            <div class="relative z-10">
              <div class="w-full h-48 md:h-64 mb-6 rounded-lg overflow-hidden border border-white/5 relative">
                <img :src="item.img" :alt="item.title" class="w-full h-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 transform group-hover:scale-110" />
              </div>
              
              <div :class="index % 2 === 0 ? 'md:text-right' : 'md:text-left'">
                <span class="text-[#D4AF37] font-bold text-xl tracking-[0.2em] block mb-2">{{ item.year }}</span>
                <h3 class="text-white text-2xl font-light uppercase tracking-widest mb-4">{{ item.title }}</h3>
                <p class="text-gray-400 font-light leading-relaxed text-sm tracking-wide text-justify">
                  {{ item.desc }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Footer />
  </main>
</template>

<script setup>
import { computed } from 'vue'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/footer.vue'
import { idiomaGlobal } from '../lib/supabase'

const textos = {
  es: { title: 'Nuestra Historia', subtitle: 'Desde los cimientos de la justicia hasta el santuario del arte' },
  en: { title: 'Our History', subtitle: 'From the foundations of justice to the sanctuary of art' },
  fr: { title: 'Notre Histoire', subtitle: 'Des fondations de la justice au sanctuaire de l\'art' },
  ja: { title: '私たちの歴史', subtitle: '正義の基盤から芸術の聖域へ' }
}

const t = computed(() => textos[idiomaGlobal.value] || textos['es'])

const timelineData = [
  {
    year: '1920', img: '/pa1.jpg',
    es: { title: 'El Llamado a Europa', desc: 'El gobierno departamental encomendó el diseño al arquitecto belga Agustín Goovaerts.' },
    en: { title: 'The Call to Europe', desc: 'The regional government commissioned Belgian architect Agustín Goovaerts.' },
    fr: { title: 'L\'Appel à l\'Europe', desc: 'Le gouvernement régional a chargé l\'architecte belge Agustín Goovaerts.' },
    ja: { title: 'ヨーロッパへの呼びかけ', desc: '地方政府はベルギーの建築家アグスティン・ゴーヴァルツに設計を依頼しました。' }
  },
  {
    year: '1925 - 1933', img: '/pa2.jpg',
    es: { title: 'Cimientos Románticos', desc: 'Consolidado como el máximo exponente del estilo romántico modernizado.' },
    en: { title: 'Romantic Foundations', desc: 'Established as the finest example of modernized romantic style.' },
    fr: { title: 'Fondations Romantiques', desc: 'Établi comme le plus bel exemple de style romantique modernisé.' },
    ja: { title: 'ロマンチックな基盤', desc: '近代化されたロマンチックなスタイルの最高峰として確立。' }
  },
  {
    year: '1933 - 1988', img: '/pag3.webp',
    es: { title: 'Sede de la Justicia', desc: 'Durante cinco décadas funcionó como el Palacio de Justicia de Antioquia.' },
    en: { title: 'Seat of Justice', desc: 'For five decades it served as the Palace of Justice of Antioquia.' },
    fr: { title: 'Siège de la Justice', desc: 'Pendant cinq décennies, il a servi de Palais de Justice d\'Antioquia.' },
    ja: { title: '正義の座', desc: '50年間にわたり、アンティオキアの正義の宮殿として機能しました。' }
  },
  {
    year: '1988', img: '/pa5.jpg',
    es: { title: 'Patrimonio de la Nación', desc: 'Declarado Patrimonio Histórico y Artístico de la Nación.' },
    en: { title: 'National Heritage', desc: 'Declared National Historical and Artistic Heritage.' },
    fr: { title: 'Patrimoine National', desc: 'Déclaré Patrimoine Historique et Artistique National.' },
    ja: { title: '国家遺産', desc: '国家歴史的・芸術的遺産に指定されました。' }
  },
  {
    year: 'Actualidad', img: '/pa4.jpg',
    es: { title: 'Santuario del Arte', desc: 'Hoy, los pisos superiores resguardan una vibrante galería de arte contemporáneo.' },
    en: { title: 'Art Sanctuary', desc: 'Today, the upper floors house a vibrant contemporary art gallery.' },
    fr: { title: 'Sanctuaire de l\'Art', desc: 'Aujourd\'hui, les étages supérieurs abritent une galerie d\'art contemporain.' },
    ja: { title: 'アートの聖域', desc: '現在、上層階には活気ある現代アートギャラリーが収容されています。' }
  }
]

const timelineTranslated = computed(() => {
  return timelineData.map(item => ({
    year: item.year, img: item.img,
    title: item[idiomaGlobal.value]?.title || item['es'].title,
    desc: item[idiomaGlobal.value]?.desc || item['es'].desc
  }))
})
</script>