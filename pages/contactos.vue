<template>
  <main
    class="min-h-screen bg-[#050505] text-white font-sans flex flex-col selection:bg-[#D4AF37] selection:text-black antialiased relative overflow-x-hidden"
    role="main"
    aria-label="Contacto y Ubicación - Palacio Nacional Medellín"
  >
    <!-- Iluminación ambiental sutil -->
    <div class="fixed top-0 left-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none z-0"></div>
    <div class="fixed bottom-1/4 right-10 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[160px] pointer-events-none z-0"></div>

    <!-- Barra de Navegación -->
    <Navbar :fondoTranslucido="true" />

    <!-- ======================================================== -->
    <!-- 1. HERO HEADER & MIGAS DE PAN                            -->
    <!-- ======================================================== -->
    <header class="relative z-10 pt-32 md:pt-40 pb-10 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto text-center w-full">
      <nav aria-label="Breadcrumb" class="mb-6 flex items-center justify-center gap-2 text-[11px] uppercase tracking-widest text-neutral-400">
        <NuxtLink to="/" class="hover:text-[#D4AF37] transition-colors focus:outline-none focus:text-[#D4AF37]">{{ t.home }}</NuxtLink>
        <span class="text-neutral-600" aria-hidden="true">/</span>
        <span class="text-[#D4AF37] font-semibold">{{ t.breadcrumb }}</span>
      </nav>

      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] uppercase tracking-[0.25em] font-semibold mb-6 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
        <span aria-hidden="true">📍</span>
        <span>{{ t.badge }}</span>
      </div>

      <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-light tracking-wide text-white uppercase mb-5 leading-tight drop-shadow-md">
        {{ t.title }}
      </h1>

      <p class="text-xs sm:text-sm md:text-base text-neutral-300 font-light max-w-2xl mx-auto leading-relaxed">
        {{ t.subtitle }}
      </p>
    </header>

    <!-- ======================================================== -->
    <!-- 2. TARJETAS DE CONTACTO RÁPIDO                           -->
    <!-- ======================================================== -->
    <section class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-10" aria-label="Canales de atención directa">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          v-for="canal in canalesRapidos"
          :key="canal.id"
          class="group p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 hover:border-[#D4AF37]/40 transition-all duration-300 flex flex-col justify-between gap-4 shadow-lg"
        >
          <div class="space-y-2">
            <div class="flex items-center justify-between gap-2">
              <span class="text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] font-bold flex items-center gap-1.5">
                <span aria-hidden="true">{{ canal.icono }}</span>
                <span>{{ canal.etiqueta }}</span>
              </span>
              <span
                v-if="canal.insignia"
                class="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#D4AF37] font-semibold whitespace-nowrap"
              >
                {{ canal.insignia }}
              </span>
            </div>

            <a
              v-if="canal.href"
              :href="canal.href"
              :target="canal.externo ? '_blank' : undefined"
              :rel="canal.externo ? 'noopener noreferrer' : undefined"
              class="block text-sm sm:text-base font-medium text-white hover:text-[#D4AF37] transition-colors break-words focus:outline-none focus:text-[#D4AF37]"
            >
              {{ canal.valor }}
            </a>
            <p v-else class="text-sm sm:text-base font-medium text-white break-words">
              {{ canal.valor }}
            </p>

            <NuxtLink
              v-if="canal.enlaceInterno"
              :to="canal.enlaceInterno"
              class="inline-flex items-center gap-1 text-[11px] text-neutral-400 hover:text-[#D4AF37] transition-colors"
            >
              <span>{{ canal.subtexto }}</span>
              <span aria-hidden="true">→</span>
            </NuxtLink>
            <p v-else class="text-[11px] text-neutral-400 font-light leading-relaxed">
              {{ canal.subtexto }}
            </p>
          </div>

          <div v-if="canal.copiable" class="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
            <button
              type="button"
              @click="copiarDato(canal.id, canal.valorCopiar || canal.valor)"
              class="text-[11px] uppercase tracking-widest font-semibold text-neutral-400 hover:text-[#D4AF37] transition-colors flex items-center gap-1.5 focus:outline-none focus:text-[#D4AF37]"
              :aria-label="`${t.copyBtn}: ${canal.valor}`"
            >
              <span v-if="copiadoId === canal.id" class="text-emerald-400">✓ {{ t.copiedLabel }}</span>
              <span v-else>📋 {{ t.copyBtn }}</span>
            </button>

            <a
              v-if="canal.href"
              :href="canal.href"
              :target="canal.externo ? '_blank' : undefined"
              :rel="canal.externo ? 'noopener noreferrer' : undefined"
              class="text-[11px] uppercase tracking-widest font-bold text-[#D4AF37] hover:underline"
            >
              {{ canal.accionTexto }} →
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- ======================================================== -->
    <!-- 3. BLOQUE PRINCIPAL: FORMULARIO INTELIGENTE + UBICACIÓN  -->
    <!-- ======================================================== -->
    <section class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full" aria-label="Formulario de contacto y mapa">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

        <!-- COLUMNA IZQUIERDA: FORMULARIO INTELIGENTE -->
        <div class="lg:col-span-7 p-6 sm:p-10 md:p-12 rounded-3xl bg-gradient-to-br from-neutral-900/85 via-black/95 to-neutral-900/80 border border-[#D4AF37]/25 shadow-[0_20px_60px_rgba(0,0,0,0.8)] flex flex-col justify-between">
          <div>
            <div class="mb-8">
              <span class="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-bold block mb-2">
                {{ t.formEyebrow }}
              </span>
              <h2 class="text-2xl sm:text-3xl font-serif font-light tracking-wide text-white uppercase">
                {{ t.writeUs }}
              </h2>
            </div>

            <!-- Selector de Motivo / Área -->
            <div class="mb-7">
              <p class="text-[11px] uppercase tracking-widest text-neutral-400 font-semibold mb-3">
                {{ t.topicLabel }}
              </p>
              <div class="flex flex-wrap gap-2" role="group" :aria-label="t.topicLabel">
                <button
                  v-for="motivo in motivosDisponibles"
                  :key="motivo.id"
                  type="button"
                  @click="seleccionarMotivo(motivo.id)"
                  :aria-pressed="motivoSeleccionado === motivo.id"
                  :class="[
                    'px-3.5 py-2 rounded-full text-xs font-medium tracking-wide transition-all duration-300 border flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 active:scale-95',
                    motivoSeleccionado === motivo.id
                      ? 'bg-[#D4AF37] text-black border-[#D4AF37] font-bold shadow-[0_0_20px_rgba(212,175,55,0.3)]'
                      : 'bg-white/[0.03] text-neutral-300 border-white/10 hover:border-[#D4AF37]/40 hover:text-white'
                  ]"
                >
                  <span aria-hidden="true">{{ motivo.icono }}</span>
                  <span>{{ motivo.etiqueta }}</span>
                </button>
              </div>
            </div>

            <!-- Campos del Formulario -->
            <form @submit.prevent="enviarPorWhatsApp" class="space-y-5" novalidate>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label for="nombre" class="block text-[11px] uppercase tracking-widest text-neutral-300 font-semibold mb-2">
                    {{ t.formNameLabel }} <span class="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    id="nombre"
                    v-model="form.nombre"
                    type="text"
                    required
                    autocomplete="name"
                    @input="limpiarErrorCampo('nombre')"
                    :placeholder="t.formNamePlaceholder"
                    :aria-invalid="Boolean(errores.nombre)"
                    :aria-describedby="errores.nombre ? 'error-nombre' : undefined"
                    :class="[
                      'w-full bg-white/[0.03] border rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition-all duration-300',
                      errores.nombre
                        ? 'border-red-400/80 focus:border-red-400'
                        : 'border-white/15 focus:border-[#D4AF37] focus:bg-white/[0.05]'
                    ]"
                  />
                  <p v-if="errores.nombre" id="error-nombre" role="alert" class="mt-1.5 text-[11px] text-red-400 font-medium">
                    {{ errores.nombre }}
                  </p>
                </div>

                <div>
                  <label for="email" class="block text-[11px] uppercase tracking-widest text-neutral-300 font-semibold mb-2">
                    {{ t.formEmailLabel }} <span class="text-[#D4AF37]">*</span>
                  </label>
                  <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    required
                    autocomplete="email"
                    @input="limpiarErrorCampo('email')"
                    :placeholder="t.formEmailPlaceholder"
                    :aria-invalid="Boolean(errores.email)"
                    :aria-describedby="errores.email ? 'error-email' : undefined"
                    :class="[
                      'w-full bg-white/[0.03] border rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition-all duration-300',
                      errores.email
                        ? 'border-red-400/80 focus:border-red-400'
                        : 'border-white/15 focus:border-[#D4AF37] focus:bg-white/[0.05]'
                    ]"
                  />
                  <p v-if="errores.email" id="error-email" role="alert" class="mt-1.5 text-[11px] text-red-400 font-medium">
                    {{ errores.email }}
                  </p>
                </div>
              </div>

              <div>
                <label for="mensaje" class="block text-[11px] uppercase tracking-widest text-neutral-300 font-semibold mb-2">
                  {{ t.formMsgLabel }} <span class="text-[#D4AF37]">*</span>
                </label>
                <textarea
                  id="mensaje"
                  v-model="form.mensaje"
                  required
                  rows="4"
                  @input="limpiarErrorCampo('mensaje')"
                  :placeholder="t.formMsgPlaceholder"
                  :aria-invalid="Boolean(errores.mensaje)"
                  :aria-describedby="errores.mensaje ? 'error-mensaje' : undefined"
                  :class="[
                    'w-full bg-white/[0.03] border rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition-all duration-300 resize-none custom-scrollbar',
                    errores.mensaje
                      ? 'border-red-400/80 focus:border-red-400'
                      : 'border-white/15 focus:border-[#D4AF37] focus:bg-white/[0.05]'
                  ]"
                ></textarea>
                <p v-if="errores.mensaje" id="error-mensaje" role="alert" class="mt-1.5 text-[11px] text-red-400 font-medium">
                  {{ errores.mensaje }}
                </p>
              </div>

              <!-- Confirmación visual tras abrir canal -->
              <div
                v-if="envioConfirmado"
                role="status"
                class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in"
              >
                <p class="text-xs text-emerald-300 leading-relaxed">
                  ✓ {{ envioConfirmado === 'whatsapp' ? t.successWhatsapp : t.successEmail }}
                </p>
                <button
                  type="button"
                  @click="limpiarFormulario"
                  class="text-[11px] uppercase tracking-widest font-bold text-white/80 hover:text-white underline whitespace-nowrap self-start sm:self-center"
                >
                  {{ t.clearBtn }}
                </button>
              </div>

              <!-- Botones Duales de Envío -->
              <div class="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="submit"
                  class="w-full py-3.5 px-5 bg-[#D4AF37] text-black hover:bg-white transition-all duration-300 uppercase tracking-widest text-xs font-bold rounded-xl shadow-[0_0_25px_rgba(212,175,55,0.25)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] active:scale-[0.98] flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 focus:ring-offset-black"
                >
                  <svg class="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.031 2c-5.516 0-9.969 4.453-9.969 9.969 0 1.766.469 3.484 1.344 5l-1.406 5.141 5.266-1.375c1.469.797 3.125 1.219 4.766 1.219 5.516 0 9.969-4.453 9.969-9.969S17.547 2 12.031 2zm5.828 14.125c-.25.703-1.438 1.344-2 1.422-.516.078-1.188.109-1.922-.125-.453-.141-1.031-.328-1.766-.656-3.094-1.344-5.109-4.484-5.266-4.688-.156-.203-1.266-1.688-1.266-3.219 0-1.531.797-2.281 1.078-2.594.281-.313.609-.391.813-.391.203 0 .406 0 .578.016.188.016.438-.078.688.531.25.609.859 2.094.938 2.25.078.156.125.344.016.547-.109.203-.156.344-.313.531-.156.188-.328.406-.469.547-.156.156-.313.328-.141.641.172.313.781 1.281 1.672 2.078 1.156 1.031 2.125 1.344 2.438 1.5.313.156.484.125.672-.078.188-.203.781-.906.984-1.219.203-.313.406-.266.688-.156.281.109 1.797.844 2.109 1 .313.156.516.234.594.359.078.125.078.734-.172 1.438z"/>
                  </svg>
                  <span>{{ t.submitWhatsappBtn }}</span>
                </button>

                <button
                  type="button"
                  @click="enviarPorCorreo"
                  class="w-full py-3.5 px-5 bg-white/[0.04] hover:bg-white/10 text-white border border-white/15 hover:border-[#D4AF37]/50 transition-all duration-300 uppercase tracking-widest text-xs font-bold rounded-xl active:scale-[0.98] flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40"
                >
                  <svg class="w-4 h-4 flex-shrink-0 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{{ t.submitEmailBtn }}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- COLUMNA DERECHA: MAPA Y GUÍA DE LLEGADA -->
        <div class="lg:col-span-5 p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-neutral-900/70 via-black to-black border border-white/10 shadow-2xl flex flex-col justify-between gap-6">
          <div>
            <span class="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-bold block mb-2">
              {{ t.visitEyebrow }}
            </span>
            <h2 class="text-2xl sm:text-3xl font-serif font-light tracking-wide text-white uppercase mb-6">
              {{ t.visitUs }}
            </h2>

            <!-- Mapa Google Maps -->
            <div class="w-full h-60 sm:h-64 border border-[#D4AF37]/30 overflow-hidden relative group bg-neutral-900 rounded-2xl shadow-inner mb-4">
              <iframe
                :title="t.mapTitle"
                :src="urlMapaEmbebido"
                class="w-full h-full grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-in-out"
                style="border:0;"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe>
              <div class="absolute inset-0 border border-white/5 pointer-events-none rounded-2xl"></div>
            </div>

            <a
              href="https://www.google.com/maps?cid=14092102146313754178"
              target="_blank"
              rel="noopener noreferrer"
              class="w-full mb-7 inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white/[0.04] hover:bg-[#D4AF37] text-white hover:text-black border border-[#D4AF37]/30 text-xs font-bold uppercase tracking-widest transition-all duration-300"
            >
              <span aria-hidden="true">🗺️</span>
              <span>{{ t.openMapsBtn }}</span>
              <span aria-hidden="true">↗</span>
            </a>

            <!-- Guía Rápida de Llegada y Servicios -->
            <div class="space-y-3">
              <h3 class="text-[11px] uppercase tracking-[0.2em] text-neutral-400 font-bold mb-3">
                {{ t.arrivalGuideTitle }}
              </h3>

              <div
                v-for="item in guiaLlegada"
                :key="item.titulo"
                class="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5"
              >
                <span class="text-base leading-none mt-0.5 flex-shrink-0" aria-hidden="true">{{ item.icono }}</span>
                <div>
                  <h4 class="text-xs font-semibold text-white mb-0.5">{{ item.titulo }}</h4>
                  <p class="text-[11px] text-neutral-400 font-light leading-relaxed">{{ item.descripcion }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    <Footer />
  </main>
</template>

<script setup>
definePageMeta({
  layout: false
})

// === 1. ESTADO GLOBAL E IDIOMA ===
const idiomaGlobal = useIdiomaGlobal()

const textos = {
  es: {
    seoTitle: 'Contacto y Ubicación | Palacio Nacional Medellín',
    seoDesc: 'Encuentra la ubicación oficial del Palacio Nacional en la Carrera 52 # 48-45, centro de Medellín. Escríbenos vía WhatsApp o correo y planea tu visita.',
    seoOgTitle: '📍 Contacto y Ubicación | Palacio Nacional Medellín',
    seoOgDesc: 'Comunícate con el Palacio Nacional en Medellín, conoce cómo llegar en Metro y planea tu recorrido por nuestras galerías de arte y gastronomía.',
    home: 'Inicio',
    breadcrumb: 'Contacto',
    badge: 'Atención Oficial & Visitas',
    title: 'Contacto y Ubicación',
    subtitle: 'Estamos a su disposición para orientar su visita cultural, resolver consultas sobre obras de arte o coordinar eventos institucionales en el corazón de Medellín.',

    channelWhatsappLabel: 'WhatsApp Administrativo',
    whatsappOnlyNote: 'Solo WhatsApp',
    whatsappSub: 'Canal oficial de atención escrita (no llamadas)',
    channelEmailLabel: 'Correo Institucional',
    emailSub: 'Consultas formales, prensa y eventos',
    channelHoursLabel: 'Horario de Visita',
    hoursMain: 'Diario: 9:00 AM – 7:00 PM',
    hoursEventSub: 'Último jueves hasta 12:00 AM (Ver eventos)',
    channelAddressLabel: 'Sede Principal',
    locationCity: 'Carrera 52 # 48-45, La Candelaria, Medellín',
    copyBtn: 'Copiar',
    copiedLabel: 'Copiado',
    actionWrite: 'Abrir',

    formEyebrow: 'Canal Directo',
    writeUs: 'Escríbanos',
    topicLabel: 'Motivo de su consulta',
    topics: {
      visita: { label: 'Visitas y Horarios', icono: '🏛️' },
      arte: { label: 'Galería y Obras', icono: '🎨' },
      eventos: { label: 'Eventos / Noche de Galerías', icono: '🌙' },
      gastronomia: { label: 'Gastronomía Piso 5', icono: '🍽️' },
      otro: { label: 'Otro / Institucional', icono: '✉️' }
    },

    formNameLabel: 'Nombre Completo',
    formNamePlaceholder: 'Ej. Laura Gómez',
    formEmailLabel: 'Correo Electrónico',
    formEmailPlaceholder: 'correo@ejemplo.com',
    formMsgLabel: 'Su Mensaje',
    formMsgPlaceholder: 'Cuéntenos cómo podemos ayudarle en su visita o solicitud...',
    errName: 'Por favor ingresa tu nombre (mínimo 2 caracteres).',
    errEmail: 'Por favor ingresa un correo electrónico válido.',
    errMsg: 'Por favor escribe un mensaje de al menos 10 caracteres.',
    submitWhatsappBtn: 'Enviar por WhatsApp',
    submitEmailBtn: 'Enviar por Correo',
    successWhatsapp: '¡Solicitud lista! Se abrió WhatsApp con su mensaje.',
    successEmail: '¡Solicitud lista! Se abrió su aplicación de correo.',
    clearBtn: 'Limpiar',
    waGreeting: 'Hola Palacio Nacional, les escribo desde la web.',
    waReasonLabel: 'Motivo',
    waNameLabel: 'Nombre',
    waEmailLabel: 'Correo',
    waMessageLabel: 'Mensaje',
    emailSubjectPrefix: 'Contacto Web Palacio Nacional',

    visitEyebrow: 'Cómo Llegar',
    visitUs: 'Visítenos',
    mapTitle: 'Mapa de ubicación del Palacio Nacional Medellín en Carrera 52 # 48-45',
    openMapsBtn: 'Abrir en Google Maps',
    arrivalGuideTitle: 'Información Práctica de Llegada',
    arrivalMetroTitle: 'Metro de Medellín',
    arrivalMetroDesc: 'Estación Parque Berrío (Línea A) o Estación San Antonio (Líneas A y B), a menos de 5 minutos caminando.',
    arrivalParkTitle: 'Parqueaderos Cercanos',
    arrivalParkDesc: 'Edificio peatonalizado; encontrará parqueaderos públicos vigilados a menos de 2 cuadras a la redonda.',
    arrivalAccessTitle: 'Entrada Libre y Accesibilidad',
    arrivalAccessDesc: 'Ingreso 100% gratuito. Contamos con rampas de acceso y ascensores hacia los 5 pisos.'
  },
  en: {
    seoTitle: 'Contact & Location | Palacio Nacional Medellín',
    seoDesc: 'Find Palacio Nacional official location at Carrera 52 # 48-45 in downtown Medellin. Reach out via WhatsApp or email and plan your visit.',
    seoOgTitle: '📍 Contact & Location | Palacio Nacional Medellín',
    seoOgDesc: 'Get in touch with Palacio Nacional in Medellin, find Metro directions, and plan your visit to our art galleries and Floor 5 dining.',
    home: 'Home',
    breadcrumb: 'Contact',
    badge: 'Official Support & Visitor Info',
    title: 'Contact & Location',
    subtitle: 'We are at your disposal to guide your cultural visit, assist with contemporary art inquiries, or coordinate institutional events in downtown Medellin.',

    channelWhatsappLabel: 'Administrative WhatsApp',
    whatsappOnlyNote: 'WhatsApp Only',
    whatsappSub: 'Official written support channel (no voice calls)',
    channelEmailLabel: 'Official Email',
    emailSub: 'Formal inquiries, press, and events',
    channelHoursLabel: 'Opening Hours',
    hoursMain: 'Daily: 9:00 AM – 7:00 PM',
    hoursEventSub: 'Last Thursday open until 12:00 AM (See events)',
    channelAddressLabel: 'Main Address',
    locationCity: 'Carrera 52 # 48-45, La Candelaria, Medellin',
    copyBtn: 'Copy',
    copiedLabel: 'Copied',
    actionWrite: 'Open',

    formEyebrow: 'Direct Message',
    writeUs: 'Write to Us',
    topicLabel: 'Inquiry Topic',
    topics: {
      visita: { label: 'Visits & Hours', icono: '🏛️' },
      arte: { label: 'Art Gallery & Pieces', icono: '🎨' },
      eventos: { label: 'Events / Gallery Night', icono: '🌙' },
      gastronomia: { label: 'Floor 5 Dining', icono: '🍽️' },
      otro: { label: 'Other / Institutional', icono: '✉️' }
    },

    formNameLabel: 'Full Name',
    formNamePlaceholder: 'e.g. Jane Doe',
    formEmailLabel: 'Email Address',
    formEmailPlaceholder: 'you@example.com',
    formMsgLabel: 'Your Message',
    formMsgPlaceholder: 'Let us know how we can help with your visit or inquiry...',
    errName: 'Please enter your name (at least 2 characters).',
    errEmail: 'Please enter a valid email address.',
    errMsg: 'Please write a message of at least 10 characters.',
    submitWhatsappBtn: 'Send via WhatsApp',
    submitEmailBtn: 'Send via Email',
    successWhatsapp: 'Message ready! WhatsApp opened with your details.',
    successEmail: 'Message ready! Your email app has been opened.',
    clearBtn: 'Clear',
    waGreeting: 'Hello Palacio Nacional, I am contacting you from the website.',
    waReasonLabel: 'Topic',
    waNameLabel: 'Name',
    waEmailLabel: 'Email',
    waMessageLabel: 'Message',
    emailSubjectPrefix: 'Palacio Nacional Web Inquiry',

    visitEyebrow: 'Directions',
    visitUs: 'Visit Us',
    mapTitle: 'Palacio Nacional Medellin map at Carrera 52 # 48-45',
    openMapsBtn: 'Open in Google Maps',
    arrivalGuideTitle: 'Practical Visitor Guide',
    arrivalMetroTitle: 'Medellin Metro',
    arrivalMetroDesc: 'Parque Berrío Station (Line A) or San Antonio Station (Lines A & B), less than a 5-minute walk.',
    arrivalParkTitle: 'Nearby Parking',
    arrivalParkDesc: 'Pedestrian historic district with several guarded public parking lots within 2 blocks.',
    arrivalAccessTitle: 'Free Entry & Accessibility'
  },
  fr: {
    seoTitle: 'Contact et Localisation | Palacio Nacional Medellín',
    seoDesc: 'Retrouvez le Palacio Nacional à Carrera 52 # 48-45, centre de Medellín. Écrivez-nous via WhatsApp ou email pour préparer votre visite.',
    seoOgTitle: '📍 Contact et Localisation | Palacio Nacional Medellín',
    seoOgDesc: 'Contactez le Palacio Nacional de Medellín, consultez l\'accès en métro et planifiez votre visite culturelle et gastronomique.',
    home: 'Accueil',
    breadcrumb: 'Contact',
    badge: 'Accueil Officiel & Visites',
    title: 'Contact et Localisation',
    subtitle: 'Nous sommes à votre entière disposition pour orienter votre visite culturelle, répondre aux demandes sur les œuvres d\'art ou coordonner vos événements.',

    channelWhatsappLabel: 'WhatsApp Administratif',
    whatsappOnlyNote: 'WhatsApp Uniquement',
    whatsappSub: 'Canal officiel par message écrit (pas d\'appels)',
    channelEmailLabel: 'Email Officiel',
    emailSub: 'Demandes formelles, presse et événements',
    channelHoursLabel: 'Horaires d\'Ouverture',
    hoursMain: 'Tous les jours : 9h00 – 19h00',
    hoursEventSub: 'Dernier jeudi jusqu\'à minuit (Voir événements)',
    channelAddressLabel: 'Adresse Principale',
    locationCity: 'Carrera 52 # 48-45, La Candelaria, Medellín',
    copyBtn: 'Copier',
    copiedLabel: 'Copié',
    actionWrite: 'Ouvrir',

    formEyebrow: 'Message Direct',
    writeUs: 'Écrivez-nous',
    topicLabel: 'Objet de votre demande',
    topics: {
      visita: { label: 'Visites & Horaires', icono: '🏛️' },
      arte: { label: 'Galerie & Œuvres', icono: '🎨' },
      eventos: { label: 'Événements / Nuit des Galeries', icono: '🌙' },
      gastronomia: { label: 'Gastronomie 5e Étage', icono: '🍽️' },
      otro: { label: 'Autre / Institutionnel', icono: '✉️' }
    },

    formNameLabel: 'Nom Complet',
    formNamePlaceholder: 'Ex. Camille Laurent',
    formEmailLabel: 'Adresse Email',
    formEmailPlaceholder: 'vous@exemple.com',
    formMsgLabel: 'Votre Message',
    formMsgPlaceholder: 'Expliquez-nous comment nous pouvons vous aider...',
    errName: 'Veuillez saisir votre nom (minimum 2 caractères).',
    errEmail: 'Veuillez saisir une adresse email valide.',
    errMsg: 'Veuillez rédiger un message d\'au moins 10 caractères.',
    submitWhatsappBtn: 'Envoyer via WhatsApp',
    submitEmailBtn: 'Envoyer par Email',
    successWhatsapp: 'Demande prête ! WhatsApp s\'est ouvert avec votre message.',
    successEmail: 'Demande prête ! Votre messagerie s\'est ouverte.',
    clearBtn: 'Effacer',
    waGreeting: 'Bonjour Palacio Nacional, je vous écris depuis le site web.',
    waReasonLabel: 'Objet',
    waNameLabel: 'Nom',
    waEmailLabel: 'Email',
    waMessageLabel: 'Message',
    emailSubjectPrefix: 'Contact Web Palacio Nacional',

    visitEyebrow: 'Comment Venir',
    visitUs: 'Rendez-nous Visite',
    mapTitle: 'Carte du Palacio Nacional Medellín à Carrera 52 # 48-45',
    openMapsBtn: 'Ouvrir dans Google Maps',
    arrivalGuideTitle: 'Guide Pratique d\'Accès',
    arrivalMetroTitle: 'Métro de Medellín',
    arrivalMetroDesc: 'Stations Parque Berrío (Ligne A) et San Antonio (Lignes A et B) à moins de 5 minutes à pied.',
    arrivalParkTitle: 'Parkings à Proximité',
    arrivalParkDesc: 'Zone historique piétonne entourée de parkings publics surveillés à moins de deux pâtés de maisons.',
    arrivalAccessTitle: 'Entrée Libre & Accessibilité',
    arrivalAccessDesc: 'Accès 100% gratuit. Rampes d\'accès et ascenseurs desservant les 5 étages.'
  },
  ja: {
    seoTitle: 'お問い合わせ・アクセス | メデジン国立宮殿',
    seoDesc: 'メデジン中心部（Carrera 52 # 48-45）にあるメデジン国立宮殿のお問い合わせ・アクセスページ。WhatsAppまたはメールでお気軽にご連絡ください。',
    seoOgTitle: '📍 お問い合わせ・アクセス | メデジン国立宮殿',
    seoOgDesc: 'メデジン国立宮殿へのアクセス、メトロ最寄り駅、アートギャラリーや5階レストランに関するお問い合わせはこちらから。',
    home: 'ホーム',
    breadcrumb: 'お問い合わせ',
    badge: '公式サポート・ご訪問案内',
    title: 'お問い合わせ・アクセス',
    subtitle: '文化見学のご案内、現代アート作品のご相談、各種イベントに関するお問い合わせを心よりお待ちしております。',

    channelWhatsappLabel: '公式管理窓口 WhatsApp',
    whatsappOnlyNote: 'WhatsApp専用',
    whatsappSub: 'テキストメッセージ専用窓口（音声通話不可）',
    channelEmailLabel: '公式メールアドレス',
    emailSub: '取材・イベント・一般のお問い合わせ',
    channelHoursLabel: '開館時間',
    hoursMain: '毎日：9:00 AM – 7:00 PM',
    hoursEventSub: '毎月最終木曜は深夜0時まで延長（イベント詳細）',
    channelAddressLabel: '所在地',
    locationCity: 'Carrera 52 # 48-45, La Candelaria, Medellín',
    copyBtn: 'コピー',
    copiedLabel: 'コピー済',
    actionWrite: '開く',

    formEyebrow: 'ダイレクト送信',
    writeUs: 'メッセージを送る',
    topicLabel: 'お問い合わせ内容',
    topics: {
      visita: { label: '見学・開館時間', icono: '🏛️' },
      arte: { label: 'ギャラリー・作品購入', icono: '🎨' },
      eventos: { label: 'ギャラリー・ナイト', icono: '🌙' },
      gastronomia: { label: '5階レストラン予約', icono: '🍽️' },
      otro: { label: 'その他のお問い合わせ', icono: '✉️' }
    },

    formNameLabel: 'お名前',
    formNamePlaceholder: '例：山田 太郎',
    formEmailLabel: 'メールアドレス',
    formEmailPlaceholder: 'you@example.com',
    formMsgLabel: 'メッセージ内容',
    formMsgPlaceholder: 'ご質問やご要望をお気軽にご記入ください...',
    errName: 'お名前を2文字以上でご入力ください。',
    errEmail: '有効なメールアドレスをご入力ください。',
    errMsg: 'メッセージは10文字以上でご入力ください。',
    submitWhatsappBtn: 'WhatsAppで送信',
    submitEmailBtn: 'メールで送信',
    successWhatsapp: '準備が完了しました。WhatsAppが開きました。',
    successEmail: '準備が完了しました。メールアプリが開きました。',
    clearBtn: 'リセット',
    waGreeting: 'メデジン国立宮殿様、ウェブサイトよりお問い合わせいたします。',
    waReasonLabel: '用件',
    waNameLabel: 'お名前',
    waEmailLabel: 'メール',
    waMessageLabel: '内容',
    emailSubjectPrefix: 'Palacio Nacional Webお問い合わせ',

    visitEyebrow: 'アクセス案内',
    visitUs: 'ご訪問案内',
    mapTitle: 'メデジン国立宮殿 地図（Carrera 52 # 48-45）',
    openMapsBtn: 'Googleマップで経路を見る',
    arrivalGuideTitle: 'ご来館インフォメーション',
    arrivalMetroTitle: 'メデジン・メトロ最寄り駅',
    arrivalMetroDesc: 'Parque Berrío駅（A線）またはSan Antonio駅（A・B線）から徒歩5分以内です。',
    arrivalParkTitle: '近隣駐車場',
    arrivalParkDesc: '建物周辺は歩行者天国ですが、2ブロック圏内に複数の有料・警備付き駐車場がございます。',
    arrivalAccessTitle: '入場無料・バリアフリー',
    arrivalAccessDesc: '入館料は完全無料です。スロープおよび全5階対応のエレベーターを完備しています。'
  }
}

const t = computed(() => textos[idiomaGlobal.value] || textos.es)

// === 2. CANALES RÁPIDOS & GUÍA DE LLEGADA (SIN DUPLICACIÓN DE PLANTILLA) ===
const canalesRapidos = computed(() => [
  {
    id: 'whatsapp',
    icono: '💬',
    etiqueta: t.value.channelWhatsappLabel,
    insignia: t.value.whatsappOnlyNote,
    valor: '+57 311 639 0177',
    subtexto: t.value.whatsappSub,
    href: 'https://wa.me/573116390177',
    externo: true,
    copiable: true,
    accionTexto: t.value.actionWrite
  },
  {
    id: 'email',
    icono: '✉️',
    etiqueta: t.value.channelEmailLabel,
    valor: 'ccpalacional@gmail.com',
    subtexto: t.value.emailSub,
    href: 'mailto:ccpalacional@gmail.com',
    externo: false,
    copiable: true,
    accionTexto: t.value.actionWrite
  },
  {
    id: 'hours',
    icono: '🕒',
    etiqueta: t.value.channelHoursLabel,
    valor: t.value.hoursMain,
    subtexto: t.value.hoursEventSub,
    enlaceInterno: '/eventos',
    copiable: false
  },
  {
    id: 'address',
    icono: '🏛️',
    etiqueta: t.value.channelAddressLabel,
    valor: 'Carrera 52 # 48-45',
    valorCopiar: 'Carrera 52 # 48-45, La Candelaria, Medellín',
    subtexto: 'La Candelaria, Medellín',
    href: 'https://www.google.com/maps?cid=14092102146313754178',
    externo: true,
    copiable: true,
    accionTexto: t.value.actionWrite
  }
])

const motivosDisponibles = computed(() =>
  Object.entries(t.value.topics).map(([id, info]) => ({
    id,
    etiqueta: info.label,
    icono: info.icono
  }))
)

const guiaLlegada = computed(() => [
  { icono: '🚇', titulo: t.value.arrivalMetroTitle, descripcion: t.value.arrivalMetroDesc },
  { icono: '🅿️', titulo: t.value.arrivalParkTitle, descripcion: t.value.arrivalParkDesc },
])

const urlWhatsAppSkyBar = computed(() =>
  `https://wa.me/573212865949?text=${encodeURIComponent(t.value.gastroSkyBarMsg)}`
)

const urlMapaEmbebido = computed(() => {
  const lang = ['es', 'en', 'fr', 'ja'].includes(idiomaGlobal.value) ? idiomaGlobal.value : 'es'
  const query = encodeURIComponent('Palacio Nacional, Carrera 52 # 48-45, Medellín')
  return `https://maps.google.com/maps?q=${query}&t=&z=16&hl=${lang}&ie=UTF8&iwloc=&output=embed`
})

// === 3. ESTADO DEL FORMULARIO, VALIDACIÓN Y COPIA ===
const motivoSeleccionado = ref('visita')
const form = ref({ nombre: '', email: '', mensaje: '' })
const errores = ref({ nombre: '', email: '', mensaje: '' })
const envioConfirmado = ref('')
const copiadoId = ref('')
let timeoutCopiado = null

const seleccionarMotivo = (id) => {
  motivoSeleccionado.value = id
  envioConfirmado.value = ''
}

const limpiarErrorCampo = (campo) => {
  if (errores.value[campo]) {
    errores.value[campo] = ''
  }
}

const validarFormulario = () => {
  const nombre = form.value.nombre.trim()
  const email = form.value.email.trim()
  const mensaje = form.value.mensaje.trim()
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  const nuevosErrores = {
    nombre: nombre.length >= 2 ? '' : t.value.errName,
    email: regexEmail.test(email) ? '' : t.value.errEmail,
    mensaje: mensaje.length >= 10 ? '' : t.value.errMsg
  }

  errores.value = nuevosErrores

  const primerInvalido = ['nombre', 'email', 'mensaje'].find(campo => nuevosErrores[campo])
  if (primerInvalido && import.meta.client) {
    document.getElementById(primerInvalido)?.focus()
  }

  return !primerInvalido
}

const construirMensajeEstructurado = () => {
  const etiquetaMotivo = t.value.topics[motivoSeleccionado.value]?.label || ''
  const nombre = form.value.nombre.trim()
  const email = form.value.email.trim()
  const mensaje = form.value.mensaje.trim()

  const textoCompleto = [
    t.value.waGreeting,
    '',
    `*${t.value.waReasonLabel}:* ${etiquetaMotivo}`,
    `*${t.value.waNameLabel}:* ${nombre}`,
    `*${t.value.waEmailLabel}:* ${email}`,
    `*${t.value.waMessageLabel}:*`,
    mensaje
  ].join('\n')

  const asuntoCorreo = `${t.value.emailSubjectPrefix} - ${etiquetaMotivo} (${nombre})`
  const cuerpoCorreo = [
    `${t.value.waReasonLabel}: ${etiquetaMotivo}`,
    `${t.value.waNameLabel}: ${nombre}`,
    `${t.value.waEmailLabel}: ${email}`,
    '',
    `${t.value.waMessageLabel}:`,
    mensaje
  ].join('\n')

  return { textoCompleto, asuntoCorreo, cuerpoCorreo }
}

const enviarPorWhatsApp = () => {
  if (!validarFormulario() || !import.meta.client) return
  const { textoCompleto } = construirMensajeEstructurado()
  const url = `https://wa.me/573116390177?text=${encodeURIComponent(textoCompleto)}`
  window.open(url, '_blank', 'noopener,noreferrer')
  envioConfirmado.value = 'whatsapp'
}

const enviarPorCorreo = () => {
  if (!validarFormulario() || !import.meta.client) return
  const { asuntoCorreo, cuerpoCorreo } = construirMensajeEstructurado()
  const mailtoUrl = `mailto:ccpalacional@gmail.com?subject=${encodeURIComponent(asuntoCorreo)}&body=${encodeURIComponent(cuerpoCorreo)}`
  window.location.href = mailtoUrl
  envioConfirmado.value = 'email'
}

const limpiarFormulario = () => {
  form.value = { nombre: '', email: '', mensaje: '' }
  errores.value = { nombre: '', email: '', mensaje: '' }
  envioConfirmado.value = ''
}

const copiarDato = async (id, valor) => {
  if (!import.meta.client) return
  try {
    await navigator.clipboard.writeText(valor)
    copiadoId.value = id
    if (timeoutCopiado) clearTimeout(timeoutCopiado)
    timeoutCopiado = setTimeout(() => {
      copiadoId.value = ''
    }, 2200)
  } catch (e) {
    console.warn('No se pudo copiar al portapapeles:', e)
  }
}

onBeforeUnmount(() => {
  if (timeoutCopiado) clearTimeout(timeoutCopiado)
})

// === 4. SEO REACTIVO Y SCHEMA.ORG (SIN RASTROS DE "MODA") ===
useSeoMeta({
  title: () => t.value.seoTitle,
  description: () => t.value.seoDesc,
  robots: 'index, follow, max-image-preview:large, max-snippet:-1',
  ogTitle: () => t.value.seoOgTitle,
  ogDescription: () => t.value.seoOgDesc,
  ogImage: 'https://palacionacionalmedellin.com/logon.png',
  ogUrl: 'https://palacionacionalmedellin.com/contactos',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: () => t.value.seoTitle,
  twitterDescription: () => t.value.seoOgDesc,
  twitterImage: 'https://palacionacionalmedellin.com/logon.png'
})

useHead({
  link: [
    { rel: 'canonical', href: 'https://palacionacionalmedellin.com/contactos' }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TouristAttraction",
        "name": "Palacio Nacional Medellín",
        "url": "https://palacionacionalmedellin.com/contactos",
        "image": "https://palacionacionalmedellin.com/logon.png",
        "description": "Monumento histórico y centro cultural en Medellín dedicado al arte contemporáneo, patrimonio arquitectónico y gastronomía.",
        "isAccessibleForFree": true,
        "hasMap": "https://www.google.com/maps?cid=14092102146313754178",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Carrera 52 # 48-45",
          "addressLocality": "Medellín",
          "addressRegion": "Antioquia",
          "postalCode": "050010",
          "addressCountry": "CO"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 6.25184,
          "longitude": -75.56359
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday"
            ],
            "opens": "09:00",
            "closes": "19:00"
          }
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+57-311-639-0177",
          "email": "ccpalacional@gmail.com",
          "contactType": "customer service",
          "availableLanguage": ["Spanish", "English", "French", "Japanese"]
        },
        "breadcrumb": {
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "Inicio",
              "item": "https://palacionacionalmedellin.com/"
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "Contacto",
              "item": "https://palacionacionalmedellin.com/contactos"
            }
          ]
        }
      })
    }
  ]
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(212, 175, 55, 0.3);
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(212, 175, 55, 0.6);
}

input:-webkit-autofill,
textarea:-webkit-autofill {
  -webkit-box-shadow: 0 0 0 30px #0a0a0a inset !important;
  -webkit-text-fill-color: white !important;
  transition: background-color 5000s ease-in-out 0s;
}
</style>
