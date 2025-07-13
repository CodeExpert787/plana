"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function EnvDiagnostics() {
  const [envVars, setEnvVars] = useState<any>(null)
  const [processEnv, setProcessEnv] = useState<any>(null)

  useEffect(() => {
    // Verificar todas las variables de entorno disponibles
    const allEnvVars = {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      NODE_ENV: process.env.NODE_ENV,
    }

    setEnvVars(allEnvVars)

    // Mostrar todas las variables que empiecen con NEXT_PUBLIC
    const allPublicVars = Object.keys(process.env)
      .filter((key) => key.startsWith("NEXT_PUBLIC"))
      .reduce((obj: any, key) => {
        obj[key] = process.env[key]
        return obj
      }, {})

    setProcessEnv(allPublicVars)
  }, [])

  const copyToClipboard = () => {
    const diagnosticInfo = {
      envVars,
      processEnv,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
    }
    navigator.clipboard.writeText(JSON.stringify(diagnosticInfo, null, 2))
    alert("Información de diagnóstico copiada al portapapeles")
  }

  return (
    <Card className="p-4 mb-4 bg-red-50 border-red-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-red-800">🔍 Diagnóstico de Variables de Entorno</h3>
        <Button onClick={copyToClipboard} size="sm" variant="outline">
          Copiar Info
        </Button>
      </div>

      <div className="space-y-4 text-sm">
        <div>
          <h4 className="font-medium text-red-700 mb-2">Variables Específicas:</h4>
          <div className="bg-white p-3 rounded border font-mono text-xs">
            <div className="grid grid-cols-1 gap-1">
              <div>
                <span className="text-gray-600">NEXT_PUBLIC_SUPABASE_URL:</span>
                <br />
                <span className={envVars?.NEXT_PUBLIC_SUPABASE_URL ? "text-green-600" : "text-red-600"}>
                  {envVars?.NEXT_PUBLIC_SUPABASE_URL || "❌ UNDEFINED"}
                </span>
              </div>
              <div className="mt-2">
                <span className="text-gray-600">NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>
                <br />
                <span className={envVars?.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "text-green-600" : "text-red-600"}>
                  {envVars?.NEXT_PUBLIC_SUPABASE_ANON_KEY
                    ? `${envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)}...`
                    : "❌ UNDEFINED"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-red-700 mb-2">Todas las Variables NEXT_PUBLIC:</h4>
          <div className="bg-white p-3 rounded border font-mono text-xs max-h-40 overflow-y-auto">
            {processEnv && Object.keys(processEnv).length > 0 ? (
              Object.entries(processEnv).map(([key, value]) => (
                <div key={key} className="mb-1">
                  <span className="text-blue-600">{key}:</span>{" "}
                  <span className="text-gray-800">
                    {typeof value === "string" && value.length > 30 ? `${value.substring(0, 30)}...` : String(value)}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-red-600">❌ No se encontraron variables NEXT_PUBLIC</div>
            )}
          </div>
        </div>

        <div className="bg-yellow-100 p-3 rounded border border-yellow-300">
          <h4 className="font-medium text-yellow-800 mb-2">💡 Posibles Causas:</h4>
          <ul className="text-yellow-700 text-xs space-y-1">
            <li>• Las variables no están en el archivo .env.local</li>
            <li>• El archivo .env.local no está en la raíz del proyecto</li>
            <li>• Falta reiniciar el servidor de desarrollo</li>
            <li>• Las variables no tienen el prefijo NEXT_PUBLIC_</li>
            <li>• Hay espacios o caracteres especiales en los valores</li>
          </ul>
        </div>

        <div className="bg-blue-100 p-3 rounded border border-blue-300">
          <h4 className="font-medium text-blue-800 mb-2">🔧 Soluciones:</h4>
          <ol className="text-blue-700 text-xs space-y-1">
            <li>1. Verifica que el archivo .env.local existe en la raíz</li>
            <li>2. Asegúrate de que las variables empiecen con NEXT_PUBLIC_</li>
            <li>3. Reinicia el servidor: npm run dev</li>
            <li>4. Verifica que no hay espacios extra en los valores</li>
          </ol>
        </div>
      </div>
    </Card>
  )
}