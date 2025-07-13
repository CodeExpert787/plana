export interface Guide {
    name: string
    image: string
    experience: string
    languages: string[]
    bio: string
    phone: string // Añadimos el teléfono del guía
  }
  
  export interface Activity {
    id: string
    title: string
    description: string
    image?: string
    imageUrl?: string
    price: number
    duration: string
    location: string
    rating: number
    category: string
    difficulty: string
    included: string[]
    notIncluded: string[]
    requirements: string[]
    startTimes: string[]
    guide: Guide
    images: string[]
    startTime?: string
    endTime?: string
    participants?: number
    tags?: string[]
  }