import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function PoliticaCancelacionPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white p-4 border-b">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-emerald-600"
            >
              <path
                d="M22 20L14.5 10L10.5 15L8 12L2 20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M2 20H22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6">
          <div className="mb-6">
            <Link href="/booking/confirmation">
              <Button variant="ghost" size="sm" className="mb-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a la confirmación
              </Button>
            </Link>
            <h1 className="text-2xl font-bold text-center text-emerald-700 mb-6">Política de Cancelación – PLAN A</h1>
            <p className="text-gray-600 mb-6">
              En Plan A queremos que vivas una experiencia segura y justa, tanto si sos viajero como guía. Por eso,
              nuestras condiciones de cancelación son claras y simples:
            </p>

            <div className="space-y-6">
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h2 className="text-lg font-bold text-emerald-700 mb-3">✅ Cancelaciones por parte del cliente</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-gray-800">Con más de 7 días de anticipación:</h3>
                    <p className="text-gray-700">Se reintegra el 100% del monto abonado.</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Entre 3 y 7 días de anticipación:</h3>
                    <p className="text-gray-700">Se reintegra el 50% del monto abonado.</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Con menos de 72 horas de anticipación:</h3>
                    <p className="text-gray-700">No se realiza reintegro. Sin excepciones.</p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h2 className="text-lg font-bold text-blue-700 mb-3">✅ Cancelaciones por causas de fuerza mayor</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-gray-700">
                      Si la actividad se suspende por condiciones climáticas extremas, cierres de caminos o senderos
                      oficiales, o motivos de seguridad, se reintegrará el 100% del monto abonado o se ofrecerá la
                      reprogramación sin costo adicional.
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-700">
                      En caso de enfermedad del usuario (debidamente justificada con certificado médico), se reintegrará
                      el 60% del monto abonado.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border">
                <h2 className="text-lg font-bold text-gray-800 mb-3">Notas importantes</h2>
                <ul className="space-y-2 list-disc pl-5 text-gray-700">
                  <li>Los reintegros se realizan al mismo medio de pago y pueden demorar hasta 10 días hábiles.</li>
                  <li>
                    Para cancelar o reprogramar, escribinos por WhatsApp o mail con tu número de reserva y el motivo.
                  </li>
                  <li>Las solicitudes se procesan de lunes a viernes de 9 a 18 h.</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link href="/booking/confirmation">
              <Button>Volver a la confirmación de reserva</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}