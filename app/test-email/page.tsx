"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export default function TestEmailPage() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const sendTestBookingEmail = async () => {
    if (!email) {
      setResult({ success: false, message: "Por favor ingresa un email" })
      return
    }

    setIsLoading(true)
    setResult(null)

    // Datos de prueba para simular una reserva
    const testBookingData = {
      personalInfo: {
        firstName: "Juan",
        lastName: "Pérez",
        email: email,
        phone: "+54 9 11 1234-5678",
        address: "Av. Bustillo 123, Bariloche",
        emergencyContact: {
          name: "María Pérez",
          phone: "+54 9 11 8765-4321",
        },
      },
      activity: {
        id: "1",
        title: "Kayak en Bahía López",
        duration: "4 horas",
        location: "Bahía López, Bariloche",
        guide: {
          name: "Carlos Mendoza",
          phone: "+54 9 294 123-4567",
        },
      },
      bookingDetails: {
        confirmationCode: "BA" + Math.random().toString(36).substr(2, 8).toUpperCase(),
        date: new Date().toLocaleDateString("es-ES", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        participants: 2,
        totalPrice: 15000,
      },
    }

    try {
      const response = await fetch("/api/send-confirmation-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(testBookingData),
      })

      const data = await response.json()

      if (response.ok) {
        setResult({ success: true, message: "Email de prueba enviado exitosamente! 🎉" })
      } else {
        setResult({ success: false, message: data.error || "Error enviando email" })
      }
    } catch (error) {
      setResult({ success: false, message: "Error de conexión" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Probar Email de Confirmación
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="test-email" className="text-sm font-medium">
              Email de destino
            </label>
            <Input
              id="test-email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Button onClick={sendTestBookingEmail} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Mail className="w-4 h-4 mr-2" />
                Enviar Email de Prueba
              </>
            )}
          </Button>

          {result && (
            <Alert className={result.success ? "border-green-500" : "border-red-500"}>
              {result.success ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-red-600" />
              )}
              <AlertDescription className={result.success ? "text-green-700" : "text-red-700"}>
                {result.message}
              </AlertDescription>
            </Alert>
          )}

          <div className="text-xs text-gray-500 space-y-1">
            <p>
              <strong>Esto enviará un email de confirmación de prueba</strong> con datos simulados de una reserva de
              kayak.
            </p>
            <p>Perfecto para verificar que la configuración de Nodemailer funciona correctamente.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}