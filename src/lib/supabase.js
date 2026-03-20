import { createClient } from '@supabase/supabase-js'
import { ref } from 'vue' // Añadimos esto

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

// Esta es la nueva "central" de búsqueda para todo el proyecto
export const searchQuery = ref('')