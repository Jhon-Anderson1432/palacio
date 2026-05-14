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
          <img :src="configLocal.logo" :alt="configLocal.titulo" class="w-full h-auto object-contain drop-shadow-[0_0_15px_rgba(212,175,55,0.2)] mb-4" />
        </div>

        <div class="w-full max-w-[320px] flex flex-col gap-4">
          <button 
            @click="mostrarMenu = true"
            class="w-full py-3.5 border border-[#D4AF37]/60 text-white bg-transparent hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] transition-all duration-300 rounded-[2rem] text-sm font-medium tracking-wide shadow-sm"
          >
            {{ t.btnMenu }}
          </button>
          
          <button 
            @click="abrirWhatsApp"
            class="w-full py-3.5 border border-[#D4AF37]/60 text-white bg-transparent hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] transition-all duration-300 rounded-[2rem] text-sm font-medium tracking-wide shadow-sm"
          >
            {{ t.btnReservas }}
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
          <span class="text-[#D4AF37] font-serif tracking-[0.2em] uppercase text-sm md:text-base pr-8">{{ configLocal.titulo }}</span>
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

      <section class="p-4 w-full max-w-2xl mx-auto mt-4">
        <h2 class="text-[#D4AF37] font-serif text-2xl text-center mb-6 drop-shadow-md">
          {{ categoriasTraducidas.find(c => c.id === categoriaActiva)?.nombre }}
        </h2>

        <div v-if="cargando" class="text-center py-12 text-[#D4AF37] uppercase tracking-widest text-xs animate-pulse">
          Cargando carta...
        </div>
        
        <div v-else-if="menuFiltrado.length === 0" class="text-center py-12 text-gray-500 uppercase tracking-widest text-xs border border-dashed border-white/10 rounded-2xl">
          Próximamente...
        </div>

        <div v-else class="flex flex-col gap-4">
          <div 
            v-for="item in menuFiltrado" 
            :key="item.id" 
            class="bg-[#050505] border border-white/10 rounded-2xl p-5 hover:border-[#D4AF37]/40 hover:shadow-[0_4px_20px_rgba(212,175,55,0.05)] transition-all duration-300 flex flex-col justify-between group"
          >
            <div class="flex justify-between items-start mb-2">
              <div class="flex-1 pr-4">
                <h3 class="text-white font-serif text-lg md:text-xl leading-tight group-hover:text-[#D4AF37] group-hover:translate-x-1 transition-all">
                  {{ capitalizarPrimeraLetra(obtenerTraduccion(item, 'nombre')) }}
                </h3>
                <div v-if="item.etiqueta" class="inline-block mt-2 px-2 py-0.5 border border-[#D4AF37] text-[#D4AF37] rounded text-[9px] uppercase tracking-widest">
                  {{ item.etiqueta }}
                </div>
              </div>
              <span class="text-[#D4AF37] font-semibold tracking-wide whitespace-nowrap text-lg">
                ${{ formatPrecio(item.precio) }}
              </span>
            </div>
            <p v-if="obtenerTraduccion(item, 'descripcion')" class="text-gray-400 text-xs md:text-sm font-light leading-relaxed mt-1">
              {{ capitalizarPrimeraLetra(obtenerTraduccion(item, 'descripcion')) }}
            </p>
          </div>
        </div>

      </section>
      
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

// =====================================
// Lógica Dinámica de Local
// =====================================
const localActual = route.params.local

const configLocal = computed(() => {
  if (localActual === 'chao-pescado') return { titulo: 'Chao Pescao', logo: logoPescado }
  if (localActual === 'sky-bar') return { titulo: 'Sky Bar', logo: logoSky }
  return { titulo: 'Chao Cafe', logo: logoCafe }
})

// =====================================
// Estado y Supabase
// =====================================
const mostrarMenu = ref(false)
const cargando = ref(true)
const menuData = ref([])
const categoriasBase = ref([])
const categoriaActiva = ref('')

const cargarMenu = async () => {
  cargando.value = true
  try {
    const { data, error } = await supabase
      .from('menu_gastronomia')
      .select('*')
      .eq('local', localActual) // FILTRO POR CAFETERÍA
      .order('nombre', { ascending: true })
      
    if (error) throw error

    if (data && data.length > 0) {
      menuData.value = data
      
      // Extrae las categorías únicas de los productos devueltos
      const unicas = [...new Set(data.map(item => item.categoria))]
      categoriasBase.value = unicas
      categoriaActiva.value = unicas[0]
    }
  } catch (error) {
    console.error('Error al cargar la carta:', error)
  } finally {
    cargando.value = false
  }
}

const formatPrecio = (precio) => {
  if (!precio) return '0'
  return Number(precio).toLocaleString('es-CO')
}

onMounted(() => {
  cargarMenu()
})

const menuFiltrado = computed(() => {
  return menuData.value.filter(item => item.categoria === categoriaActiva.value)
})

// =====================================
// Funciones de Traducción y Formato
// =====================================
const obtenerTraduccion = (item, campoBase) => {
  const idioma = idiomaGlobal.value
  // Si el idioma es español, retornamos el campo original (ej. 'nombre')
  if (idioma === 'es') return item[campoBase]
  
  // Construimos el nombre del campo traducido (ej. 'nombre_en')
  const campoTraducido = `${campoBase}_${idioma}`
  
  // Si existe traducción y no está vacía, la usamos. Si no, usamos español por defecto.
  return item[campoTraducido] ? item[campoTraducido] : item[campoBase]
}

const capitalizarPrimeraLetra = (texto) => {
  if (!texto) return ''
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

// =====================================
// Funcionalidad de WhatsApp (Reservas)
// =====================================
const abrirWhatsApp = () => {
  // Diccionario con los números de cada local
  const telefonos = {
    'chao-pescado': '573001111111', // <-- REEMPLAZA CON EL NÚMERO DE CHAO PESCAO
    'sky-bar': '573002222222',      // <-- REEMPLAZA CON EL NÚMERO DE SKY BAR
    'chao-cafe': '573003333333'       // <-- REEMPLAZA CON EL NÚMERO DE CHAO CAFE
  }

  // Busca el número basado en la URL (localActual). Si por algún motivo no coincide, usa un número por defecto.
  const numeroTelefono = telefonos[localActual] || '573000000000'

  const mensaje = `Hola, me gustaría hacer una reserva en ${configLocal.value.titulo} en el Palacio Nacional.`
  const urlWhatsApp = `https://wa.me/${numeroTelefono}?text=${encodeURIComponent(mensaje)}`
  
  window.open(urlWhatsApp, '_blank')
}

// =====================================
// Idiomas y Traducción (Botones y Categorías)
// =====================================
const dropdownOpen = ref(false)
const toggleDropdown = () => dropdownOpen.value = !dropdownOpen.value
const seleccionarIdioma = (codigo) => { idiomaGlobal.value = codigo; dropdownOpen.value = false }

const idiomas = [
  { code: 'es', label: 'ESP' },
  { code: 'en', label: 'ENG' },
  { code: 'fr', label: 'FRA' },
  { code: 'ja', label: 'JPN' }
]

const traducciones = {
  es: { btnMenu: 'Menú', btnReservas: 'Reservas', btnOpinion: 'Danos tu opinión', btnUbicacion: 'Encuéntranos', btnVolver: 'Volver' },
  en: { btnMenu: 'Menu', btnReservas: 'Reservations', btnOpinion: 'Give us feedback', btnUbicacion: 'Find us', btnVolver: 'Back' },
  fr: { btnMenu: 'Menu', btnReservas: 'Réservations', btnOpinion: 'Donnez votre avis', btnUbicacion: 'Nous trouver', btnVolver: 'Retour' },
  ja: { btnMenu: 'メニュー', btnReservas: '予約', btnOpinion: 'フィードバック', btnUbicacion: 'アクセス', btnVolver: '戻る' }
}
const t = computed(() => traducciones[idiomaGlobal.value] || traducciones.es)

const dictCategorias = {
  es: {
    'botellas': 'Botellas', 'cocteles': 'Cócteles', 'tragos': 'Tragos', 
    'bebidas_refrescantes': 'Bebidas Refrescantes', 'cervezas': 'Cervezas', 
    'bebidas_calientes_y_frias': 'Calientes y Frías', 'jugos_pulpa': 'Jugos de Pulpa',
    'entradas': 'Entradas', 'platos_fuertes': 'Platos Fuertes', 
    'comida_rapida': 'Comida Rápida', 'cremas': 'Cremas', 'ceviche': 'Ceviche',
    'comida': 'Comidas', 'comida_dulce': 'Comida Dulce'
  },
  en: {
    'botellas': 'Bottles', 'cocteles': 'Cocktails', 'tragos': 'Shots', 
    'bebidas_refrescantes': 'Refreshments', 'cervezas': 'Beers', 
    'bebidas_calientes_y_frias': 'Hot & Cold Drinks', 'jugos_pulpa': 'Fruit Juices',
    'entradas': 'Starters', 'platos_fuertes': 'Main Courses', 
    'comida_rapida': 'Fast Food', 'cremas': 'Soups', 'ceviche': 'Ceviche',
    'comida': 'Food', 'comida_dulce': 'Sweet Treats'
  },
  fr: {
    'botellas': 'Bouteilles', 'cocteles': 'Cocktails', 'tragos': 'Shots', 
    'bebidas_refrescantes': 'Rafraîchissements', 'cervezas': 'Bières', 
    'bebidas_calientes_y_frias': 'Boissons Chaudes et Froides', 'jugos_pulpa': 'Jus de Fruits',
    'entradas': 'Entrées', 'platos_fuertes': 'Plats Principaux', 
    'comida_rapida': 'Restauration Rapide', 'cremas': 'Crèmes', 'ceviche': 'Ceviche',
    'comida': 'Nourriture', 'comida_dulce': 'Douceurs'
  },
  ja: {
    'botellas': 'ボトル', 'cocteles': 'カクテル', 'tragos': 'ショット', 
    'bebidas_refrescantes': '冷たい飲み物', 'cervezas': 'ビール', 
    'bebidas_calientes_y_frias': 'ホット＆コールドドリンク', 'jugos_pulpa': 'フルーツジュース',
    'entradas': '前菜', 'platos_fuertes': 'メインコース', 
    'comida_rapida': 'ファストフード', 'cremas': 'スープ', 'ceviche': 'セビチェ',
    'comida': '食べ物', 'comida_dulce': '甘いもの'
  }
}

const categoriasTraducidas = computed(() => {
  const currentDict = dictCategorias[idiomaGlobal.value] || dictCategorias.es
  return categoriasBase.value.map(catId => ({
    id: catId,
    nombre: currentDict[catId] || catId.replace(/_/g, ' ').toUpperCase()
  }))
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active { transition: opacity 0.5s ease; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }
.animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(15px); }
  to { opacity: 1; transform: translateY(0); }
}
.fade-down-enter-active,
.fade-down-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.fade-down-enter-from,
.fade-down-leave-to { opacity: 0; transform: translateY(-10px); }
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
</style>