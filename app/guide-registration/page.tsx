"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTranslation } from "react-i18next"
import { useAuth } from "@/lib/auth-context"
import { GuideService, Guide } from "@/lib/guide-service"
import { UserProfileService } from "@/lib/user-profile-service"
import ProtectedRoute from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, AlertTriangle, MapPin, Star, Award, Globe } from "lucide-react"
import "../../i18n-client"

const SPECIALTIES = [
  "Trekking", "Escalada", "Esquí", "Bicicleta", "Kayak", "Pesca", 
  "Parapente", "Cabalgata", "Fotografía", "Camping", "Navegación", 
  "Observación de Aves", "Montañismo", "Rafting", "Canyoning"
]

const LANGUAGES = [
  "Español", "Inglés", "Portugués", "Francés", "Alemán", "Italiano"
]

const CERTIFICATIONS = [
  "Guía de Montaña UIAA", "Guía de Trekking AAGM", "Primeros Auxilios",
  "Rescate en Montaña", "Guía de Esquí", "Instructor de Kayak",
  "Guía de Parapente", "Fotografía de Naturaleza"
]

export default function GuideRegistrationPage() {
  const { t } = useTranslation("pages")
  const { user } = useAuth()
  const router = useRouter()
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isExistingGuide, setIsExistingGuide] = useState(false)
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    description: "",
    specialties: [] as string[],
    languages: [] as string[],
    experience_years: 0,
    certifications: [] as string[]
  })

  // Check if user is already a guide
  useEffect(() => {
    const checkExistingGuide = async () => {
      if (!user?.id) return

      try {
        const existingGuide = await GuideService.getGuideByUserId(user.id)
        if (existingGuide) {
          setIsExistingGuide(true)
          setFormData({
            name: existingGuide.name,
            email: existingGuide.email,
            phone: existingGuide.phone,
            location: existingGuide.location,
            description: existingGuide.description,
            specialties: existingGuide.specialties,
            languages: existingGuide.languages,
            experience_years: existingGuide.experience_years,
            certifications: existingGuide.certifications
          })
        }
      } catch (error) {
        console.error('Error checking existing guide:', error)
      }
    }

    checkExistingGuide()
  }, [user?.id])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleArrayToggle = (field: 'specialties' | 'languages' | 'certifications', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) return

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // First, get or create user profile
      let userProfile = await UserProfileService.getUserProfile(user.id)
      if (!userProfile) {
        userProfile = await UserProfileService.createUserProfile({
          user_id: user.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          avatar: '/placeholder.svg',
          location: formData.location,
          member_since: new Date().toISOString(),
          description: formData.description,
          completed_activities: 0,
          reviews: 0,
          rating: 0
        })
      }

      const guideData = {
        user_id: user.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        avatar: userProfile.avatar,
        location: formData.location,
        member_since: new Date().toISOString(),
        description: formData.description,
        specialties: formData.specialties,
        languages: formData.languages,
        experience_years: formData.experience_years,
        certifications: formData.certifications,
        rating: 0,
        total_reviews: 0,
        completed_activities: 0,
        is_verified: false,
        is_active: true
      }

      if (isExistingGuide) {
        // Update existing guide
        const existingGuide = await GuideService.getGuideByUserId(user.id)
        if (existingGuide) {
          await GuideService.updateGuide(existingGuide.id, guideData)
          setSuccess("Perfil de guía actualizado exitosamente!")
        }
      } else {
        // Create new guide
        await GuideService.createGuide(guideData)
        setSuccess("¡Te has registrado como guía exitosamente! Tu perfil será revisado y verificado pronto.")
      }

      // Redirect to guide dashboard after 2 seconds
      setTimeout(() => {
        router.push('/guide-dashboard')
      }, 2000)

    } catch (error) {
      console.error('Error registering guide:', error)
      setError(error instanceof Error ? error.message : 'Error al registrar como guía')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-sky-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Debes iniciar sesión para registrarte como guía</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-sky-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {isExistingGuide ? "Actualizar Perfil de Guía" : "Registro como Guía"}
              </h1>
              <p className="text-gray-600">
                {isExistingGuide 
                  ? "Actualiza tu información de guía" 
                  : "Únete a nuestra comunidad de guías profesionales"
                }
              </p>
            </div>

            {error && (
              <Alert className="mb-6">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-6">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2 text-emerald-600" />
                  Información Personal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nombre Completo *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                        placeholder="Tu nombre completo"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Teléfono *</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        required
                        placeholder="+54 9 11 1234-5678"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Ubicación *</Label>
                      <Input
                        id="location"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        required
                        placeholder="Bariloche, Argentina"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Descripción *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      required
                      placeholder="Cuéntanos sobre tu experiencia y pasión por las actividades al aire libre..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="experience_years">Años de Experiencia *</Label>
                    <Input
                      id="experience_years"
                      type="number"
                      min="0"
                      max="50"
                      value={formData.experience_years}
                      onChange={(e) => handleInputChange('experience_years', parseInt(e.target.value) || 0)}
                      required
                      placeholder="5"
                    />
                  </div>

                  {/* Specialties */}
                  <div>
                    <Label>Especialidades *</Label>
                    <p className="text-sm text-gray-500 mb-3">Selecciona tus áreas de especialización</p>
                    <div className="flex flex-wrap gap-2">
                      {SPECIALTIES.map((specialty) => (
                        <Badge
                          key={specialty}
                          variant={formData.specialties.includes(specialty) ? "default" : "outline"}
                          className="cursor-pointer hover:bg-emerald-100"
                          onClick={() => handleArrayToggle('specialties', specialty)}
                        >
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Languages */}
                  <div>
                    <Label>Idiomas *</Label>
                    <p className="text-sm text-gray-500 mb-3">Selecciona los idiomas que hablas</p>
                    <div className="flex flex-wrap gap-2">
                      {LANGUAGES.map((language) => (
                        <Badge
                          key={language}
                          variant={formData.languages.includes(language) ? "default" : "outline"}
                          className="cursor-pointer hover:bg-emerald-100"
                          onClick={() => handleArrayToggle('languages', language)}
                        >
                          {language}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Certifications */}
                  <div>
                    <Label>Certificaciones</Label>
                    <p className="text-sm text-gray-500 mb-3">Selecciona tus certificaciones (opcional)</p>
                    <div className="flex flex-wrap gap-2">
                      {CERTIFICATIONS.map((cert) => (
                        <Badge
                          key={cert}
                          variant={formData.certifications.includes(cert) ? "default" : "outline"}
                          className="cursor-pointer hover:bg-emerald-100"
                          onClick={() => handleArrayToggle('certifications', cert)}
                        >
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.back()}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={loading || formData.specialties.length === 0 || formData.languages.length === 0}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      {loading ? "Procesando..." : (isExistingGuide ? "Actualizar Perfil" : "Registrarse como Guía")}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Benefits Card */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-500" />
                  Beneficios de ser Guía
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-emerald-600 mt-1" />
                    <div>
                      <h4 className="font-medium">Flexibilidad</h4>
                      <p className="text-sm text-gray-600">Trabaja cuando quieras, donde quieras</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Globe className="w-5 h-5 text-emerald-600 mt-1" />
                    <div>
                      <h4 className="font-medium">Alcance Global</h4>
                      <p className="text-sm text-gray-600">Conecta con viajeros de todo el mundo</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Award className="w-5 h-5 text-emerald-600 mt-1" />
                    <div>
                      <h4 className="font-medium">Reconocimiento</h4>
                      <p className="text-sm text-gray-600">Sistema de calificaciones y reseñas</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Star className="w-5 h-5 text-emerald-600 mt-1" />
                    <div>
                      <h4 className="font-medium">Ingresos</h4>
                      <p className="text-sm text-gray-600">Gana dinero haciendo lo que amas</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
