"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertCircle, Mail, Settings, Zap } from "lucide-react"

interface EmailStatus {
  resendInstalled: boolean
  resendConfigured: boolean
  environmentVariables: {
    RESEND_API_KEY: boolean
    EMAIL_USER: boolean
    EMAIL_PASSWORD: boolean
    SMTP_HOST: boolean
    SMTP_PORT: boolean
    SMTP_SECURE: boolean
    SMTP_USER: boolean
    SMTP_PASSWORD: boolean
  }
  recommendedMethod: string
  canSendEmails: boolean
}

export default function EmailStatusPage() {
  const [status, setStatus] = useState<EmailStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)

  useEffect(() => {
    checkEmailStatus()
  }, [])

  const checkEmailStatus = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/email-status")
      const data = await response.json()
      setStatus(data)
    } catch (error) {
      console.error("Error checking email status:", error)
    } finally {
      setLoading(false)
    }
  }

  const testEmailSystem = async () => {
    try {
      setTesting(true)
      setTestResult(null)

      const response = await fetch("/api/test-email-system", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: "test@example.com",
          subject: "Test Email - Plan A",
        }),
      })

      const result = await response.json()
      setTestResult(result)
    } catch (error) {
      setTestResult({
        success: false,
        error: "Error al probar el sistema de email",
      })
    } finally {
      setTesting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando estado del sistema de emails...</p>
        </div>
      </div>
    )
  }

  if (!status) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error al verificar estado</h2>
            <p className="text-gray-600 mb-4">No se pudo obtener el estado del sistema de emails.</p>
            <Button onClick={checkEmailStatus} className="w-full">
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Estado del Sistema de Emails</h1>
          <p className="text-gray-600">Verificación completa de la configuración de emails para Plan A</p>
        </div>

        {/* Estado General */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Estado General
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                {status.canSendEmails ? (
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                ) : (
                  <AlertCircle className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                )}
                <p className="font-medium">{status.canSendEmails ? "Sistema Operativo" : "Modo Simulación"}</p>
                <p className="text-sm text-gray-600">
                  {status.canSendEmails ? "Emails se envían correctamente" : "Emails se simulan en desarrollo"}
                </p>
              </div>

              <div className="text-center">
                {status.resendInstalled ? (
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                ) : (
                  <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                )}
                <p className="font-medium">Resend SDK</p>
                <p className="text-sm text-gray-600">{status.resendInstalled ? "Instalado" : "No instalado"}</p>
              </div>

              <div className="text-center">
                {status.resendConfigured ? (
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                ) : (
                  <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                )}
                <p className="font-medium">API Key</p>
                <p className="text-sm text-gray-600">{status.resendConfigured ? "Configurada" : "No configurada"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Método Recomendado */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Método de Envío Actual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-lg">{status.recommendedMethod}</p>
                <p className="text-gray-600">
                  {status.recommendedMethod === "Resend SDK" && "Usando la librería oficial de Resend (recomendado)"}
                  {status.recommendedMethod === "Resend API" && "Usando la API de Resend con fetch directo"}
                  {status.recommendedMethod === "Simulación" && "Simulando envío de emails (desarrollo)"}
                </p>
              </div>
              <Badge
                variant={status.canSendEmails ? "default" : "secondary"}
                className={status.canSendEmails ? "bg-green-500" : "bg-yellow-500"}
              >
                {status.canSendEmails ? "Producción" : "Desarrollo"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Variables de Entorno */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Variables de Entorno
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-3">Resend</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">RESEND_API_KEY</span>
                    {status.environmentVariables.RESEND_API_KEY ? (
                      <Badge variant="default" className="bg-green-500">
                        Configurada
                      </Badge>
                    ) : (
                      <Badge variant="secondary">No configurada</Badge>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Gmail/SMTP</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">EMAIL_USER</span>
                    {status.environmentVariables.EMAIL_USER ? (
                      <Badge variant="default" className="bg-green-500">
                        Configurada
                      </Badge>
                    ) : (
                      <Badge variant="secondary">No configurada</Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">EMAIL_PASSWORD</span>
                    {status.environmentVariables.EMAIL_PASSWORD ? (
                      <Badge variant="default" className="bg-green-500">
                        Configurada
                      </Badge>
                    ) : (
                      <Badge variant="secondary">No configurada</Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">SMTP_HOST</span>
                    {status.environmentVariables.SMTP_HOST ? (
                      <Badge variant="default" className="bg-green-500">
                        Configurada
                      </Badge>
                    ) : (
                      <Badge variant="secondary">No configurada</Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prueba del Sistema */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Probar Sistema de Email</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-600">
                Prueba el sistema de envío de emails para verificar que todo funciona correctamente.
              </p>

              <Button onClick={testEmailSystem} disabled={testing} className="w-full md:w-auto">
                {testing ? "Probando..." : "Probar Sistema de Email"}
              </Button>

              {testResult && (
                <div
                  className={`p-4 rounded-lg ${testResult.success ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {testResult.success ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className="font-medium">{testResult.success ? "Prueba Exitosa" : "Prueba Fallida"}</span>
                  </div>
                  <p className="text-sm text-gray-600">{testResult.message || testResult.error}</p>
                  {testResult.provider && (
                    <p className="text-xs text-gray-500 mt-1">Proveedor: {testResult.provider}</p>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recomendaciones */}
        <Card>
          <CardHeader>
            <CardTitle>Recomendaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {!status.resendInstalled && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm">
                    <strong>Instalar Resend:</strong> Ejecuta{" "}
                    <code className="bg-blue-100 px-1 rounded">npm install resend</code> para mejor rendimiento.
                  </p>
                </div>
              )}

              {!status.resendConfigured && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm">
                    <strong>Configurar API Key:</strong> Agrega{" "}
                    <code className="bg-yellow-100 px-1 rounded">RESEND_API_KEY</code> para envío real de emails.
                  </p>
                </div>
              )}

              {status.canSendEmails && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm">
                    <strong>¡Todo listo!</strong> El sistema de emails está configurado correctamente y funcionando.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}