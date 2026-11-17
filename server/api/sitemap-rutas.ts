import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  // Inicializamos el cliente de Supabase seguro del lado del servidor
  const supabase = await serverSupabaseClient(event)
  const rutas: any[] = []

  try {
    // ==========================================
    // NOTA: La sección de obras se eliminó intencionalmente.
    // /DetalleObra/** tiene noindex/nofollow, así que incluirlas
    // en el sitemap era contradictorio y generaba queries innecesarios
    // a Supabase (~380+ filas por cada regeneración del sitemap).
    // ==========================================

    // ==========================================
    // 1. EXTRAER LOCALES GASTRONÓMICOS
    // ==========================================
    // Traemos la columna 'local' para saber qué restaurantes están activos
    const { data: menu } = await supabase
      .from('menu_gastronomia')
      .select('local')

    if (menu) {
      // Como los locales se repiten por cada plato, extraemos solo los nombres únicos (ej: 'sky-bar', 'chao-pescado')
      const localesUnicos = [...new Set(menu.map(item => item.local))]
      
      localesUnicos.forEach((local) => {
        rutas.push({
          loc: `/gastronomia/${local}`,
          changefreq: 'weekly',           // Los menús cambian más seguido
          priority: 0.9                   // Máxima prioridad comercial
        })
      })
    }

    // ==========================================
    // 2. PÁGINAS INSTITUCIONALES (FAQ Y EVENTOS)
    // ==========================================
    rutas.push({
      loc: '/faq',
      changefreq: 'monthly',
      priority: 0.7
    })
    rutas.push({
      loc: '/eventos',
      changefreq: 'weekly',
      priority: 0.8
    })

    return rutas

  } catch (error) {
    console.error('Error generando sitemap dinámico:', error)
    return [] // Si algo falla, devolvemos un array vacío para no quebrar la app
  }
})