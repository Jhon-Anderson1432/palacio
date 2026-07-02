<template>
  <!-- ESTRUCTURA & ESTILOS: Contenedor principal flex con colores base y selección de texto unificada -->
  <div id="app-root" class="min-h-screen bg-black text-white font-sans flex flex-col selection:bg-[#D4AF37] selection:text-black">
    
    <!-- ESTRUCTURA: Lógica de ocultamiento delegada al <script> (Composition API) -->
    <Navbar v-if="mostrarNavbar" />    
    
    <main class="flex-1 w-full h-full relative flex flex-col">
      <!-- RENDIMIENTO & UX: Transiciones de ruta nativas para que la navegación sea fluida y no brusca -->
      <router-view v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

  </div>
</template>

<script setup>
import { computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue' // Asegúrate de que la ruta sea correcta

const route = useRoute()

// 1. ESTRUCTURA: Limpieza masiva de los condicionales del Navbar.
// En lugar de una línea interminable en el HTML, usamos un array limpio y escalable.
const rutasSinNavbar = [
  'Home', 
  'DetalleObra', 
  'HomeGastro', 
  'MenuGastro', 
  'Login', 
  'LoginPos', 
  'TerminalPos', 
  'VigilanteScan'
]

const mostrarNavbar = computed(() => {
  // Si el nombre de la ruta actual NO está en el array, mostramos el Navbar.
  return route.name && !rutasSinNavbar.includes(route.name)
})

// 2. LÓGICA SEO GLOBAL: El "Vigía" de URLs
// Esta función se ejecuta CADA VEZ que cambias de página, actualizando la URL oficial para Google.
const actualizarSEOGlobal = () => {
  if (typeof window !== 'undefined') {
    // A. Actualizar la etiqueta Canonical dinámica
    let canonical = document.querySelector("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", window.location.href);

    // B. Actualizar el idioma del documento HTML (Ayuda al SEO internacional)
    // Esto asegura que Google sepa si la página está en es, en, fr o ja.
    const htmlTag = document.documentElement;
    // Si tu localStorage o estado guarda el idioma, lo ideal es ponerlo aquí. Por defecto: español de Colombia
    if (!htmlTag.hasAttribute('lang')) {
      htmlTag.setAttribute('lang', 'es-CO');
    }
  }
}

// Observamos la ruta. Cada vez que el usuario navega a /homegastro, /bar, etc., disparamos la actualización SEO.
watch(
  () => route.fullPath, 
  () => {
    actualizarSEOGlobal()
  }, 
  { immediate: true } // immediate: true hace que se ejecute también en la primera carga
)

onMounted(() => {
  actualizarSEOGlobal()
})
</script>

<style scoped>
/* ESTILOS & RENDIMIENTO: 
   Transiciones globales de páginas. Al cambiar de URL, la página actual se desvanece 
   y la nueva entra suavemente. Esto reduce el impacto visual de los tiempos de carga (cuellos de botella). */
.page-fade-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.page-fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Prevenir desbordamientos horizontales a nivel global */
main {
  overflow-x: hidden;
}
</style>