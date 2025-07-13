"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

export function TermsAndConditionsModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Ver términos y condiciones
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl">Cláusula de Deslinde de Responsabilidad</DialogTitle>
          <DialogDescription className="text-center">
            Por favor lee atentamente los siguientes términos y condiciones
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-bold mb-2">Responsabilidad de la Plataforma:</h3>
              <p>
                La plataforma "PLAN A" actúa únicamente como intermediaria entre los usuarios (consumidores) y los
                prestadores de servicios de actividades turísticas (guías). "PLAN A" no asume ninguna responsabilidad
                por los accidentes, daños o perjuicios que puedan surgir como consecuencia de la realización de las
                actividades contratadas a través de la plataforma.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-2">Responsabilidad del Prestador:</h3>
              <p>
                Los prestadores de servicios (guías) son responsables por la correcta ejecución de las actividades que
                ofrecen en la plataforma, así como por el cumplimiento de las normativas de seguridad, permisos,
                licencias y seguros exigidos por la legislación vigente en la Provincia de Río Negro y la normativa
                nacional aplicable. Los prestadores deberán contar con seguros de responsabilidad civil y accidentes
                personales que cubran cualquier incidente durante la realización de la actividad.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-2">Responsabilidad del Usuario:</h3>
              <p>
                El usuario es responsable de seguir las instrucciones del guía y de cumplir con las condiciones de
                seguridad requeridas para cada actividad. El usuario reconoce que las actividades ofrecidas en la
                plataforma pueden implicar riesgos inherentes, como lesiones o daños a la propiedad, y acepta participar
                en las mismas bajo su propio riesgo.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-2">Exoneración de Responsabilidad de la Plataforma:</h3>
              <p>
                El usuario entiende y acepta que "PLAN A" no se hace responsable de ninguna lesión, daño, pérdida, robo,
                accidente o cualquier otro perjuicio que pudiera ocurrir durante la realización de las actividades
                contratadas a través de la plataforma. El usuario acepta que cualquier reclamo relacionado con
                accidentes o daños derivados de las actividades será dirigido exclusivamente al prestador de servicios.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-2">Seguro de Responsabilidad:</h3>
              <p>
                Es recomendable que los usuarios contraten un seguro personal adicional para cubrir riesgos que no estén
                cubiertos por el seguro del prestador de servicios. "PLAN A" no se hace responsable de la falta de
                cobertura o de cualquier pérdida no cubierta por los seguros del prestador.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-2">Consideraciones Adicionales:</h3>
              <p>
                <strong>Verificación de los Prestadores:</strong> "PLAN A" realiza una verificación previa de la
                documentación de los prestadores antes de permitirles ofrecer sus servicios en la plataforma. Sin
                embargo, el usuario es responsable de evaluar el perfil del prestador y la actividad ofrecida antes de
                realizar la reserva. "PLAN A" no garantiza que la información proporcionada por los prestadores sea
                completa o esté libre de errores.
              </p>
              <p className="mt-2">
                <strong>Consentimiento Informado:</strong> Antes de completar cualquier reserva, el usuario debe aceptar
                explícitamente esta cláusula de responsabilidad, lo cual implica que ha leído y comprendido los riesgos
                inherentes a las actividades que se van a realizar. Este consentimiento informado es un requisito para
                poder completar el proceso de contratación de la actividad a través de la plataforma.
              </p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}