<template>
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
        href="https://www.google.com/maps/search/?api=1&query=Palacio+Nacional%2C+Carrera+52+%23+48-45%2C+Medell%C3%ADn"
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
</template>

<script setup>
const props = defineProps({
  t: {
    type: Object,
    required: true
  },
  idiomaGlobal: {
    type: String,
    default: 'es'
  }
})

const guiaLlegada = computed(() => [
  { icono: '🚇', titulo: props.t.arrivalMetroTitle, descripcion: props.t.arrivalMetroDesc },
  { icono: '🅿️', titulo: props.t.arrivalParkTitle, descripcion: props.t.arrivalParkDesc },
])

const urlMapaEmbebido = computed(() => {
  const lang = ['es', 'en', 'fr', 'ja'].includes(props.idiomaGlobal) ? props.idiomaGlobal : 'es'
  const query = encodeURIComponent('Palacio Nacional, Carrera 52 # 48-45, Medellín')
  return `https://maps.google.com/maps?q=${query}&t=&z=16&hl=${lang}&ie=UTF8&iwloc=&output=embed`
})
</script>
