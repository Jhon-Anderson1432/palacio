<template>
  <main 
    class="h-[100dvh] w-full bg-[#0a0a0a] text-white flex flex-col relative font-sans antialiased select-none overflow-hidden"
    role="application"
    aria-label="Terminal de Seguridad del Palacio Nacional"
  >
    
    <!-- HEADER -->
    <header class="bg-[#111]/95 backdrop-blur-xl p-5 border-b border-[#D4AF37]/20 flex justify-between items-center shadow-[0_4px_20px_rgba(0,0,0,0.6)] z-20 relative">
      <div>
        <h1 class="text-[#D4AF37] font-serif text-xl uppercase tracking-widest drop-shadow-sm">Control de Seguridad</h1>
        <p class="text-xs text-neutral-400 mt-1 uppercase tracking-wider font-medium">
          Escáner Directo
        </p>
      </div>
      <button 
        @click="cerrarSesion" 
        class="text-red-500 text-xs font-bold uppercase tracking-widest hover:text-red-400 p-2 active:scale-90 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-red-500/30 rounded-lg"
        aria-label="Cerrar sesión de seguridad"
      >
        Salir
      </button>
    </header>

    <!-- ZONA DEL ESCÁNER -->
    <section class="flex-1 relative bg-black flex flex-col items-center justify-center z-10" aria-label="Cámara de escaneo QR">
      
      <div class="w-full h-full max-w-md mx-auto relative shadow-[0_0_50px_rgba(212,175,55,0.05)] bg-black overflow-hidden">
        
        <transition name="fade">
          <div v-if="cargandoCamara" class="absolute inset-0 flex items-center justify-center bg-black/95 backdrop-blur-md z-30">
            <div class="flex flex-col items-center gap-4">
              <div class="w-8 h-8 border-4 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin"></div>
              <span class="text-[#D4AF37] text-xs uppercase tracking-widest font-bold">Activando cámara...</span>
            </div>
          </div>
        </transition>

        <!-- Componente de Cámara envuelto para evitar errores de SSR en Nuxt 3 -->
        <ClientOnly>
          <qrcode-stream 
            @detect="onDetect" 
            @camera-on="cargandoCamara = false"
            :track="pintarMarcoQR"
            class="w-full h-full object-cover opacity-90"
          ></qrcode-stream>
          
          <template #fallback>
            <div class="absolute inset-0 flex items-center justify-center bg-black">
              <span class="text-[#D4AF37] text-xs uppercase tracking-widest font-bold animate-pulse">Cargando módulo de escáner...</span>
            </div>
          </template>
        </ClientOnly>

        <!-- Overlay Visual del Escáner -->
        <div class="absolute inset-0 pointer-events-none border-[40px] border-black/70 flex items-center justify-center z-20 transition-all duration-500">
          <div class="w-64 h-64 border-2 border-[#D4AF37]/70 rounded-3xl relative shadow-[0_0_25px_rgba(212,175,55,0.25)]">
            <!-- Animación de escaneo (Láser sutil) -->
            <div class="absolute top-0 left-0 w-full h-[2px] bg-[#D4AF37] shadow-[0_0_10px_#D4AF37] opacity-80 animate-scan"></div>
            
            <span class="absolute -top-10 left-0 right-0 text-center text-[10px] text-white uppercase tracking-widest font-bold drop-shadow-md">
              Apunta al código QR del piso
            </span>
            
            <!-- Esquinas decorativas del escáner -->
            <div class="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-[#D4AF37] rounded-tl-xl"></div>
            <div class="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-[#D4AF37] rounded-tr-xl"></div>
            <div class="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-[#D4AF37] rounded-bl-xl"></div>
            <div class="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-[#D4AF37] rounded-br-xl"></div>
          </div>
        </div>

      </div>
    </section>

    <!-- MODAL DE REGISTRO DE VIGILANTE -->
    <transition name="modal-slide">
      <div 
        v-if="mostrandoModalObservacion" 
        class="absolute inset-0 z-50 bg-black/90 backdrop-blur-xl flex flex-col p-6 items-center justify-center"
        role="dialog"
        aria-modal="true"
      >
        <div class="w-full max-w-md bg-[#0a0a0a] border border-[#D4AF37]/30 rounded-3xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex flex-col transform transition-all">
          
          <div class="text-center mb-6">
            <div class="w-12 h-12 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <svg class="w-6 h-6 text-[#D4AF37]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h3 class="text-xl font-serif text-[#D4AF37] tracking-wider uppercase">QR Registrado</h3>
            <p class="text-xs text-neutral-400 mt-2 uppercase tracking-widest">
              Punto: <span class="font-bold text-white border-b border-[#D4AF37]/30 pb-0.5">{{ puntoActual?.nombre }}</span>
            </p>
          </div>
          
          <form @submit.prevent="guardarRegistro" class="w-full space-y-4">
            
            <div class="space-y-1.5 group">
              <label for="nombreVigilante" class="text-[10px] text-neutral-400 uppercase tracking-widest font-bold ml-1 group-focus-within:text-[#D4AF37] transition-colors">
                Nombre del Vigilante (Requerido)
              </label>
              <input 
                id="nombreVigilante"
                v-model="nombreVigilante" 
                type="text"
                required
                autocomplete="name"
                autocapitalize="words"
                placeholder="Ej: Juan Pérez"
                class="w-full bg-black/60 border border-white/10 rounded-xl p-4 text-white text-sm outline-none focus:border-[#D4AF37] focus:bg-black focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-300 placeholder:text-neutral-600 font-light shadow-inner"
              />
            </div>

            <div class="space-y-1.5 group">
              <label for="observacion" class="text-[10px] text-neutral-400 uppercase tracking-widest font-bold ml-1 group-focus-within:text-[#D4AF37] transition-colors">
                Añadir observación (Opcional)
              </label>
              <textarea 
                id="observacion"
                v-model="observacion" 
                rows="3" 
                placeholder="Ej: Todo normal, luces apagadas..."
                class="w-full bg-black/60 border border-white/10 rounded-xl p-4 text-white text-sm outline-none focus:border-[#D4AF37] focus:bg-black focus:ring-2 focus:ring-[#D4AF37]/20 transition-all duration-300 placeholder:text-neutral-600 font-light resize-none shadow-inner"
              ></textarea>
            </div>
            
            <div class="pt-4 flex gap-3">
              <button 
                type="button" 
                @click="cancelarRegistro" 
                class="w-1/3 border border-red-500/30 text-red-500 font-bold uppercase tracking-widest text-xs py-4 rounded-xl hover:bg-red-500/10 active:scale-95 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500/40"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                :disabled="guardando"
                class="flex-1 bg-[#D4AF37] text-black font-bold uppercase tracking-widest text-xs py-4 rounded-xl hover:bg-yellow-500 hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none focus:outline-none focus:ring-4 focus:ring-[#D4AF37]/40"
              >
                {{ guardando ? 'Guardando...' : 'Confirmar' }}
              </button>
            </div>
          </form>

        </div>
      </div>
    </transition>

  </main>
</template>

<script setup>
import { QrcodeStream } from 'vue-qrcode-reader'

// CLIENTE NATIVE SUPABASE PARA NUXT 3 (Seguro en SSR)
const supabase = useSupabaseClient()

// ==========================================
// 🛡️ PILLAR SEO: Anti-SEO (Capa de Invisibilidad SSR)
// ==========================================
useHead({
  title: 'Control de Seguridad | Escáner QR Palacio Nacional',
  meta: [
    { name: 'robots', content: 'noindex, nofollow, noarchive, nosnippet' },
    { name: 'googlebot', content: 'noindex, nofollow' }
  ]
})

// ==========================================
// ESTADOS REACTIVOS
// ==========================================
const cargandoCamara = ref(true)
const procesandoQR = ref(false)
const guardando = ref(false)

const mostrandoModalObservacion = ref(false)
const puntoActual = ref(null)
const observacion = ref('')
const nombreVigilante = ref('')

// ==========================================
// LÓGICA DEL ESCÁNER Y NEGOCIO
// ==========================================
const onDetect = async (detectedCodes) => {
  if (procesandoQR.value) return
  
  const rawCode = (detectedCodes[0].rawValue || detectedCodes[0].value || '').trim()
  if (!rawCode) return

  procesandoQR.value = true

  try {
    const { data: puntoData, error } = await supabase
      .from('puntos_control')
      .select('*')
      .eq('codigo_qr', rawCode)
      .maybeSingle()

    if (error) throw error

    if (!puntoData) {
      if (import.meta.client) alert("❌ Código QR no encontrado en la base de datos de seguridad.")
      setTimeout(() => { procesandoQR.value = false }, 2000)
      return
    }

    puntoActual.value = puntoData
    observacion.value = ''
    mostrandoModalObservacion.value = true

  } catch (error) {
    if (import.meta.client) alert("Error de lectura: " + error.message)
    procesandoQR.value = false
  }
}

const guardarRegistro = async () => {
  if (!nombreVigilante.value.trim()) return

  guardando.value = true
  try {
    const horaExacta = new Date().toISOString()

    const { error } = await supabase.from('registros_punto_control').insert([{
      punto_control_id: puntoActual.value.id,
      nombre_vigilante: nombreVigilante.value.trim(),
      observacion: observacion.value.trim() || 'Sin novedad',
      hora_registro: horaExacta 
    }])

    if (error) throw error

    nombreVigilante.value = '' 
    
  } catch (error) {
    if (import.meta.client) alert("Error al guardar en el servidor: " + error.message)
  } finally {
    guardando.value = false
    mostrandoModalObservacion.value = false
    puntoActual.value = null
    setTimeout(() => { procesandoQR.value = false }, 1500)
  }
}

const cancelarRegistro = () => {
  mostrandoModalObservacion.value = false
  puntoActual.value = null
  setTimeout(() => { procesandoQR.value = false }, 500)
}

const pintarMarcoQR = (detectedCodes, ctx) => {
  ctx.lineWidth = 4
  ctx.strokeStyle = '#D4AF37'
  for (const barcode of detectedCodes) {
    const { boundingBox: { x, y, width, height } } = barcode
    ctx.strokeRect(x, y, width, height)
  }
}

const cerrarSesion = () => {
  return navigateTo('/')
}
definePageMeta({
  layout: false // Apaga el layout maestro. Ni Navbar ni Footer aparecerán.
})
</script>

<style scoped>
.antialiased {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.modal-slide-enter-active,
.modal-slide-leave-active {
  transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.modal-slide-enter-from,
.modal-slide-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(15px);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.animate-scan {
  animation: scan 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

@keyframes scan {
  0% { transform: translateY(0); opacity: 0; }
  10% { opacity: 1; }
  90% { opacity: 1; }
  100% { transform: translateY(240px); opacity: 0; }
}

input:focus, textarea:focus, button:focus {
  outline: none;
}
</style>