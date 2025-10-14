"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, MapPin, Search, Filter, Award, CheckCircle, Upload, Camera, FileText, AlertTriangle } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useTranslation } from "react-i18next";
import { ReviewSection } from "@/components/review-section"
import { UploadService } from "@/lib/upload-service"
import { GuideService, Guide } from "@/lib/guide-service";
import { ActivitiesService } from "@/lib/activities-service";
import "../../i18n-client";

// Lista de categorías de actividades disponibles
const activityCategories = [
  "Trekking",
  "Escalada",
  "Kitesurf",
  "Deportes lacustres",
  "Pesca",
  "Esquí",
  "Bicicleta"
]

// Lista de ubicaciones en Bariloche
const locations = [
  "Bariloche Centro",
  "Llao Llao",
  "Cerro Catedral",
  "Cerro Otto",
  "Lago Gutiérrez",
  "Lago Nahuel Huapi",
  "Circuito Chico",
  "Villa Catedral",
  "Río Limay",
  "Colonia Suiza",
]

// Lista de niveles de dificultad
const difficultyLevels = ["Principiante", "Intermedio", "Avanzado", "Experto"]

// Lista de temporadas
const seasons = ["Verano", "Otoño", "Invierno", "Primavera", "Todo el año"]

export default function GuidesPage() {
  const { t } = useTranslation("pages");
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [selectedSpecialty, setSelectedSpecialty] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("browse")
  const [formStep, setFormStep] = useState(1)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(null)
  const profilePhotoInputRef = useRef<HTMLInputElement>(null)
  const [difficultyOpen, setDifficultyOpen] = useState(false);
  const [activityCategoryOpen, setActivityCategoryOpen] = useState(false);
  const [activityLocationOpen, setActivityLocationOpen] = useState(false);
  const [mainLocationOpen, setMainLocationOpen] = useState(false);
  const [seasonOpen, setSeasonOpen] = useState(false);
  
  // Guide data state
  const [guides, setGuides] = useState<Guide[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // New: formData state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    profilePhoto: null as string | null,
    experience: "",
    specialties: [] as string[],
    certifications: [] as string[],
    certificationFiles: [] as string[],
    certificationInput: "",
    activityTitle: "",
    activityCategory: "",
    activityDuration: "",
    activityPrice: "",
    activityDifficulty: "",
    activityLocation: "",
    activityDescription: "",
    activityPhotos: [] as string[],
    activitySeason: "",
  });

  // New: file input ref for certification documents
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('folder', 'certifications')
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Upload failed')
      setFormData(prev => ({ ...prev, certificationFiles: [...prev.certificationFiles, json.url] }))
    } catch (e) {
      console.error('Upload failed:', e)
      alert(`Error subiendo el archivo: ${(e as Error).message}`)
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  };

  // Load guides data
  useEffect(() => {
    const loadGuides = async () => {
      try {
        setLoading(true)
        const guidesData = await GuideService.getAllGuides()
        setGuides(guidesData)
      } catch (error) {
        console.error('Error loading guides:', error)
        setError('Error al cargar los guías')
        // Fallback to empty array if no guides found
        setGuides([])
      } finally {
        setLoading(false)
      }
    }

    loadGuides()
  }, [])

  // Extraer todas las especialidades únicas de los guías
  const allSpecialties = Array.from(new Set(guides.flatMap((guide) => guide.specialties))).sort()

  // Filtrar guías según búsqueda y especialidad seleccionada
  const filteredGuides = guides.filter(
    (guide) =>
      (guide.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        guide.specialties.some((specialty) => specialty.toLowerCase().includes(searchTerm.toLowerCase())) ||
        guide.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedSpecialty === null || guide.specialties.includes(selectedSpecialty)),
  )

  // Función para avanzar al siguiente paso del formulario
  const nextStep = () => {
    setDifficultyOpen(false);
    setActivityCategoryOpen(false);
    setActivityLocationOpen(false);
    setMainLocationOpen(false);
    setSeasonOpen(false);
    setTimeout(() => setFormStep(formStep + 1), 50);
  }

  // Función para retroceder al paso anterior del formulario
  const prevStep = () => {
    setFormStep(formStep - 1)
  }

  // Función para simular el envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      // Use the API endpoint to create guide and activity
      const response = await fetch("/api/register-guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('API Error Response:', result);
        throw new Error(result.error || 'Error creating guide or activity');
      }

      console.log('Guide and activity created successfully:', result);
      setFormSubmitted(true);
    } catch (error) {
      console.error('Error creating guide or activity:', error);
      setSubmitError('Error al crear el perfil de guía o la actividad. Por favor, inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  }

  // Reset formData only if user starts a new registration
  const handleStartNewRegistration = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      location: "",
      bio: "",
      profilePhoto: null,
      experience: "",
      specialties: [],
      certifications: [],
      certificationFiles: [],
      certificationInput: "",
      activityTitle: "",
      activityCategory: "",
      activityDuration: "",
      activityPrice: "",
      activityDifficulty: "",
      activityLocation: "",
      activityDescription: "",
      activityPhotos: [],
      activitySeason: "",
    });
    setProfilePhotoPreview(null);
    setFormStep(1);
    setFormSubmitted(false);
    setActiveTab("register");
    setSubmitError(null);
    setIsSubmitting(false);
  };

  // Add certification
  const handleAddCertification = () => {
    if (formData.certificationInput.trim()) {
      setFormData({
        ...formData,
        certifications: [...formData.certifications, formData.certificationInput.trim()],
        certificationInput: "",
      });
    }
  };

  // Remove certification
  const handleRemoveCertification = (index: number) => {
    setFormData({
      ...formData,
      certifications: formData.certifications.filter((_, i) => i !== index),
    });
  };

  // Add specialty (toggle)
  const handleToggleSpecialty = (category: string) => {
    setFormData({
      ...formData,
      specialties: formData.specialties.includes(category)
        ? formData.specialties.filter((c) => c !== category)
        : [...formData.specialties, category],
    });
  };

  // Add activity photo - upload to server and store URL to avoid 413 payloads
  const handleAddActivityPhoto = async (file: File) => {
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('folder', 'activity-photos')
      const res = await fetch('/api/upload', { method: 'POST', body: form })
      const json = await res.json()
      if (!res.ok) throw new Error(json?.error || 'Upload failed')
      setFormData((prev) => ({
        ...prev,
        activityPhotos: [...prev.activityPhotos, json.url as string],
      }))
    } catch (e) {
      console.error('Upload activity photo failed:', e)
      alert(`Error subiendo la foto: ${(e as Error).message}`)
    }
  };

  // Remove activity photo
  const handleRemoveActivityPhoto = (index: number) => {
    setFormData({
      ...formData,
      activityPhotos: formData.activityPhotos.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-emerald-50 to-sky-50">

      <header className="flex items-center justify-between p-4 border-b bg-white">
        <Link href="/" className="flex items-center gap-2">
          <img src="/images/plan-a-logo-binoculars.png" alt="PLAN A Logo" className="h-8 w-auto" />
        </Link>
        {/* <Link href="/guide-registration">
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
            {t("becomeGuide")}
          </Button>
        </Link> */}
      </header>

      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="browse">{t("searchGuides")}</TabsTrigger>
            <TabsTrigger value="register" onClick={handleStartNewRegistration}>{t("iAmGuide")}</TabsTrigger>
          </TabsList>

          {/* Contenido de la pestaña de búsqueda de guías */}
          <TabsContent value="browse" className="space-y-4">
            <h2 className="text-2xl font-bold mb-4">{t("certifiedGuides")}</h2>

            <div className="flex items-center gap-2 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <Input
                  type="text"
                  placeholder={t("searchGuidesPlaceholder")}
                  className="pl-10 pr-4 py-2 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon" className="h-10 w-10" onClick={() => setShowFilters(!showFilters)}>
                <Filter size={18} />
              </Button>
            </div>

            {showFilters && (
              <Card className="p-4 mb-4">
                <h3 className="font-medium mb-3">{t("filterBySpecialty")}</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge
                    className={`cursor-pointer ${
                      selectedSpecialty === null
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                    onClick={() => setSelectedSpecialty(null)}
                  >
                    {t("all")}
                  </Badge>
                  {allSpecialties.map((specialty) => (
                    <Badge
                      key={specialty}
                      className={`cursor-pointer ${
                        selectedSpecialty === specialty
                          ? "bg-emerald-600 hover:bg-emerald-700"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                      onClick={() => setSelectedSpecialty(specialty)}
                    >
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando guías...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Reintentar
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGuides.map((guide) => (
                <Link href={`/guide-profile/${guide.id}`} key={guide.id}>
                  <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                    <div className="p-4">
                      {/* Modificar el Avatar para mostrar el emoji en lugar de las iniciales */}
                      <div className="flex items-start">
                        {guide.avatar && guide.avatar !== '/placeholder.svg' ? (
                          <img
                            src={guide.avatar}
                            alt={guide.name}
                            className="h-16 w-16 rounded-full object-cover"
                          />
                        ) : (
                          <div
                            className={`h-16 w-16 rounded-full ${guide.color || 'bg-emerald-500'} flex items-center justify-center text-white text-2xl`}
                          >
                            {guide.emoji || '🧑‍🦰'}
                          </div>
                        )}
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <h3 className="font-semibold">{guide.name}</h3>
                              {guide.is_verified && <CheckCircle className="w-4 h-4 ml-1 text-blue-500" />}
                            </div>
                            <div className="flex items-center">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="ml-1 font-medium">{guide.rating}</span>
                              <span className="ml-1 text-sm text-gray-500">({guide.reviews || guide.total_reviews})</span>
                            </div>
                          </div>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span>{guide.location}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Award className="w-3 h-3 mr-1" />
                            <span>{guide.experience || `${guide.experience_years} años`}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-3">
                        <p className="text-sm text-gray-600 line-clamp-2">{guide.description}</p>
                      </div>

 

                      <div className="flex justify-center items-center mt-3 pt-3 border-t border-gray-100">
                        
                        <div className="text-lg text-emerald-600 font-medium">{t("viewProfile")}</div>
                      </div>
                    </div>
                  </Card>
                </Link>
                ))}
              </div>
            )}

            {!loading && !error && filteredGuides.length === 0 && (
              <div className="text-center py-10">
                <div className="text-gray-400 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="48"
                    height="48"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mx-auto"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.3-4.3" />
                  </svg>
                 </div>
                <h3 className="text-lg font-medium text-gray-700">No se encontraron guías</h3>
                <p className="text-gray-500 mt-1">Intenta con otra búsqueda o filtro</p>
              </div>
            )}

            {/* Reviews Section */}
            {/* {filteredGuides.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">{t("recentReviews")}</h3>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <ReviewSection 
                    guideId={filteredGuides[0]?.id?.toString() || "1"} 
                    showReviewForm={false}
                    maxReviews={3}
                  />
                </div>
              </div>
            )} */}
          </TabsContent>

          {/* Contenido de la pestaña para guías */}
          <TabsContent value="register" className="space-y-4">
            {!formSubmitted ? (
              <div className="max-w-md mx-auto">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">{t("publishYourActivities")}</h2>
                  <p className="text-gray-600">
                    {t("joinOurCommunity")}
                  </p>
                </div>

                <div className="mb-6">
                  <div className="flex items-center mb-4">
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold mr-3">
                      {formStep}
                    </div>
                    <h3 className="font-semibold">
                      {formStep === 1 && "Información personal"}
                      {formStep === 2 && "Certificaciones y experiencia"}
                      {formStep === 3 && "Publica tu actividad"}
                      {formStep === 4 && "Términos y condiciones"}
                    </h3>
                  </div>

                  <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
                    <div
                      className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(formStep / 4) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <form onSubmit={handleSubmit}>
                  {submitError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                      <p className="text-sm text-red-600">{submitError}</p>
                    </div>
                  )}
                  {formStep === 1 && (
                    <Card>
                      <CardContent className="p-4 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">{t("fullName")}</Label>
                          <Input id="name" placeholder="Ej: Juan Pérez" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">{t("email")}</Label>
                          <Input id="email" type="email" placeholder="tu@email.com" required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">{t("phone")}</Label>
                          <Input id="phone" placeholder="+54 9 294 XXX XXXX" required value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">{t("mainLocation")}</Label>
                          <Select open={mainLocationOpen} onOpenChange={setMainLocationOpen} value={formData.location} onValueChange={val => setFormData({ ...formData, location: val })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona tu ubicación" />
                            </SelectTrigger>
                            <SelectContent >
                              {locations.map((location) => (
                                <SelectItem key={location} value={location}>
                                  {location}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bio">{t("bio")}</Label>
                          <Textarea id="bio" placeholder="Cuéntanos sobre tu experiencia como guía..." className="min-h-[100px]" value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label>{t("profilePhoto")}</Label>
                          <div className="flex items-center gap-4">
                            <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                              {formData.profilePhoto ? (
                                <img src={formData.profilePhoto} alt="Foto de perfil" className="object-cover w-full h-full" />
                              ) : (
                                <Camera className="h-8 w-8 text-gray-400" />
                              )}
                            </div>
                            <Button type="button" variant="outline" className="flex items-center gap-2" onClick={() => profilePhotoInputRef.current?.click()}>
                              <Upload className="h-4 w-4" />
                              {t("uploadPhoto")}
                            </Button>
                            <input type="file" accept="image/*" ref={profilePhotoInputRef} style={{ display: "none" }} onChange={async e => {
                              const file = e.target.files?.[0];
                              if (!file) return
                              try {
                                const form = new FormData()
                                form.append('file', file)
                                form.append('folder', 'profile-photos')
                                const res = await fetch('/api/upload', { method: 'POST', body: form })
                                const json = await res.json()
                                if (!res.ok) throw new Error(json?.error || 'Upload failed')
                                setProfilePhotoPreview(json.url as string)
                                setFormData({ ...formData, profilePhoto: json.url as string })
                              } catch (err) {
                                console.error('Upload profile photo failed:', err)
                                alert(`Error subiendo la foto de perfil: ${(err as Error).message}`)
                              } finally {
                                if (profilePhotoInputRef.current) profilePhotoInputRef.current.value = ''
                              }
                            }} />
                          </div>
                        </div>
                        <div className="pt-2 flex justify-end">
                          <Button type="button" onClick={nextStep} className="bg-emerald-600 hover:bg-emerald-700">
                            Continuar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  {formStep === 2 && (
                    <Card>
                      <CardContent className="p-4 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="experience">{t("yearsOfExperience")}</Label>
                          <Input id="experience" type="number" min="0" placeholder="Ej: 5" required value={formData.experience} onChange={e => setFormData({ ...formData, experience: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label>{t("specialties")}</Label>
                          <div className="flex flex-wrap gap-2">
                            {activityCategories.slice(0, activityCategories.length).map((category) => (
                              <Badge 
                                key={category} 
                                variant={formData.specialties.includes(category) ? "default" : "outline"} 
                                className={`cursor-pointer transition-colors ${
                                  formData.specialties.includes(category) 
                                    ? "bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-600" 
                                    : "hover:bg-emerald-50 border-gray-300 text-gray-700"
                                }`} 
                                onClick={() => handleToggleSpecialty(category)}
                              >
                                {category}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="certifications">{t("certifications")}</Label>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Input placeholder="Nombre de la certificación" className="flex-1" value={formData.certificationInput} onChange={e => setFormData({ ...formData, certificationInput: e.target.value })} />
                              <Button type="button" variant="outline" size="sm" className="flex-shrink-0" onClick={handleAddCertification}>+</Button>
                            </div>
                            {formData.certifications.map((cert, idx) => (
                              <div key={idx} className="flex items-center gap-2 bg-gray-50 p-2 rounded-md">
                                <Award className="h-4 w-4 text-emerald-600" />
                                <span className="text-sm">{cert}</span>
                                <Button type="button" size="icon" variant="ghost" onClick={() => handleRemoveCertification(idx)}><span aria-label="Eliminar" className="text-red-500">×</span></Button>
                              </div>
                            ))}
                            <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-md">
                              <Award className="h-4 w-4 text-emerald-600" />
                              <span className="text-sm">{t("mountainGuide")}</span>
                            </div>
                          </div>
                        </div>
                        {/* Documentos de certificación: not implemented for upload, but you can add similar to activityPhotos */}
                        <div className="space-y-2">
                          <Label>{t("certificationDocuments")}</Label>
                          <div className="border border-dashed border-gray-300 rounded-md p-4 text-center">
                            <FileText className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500 mb-2">{t("uploadCertifications")}</p>
                            <input
                              type="file"
                              ref={fileInputRef}
                              style={{ display: "none" }}
                              onChange={handleFileChange}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="flex items-center gap-2 mx-auto"
                              onClick={handleButtonClick}
                            >
                              <Upload className="h-4 w-4" />
                              {t("uploadFiles")}
                            </Button>
                            {formData.certificationFiles && formData.certificationFiles.length > 0 && (
                              <div className="mt-3 text-left">
                                <div className="text-xs text-gray-500 mb-1">Archivos subidos:</div>
                                <ul className="space-y-1">
                                  {formData.certificationFiles.map((url, idx) => (
                                    <li key={idx} className="text-sm">
                                      <a href={url} target="_blank" rel="noreferrer" className="text-emerald-700 underline">
                                        {url.split('/').pop()}
                                      </a>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="pt-2 flex justify-between">
                          <Button type="button" variant="outline" onClick={prevStep}>{t("return")}</Button>
                          <Button type="button" onClick={nextStep} className="bg-emerald-600 hover:bg-emerald-700">{t("continue")}</Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  {formStep === 3 && (
                    <Card>
                      <CardContent className="p-4 space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="activity-title">{t("activityTitle")}</Label>
                          <Input id="activity-title" placeholder="Ej: Trekking al Cerro Catedral" required value={formData.activityTitle} onChange={e => setFormData({ ...formData, activityTitle: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="activity-category">{t("category")}</Label>
                          <Select open={activityCategoryOpen} onOpenChange={setActivityCategoryOpen} value={formData.activityCategory} onValueChange={val => setFormData({ ...formData, activityCategory: val })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una categoría" />
                            </SelectTrigger>
                            <SelectContent>
                              {activityCategories.map((category) => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="activity-duration">{t("duration")}</Label>
                            <Input id="activity-duration" type="number" min="0.5" step="0.5" placeholder="Ej: 4" required value={formData.activityDuration} onChange={e => setFormData({ ...formData, activityDuration: e.target.value })} />
                          </div>
                          <div className="space-y-2">
                          <Label htmlFor="activity-price">{t("price")}</Label>
                          <Input id="activity-price" type="number" min="0" max="99999999.99" step="0.01" placeholder="Ej: 15000" required value={formData.activityPrice} onChange={e => setFormData({ ...formData, activityPrice: e.target.value })} />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="activity-difficulty">{t("difficulty")}</Label>
                            <Select open={difficultyOpen} onOpenChange={setDifficultyOpen} value={formData.activityDifficulty} onValueChange={val => setFormData({ ...formData, activityDifficulty: val })} key={formStep + "-difficulty"}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona el nivel" />
                              </SelectTrigger>
                              <SelectContent>
                                {difficultyLevels.map((level) => (
                                  <SelectItem key={level} value={level}>{level}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="activity-season">{t("season")}</Label>
                            <Select open={seasonOpen} onOpenChange={setSeasonOpen} value={formData.activitySeason} onValueChange={val => setFormData({ ...formData, activitySeason: val })}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona la temporada" />
                              </SelectTrigger>
                              <SelectContent>
                                {seasons.map((season) => (
                                  <SelectItem key={season} value={season}>{season}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="activity-location">{t("location")}</Label>
                          <Select open={activityLocationOpen} onOpenChange={setActivityLocationOpen} value={formData.activityLocation} onValueChange={val => setFormData({ ...formData, activityLocation: val })}>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona la ubicación" />
                            </SelectTrigger>
                            <SelectContent>
                              {locations.map((location) => (
                                <SelectItem key={location} value={location}>{location}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="activity-description">{t("description")}</Label>
                          <Textarea id="activity-description" placeholder="Describe la actividad, qué incluye, qué deben llevar los participantes..." className="min-h-[120px]" value={formData.activityDescription} onChange={e => setFormData({ ...formData, activityDescription: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                          <Label>{t("activityPhotos")}</Label>
                          <div className="grid grid-cols-3 gap-2">
                            {formData.activityPhotos.map((photo, idx) => (
                              <div key={idx} className="relative aspect-square bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                                <img src={photo} alt="Actividad" className="object-cover w-full h-full" />
                                <Button type="button" size="icon" variant="ghost" className="absolute top-1 right-1" onClick={() => handleRemoveActivityPhoto(idx)}><span aria-label="Eliminar" className="text-red-500">×</span></Button>
                              </div>
                            ))}
                            <label className="aspect-square bg-gray-100 rounded-md flex items-center justify-center cursor-pointer">
                              <Upload className="h-6 w-6 text-gray-400" />
                              <input type="file" accept="image/*" className="hidden" onChange={e => {
                                const file = e.target.files?.[0];
                                if (file) handleAddActivityPhoto(file);
                              }} />
                            </label>
                          </div>
                        </div>
                        <div className="pt-2 flex justify-between">
                          <Button type="button" variant="outline" onClick={prevStep}>{t("back")}</Button>
                          <Button type="button" onClick={nextStep} className="bg-emerald-600 hover:bg-emerald-700">{t("continue")}</Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  {formStep === 4 && (
                    <Card>
                      <CardContent className="p-4 space-y-4">
                        <div className="flex items-center gap-2 bg-amber-50 p-3 rounded-md border border-amber-200 mb-4">
                          <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                          <p className="text-sm text-amber-700">
                            {t("pleaseReadTermsAndConditions")}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label className="font-bold text-lg">
                            {t("termsAndConditions")}
                          </Label>
                          <div className="bg-gray-50 p-4 rounded-md border border-gray-200 max-h-[400px] overflow-y-auto text-sm">
                            <p className="mb-4">
                              {t("termsAndConditionsDescription")}
                            </p>

                            <h4 className="font-bold mt-4 mb-2">1. {t("termsAndConditionsDescription_1_2")}</h4>
                            <p className="mb-4">
                              {t("termsAndConditionsDescription2")}
                            </p>

                            <h4 className="font-bold mt-4 mb-2">2. {t("termsAndConditionsDescription_2_2")}</h4>
                            <p className="mb-4">
                              {t("termsAndConditionsDescription3")}
                            </p>

                            <h4 className="font-bold mt-4 mb-2">3. {t("termsAndConditionsDescription_3_2")}</h4>
                            <p className="mb-4">
                              {t("termsAndConditionsDescription4")}
                            </p>

                            <h4 className="font-bold mt-4 mb-2">4. {t("termsAndConditionsDescription_4_2")}</h4>
                            <p className="mb-4">
                              {t("termsAndConditionsDescription5")}
                            </p>

                            <h4 className="font-bold mt-4 mb-2">5. {t("termsAndConditionsDescription_5_2")}</h4>
                            <p className="mb-4">
                              {t("termsAndConditionsDescription6")}
                            </p>

                            <h4 className="font-bold mt-4 mb-2">6. {t("termsAndConditionsDescription_6_2")}</h4>
                            <p className="mb-4">
                              {t("termsAndConditionsDescription7")}
                            </p>

                            <h4 className="font-bold mt-4 mb-2">7. {t("termsAndConditionsDescription_7_2")}</h4>
                            <p className="mb-4">
                              {t("termsAndConditionsDescription8")}
                            </p>

                            <h4 className="font-bold mt-4 mb-2">8. {t("termsAndConditionsDescription_8_2")}</h4>
                            <p className="mb-4">
                              {t("termsAndConditionsDescription9")}
                            </p>

                            <h4 className="font-bold mt-4 mb-2">{t("termsAndConditionsDescription_9_2")}</h4>
                            <p>
                              {t("termsAndConditionsDescription10")}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 mt-4">
                          <Checkbox
                            id="terms"
                            checked={termsAccepted}
                            onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                          />
                          <label
                            htmlFor="terms"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {t("termsAndConditionsDescription11")}
                          </label>
                        </div>

                        <div className="pt-4 flex justify-between">
                          <Button type="button" variant="outline" onClick={prevStep}>
                            {t("return")}
                          </Button>
                          <Button
                            type="submit"
                            className="bg-emerald-600 hover:bg-emerald-700"
                            disabled={!termsAccepted}
                          //   onClick={async () => {
                          //     try {
                          //       await fetch("/api/notify-admin", {
                          //         method: "POST",
                          //         headers: { "Content-Type": "application/json" },
                          //         body: JSON.stringify({ formData }),
                          //       });
                          //       await fetch("/api/add-mock-activity", {
                          //         method: "POST",
                          //         headers: { "Content-Type": "application/json" },
                          //         body: JSON.stringify({ formData }),
                          //       });
                          //     } catch (e) {
                          //       console.error("Error notifying admin or saving activity:", e);
                          //     }
                          //     // console.log(formData);
                              
                          //   // Do NOT reset formData here, so summary remains
                          // }}
                          >
                            {isSubmitting ? "Guardando..." : t("acceptAndFinish")}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </form>
              </div>
            ) : (
              <div className="max-w-md mx-auto text-center py-8">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">{t("requestSent")}</h2>
                <p className="text-gray-600 mb-6">
                  {t("requestSentDescription")}
                </p>
                {/* <Card className="mb-6">
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{t("nextSteps")}</h3>
                    <ul className="space-y-3 text-left">
                      <li className="flex items-start">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center mr-2 mt-0.5">
                          <span className="text-xs font-bold text-emerald-600">1</span>
                        </div>
                        <span className="text-gray-700">{t("nextStepsDescription1")}</span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center mr-2 mt-0.5">
                          <span className="text-xs font-bold text-emerald-600">2</span>
                        </div>
                        <span className="text-gray-700">
                          {t("nextStepsDescription2")}
                        </span>
                      </li>
                      <li className="flex items-start">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center mr-2 mt-0.5">
                          <span className="text-xs font-bold text-emerald-600">3</span>
                        </div>
                        <span className="text-gray-700">{t("nextStepsDescription3")}</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card> */}
                <Button
                  onClick={() => {
                    setFormSubmitted(false)
                    setFormStep(1)
                    setActiveTab("browse")
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  {t("backToHome")}
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <nav className="flex items-center justify-around p-4 bg-white border-t mt-auto">
        <Link href="/" className="flex flex-col items-center text-gray-400">
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
          <span className="text-xs mt-1">{t("home")}</span>
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
          <span className="text-xs mt-1">{t("search")}</span>
        </Link>
        <Link href="/guides" className="flex flex-col items-center text-emerald-600">
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
          <span className="text-xs mt-1">{t("guides")}</span>
        </Link>
        <Link href="/profile" className="flex flex-col items-center text-gray-400">
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
          <span className="text-xs mt-1">{t("profile")}</span>
        </Link>
      </nav>
    </div>
  )
}

// Componente Plus para el icono de añadir
function Plus(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  )
}