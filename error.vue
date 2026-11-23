<template>
  <main 
    class="min-h-screen w-full bg-[#050505] text-white font-sans flex flex-col justify-between relative overflow-hidden selection:bg-[#D4AF37] selection:text-black antialiased"
    role="main"
  >
    <!-- Iluminación ambiental de fondo -->
    <div class="fixed top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-[#D4AF37]/10 rounded-full blur-[160px] pointer-events-none z-0"></div>
    <div class="fixed bottom-10 right-10 w-80 h-80 bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none z-0"></div>

    <!-- Barra superior institucional -->
    <header class="relative z-10 w-full px-6 py-6 flex justify-between items-center max-w-7xl mx-auto border-b border-white/5">
      <NuxtLink to="/" class="flex items-center gap-2 group focus:outline-none" aria-label="Ir al inicio del Palacio Nacional">
        <NuxtImg 
          src="/logon.png" 
          alt="Palacio Nacional Medellín" 
          class="h-8 md:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_15px_rgba(212,175,55,0.25)]" 
          loading="eager"
        />
      </NuxtLink>

      <span class="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-semibold">
        Monumento Nacional • 1933
      </span>
    </header>

    <!-- Contenido central de error -->
    <section class="relative z-10 max-w-2xl mx-auto px-4 py-16 text-center flex-1 flex flex-col items-center justify-center">
      
      <!-- Código de estado con brillo dorado -->
      <div class="relative mb-6">
        <span class="text-7xl sm:text-9xl font-serif font-light text-transparent bg-clip-text bg-gradient-to-b from-[#D4AF37] via-[#D4AF37]/80 to-transparent select-none drop-shadow-[0_10px_35px_rgba(212,175,55,0.25)]">
          {{ codigoEstado }}
        </span>
      </div>

      <!-- Insignia de estado -->
      <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] uppercase tracking-[0.25em] font-bold mb-4 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
        <span>🏛️</span>
        <span>{{ tituloEstado }}</span>
      </div>

      <!-- Mensaje principal -->
      <h1 class="text-2xl sm:text-3xl md:text-4xl font-serif font-light uppercase tracking-wide text-white mb-4 leading-snug">
        {{ encabezado }}
      </h1>

      <p class="text-xs sm:text-sm text-neutral-400 font-light max-w-md mx-auto leading-relaxed mb-10">
        {{ descripcion }}
      </p>

      <!-- Botones de Acción -->
      <div class="flex flex-col sm:flex-row items-center gap-4 w-full justify-center mb-14">
        <button
          type="button"
          @click="handleClearError"
          class="w-full sm:w-auto px-8 py-3.5 bg-[#D4AF37] text-black font-bold uppercase tracking-widest text-xs rounded-full hover:bg-white transition-all duration-300 shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] active:scale-95 focus:outline-none focus:ring-4 focus:ring-[#D4AF37]/30"
        >
          Regresar al Palacio
        </button>
      </div>

      <!-- Accesos Rápidos de Exploración -->
      <div class="w-full pt-8 border-t border-white/10">
        <p class="text-[10px] uppercase tracking-[0.25em] text-neutral-500 font-bold mb-4">
          Explora nuestros espacios
        </p>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
          <NuxtLink 
            to="/exposiciones" 
            class="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#D4AF37]/50 hover:bg-white/[0.05] transition-all group text-left"
          >
            <span class="text-xs font-serif text-white group-hover:text-[#D4AF37] transition-colors block mb-1">Galería de Arte</span>
            <span class="text-[10px] text-neutral-500 block">Exhibiciones y obras</span>
          </NuxtLink>

          <NuxtLink 
            to="/homegastro" 
            class="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#D4AF37]/50 hover:bg-white/[0.05] transition-all group text-left"
          >
            <span class="text-xs font-serif text-white group-hover:text-[#D4AF37] transition-colors block mb-1">Piso 5 Gastronomía</span>
            <span class="text-[10px] text-neutral-500 block">Café, mariscos y rooftop</span>
          </NuxtLink>

          <NuxtLink 
            to="/historia" 
            class="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#D4AF37]/50 hover:bg-white/[0.05] transition-all group text-left"
          >
            <span class="text-xs font-serif text-white group-hover:text-[#D4AF37] transition-colors block mb-1">Nuestra Historia</span>
            <span class="text-[10px] text-neutral-500 block">Un siglo de patrimonio</span>
          </NuxtLink>
        </div>
      </div>

    </section>

    <!-- Pie institucional discreto -->
    <footer class="relative z-10 w-full py-6 text-center text-[10px] text-neutral-600 border-t border-white/5">
      <p>Palacio Nacional Medellín &bull; Carrera 52 # 48-45, La Candelaria</p>
    </footer>
  </main>
</template>

<script setup>
const props = defineProps({
  error: {
    type: Object,
    default: () => ({})
  }
})

const codigoEstado = computed(() => props.error?.statusCode || 404)
const es404 = computed(() => codigoEstado.value === 404)

const tituloEstado = computed(() => {
  if (es404.value) return 'Página no encontrada'
  if (codigoEstado.value === 500) return 'Error en el servidor'
  return 'Aviso del Palacio'
})

const encabezado = computed(() => {
  if (es404.value) return 'El arco o pasillo que buscas no existe'
  return 'Ocurrió un contratiempo temporal'
})

const descripcion = computed(() => {
  if (es404.value) {
    return 'La página o recurso al que intentas acceder no se encuentra disponible o ha cambiado de dirección dentro del Palacio.'
  }
  return 'Estamos realizando labores de mantenimiento y restauración para que disfrutes de la mejor experiencia.'
})

const handleClearError = () => {
  clearError({ redirect: '/' })
}

useHead({
  title: `${tituloEstado.value} | Palacio Nacional Medellín`,
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>
