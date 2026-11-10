<template>
  <main class="min-h-screen bg-[#050505] text-white font-sans flex flex-col selection:bg-[#D4AF37] selection:text-black antialiased relative overflow-x-hidden">
    
    <!-- Luces ambientales de fondo -->
    <div class="fixed top-0 left-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none z-0"></div>
    <div class="fixed bottom-1/4 right-10 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[160px] pointer-events-none z-0"></div>

    <!-- Barra de Navegación -->
    <Navbar :fondoTranslucido="true" />

    <!-- ======================================================== -->
    <!-- 1. HERO SECTION & BUSCADOR REACTIVO                      -->
    <!-- ======================================================== -->
    <header class="relative z-10 pt-32 md:pt-40 pb-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center w-full">
      
      <!-- Migas de Pan (Breadcrumb) -->
      <nav aria-label="Breadcrumb" class="mb-6 flex items-center justify-center gap-2 text-[11px] uppercase tracking-widest text-neutral-400">
        <NuxtLink to="/" class="hover:text-[#D4AF37] transition-colors focus:outline-none focus:text-[#D4AF37]">{{ t.home }}</NuxtLink>
        <span class="text-neutral-600">/</span>
        <span class="text-[#D4AF37] font-semibold">{{ t.breadcrumb }}</span>
      </nav>

      <!-- Insignia -->
      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-[#D4AF37]/30 text-[#D4AF37] text-[10px] uppercase tracking-[0.25em] font-semibold mb-6 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
        <span>✨</span>
        <span>{{ t.badge }}</span>
      </div>

      <!-- Título H1 Principal -->
      <h1 class="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-light tracking-wide text-white uppercase mb-6 leading-tight drop-shadow-md">
        {{ t.title }}
      </h1>

      <!-- Descripción -->
      <p class="text-xs sm:text-sm md:text-base text-neutral-300 font-light max-w-3xl mx-auto leading-relaxed mb-10">
        {{ t.subtitle }}
      </p>

      <!-- Barra de Búsqueda Interactiva en Tiempo Real -->
      <div class="max-w-2xl mx-auto relative group">
        <div class="absolute -inset-1 bg-gradient-to-r from-[#D4AF37]/20 via-[#D4AF37]/40 to-[#D4AF37]/20 rounded-2xl blur-lg opacity-40 group-hover:opacity-75 transition duration-500 pointer-events-none"></div>
        <div class="relative flex items-center bg-black/80 backdrop-blur-xl border border-white/15 focus-within:border-[#D4AF37] rounded-2xl p-2 sm:p-2.5 shadow-2xl transition-all duration-300">
          <span class="pl-3 sm:pl-4 text-neutral-400 text-lg sm:text-xl select-none">🔍</span>
          <input 
            v-model="busquedaTexto"
            type="text" 
            :placeholder="t.searchPlaceholder"
            class="w-full bg-transparent text-white placeholder-neutral-500 text-xs sm:text-sm px-3 sm:px-4 py-2 outline-none focus:ring-0"
            aria-label="Buscar en preguntas frecuentes"
          />
          <button 
            v-if="busquedaTexto" 
            @click="busquedaTexto = ''"
            class="pr-3 text-neutral-400 hover:text-white transition-colors text-xs uppercase tracking-wider font-bold focus:outline-none"
            aria-label="Limpiar búsqueda"
          >
            ✕
          </button>
        </div>
      </div>

    </header>

    <!-- ======================================================== -->
    <!-- 2. SELECTOR DE CATEGORÍAS (PÍLDORAS)                      -->
    <!-- ======================================================== -->
    <nav class="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full mb-8 sm:mb-10" aria-label="Categorías de Preguntas Frecuentes">
      <div class="flex items-center gap-2 sm:gap-3 overflow-x-auto hide-scrollbar py-2 px-4 sm:px-0 -mx-4 sm:mx-0 sm:flex-wrap sm:justify-center">
        <button 
          v-for="cat in categoriasDisponibles"
          :key="cat.id"
          @click="categoriaSeleccionada = cat.id"
          :class="[
            'px-3.5 sm:px-4 py-2 rounded-full text-xs font-semibold tracking-wider transition-all duration-300 flex items-center gap-2 border whitespace-nowrap flex-shrink-0 select-none focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 active:scale-95',
            categoriaSeleccionada === cat.id 
              ? 'bg-[#D4AF37] text-black border-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.4)] font-bold sm:scale-105' 
              : 'bg-white/[0.03] text-neutral-400 border-white/10 hover:border-[#D4AF37]/40 hover:text-white hover:bg-white/[0.06]'
          ]"
          :aria-pressed="categoriaSeleccionada === cat.id"
        >
          <span class="text-sm">{{ cat.icono }}</span>
          <span>{{ cat.nombre }}</span>
          <span 
            :class="[
              'text-[10px] px-2 py-0.5 rounded-full font-mono transition-colors',
              categoriaSeleccionada === cat.id ? 'bg-black/20 text-black font-bold' : 'bg-white/5 text-neutral-400'
            ]"
          >
            {{ cat.total }}
          </span>
        </button>
      </div>
    </nav>

    <!-- ======================================================== -->
    <!-- 3. LISTADO DE PREGUNTAS FRECUENTES (ACORDEÓN)            -->
    <!-- ======================================================== -->
    <section class="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full flex-1" aria-label="Lista de Preguntas y Respuestas">
      
      <!-- Mensaje si no hay resultados -->
      <div 
        v-if="preguntasFiltradas.length === 0" 
        class="text-center py-16 px-4 bg-white/[0.02] border border-dashed border-white/10 rounded-3xl"
      >
        <span class="text-4xl block mb-3">🔍</span>
        <h3 class="text-lg font-serif text-white mb-2">{{ t.noResultsTitle }}</h3>
        <p class="text-xs text-neutral-400 max-w-md mx-auto mb-6">{{ t.noResultsDesc }}</p>
        <button 
          @click="limpiarFiltros" 
          class="px-5 py-2.5 bg-[#D4AF37]/10 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-black border border-[#D4AF37]/40 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300"
        >
          {{ t.clearSearchBtn }}
        </button>
      </div>

      <!-- Acordeón de Preguntas -->
      <div v-else class="space-y-4">
        <div 
          v-for="(item, index) in preguntasFiltradas" 
          :key="item.id"
          class="group bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 hover:border-[#D4AF37]/40 rounded-2xl transition-all duration-300 overflow-hidden shadow-lg"
        >
          <!-- Botón de Pregunta -->
          <button 
            @click="alternarPregunta(item.id)"
            class="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/40 rounded-2xl"
            :aria-expanded="preguntaAbiertaId === item.id"
            :aria-controls="`respuesta-${item.id}`"
          >
            <div class="space-y-1.5 flex-1 pr-2">
              <span class="inline-block text-[10px] font-bold uppercase tracking-[0.2em] text-[#D4AF37]/80 bg-[#D4AF37]/10 px-2.5 py-0.5 rounded-full border border-[#D4AF37]/20">
                {{ obtenerNombreCategoria(item.categoria) }}
              </span>
              <h2 class="text-base sm:text-lg font-serif text-white group-hover:text-[#D4AF37] transition-colors leading-snug">
                {{ item.pregunta }}
              </h2>
            </div>

            <!-- Ícono Chevron Giratorio -->
            <div 
              :class="[
                'w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-xs text-[#D4AF37] transition-transform duration-300 flex-shrink-0 mt-1 bg-black/40',
                preguntaAbiertaId === item.id ? 'rotate-180 bg-[#D4AF37] text-black border-[#D4AF37]' : 'group-hover:border-[#D4AF37]/40'
              ]"
              aria-hidden="true"
            >
              ▼
            </div>
          </button>

          <!-- Respuesta Desplegable -->
          <div 
            v-show="preguntaAbiertaId === item.id"
            :id="`respuesta-${item.id}`"
            class="px-5 sm:px-6 pb-6 pt-1 text-neutral-300 text-xs sm:text-sm font-light leading-relaxed border-t border-white/5 animate-fade-in"
          >
            <p v-html="item.respuesta" class="space-y-2"></p>
          </div>
        </div>
      </div>

    </section>

    <!-- ======================================================== -->
    <!-- 4. TARJETA CTA DE CONTACTO DIRECTO                       -->
    <!-- ======================================================== -->
    <section class="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 w-full" aria-label="Ayuda Adicional">
      <div class="p-8 md:p-10 rounded-3xl bg-gradient-to-br from-neutral-900 via-black to-neutral-900 border border-[#D4AF37]/30 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
        <div class="absolute -right-12 -top-12 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="space-y-2 max-w-xl relative z-10">
          <span class="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.2em] block">💬 {{ t.ctaBadge }}</span>
          <h3 class="text-xl sm:text-2xl font-serif text-white uppercase tracking-wide">
            {{ t.ctaTitle }}
          </h3>
          <p class="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
            {{ t.ctaDesc }}
          </p>
        </div>

        <div class="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto relative z-10">
          <NuxtLink 
            to="/contactos" 
            class="w-full sm:w-auto px-6 py-3.5 bg-white/5 hover:bg-white/10 text-white border border-white/15 hover:border-white/30 font-bold uppercase tracking-widest text-xs rounded-xl transition-all duration-300 text-center"
          >
            {{ t.ctaContactBtn }}
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Pie de Página -->
    <Footer />

  </main>
</template>

<script setup>
// Desactiva el layout global para renderizar la página a medida
definePageMeta({
  layout: false
})

// === 1. IDIOMA GLOBAL Y TEXTOS DE INTERFAZ ===
const idiomaGlobal = useIdiomaGlobal()

const TRADUCCIONES = {
  es: {
    home: 'Inicio',
    breadcrumb: 'Preguntas Frecuentes',
    badge: 'Centro de Ayuda & Respuestas Oficiales',
    title: 'Preguntas Frecuentes',
    subtitle: 'Todo lo que necesitas saber para tu visita, adquisición de arte contemporáneo y experiencias gastronómicas en el emblemático Palacio Nacional de Medellín.',
    searchPlaceholder: 'Escribe tu duda aquí (ej. horarios, metro, precios, fotos, mascotas)...',
    allCategories: 'Todas',
    noResultsTitle: 'No encontramos preguntas que coincidan',
    noResultsDesc: 'Intenta con otras palabras clave o explora por categoría para encontrar lo que necesitas.',
    clearSearchBtn: 'Ver todas las preguntas',
    ctaBadge: 'Atención Personalizada',
    ctaTitle: '¿Tienes alguna duda o solicitud especial?',
    ctaDesc: 'Nuestro equipo de atención al visitante y curaduría de arte está listo para orientarte en todo lo que necesites.',
    ctaContactBtn: 'Formulario de Contacto'
  },
  en: {
    home: 'Home',
    breadcrumb: 'FAQ',
    badge: 'Help Center & Official Answers',
    title: 'Frequently Asked Questions',
    subtitle: 'Everything you need to know for your visit, contemporary art acquisitions, and dining experiences at the iconic Palacio Nacional in Medellin.',
    searchPlaceholder: 'Search your question here (e.g. hours, metro, prices, photos, pets)...',
    allCategories: 'All',
    noResultsTitle: 'No matching questions found',
    noResultsDesc: 'Try different keywords or browse by category to find the information you need.',
    clearSearchBtn: 'View all questions',
    ctaBadge: 'Personalized Support',
    ctaTitle: 'Have a specific inquiry or special request?',
    ctaDesc: 'Our visitor service team and art curatorial staff are ready to assist you with any inquiries.',
    ctaContactBtn: 'Contact Form'
  },
  fr: {
    home: 'Accueil',
    breadcrumb: 'FAQ',
    badge: 'Centre d\'Aide & Réponses Officielles',
    title: 'Foire Aux Questions',
    subtitle: 'Tout ce que vous devez savoir pour votre visite, l\'acquisition d\'œuvres d\'art et les expériences culinaires au Palacio Nacional de Medellín.',
    searchPlaceholder: 'Recherchez votre question (ex. horaires, métro, prix, photos, animaux)...',
    allCategories: 'Toutes',
    noResultsTitle: 'Aucune question correspondante',
    noResultsDesc: 'Essayez d\'autres mots-clés ou parcourez par catégorie pour trouver votre réponse.',
    clearSearchBtn: 'Voir toutes les questions',
    ctaBadge: 'Assistance Personnalisée',
    ctaTitle: 'Vous avez une question particulière ?',
    ctaDesc: 'Notre équipe d\'accueil des visiteurs et de médiation artistique est à votre entière disposition.',
    ctaContactBtn: 'Formulaire de Contact'
  },
  ja: {
    home: 'ホーム',
    breadcrumb: 'よくある質問',
    badge: '公式ヘルプセンター＆回答集',
    title: 'よくあるご質問（FAQ）',
    subtitle: 'メデジン国立宮殿（Palacio Nacional）へのご来館、現代美術作品のご購入、5階での美食体験に関するすべての情報を掲載しています。',
    searchPlaceholder: 'キーワードで検索（例：開館時間、メトロ、価格、写真、ペット）...',
    allCategories: 'すべて',
    noResultsTitle: '該当する質問が見つかりませんでした',
    noResultsDesc: '別のキーワードで検索するか、カテゴリーを選択して探してください。',
    clearSearchBtn: 'すべての質問を表示',
    ctaBadge: '個別サポート',
    ctaTitle: '特別なご相談やご質問がございますか？',
    ctaDesc: '来館案内スタッフおよびアートキュレーターが、お客様のご相談に丁寧に対応いたします。',
    ctaContactBtn: 'お問い合わせフォーム'
  }
}

const NOMBRES_CATEGORIAS = {
  es: {
    visita: 'Visita y Monumento',
    arte: 'Galería de Arte',
    gastronomia: 'Gastronomía y Terraza',
    servicios: 'Servicios y Accesibilidad'
  },
  en: {
    visita: 'Visit & Monument',
    arte: 'Art Gallery',
    gastronomia: 'Dining & Rooftop',
    servicios: 'Facilities & Access'
  },
  fr: {
    visita: 'Visite & Monument',
    arte: 'Galerie d\'Art',
    gastronomia: 'Gastronomie & Terrasse',
    servicios: 'Services & Accès'
  },
  ja: {
    visita: '見学と文化財',
    arte: 'アートギャラリー',
    gastronomia: '飲食＆テラス',
    servicios: '設備とアクセス'
  }
}

// === 2. DICCIONARIO COMPLETO DE PREGUNTAS Y RESPUESTAS (13 PREGUNTAS EN 4 IDIOMAS) ===
const BANCO_PREGUNTAS = {
  es: [
    // VISITA Y MONUMENTO
    {
      id: 1,
      categoria: 'visita',
      pregunta: '¿La entrada al Palacio Nacional tiene algún costo?',
      respuesta: 'La entrada al Palacio Nacional de Medellín es <strong>100% gratuita y libre</strong> para todos los visitantes nacionales y extranjeros. Puedes recorrer libremente sus históricos pasillos neo-románicos y contemplar las galerías de arte sin pagar boleta de ingreso.'
    },
    {
      id: 2,
      categoria: 'visita',
      pregunta: '¿Cuáles son los horarios de atención al público?',
      respuesta: 'El Palacio Nacional abre sus puertas al público <strong>todos los días de 9:00 AM a 7:00 PM</strong>, incluyendo las galerías de arte y los locales gastronómicos del Piso 5.'
    },
    {
      id: 3,
      categoria: 'visita',
      pregunta: '¿Dónde está ubicado y cómo llegar en Metro?',
      respuesta: 'Nos encontramos en la <strong>Carrera 52 # 48-45</strong>, en pleno centro histórico de Medellín (Barrio La Candelaria). Puedes llegar de forma rápida y segura en el Metro de Medellín bajándote en la <strong>Estación Parque Berrío</strong> (Línea A) o en la <strong>Estación San Antonio</strong> (Línea A y B), ambas situadas a menos de 5 minutos caminando.'
    },
    {
      id: 4,
      categoria: 'visita',
      pregunta: '¿Se pueden tomar fotografías dentro del edificio?',
      respuesta: 'Sí, la fotografía turística y personal con teléfonos móviles o cámaras fotográficas está plenamente permitida y bienvenida. Las sesiones fotográficas profesionales, comerciales o de modelaje requieren autorización previa de la administración del Palacio.'
    },
    {
      id: 5,
      categoria: 'visita',
      pregunta: '¿El edificio cuenta con acceso para personas con movilidad reducida?',
      respuesta: 'Sí, el Palacio Nacional cuenta con <strong>rampas de acceso en sus entradas principales y ascensores</strong> que comunican cómodamente todos los niveles, permitiendo a personas en silla de ruedas o con movilidad reducida disfrutar de la arquitectura, las obras de arte y la zona gastronómica.'
    },

    // GALERÍA DE ARTE Y ADQUISICIONES
    {
      id: 6,
      categoria: 'arte',
      pregunta: '¿Las obras de arte expuestas en la galería están a la venta?',
      respuesta: 'Sí, las pinturas y esculturas exhibidas en nuestra <em>Galería de Arte</em> corresponden a creaciones originales de reconocidos artistas contemporáneos y están disponibles para adquisición. Cada obra física incluye su <strong>Certificado de Autenticidad</strong> firmado o avalado por el artista.'
    },
    {
      id: 7,
      categoria: 'arte',
      pregunta: '¿En qué moneda están expresados los precios y cómo se adquiere una obra?',
      respuesta: 'Los precios del catálogo digital están expresados en <strong>dólares estadounidenses (USD)</strong>. Para adquirir una obra, puedes consultar directamente con nuestro equipo mediante el botón de WhatsApp o formulario de contacto; coordinamos la reserva física, medios de pago y entrega segura.'
    },
    {
      id: 8,
      categoria: 'arte',
      pregunta: '¿Realizan envíos nacionales e internacionales de las obras de arte?',
      respuesta: 'Sí, coordinamos envíos asegurados tanto a nivel nacional como internacional. Las piezas cuentan con embalaje profesional especializado de grado museográfico para garantizar su perfecta conservación durante el transporte.'
    },

    // GASTRONOMÍA Y PISO 5
    {
      id: 9,
      categoria: 'gastronomia',
      pregunta: '¿Qué restaurantes y cafés se encuentran en el Palacio Nacional?',
      respuesta: 'En el Piso 5 del Palacio converge una destacada experiencia culinaria: <strong>Chao Café</strong> (café de especialidad colombiano y repostería artesanal), <strong>Chao Pescao</strong> (lo mejor de la cocina de mar y almuerzos ejecutivos de primer nivel) y <strong>Sky Bar</strong> (cócteles de autor y terraza al aire libre con vista panorámica a la ciudad). Puedes consultar las cartas digitales en nuestro <a href="/homegastro" class="text-[#D4AF37] hover:underline font-medium">portal gastronómico</a>.'
    },
    {
      id: 10,
      categoria: 'gastronomia',
      pregunta: '¿Es necesario reservar mesa para el Sky Bar o restaurantes?',
      respuesta: 'La atención general es por orden de llegada. Sin embargo, cada establecimiento gestiona sus reservas de manera directa e independiente. Para grupos especiales o asegurar mesa en la terraza de <strong>Sky Bar</strong>, puedes contactarlos directamente a su <a href="https://wa.me/573212865949?text=Hola,%20me%20gustar%C3%ADa%20hacer%20una%20reserva%20en%20Sky%20Bar" target="_blank" rel="noopener noreferrer" class="text-[#D4AF37] hover:underline font-medium">WhatsApp (+57 321 286 5949)</a>. Para los demás locales, consulta sus menús y canales de contacto en nuestro <a href="/homegastro" class="text-[#D4AF37] hover:underline font-medium">portal gastronómico</a>.'
    },

    // SERVICIOS GENERALES Y SEGURIDAD
    {
      id: 11,
      categoria: 'servicios',
      pregunta: '¿El Palacio Nacional cuenta con parqueadero propio?',
      respuesta: 'Al ser un monumento histórico patrimonial en el corazón peatonalizado de la ciudad, el edificio no cuenta con parqueadero vehicular propio. No obstante, en un radio de menos de dos cuadras existen múltiples <strong>parqueaderos públicos vigilados</strong> disponibles.'
    },
    {
      id: 12,
      categoria: 'servicios',
      pregunta: '¿Se admiten mascotas dentro del edificio (Pet Friendly)?',
      respuesta: 'Sí, el Palacio Nacional es un espacio <strong>Pet Friendly</strong>. Se permite el ingreso de animales de compañía siempre que cuenten con correa, permanezcan junto a sus dueños y se respeten las normas básicas de higiene y convivencia ciudadana.'
    }
  ],

  en: [
    {
      id: 1,
      categoria: 'visita',
      pregunta: 'Is there an admission fee to enter Palacio Nacional?',
      respuesta: 'Admission to Palacio Nacional in Medellin is <strong>100% free</strong> for all domestic and international visitors. You can freely explore its historic Neo-Romanesque corridors and admire the art galleries without an entrance ticket.'
    },
    {
      id: 2,
      categoria: 'visita',
      pregunta: 'What are the opening hours for the public?',
      respuesta: 'Palacio Nacional is open to the public <strong>every day from 9:00 AM to 7:00 PM</strong>, including the art galleries and 5th-floor dining venues.'
    },
    {
      id: 3,
      categoria: 'visita',
      pregunta: 'Where is it located and how do I get there by Metro?',
      respuesta: 'We are located at <strong>Carrera 52 # 48-45</strong>, in downtown Medellin (La Candelaria district). You can easily arrive via the Medellin Metro by getting off at <strong>Parque Berrío Station</strong> (Line A) or <strong>San Antonio Station</strong> (Lines A and B), both less than a 5-minute walk away.'
    },
    {
      id: 4,
      categoria: 'visita',
      pregunta: 'Is photography permitted inside the building?',
      respuesta: 'Yes, personal and tourist photography with smartphones and digital cameras is warmly welcomed. Commercial, professional, or fashion photography shoots require prior administrative clearance.'
    },
    {
      id: 5,
      categoria: 'visita',
      pregunta: 'Is the building accessible for visitors with reduced mobility?',
      respuesta: 'Yes, Palacio Nacional is equipped with <strong>access ramps and modern elevators</strong> connecting all floors, allowing wheelchair users and mobility-impaired visitors to comfortably enjoy the architecture, art, and dining terrace.'
    },
    {
      id: 6,
      categoria: 'arte',
      pregunta: 'Are the artworks displayed in the gallery for sale?',
      respuesta: 'Yes, original paintings and sculptures exhibited in our <em>Art Gallery</em> are available for acquisition. Each piece includes an official <strong>Certificate of Authenticity</strong> issued or endorsed by the artist.'
    },
    {
      id: 7,
      categoria: 'arte',
      pregunta: 'In what currency are prices shown and how are artworks purchased?',
      respuesta: 'Prices in our digital catalog are quoted in <strong>United States Dollars (USD)</strong>. To acquire an artwork, please connect with our curatorial team via WhatsApp or contact form to arrange reserve, secure payment, and delivery.'
    },
    {
      id: 8,
      categoria: 'arte',
      pregunta: 'Do you offer domestic and international artwork shipping?',
      respuesta: 'Yes, we arrange insured domestic and international art freight. Artworks are packaged using professional museum-grade crates to ensure pristine condition upon arrival.'
    },
    {
      id: 9,
      categoria: 'gastronomia',
      pregunta: 'What restaurants and cafes are located in the building?',
      respuesta: 'The 5th floor features an exquisite dining destination: <strong>Chao Café</strong> (Colombian specialty coffee and artisanal pastry), <strong>Chao Pescao</strong> (premium seafood and executive cuisine), and <strong>Sky Bar</strong> (signature cocktails and open-air rooftop city views). You can check their digital menus on our <a href="/homegastro" class="text-[#D4AF37] hover:underline font-medium">dining portal</a>.'
    },
    {
      id: 10,
      categoria: 'gastronomia',
      pregunta: 'Are reservations required for the restaurants or Sky Bar?',
      respuesta: 'Walk-ins are welcomed on a first-come, first-served basis. However, each dining venue manages its reservations directly and independently. For group events or sunset terrace tables at <strong>Sky Bar</strong>, you can contact them directly on <a href="https://wa.me/573212865949?text=Hello,%20I%20would%20like%20to%20make%20a%20reservation%20at%20Sky%20Bar" target="_blank" rel="noopener noreferrer" class="text-[#D4AF37] hover:underline font-medium">WhatsApp (+57 321 286 5949)</a>. For other venues, check their contact details in our <a href="/homegastro" class="text-[#D4AF37] hover:underline font-medium">dining portal</a>.'
    },
    {
      id: 11,
      categoria: 'servicios',
      pregunta: 'Does Palacio Nacional have its own on-site parking lot?',
      respuesta: 'As a protected historical monument located in a pedestrianized central zone, the building does not have private vehicle parking. However, several <strong>supervised public parking lots</strong> operate within a two-block radius.'
    },
    {
      id: 12,
      categoria: 'servicios',
      pregunta: 'Are pets allowed inside the building (Pet Friendly)?',
      respuesta: 'Yes, Palacio Nacional is <strong>Pet Friendly</strong>. Well-behaved pets on a leash are welcomed in public common areas alongside responsible owners.'
    }
  ],

  fr: [
    {
      id: 1,
      categoria: 'visita',
      pregunta: 'L\'entrée au Palacio Nacional est-elle payante ?',
      respuesta: 'L\'accès au Palacio Nacional de Medellín est <strong>100% gratuit et ouvert</strong> à tous les visiteurs. Vous pouvez explorer librement ses couloirs néo-romans et contempler les galeries d\'art sans aucun billet d\'entrée.'
    },
    {
      id: 2,
      categoria: 'visita',
      pregunta: 'Quels sont les horaires d\'ouverture au public ?',
      respuesta: 'Le Palacio Nacional est ouvert au public <strong>tous les jours de 9h00 à 19h00</strong>, y compris les galeries d\'art et les établissements gastronomiques du 5ème étage.'
    },
    {
      id: 3,
      categoria: 'visita',
      pregunta: 'Où se situe le monument et comment y accéder en métro ?',
      respuesta: 'Nous sommes situés à <strong>Carrera 52 # 48-45</strong>, au cœur historique de Medellín. Vous pouvez y accéder facilement en métro en descendant à la <strong>station Parque Berrío</strong> (Ligne A) ou à la <strong>station San Antonio</strong> (Lignes A et B), toutes deux situées à moins de 5 minutes à pied.'
    },
    {
      id: 4,
      categoria: 'visita',
      pregunta: 'Est-il permis de prendre des photos dans le bâtiment ?',
      respuesta: 'Oui, les photographies personnelles et touristiques sont les bienvenues. Les séances photo commerciales ou professionnelles nécessitent une autorisation administrative préalable.'
    },
    {
      id: 5,
      categoria: 'visita',
      pregunta: 'Le bâtiment est-il accessible aux personnes à mobilité réduite ?',
      respuesta: 'Oui, le Palacio Nacional dispose de <strong>rampes d\'accès et d\'ascenseurs</strong> modernes reliant tous les étages, permettant aux personnes à mobilité réduite de profiter pleinement des expositions et de la terrasse gastronomique.'
    },
    {
      id: 6,
      categoria: 'arte',
      pregunta: 'Les œuvres d\'art exposées sont-elles à vendre ?',
      respuesta: 'Oui, les peintures et sculptures présentées dans notre <em>Galerie d\'Art</em> sont disponibles à l\'achat. Chaque œuvre physique est accompagnée d\'un <strong>Certificat d\'Authenticité</strong> délivré ou approuvé par l\'artiste.'
    },
    {
      id: 7,
      categoria: 'arte',
      pregunta: 'En quelle devise les prix sont-ils affichés et comment acheter ?',
      respuesta: 'Les prix de notre catalogue numérique sont indiqués en <strong>dollars américains (USD)</strong>. Pour acquérir une œuvre, contactez notre équipe via WhatsApp ou le formulaire pour organiser le paiement et la livraison sécurisée.'
    },
    {
      id: 8,
      categoria: 'arte',
      pregunta: 'Proposez-vous des expéditions nationales et internationales d\'œuvres ?',
      respuesta: 'Oui, nous coordonnons des transports d\'art sécurisés et assurés à l\'échelle nationale et internationale avec un emballage professionnel de qualité muséale.'
    },
    {
      id: 9,
      categoria: 'gastronomia',
      pregunta: 'Quels restaurants et cafés se trouvent dans le Palais ?',
      respuesta: 'Le 5ème étage réunit une scène gastronomique renommée : <strong>Chao Café</strong> (café de spécialité colombien et pâtisseries artisanales), <strong>Chao Pescao</strong> (cuisine de la mer haut de gamme) et <strong>Sky Bar</strong> (cocktails signature sur terrasse panoramique). Découvrez leurs cartes sur notre <a href="/homegastro" class="text-[#D4AF37] hover:underline font-medium">portail gastronomique</a>.'
    },
    {
      id: 10,
      categoria: 'gastronomia',
      pregunta: 'Faut-il réserver pour les restaurants ou le Sky Bar ?',
      respuesta: 'L\'accueil se fait généralement selon l\'ordre d\'arrivée. Toutefois, chaque établissement gère ses réservations de manière autonome. Pour des événements ou réserver une table en terrasse au <strong>Sky Bar</strong>, contactez directement leur ligne <a href="https://wa.me/573212865949?text=Bonjour,%20je%20souhaite%20r%C3%A9server%20une%20table%20au%20Sky%20Bar" target="_blank" rel="noopener noreferrer" class="text-[#D4AF37] hover:underline font-medium">WhatsApp (+57 321 286 5949)</a>. Pour les autres locaux, consultez notre <a href="/homegastro" class="text-[#D4AF37] hover:underline font-medium">portail gastronomique</a>.'
    },
    {
      id: 11,
      categoria: 'servicios',
      pregunta: 'Le Palais dispose-t-il d\'un parking privé ?',
      respuesta: 'En tant que monument historique situé dans une zone piétonne, l\'édifice ne dispose pas de parking privé, mais plusieurs <strong>parkings publics surveillés</strong> se trouvent à moins de deux rues.'
    },
    {
      id: 12,
      categoria: 'servicios',
      pregunta: 'Les animaux de compagnie sont-ils acceptés (Pet Friendly) ?',
      respuesta: 'Oui, le Palacio Nacional est <strong>Pet Friendly</strong>. Les animaux tenus en laisse sont acceptés dans les espaces communs sous la garde responsable de leurs propriétaires.'
    }
  ],

  ja: [
    {
      id: 1,
      categoria: 'visita',
      pregunta: 'メデジン国立宮殿の入場料はいくらですか？',
      respuesta: 'メデジン国立宮殿（Palacio Nacional）への入場は、国内外のすべてのご来館者様を対象に<strong>完全無料（0円）</strong>です。入場券を購入することなく、歴史的なネオ・ロマネスク様式の回廊や美術展示を自由にご見学いただけます。'
    },
    {
      id: 2,
      categoria: 'visita',
      pregunta: '開館時間と定休日を教えてください。',
      respuesta: '開館時間は<strong>年中無休（毎日）午前9:00～午後7:00</strong>です。美術ギャラリーおよび5階の飲食店も同様の営業時間で営業しております。'
    },
    {
      id: 3,
      categoria: 'visita',
      pregunta: '所在地とメトロでのアクセス方法を教えてください。',
      respuesta: '所在地は<strong>Carrera 52 # 48-45</strong>（メデジン中心街・ラ・カンデラリア地区）です。メデジン・メトロA線の<strong>Parque Berrío駅</strong>またはA・B線の<strong>San Antonio駅</strong>から徒歩5分以内と、非常にアクセスしやすい立地にございます。'
    },
    {
      id: 4,
      categoria: 'visita',
      pregunta: '館内での写真撮影は許可されていますか？',
      respuesta: 'はい、スマートフォンやデジタルカメラによる観光・私的な記念撮影は自由にお楽しみいただけます。商用目的やモデル撮影などの専門的な撮影につきましては、事前に管理事務所の承認が必要となります。'
    },
    {
      id: 5,
      categoria: 'visita',
      pregunta: '車椅子や足の不自由な方向けのバリアフリー設備はありますか？',
      respuesta: 'はい、主要エントランスに<strong>スロープを完備し、全フロアへアクセスできるエレベーター</strong>を設置しております。車椅子をご利用の方も安心して歴史建築やギャラリー、5階飲食フロアをお楽しみいただけます。'
    },
    {
      id: 6,
      categoria: 'arte',
      pregunta: '展示されている美術作品は購入できますか？',
      respuesta: 'はい、<em>アートギャラリー（Galeria de Arte）</em>に展示されている絵画や彫刻はすべてご購入可能です。作品には作家自身が署名・承認した正式な<strong>真正性証明書</strong>が付属します。'
    },
    {
      id: 7,
      categoria: 'arte',
      pregunta: '作品の表示価格の通貨と購入手続きについて教えてください。',
      respuesta: 'デジタルカタログ内の作品価格は<strong>米ドル（USD）</strong>で表示されています。ご購入をご希望の際は、WhatsAppまたはお問い合わせフォームよりキュレーターにご連絡いただき、現物確認と安全なお支払い・納品の手続きをご案内いたします。'
    },
    {
      id: 8,
      categoria: 'arte',
      pregunta: '作品の国内外への配送は対応していますか？',
      respuesta: 'はい、コロンビア国内および世界各国への保険付き専門輸送を手配しております。美術館品質の厳重な梱包により、作品を安全にお届けいたします。'
    },
    {
      id: 9,
      categoria: 'gastronomia',
      pregunta: '館内にはどのようなレストランやカフェがありますか？',
      respuesta: '宮殿5階には、コロンビアの厳選スペシャルティコーヒーを提供する<strong>Chao Café</strong>、極上のシーフードと本格料理が味わえる<strong>Chao Pescao</strong>、メデジンの街を一望できるルーフトップバー<strong>Sky Bar</strong>がございます。各店のデジタルメニューは<a href="/homegastro" class="text-[#D4AF37] hover:underline font-medium">グルメポータル</a>でご覧いただけます。'
    },
    {
      id: 10,
      categoria: 'gastronomia',
      pregunta: 'レストランやSky Barの席予約は必要ですか？',
      respuesta: '通常は予約なしでご案内可能ですが、各店舗が個別に予約を管理しております。特に<strong>Sky Bar</strong>のテラス席や団体様のご予約は、直接<a href="https://wa.me/573212865949?text=Hello,%20I%20would%20like%20to%20make%20a%20reservation%20at%20Sky%20Bar" target="_blank" rel="noopener noreferrer" class="text-[#D4AF37] hover:underline font-medium">公式WhatsApp（+57 321 286 5949）</a>へご連絡いただくことをおすすめします。その他の店舗情報は<a href="/homegastro" class="text-[#D4AF37] hover:underline font-medium">グルメポータル</a>をご確認ください。'
    },
    {
      id: 11,
      categoria: 'servicios',
      pregunta: '専用の駐車場はありますか？',
      respuesta: '歩行者専用の歴史的保護地区に位置しているため、建物専用の駐車場はございません。近隣2ブロック以内に複数の<strong>警備員常駐有料駐車場</strong>がございますのでご利用ください。'
    },
    {
      id: 12,
      categoria: 'servicios',
      pregunta: 'ペットを連れて入館できますか（Pet Friendly）？',
      respuesta: 'はい、メデジン国立宮殿は<strong>ペット同伴可能（Pet Friendly）</strong>です。リードを着用し、飼い主様の責任ある管理のもとで共有スペースをご見学いただけます。'
    }
  ]
}

// === 3. ESTADO REACTIVO Y FILTRADO INTELIGENTE ===
const t = computed(() => TRADUCCIONES[idiomaGlobal.value] || TRADUCCIONES.es)
const nombresCat = computed(() => NOMBRES_CATEGORIAS[idiomaGlobal.value] || NOMBRES_CATEGORIAS.es)

const busquedaTexto = ref('')
const categoriaSeleccionada = ref('todas')
const preguntaAbiertaId = ref(null)

// Lista de preguntas en el idioma activo
const preguntasActivas = computed(() => {
  return BANCO_PREGUNTAS[idiomaGlobal.value] || BANCO_PREGUNTAS.es
})

// Categorías disponibles con conteo reactivo
const categoriasDisponibles = computed(() => {
  const todas = preguntasActivas.value
  return [
    { id: 'todas', nombre: t.value.allCategories, icono: '🏛️', total: todas.length },
    { id: 'visita', nombre: nombresCat.value.visita, icono: '📍', total: todas.filter(p => p.categoria === 'visita').length },
    { id: 'arte', nombre: nombresCat.value.arte, icono: '🎨', total: todas.filter(p => p.categoria === 'arte').length },
    { id: 'gastronomia', nombre: nombresCat.value.gastronomia, icono: '🍽️', total: todas.filter(p => p.categoria === 'gastronomia').length },
    { id: 'servicios', nombre: nombresCat.value.servicios, icono: '🛡️', total: todas.filter(p => p.categoria === 'servicios').length },
  ]
})

const obtenerNombreCategoria = (catId) => {
  return nombresCat.value[catId] || catId
}

// Filtrado combinado: Búsqueda por texto + Categoría
const preguntasFiltradas = computed(() => {
  let resultado = preguntasActivas.value

  // Filtro por categoría
  if (categoriaSeleccionada.value !== 'todas') {
    resultado = resultado.filter(p => p.categoria === categoriaSeleccionada.value)
  }

  // Filtro por búsqueda de texto
  const q = busquedaTexto.value.toLowerCase().trim()
  if (q) {
    resultado = resultado.filter(p => 
      p.pregunta.toLowerCase().includes(q) || 
      p.respuesta.toLowerCase().includes(q)
    )
  }

  return resultado
})

const alternarPregunta = (id) => {
  preguntaAbiertaId.value = preguntaAbiertaId.value === id ? null : id
}

const limpiarFiltros = () => {
  busquedaTexto.value = ''
  categoriaSeleccionada.value = 'todas'
}

// Abrir la primera pregunta por defecto para guiar visualmente al usuario
onMounted(() => {
  if (preguntasActivas.value.length > 0) {
    preguntaAbiertaId.value = preguntasActivas.value[0].id
  }
})

// === 4. SEO DE MÁXIMO CTR: METADATOS Y RICH SNIPPETS FAQPAGE (SCHEMA.ORG) ===
useSeoMeta({
  title: 'Preguntas Frecuentes (FAQ) | Palacio Nacional Medellín',
  description: 'Respuestas oficiales sobre horarios de visita, entrada gratuita, cómo llegar en Metro, compra de obras de arte contemporáneo y restaurantes en el Palacio Nacional Medellín.',
  canonical: 'https://palacionacionalmedellin.com/faq',
  robots: 'index, follow, max-image-preview:large, max-snippet:-1',
  
  // Open Graph
  ogTitle: 'Preguntas Frecuentes (FAQ) | Palacio Nacional Medellín',
  ogDescription: 'Todo lo que necesitas saber para tu visita, adquisición de arte y gastronomía en el emblemático monumento de Medellín.',
  ogImage: 'https://palacionacionalmedellin.com/logon.png',
  ogUrl: 'https://palacionacionalmedellin.com/faq',
  ogType: 'website',
  ogLocale: 'es_CO',
  
  // Twitter Cards
  twitterCard: 'summary_large_image',
  twitterTitle: 'Preguntas Frecuentes (FAQ) | Palacio Nacional Medellín',
  twitterDescription: 'Todo lo que necesitas saber para tu visita al Palacio Nacional Medellín.',
  twitterImage: 'https://palacionacionalmedellin.com/logon.png'
})

// Datos Estructurados Schema.org FAQPage (Rich Snippets con desplegables en Google)
useHead(() => {
  // Construir la lista de entidades Question y Answer para Google
  const mainEntity = (BANCO_PREGUNTAS.es || []).map(p => ({
    "@type": "Question",
    "name": p.pregunta,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": p.respuesta.replace(/<[^>]*>?/gm, '') // Limpiar tags HTML para el JSON-LD puro
    }
  }))

  return {
    link: [
      { rel: 'canonical', href: 'https://palacionacionalmedellin.com/faq' }
    ],
    script: [
      {
        type: 'application/ld+json',
        innerHTML: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "name": "Preguntas Frecuentes del Palacio Nacional Medellín",
          "url": "https://palacionacionalmedellin.com/faq",
          "description": "Centro oficial de preguntas y respuestas sobre el monumento histórico, catálogo de arte y gastronomía del Palacio Nacional Medellín.",
          "inLanguage": ["es-CO", "en", "fr", "ja"],
          "mainEntity": mainEntity,
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Inicio",
                "item": "https://palacionacionalmedellin.com/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Preguntas Frecuentes",
                "item": "https://palacionacionalmedellin.com/faq"
              }
            ]
          }
        })
      }
    ]
  }
})
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>

