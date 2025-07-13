import { supabase, isSupabaseConfigured } from "./supabase"
import mockActivities from "@/data/mockActivities"
import type { Activity } from "@/types"

// Función para obtener todas las actividades
export async function getActivities(): Promise<Activity[]> {
  if (!isSupabaseConfigured()) {
    console.log("📦 Usando datos mock - Supabase no configurado")
    return mockActivities
  }

  try {
    console.log("🔍 Intentando obtener actividades de Supabase...")

    // Primero intentamos obtener solo las actividades para verificar la conexión
    const { data: activitiesTest, error: testError } = await supabase!.from("activities").select("id, title").limit(1)

    if (testError) {
      console.error("❌ Error de conexión básica con Supabase:", testError)
      console.log("📦 Fallback a datos mock")
      return mockActivities
    }

    if (!activitiesTest || activitiesTest.length === 0) {
      console.warn("⚠️ No hay actividades en la base de datos")
      console.log("📦 Usando datos mock")
      return mockActivities
    }

    // Ahora intentamos la consulta completa con joins
    const { data: activities, error: activitiesError } = await supabase!.from("activities").select(`
        *,
        guides (*)
      `)

    if (activitiesError) {
      console.error("❌ Error obteniendo actividades con guías:", activitiesError)
      console.log("📦 Fallback a datos mock")
      return mockActivities
    }

    if (!activities || activities.length === 0) {
      console.warn("⚠️ No se encontraron actividades")
      console.log("📦 Usando datos mock")
      return mockActivities
    }

    // Convertir datos de Supabase al formato esperado con manejo seguro de nulls
    const formattedActivities: Activity[] = activities.map((activity) => {
      // Manejo seguro de los datos del guía
      const guide = activity.guides || {}

      return {
        id: activity.id,
        title: activity.title || "Actividad sin título",
        description: activity.description || "Sin descripción",
        price: activity.price || 0,
        duration: activity.duration || "No especificado",
        location: activity.location || "Ubicación no especificada",
        rating: activity.rating || 0,
        category: activity.category || "General",
        difficulty: activity.difficulty || "Fácil",
        included: activity.included || [],
        notIncluded: activity.not_included || [],
        requirements: activity.requirements || [],
        startTimes: activity.start_times || [],
        images: activity.images || [],
        guide: {
          name: guide.name || "Guía no asignado",
          image: guide.image || "/images/guide-placeholder.png",
          experience: guide.experience || "Sin experiencia especificada",
          languages: guide.languages || ["Español"],
          bio: guide.bio || "Sin biografía disponible",
          phone: guide.phone || "Sin teléfono",
        },
      }
    })

    console.log(`✅ Obtenidas ${formattedActivities.length} actividades de Supabase`)
    return formattedActivities
  } catch (error) {
    console.error("❌ Error conectando con Supabase:", error)
    console.log("📦 Fallback a datos mock")
    return mockActivities
  }
}

// Función para obtener una actividad por ID
export async function getActivityById(id: string): Promise<Activity | null> {
  if (!isSupabaseConfigured()) {
    return mockActivities.find((activity) => activity.id === id) || null
  }

  try {
    const { data: activity, error } = await supabase!
      .from("activities")
      .select(`
        *,
        guides (*)
      `)
      .eq("id", id)
      .single()

    if (error) {
      console.error("❌ Error obteniendo actividad:", error)
      return mockActivities.find((activity) => activity.id === id) || null
    }

    if (!activity) {
      console.warn("⚠️ Actividad no encontrada en Supabase")
      return mockActivities.find((activity) => activity.id === id) || null
    }

    // Manejo seguro de los datos del guía
    const guide = activity.guides || {}

    return {
      id: activity.id,
      title: activity.title || "Actividad sin título",
      description: activity.description || "Sin descripción",
      price: activity.price || 0,
      duration: activity.duration || "No especificado",
      location: activity.location || "Ubicación no especificada",
      rating: activity.rating || 0,
      category: activity.category || "General",
      difficulty: activity.difficulty || "Fácil",
      included: activity.included || [],
      notIncluded: activity.not_included || [],
      requirements: activity.requirements || [],
      startTimes: activity.start_times || [],
      images: activity.images || [],
      guide: {
        name: guide.name || "Guía no asignado",
        image: guide.image || "/images/guide-placeholder.png",
        experience: guide.experience || "Sin experiencia especificada",
        languages: guide.languages || ["Español"],
        bio: guide.bio || "Sin biografía disponible",
        phone: guide.phone || "Sin teléfono",
      },
    }
  } catch (error) {
    console.error("❌ Error conectando con Supabase:", error)
    return mockActivities.find((activity) => activity.id === id) || null
  }
}

// Función para buscar actividades
export async function searchActivities(query: string): Promise<Activity[]> {
  const activities = await getActivities()

  if (!query.trim()) {
    return activities
  }

  return activities.filter(
    (activity) =>
      activity.title.toLowerCase().includes(query.toLowerCase()) ||
      activity.description.toLowerCase().includes(query.toLowerCase()) ||
      activity.category.toLowerCase().includes(query.toLowerCase()) ||
      activity.location.toLowerCase().includes(query.toLowerCase()),
  )
}

// Función para verificar si las tablas existen en Supabase
export async function checkSupabaseSchema(): Promise<{
  activitiesTable: boolean
  guidesTable: boolean
  hasData: boolean
  error?: string
}> {
  if (!isSupabaseConfigured()) {
    return {
      activitiesTable: false,
      guidesTable: false,
      hasData: false,
      error: "Supabase no configurado",
    }
  }

  try {
    // Verificar tabla de actividades
    const { data: activitiesData, error: activitiesError } = await supabase!.from("activities").select("id").limit(1)

    // Verificar tabla de guías
    const { data: guidesData, error: guidesError } = await supabase!.from("guides").select("id").limit(1)

    return {
      activitiesTable: !activitiesError,
      guidesTable: !guidesError,
      hasData: (activitiesData && activitiesData.length > 0) || false,
      error: activitiesError?.message || guidesError?.message,
    }
  } catch (error) {
    return {
      activitiesTable: false,
      guidesTable: false,
      hasData: false,
      error: `Error de conexión: ${error}`,
    }
  }
}
