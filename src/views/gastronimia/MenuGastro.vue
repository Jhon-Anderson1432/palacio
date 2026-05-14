<template>
  <main class="min-h-screen bg-neutral-950 text-white font-sans selection:bg-[#D4AF37] selection:text-black">
    
    <transition name="fade">
      <div v-if="!mostrarMenu" class="fixed inset-0 z-50 flex flex-col justify-center items-center py-8 px-6 bg-[#0a0a0a]">
        
        <button @click="router.push('/homegastro')" class="absolute top-6 left-6 p-2 bg-white/5 border border-white/10 rounded-full text-white/70 hover:text-white transition-all">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>

        <div class="absolute top-6 right-6 z-50">
          <button @click="toggleDropdown" class="flex items-center gap-2 p-2 text-white/70 bg-white/5 border border-white/10 rounded-full hover:text-white transition-all">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span class="text-xs font-medium uppercase tracking-tighter">{{ idiomaGlobal }}</span>
          </button>
          <transition name="fade-down">
            <div v-if="dropdownOpen" class="absolute right-0 top-full mt-2 w-36 bg-[#0a0a0a]/95 backdrop-blur-xl border border-[#D4AF37]/20 rounded-xl shadow-2xl overflow-hidden">
              <button v-for="lang in idiomas" :key="lang.code" @click="seleccionarIdioma(lang.code)" class="w-full text-left px-4 py-3 text-xs text-gray-400 hover:text-[#D4AF37] transition-colors border-b border-white/5 last:border-none uppercase tracking-widest">
                {{ lang.label }}
              </button>
            </div>
          </transition>
        </div>

        <div class="w-48 md:w-56 mb-12">
          <img :src="configLocal.logo" :alt="configLocal.titulo" class="w-full h-auto object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.2)]" />
        </div>

        <div class="w-full max-w-[320px] flex flex-col gap-4">
          <button @click="mostrarMenu = true" class="w-full py-4 border border-[#D4AF37]/60 text-white hover:bg-[#D4AF37] hover:text-black transition-all duration-500 rounded-[2rem] text-sm font-semibold tracking-[0.1em] uppercase">
            {{ t.btnMenu }}
          </button>
          
          <a :href="configLocal.whatsapp" target="_blank" class="w-full py-4 border border-[#D4AF37]/60 text-white hover:bg-[#D4AF37] hover:text-black transition-all duration-500 rounded-[2rem] text-sm font-semibold tracking-[0.1em] uppercase text-center block">
            {{ t.btnReservas }}
          </a>
          
          <button class="w-full py-4 border border-[#D4AF37]/60 text-white hover:bg-[#D4AF37] hover:text-black transition-all duration-500 rounded-[2rem] text-sm font-semibold tracking-[0.1em] uppercase">
            {{ t.btnOpinion }}
          </button>
          
          <button class="w-full py-4 border border-[#D4AF37]/60 text-white hover:bg-[#D4AF37] hover:text-black transition-all duration-500 rounded-[2rem] text-sm font-semibold tracking-[0.1em] uppercase">
            {{ t.btnUbicacion }}
          </button>
        </div>
      </div>
    </transition>

    <div v-if="mostrarMenu" class="pt-8 px-6 pb-20 overflow-x-hidden animate-fade-in bg-neutral-950 min-h-screen">
      
      <div class="flex justify-between items-center mb-8 max-w-7xl mx-auto">
        <button @click="mostrarMenu = false" class="text-white/50 hover:text-[#D4AF37] transition-colors">
          <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <div class="text-center">
           <p class="text-[10px] tracking-[0.4em] uppercase text-gray-500 mb-1">Palacio Nacional</p>
           <h1 class="text-[#D4AF37] font-serif text-xl tracking-[0.1em] uppercase">{{ configLocal.titulo }}</h1>
        </div>
        <div class="w-7"></div>
      </div>

      <div class="max-w-7xl mx-auto mb-12 flex flex-wrap justify-center gap-4 mt-4">
        <button 
          v-for="cat in categoriasVisibles" 
          :key="cat.id" 
          @click="categoriaActiva = cat.id"
          :class="categoriaActiva === cat.id ? 'bg-[#D4AF37] text-black shadow-lg shadow-[#D4AF37]/20' : 'bg-transparent border border-white/20 text-white hover:border-[#D4AF37]/50'"
          class="px-8 py-3 rounded-full transition-all duration-300 flex items-center group"
        >
          <span class="text-xs font-bold uppercase tracking-widest">{{ cat.nombre }}</span>
        </button>
      </div>

      <div v-if="cargandoInicial" class="flex flex-col items-center justify-center py-20 space-y-4 text-neutral-500">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-[#D4AF37]"></div>
        <span class="uppercase tracking-widest text-xs">{{ t.cargando }}</span>
      </div>

      <div v-else-if="menuFiltrado.length === 0" class="max-w-7xl mx-auto text-center py-24 space-y-2 opacity-40">
        <svg class="w-16 h-16 mx-auto mb-4 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        <p class="uppercase tracking-[0.3em] text-sm">{{ t.sinResultados }}</p>
      </div>

      <div v-else class="max-w-7xl mx-auto flex flex-col">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-12">
          
          <div v-for="item in menuFiltrado" :key="item.id" class="group bg-neutral-900/50 border border-white/5 rounded-2xl overflow-hidden hover:border-[#D4AF37]/40 transition-all duration-500 flex flex-col relative">
            
            <div class="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[10px] text-white font-bold uppercase tracking-widest">
              {{ traducirCategoriaUnica(item.categoria) }}
            </div>

            <div v-if="item.etiqueta" class="absolute top-4 right-4 z-10 bg-[#D4AF37] text-black text-[9px] font-black uppercase px-3 py-1 rounded-full tracking-widest shadow-lg">
              {{ item.etiqueta }}
            </div>

            <div class="relative aspect-square overflow-hidden bg-black">
              <img :src="item.imagen_url || 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?q=80&w=800'" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
              <div class="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80 pointer-events-none z-10"></div>
            </div>

            <div class="p-6 flex-1 flex flex-col">
              <div class="text-center mb-4">
                <h3 class="text-2xl font-serif text-white mb-1 group-hover:text-[#D4AF37] transition-colors capitalize">
                  {{ item.nombre }}
                </h3>
              </div>

              <div class="py-4 border-y border-white/5 mb-6 flex-1 flex flex-col justify-center">
                <p class="text-sm text-neutral-400 font-light line-clamp-3 leading-relaxed text-center">
                  {{ item.descripcion || t.sinDescripcion }}
                </p>
              </div>

              <div class="mt-auto flex items-center justify-center pt-2">
                <span class="text-2xl font-mono text-[#D4AF37] tracking-tighter flex items-baseline">
                  ${{ Number(item.precio).toLocaleString('es-CO') }}
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase, idiomaGlobal } from '../../lib/supabase'

// Logos
import logoCafe from '@/assets/logonc.png'
import logoPescado from '@/assets/logonp.png'
import logoSky from '@/assets/logons.png'

const router = useRouter()
const route = useRoute()
const localActual = route.params.local

const mostrarMenu = ref(false)
const dropdownOpen = ref(false)
const menuData = ref([])
const categoriaActiva = ref('Todos') 
const cargandoInicial = ref(true)

const configLocal = computed(() => {
  const configs = {
    'chao-cafe': { titulo: 'Chao Cafe', logo: logoCafe, whatsapp: 'https://wa.me/numerodechaocafe' },
    'chao-pescao': { titulo: 'Chao Pescao', logo: logoPescado, whatsapp: 'https://wa.me/numerodechaopescao' },
    'sky-bar': { titulo: 'Sky Bar', logo: logoSky, whatsapp: 'https://wa.me/numerodeskybar' }
  }
  return configs[localActual] || configs['chao-cafe']
})

// BÚSQUEDA EN SUPABASE
const fetchMenu = async () => {
  try {
    cargandoInicial.value = true
    const { data, error } = await supabase
      .from('menu_gastronomia')
      .select('*')
      .eq('local', localActual)
      .eq('disponible', true)
      .order('created_at', { ascending: false })

    if (!error && data) {
      menuData.value = data
    }
  } catch (error) {
    console.error('Error al cargar menú:', error)
  } finally {
    cargandoInicial.value = false
  }
}

onMounted(fetchMenu)

// =======================================================
// LÓGICA DE TRADUCCIÓN GLOBAL Y DE CATEGORÍAS (SUPABASE)
// =======================================================
const toggleDropdown = () => { dropdownOpen.value = !dropdownOpen.value }
const seleccionarIdioma = (code) => { idiomaGlobal.value = code; dropdownOpen.value = false }
const idiomas = [
  { code: 'es', label: 'ESP' }, { code: 'en', label: 'ENG' }, { code: 'fr', label: 'FRA' }, { code: 'ja', label: 'JPN' }
]

// EL DICCIONARIO MAESTRO: Si la columna 'categoria' en Supabase es "bebidas_calientes", usará esto:
const traducciones = {
  es: { 
    btnMenu: 'Menú', btnReservas: 'Reservas', btnOpinion: 'Danos tu opinión', btnUbicacion: 'Encuéntranos', btnVolver: 'Volver', 
    filterAll: 'Todo', cargando: 'Cargando menú...', sinDescripcion: 'Sin descripción detallada.', sinResultados: 'No hay productos en este menú por ahora.',
    // Categorías de Supabase:
    bebidas_calientes: 'Bebidas Calientes', bebidas_refrescantes: 'Refrescantes', cervezas: 'Cervezas', 
    comida_sal: 'Comida', comida_dulce: 'Comida Dulce', botellas: 'Botellas', cocteles: 'Cócteles', tragos: 'Tragos' 
  },
  en: { 
    btnMenu: 'Menu', btnReservas: 'Reservations', btnOpinion: 'Give us feedback', btnUbicacion: 'Find us', btnVolver: 'Back', 
    filterAll: 'All', cargando: 'Loading menu...', sinDescripcion: 'No detailed description.', sinResultados: 'No products in this menu yet.',
    bebidas_calientes: 'Hot Drinks', bebidas_refrescantes: 'Refreshments', cervezas: 'Beers', 
    comida_sal: 'Food', comida_dulce: 'Desserts', botellas: 'Bottles', cocteles: 'Cocktails', tragos: 'Shots' 
  },
  fr: { 
    btnMenu: 'Menu', btnReservas: 'Réservations', btnOpinion: 'Donnez votre avis', btnUbicacion: 'Nous trouver', btnVolver: 'Retour', 
    filterAll: 'Tout', cargando: 'Chargement...', sinDescripcion: 'Pas de description.', sinResultados: 'Aucun produit pour le moment.',
    bebidas_calientes: 'Boissons Chaudes', boissons_refraichissantes: 'Boissons Fraîches', cervezas: 'Bières', 
    comida_sal: 'Nourriture', comida_dulce: 'Desserts', botellas: 'Bouteilles', cocteles: 'Cocktails', tragos: 'Shooters' 
  },
  ja: { 
    btnMenu: 'メニュー', btnReservas: '予約', btnOpinion: 'フィードバック', btnUbicacion: 'アクセス', btnVolver: '戻る', 
    filterAll: 'すべて', cargando: '読み込み中...', sinDescripcion: '詳細な説明はありません。', sinResultados: 'このメニューにはまだ商品がありません。',
    bebidas_calientes: '温かい飲み物', bebidas_refrescantes: '冷たい飲み物', cervezas: 'ビール', 
    comida_sal: '食べ物', comida_dulce: 'デザート', botellas: 'ボトル', cocteles: 'カクテル', tragos: 'ショット' 
  }
}

const t = computed(() => traducciones[idiomaGlobal.value] || traducciones.es)

// Función que toma la categoría de la base de datos y la pasa por el diccionario
const traducirCategoriaUnica = (categoriaBd) => {
  return t.value[categoriaBd] || categoriaBd.replace('_', ' ').toUpperCase()
}

// Creador de los botones de filtrado (Mapea las categorías existentes a botones con traducción)
const categoriasVisibles = computed(() => {
  const uniqueCats = [...new Set(menuData.value.map(i => i.categoria))]
  
  // Siempre agregamos el botón "Todos" de primero
  const botones = [ { id: 'Todos', nombre: t.value.filterAll } ]
  
  // Agregamos las categorías que encontró en Supabase y las traducimos
  uniqueCats.forEach(c => {
    botones.push({ id: c, nombre: traducirCategoriaUnica(c) })
  })
  
  return botones
})

const menuFiltrado = computed(() => {
  if (categoriaActiva.value === 'Todos') {
    return menuData.value
  }
  return menuData.value.filter(item => item.categoria === categoriaActiva.value)
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');

.font-serif {
  font-family: 'Playfair Display', serif;
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.5s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.animate-fade-in { animation: fadeIn 0.8s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

.fade-down-enter-active, .fade-down-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.fade-down-enter-from, .fade-down-leave-to { opacity: 0; transform: translateY(-10px); }

.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>