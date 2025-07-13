import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Settings, BarChart3, Users, Calendar, Shield } from "lucide-react"

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="container max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h1>
          <p className="text-gray-600">Gestiona todos los aspectos de Plan A - Aventuras en Bariloche</p>
        </div>

        {/* Admin Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Email Management */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600" />
                Gestión de Emails
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Configura, prueba y gestiona el sistema de emails automáticos para confirmaciones de reserva.
              </p>
              <Link href="/admin/email-dashboard">
                <Button className="w-full">
                  <Mail className="w-4 h-4 mr-2" />
                  Abrir Panel de Emails
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Reservations Management */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-600" />
                Reservas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Visualiza y gestiona todas las reservas realizadas por los usuarios.</p>
              <Button variant="outline" className="w-full" disabled>
                <Calendar className="w-4 h-4 mr-2" />
                Próximamente
              </Button>
            </CardContent>
          </Card>

          {/* Analytics */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Analíticas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Estadísticas de uso, actividades más populares y métricas de conversión.
              </p>
              <Button variant="outline" className="w-full" disabled>
                <BarChart3 className="w-4 h-4 mr-2" />
                Próximamente
              </Button>
            </CardContent>
          </Card>

          {/* User Management */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-600" />
                Usuarios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Gestiona usuarios registrados, guías y perfiles de la plataforma.</p>
              <Button variant="outline" className="w-full" disabled>
                <Users className="w-4 h-4 mr-2" />
                Próximamente
              </Button>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-gray-600" />
                Configuración
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Configuraciones generales de la aplicación y parámetros del sistema.</p>
              <Button variant="outline" className="w-full" disabled>
                <Settings className="w-4 h-4 mr-2" />
                Próximamente
              </Button>
            </CardContent>
          </Card>

          {/* Security */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-600" />
                Seguridad
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Logs de seguridad, autenticación y control de acceso administrativo.</p>
              <Button variant="outline" className="w-full" disabled>
                <Shield className="w-4 h-4 mr-2" />
                Próximamente
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <Link href="/admin/email-dashboard">
                  <Button variant="outline" className="w-full">
                    <Mail className="w-4 h-4 mr-2" />
                    Probar Emails
                  </Button>
                </Link>
                <Link href="/test-email">
                  <Button variant="outline" className="w-full">
                    <Mail className="w-4 h-4 mr-2" />
                    Email Simple
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full">
                    <Calendar className="w-4 h-4 mr-2" />
                    Ver App
                  </Button>
                </Link>
                <Button variant="outline" className="w-full" disabled>
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Reportes
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Overview */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Estado del Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">✅</div>
                  <div className="text-sm font-medium">Emails</div>
                  <div className="text-xs text-gray-600">Operativo</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">🚀</div>
                  <div className="text-sm font-medium">App</div>
                  <div className="text-xs text-gray-600">En línea</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">📱</div>
                  <div className="text-sm font-medium">Mobile</div>
                  <div className="text-xs text-gray-600">Responsive</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">⚡</div>
                  <div className="text-sm font-medium">Performance</div>
                  <div className="text-xs text-gray-600">Optimizado</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}