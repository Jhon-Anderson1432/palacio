<template>
  <main
    class="min-h-screen bg-[#050505] text-white font-sans flex flex-col selection:bg-[#D4AF37] selection:text-black antialiased relative overflow-x-hidden"
    role="main"
    aria-label="Contacto y Ubicación - Palacio Nacional Medellín"
  >
    <!-- Iluminación ambiental sutil -->
    <div class="fixed top-0 left-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[140px] pointer-events-none z-0"></div>
    <div class="fixed bottom-1/4 right-10 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-[160px] pointer-events-none z-0"></div>

    <!-- Barra de Navegación -->
    <Navbar :fondoTranslucido="true" />

    <!-- 1. HERO HEADER & MIGAS DE PAN -->
    <ContactoHero :t="t" />

    <!-- 2. TARJETAS DE CONTACTO RÁPIDO -->
    <ContactoCanales :t="t" />

    <!-- 3. BLOQUE PRINCIPAL: FORMULARIO INTELIGENTE + UBICACIÓN -->
    <section class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full" aria-label="Formulario de contacto y mapa">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <ContactoFormulario :t="t" />
        <ContactoMapa :t="t" :idiomaGlobal="idiomaGlobal" />
      </div>
    </section>

    <Footer />
  </main>
</template>

<script setup>
import ContactoHero from '~/components/contacto/ContactoHero.vue'
import ContactoCanales from '~/components/contacto/ContactoCanales.vue'
import ContactoFormulario from '~/components/contacto/ContactoFormulario.vue'
import ContactoMapa from '~/components/contacto/ContactoMapa.vue'

definePageMeta({
  layout: false
})

// === 1. ESTADO GLOBAL E IDIOMA ===
const idiomaGlobal = useIdiomaGlobal()

const textos = {
  es: {
    seoTitle: 'Contacto y Ubicación | Palacio Nacional Medellín',
    seoDesc: 'Encuentra la ubicación oficial del Palacio Nacional en la Carrera 52 # 48-45, centro de Medellín. Escríbenos vía WhatsApp o correo y planea tu visita.',
    seoOgTitle: '📍 Contacto y Ubicación | Palacio Nacional Medellín',
    seoOgDesc: 'Comunícate con el Palacio Nacional en Medellín, conoce cómo llegar en Metro y planea tu recorrido por nuestras galerías de arte y gastronomía.',
    title: 'Contacto y Ubicación',
    subtitle: 'Estamos a su disposición para orientar su visita cultural, resolver consultas sobre obras de arte o coordinar eventos institucionales en el corazón de Medellín.',

    channelWhatsappLabel: 'WhatsApp Administrativo',
    whatsappOnlyNote: 'Solo WhatsApp',
    whatsappSub: 'Canal oficial de atención escrita (no llamadas)',
    channelEmailLabel: 'Correo Institucional',
    emailSub: 'Consultas formales, prensa y eventos',
    channelHoursLabel: 'Horario de Visita',
    hoursMain: 'Diario: 9:00 AM – 7:00 PM',
    hoursEventSub: 'Último jueves hasta 12:00 AM (Ver eventos)',
    channelAddressLabel: 'Sede Principal',
    locationCity: 'Carrera 52 # 48-45, La Candelaria, Medellín',
    copyBtn: 'Copiar',
    copiedLabel: 'Copiado',
    actionWrite: 'Abrir',

    formEyebrow: 'Canal Directo',
    writeUs: 'Escríbanos',
    topicLabel: 'Motivo de su consulta',
    topics: {
      visita: { label: 'Visitas y Horarios', icono: '🏛️' },
      arte: { label: 'Galería y Obras', icono: '🎨' },
      eventos: { label: 'Eventos / Noche de Galerías', icono: '🌙' },
      gastronomia: { label: 'Gastronomía Piso 5', icono: '🍽️' },
      otro: { label: 'Otro / Institucional', icono: '✉️' }
    },

    formNameLabel: 'Nombre Completo',
    formNamePlaceholder: 'Ej. Laura Gómez',
    formEmailLabel: 'Correo Electrónico',
    formEmailPlaceholder: 'correo@ejemplo.com',
    formMsgLabel: 'Su Mensaje',
    formMsgPlaceholder: 'Cuéntenos cómo podemos ayudarle en su visita o solicitud...',
    errName: 'Por favor ingresa tu nombre (mínimo 2 caracteres).',
    errEmail: 'Por favor ingresa un correo electrónico válido.',
    errMsg: 'Por favor escribe un mensaje de al menos 10 caracteres.',
    submitWhatsappBtn: 'Enviar por WhatsApp',
    submitEmailBtn: 'Enviar por Correo',
    successWhatsapp: '¡Solicitud lista! Se abrió WhatsApp con su mensaje.',
    successEmail: '¡Solicitud lista! Se abrió su aplicación de correo.',
    clearBtn: 'Limpiar',
    waGreeting: 'Hola Palacio Nacional, les escribo desde la web.',
    waReasonLabel: 'Motivo',
    waNameLabel: 'Nombre',
    waEmailLabel: 'Correo',
    waMessageLabel: 'Mensaje',
    emailSubjectPrefix: 'Contacto Web Palacio Nacional',

    visitEyebrow: 'Cómo Llegar',
    visitUs: 'Visítenos',
    mapTitle: 'Mapa de ubicación del Palacio Nacional Medellín en Carrera 52 # 48-45',
    openMapsBtn: 'Abrir en Google Maps',
    arrivalGuideTitle: 'Información Práctica de Llegada',
    arrivalMetroTitle: 'Metro de Medellín',
    arrivalMetroDesc: 'Estación Parque Berrío (Línea A) o Estación San Antonio (Líneas A y B), a menos de 5 minutos caminando.',
    arrivalParkTitle: 'Parqueaderos Cercanos',
    arrivalParkDesc: 'Edificio peatonalizado; encontrará parqueaderos públicos vigilados a menos de 2 cuadras a la redonda.',
    arrivalAccessTitle: 'Entrada Libre y Accesibilidad',
    arrivalAccessDesc: 'Ingreso 100% gratuito. Contamos con rampas de acceso y ascensores hacia los 5 pisos.'
  },
  en: {
    seoTitle: 'Contact & Location | Palacio Nacional Medellín',
    seoDesc: 'Find Palacio Nacional official location at Carrera 52 # 48-45 in downtown Medellin. Reach out via WhatsApp or email and plan your visit.',
    seoOgTitle: '📍 Contact & Location | Palacio Nacional Medellín',
    seoOgDesc: 'Get in touch with Palacio Nacional in Medellin, find Metro directions, and plan your visit to our art galleries and Floor 5 dining.',
    title: 'Contact & Location',
    subtitle: 'We are at your disposal to guide your cultural visit, assist with contemporary art inquiries, or coordinate institutional events in downtown Medellin.',

    channelWhatsappLabel: 'Administrative WhatsApp',
    whatsappOnlyNote: 'WhatsApp Only',
    whatsappSub: 'Official written support channel (no voice calls)',
    channelEmailLabel: 'Official Email',
    emailSub: 'Formal inquiries, press, and events',
    channelHoursLabel: 'Opening Hours',
    hoursMain: 'Daily: 9:00 AM – 7:00 PM',
    hoursEventSub: 'Last Thursday open until 12:00 AM (See events)',
    channelAddressLabel: 'Main Address',
    locationCity: 'Carrera 52 # 48-45, La Candelaria, Medellin',
    copyBtn: 'Copy',
    copiedLabel: 'Copied',
    actionWrite: 'Open',

    formEyebrow: 'Direct Message',
    writeUs: 'Write to Us',
    topicLabel: 'Inquiry Topic',
    topics: {
      visita: { label: 'Visits & Hours', icono: '🏛️' },
      arte: { label: 'Art Gallery & Pieces', icono: '🎨' },
      eventos: { label: 'Events / Gallery Night', icono: '🌙' },
      gastronomia: { label: 'Floor 5 Dining', icono: '🍽️' },
      otro: { label: 'Other / Institutional', icono: '✉️' }
    },

    formNameLabel: 'Full Name',
    formNamePlaceholder: 'e.g. Jane Doe',
    formEmailLabel: 'Email Address',
    formEmailPlaceholder: 'you@example.com',
    formMsgLabel: 'Your Message',
    formMsgPlaceholder: 'Let us know how we can help with your visit or inquiry...',
    errName: 'Please enter your name (at least 2 characters).',
    errEmail: 'Please enter a valid email address.',
    errMsg: 'Please write a message of at least 10 characters.',
    submitWhatsappBtn: 'Send via WhatsApp',
    submitEmailBtn: 'Send via Email',
    successWhatsapp: 'Message ready! WhatsApp opened with your details.',
    successEmail: 'Message ready! Your email app has been opened.',
    clearBtn: 'Clear',
    waGreeting: 'Hello Palacio Nacional, I am contacting you from the website.',
    waReasonLabel: 'Topic',
    waNameLabel: 'Name',
    waEmailLabel: 'Email',
    waMessageLabel: 'Message',
    emailSubjectPrefix: 'Palacio Nacional Web Inquiry',

    visitEyebrow: 'Directions',
    visitUs: 'Visit Us',
    mapTitle: 'Palacio Nacional Medellin map at Carrera 52 # 48-45',
    openMapsBtn: 'Open in Google Maps',
    arrivalGuideTitle: 'Practical Visitor Guide',
    arrivalMetroTitle: 'Medellin Metro',
    arrivalMetroDesc: 'Parque Berrío Station (Line A) or San Antonio Station (Lines A & B), less than a 5-minute walk.',
    arrivalParkTitle: 'Nearby Parking',
    arrivalParkDesc: 'Pedestrian historic district with several guarded public parking lots within 2 blocks.',
    arrivalAccessTitle: 'Free Entry & Accessibility'
  },
  fr: {
    seoTitle: 'Contact et Localisation | Palacio Nacional Medellín',
    seoDesc: 'Retrouvez le Palacio Nacional à Carrera 52 # 48-45, centre de Medellín. Écrivez-nous via WhatsApp ou email pour préparer votre visite.',
    seoOgTitle: '📍 Contact et Localisation | Palacio Nacional Medellín',
    seoOgDesc: 'Contactez le Palacio Nacional de Medellín, consultez l\'accès en métro et planifiez votre visite culturelle et gastronomique.',
    title: 'Contact et Localisation',
    subtitle: 'Nous sommes à votre entière disposition pour orienter votre visite culturelle, répondre aux demandes sur les œuvres d\'art ou coordonner vos événements.',

    channelWhatsappLabel: 'WhatsApp Administratif',
    whatsappOnlyNote: 'WhatsApp Uniquement',
    whatsappSub: 'Canal officiel par message écrit (pas d\'appels)',
    channelEmailLabel: 'Email Officiel',
    emailSub: 'Demandes formelles, presse et événements',
    channelHoursLabel: 'Horaires d\'Ouverture',
    hoursMain: 'Tous les jours : 9h00 – 19h00',
    hoursEventSub: 'Dernier jeudi jusqu\'à minuit (Voir événements)',
    channelAddressLabel: 'Adresse Principale',
    locationCity: 'Carrera 52 # 48-45, La Candelaria, Medellín',
    copyBtn: 'Copier',
    copiedLabel: 'Copié',
    actionWrite: 'Ouvrir',

    formEyebrow: 'Message Direct',
    writeUs: 'Écrivez-nous',
    topicLabel: 'Objet de votre demande',
    topics: {
      visita: { label: 'Visites & Horaires', icono: '🏛️' },
      arte: { label: 'Galerie & Œuvres', icono: '🎨' },
      eventos: { label: 'Événements / Nuit des Galeries', icono: '🌙' },
      gastronomia: { label: 'Gastronomie 5e Étage', icono: '🍽️' },
      otro: { label: 'Autre / Institutionnel', icono: '✉️' }
    },

    formNameLabel: 'Nom Complet',
    formNamePlaceholder: 'Ex. Camille Laurent',
    formEmailLabel: 'Adresse Email',
    formEmailPlaceholder: 'vous@exemple.com',
    formMsgLabel: 'Votre Message',
    formMsgPlaceholder: 'Expliquez-nous comment nous pouvons vous aider...',
    errName: 'Veuillez saisir votre nom (minimum 2 caractères).',
    errEmail: 'Veuillez saisir une adresse email valide.',
    errMsg: 'Veuillez rédiger un message d\'au moins 10 caractères.',
    submitWhatsappBtn: 'Envoyer via WhatsApp',
    submitEmailBtn: 'Envoyer par Email',
    successWhatsapp: 'Demande prête ! WhatsApp s\'est ouvert avec votre message.',
    successEmail: 'Demande prête ! Votre messagerie s\'est ouverte.',
    clearBtn: 'Effacer',
    waGreeting: 'Bonjour Palacio Nacional, je vous écris depuis le site web.',
    waReasonLabel: 'Objet',
    waNameLabel: 'Nom',
    waEmailLabel: 'Email',
    waMessageLabel: 'Message',
    emailSubjectPrefix: 'Contact Web Palacio Nacional',

    visitEyebrow: 'Comment Venir',
    visitUs: 'Rendez-nous Visite',
    mapTitle: 'Carte du Palacio Nacional Medellín à Carrera 52 # 48-45',
    openMapsBtn: 'Ouvrir dans Google Maps',
    arrivalGuideTitle: 'Guide Pratique d\'Accès',
    arrivalMetroTitle: 'Métro de Medellín',
    arrivalMetroDesc: 'Stations Parque Berrío (Ligne A) et San Antonio (Lignes A et B) à moins de 5 minutes à pied.',
    arrivalParkTitle: 'Parkings à Proximité',
    arrivalParkDesc: 'Zone historique piétonne entourée de parkings publics surveillés à moins de deux pâtés de maisons.',
    arrivalAccessTitle: 'Entrée Libre & Accessibilité',
    arrivalAccessDesc: 'Accès 100% gratuit. Rampes d\'accès et ascenseurs desservant les 5 étages.'
  },
  ja: {
    seoTitle: 'お問い合わせ・アクセス | メデジン国立宮殿',
    seoDesc: 'メデジン中心部（Carrera 52 # 48-45）にあるメデジン国立宮殿のお問い合わせ・アクセスページ。WhatsAppまたはメールでお気軽にご連絡ください。',
    seoOgTitle: '📍 お問い合わせ・アクセス | メデジン国立宮殿',
    seoOgDesc: 'メデジン国立宮殿へのアクセス、メトロ最寄り駅、アートギャラリーや5階レストランに関するお問い合わせはこちらから。',
    title: 'お問い合わせ・アクセス',
    subtitle: '文化見学のご案内、現代アート作品のご相談、各種イベントに関するお問い合わせを心よりお待ちしております。',

    channelWhatsappLabel: '公式管理窓口 WhatsApp',
    whatsappOnlyNote: 'WhatsApp専用',
    whatsappSub: 'テキストメッセージ専用窓口（音声通話不可）',
    channelEmailLabel: '公式メールアドレス',
    emailSub: '取材・イベント・一般のお問い合わせ',
    channelHoursLabel: '開館時間',
    hoursMain: '毎日：9:00 AM – 7:00 PM',
    hoursEventSub: '毎月最終木曜は深夜0時まで延長（イベント詳細）',
    channelAddressLabel: '所在地',
    locationCity: 'Carrera 52 # 48-45, La Candelaria, Medellín',
    copyBtn: 'コピー',
    copiedLabel: 'コピー済',
    actionWrite: '開く',

    formEyebrow: 'ダイレクト送信',
    writeUs: 'メッセージを送る',
    topicLabel: 'お問い合わせ内容',
    topics: {
      visita: { label: '見学・開館時間', icono: '🏛️' },
      arte: { label: 'ギャラリー・作品購入', icono: '🎨' },
      eventos: { label: 'ギャラリー・ナイト', icono: '🌙' },
      gastronomia: { label: '5階レストラン予約', icono: '🍽️' },
      otro: { label: 'その他のお問い合わせ', icono: '✉️' }
    },

    formNameLabel: 'お名前',
    formNamePlaceholder: '例：山田 太郎',
    formEmailLabel: 'メールアドレス',
    formEmailPlaceholder: 'you@example.com',
    formMsgLabel: 'メッセージ内容',
    formMsgPlaceholder: 'ご質問やご要望をお気軽にご記入ください...',
    errName: 'お名前を2文字以上でご入力ください。',
    errEmail: '有効なメールアドレスをご入力ください。',
    errMsg: 'メッセージは10文字以上でご入力ください。',
    submitWhatsappBtn: 'WhatsAppで送信',
    submitEmailBtn: 'メールで送信',
    successWhatsapp: '準備が完了しました。WhatsAppが開きました。',
    successEmail: '準備が完了しました。メールアプリが開きました。',
    clearBtn: 'リセット',
    waGreeting: 'メデジン国立宮殿様、ウェブサイトよりお問い合わせいたします。',
    waReasonLabel: '用件',
    waNameLabel: 'お名前',
    waEmailLabel: 'メール',
    waMessageLabel: '内容',
    emailSubjectPrefix: 'Palacio Nacional Webお問い合わせ',

    visitEyebrow: 'アクセス案内',
    visitUs: 'ご訪問案内',
    mapTitle: 'メデジン国立宮殿 地図（Carrera 52 # 48-45）',
    openMapsBtn: 'Googleマップで経路を見る',
    arrivalGuideTitle: 'ご来館インフォメーション',
    arrivalMetroTitle: 'メデジン・メトロ最寄り駅',
    arrivalMetroDesc: 'Parque Berrío駅（A線）またはSan Antonio駅（A・B線）から徒歩5分以内です。',
    arrivalParkTitle: '近隣駐車場',
    arrivalParkDesc: '建物周辺は歩行者天国ですが、2ブロック圏内に複数の有料・警備付き駐車場がございます。',
    arrivalAccessTitle: '入場無料・バリアフリー',
    arrivalAccessDesc: '入館料は完全無料です。スロープおよび全5階対応のエレベーターを完備しています。'
  }
}

const t = computed(() => textos[idiomaGlobal.value] || textos.es)

// === 2. SEO REACTIVO Y SCHEMA.ORG ===
useSeoMeta({
  title: () => t.value.seoTitle,
  description: () => t.value.seoDesc,
  robots: 'index, follow, max-image-preview:large, max-snippet:-1',
  ogTitle: () => t.value.seoOgTitle,
  ogDescription: () => t.value.seoOgDesc,
  ogImage: 'https://palacionacionalmedellin.com/logon.png',
  ogUrl: 'https://palacionacionalmedellin.com/contactos',
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: () => t.value.seoTitle,
  twitterDescription: () => t.value.seoOgDesc,
  twitterImage: 'https://palacionacionalmedellin.com/logon.png'
})

useHead({
  link: [
    { rel: 'canonical', href: 'https://palacionacionalmedellin.com/contactos' }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "TouristAttraction",
        "name": "Palacio Nacional Medellín",
        "url": "https://palacionacionalmedellin.com/contactos",
        "image": "https://palacionacionalmedellin.com/logon.png",
        "description": "Monumento histórico y centro cultural en Medellín dedicado al arte contemporáneo, patrimonio arquitectónico y gastronomía.",
        "isAccessibleForFree": true,
        "hasMap": "https://www.google.com/maps/search/?api=1&query=Palacio+Nacional%2C+Carrera+52+%23+48-45%2C+Medell%C3%ADn",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Carrera 52 # 48-45",
          "addressLocality": "Medellín",
          "addressRegion": "Antioquia",
          "postalCode": "050010",
          "addressCountry": "CO"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": 6.25184,
          "longitude": -75.56359
        },
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday"
            ],
            "opens": "09:00",
            "closes": "19:00"
          }
        ],
        "contactPoint": {
          "@type": "ContactPoint",
          "telephone": "+57-311-639-0177",
          "email": "ccpalacional@gmail.com",
          "contactType": "customer service",
          "availableLanguage": ["Spanish", "English", "French", "Japanese"]
        },
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
              "name": "Contacto",
              "item": "https://palacionacionalmedellin.com/contactos"
            }
          ]
        }
      })
    }
  ]
})
</script>
