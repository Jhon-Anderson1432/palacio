<template>
  <div class="h-[100dvh] w-full bg-[#0a0a0a] text-white flex flex-col relative font-sans">
    
    <header class="bg-[#111] p-5 border-b border-[#D4AF37]/30 flex justify-between items-center shadow-md z-10">
      <div>
        <h1 class="text-[#D4AF37] font-serif text-xl uppercase tracking-widest">Control de Seguridad</h1>
        <p class="text-xs text-neutral-400 mt-1 uppercase tracking-wider">
          Modo: Vigilante Activo
        </p>
      </div>
      <button @click="cerrarSesion" class="text-red-500 text-xs font-bold uppercase tracking-widest hover:text-red-400 p-2">
        Salir
      </button>
    </header>

    <div class="flex-1 relative bg-black overflow-hidden flex flex-col items-center justify-center">
      
      <div v-if="enDescanso" class="text-center p-8 z-20">
        <div class="text-6xl mb-4">☕</div>
        <h2 class="text-2xl font-serif text-[#D4AF37] mb-2 uppercase">En Horario de Descanso</h2>
        <p class="text-gray-400 text-sm">Tu próxima ronda comienza después de:</p>
        <p class="text-3xl font-bold text-white mt-4">{{ horaFinDescanso }}</p>
        <button @click="verificarEstado" class="mt-8 border border-white/20 px-6 py-2 rounded-full text-xs uppercase tracking-widest hover:bg-white/10">
          Actualizar Estado
        </button>
      </div>

      <div v-else class="w-full h-full max-w-md mx-auto relative shadow-[0_0_50px_rgba(212,175,55,0.1)]">
        
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
      <h3 class="text-xl font-serif text-[#D4AF37] mb-2">QR Registrado Exitosamente</h3>
      <p class="text-sm text-gray-300 mb-6">Punto: <span class="font-bold text-white">{{ puntoActual?.nombre }}</span></p>
      
      <div class="w-full max-w-md">
        <label class="text-xs text-neutral-400 uppercase tracking-widest mb-2 block">Añadir observación (Opcional)</label>
        <textarea 
          v-model="observacion" 
          rows="4" 
          class="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm outline-none focus:border-[#D4AF37]/50"
        ></textarea>
        
        <button @click="guardarRegistro" class="w-full bg-[#D4AF37] text-black font-bold uppercase tracking-widest text-sm py-4 rounded-xl mt-6 hover:bg-yellow-500 transition-colors">
          Guardar y Continuar
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { QrcodeStream } from 'vue-qrcode-reader'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'vue-router'

const router = useRouter()

// --- CONFIGURACIÓN: PEGA TU UID AQUÍ ---
const ADMIN_UID = 'ec7fabd4-668b-4b5d-b66d-8a9b5333f9ac' 
// --------------------------------------

const cargandoCamara = ref(true)
const enDescanso = ref(false)
const horaFinDescanso = ref('')
const rondaActiva = ref(null)
const mostrandoModalObservacion = ref(false)
const puntoActual = ref(null)
const observacion = ref('')
const procesandoQR = ref(false)

const inicializar = async () => {
  await verificarEstado()
}

const verificarEstado = async () => {
  const { data: ultimaRonda } = await supabase
    .from('rondas_vigilancia')
    .select('*')
    .eq('vigilante_id', ADMIN_UID)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (ultimaRonda) {
    if (ultimaRonda.estado === 'en_curso') {
      rondaActiva.value = ultimaRonda
    } else if (ultimaRonda.estado === 'completada' && ultimaRonda.descanso_hasta) {
      const finDescanso = new Date(ultimaRonda.descanso_hasta)
      if (new Date() < finDescanso) {
        enDescanso.value = true
        horaFinDescanso.value = finDescanso.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
      }
    }
  }
}

const onDetect = async (detectedCodes) => {
  if (procesandoQR.value || enDescanso.value) return
  const rawCode = (detectedCodes[0].rawValue || detectedCodes[0].value || '').trim()
  if (!rawCode) return

  procesandoQR.value = true

  try {
    const { data: puntoData } = await supabase
      .from('puntos_control')
      .select('*')
      .eq('codigo_qr', rawCode)
      .maybeSingle()

    if (!puntoData) {
      alert("Código QR no encontrado.")
      procesandoQR.value = false
      return
    }

    puntoActual.value = puntoData
    
    if (!rondaActiva.value) {
      const { data: nuevaRonda } = await supabase
        .from('rondas_vigilancia')
        .insert([{ vigilante_id: ADMIN_UID, estado: 'en_curso' }])
        .select()
        .single()
      rondaActiva.value = nuevaRonda
    }
    mostrandoModalObservacion.value = true
  } catch (error) {
    alert("Error: " + error.message)
    procesandoQR.value = false
  }
}

const guardarRegistro = async () => {
  try {
    await supabase.from('registros_punto_control').insert([{
      ronda_id: rondaActiva.value.id,
      punto_control_id: puntoActual.value.id,
      observacion: observacion.value.trim()
    }])

    if (puntoActual.value.es_punto_final) {
      const finDescanso = new Date(new Date().getTime() + 60 * 60 * 1000)
      await supabase.from('rondas_vigilancia')
        .update({ estado: 'completada', descanso_hasta: finDescanso.toISOString() })
        .eq('id', rondaActiva.value.id)
      alert("Ronda finalizada.")
    } else {
      alert("Punto registrado.")
    }
    mostrandoModalObservacion.value = false
    await verificarEstado()
  } catch (error) {
    alert("Error al guardar: " + error.message)
  } finally {
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

onMounted(inicializar)
</script>