<template>
  <main class="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-[#D4AF37] selection:text-black">
    
    <transition name="fade">
      <div v-if="!mostrarMenu" class="fixed inset-0 z-50 flex flex-col justify-center items-center py-8 px-6 bg-[#0a0a0a]">
        
        <button 
          @click="router.push('/homegastro')" 
          class="absolute top-6 left-6 p-2 bg-white/5 border border-white/10 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>

        <div class="absolute top-6 right-6 z-50">
          <button 
            @click="toggleDropdown"
            class="flex items-center gap-2 p-2 text-white/70 hover:text-white transition-all bg-white/5 border border-white/10 rounded-full"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="text-xs font-medium tracking-wider uppercase">{{ idiomaGlobal }}</span>
          </button>

          <transition name="fade-down">
            <div v-if="dropdownOpen" class="absolute right-0 top-full mt-2 w-36 bg-[#0a0a0a]/95 backdrop-blur-xl border border-[#D4AF37]/20 rounded-xl shadow-2xl overflow-hidden">
              <button 
                v-for="lang in idiomas" 
                :key="lang.code"
                @click="seleccionarIdioma(lang.code)"
                class="w-full text-left px-4 py-3 text-xs text-gray-400 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] transition-colors duration-200 border-b border-white/5 last:border-none uppercase tracking-widest"
                :class="{ 'text-[#D4AF37] bg-[#D4AF37]/5': idiomaGlobal === lang.code }"
              >
                {{ lang.label }}
              </button>
            </div>
          </transition>
        </div>

        <div class="w-48 md:w-56 mb-12 flex flex-col items-center">
          <img :src="logoCafe" alt="Chao Cafe" class="w-full h-auto object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.2)] mb-4" />
          <h1 class="font-serif text-3xl tracking-[0.2em] text-[#D4AF37] uppercase text-center hidden">Chao Cafe</h1>
        </div>

        <div class="w-full max-w-[320px] flex flex-col gap-4">
          
          <button 
            @click="mostrarMenu = true"
            class="w-full py-3.5 border border-[#D4AF37]/60 text-white bg-transparent hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] transition-all duration-300 rounded-[2rem] text-sm font-medium tracking-wide shadow-sm"
          >
            {{ t.btnMenu }}
          </button>
          
          <button class="w-full py-3.5 border border-[#D4AF37]/60 text-white bg-transparent hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] transition-all duration-300 rounded-[2rem] text-sm font-medium tracking-wide shadow-sm">
            {{ t.btnReservas }}
          </button>
          
          <button class="w-full py-3.5 border border-[#D4AF37]/60 text-white bg-transparent hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] transition-all duration-300 rounded-[2rem] text-sm font-medium tracking-wide shadow-sm">
            WhatsApp
          </button>
          
          <button class="w-full py-3.5 border border-[#D4AF37]/60 text-white bg-transparent hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] transition-all duration-300 rounded-[2rem] text-sm font-medium tracking-wide shadow-sm">
            {{ t.btnOpinion }}
          </button>
          
          <button class="w-full py-3.5 border border-[#D4AF37]/60 text-white bg-transparent hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] transition-all duration-300 rounded-[2rem] text-sm font-medium tracking-wide shadow-sm">
            {{ t.btnUbicacion }}
          </button>

        </div>

      </div>
    </transition>


    <div v-if="mostrarMenu" class="pb-24 animate-fade-in bg-[#0a0a0a] min-h-screen">
      
      <header class="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/10 pt-6 pb-2 px-4 flex flex-col gap-4">
        <div class="flex justify-between items-center">
          <button @click="mostrarMenu = false" class="text-white/70 hover:text-[#D4AF37] flex items-center gap-1 text-xs uppercase tracking-widest transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
            {{ t.btnVolver }}
          </button>
          <span class="text-[#D4AF37] font-serif tracking-[0.2em] uppercase text-sm md:text-base pr-8">Chao Cafe</span>
          <div></div> 
        </div>

        <nav class="flex overflow-x-auto gap-3 hide-scrollbar pb-2">
          <button 
            v-for="cat in categoriasTraducidas" 
            :key="cat.id" 
            @click="categoriaActiva = cat.id"
            :class="[
              'whitespace-nowrap uppercase tracking-widest text-[11px] px-5 py-2.5 rounded-xl transition-all duration-300 font-medium',
              categoriaActiva === cat.id 
                ? 'bg-[#D4AF37] text-black shadow-[0_4px_15px_rgba(212,175,55,0.3)]' 
                : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
            ]"
          >
            {{ cat.nombre }}
          </button>
        </nav>
      </header>

      <section class="p-4 w-full max-w-4xl mx-auto mt-4">
        <h2 class="text-white/50 text-xs tracking-[0.2em] uppercase mb-4 px-1">
          {{ categoriasTraducidas.find(c => c.id === categoriaActiva)?.nombre }}
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div 
            v-for="item in menuFiltrado" 
            :key="item.id" 
            class="relative w-full h-56 md:h-72 rounded-2xl overflow-hidden group cursor-pointer shadow-lg border border-[#D4AF37]/10 hover:border-[#D4AF37]/50 transition-colors duration-300"
          >
            <img :src="item.imagen" :alt="item.nombre" class="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-in-out" />
            
            <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30 group-hover:from-black/80 transition-colors duration-500"></div>

            <div class="absolute top-4 left-4 bg-black/60 backdrop-blur-md border border-[#D4AF37]/30 text-[#D4AF37] px-3 py-1.5 rounded-lg text-sm font-semibold tracking-wide">
              ${{ item.precio }}
            </div>

            <div v-if="item.etiqueta" class="absolute top-4 right-4 bg-[#D4AF37] text-black px-2 py-1 rounded text-[10px] uppercase tracking-widest font-bold shadow-md">
              {{ item.etiqueta }}
            </div>

            <div class="absolute bottom-4 left-4 right-4">
              <h3 class="text-white font-serif text-xl md:text-2xl leading-tight mb-1 drop-shadow-md group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all duration-300">
                {{ item.nombre }}
              </h3>
              <p class="text-gray-300 text-xs md:text-sm font-light line-clamp-2 leading-relaxed opacity-90 group-hover:opacity-100">
                {{ item.descripcion }}
              </p>
            </div>
          </div>
        </div>
      </section>
      
    </div>

  </main>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { idiomaGlobal } from '../../lib/supabase'

// Logos
import logoCafe from '@/assets/logonc.png'

const router = useRouter()

// Controla si se ve la pantalla de inicio o el catálogo
const mostrarMenu = ref(false)
const categoriaActiva = ref('cafes')

// =====================================
// Lógica de Traducción
// =====================================
const dropdownOpen = ref(false)

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const seleccionarIdioma = (codigo) => {
  idiomaGlobal.value = codigo
  dropdownOpen.value = false
}

const idiomas = [
  { code: 'es', label: 'ESP' },
  { code: 'en', label: 'ENG' },
  { code: 'fr', label: 'FRA' },
  { code: 'ja', label: 'JPN' }
]

const traducciones = {
  es: {
    btnMenu: 'Menú',
    btnReservas: 'Reservas',
    btnOpinion: 'Danos tu opinión',
    btnUbicacion: 'Encuéntranos',
    btnVolver: 'Volver',
    catCafes: 'Cafés',
    catEspecialidades: 'Especialidades',
    catReposteria: 'Repostería',
    catBebidas: 'Bebidas Frías'
  },
  en: {
    btnMenu: 'Menu',
    btnReservas: 'Reservations',
    btnOpinion: 'Give us feedback',
    btnUbicacion: 'Find us',
    btnVolver: 'Back',
    catCafes: 'Coffees',
    catEspecialidades: 'Specialties',
    catReposteria: 'Pastries',
    catBebidas: 'Cold Drinks'
  },
  fr: {
    btnMenu: 'Menu',
    btnReservas: 'Réservations',
    btnOpinion: 'Donnez votre avis',
    btnUbicacion: 'Nous trouver',
    btnVolver: 'Retour',
    catCafes: 'Cafés',
    catEspecialidades: 'Spécialités',
    catReposteria: 'Pâtisseries',
    catBebidas: 'Boissons Froides'
  },
  ja: {
    btnMenu: 'メニュー',
    btnReservas: '予約',
    btnOpinion: 'フィードバック',
    btnUbicacion: 'アクセス',
    btnVolver: '戻る',
    catCafes: 'コーヒー',
    catEspecialidades: '特産品',
    catReposteria: 'ペストリー',
    catBebidas: '冷たい飲み物'
  }
}

const t = computed(() => traducciones[idiomaGlobal.value] || traducciones.es)

// Categorías Computadas según idioma
const categoriasTraducidas = computed(() => [
  { id: 'cafes', nombre: t.value.catCafes },
  { id: 'especialidades', nombre: t.value.catEspecialidades },
  { id: 'reposteria', nombre: t.value.catReposteria },
  { id: 'bebidas', nombre: t.value.catBebidas }
])

// =====================================
// Base de Datos del Menú (Ejemplo)
// =====================================
// Nota: Puedes agregar campos de descripción en inglés/francés si lo necesitas en el futuro
const menu = [
  { 
    id: 1, 
    categoria: 'cafes', 
    nombre: 'Espresso Palacio', 
    descripcion: 'Doble shot de café de origen seleccionado con notas a chocolate amargo.', 
    precio: '6.500', 
    imagen: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=800&auto=format&fit=crop',
    etiqueta: 'Recomendado'
  },
  { 
    id: 2, 
    categoria: 'cafes', 
    nombre: 'Capuccino Dorado', 
    descripcion: 'Café espresso con leche cremada al punto exacto, polvo de canela.', 
    precio: '8.900', 
    imagen: 'https://images.unsplash.com/photo-1572442388796-11668a67ef84?q=80&w=800&auto=format&fit=crop' 
  },
  { 
    id: 3, 
    categoria: 'reposteria', 
    nombre: 'Croissant de Almendras', 
    descripcion: 'Hojaldre artesanal relleno de crema de almendras y decorado con láminas tostadas.', 
    precio: '9.500', 
    imagen: 'https://images.unsplash.com/photo-1549903072-7e3e00072416?q=80&w=800&auto=format&fit=crop',
    etiqueta: 'Nuevo'
  }
]

const menuFiltrado = computed(() => {
  return menu.filter(item => item.categoria === categoriaActiva.value)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.animate-fade-in {
  animation: fadeIn 0.6s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-down-enter-active,
.fade-down-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-down-enter-from,
.fade-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>