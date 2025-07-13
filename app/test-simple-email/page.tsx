"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Mail, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export default function TestSimpleEmail() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const sendTestEmail = async () => {
    if (!email) {
      setResult({ success: false, message: "Por favor ingresa un email" })
      return
    }

    setIsLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, provider: "gmail" }),
      })

      const data = await response.json()

      if (response.ok) {
        setResult({
          success: true,
          message: data.simulated
            ? "Email simulado correctamente (revisa la consola)"
            : "Email enviado correctamente! 🎉",
        })
      } else {
        setResult({
          success: false,
          message: data.error || "Error enviando email",
        })
      }
    } catch (error) {
      setResult({
        success: false,
        message: "Error de conexión",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Prueba Simple de Email
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="email" className="text-sm font-medium block mb-2">
                Email de destino
              </label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <Button onClick={sendTestEmail} disabled={isLoading} className="w-full">
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
              <p>💡 En modo desarrollo, los emails se simulan y aparecen en la consola.</p>
              <p>🔧 Revisa las herramientas de desarrollador para ver los logs.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}