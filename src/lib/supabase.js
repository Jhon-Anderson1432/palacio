import { createClient } from '@supabase/supabase-js'
import { ref } from 'vue'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// Esta es la "central" de búsqueda para todo el proyecto
export const searchQuery = ref('')

// ¡ESTA ES LA LÍNEA QUE FALTABA! La "central" de idiomas
export const idiomaGlobal = ref('es')