"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Star, MapPin, Clock, Heart } from "lucide-react"

// Datos de ejemplo para las actividades
const activities = [
  {
    id: 1,
    title: "Trekking al Cerro Catedral",
    description: "Disfruta de un trekking guiado con vistas panorámicas del lago Nahuel Huapi y los Andes.",
    color: "bg-emerald-500",
    emoji: "🥾",
    price: 15000,
    duration: "4 horas",
    difficulty: "Moderada",
    guide: {
      name: "Carlos Montaña",
      initials: "CM",
      color: "bg-blue-500",
      rating: 4.8,
      reviews: 124,
      verified: true,
    },
    tags: ["Trekking", "Naturaleza", "Vistas"],
  },
  {
    id: 2,
    title: "Kayak en Lago Gutiérrez",
    description: "Navega en kayak por las aguas cristalinas del Lago Gutiérrez con un guía experto.",
    color: "bg-blue-500",
    emoji: "🚣",
    price: 12000,
    duration: "3 horas",
    difficulty: "Fácil",
    guide: {
      name: "Laura Ríos",
      initials: "LR",
      color: "bg-purple-500",
      rating: 4.9,
      reviews: 87,
      verified: true,
    },
    tags: ["Kayak", "Lago", "Aventura"],
  },
  {
    id: 3,
    title: "Escalada en Piedras Blancas",
    description: "Aprende técnicas de escalada en roca con instructores certificados en un entorno natural único.",
    color: "bg-amber-500",
    emoji: "🧗",
    price: 18000,
    duration: "5 horas",
    difficulty: "Difícil",
    guide: {
      name: "Martín Escalante",
      initials: "ME",
      color: "bg-green-500",
      rating: 4.7,
      reviews: 56,
      verified: true,
    },
    tags: ["Escalada", "Aventura", "Adrenalina"],
  },
  {
    id: 4,
    title: "Trekking al Cerro Llao Llao",
    description: "Recorrido por senderos con vistas panorámicas del Hotel Llao Llao y lagos circundantes.",
    color: "bg-emerald-600",
    emoji: "🏔️",
    price: 12000,
    duration: "3 horas",
    difficulty: "Moderada",
    guide: {
      name: "Carlos Montaña",
      initials: "CM",
      color: "bg-blue-500",
      rating: 4.8,
      reviews: 124,
      verified: true,
    },
    tags: ["Trekking", "Naturaleza", "Vistas"],
  },
  {
    id: 5,
    title: "Esquí en Cerro Catedral",
    description: "Clases de esquí para todos los niveles en el centro de esquí más grande de Sudamérica.",
    color: "bg-sky-500",
    emoji: "⛷️",
    price: 22000,
    duration: "4 horas",
    difficulty: "Variable",
    guide: {
      name: "Javier Nieves",
      initials: "JN",
      color: "bg-indigo-500",
      rating: 4.9,
      reviews: 112,
      verified: true,
    },
    tags: ["Esquí", "Nieve", "Deporte"],
  },
]

export default function ExplorePage() {
  const [activeTab, setActiveTab] = useState<"explore" | "matches">("explore")
  const [likedActivities, setLikedActivities] = useState<number[]>([])
  const navHomebuildSearchUrl = (viewMode = "grid") => {
    const params = new URLSearchParams()
    // Añadir parámetros básicos
    params.append("view", viewMode)
    return `/search?${params.toString()}`
  }
  // Cargar actividades likeadas desde localStorage al iniciar
  useEffect(() => {
    const savedLikes = localStorage.getItem("likedActivities")
    if (savedLikes) {
      setLikedActivities(JSON.parse(savedLikes))
    }
  }, [])

  // Guardar actividades likeadas en localStorage cuando cambian
  useEffect(() => {
    localStorage.setItem("likedActivities", JSON.stringify(likedActivities))
  }, [likedActivities])

  // Función para manejar el like/unlike de una actividad
  const toggleLike = (activityId: number) => {
    setLikedActivities((prev) => {
      if (prev.includes(activityId)) {
        return prev.filter((id) => id !== activityId)
      } else {
        return [...prev, activityId]
      }
    })
  }

  // Filtrar actividades según la pestaña activa
  const activitiesToShow =
    activeTab === "matches" ? activities.filter((activity) => likedActivities.includes(activity.id)) : activities

  return (
    <main className="flex flex-col min-h-screen bg-gradient-to-b from-emerald-50 to-sky-50">
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-emerald-600"
          >
            <path
              d="M22 20L14.5 10L10.5 15L8 12L2 20"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M2 20H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 rounded-full hover:bg-gray-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-600"
            >
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </button>
          <button className="p-2 rounded-full hover:bg-gray-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-600"
            >
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </button>
        </div>
      </header>

      <div className="flex-1 p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex p-1 bg-gray-100 rounded-full">
            <button
              className={`px-4 py-1.5 text-sm font-medium rounded-full ${
                activeTab === "explore" ? "bg-emerald-600 text-white" : "text-gray-600"
              }`}
              onClick={() => setActiveTab("explore")}
            >
              Explorar
            </button>
            <button
              className={`px-4 py-1.5 text-sm font-medium rounded-full ${
                activeTab === "matches" ? "bg-emerald-600 text-white" : "text-gray-600"
              }`}
              onClick={() => setActiveTab("matches")}
            >
              Mis Matches
            </button>
          </div>
          <button className="p-2 rounded-full bg-gray-100 text-gray-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 6h18" />
              <path d="M7 12h10" />
              <path d="M10 18h4" />
            </svg>
          </button>
        </div>

        {activeTab === "explore" && (
          <div className="flex items-center mb-4 overflow-x-auto py-1 no-scrollbar">
            <div className="flex items-center bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm mr-2 whitespace-nowrap">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
              >
                <path d="M2 12h20" />
                <path d="M12 2v20" />
                <path d="m4.93 4.93 14.14 14.14" />
                <path d="m19.07 4.93-14.14 14.14" />
              </svg>
              <span>Invierno</span>
              <button className="ml-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
            <div className="flex items-center bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm mr-2 whitespace-nowrap">
              <span>Trekking</span>
              <button className="ml-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
            <div className="flex items-center bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm mr-2 whitespace-nowrap">
              <span>Escalada</span>
              <button className="ml-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
            <div className="flex items-center bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm mr-2 whitespace-nowrap">
              <span>Esquí</span>
              <button className="ml-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
            <div className="flex items-center bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm mr-2 whitespace-nowrap">
              <span>30km</span>
              <button className="ml-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
            <div className="flex items-center bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm whitespace-nowrap">
              <span>4 horas</span>
              <button className="ml-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {activeTab === "matches" && likedActivities.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">No tienes matches todavía</h3>
            <p className="text-gray-600 max-w-xs">
              Explora actividades y dale like a las que te interesen para verlas aquí
            </p>
            <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700" onClick={() => setActiveTab("explore")}>
              Explorar actividades
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {activitiesToShow.map((activity) => (
              <div key={activity.id} className="bg-white rounded-xl overflow-hidden shadow-sm">
                <div className="p-4">
                  <div className="flex items-start">
                    <div
                      className={`w-20 h-20 rounded-lg mr-3 flex-shrink-0 flex items-center justify-center text-3xl ${activity.color} text-white`}
                    >
                      {activity.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium line-clamp-1">{activity.title}</h3>
                        <button className="p-1 rounded-full hover:bg-gray-100" onClick={() => toggleLike(activity.id)}>
                          <Heart
                            className={`w-5 h-5 ${
                              likedActivities.includes(activity.id) ? "fill-red-500 text-red-500" : "text-gray-400"
                            }`}
                          />
                        </button>
                      </div>

                      <div className="flex items-center mt-1 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="truncate">Bariloche, Argentina</span>
                      </div>

                      <div className="flex items-center mt-1 text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{activity.duration}</span>
                        <span className="mx-1">•</span>
                        <span>Dificultad: {activity.difficulty}</span>
                      </div>

                      <div className="flex flex-wrap gap-1 mt-2">
                        {activity.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center">
                          <Avatar className={`h-6 w-6 mr-1 ${activity.guide.color}`}>
                            <AvatarFallback className="text-xs">{activity.guide.initials}</AvatarFallback>
                          </Avatar>
                          <div className="flex items-center">
                            <span className="text-xs font-medium mr-1">{activity.guide.name}</span>
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="ml-1 text-xs">{activity.guide.rating}</span>
                          </div>
                        </div>
                        <div className="font-bold">${activity.price.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <nav className="flex items-center justify-around p-4 bg-white border-t">
        <Link href={navHomebuildSearchUrl("swipe")} className="flex flex-col items-center text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          <span className="text-xs mt-1">Inicio</span>
        </Link>
        <Link href="/filters" className="flex flex-col items-center text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <span className="text-xs mt-1">Buscar</span>
        </Link>
        <Link href="/guides" className="flex flex-col items-center text-gray-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
          <span className="text-xs mt-1">Guías</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center text-emerald-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span className="text-xs mt-1">Perfil</span>
        </Link>
      </nav>
    </main>
  )
}