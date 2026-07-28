// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/supabase', '@pinia/nuxt', '@nuxt/image', "@nuxtjs/seo"],

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
        '/loginadmin',
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
      title: 'Palacio Nacional Medellín | Arte, Moda, Gastronomía e Historia',
      meta: [
        { charset: 'UTF-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { name: 'google-site-verification', content: '_t76qXScY-j8mS0Wz7rUYfuV4dF22O2eW1219YQiCPU' },
        { name: 'description', content: 'Visita el histórico Palacio Nacional en el centro de Medellín. El destino definitivo donde convergen galerías de arte, moda urbana, historia patrimonial y la mejor gastronomía (Chao Cafe, Chao Pescao y Sky Bar).' },
        { name: 'keywords', content: 'Palacio Nacional Medellin, galerias de arte Medellin, centro comercial medellin, restaurantes centro Medellin, rooftop Medellin, Chao Pescao, Sky Bar, Chao Cafe, historia de medellin' },
        { property: 'og:site_name', content: 'Palacio Nacional Medellín' },
        { property: 'og:title', content: 'Palacio Nacional Medellín | Arte, Moda y Gastronomía' },
        { property: 'og:description', content: 'Visita el histórico Palacio Nacional. Arte, cultura, moda y la mejor experiencia gastronómica en un solo monumento histórico.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://palacionacionalmedellin.com/' },
        { property: 'og:image', content: 'https://palacionacionalmedellin.com/logon.png' }
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'icon', type: 'image/png', href: '/logon.png' }
      ],
      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "ShoppingCenter",
                "@id": "https://palacionacionalmedellin.com/#centrocomercial",
                "name": "Palacio Nacional Medellín",
                "url": "https://palacionacionalmedellin.com/",
                "description": "Centro comercial y monumento histórico en el centro de Medellín. Convergencia de moda, arte, gastronomía e historia.",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "Carrera 52 # 52-43",
                  "addressLocality": "Medellín",
                  "addressRegion": "Antioquia",
                  "addressCountry": "CO"
                }
              },
              {
                "@type": "ArtGallery",
                "@id": "https://palacionacionalmedellin.com/#galeria",
                "name": "Galería de Arte Palacio Nacional",
                "url": "https://palacionacionalmedellin.com/exposiciones",
                "description": "Exposiciones y venta de obras de arte, esculturas y pinturas en Medellín."
              },
              {
                "@type": "FoodEstablishment",
                "@id": "https://palacionacionalmedellin.com/#gastronomia",
                "name": "Zona Gastrongit checkout -b legacy-vueómica Palacio Nacional",
                "url": "https://palacionacionalmedellin.com/homegastro",
                "description": "La mejor oferta gastronómica en el centro de Medellín."
              },
              {
                "@type": "BarOrPub",
                "@id": "https://palacionacionalmedellin.com/#skybar",
                "name": "Sky Bar Medellín",
                "url": "https://palacionacionalmedellin.com/gastronomia/sky-bar",
                "description": "Rooftop bar exclusivo en el Palacio Nacional de Medellín."
              },
              {
                "@type": "CafeOrCoffeeShop",
                "@id": "https://palacionacionalmedellin.com/#chaocafe",
                "name": "Chao Cafe",
                "url": "https://palacionacionalmedellin.com/gastronomia/chao-cafe",
                "description": "Cafetería de especialidad en el centro de Medellín."
              },
              {
                "@type": "Restaurant",
                "@id": "https://palacionacionalmedellin.com/#chaopescado",
                "name": "Chao Pescao",
                "url": "https://palacionacionalmedellin.com/gastronomia/chao-pescado",
                "description": "Restaurante de comida de mar en el centro histórico de Medellín."
              },
              {
                "@type": "AboutPage",
                "@id": "https://palacionacionalmedellin.com/#historia",
                "name": "Historia del Palacio Nacional de Medellín",
                "url": "https://palacionacionalmedellin.com/historia",
                "description": "Conoce la historia y evolución arquitectónica del Palacio Nacional."
              },
              {
                "@type": "ContactPage",
                "@id": "https://palacionacionalmedellin.com/#contactos",
                "name": "Contacto y Ubicación Palacio Nacional",
                "url": "https://palacionacionalmedellin.com/contactos"
              }
            ]
          })
        }
      ]
    }
  }
})