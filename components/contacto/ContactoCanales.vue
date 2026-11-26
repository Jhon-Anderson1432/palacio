<template>
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
</template>

<script setup>
const props = defineProps({
  t: {
    type: Object,
    required: true
  }
})

const canalesRapidos = computed(() => [
  {
    id: 'whatsapp',
    icono: '💬',
    etiqueta: props.t.channelWhatsappLabel,
    insignia: props.t.whatsappOnlyNote,
    valor: '+57 311 639 0177',
    subtexto: props.t.whatsappSub,
    href: 'https://wa.me/573116390177',
    externo: true,
    copiable: true,
    accionTexto: props.t.actionWrite
  },
  {
    id: 'email',
    icono: '✉️',
    etiqueta: props.t.channelEmailLabel,
    valor: 'ccpalacional@gmail.com',
    subtexto: props.t.emailSub,
    href: 'mailto:ccpalacional@gmail.com',
    externo: false,
    copiable: true,
    accionTexto: props.t.actionWrite
  },
  {
    id: 'hours',
    icono: '🕒',
    etiqueta: props.t.channelHoursLabel,
    valor: props.t.hoursMain,
    subtexto: props.t.hoursEventSub,
    enlaceInterno: '/eventos',
    copiable: false
  },
  {
    id: 'address',
    icono: '🏛️',
    etiqueta: props.t.channelAddressLabel,
    valor: 'Carrera 52 # 48-45',
    valorCopiar: 'Carrera 52 # 48-45, La Candelaria, Medellín',
    subtexto: 'La Candelaria, Medellín',
    href: 'https://www.google.com/maps/search/?api=1&query=Palacio+Nacional%2C+Carrera+52+%23+48-45%2C+Medell%C3%ADn',
    externo: true,
    copiable: true,
    accionTexto: props.t.actionWrite
  }
])

const copiadoId = ref('')
let timeoutCopiado = null

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
</script>
