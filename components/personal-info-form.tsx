"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Phone, MapPin, UserCheck } from "lucide-react"

export interface PersonalInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  emergencyContact: {
    name: string
    phone: string
    relationship: string
  }
}

interface PersonalInfoFormProps {
  onSubmit: (data: PersonalInfo) => void
}

export default function PersonalInfoForm({ onSubmit }: PersonalInfoFormProps) {
  const [formData, setFormData] = useState<PersonalInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    emergencyContact: {
      name: "",
      phone: "",
      relationship: "",
    },
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) newErrors.firstName = "El nombre es requerido"
    if (!formData.lastName.trim()) newErrors.lastName = "El apellido es requerido"
    if (!formData.email.trim()) newErrors.email = "El email es requerido"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email inválido"
    if (!formData.phone.trim()) newErrors.phone = "El teléfono es requerido"
    if (!formData.address.trim()) newErrors.address = "La dirección es requerida"
    if (!formData.emergencyContact.name.trim()) newErrors.emergencyName = "El contacto de emergencia es requerido"
    if (!formData.emergencyContact.phone.trim()) newErrors.emergencyPhone = "El teléfono de emergencia es requerido"
    if (!formData.emergencyContact.relationship.trim()) newErrors.emergencyRelationship = "La relación es requerida"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith("emergency.")) {
      const emergencyField = field.split(".")[1]
      setFormData((prev) => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [emergencyField]: value,
        },
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }

    // Limpiar error cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          Información Personal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Información Personal */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nombre *</label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className={`w-full p-3 border rounded-lg ${errors.firstName ? "border-red-500" : "border-gray-300"}`}
                placeholder="Tu nombre"
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Apellido *</label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className={`w-full p-3 border rounded-lg ${errors.lastName ? "border-red-500" : "border-gray-300"}`}
                placeholder="Tu apellido"
              />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className={`w-full p-3 border rounded-lg ${errors.email ? "border-red-500" : "border-gray-300"}`}
              placeholder="tu@email.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Teléfono *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              className={`w-full p-3 border rounded-lg ${errors.phone ? "border-red-500" : "border-gray-300"}`}
              placeholder="+54 9 11 1234-5678"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Dirección *
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              className={`w-full p-3 border rounded-lg ${errors.address ? "border-red-500" : "border-gray-300"}`}
              placeholder="Tu dirección completa"
            />
            {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
          </div>

          {/* Contacto de Emergencia */}
          <div className="border-t pt-4 mt-6">
            <h3 className="font-medium mb-4 flex items-center gap-2">
              <UserCheck className="w-4 h-4" />
              Contacto de Emergencia
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Nombre completo *</label>
                <input
                  type="text"
                  value={formData.emergencyContact.name}
                  onChange={(e) => handleInputChange("emergency.name", e.target.value)}
                  className={`w-full p-3 border rounded-lg ${
                    errors.emergencyName ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Nombre del contacto de emergencia"
                />
                {errors.emergencyName && <p className="text-red-500 text-sm mt-1">{errors.emergencyName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Teléfono *</label>
                <input
                  type="tel"
                  value={formData.emergencyContact.phone}
                  onChange={(e) => handleInputChange("emergency.phone", e.target.value)}
                  className={`w-full p-3 border rounded-lg ${
                    errors.emergencyPhone ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="+54 9 11 1234-5678"
                />
                {errors.emergencyPhone && <p className="text-red-500 text-sm mt-1">{errors.emergencyPhone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Relación *</label>
                <select
                  value={formData.emergencyContact.relationship}
                  onChange={(e) => handleInputChange("emergency.relationship", e.target.value)}
                  className={`w-full p-3 border rounded-lg ${
                    errors.emergencyRelationship ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Selecciona la relación</option>
                  <option value="padre">Padre</option>
                  <option value="madre">Madre</option>
                  <option value="hermano">Hermano/a</option>
                  <option value="pareja">Pareja</option>
                  <option value="amigo">Amigo/a</option>
                  <option value="otro">Otro</option>
                </select>
                {errors.emergencyRelationship && (
                  <p className="text-red-500 text-sm mt-1">{errors.emergencyRelationship}</p>
                )}
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full mt-6">
            Continuar al Pago
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}