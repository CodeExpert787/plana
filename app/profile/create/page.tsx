"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Camera, Check, ChevronRight, Loader2, Upload, User } from "lucide-react"
import { useTranslation } from "react-i18next";
import "../../../i18n-client";
export default function CreateProfilePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [profileImage, setProfileImage] = useState<string | null>(null)
  const { t } = useTranslation("pages");
  // Estados para los campos del formulario
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "Bariloche, Argentina",
    bio: "",
  })

  // Manejar cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Simular carga de imagen
  const handleImageUpload = () => {
    // En una implementación real, aquí se cargaría la imagen al servidor
    // Por ahora, simplemente simulamos una carga con un placeholder
    setLoading(true)
    setTimeout(() => {
      setProfileImage("/images/sofia-profile.jpeg")
      setLoading(false)
    }, 1500)
  }

  // Manejar envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simular envío de datos al servidor
    setTimeout(() => {
      setLoading(false)
      if (step < 3) {
        setStep(step + 1)
      } else {
        // Redirigir al perfil completado
        router.push("/profile")
      }
    }, 1000)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-emerald-50 to-sky-50">
      <header className="flex items-center justify-between p-4 border-b bg-white">
        <Link href="/" className="flex items-center gap-2">
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
          <h1 className="text-xl font-bold text-emerald-700">PLAN A</h1>
        </Link>
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Button>
      </header>

      <div className="flex-1 p-4">
        <div className="max-w-md mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">{t("createProfile")}</CardTitle>
              <CardDescription>
                {step === 1 && t("completePersonalInfo")}
                {step === 2 && t("uploadProfilePhoto")}
                {step === 3 && t("almostDone")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Indicador de progreso */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-emerald-600 text-white" : "bg-gray-200"}`}
                  >
                    {step > 1 ? <Check className="h-5 w-5" /> : 1}
                  </div>
                  <div className={`h-1 w-10 ${step > 1 ? "bg-emerald-600" : "bg-gray-200"}`}></div>
                </div>
                <div className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-emerald-600 text-white" : "bg-gray-200"}`}
                  >
                    {step > 2 ? <Check className="h-5 w-5" /> : 2}
                  </div>
                  <div className={`h-1 w-10 ${step > 2 ? "bg-emerald-600" : "bg-gray-200"}`}></div>
                </div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? "bg-emerald-600 text-white" : "bg-gray-200"}`}
                >
                  3
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Paso 1: Información personal */}
                {step === 1 && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">{t("fullName")}</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Ej. Sofia Aliaga"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">{t("email")}</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="tu@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">{t("phone")}</Label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="+54 9 294 123 4567"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">{t("location")}</Label>
                      <Input
                        id="location"
                        name="location"
                        placeholder="Ciudad, País"
                        value={formData.location}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">{t("aboutYou")}</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        placeholder="Cuéntanos un poco sobre ti y tus intereses..."
                        value={formData.bio}
                        onChange={handleChange}
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                )}

                {/* Paso 2: Foto de perfil */}
                {step === 2 && (
                  <div className="flex flex-col items-center space-y-6">
                    <div className="relative">
                      {profileImage ? (
                        <div className="w-40 h-40 rounded-full overflow-hidden relative">
                          <Image
                            src={profileImage || "/placeholder.svg"}
                            alt="Foto de perfil"
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-20 w-20 text-gray-400" />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={handleImageUpload}
                        disabled={loading}
                        className="absolute bottom-0 right-0 bg-emerald-600 text-white p-3 rounded-full shadow-lg hover:bg-emerald-700 transition-colors"
                      >
                        {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Camera className="h-5 w-5" />}
                      </button>
                    </div>
                    <div className="text-center">
                      <h3 className="font-medium text-lg">{t("addProfilePhoto")}</h3>
                      <p className="text-gray-500 text-sm mt-1">
                        {t("thisWillHelpGuides")}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={handleImageUpload}
                      disabled={loading}
                    >
                      <Upload className="h-4 w-4" />
                      {t("uploadPhoto")}
                    </Button>
                  </div>
                )}

                {/* Paso 3: Confirmación */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-full overflow-hidden relative flex-shrink-0">
                        <Image
                          src={profileImage || "/placeholder.svg"}
                          alt="Foto de perfil"
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{formData.name}</h3>
                        <p className="text-gray-500">{formData.location}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="border-b pb-2">
                        <p className="text-sm text-gray-500">{t("email")}</p>
                        <p className="font-medium">{formData.email}</p>
                      </div>
                      <div className="border-b pb-2">
                        <p className="text-sm text-gray-500">{t("phone")}</p>
                        <p className="font-medium">{formData.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">{t("aboutYou")}</p>
                        <p className="font-medium">{formData.bio || "No has proporcionado una descripción."}</p>
                      </div>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                      <p className="text-sm text-emerald-800">
                        {t("byCreatingProfile")}
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-between">
                  {step > 1 && (
                    <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                      {t("back")}
                    </Button>
                  )}
                  {step === 1 && <div></div>}

                  <Button
                    type="submit"
                    disabled={loading || (step === 2 && !profileImage)}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("processing")}
                      </>
                    ) : step < 3 ? (
                      <>
                        {t("continue")}
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      "Completar perfil"
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center border-t pt-4">
              <p className="text-xs text-gray-500 text-center">
                {t("yourInformationIsSafe")}
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}