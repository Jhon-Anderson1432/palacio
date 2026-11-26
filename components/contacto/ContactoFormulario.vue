<template>
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
</template>

<script setup>
const props = defineProps({
  t: {
    type: Object,
    required: true
  }
})

const motivosDisponibles = computed(() =>
  Object.entries(props.t.topics).map(([id, info]) => ({
    id,
    etiqueta: info.label,
    icono: info.icono
  }))
)

const motivoSeleccionado = ref('visita')
const form = ref({ nombre: '', email: '', mensaje: '' })
const errores = ref({ nombre: '', email: '', mensaje: '' })
const envioConfirmado = ref('')

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
    nombre: nombre.length >= 2 ? '' : props.t.errName,
    email: regexEmail.test(email) ? '' : props.t.errEmail,
    mensaje: mensaje.length >= 10 ? '' : props.t.errMsg
  }

  errores.value = nuevosErrores

  const primerInvalido = ['nombre', 'email', 'mensaje'].find(campo => nuevosErrores[campo])
  if (primerInvalido && import.meta.client) {
    document.getElementById(primerInvalido)?.focus()
  }

  return !primerInvalido
}

const construirMensajeEstructurado = () => {
  const etiquetaMotivo = props.t.topics[motivoSeleccionado.value]?.label || ''
  const nombre = form.value.nombre.trim()
  const email = form.value.email.trim()
  const mensaje = form.value.mensaje.trim()

  const textoCompleto = [
    props.t.waGreeting,
    '',
    `*${props.t.waReasonLabel}:* ${etiquetaMotivo}`,
    `*${props.t.waNameLabel}:* ${nombre}`,
    `*${props.t.waEmailLabel}:* ${email}`,
    `*${props.t.waMessageLabel}:*`,
    mensaje
  ].join('\n')

  const asuntoCorreo = `${props.t.emailSubjectPrefix} - ${etiquetaMotivo} (${nombre})`
  const cuerpoCorreo = [
    `${props.t.waReasonLabel}: ${etiquetaMotivo}`,
    `${props.t.waNameLabel}: ${nombre}`,
    `${props.t.waEmailLabel}: ${email}`,
    '',
    `${props.t.waMessageLabel}:`,
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
