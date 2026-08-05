import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  // Inicializamos el cliente de Supabase seguro del lado del servidor
  const supabase = await serverSupabaseClient(event)
  const rutas: any[] = []

  try {
    // ==========================================
    // 1. EXTRAER OBRAS DE ARTE DINÁMICAS
    // ==========================================
    // Solo traemos el ID y la fecha para optimizar memoria
    const { data: obras } = await supabase
      .from('obras')
      .select('id, created_at')

    if (obras) {
      obras.forEach((obra) => {
        rutas.push({
          loc: `/DetalleObra/${obra.id}`,
          lastmod: obra.created_at,       // Le dice a Google cuándo se subió
          changefreq: 'monthly',          // Una obra rara vez cambia
          priority: 0.8                   // Prioridad alta en tu web
        })
      })
    }

    // ==========================================
    // 2. EXTRAER LOCALES GASTRONÓMICOS
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

    return rutas

  } catch (error) {
    console.error('Error generando sitemap dinámico:', error)
    return [] // Si algo falla, devolvemos un array vacío para no quebrar la app
  }
})