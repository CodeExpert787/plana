import { createClient } from "@supabase/supabase-js"

// Variables de entorno
const supabaseUrl = "https://modkuyageqignemdowbs.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vZGt1eWFnZXFpZ25lbWRvd2JzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzNjQ2MjAsImV4cCI6MjA2Mzk0MDYyMH0.bUORqU7TNjw90CXvI7cPlz9cIj3-Ez6gcwhCjXLPKis"
//const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
//const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Verificar que las variables estén configuradas
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("⚠️ Supabase no está configurado. Usando modo mock.")
}

// Crear cliente de Supabase
export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

// Función para verificar si Supabase está configurado
export const isSupabaseConfigured = () => {
  return supabase !== null
}

// Función para obtener el estado de configuración
export const getSupabaseStatus = () => {
  return {
    configured: isSupabaseConfigured(),
    url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : "No configurada",
    hasAnonKey: !!supabaseAnonKey,
  }
}
