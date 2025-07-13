"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Settings, Zap, Mail, Code } from "lucide-react"

export default function DevConfigPage() {
  const [config, setConfig] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simular carga de configuración
    setTimeout(() => {
      setConfig({
        environment: "development",
        nodeEnv: process.env.NODE_ENV || "development",
        hasResendKey: !!process.env.RESEND_API_KEY,
        resendTestMode: true,
        shouldSimulate: false,
        verboseLogs: true,
        simulateDelay: true,
        subjectPrefix: "[DEV]",
        fromAddress: "Plan A <noreply@plana.website>",
        testEmail: "orion2000wcse@gmail.com",
      })
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p>Cargando configuración de desarrollo...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Configuración de Desarrollo</h1>
          <p className="text-muted-foreground">Configuración optimizada para desarrollo local</p>
        </div>
        <Badge variant="outline" className="bg-blue-50">
          <Code className="w-4 h-4 mr-1" />
          {config?.environment}
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Vista General</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
          <TabsTrigger value="env">Variables</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Entorno
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">NODE_ENV:</span>
                    <Badge variant="outline">{config?.nodeEnv}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Modo:</span>
                    <Badge variant="default">Desarrollo</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Email
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Resend:</span>
                    <Badge variant={config?.hasResendKey ? "default" : "secondary"}>
                      {config?.hasResendKey ? "Configurado" : "No configurado"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Simulación:</span>
                    <Badge variant={config?.shouldSimulate ? "secondary" : "default"}>
                      {config?.shouldSimulate ? "Activa" : "Desactivada"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Estado
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Logs:</span>
                    <Badge variant="default">Activos</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Delay:</span>
                    <Badge variant="outline">Simulado</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>🚀 Configuración Recomendada para Desarrollo</CardTitle>
              <CardDescription>Esta configuración está optimizada para desarrollo local</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h3 className="font-semibold text-green-600">✅ Configurado Correctamente</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Remitente: {config?.fromAddress}</li>
                    <li>• Prefijo de asunto: {config?.subjectPrefix}</li>
                    <li>• Logs detallados activados</li>
                    <li>• Simulación de delay activada</li>
                    <li>• Email de prueba configurado</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-blue-600">ℹ️ Información</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Emails redirigidos a: {config?.testEmail}</li>
                    <li>• Modo de prueba de Resend activo</li>
                    <li>• Fallback a simulación disponible</li>
                    <li>• Logs visibles en consola</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>📧 Configuración de Email</CardTitle>
              <CardDescription>Configuración específica para el sistema de emails en desarrollo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Remitente (FROM)</Label>
                    <Input value={config?.fromAddress} readOnly className="mt-1" />
                    <p className="text-xs text-muted-foreground mt-1">Dirección que aparece como remitente</p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Email de Prueba</Label>
                    <Input value={config?.testEmail} readOnly className="mt-1" />
                    <p className="text-xs text-muted-foreground mt-1">
                      Todos los emails se redirigen aquí en modo de prueba
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Prefijo de Asunto</Label>
                    <Input value={config?.subjectPrefix} readOnly className="mt-1" />
                    <p className="text-xs text-muted-foreground mt-1">Se agrega automáticamente a todos los asuntos</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Simulación Forzada</Label>
                      <p className="text-xs text-muted-foreground">Simular todos los emails sin enviarlos</p>
                    </div>
                    <Switch checked={config?.shouldSimulate} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Logs Detallados</Label>
                      <p className="text-xs text-muted-foreground">Mostrar información detallada en consola</p>
                    </div>
                    <Switch checked={config?.verboseLogs} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Simular Delay</Label>
                      <p className="text-xs text-muted-foreground">Simular tiempo de envío real</p>
                    </div>
                    <Switch checked={config?.simulateDelay} />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-800">Modo de Desarrollo Activo</h3>
                    <p className="text-sm text-blue-700 mt-1">
                      En desarrollo, todos los emails incluyen información adicional sobre el destinatario original y se
                      redirigen al email de prueba configurado para evitar envíos accidentales.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>📊 Configuración de Logs</CardTitle>
              <CardDescription>Logs optimizados para desarrollo y debugging</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 border rounded-lg p-4">
                <h3 className="font-semibold mb-3">Logs que verás en la consola:</h3>
                <div className="space-y-2 font-mono text-sm">
                  <div className="text-blue-600">🔧 [DEV] Resend SDK inicializado correctamente</div>
                  <div className="text-blue-600">🔧 [DEV] 📧 Iniciando envío de email...</div>
                  <div className="text-blue-600">🔧 [DEV] 📧 Para: test@example.com</div>
                  <div className="text-blue-600">🔧 [DEV] 📧 Desde: Plan A &lt;noreply@plana.website&gt;</div>
                  <div className="text-yellow-600">🔧 [DEV] ⚠️ Modo de prueba: Redirigiendo email...</div>
                  <div className="text-green-600">✅ [DEV] Email enviado exitosamente con Resend SDK</div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-green-600 mb-2">✅ Logs de Éxito</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Inicialización de Resend</li>
                    <li>• Email enviado correctamente</li>
                    <li>• Simulación completada</li>
                    <li>• Configuración cargada</li>
                  </ul>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-red-600 mb-2">❌ Logs de Error</h3>
                  <ul className="text-sm space-y-1">
                    <li>• Errores de API de Resend</li>
                    <li>• Problemas de configuración</li>
                    <li>• Fallos de red</li>
                    <li>• Datos incompletos</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="env" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>🔧 Variables de Entorno</CardTitle>
              <CardDescription>Variables necesarias para el funcionamiento en desarrollo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Variables Actuales:</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">NODE_ENV</code>
                      <Badge variant="outline">{config?.nodeEnv}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">RESEND_API_KEY</code>
                      <Badge variant={config?.hasResendKey ? "default" : "secondary"}>
                        {config?.hasResendKey ? "Configurada" : "No configurada"}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">RESEND_DOMAIN_VERIFIED</code>
                      <Badge variant="secondary">false</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">RESEND_TEST_EMAIL</code>
                      <Badge variant="outline">{config?.testEmail}</Badge>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h3 className="font-semibold text-yellow-800 mb-2">💡 Variables Opcionales para Desarrollo</h3>
                  <div className="space-y-1 text-sm text-yellow-700">
                    <div>
                      <code>DEV_FORCE_EMAIL_SIMULATION=true</code> - Forzar simulación
                    </div>
                    <div>
                      <code>DEV_TEST_EMAIL=tu@email.com</code> - Email de desarrollo personalizado
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}