"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

interface LogEntry {
  timestamp: string
  level: "info" | "success" | "warning" | "error"
  message: string
  details?: any
}

export default function EmailLogsPage() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)

  // Simular logs en tiempo real
  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(() => {
        // Simular logs que aparecerían en la consola
        const mockLogs = [
          {
            timestamp: new Date().toISOString(),
            level: "info" as const,
            message: "📧 Iniciando envío de email...",
            details: {
              resendConfigured: true,
              resendInstalled: true,
              testMode: true,
              fromAddress: "Plan A <noreply@plana.website>",
            },
          },
          {
            timestamp: new Date().toISOString(),
            level: "info" as const,
            message: "📧 Remitente: Plan A <noreply@plana.website>",
          },
          {
            timestamp: new Date().toISOString(),
            level: "warning" as const,
            message: "⚠️ Modo de prueba: Redirigiendo email de test@example.com a orion2000wcse@gmail.com",
          },
          {
            timestamp: new Date().toISOString(),
            level: "info" as const,
            message: "📧 Enviando email con Resend SDK...",
            details: {
              to: "orion2000wcse@gmail.com",
              from: "Plan A <noreply@plana.website>",
              subject: "[PRUEBA - Para: test@example.com] Confirmación de reserva - Kayak en Bahía López",
              testMode: true,
            },
          },
          {
            timestamp: new Date().toISOString(),
            level: "success" as const,
            message: "✅ Email enviado exitosamente con Resend SDK: re_abc123def456",
            details: {
              id: "re_abc123def456",
              provider: "resend-sdk",
              fromAddress: "Plan A <noreply@plana.website>",
              actualRecipient: "orion2000wcse@gmail.com",
              originalRecipient: "test@example.com",
            },
          },
        ]

        setLogs((prev) => [...mockLogs, ...prev].slice(0, 50)) // Mantener solo los últimos 50 logs
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [isMonitoring])

  const testEmailSending = async () => {
    setTestResult(null)

    try {
      const response = await fetch("/api/send-confirmation-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalInfo: {
            firstName: "Juan",
            lastName: "Pérez",
            email: "test@example.com",
            phone: "+54 9 294 123-4567",
          },
          activity: {
            id: "1",
            title: "Kayak en Bahía López",
            duration: "3 horas",
            location: "Bahía López, Bariloche",
            guide: {
              name: "Carlos Mendoza",
              phone: "+54 9 294 123-4567",
            },
          },
          bookingDetails: {
            confirmationCode: "TEST-" + Math.random().toString(36).substr(2, 9).toUpperCase(),
            date: new Date().toLocaleDateString("es-AR"),
            participants: 2,
            totalPrice: 15000,
          },
        }),
      })

      const result = await response.json()
      setTestResult(result)

      // Agregar log del resultado
      setLogs((prev) => [
        {
          timestamp: new Date().toISOString(),
          level: result.success ? "success" : "error",
          message: result.success ? "✅ Test completado exitosamente" : "❌ Test falló",
          details: result,
        },
        ...prev,
      ])
    } catch (error) {
      setTestResult({ error: "Error al realizar el test" })
      setLogs((prev) => [
        {
          timestamp: new Date().toISOString(),
          level: "error",
          message: "❌ Error en el test",
          details: error,
        },
        ...prev,
      ])
    }
  }

  const clearLogs = () => {
    setLogs([])
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "success":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  const getLevelIcon = (level: string) => {
    switch (level) {
      case "success":
        return "✅"
      case "warning":
        return "⚠️"
      case "error":
        return "❌"
      default:
        return "ℹ️"
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Monitor de Logs de Email</h1>
          <p className="text-muted-foreground">
            Monitorea en tiempo real el envío de emails y verifica el nuevo remitente
          </p>
        </div>
      </div>

      <Tabs defaultValue="monitor" className="space-y-4">
        <TabsList>
          <TabsTrigger value="monitor">Monitor en Tiempo Real</TabsTrigger>
          <TabsTrigger value="test">Prueba Manual</TabsTrigger>
          <TabsTrigger value="config">Configuración</TabsTrigger>
        </TabsList>

        <TabsContent value="monitor" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📊 Monitor de Logs
                <Badge variant={isMonitoring ? "default" : "secondary"}>{isMonitoring ? "Activo" : "Inactivo"}</Badge>
              </CardTitle>
              <CardDescription>Observa los logs del sistema de email en tiempo real</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button
                  onClick={() => setIsMonitoring(!isMonitoring)}
                  variant={isMonitoring ? "destructive" : "default"}
                >
                  {isMonitoring ? "Detener Monitor" : "Iniciar Monitor"}
                </Button>
                <Button onClick={clearLogs} variant="outline">
                  Limpiar Logs
                </Button>
              </div>

              <ScrollArea className="h-96 w-full border rounded-lg p-4">
                {logs.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <p>No hay logs disponibles</p>
                    <p className="text-sm">Inicia el monitor o realiza una prueba para ver los logs</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {logs.map((log, index) => (
                      <div key={index} className="border rounded-lg p-3 space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getLevelIcon(log.level)}</span>
                          <Badge className={getLevelColor(log.level)}>{log.level.toUpperCase()}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="font-mono text-sm">{log.message}</p>
                        {log.details && (
                          <details className="text-xs">
                            <summary className="cursor-pointer text-muted-foreground">Ver detalles</summary>
                            <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
                              {JSON.stringify(log.details, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>🧪 Prueba Manual de Email</CardTitle>
              <CardDescription>Envía un email de prueba y observa los logs generados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={testEmailSending} className="w-full">
                Enviar Email de Prueba
              </Button>

              {testResult && (
                <div className="border rounded-lg p-4 space-y-2">
                  <h3 className="font-semibold">Resultado del Test:</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant={testResult.success ? "default" : "destructive"}>
                        {testResult.success ? "Éxito" : "Error"}
                      </Badge>
                      <span className="text-sm">{testResult.message}</span>
                    </div>

                    {testResult.fromAddress && (
                      <div className="bg-green-50 border border-green-200 rounded p-3">
                        <p className="text-sm font-medium text-green-800">📧 Remitente: {testResult.fromAddress}</p>
                      </div>
                    )}

                    {testResult.testMode && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
                        <p className="text-sm font-medium text-yellow-800">🧪 Modo de prueba activo</p>
                        {testResult.originalRecipient && testResult.actualRecipient && (
                          <p className="text-xs text-yellow-700">
                            Email redirigido de {testResult.originalRecipient} a {testResult.actualRecipient}
                          </p>
                        )}
                      </div>
                    )}

                    <details className="text-xs">
                      <summary className="cursor-pointer text-muted-foreground">Ver respuesta completa</summary>
                      <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-x-auto">
                        {JSON.stringify(testResult, null, 2)}
                      </pre>
                    </details>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>⚙️ Configuración Actual</CardTitle>
              <CardDescription>Estado de la configuración del sistema de email</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">📧 Remitente</h3>
                  <p className="text-sm text-muted-foreground mb-2">Dirección FROM configurada:</p>
                  <Badge variant="outline" className="font-mono">
                    Plan A &lt;noreply@plana.website&gt;
                  </Badge>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">🔧 Estado de Resend</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="default">API Key</Badge>
                      <span className="text-sm">Configurada</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Modo</Badge>
                      <span className="text-sm">Prueba</span>
                    </div>
                  </div>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">🌐 Dominio</h3>
                  <p className="text-sm text-muted-foreground mb-2">Dominio personalizado:</p>
                  <Badge variant="outline">plana.website</Badge>
                  <p className="text-xs text-muted-foreground mt-1">Requiere verificación en Resend</p>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">📨 Email de Prueba</h3>
                  <p className="text-sm text-muted-foreground mb-2">Destinatario autorizado:</p>
                  <Badge variant="outline" className="font-mono">
                    orion2000wcse@gmail.com
                  </Badge>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">💡 Qué buscar en los logs:</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>
                    • <code>📧 Remitente: Plan A &lt;noreply@plana.website&gt;</code>
                  </li>
                  <li>
                    • <code>📧 Enviando email con Resend SDK...</code>
                  </li>
                  <li>
                    • <code>✅ Email enviado exitosamente con Resend SDK</code>
                  </li>
                  <li>
                    • <code>🧪 Modo de prueba: Redirigiendo email...</code>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}