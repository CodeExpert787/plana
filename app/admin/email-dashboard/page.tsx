"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Mail, CheckCircle, AlertCircle, Loader2, Settings, Send, Server, Shield, Info } from "lucide-react"

export default function EmailDashboard() {
  const [testEmail, setTestEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; provider?: string } | null>(null)
  const [configStatus, setConfigStatus] = useState<{
    gmail: boolean
    smtp: boolean
    loading: boolean
  }>({ gmail: false, smtp: false, loading: true })

  // Verificar configuraciones al cargar
  useEffect(() => {
    checkConfigurations()
  }, [])

  const checkConfigurations = async () => {
    setConfigStatus((prev) => ({ ...prev, loading: true }))

    try {
      // Verificar Gmail
      const gmailResponse = await fetch("/api/verify-email-config?provider=gmail")
      const gmailResult = await gmailResponse.json()

      // Verificar SMTP
      const smtpResponse = await fetch("/api/verify-email-config?provider=custom")
      const smtpResult = await smtpResponse.json()

      setConfigStatus({
        gmail: gmailResult.success,
        smtp: smtpResult.success,
        loading: false,
      })
    } catch (error) {
      setConfigStatus({
        gmail: false,
        smtp: false,
        loading: false,
      })
    }
  }

  const sendTestEmail = async (provider: "gmail" | "custom") => {
    if (!testEmail) {
      setTestResult({ success: false, message: "Por favor ingresa un email" })
      return
    }

    setIsLoading(true)
    setTestResult(null)

    try {
      const response = await fetch("/api/test-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: testEmail,
          provider: provider,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setTestResult({
          success: true,
          message: "Email de prueba enviado exitosamente! 🎉",
          provider: provider,
        })
      } else {
        setTestResult({
          success: false,
          message: data.error || "Error enviando email",
          provider: provider,
        })
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: "Error de conexión",
        provider: provider,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const sendBookingTestEmail = async () => {
    if (!testEmail) {
      setTestResult({ success: false, message: "Por favor ingresa un email" })
      return
    }

    setIsLoading(true)
    setTestResult(null)

    // Datos de prueba para simular una reserva completa
    const testBookingData = {
      personalInfo: {
        firstName: "Ana",
        lastName: "García",
        email: testEmail,
        phone: "+54 9 11 1234-5678",
        address: "Av. Bustillo 456, Bariloche",
        emergencyContact: {
          name: "Carlos García",
          phone: "+54 9 11 8765-4321",
        },
      },
      activity: {
        id: "2",
        title: "Trekking al Cerro Campanario",
        duration: "6 horas",
        location: "Cerro Campanario, Bariloche",
        guide: {
          name: "Laura Fernández",
          phone: "+54 9 294 567-8901",
        },
      },
      bookingDetails: {
        confirmationCode: "BRL" + Math.random().toString(36).substr(2, 6).toUpperCase(),
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString("es-ES", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        participants: 3,
        totalPrice: 25000,
      },
    }

    try {
      const response = await fetch("/api/send-confirmation-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testBookingData),
      })

      const data = await response.json()

      if (response.ok) {
        setTestResult({
          success: true,
          message: "Email de confirmación de reserva enviado! 🎉",
        })
      } else {
        setTestResult({
          success: false,
          message: data.error || "Error enviando email de confirmación",
        })
      }
    } catch (error) {
      setTestResult({
        success: false,
        message: "Error de conexión",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Administración - Emails</h1>
          <p className="text-gray-600">Gestiona y prueba la configuración de emails para Plan A</p>
        </div>

        {/* Estado de configuraciones */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <span className="font-medium">Gmail</span>
                </div>
                {configStatus.loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Badge variant={configStatus.gmail ? "default" : "destructive"}>
                    {configStatus.gmail ? "Configurado" : "No configurado"}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Server className="w-5 h-5 text-green-600" />
                  <span className="font-medium">SMTP Custom</span>
                </div>
                {configStatus.loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Badge variant={configStatus.smtp ? "default" : "destructive"}>
                    {configStatus.smtp ? "Configurado" : "No configurado"}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-purple-600" />
                  <span className="font-medium">Estado General</span>
                </div>
                <Badge variant={configStatus.gmail || configStatus.smtp ? "default" : "destructive"}>
                  {configStatus.gmail || configStatus.smtp ? "Operativo" : "Sin configurar"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Panel de pruebas */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Pruebas de Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="test-email" className="text-sm font-medium block mb-2">
                      Email de destino para pruebas
                    </label>
                    <Input
                      id="test-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                    />
                  </div>

                  <Tabs defaultValue="simple" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="simple">Prueba Simple</TabsTrigger>
                      <TabsTrigger value="booking">Confirmación Reserva</TabsTrigger>
                    </TabsList>

                    <TabsContent value="simple" className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          onClick={() => sendTestEmail("gmail")}
                          disabled={isLoading || !configStatus.gmail}
                          variant="outline"
                          size="sm"
                        >
                          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Probar Gmail"}
                        </Button>
                        <Button
                          onClick={() => sendTestEmail("custom")}
                          disabled={isLoading || !configStatus.smtp}
                          variant="outline"
                          size="sm"
                        >
                          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Probar SMTP"}
                        </Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="booking" className="space-y-4">
                      <Button
                        onClick={sendBookingTestEmail}
                        disabled={isLoading || (!configStatus.gmail && !configStatus.smtp)}
                        className="w-full"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Enviando...
                          </>
                        ) : (
                          <>
                            <Mail className="w-4 h-4 mr-2" />
                            Enviar Email de Confirmación de Prueba
                          </>
                        )}
                      </Button>
                    </TabsContent>
                  </Tabs>

                  {testResult && (
                    <Alert className={testResult.success ? "border-green-500" : "border-red-500"}>
                      {testResult.success ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      )}
                      <AlertDescription className={testResult.success ? "text-green-700" : "text-red-700"}>
                        {testResult.message}
                        {testResult.provider && (
                          <span className="block text-xs mt-1">
                            Proveedor: {testResult.provider === "gmail" ? "Gmail" : "SMTP Custom"}
                          </span>
                        )}
                      </AlertDescription>
                    </Alert>
                  )}

                  <Button onClick={checkConfigurations} variant="outline" size="sm" className="w-full">
                    <Settings className="w-4 h-4 mr-2" />
                    Verificar Configuraciones
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Información y guías */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Variables de Entorno Configuradas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Gmail:</h4>
                  <div className="text-xs font-mono bg-gray-100 p-2 rounded space-y-1">
                    <div className="flex justify-between">
                      <span>EMAIL_USER</span>
                      <Badge variant="outline" className="text-xs">
                        ✓ Configurado
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>EMAIL_PASSWORD</span>
                      <Badge variant="outline" className="text-xs">
                        ✓ Configurado
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">SMTP Personalizado:</h4>
                  <div className="text-xs font-mono bg-gray-100 p-2 rounded space-y-1">
                    <div className="flex justify-between">
                      <span>SMTP_HOST</span>
                      <Badge variant="outline" className="text-xs">
                        ✓ Configurado
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>SMTP_PORT</span>
                      <Badge variant="outline" className="text-xs">
                        ✓ Configurado
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>SMTP_SECURE</span>
                      <Badge variant="outline" className="text-xs">
                        ✓ Configurado
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>SMTP_USER</span>
                      <Badge variant="outline" className="text-xs">
                        ✓ Configurado
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>SMTP_PASSWORD</span>
                      <Badge variant="outline" className="text-xs">
                        ✓ Configurado
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Estado del Sistema</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium">Sistema de Emails</span>
                    <Badge className="bg-green-600">Operativo</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm font-medium">Confirmaciones Automáticas</span>
                    <Badge className="bg-blue-600">Activo</Badge>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm font-medium">Templates HTML</span>
                    <Badge className="bg-purple-600">Configurado</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                <strong>¡Todo listo!</strong> El sistema de emails está completamente configurado. Los usuarios
                recibirán automáticamente emails de confirmación al completar sus reservas.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  )
}