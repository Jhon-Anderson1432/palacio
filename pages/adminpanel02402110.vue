<template>
  <div class="fixed inset-0 z-[999] bg-[#0a0a0a] overflow-y-auto text-white font-sans flex antialiased w-full max-w-[100vw] overflow-x-hidden">

    <!-- Backdrop oscurecido para menú móvil -->
    <div v-if="menuAbierto" @click="menuAbierto = false"
      class="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm transition-opacity duration-300"></div>

    <!-- Barra lateral de navegación (Sidebar) -->
    <aside
      :class="['w-64 bg-black border-r border-white/10 p-6 md:p-8 flex flex-col fixed top-0 left-0 bottom-0 md:relative z-50 transition-transform duration-300 ease-in-out', menuAbierto ? 'translate-x-0' : '-translate-x-full md:translate-x-0']">

      <div class="flex flex-col mb-10 text-[#D4AF37]">
        <div class="flex items-center justify-between gap-3">
          <span class="font-serif text-xl tracking-tighter uppercase">Palacio Admin</span>
          <button @click="menuAbierto = false" class="md:hidden text-white/50 hover:text-white p-2 transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <span class="text-[9px] uppercase tracking-widest text-neutral-500 mt-1">
          {{ rolUsuario.replace('_', ' ') }} <span v-if="localAsignado">({{ localAsignado }})</span>
        </span>
      </div>

      <nav class="space-y-4 flex-1 overflow-y-auto hide-scrollbar">
        <!-- Módulo Galería de Arte -->
        <div v-if="rolUsuario === 'admin_galeria' || rolUsuario === 'asistente_galeria' || rolUsuario === 'superadmin'"
          class="space-y-4">
          <button @click="cambiarPestaña('inventario')"
            :class="['w-full p-3 rounded-xl flex items-center gap-3 transition-all duration-300 focus:outline-none', pestañaActiva === 'inventario' ? 'text-[#D4AF37] bg-[#D4AF37]/10 shadow-inner' : 'text-neutral-500 hover:text-white hover:bg-white/5']">
            <span class="font-medium text-sm uppercase tracking-widest">Inventario Arte</span>
          </button>

          <button v-if="rolUsuario !== 'asistente_galeria'" @click="cambiarPestaña('estadisticas')"
            :class="['w-full p-3 rounded-xl flex items-center gap-3 transition-all duration-300 focus:outline-none', pestañaActiva === 'estadisticas' ? 'text-[#D4AF37] bg-[#D4AF37]/10 shadow-inner' : 'text-neutral-500 hover:text-white hover:bg-white/5']">
            <span class="font-medium text-sm uppercase tracking-widest">Métricas Arte</span>
          </button>
        </div>

        <!-- Módulo Gastronomía & POS -->
        <div v-if="rolUsuario === 'admin_cafe' || rolUsuario === 'superadmin'"
          class="space-y-4 pt-4 border-t border-white/5">
          <button @click="cambiarPestaña('caja')"
            :class="['w-full p-3 rounded-xl flex items-center gap-3 transition-all duration-300 focus:outline-none', pestañaActiva === 'caja' ? 'text-[#D4AF37] bg-[#D4AF37]/10 shadow-inner' : 'text-neutral-500 hover:text-white hover:bg-white/5']">
            <span class="font-medium text-sm uppercase tracking-widest">Caja Registradora</span>
          </button>

          <button @click="cambiarPestaña('estadisticas_pos')"
            :class="['w-full p-3 rounded-xl flex items-center gap-3 transition-all duration-300 focus:outline-none', pestañaActiva === 'estadisticas_pos' ? 'text-[#D4AF37] bg-[#D4AF37]/10 shadow-inner' : 'text-neutral-500 hover:text-white hover:bg-white/5']">
            <span class="font-medium text-sm uppercase tracking-widest">Métricas POS</span>
          </button>

          <button @click="cambiarPestaña('gastronomia')"
            :class="['w-full p-3 rounded-xl flex items-center gap-3 transition-all duration-300 focus:outline-none', pestañaActiva === 'gastronomia' ? 'text-[#D4AF37] bg-[#D4AF37]/10 shadow-inner' : 'text-neutral-500 hover:text-white hover:bg-white/5']">
            <span class="font-medium text-sm uppercase tracking-widest">Gestión Menú</span>
          </button>
        </div>

        <!-- Módulo Seguridad & Vigilancia -->
        <div v-if="rolUsuario === 'admin_seguridad' || rolUsuario === 'superadmin'"
          class="space-y-4 pt-4 border-t border-white/5">
          <button @click="cambiarPestaña('seguridad')"
            :class="['w-full p-3 rounded-xl flex items-center gap-3 transition-all duration-300 focus:outline-none', pestañaActiva === 'seguridad' ? 'text-[#D4AF37] bg-[#D4AF37]/10 shadow-inner' : 'text-neutral-500 hover:text-white hover:bg-white/5']">
            <span class="font-medium text-sm uppercase tracking-widest">Monitoreo Seguridad</span>
          </button>
        </div>
      </nav>

      <button @click="cerrarSesionAdmin"
        class="text-red-500 hover:bg-red-500/10 p-3 rounded-xl flex items-center gap-3 mb-4 transition-all duration-300 text-[10px] font-bold uppercase tracking-widest mt-4 focus:outline-none focus:ring-2 focus:ring-red-500/50">
        CERRAR SESIÓN
      </button>

      <NuxtLink to="/exposiciones"
        class="text-neutral-500 hover:text-white transition-colors duration-300 flex items-center gap-2 text-[10px] uppercase font-bold pt-4 border-t border-white/10 tracking-widest focus:outline-none">
        ← GALERÍA PÚBLICA
      </NuxtLink>
    </aside>

    <!-- Contenido Principal -->
    <main class="flex-1 flex flex-col relative min-w-0 w-full max-w-full overflow-x-hidden">
      <!-- Barra superior fija contextual -->
      <AdminHeader
        :pestañaActiva="pestañaActiva"
        v-model:searchQuery="searchQuery"
        @toggleMenu="menuAbierto = !menuAbierto"
        @abrirFormObra="inventarioRef?.openForm()"
        @abrirFormGastro="gastroRef?.openGastroForm()"
        @abrirModalQR="seguridadRef?.abrirModalQR()"
        @recargar="ejecutarRecarga"
      />

      <!-- Vistas dinámicas por pestaña con carga bajo demanda -->
      <div class="p-3 sm:p-4 md:p-8 lg:p-12 overflow-y-auto w-full min-w-0 max-w-full">
        <AdminCajaPos
          v-if="pestañaActiva === 'caja'"
          ref="cajaRef"
          :rolUsuario="rolUsuario"
          :localAsignado="localAsignado"
        />

        <AdminMetricasPos
          v-else-if="pestañaActiva === 'estadisticas_pos'"
          :rolUsuario="rolUsuario"
          :localAsignado="localAsignado"
        />

        <AdminSeguridad
          v-else-if="pestañaActiva === 'seguridad'"
          ref="seguridadRef"
        />

        <AdminInventarioArte
          v-else-if="pestañaActiva === 'inventario'"
          ref="inventarioRef"
          v-model:searchQuery="searchQuery"
        />

        <AdminGestionMenu
          v-else-if="pestañaActiva === 'gastronomia'"
          ref="gastroRef"
          :rolUsuario="rolUsuario"
          :localAsignado="localAsignado"
          :searchQuery="searchQuery"
        />

        <AdminMetricasArte
          v-else-if="pestañaActiva === 'estadisticas'"
          @editarObra="handleEditarObra"
        />
      </div>
    </main>
  </div>
</template>

<script setup>
// Evitamos que Nuxt monte la barra de navegación pública sobre este dashboard
definePageMeta({
  layout: false
})

import AdminHeader from '~/components/admin/AdminHeader.vue'
import AdminInventarioArte from '~/components/admin/AdminInventarioArte.vue'
import AdminMetricasArte from '~/components/admin/AdminMetricasArte.vue'
import AdminCajaPos from '~/components/admin/AdminCajaPos.vue'
import AdminMetricasPos from '~/components/admin/AdminMetricasPos.vue'
import AdminGestionMenu from '~/components/admin/AdminGestionMenu.vue'
import AdminSeguridad from '~/components/admin/AdminSeguridad.vue'

const router = useRouter()
const supabase = useSupabaseClient()

const pestañaActiva = ref('inventario')
const searchQuery = ref('')
const menuAbierto = ref(false)

const rolUsuario = ref('superadmin')
const localAsignado = ref(null)

// Referencias a los componentes hijos para llamadas contextuales
const inventarioRef = ref(null)
const gastroRef = ref(null)
const seguridadRef = ref(null)
const cajaRef = ref(null)

const cambiarPestaña = (tab) => {
  pestañaActiva.value = tab
  menuAbierto.value = false
}

const ejecutarRecarga = () => {
  if (pestañaActiva.value === 'caja') {
    cajaRef.value?.recargar()
  } else if (pestañaActiva.value === 'seguridad') {
    seguridadRef.value?.recargar()
  }
}

const handleEditarObra = (obra) => {
  pestañaActiva.value = 'inventario'
  nextTick(() => {
    inventarioRef.value?.openForm(obra)
  })
}

const cargarPerfilYDatos = async () => {
  if (import.meta.server) return

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) { router.push('/LoginAdmin'); return }

  const { data: perfil } = await supabase.from('perfiles').select('*').eq('id', user.id).single()
  if (perfil) {
    rolUsuario.value = perfil.rol
    localAsignado.value = perfil.local_asignado

    let tabInicial = 'inventario'
    if (perfil.rol === 'admin_cafe') {
      tabInicial = 'caja'
    } else if (perfil.rol === 'admin_seguridad') {
      tabInicial = 'seguridad'
    }
    cambiarPestaña(tabInicial)
  } else {
    cambiarPestaña('inventario')
  }
}

const cerrarSesionAdmin = async () => {
  await navigateTo('/loginadmin?logout=true')
}

onMounted(() => {
  cargarPerfilYDatos()
})
</script>

<style scoped>
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
