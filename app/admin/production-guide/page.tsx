"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Rocket,
  ArrowRight,
  ExternalLink,
  Settings,
  Monitor,
  Send,
} from "lucide-react"

export default function ProductionGuidePage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">🚀 Guía de Estado de Producción</h1>
        <p className="text-muted-foreground">Esta es una guía de lo que verás en la página de estado de producción</p>
      </div>

      {/* Estado Actual Esperado */}
      <Card className="border-2 border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            Estado Actual Esperado
          </CardTitle>
          <CardDescription>Basado en tu configuración actual, esto es lo que deberías ver</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-white rounded-lg border">
              <div className="text-2xl font-bold text-green-600">production</div>
              <p className="text-sm text-gray-600">Entorno</p>
              <Badge variant="default" className="mt-1">
                ✅ Correcto
              </Badge>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-1" />
              <p className="text-sm text-gray-600">Resend SDK</p>
              <Badge variant="default" className="mt-1">
                ✅ Instalado
              </Badge>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <XCircle className="h-8 w-8 text-red-500 mx-auto mb-1" />
              <p className="text-sm text-gray-600">Dominio</p>
              <Badge variant="destructive" className="mt-1">
                ❌ No Verificado
              </Badge>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border">
              <XCircle className="h-8 w-8 text-red-500 mx-auto mb-1" />
              <p className="text-sm text-gray-600">Producción</p>
              <Badge variant="destructive" className="mt-1">
                ❌ Pendiente
              </Badge>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">📋 Lo que necesitas hacer:</h3>
            <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
              <li>
                Verificar el dominio <code>plana.website</code> en Resend
              </li>
              <li>
                Configurar <code>RESEND_DOMAIN_VERIFIED=true</code>
              </li>
              <li>Probar el sistema completo</li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Variables que verás */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>📊 Variables Principales</CardTitle>
            <CardDescription>Estado actual de las variables críticas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center p-2 bg-green-50 rounded border border-green-200">
              <span className="text-sm font-mono">NODE_ENV</span>
              <Badge variant="default">production</Badge>
            </div>
            <div className="flex justify-between items-center p-2 bg-green-50 rounded border border-green-200">
              <span className="text-sm font-mono">RESEND_API_KEY</span>
              <Badge variant="default">✅ Configurada</Badge>
            </div>
            <div className="flex justify-between items-center p-2 bg-red-50 rounded border border-red-200">
              <span className="text-sm font-mono">RESEND_DOMAIN_VERIFIED</span>
              <Badge variant="destructive">❌ false</Badge>
            </div>
            <div className="flex justify-between items-center p-2 bg-green-50 rounded border border-green-200">
              <span className="text-sm font-mono">RESEND_TEST_EMAIL</span>
              <Badge variant="default">✅ Configurado</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>⚙️ Variables de Producción</CardTitle>
            <CardDescription>Configuración específica para producción</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center p-2 bg-green-50 rounded border border-green-200">
              <span className="text-sm font-mono">PROD_FORCE_EMAIL_SIMULATION</span>
              <Badge variant="default">false</Badge>
            </div>
            <div className="flex justify-between items-center p-2 bg-green-50 rounded border border-green-200">
              <span className="text-sm font-mono">PROD_VERBOSE_LOGS</span>
              <Badge variant="default">false</Badge>
            </div>

            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
              <h4 className="font-semibold text-green-800 text-sm mb-1">✅ Configuración Óptima</h4>
              <p className="text-xs text-green-700">Estas variables están configuradas correctamente para producción</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pestañas disponibles */}
      <Card>
        <CardHeader>
          <CardTitle>📑 Pestañas Disponibles</CardTitle>
          <CardDescription>Funcionalidades que encontrarás en la página</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="border rounded-lg p-4 text-center">
              <Settings className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <h3 className="font-semibold text-sm">Variables</h3>
              <p className="text-xs text-gray-600 mt-1">Estado detallado de todas las variables de entorno</p>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <Send className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <h3 className="font-semibold text-sm">Pruebas</h3>
              <p className="text-xs text-gray-600 mt-1">Pruebas simuladas y reales del sistema</p>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <Monitor className="h-8 w-8 mx-auto mb-2 text-purple-500" />
              <h3 className="font-semibold text-sm">Monitoreo</h3>
              <p className="text-xs text-gray-600 mt-1">Estado en tiempo real del sistema</p>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <div className="text-2xl mb-2">📝</div>
              <h3 className="font-semibold text-sm">Logs</h3>
              <p className="text-xs text-gray-600 mt-1">Ejemplos de logs de producción</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Acciones disponibles */}
      <Card>
        <CardHeader>
          <CardTitle>🎯 Acciones que Puedes Realizar</CardTitle>
          <CardDescription>Botones y funcionalidades disponibles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h3 className="font-semibold">🧪 Pruebas del Sistema</h3>
              <div className="space-y-2">
                <Button className="w-full" variant="outline">
                  <Send className="w-4 h-4 mr-2" />
                  Probar Sistema Completo
                </Button>
                <Button className="w-full" variant="outline">
                  <Monitor className="w-4 h-4 mr-2" />
                  Enviar Email Real
                </Button>
              </div>
              <p className="text-xs text-gray-600">Estas pruebas verifican que todo funcione correctamente</p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">🔧 Configuración</h3>
              <div className="space-y-2">
                <Button className="w-full" variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Actualizar Estado
                </Button>
                <Button className="w-full" variant="outline">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Ver Configuración Completa
                </Button>
              </div>
              <p className="text-xs text-gray-600">Herramientas para gestionar la configuración</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Próximo paso crítico */}
      <Card className="border-2 border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5 text-orange-600" />
            Próximo Paso Crítico
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-orange-800">Verificar Dominio en Resend</h3>
              <p className="text-sm text-orange-700 mt-1">
                Para que el sistema funcione completamente, necesitas verificar el dominio <code>plana.website</code> en
                Resend
              </p>
            </div>
            <ArrowRight className="h-8 w-8 text-orange-500" />
          </div>

          <div className="mt-4 p-3 bg-white border border-orange-200 rounded">
            <h4 className="font-semibold text-sm mb-2">📋 Pasos para verificar:</h4>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>
                Ve a{" "}
                <a
                  href="https://resend.com/domains"
                  target="_blank"
                  className="text-blue-600 underline"
                  rel="noreferrer"
                >
                  resend.com/domains
                </a>
              </li>
              <li>
                Agrega el dominio <code>plana.website</code>
              </li>
              <li>Configura los registros DNS que te proporcionen</li>
              <li>Espera la verificación (puede tomar unos minutos)</li>
              <li>
                Configura <code>RESEND_DOMAIN_VERIFIED=true</code>
              </li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* Botón para ir a la página real */}
      <div className="text-center">
        <Button
          size="lg"
          onClick={() => window.open("/admin/production-status", "_blank")}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          <Monitor className="w-5 h-5 mr-2" />
          Abrir Estado de Producción
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
        <p className="text-sm text-gray-600 mt-2">Haz clic para ver el estado real de tu sistema</p>
      </div>
    </div>
  )
}