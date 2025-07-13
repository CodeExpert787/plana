import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileCheck, FileText, Upload, Shield, CheckCircle } from "lucide-react"

export default function VerificationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-sky-50 p-4">
      <div className="max-w-md mx-auto">
        <div className="flex items-center mb-6">
          <button className="p-2 mr-2 rounded-full bg-white shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <h1 className="text-xl font-bold">Verificación de Guía PLAN A</h1>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mr-4">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-semibold">Proceso de Verificación</h2>
              <p className="text-sm text-gray-600">
                Complete los siguientes pasos para verificarse como guía en nuestra plataforma.
              </p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-4 gap-2">
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-sm">
                1
              </div>
              <p className="text-xs mt-1 text-center">Datos Personales</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-sm">
                2
              </div>
              <p className="text-xs mt-1 text-center">Certificaciones</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-sm">
                3
              </div>
              <p className="text-xs mt-1 text-center">Contrato</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-sm">
                4
              </div>
              <p className="text-xs mt-1 text-center">Revisión</p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Datos</TabsTrigger>
            <TabsTrigger value="certifications" disabled>
              Certificaciones
            </TabsTrigger>
            <TabsTrigger value="contract" disabled>
              Contrato
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Datos Personales</CardTitle>
                <CardDescription>
                  Ingrese sus datos personales para comenzar el proceso de verificación.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nombre</Label>
                    <Input id="firstName" placeholder="Ingrese su nombre" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Apellido</Label>
                    <Input id="lastName" placeholder="Ingrese su apellido" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input id="email" type="email" placeholder="correo@ejemplo.com" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" placeholder="+54 9 XXX XXX XXXX" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dni">DNI / Pasaporte</Label>
                  <Input id="dni" placeholder="Ingrese su número de documento" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input id="address" placeholder="Ingrese su dirección completa" />
                </div>

                <Separator className="my-4" />

                <div className="space-y-2">
                  <Label>Documento de Identidad</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="w-8 h-8 mx-auto text-gray-400" />
                    <p className="mt-2 text-sm text-gray-600">Suba una foto de su DNI o pasaporte</p>
                    <p className="text-xs text-gray-500 mt-1">Formatos aceptados: JPG, PNG, PDF (máx. 5MB)</p>
                    <Button variant="outline" size="sm" className="mt-4">
                      Seleccionar archivo
                    </Button>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Continuar</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="certifications">
            <Card>
              <CardHeader>
                <CardTitle>Certificaciones</CardTitle>
                <CardDescription>Suba sus certificaciones y licencias que lo habilitan como guía.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start">
                      <FileCheck className="w-6 h-6 text-emerald-600 mr-3" />
                      <div className="flex-1">
                        <h3 className="font-medium">Certificación de Guía</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Suba su certificación oficial como guía de turismo o actividades de aventura.
                        </p>
                        <Button variant="outline" size="sm" className="mt-2">
                          Subir certificado
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start">
                      <FileCheck className="w-6 h-6 text-emerald-600 mr-3" />
                      <div className="flex-1">
                        <h3 className="font-medium">Primeros Auxilios</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Suba su certificación de primeros auxilios vigente.
                        </p>
                        <Button variant="outline" size="sm" className="mt-2">
                          Subir certificado
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-start">
                      <FileCheck className="w-6 h-6 text-emerald-600 mr-3" />
                      <div className="flex-1">
                        <h3 className="font-medium">Certificaciones Adicionales</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Suba cualquier certificación adicional relevante para su actividad.
                        </p>
                        <Button variant="outline" size="sm" className="mt-2">
                          Subir certificado
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Atrás</Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700">Continuar</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="contract">
            <Card>
              <CardHeader>
                <CardTitle>Contrato y Responsabilidad</CardTitle>
                <CardDescription>Lea y acepte nuestros términos de responsabilidad civil y seguridad.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 border rounded-lg mb-4">
                  <div className="flex items-start">
                    <FileText className="w-6 h-6 text-emerald-600 mr-3" />
                    <div>
                      <h3 className="font-medium">Contrato de Responsabilidad Civil</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Este contrato establece sus responsabilidades como guía en nuestra plataforma.
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Ver contrato
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-4 border rounded-lg mb-4">
                  <div className="flex items-start">
                    <FileText className="w-6 h-6 text-emerald-600 mr-3" />
                    <div>
                      <h3 className="font-medium">Normas de Seguridad</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Normas y protocolos de seguridad que debe cumplir en todas las actividades.
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        Ver normas
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-start">
                    <CheckCircle className="w-6 h-6 text-blue-600 mr-3" />
                    <div>
                      <h3 className="font-medium text-blue-800">Confirmación</h3>
                      <p className="text-sm text-blue-600 mt-1">
                        Al continuar, confirma que ha leído y acepta los términos del contrato de responsabilidad civil
                        y se compromete a cumplir con todas las normas de seguridad establecidas para las actividades
                        que ofrecerá en la plataforma.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Atrás</Button>
                <Button className="bg-emerald-600 hover:bg-emerald-700">Aceptar y Continuar</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}