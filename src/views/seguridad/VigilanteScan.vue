<template>
  <div class="h-[100dvh] w-full bg-[#0a0a0a] text-white flex flex-col relative font-sans">
    
    <header class="bg-[#111] p-5 border-b border-[#D4AF37]/30 flex justify-between items-center shadow-md z-10">
      <div>
        <h1 class="text-[#D4AF37] font-serif text-xl uppercase tracking-widest">Control de Seguridad</h1>
        <p class="text-xs text-neutral-400 mt-1 uppercase tracking-wider">
          Escáner Directo
        </p>
      </div>
      <button @click="cerrarSesion" class="text-red-500 text-xs font-bold uppercase tracking-widest hover:text-red-400 p-2">
        Salir
      </button>
    </header>

    <div class="flex-1 relative bg-black overflow-hidden flex flex-col items-center justify-center">
      
      <div class="w-full h-full max-w-md mx-auto relative shadow-[0_0_50px_rgba(212,175,55,0.1)]">
        
        <div v-if="cargandoCamara" class="absolute inset-0 flex items-center justify-center bg-black z-10">
          <span class="text-[#D4AF37] text-sm uppercase tracking-widest animate-pulse">Activando cámara...</span>
        </div>

        <qrcode-stream 
          @detect="onDetect" 
          @camera-on="cargandoCamara = false"
          :track="pintarMarcoQR"
          class="w-full h-full object-cover"
        ></qrcode-stream>

        <div class="absolute inset-0 pointer-events-none border-[40px] border-black/60 flex items-center justify-center">
          <div class="w-64 h-64 border-2 border-[#D4AF37] rounded-3xl relative">
            <span class="absolute -top-10 left-0 right-0 text-center text-xs text-white uppercase tracking-widest">
              Apunta al código QR del piso
            </span>
          </div>
        </div>

      </div>
    </div>

    <div v-if="mostrandoModalObservacion" class="absolute inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col p-6 items-center justify-center">
      <h3 class="text-xl font-serif text-[#D4AF37] mb-2">QR Registrado</h3>
      <p class="text-sm text-gray-300 mb-6">Punto: <span class="font-bold text-white">{{ puntoActual?.nombre }}</span></p>
      
      <div class="w-full max-w-md">
        
        <label class="text-xs text-neutral-400 uppercase tracking-widest mb-2 block">Nombre del Vigilante (Requerido)</label>
        <input 
          v-model="nombreVigilante" 
          type="text"
          placeholder="Ej: Juan Pérez"
          class="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm outline-none focus:border-[#D4AF37]/50 mb-4"
        />

        <label class="text-xs text-neutral-400 uppercase tracking-widest mb-2 block">Añadir observación (Opcional)</label>
        <textarea 
          v-model="observacion" 
          rows="3" 
          placeholder="Ej: Todo normal..."
          class="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm outline-none focus:border-[#D4AF37]/50"
        ></textarea>
        
        <button @click="guardarRegistro" class="w-full bg-[#D4AF37] text-black font-bold uppercase tracking-widest text-sm py-4 rounded-xl mt-6 hover:bg-yellow-500 transition-colors">
          Guardar Registro
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref } from 'vue'
import { QrcodeStream } from 'vue-qrcode-reader'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'vue-router'

const router = useRouter()
const cargandoCamara = ref(true)
const procesandoQR = ref(false)

const mostrandoModalObservacion = ref(false)
const puntoActual = ref(null)
const observacion = ref('')
const nombreVigilante = ref('') // Nuevo estado para guardar el nombre del vigilante

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
      alert("❌ Código QR no encontrado en la base de datos.")
      setTimeout(() => { procesandoQR.value = false }, 2000)
      return
    }

    puntoActual.value = puntoData
    observacion.value = ''
    mostrandoModalObservacion.value = true

  } catch (error) {
    alert("Error de lectura: " + error.message)
    procesandoQR.value = false
  }
}

const guardarRegistro = async () => {
  if (!nombreVigilante.value.trim()) {
    alert("⚠️ Por favor, ingresa tu nombre de vigilante antes de continuar.")
    return
  }

  try {
    // Insertamos solo el punto, el nombre y la observación. 
    // Supabase registrará la hora exacta automáticamente de forma nativa.
    const { error } = await supabase.from('registros_punto_control').insert([{
      punto_control_id: puntoActual.value.id,
      nombre_vigilante: nombreVigilante.value.trim(),
      observacion: observacion.value.trim() || 'Sin novedad'
    }])

    if (error) throw error

    alert("✅ Punto registrado exitosamente.")
    
  } catch (error) {
    alert("Error al guardar: " + error.message)
  } finally {
    mostrandoModalObservacion.value = false
    puntoActual.value = null
    setTimeout(() => { procesandoQR.value = false }, 2000)
  }
}

const pintarMarcoQR = (detectedCodes, ctx) => {
  for (const barcode of detectedCodes) {
    const { boundingBox: { x, y, width, height } } = barcode
    ctx.lineWidth = 4; ctx.strokeStyle = '#D4AF37'; ctx.strokeRect(x, y, width, height)
  }
}

const cerrarSesion = () => router.push('/')
</script>