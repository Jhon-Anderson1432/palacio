// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/supabase', '@pinia/nuxt', '@nuxt/image', "@nuxtjs/seo"],

  // ==========================================
  // 1. CONFIGURACIÓN DEL DOMINIO PARA SEO
  // ==========================================
  site: {
    url: 'https://palacionacionalmedellin.com',
    name: 'Palacio Nacional Medellín',
    indexable: true // Garantiza que el servidor permita la indexación pública
  },

  // ==========================================
  // 2. EL BÚNKER DE SEGURIDAD (Route Rules)
  // Borra estas rutas del sitemap y bloquea a Google a nivel de servidor
  // ==========================================
  routeRules: {
    '/adminpanel02402110': { index: false },
    '/LoginAdmin': { index: false },
    '/terminal-pos': { index: false },
    '/login-meseras': { index: false },
    '/vigilante-scan': { index: false },
    '/confirm': { index: false },
    '/api/**': { index: false } // Oculta todos los endpoints de datos crudos
  },

  // ==========================================
  // 3. CONFIGURACIÓN DEL SITEMAP DINÁMICO
  // ==========================================
  sitemap: {
    sources: [
      '/api/sitemap-rutas'
    ],
    exclude: [
      '/adminpanel02402110',
      '/LoginAdmin',
      '/terminal-pos',
      '/login-meseras',
      '/vigilante-scan',
      '/confirm'
    ]
  },

  // ==========================================
  // 4. CONFIGURACIÓN DEL ROBOTS.TXT (El Guardián)
  // ==========================================
  robots: {
    disallow: [
      '/adminpanel02402110',
      '/LoginAdmin',
      '/terminal-pos',
      '/login-meseras',
      '/vigilante-scan',
      '/confirm',
      '/api' 
    ],
  },

  supabase: {
    redirectOptions: {
      // Ruta por defecto para usuarios no autenticados
      login: '/login-meseras',
      callback: '/confirm',
      // Lista blanca: rutas que CUALQUIER persona puede visitar sin iniciar sesión
      exclude: [
        '/',
        '/historia',
        '/contactos',
        '/exposiciones',
        '/DetalleObra/*', 
        '/homegastro',
        '/gastronomia/*',
        '/adminpanel02402110',
        '/LoginAdmin',
        '/terminal-pos',
        '/login-meseras',
        '/vigilante-scan'
      ]
    }
  },

  css: [
    '~/assets/css/main.css',
  ],

  app: {
    head: {
      htmlAttrs: {
        lang: 'es-CO'
      },
      // El '%s' es el comodín dinámico. Nuxt lo reemplaza por el título de la página interna.
      titleTemplate: '%s | Palacio Nacional Medellín',
      title: 'Palacio Nacional Medellín | Arte, Moda, Gastronomía e Historia',
      meta: [
        { charset: 'UTF-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { name: 'google-site-verification', content: '_t76qXScY-j8mS0Wz7rUYfuV4dF22O2eW1219YQiCPU' },
        
        // Prevención de Errores de Rastreo y Directivas para Crawlers
        { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' },
        
        // SEO Local y Autoría
        { name: 'author', content: 'Palacio Nacional Medellín' },
        { name: 'geo.region', content: 'CO-ANT' },
        { name: 'geo.placename', content: 'Medellín' },
        
        { name: 'description', content: 'Visita el histórico Palacio Nacional en el centro de Medellín. El destino definitivo donde convergen galerías de arte, moda urbana, historia patrimonial y la mejor gastronomía (Chao Cafe, Chao Pescao y Sky Bar).' },
        { name: 'keywords', content: 'Palacio Nacional Medellin, galerias de arte Medellin, centro comercial medellin, restaurantes centro Medellin, rooftop Medellin, Chao Pescao, Sky Bar, Chao Cafe, historia de medellin' },
        
        // Red de Seguridad Open Graph (WhatsApp, Facebook, LinkedIn)
        { property: 'og:site_name', content: 'Palacio Nacional Medellín' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'es_CO' },
        { property: 'og:url', content: 'https://palacionacionalmedellin.com/' },
        { property: 'og:title', content: 'Palacio Nacional Medellín | Arte, Moda y Gastronomía' },
        { property: 'og:description', content: 'Visita el histórico Palacio Nacional. Arte, cultura, moda y la mejor experiencia gastronómica en un solo monumento histórico.' },
        { property: 'og:image', content: 'https://palacionacionalmedellin.com/logon.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        
        // Red de Seguridad Twitter Cards (X)
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@PalacioNacional' },
        { name: 'twitter:title', content: 'Palacio Nacional Medellín' },
        { name: 'twitter:description', content: 'El destino definitivo donde convergen galerías de arte, moda urbana, historia patrimonial y gastronomía.' },
        { name: 'twitter:image', content: 'https://palacionacionalmedellin.com/logon.png' }
      ],
      link: [
        // Canonicalización base para evitar contenido duplicado en la raíz
        { rel: 'canonical', href: 'https://palacionacionalmedellin.com' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'icon', type: 'image/png', href: '/logon.png' }
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ShoppingCenter",
            "@id": "https://palacionacionalmedellin.com/#centrocomercial",
            "name": "Palacio Nacional Medellín",
            "alternateName": "Centro Comercial y Cultural Palacio Nacional",
            "url": "https://palacionacionalmedellin.com/",
            "description": "Centro comercial y monumento histórico en el centro de Medellín. Convergencia de moda, arte, gastronomía e historia.",
            "image": "https://palacionacionalmedellin.com/logon.png",
            "telephone": "+5745134422",
            "priceRange": "$$",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Carrera 52 # 52-43",
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
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                "opens": "10:00",
                "closes": "22:00"
              }
            ],
            "department": [
              {
                "@type": "ArtGallery",
                "name": "Galería de Arte Palacio Nacional",
                "url": "https://palacionacionalmedellin.com/exposiciones",
                "description": "Exposiciones y venta de obras de arte, esculturas y pinturas en Medellín."
              },
              {
                "@type": "FoodEstablishment",
                "name": "Zona Gastronómica Palacio Nacional",
                "url": "https://palacionacionalmedellin.com/homegastro",
                "description": "La mejor oferta gastronómica en el centro de Medellín.",
                "department": [
                  {
                    "@type": "BarOrPub",
                    "name": "Sky Bar Medellín",
                    "url": "https://palacionacionalmedellin.com/gastronomia/sky-bar"
                  },
                  {
                    "@type": "CafeOrCoffeeShop",
                    "name": "Chao Cafe",
                    "url": "https://palacionacionalmedellin.com/gastronomia/chao-cafe"
                  },
                  {
                    "@type": "Restaurant",
                    "name": "Chao Pescao",
                    "url": "https://palacionacionalmedellin.com/gastronomia/chao-pescado"
                  }
                ]
              }
            ]
          })
        }
      ]
    }
  }
})