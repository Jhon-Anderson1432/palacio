<template>
  <main class="relative min-h-screen w-full font-sans text-white overflow-x-hidden pt-32">
    <video
      autoplay
      loop
      muted
      playsinline
      class="fixed top-0 left-0 w-full h-full object-cover z-0"
    >
      <source src="/fondo.mp4" type="video/mp4" />
    </video>

    <div class="fixed top-0 left-0 w-full h-full bg-black/80 z-10"></div>

    <Navbar :ocultarBuscador="true" />

    <div class="relative z-20 flex flex-col items-center justify-center px-4 pb-20">
      
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-6xl font-light tracking-[0.15em] uppercase mb-4 text-[#D4AF37] drop-shadow-lg">
          {{ t.title }}
        </h1>
        <p class="font-light tracking-widest text-gray-400 uppercase text-sm">
          {{ t.subtitle }}
        </p>
      </div>

      <div class="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-0 bg-black/40 backdrop-blur-xl border border-[#D4AF37]/30 shadow-[0_0_30px_rgba(0,0,0,0.8)]">
        
        <div class="p-8 md:p-12 border-b md:border-b-0 md:border-r border-[#D4AF37]/20 flex flex-col justify-center">
          <h2 class="text-2xl font-light tracking-widest mb-10 text-white uppercase">{{ t.writeUs }}</h2>
          
          <form @submit.prevent="enviarMensaje" class="space-y-8">
            <div class="relative">
              <input type="text" id="nombre" v-model="form.nombre" required class="w-full bg-transparent border-b border-gray-600 focus:border-[#D4AF37] text-white py-2 outline-none transition-colors peer placeholder-transparent" />
              <label for="nombre" class="absolute left-0 top-2 text-gray-500 uppercase tracking-widest text-xs transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-2 peer-focus:-top-5 peer-focus:text-[#D4AF37] peer-focus:text-[10px] peer-valid:-top-5 peer-valid:text-[10px]">
                {{ t.formNameLabel }}
              </label>
            </div>
            
            <div class="relative">
              <input type="email" id="email" v-model="form.email" required class="w-full bg-transparent border-b border-gray-600 focus:border-[#D4AF37] text-white py-2 outline-none transition-colors peer placeholder-transparent" />
              <label for="email" class="absolute left-0 top-2 text-gray-500 uppercase tracking-widest text-xs transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-2 peer-focus:-top-5 peer-focus:text-[#D4AF37] peer-focus:text-[10px] peer-valid:-top-5 peer-valid:text-[10px]">
                {{ t.formEmailLabel }}
              </label>
            </div>
            
            <div class="relative">
              <textarea id="mensaje" v-model="form.mensaje" required rows="4" class="w-full bg-transparent border-b border-gray-600 focus:border-[#D4AF37] text-white py-2 outline-none transition-colors peer resize-none placeholder-transparent"></textarea>
              <label for="mensaje" class="absolute left-0 top-2 text-gray-500 uppercase tracking-widest text-xs transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-2 peer-focus:-top-5 peer-focus:text-[#D4AF37] peer-focus:text-[10px] peer-valid:-top-5 peer-valid:text-[10px]">
                {{ t.formMsgLabel }}
              </label>
            </div>

            <button type="submit" class="w-full py-4 mt-4 border border-[#D4AF37] bg-transparent text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all duration-500 uppercase tracking-widest text-sm font-medium shadow-[0_0_10px_rgba(212,175,55,0.05)] hover:shadow-[0_0_20px_rgba(212,175,55,0.3)]">
              {{ t.submitBtn }}
            </button>
          </form>
        </div>

        <div class="p-8 md:p-12 flex flex-col justify-between">
          <div>
            <h2 class="text-2xl font-light tracking-widest mb-8 text-white uppercase">{{ t.visitUs }}</h2>
            
            <div class="w-full h-48 mb-8 border border-[#D4AF37]/20 overflow-hidden relative group bg-gray-900">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.071271168541!2d-75.57211568523075!3d6.254332995472855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e4428f967f6b98b%3A0xc3911c7793d59642!2sPalacio%20Nacional!5e0!3m2!1ses!2sco!4v1651234567890!5m2!1ses!2sco" 
                class="w-full h-full grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
                style="border:0;" 
                allowfullscreen="" 
                loading="lazy">
              </iframe>
            </div>

            <div class="space-y-5 font-light tracking-wider text-sm text-gray-300">
              <p class="flex items-start gap-4">
                <svg class="w-5 h-5 mt-0.5 text-[#D4AF37] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                <span>Carrera 52 # 52-43<br/>{{ t.locationCity }}</span>
              </p>
              <p class="flex items-center gap-4">
                <svg class="w-5 h-5 text-[#D4AF37] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                ccpalacional@gmail.com
              </p>
              <p class="flex items-center gap-4">
                <svg class="w-5 h-5 text-[#D4AF37] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                +57 (311) 639-0177
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import Navbar from '../components/Navbar.vue'
import Footer from '../components/footer.vue'
import { idiomaGlobal } from '../lib/supabase'

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
</script>