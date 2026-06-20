<template>
  <div class="h-[100dvh] w-full bg-[#0a0a0a] text-white flex flex-col relative font-sans">
    
    <header class="bg-[#111] p-5 border-b border-[#D4AF37]/30 flex justify-between items-center shadow-md z-10">
      <div>
        <h1 class="text-[#D4AF37] font-serif text-xl uppercase tracking-widest">Control de Seguridad</h1>
        <p class="text-xs text-neutral-400 mt-1 uppercase tracking-wider">
          Vigilante: <span class="text-white font-bold">{{ nombreVigilante }}</span>
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

      <div v-else class="w-full h-full max-w-md mx-auto relative shadow-[0_0_50px_rgba(212,175,55,0.15)]">
        
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
      <p class="text-sm text-gray-300 mb-6">Punto: <span class="font-bold text-white">{{ puntoActual.nombre }} ({{ puntoActual.piso }})</span></p>
      
      <div class="w-full max-w-md">
        <label class="text-xs text-neutral-400 uppercase tracking-widest mb-2 block">Añadir observación (Opcional)</label>
        <textarea 
          v-model="observacion" 
          rows="4" 
          placeholder="Ej: Todo normal..."
          class="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm outline-none focus:border-[#D4AF37]/50"
        ></textarea>
        
        <button @click="guardarRegistro" class="w-full bg-[#D4AF37] text-black font-bold uppercase tracking-widest text-sm py-4 rounded-xl mt-6 hover:bg-yellow-500 transition-colors shadow-[0_5px_20px_rgba(212,175,55,0.3)]">
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
const cargandoCamara = ref(true)
const nombreVigilante = ref('Vigilante Activo')
// IMPORTANTE: Pon un ID de la tabla 'perfiles' que exista en tu base de datos
const vigilanteId = ref('PEGAR_AQUI_UN_ID_DE_TU_TABLA_PERFILES') 

const enDescanso = ref(false)
const horaFinDescanso = ref('')
const rondaActiva = ref(null)
const mostrandoModalObservacion = ref(false)
const puntoActual = ref(null)
const observacion = ref('')
const procesandoQR = ref(false)

// 1. INICIALIZAR (SIN LOGIN)
const inicializar = async () => {
  // Aquí ya no pedimos sesión, usamos el ID que pusiste arriba.
  await verificarEstado()
}

// 2. VERIFICAR ESTADO
const verificarEstado = async () => {
  if (!vigilanteId.value) return

  const { data: ultimaRonda } = await supabase
    .from('rondas_vigilancia')
    .select('*')
    .eq('vigilante_id', vigilanteId.value)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (ultimaRonda) {
    if (ultimaRonda.estado === 'en_curso') {
      rondaActiva.value = ultimaRonda
      enDescanso.value = false
    } else if (ultimaRonda.estado === 'completada' && ultimaRonda.descanso_hasta) {
      const ahora = new Date()
      const finDescanso = new Date(ultimaRonda.descanso_hasta)
      if (ahora < finDescanso) {
        enDescanso.value = true
        horaFinDescanso.value = finDescanso.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        rondaActiva.value = null
      } else {
        enDescanso.value = false
      }
    }
  }
}

// 3. DETECTAR QR
const onDetect = async (detectedCodes) => {
  if (procesandoQR.value || enDescanso.value) return
  
  // Limpiamos el código por si la cámara lee espacios raros
  const codigoLeido = detectedCodes[0].rawValue.trim()
  if (!codigoLeido) return

  procesandoQR.value = true

  try {
    const { data: puntoData, error: errorPunto } = await supabase
      .from('puntos_control')
      .select('*')
      .eq('codigo_qr', codigoLeido)
      .single()

    if (errorPunto || !puntoData) {
      alert("❌ QR no reconocido en la base de datos.")
      setTimeout(() => { procesandoQR.value = false }, 2000)
      return
    }

    puntoActual.value = puntoData
    
    if (!rondaActiva.value) {
      const { data: nuevaRonda, error: errorRonda } = await supabase
        .from('rondas_vigilancia')
        .insert([{ vigilante_id: vigilanteId.value, estado: 'en_curso' }])
        .select()
        .single()
      
      if (errorRonda) throw errorRonda
      rondaActiva.value = nuevaRonda
    }

    observacion.value = ''
    mostrandoModalObservacion.value = true

  } catch (error) {
    console.error("Error al procesar:", error)
    alert("Error de conexión o de datos.")
    procesandoQR.value = false
  }
}

// 4. GUARDAR
const guardarRegistro = async () => {
  try {
    await supabase.from('registros_punto_control').insert([{
      ronda_id: rondaActiva.value.id,
      punto_control_id: puntoActual.value.id,
      observacion: observacion.value.trim() || null
    }])

    if (puntoActual.value.es_punto_final) {
      const fechaFin = new Date()
      const fechaDescanso = new Date(fechaFin.getTime() + (60 * 60 * 1000)) 

      await supabase.from('rondas_vigilancia').update({
        estado: 'completada',
        fin_ronda: fechaFin.toISOString(),
        descanso_hasta: fechaDescanso.toISOString()
      }).eq('id', rondaActiva.value.id)

      alert("✅ Ronda Finalizada. Hora de descanso iniciada.")
      await verificarEstado()
    } else {
      alert(`✅ Punto ${puntoActual.value.nombre} registrado.`)
    }

  } catch (error) {
    alert("Error al guardar en la base de datos.")
  } finally {
    mostrandoModalObservacion.value = false
    puntoActual.value = null
    setTimeout(() => { procesandoQR.value = false }, 2000)
  }
}

const pintarMarcoQR = (detectedCodes, ctx) => {
  for (const barcode of detectedCodes) {
    const { boundingBox: { x, y, width, height } } = barcode
    ctx.lineWidth = 4
    ctx.strokeStyle = '#D4AF37'
    ctx.strokeRect(x, y, width, height)
  }
}

// Salir ahora solo te lleva al Home
const cerrarSesion = () => {
  router.push('/')
}

onMounted(() => {
  inicializar()
})
</script>