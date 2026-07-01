<template>
  <main class="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-[#D4AF37] selection:text-black antialiased">
    
    <transition name="fade">
      <div v-if="!mostrarMenu" class="fixed inset-0 z-50 flex flex-col justify-center items-center py-8 px-6 bg-[#0a0a0a]">
        
        <button 
          @click="router.push('/homegastro')" 
          class="absolute top-6 left-6 p-2 bg-white/5 border border-white/10 rounded-full text-white/70 hover:text-white hover:bg-white/10 hover:border-[#D4AF37]/40 hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40"
          aria-label="Volver al portal gastronómico"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </button>

        <div class="absolute top-6 right-6 z-50">
          <button 
            @click="toggleDropdown"
            class="flex items-center gap-2 p-2 text-white/70 hover:text-white transition-all duration-300 bg-white/5 border border-white/10 hover:border-[#D4AF37]/40 rounded-full focus:outline-none"
            :aria-expanded="dropdownOpen"
            aria-haspopup="true"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="text-xs font-semibold tracking-wider uppercase select-none">{{ idiomaGlobal }}</span>
          </button>

          <transition name="fade-down">
            <div v-if="dropdownOpen" class="absolute right-0 top-full mt-2 w-36 bg-[#0a0a0a]/95 backdrop-blur-xl border border-[#D4AF37]/20 rounded-xl shadow-[0_15px_50px_rgba(0,0,0,0.9)] overflow-hidden py-1 z-50">
              <button 
                v-for="lang in idiomas" 
                :key="lang.code"
                @click="seleccionarIdioma(lang.code)"
                class="w-full text-left px-4 py-3 text-xs text-gray-400 hover:bg-[#D4AF37]/10 hover:text-[#D4AF37] transition-colors duration-200 border-b border-white/5 last:border-none uppercase tracking-widest font-medium focus:outline-none"
              >
                {{ lang.label }}
              </button>
            </div>
          </transition>
        </div>

        <header class="w-48 md:w-56 mb-12 flex flex-col items-center select-none">
          <img 
            :src="configLocal.logo" 
            :alt="`Logo oficial de ${configLocal.titulo} - Palacio Nacional Medellín`" 
            class="w-full h-auto object-contain drop-shadow-[0_0_20px_rgba(212,175,55,0.25)] mb-4" 
          />
        </header>

        <nav class="w-full max-w-[320px] flex flex-col gap-4" aria-label="Acciones del establecimiento">
          <button 
            @click="mostrarMenu = true"
            class="w-full py-3.5 border border-[#D4AF37]/60 text-white bg-transparent hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] transition-all duration-300 rounded-[2rem] text-sm font-semibold tracking-wider uppercase shadow-sm active:scale-[0.98] focus:outline-none"
          >
            {{ t.btnMenu }}
          </button>
          
          <button 
            @click="abrirWhatsApp"
            class="w-full py-3.5 border border-[#D4AF37]/60 text-white bg-transparent hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] transition-all duration-300 rounded-[2rem] text-sm font-semibold tracking-wider uppercase shadow-sm active:scale-[0.98] focus:outline-none"
          >
            {{ t.btnReservas }}
          </button>
          
          <button class="w-full py-3.5 border border-[#D4AF37]/60 text-white bg-transparent hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] transition-all duration-300 rounded-[2rem] text-sm font-semibold tracking-wider uppercase shadow-sm active:scale-[0.98] focus:outline-none">
            {{ t.btnOpinion }}
          </button>
          
          <button 
            @click="abrirUbicacion"
            class="w-full py-3.5 border border-[#D4AF37]/60 text-white bg-transparent hover:bg-[#D4AF37] hover:text-black hover:border-[#D4AF37] transition-all duration-300 rounded-[2rem] text-sm font-semibold tracking-wider uppercase shadow-sm active:scale-[0.98] focus:outline-none"
          >
            {{ t.btnUbicacion }}
          </button>
        </nav>

      </div>
    </transition>

    <div v-if="mostrarMenu" class="pb-24 animate-fade-in bg-[#0a0a0a] min-h-screen">
      
      <header class="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/10 pt-6 pb-2 px-4 flex flex-col gap-4 shadow-md">
        <div class="flex justify-between items-center max-w-7xl mx-auto w-full">
          <button @click="mostrarMenu = false" class="text-white/70 hover:text-[#D4AF37] flex items-center gap-1 text-xs uppercase tracking-widest font-semibold transition-colors focus:outline-none">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            {{ t.btnVolver }}
          </button>
          <span class="text-[#D4AF37] font-serif tracking-[0.2em] uppercase text-sm md:text-base pr-8 select-none">{{ configLocal.titulo }}</span>
          <div></div> 
        </div>

        <nav class="flex overflow-x-auto gap-3 hide-scrollbar pb-2 max-w-7xl mx-auto w-full px-2" aria-label="Categorías de la carta">
          <button
            @click="categoriaActiva = 'todo'"
            :class="[
              'whitespace-nowrap uppercase tracking-widest text-[11px] px-5 py-2.5 rounded-xl transition-all duration-300 font-semibold focus:outline-none',
              categoriaActiva === 'todo'
                ? 'bg-[#D4AF37] text-black shadow-[0_4px_15px_rgba(212,175,55,0.3)]'
                : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
            ]"
          >
            {{ t.tabTodo }}
          </button>

          <button 
            v-for="cat in categoriasTraducidas" 
            :key="cat.id" 
            @click="categoriaActiva = cat.id"
            :class="[
              'whitespace-nowrap uppercase tracking-widest text-[11px] px-5 py-2.5 rounded-xl transition-all duration-300 font-semibold focus:outline-none',
              categoriaActiva === cat.id 
                ? 'bg-[#D4AF37] text-black shadow-[0_4px_15px_rgba(212,175,55,0.3)]' 
                : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white'
            ]"
          >
            {{ cat.nombre }}
          </button>
        </nav>
      </header>

      <section class="p-4 w-full max-w-2xl mx-auto mt-4" aria-label="Listado de productos">
        
        <h1 class="text-[#D4AF37] font-serif text-2xl text-center mb-8 drop-shadow-md uppercase tracking-wider">
          {{ categoriaActiva === 'todo' ? t.tabTodo : categoriasTraducidas.find(c => c.id === categoriaActiva)?.nombre }}
        </h1>

        <div v-if="cargando" class="text-center py-12 text-[#D4AF37] uppercase tracking-widest text-xs animate-pulse font-medium">
          Cargando carta...
        </div>
        
        <div v-else-if="menuData.length === 0" class="text-center py-12 text-gray-500 uppercase tracking-widest text-xs border border-dashed border-white/10 rounded-2xl">
          Próximamente...
        </div>

        <div v-else>
          <div v-if="categoriaActiva === 'todo'" class="space-y-12">
            <div v-for="catBlock in menuCompletoEstructurado" :key="catBlock.id" class="space-y-6">
              <h2 class="text-white font-serif text-xl border-b border-[#D4AF37]/40 pb-2 tracking-widest uppercase mb-6 shadow-sm">
                {{ catBlock.nombre }}
              </h2>
              
              <div v-if="catBlock.tieneSub" class="space-y-8">
                <div v-for="(items, subcat) in catBlock.grupos" :key="subcat" class="space-y-4">
                  <h3 class="text-[#D4AF37] font-sans text-xs font-bold tracking-[0.2em] uppercase pl-2 border-l-2 border-[#D4AF37]/60">
                    {{ traducirSubcategoria(subcat) }}
                  </h3>
                  <div class="flex flex-col gap-4">
                    <article v-for="item in items" :key="item.id" class="bg-[#050505] border border-white/5 rounded-2xl p-5 hover:border-[#D4AF37]/30 hover:shadow-[0_6px_25px_rgba(212,175,55,0.03)] transition-all duration-300 flex flex-col justify-between group">
                      <div class="flex justify-between items-start mb-2">
                        <div class="flex-1 pr-4">
                          <h4 class="text-white font-serif text-base md:text-lg leading-tight group-hover:text-[#D4AF37] transition-colors duration-300">
                            {{ formatoTitulo(obtenerTraduccion(item, 'nombre')) }}
                          </h4>
                          <div v-if="item.etiqueta" class="inline-block mt-2 px-2 py-0.5 border border-[#D4AF37] text-[#D4AF37] rounded text-[9px] uppercase tracking-widest font-bold font-sans">
                            {{ item.etiqueta }}
                          </div>
                        </div>
                        <span class="text-[#D4AF37] font-sans font-semibold tracking-wide whitespace-nowrap text-base md:text-lg">
                          ${{ formatPrecio(item.precio) }}
                        </span>
                      </div>
                      <p v-if="obtenerTraduccion(item, 'descripcion')" class="text-gray-400 text-xs md:text-sm font-light leading-relaxed mt-1 whitespace-pre-wrap font-sans">
                        {{ formatoParrafo(obtenerTraduccion(item, 'descripcion')) }}
                      </p>
                    </article>
                  </div>
                </div>
              </div>

              <div v-else class="flex flex-col gap-4">
                <article v-for="item in catBlock.items" :key="item.id" class="bg-[#050505] border border-white/5 rounded-2xl p-5 hover:border-[#D4AF37]/30 hover:shadow-[0_6px_25px_rgba(212,175,55,0.03)] transition-all duration-300 flex flex-col justify-between group">
                  <div class="flex justify-between items-start mb-2">
                    <div class="flex-1 pr-4">
                      <h4 class="text-white font-serif text-base md:text-lg leading-tight group-hover:text-[#D4AF37] transition-colors duration-300">
                        {{ formatoTitulo(obtenerTraduccion(item, 'nombre')) }}
                      </h4>
                      <div v-if="item.etiqueta" class="inline-block mt-2 px-2 py-0.5 border border-[#D4AF37] text-[#D4AF37] rounded text-[9px] uppercase tracking-widest font-bold font-sans">
                        {{ item.etiqueta }}
                      </div>
                    </div>
                    <span class="text-[#D4AF37] font-sans font-semibold tracking-wide whitespace-nowrap text-base md:text-lg">
                      ${{ formatPrecio(item.precio) }}
                    </span>
                  </div>
                  <p v-if="obtenerTraduccion(item, 'descripcion')" class="text-gray-400 text-xs md:text-sm font-light leading-relaxed mt-1 whitespace-pre-wrap font-sans">
                    {{ formatoParrafo(obtenerTraduccion(item, 'descripcion')) }}
                  </p>
                </article>
              </div>
            </div>
          </div>

          <div v-else>
            <div v-if="tieneSubcategorias" class="space-y-10">
              <div v-for="(items, subcat) in menuAgrupado" :key="subcat" class="space-y-4">
                <h3 class="text-[#D4AF37] font-serif text-xl mb-4 border-b border-[#D4AF37]/20 pb-2 pl-2 tracking-wide uppercase">
                  {{ traducirSubcategoria(subcat) }}
                </h3>
                <div class="flex flex-col gap-4">
                  <article v-for="item in items" :key="item.id" class="bg-[#050505] border border-white/5 rounded-2xl p-5 hover:border-[#D4AF37]/30 hover:shadow-[0_6px_25px_rgba(212,175,55,0.03)] transition-all duration-300 flex flex-col justify-between group">
                    <div class="flex justify-between items-start mb-2">
                      <div class="flex-1 pr-4">
                        <h4 class="text-white font-serif text-base md:text-lg leading-tight group-hover:text-[#D4AF37] transition-colors duration-300">
                          {{ formatoTitulo(obtenerTraduccion(item, 'nombre')) }}
                        </h4>
                        <div v-if="item.etiqueta" class="inline-block mt-2 px-2 py-0.5 border border-[#D4AF37] text-[#D4AF37] rounded text-[9px] uppercase tracking-widest font-bold font-sans">
                          {{ item.etiqueta }}
                        </div>
                      </div>
                      <span class="text-[#D4AF37] font-sans font-semibold tracking-wide whitespace-nowrap text-base md:text-lg">
                        ${{ formatPrecio(item.precio) }}
                      </span>
                    </div>
                    <p v-if="obtenerTraduccion(item, 'descripcion')" class="text-gray-400 text-xs md:text-sm font-light leading-relaxed mt-1 whitespace-pre-wrap font-sans">
                      {{ formatoParrafo(obtenerTraduccion(item, 'descripcion')) }}
                    </p>
                  </article>
                </div>
              </div>
            </div>

            <div v-else class="flex flex-col gap-4">
              <article v-for="item in menuFiltrado" :key="item.id" class="bg-[#050505] border border-white/5 rounded-2xl p-5 hover:border-[#D4AF37]/30 hover:shadow-[0_6px_25px_rgba(212,175,55,0.03)] transition-all duration-300 flex flex-col justify-between group">
                <div class="flex justify-between items-start mb-2">
                  <div class="flex-1 pr-4">
                    <h4 class="text-white font-serif text-base md:text-lg leading-tight group-hover:text-[#D4AF37] transition-colors duration-300">
                      {{ formatoTitulo(obtenerTraduccion(item, 'nombre')) }}
                    </h4>
                    <div v-if="item.etiqueta" class="inline-block mt-2 px-2 py-0.5 border border-[#D4AF37] text-[#D4AF37] rounded text-[9px] uppercase tracking-widest font-bold font-sans">
                      {{ item.etiqueta }}
                    </div>
                  </div>
                  <span class="text-[#D4AF37] font-sans font-semibold tracking-wide whitespace-nowrap text-base md:text-lg">
                    ${{ formatPrecio(item.precio) }}
                  </span>
                </div>
                <p v-if="obtenerTraduccion(item, 'descripcion')" class="text-gray-400 text-xs md:text-sm font-light leading-relaxed mt-1 whitespace-pre-wrap font-sans">
                  {{ formatoParrafo(obtenerTraduccion(item, 'descripcion')) }}
                </p>
              </article>
            </div>
          </div>
        </div>

      </section>
      
    </div>

  </main>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase, idiomaGlobal } from '../../lib/supabase'

// Logos estáticos
import logoCafe from '@/assets/logonc.png'
import logoPescado from '@/assets/logonp.png'
import logoSky from '@/assets/logons.png'

// =====================================
// RENDIMIENTO: Constantes de Configuración Inmutables (Fuera del Setup reactivo)
// =====================================
const ORDEN_TARJETAS_ESTRICTO = ['bebidas', 'entraditas', 'restaurante', 'postres', 'licores']

const ORDEN_SUBCATEGORIAS_ESTRICTO = [
  'entradas', 'cremas', 'ensaladas', 'ceviche', 'comida_rapida', 'carnes', 'pollo', 'pescados', 'menu_ejecutivo', 'adiciones',
  'cocteles', 'cervezas', 'tragos', 'botellas',
  'refrescantes', 'calientes', 'jugos', 'otros'
]

const PALABRAS_MENORES_TITULO = ['de', 'del', 'con', 'y', 'e', 'o', 'u', 'el', 'la', 'los', 'las', 'en', 'por', 'un', 'una', 'unos', 'unas', 'a', 'al', 'with', 'and', 'of', 'in', 'the', 'et', 'au', 'aux', 'à']

const IDIOMAS_DISPONIBLES = [
  { code: 'es', label: 'ESP' },
  { code: 'en', label: 'ENG' },
  { code: 'fr', label: 'FRA' },
  { code: 'ja', label: 'JPN' }
]

const TRADUCCIONES_UI = {
  es: { btnMenu: 'Menú', btnReservas: 'Reservas', btnOpinion: 'Danos tu opinión', btnUbicacion: 'Encuéntranos', btnVolver: 'Volver', tabTodo: 'Todo' },
  en: { btnMenu: 'Menu', btnReservas: 'Reservations', btnOpinion: 'Give us feedback', btnUbicacion: 'Find us', btnVolver: 'Back', tabTodo: 'All' },
  fr: { btnMenu: 'Menu', btnReservas: 'Réservations', btnOpinion: 'Donnez votre avis', btnUbicacion: 'Nous trouver', btnVolver: 'Retour', tabTodo: 'Tout' },
  ja: { btnMenu: 'メニュー', btnReservas: '予約', btnOpinion: 'フィードバック', btnUbicacion: 'アクセス', btnVolver: '戻る', tabTodo: 'すべて' }
}

const DICT_CATEGORIAS = {
  es: { 'entraditas': 'Entradas', 'restaurante': 'Restaurante', 'licores': 'Licores', 'bebidas': 'Bebidas', 'postres': 'Postres', 'comida': 'Comidas', 'comida_dulce': 'Postres y Dulces', 'bebidas_refrescantes': 'Bebidas Refrescantes', 'bebidas_calientes': 'Bebidas Calientes', 'cervezas': 'Cervezas', 'tragos': 'Tragos', 'cocteles': 'Cócteles', 'botellas': 'Botellas' },
  en: { 'entraditas': 'Starters', 'restaurante': 'Restaurant', 'licores': 'Liquors', 'bebidas': 'Drinks', 'postres': 'Desserts', 'comida': 'Food', 'comida_dulce': 'Desserts & Sweets', 'bebidas_refrescantes': 'Refreshing Drinks', 'bebidas_calientes': 'Hot Drinks', 'cervezas': 'Beers', 'tragos': 'Shots', 'cocteles': 'Cocktails', 'botellas': 'Bottles' },
  fr: { 'entraditas': 'Entrées', 'restaurante': 'Restaurant', 'licores': 'Liqueurs', 'bebidas': 'Boissons', 'postres': 'Desserts', 'comida': 'Repas', 'comida_dulce': 'Desserts et Douceurs', 'bebidas_refrescantes': 'Boissons Rafraîchissantes', 'bebidas_calientes': 'Boissons Chaudes', 'cervezas': 'Bières', 'tragos': 'Shots', 'cocteles': 'Cocktails', 'botellas': 'Bouteilles' },
  ja: { 'entraditas': '前菜', 'restaurante': 'レストラン', 'licores': 'お酒', 'bebidas': '飲み物', 'postres': 'デザート', 'comida': '食事', 'comida_dulce': 'デザートとスイーツ', 'bebidas_refrescantes': '冷たい飲み物', 'bebidas_calientes': '温かい読み物', 'cervezas': 'ビール', 'tragos': 'ショット', 'cocteles': 'カクテル', 'botellas': 'ボトル' }
}

const DICT_SUBCATEGORIAS = {
  es: { 'entradas': 'Entradas', 'cremas': 'Cremas', 'ensaladas': 'Ensaladas', 'ceviche': 'Ceviche', 'comida_rapida': 'Comida Rápida', 'carnes': 'Carnes', 'pollo': 'Pollo', 'pescados': 'Pescados', 'menu_ejecutivo': 'Menú Ejecutivo', 'adiciones': 'Adiciones', 'cocteles': 'Cócteles', 'cervezas': 'Cervezas', 'tragos': 'Tragos', 'botellas': 'Botellas', 'refrescantes': 'Refrescantes', 'calientes': 'Calientes', 'jugos': 'Jugos', 'otros': 'Otros' },
  en: { 'entradas': 'Starters', 'cremas': 'Soups', 'ensaladas': 'Salads', 'ceviche': 'Ceviche', 'comida_rapida': 'Fast Food', 'carnes': 'Meats', 'pollo': 'Chicken', 'pescados': 'Fish', 'menu_ejecutivo': 'Executive Menu', 'adiciones': 'Sides', 'cocteles': 'Cocktails', 'cervezas': 'Beers', 'tragos': 'Shots', 'botellas': 'Bottles', 'refrescantes': 'Refreshments', 'calientes': 'Hot Drinks', 'jugos': 'Juices', 'otros': 'Others' },
  fr: { 'entradas': 'Entrées', 'cremas': 'Crèmes', 'ensaladas': 'Salades', 'ceviche': 'Ceviche', 'comida_rapida': 'Restauration Rapide', 'carnes': 'Viandes', 'pollo': 'Poulet', 'pescados': 'Poissons', 'menu_ejecutivo': 'Menu Exécutif', 'adiciones': 'Accompagnements', 'cocteles': 'Cocktails', 'cervezas': 'Bières', 'tragos': 'Shots', 'botellas': 'Bouteilles', 'refrescantes': 'Rafraîchissements', 'calientes': 'Boissons Chaudes', 'jugos': 'Jus', 'otros': 'Autres' },
  ja: { 'entradas': '前菜', 'cremas': 'スープ', 'ensaladas': 'サラダ', 'ceviche': 'セビチェ', 'comida_rapida': 'ファストフード', 'carnes': '肉料理', 'pollo': '鶏肉', 'pescados': '魚料理', 'menu_ejecutivo': 'エグゼクティブメニュー', 'adiciones': 'サイドメニュー', 'cocteles': 'カクテル', 'cervezas': 'ビール', 'tragos': 'ショット', 'botellas': 'ボトル', 'refrescantes': '冷たい飲み物', 'calientes': 'ホットドリンク', 'jugos': 'ジュース', 'otros': 'その他' }
}

const router = useRouter()
const route = useRoute()

// =====================================
// ESTADO REACTIVO COMPOSABLE
// =====================================
const mostrarMenu = ref(false)
const cargando = ref(true)
const menuData = ref([])
const categoriasBase = ref([])
const categoriaActiva = ref('todo') // Por defecto inicializa en la pestaña agregada "Todo"
const dropdownOpen = ref(false)

const localActual = computed(() => route.params.local || 'chao-cafe')

const configLocal = computed(() => {
  if (localActual.value === 'chao-pescado') return { titulo: 'Chao Pescao', logo: logoPescado, schemaType: 'Restaurant' }
  if (localActual.value === 'sky-bar') return { titulo: 'Sky Bar', logo: logoSky, schemaType: 'BarOrPub' }
  return { titulo: 'Chao Cafe', logo: logoCafe, schemaType: 'CafeOrCoffeeShop' }
})

const idiomas = IDIOMAS_DISPONIBLES
const t = computed(() => TRADUCCIONES_UI[idiomaGlobal.value] || TRADUCCIONES_UI.es)

// =====================================
// PILLAR SEO: Inyección Multitentáculo Contextual
// =====================================
const actualizarSEO = () => {
  let titulo = ""
  let descripcion = ""
  let schemaData = {}

  if (localActual.value === 'sky-bar') {
    titulo = "Sky Bar | Terraza Bar en el Centro de Medellín | Palacio Nacional"
    descripcion = "Disfruta de la mejor terraza bar en el centro de Medellín. Cócteles de autor, cafés premium y licores exclusivos en el piso 5 del Palacio Nacional."
    schemaData = {
      "@context": "https://schema.org",
      "@type": "BarOrPub",
      "name": "Sky Bar Café Medellín",
      "url": "https://palacionacionalmedellin.com/gastronomia/sky-bar",
      "telephone": "+573212865949",
      "address": { "@type": "PostalAddress", "streetAddress": "Cra. 52 #48-45 5to piso, Palacio Nacional", "addressLocality": "Medellín", "addressRegion": "Antioquia", "addressCountry": "CO" }
    }
  } else if (localActual.value === 'chao-pescado') {
    titulo = "Chao Pescao | Restaurante en el Centro de Medellín | Palacio Nacional"
    descripcion = "El mejor restaurante de comida gourmet y menús ejecutivos en el centro de Medellín. Sabor exclusivo en el piso 5 del Palacio Nacional del arte y la moda."
    schemaData = {
      "@context": "https://schema.org",
      "@type": "Restaurant",
      "name": "Chao Pescao",
      "url": "https://palacionacionalmedellin.com/gastronomia/chao-pescado",
      "telephone": "+573001111111",
      "address": { "@type": "PostalAddress", "streetAddress": "Cra. 52 #48-45 5to piso, Palacio Nacional", "addressLocality": "Medellín", "addressRegion": "Antioquia", "addressCountry": "CO" }
    }
  } else {
    titulo = "Chao Café | La Mejor Cafetería en el Centro de Medellín | Palacio Nacional"
    descripcion = "Tómate un verdadero café de especialidad colombiano en el centro de Medellín. Repostería artesanal y tranquilidad en el piso 5 del histórico Palacio Nacional."
    schemaData = {
      "@context": "https://schema.org",
      "@type": "CafeOrCoffeeShop",
      "name": "Chao Café",
      "url": "https://palacionacionalmedellin.com/gastronomia/chao-cafe",
      "telephone": "+573003333333",
      "address": { "@type": "PostalAddress", "streetAddress": "Cra. 52 #48-45 5to piso, Palacio Nacional", "addressLocality": "Medellín", "addressRegion": "Antioquia", "addressCountry": "CO" }
    }
  }

  document.title = titulo
  let metaDescription = document.querySelector('meta[name="description"]')
  if (!metaDescription) {
    metaDescription = document.createElement('meta')
    metaDescription.name = "description"
    document.head.appendChild(metaDescription)
  }
  metaDescription.content = descripcion

  // Inyección/Limpieza dinámica de datos estructurados para evitar fugas de memoria en SPA
  let script = document.getElementById('schema-locales-especificos')
  if (script) script.remove()
  script = document.createElement('script')
  script.id = 'schema-locales-especificos'
  script.type = 'application/ld+json'
  script.text = JSON.stringify(schemaData)
  document.head.appendChild(script)
}

// =====================================
// FLUJO DE DATOS ASÍNCRONOS (SUPABASE)
// =====================================
const cargarMenu = async () => {
  cargando.value = true
  try {
    const { data, error } = await supabase
      .from('menu_gastronomia')
      .select('*')
      .ilike('local', `%${localActual.value}%`)
      .order('nombre', { ascending: true })
      
    if (error) throw error

    if (data && data.length > 0) {
      menuData.value = data
      const unicas = [...new Set(data.map(item => item.categoria))]
      
      // Ordenación controlada por constantes estáticas de rendimiento
      unicas.sort((a, b) => {
        let indexA = ORDEN_TARJETAS_ESTRICTO.indexOf(a)
        let indexB = ORDEN_TARJETAS_ESTRICTO.indexOf(b)
        return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB)
      })
      
      categoriasBase.value = unicas
      // Mantiene 'todo' si ya estaba seleccionado para optimizar UX
      if (categoriaActiva.value !== 'todo') {
        categoriaActiva.value = unicas.length > 0 ? unicas[0] : 'todo'
      }
    } else {
      menuData.value = []
      categoriasBase.value = []
    }
  } catch (error) {
    console.error('Error de carga estructural en la carta:', error)
  } finally {
    cargando.value = false
  }
}

// =====================================
// COMPUTED DE AGREGACIÓN Y FILTRADO (LOGICA TODO INCLUIDA)
// =====================================
const menuFiltrado = computed(() => {
  return menuData.value.filter(item => item.categoria === categoriaActiva.value)
})

const tieneSubcategorias = computed(() => {
  return menuFiltrado.value.some(item => item.subcategoria && item.subcategoria.trim() !== '')
})

const menuAgrupado = computed(() => {
  if (!tieneSubcategorias.value) return {}
  return agruparItemsPorSubcategoria(menuFiltrado.value)
})

// Mapeo unificado de la base completa organizada jerárquicamente para la opción "Todo"
const menuCompletoEstructurado = computed(() => {
  if (categoriaActiva.value !== 'todo') return []
  const currentDict = DICT_CATEGORIAS[idiomaGlobal.value] || DICT_CATEGORIAS.es

  return categoriasBase.value.map(catId => {
    const itemsDeCat = menuData.value.filter(item => item.categoria === catId)
    const tieneSub = itemsDeCat.some(item => item.subcategoria && item.subcategoria.trim() !== '')
    
    return {
      id: catId,
      nombre: currentDict[catId] || catId.replace(/_/g, ' ').toUpperCase(),
      tieneSub,
      items: itemsDeCat,
      grupos: tieneSub ? agruparItemsPorSubcategoria(itemsDeCat) : {}
    }
  })
})

// Función helper de agrupación para evitar redundancia de código y ciclos de renderizado pesados
const agruparItemsPorSubcategoria = (items) => {
  const grupos = {}
  items.forEach(item => {
    const sub = item.subcategoria?.trim() || 'otros'
    if (!grupos[sub]) grupos[sub] = []
    grupos[sub].push(item)
  })
  
  const gruposOrdenados = {}
  ORDEN_SUBCATEGORIAS_ESTRICTO.forEach(subcat => { 
    if (grupos[subcat]) gruposOrdenados[subcat] = grupos[subcat] 
  })
  Object.keys(grupos).forEach(subcat => { 
    if (!gruposOrdenados[subcat]) gruposOrdenados[subcat] = grupos[subcat] 
  })
  return gruposOrdenados
}

// =====================================
// FORMATEADORES STRING & REGLAS LINGÜÍSTICAS
// =====================================
const formatoTitulo = (texto) => {
  if (typeof texto !== 'string' || !texto) return ''
  return texto.trim().toLowerCase().split(/\s+/).map((word, index) => {
    if (index > 0 && PALABRAS_MENORES_TITULO.includes(word)) return word
    return word.charAt(0).toUpperCase() + word.slice(1)
  }).join(' ')
}

const formatoParrafo = (texto) => {
  if (typeof texto !== 'string' || !texto) return ''
  const t = texto.trim()
  return t.charAt(0).toUpperCase() + t.slice(1)
}

const formatPrecio = (precio) => {
  if (!precio) return '0'
  const num = Number(precio)
  return isNaN(num) ? '0' : num.toLocaleString('es-CO')
}

const obtenerTraduccion = (item, campoBase) => {
  const idioma = idiomaGlobal.value
  if (idioma === 'es') return item[campoBase]
  const campoTraducido = `${campoBase}_${idioma}`
  return (item[campoTraducido] && item[campoTraducido].trim() !== '') ? item[campoTraducido] : item[campoBase]
}

const categoriasTraducidas = computed(() => {
  const currentDict = DICT_CATEGORIAS[idiomaGlobal.value] || DICT_CATEGORIAS.es
  return categoriasBase.value.map(catId => ({
    id: catId,
    nombre: currentDict[catId] || catId.replace(/_/g, ' ').toUpperCase()
  }))
})

const traducirSubcategoria = (subcat) => {
  const currentDict = DICT_SUBCATEGORIAS[idiomaGlobal.value] || DICT_SUBCATEGORIAS.es
  return currentDict[subcat] || subcat.replace(/_/g, ' ').toUpperCase()
}

// =====================================
// ACCIONES E INTERFACES EXTERNAS
// =====================================
const toggleDropdown = () => { dropdownOpen.value = !dropdownOpen.value }
const seleccionarIdioma = (codigo) => { idiomaGlobal.value = codigo; dropdownOpen.value = false }

const abrirWhatsApp = () => {
  const telefonos = { 'chao-pescado': '573001111111', 'sky-bar': '573212865949', 'chao-cafe': '573003333333' }
  const numeroTelefono = telefonos[localActual.value] || '573000000000'
  const mensaje = `Hola, me gustaría hacer una reserva en ${configLocal.value.titulo} en el Palacio Nacional.`
  window.open(`https://wa.me/${numeroTelefono}?text=${encodeURIComponent(mensaje)}`, '_blank')
}

const abrirUbicacion = () => {
  let ubicacion = 'Palacio Nacional, Medellín'
  if (localActual.value === 'sky-bar') {
    ubicacion = 'Sky Bar Café Medellin, nodo central, Cra. 52 #48-45 5to piso, La Candelaria, Medellín, Antioquia'
  }
  window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ubicacion)}`, '_blank')
}

// SINCRONIZACIÓN REACTIVA
watch(localActual, () => {
  cargarMenu()
  actualizarSEO()
})

onMounted(() => {
  cargarMenu()
  actualizarSEO()
})
</script>

<style scoped>
/* RENDIMIENTO EN CAPA VISUAL: Renderizado tipográfico suavizado acelerado por GPU */
.antialiased {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, h4 {
  text-rendering: optimizeLegibility;
}

/* MICRO-INTERACCIONES Y PULIDO VISUAL */
.fade-enter-active,
.fade-leave-active { 
  transition: opacity 0.4s cubic-bezier(0.25, 1, 0.5, 1); 
}
.fade-enter-from,
.fade-leave-to { 
  opacity: 0; 
}

.animate-fade-in { 
  animation: fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-down-enter-active,
.fade-down-leave-active { 
  transition: opacity 0.25s ease, transform 0.25s ease; 
}
.fade-down-enter-from,
.fade-down-leave-to { 
  opacity: 0; transform: translateY(-6px); 
}

/* Optimización estructural de scroll sin ruido de barras de desplazamiento */
.hide-scrollbar::-webkit-scrollbar { 
  display: none; 
}
.hide-scrollbar { 
  -ms-overflow-style: none; 
  scrollbar-width: none; 
}

/* Enfoque accesible premium para botones táctiles */
button:focus-visible {
  outline: 2px solid #D4AF37;
  outline-offset: 2px;
}
</style>