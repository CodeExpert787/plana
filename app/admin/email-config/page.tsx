"use client"

import EmailTestPanel from "@/components/email-test-panel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info, Settings, Mail } from "lucide-react"

export default function EmailConfigPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Configuración de Email</h1>
          <p className="text-gray-600">Configura y prueba el envío de emails con Nodemailer</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Panel de prueba */}
          <div>
            <EmailTestPanel />
          </div>

          {/* Instrucciones */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Configuración para Gmail
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    Para usar Gmail, necesitas generar una "Contraseña de aplicación" en lugar de tu contraseña normal.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3 text-sm">
                  <h4 className="font-medium">Pasos para configurar Gmail:</h4>
                  <ol className="list-decimal list-inside space-y-2">
                    <li>Ve a tu cuenta de Google → Seguridad</li>
                    <li>Activa la verificación en 2 pasos</li>
                    <li>Genera una "Contraseña de aplicación"</li>
                    <li>Usa esa contraseña en EMAIL_PASSWORD</li>
                  </ol>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Variables de Entorno
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm font-mono bg-gray-100 p-3 rounded">
                  <div>EMAIL_USER=tu@gmail.com</div>
                  <div>EMAIL_PASSWORD=tu_contraseña_de_aplicacion</div>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                  <h4 className="font-medium">Para otros proveedores SMTP:</h4>
                  <div className="font-mono bg-gray-100 p-3 rounded space-y-1">
                    <div>SMTP_HOST=smtp.tuproveedor.com</div>
                    <div>SMTP_PORT=587</div>
                    <div>SMTP_SECURE=false</div>
                    <div>SMTP_USER=tu@email.com</div>
                    <div>SMTP_PASSWORD=tu_contraseña</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Proveedores Soportados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Gmail</span>
                    <span className="text-green-600">✓ Configurado</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Outlook/Hotmail</span>
                    <span className="text-green-600">✓ Soportado</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Yahoo</span>
                    <span className="text-green-600">✓ Soportado</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SMTP Personalizado</span>
                    <span className="text-green-600">✓ Soportado</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}