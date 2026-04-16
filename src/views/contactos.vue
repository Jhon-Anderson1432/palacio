<template>
  <main class="relative min-h-screen w-full font-sans text-white overflow-x-hidden pt-24 pb-16">
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

    <header class="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-[#D4AF37]/20 px-6 py-4 flex items-center justify-between">
      
      <button 
        @click="router.push('/')" 
        class="group flex items-center gap-3 px-5 py-2.5 bg-black/40 border border-[#D4AF37]/30 rounded-full text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-all duration-500 uppercase tracking-widest text-[10px] font-bold shadow-[0_0_10px_rgba(212,175,55,0.05)] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
      >
        <svg class="w-4 h-4 transform group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        {{ t.back }}
      </button>

      <div class="flex items-center gap-3">
        <button 
          @click="idioma = 'es'" 
          :class="['text-[10px] tracking-widest font-bold transition-all', idioma === 'es' ? 'text-[#D4AF37]' : 'text-gray-500 hover:text-white']"
        >
          ES
        </button>
        <span class="text-white/10 text-[10px]">|</span>
        <button 
          @click="idioma = 'en'" 
          :class="['text-[10px] tracking-widest font-bold transition-all', idioma === 'en' ? 'text-[#D4AF37]' : 'text-gray-500 hover:text-white']"
        >
          EN
        </button>
      </div>
      
    </header>

    <div class="relative z-20 flex flex-col items-center justify-center px-4 py-8">
      
      <div class="text-center mb-12 mt-4">
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
              <input type="text" id="nombre" v-model="form.nombre" required class="w-full bg-transparent border-b border-gray-600 focus:border-[#D4AF37] text-white py-2 outline-none transition-colors peer placeholder-transparent" :placeholder="t.formNamePlaceholder" />
              <label for="nombre" class="absolute left-0 top-2 text-gray-500 uppercase tracking-widest text-xs transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-2 peer-focus:-top-5 peer-focus:text-[#D4AF37] peer-focus:text-[10px] peer-valid:-top-5 peer-valid:text-[10px]">
                {{ t.formNameLabel }}
              </label>
            </div>
            
            <div class="relative">
              <input type="email" id="email" v-model="form.email" required class="w-full bg-transparent border-b border-gray-600 focus:border-[#D4AF37] text-white py-2 outline-none transition-colors peer placeholder-transparent" :placeholder="t.formEmailPlaceholder" />
              <label for="email" class="absolute left-0 top-2 text-gray-500 uppercase tracking-widest text-xs transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-2 peer-focus:-top-5 peer-focus:text-[#D4AF37] peer-focus:text-[10px] peer-valid:-top-5 peer-valid:text-[10px]">
                {{ t.formEmailLabel }}
              </label>
            </div>
            
            <div class="relative">
              <textarea id="mensaje" v-model="form.mensaje" required rows="4" class="w-full bg-transparent border-b border-gray-600 focus:border-[#D4AF37] text-white py-2 outline-none transition-colors peer resize-none placeholder-transparent" :placeholder="t.formMsgPlaceholder"></textarea>
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
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.052062536838!2d-75.57053538466645!3d6.252654395475654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e4428f7800baebf%3A0xc61ab0d4538965f3!2sMuseo%20de%20Antioquia!5e0!3m2!1ses-419!2sco!4v1700000000000!5m2!1ses-419!2sco" 
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
                contacto@palacio.com
              </p>
              <p class="flex items-center gap-4">
                <svg class="w-5 h-5 text-[#D4AF37] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
                +57 (300) 249-3543
              </p>
            </div>
          </div>

          <div class="mt-10">
            <div class="flex gap-6">
              <a href="#" class="text-gray-400 hover:text-[#D4AF37] transform hover:scale-110 transition-all duration-300">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.7-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-[#D4AF37] transform hover:scale-110 transition-all duration-300">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" class="text-gray-400 hover:text-[#D4AF37] transform hover:scale-110 transition-all duration-300">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const idioma = ref('es')

// Reactividad limpia para el formulario (El estándar de Vue 3)
const form = ref({
  nombre: '',
  email: '',
  mensaje: ''
})

// Diccionario de Traducciones
const textos = {
  es: {
    back: 'Volver al Inicio',
    title: 'Contacto',
    subtitle: 'Estamos a su entera disposición',
    writeUs: 'Escríbanos',
    formNamePlaceholder: 'Nombre',
    formNameLabel: 'Nombre Completo',
    formEmailPlaceholder: 'Email',
    formEmailLabel: 'Correo Electrónico',
    formMsgPlaceholder: 'Mensaje',
    formMsgLabel: 'Su Mensaje',
    submitBtn: 'Enviar Solicitud',
    visitUs: 'Visítenos',
    locationCity: 'Centro, Medellín'
  },
  en: {
    back: 'Back to Home',
    title: 'Contact',
    subtitle: 'We are entirely at your disposal',
    writeUs: 'Write to us',
    formNamePlaceholder: 'Name',
    formNameLabel: 'Full Name',
    formEmailPlaceholder: 'Email',
    formEmailLabel: 'Email Address',
    formMsgPlaceholder: 'Message',
    formMsgLabel: 'Your Message',
    submitBtn: 'Send Request',
    visitUs: 'Visit Us',
    locationCity: 'Downtown, Medellin'
  }
}

const t = computed(() => textos[idioma.value])

const enviarMensaje = () => {
  // Ahora usamos form.value en lugar de buscar elementos en el DOM
  const texto = `Hola Palacio, soy ${form.value.nombre} (${form.value.email}).%0A%0A${form.value.mensaje}`
  
  // URL de WhatsApp intacta
  const url = `https://wa.me/573002493543?text=${texto}`
  
  window.open(url, '_blank')
}
</script>

<style scoped>
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: black;
}
::-webkit-scrollbar-thumb {
  background: #D4AF37;
}
</style>