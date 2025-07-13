"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getSupabaseStatus, isSupabaseConfigured } from "@/lib/supabase"
import { getActivities, checkSupabaseSchema } from "@/lib/activities-service"

export function SupabaseStatus() {
  const [status, setStatus] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [testResult, setTestResult] = useState<string | null>(null)
  const [rawEnvCheck, setRawEnvCheck] = useState<any>(null)
  const [schemaStatus, setSchemaStatus] = useState<any>(null)

  useEffect(() => {
    checkStatus()
    checkRawEnv()
    checkSchema()
  }, [])

  const checkRawEnv = () => {
    // Verificación directa de las variables
    const rawCheck = {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      urlType: typeof process.env.NEXT_PUBLIC_SUPABASE_URL,
      keyType: typeof process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      urlLength: process.env.NEXT_PUBLIC_SUPABASE_URL?.length || 0,
      keyLength: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
    }
    setRawEnvCheck(rawCheck)
    console.log("🔍 Raw Environment Check:", rawCheck)
  }

  const checkStatus = async () => {
    setIsLoading(true)
    const supabaseStatus = getSupabaseStatus()
    setStatus(supabaseStatus)
    console.log("📊 Supabase Status:", supabaseStatus)
    setIsLoading(false)
  }

  const checkSchema = async () => {
    if (!isSupabaseConfigured()) return

    try {
      const schema = await checkSupabaseSchema()
      setSchemaStatus(schema)
      console.log("🗄️ Schema Status:", schema)
    } catch (error) {
      console.error("❌ Error checking schema:", error)
      setSchemaStatus({ error: `Error verificando schema: ${error}` })
    }
  }

  const testConnection = async () => {
    setIsLoading(true)
    setTestResult(null)

    try {
      console.log("🧪 Testing connection...")
      const activities = await getActivities()
      if (isSupabaseConfigured()) {
        setTestResult(`✅ Conexión exitosa - ${activities.length} actividades obtenidas de Supabase`)
      } else {
        setTestResult(`📦 Modo mock activo - ${activities.length} actividades de ejemplo`)
      }
    } catch (error) {
      console.error("❌ Connection test error:", error)
      setTestResult(`❌ Error en la conexión: ${error}`)
    }

    setIsLoading(false)
  }

  if (isLoading && !status) {
    return (
      <Card className="p-4">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-600"></div>
          <span>Verificando Supabase...</span>
        </div>
      </Card>
    )
  }

  const hasIssues = !status?.configured || !rawEnvCheck?.url || !rawEnvCheck?.key

  return (
    <Card className={`p-4 mb-4 ${hasIssues ? "bg-red-50 border-red-200" : "bg-green-50 border-green-200"}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold flex items-center">
          <span className={`w-3 h-3 rounded-full mr-2 ${status?.configured ? "bg-green-500" : "bg-red-500"}`}></span>
          Estado de Supabase
        </h3>
        <Button onClick={testConnection} disabled={isLoading} size="sm" variant="outline">
          {isLoading ? "Probando..." : "Probar Conexión"}
        </Button>
      </div>

      <div className="space-y-3 text-sm">
        {/* Verificación Raw de Variables */}
        <div className="bg-white p-3 rounded border">
          <h4 className="font-medium mb-2">🔍 Verificación Directa:</h4>
          <div className="space-y-1 font-mono text-xs">
            <div className="flex justify-between">
              <span>URL presente:</span>
              <span className={rawEnvCheck?.url ? "text-green-600" : "text-red-600"}>
                {rawEnvCheck?.url ? "✅ SÍ" : "❌ NO"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>URL tipo:</span>
              <span>{rawEnvCheck?.urlType}</span>
            </div>
            <div className="flex justify-between">
              <span>URL longitud:</span>
              <span>{rawEnvCheck?.urlLength} caracteres</span>
            </div>
            <div className="flex justify-between">
              <span>Key presente:</span>
              <span className={rawEnvCheck?.key ? "text-green-600" : "text-red-600"}>
                {rawEnvCheck?.key ? "✅ SÍ" : "❌ NO"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Key longitud:</span>
              <span>{rawEnvCheck?.keyLength} caracteres</span>
            </div>
          </div>
        </div>

        {/* Estado del Schema */}
        {schemaStatus && (
          <div className="bg-white p-3 rounded border">
            <h4 className="font-medium mb-2">🗄️ Estado del Schema:</h4>
            <div className="space-y-1 font-mono text-xs">
              <div className="flex justify-between">
                <span>Tabla activities:</span>
                <span className={schemaStatus.activitiesTable ? "text-green-600" : "text-red-600"}>
                  {schemaStatus.activitiesTable ? "✅ Existe" : "❌ No existe"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tabla guides:</span>
                <span className={schemaStatus.guidesTable ? "text-green-600" : "text-red-600"}>
                  {schemaStatus.guidesTable ? "✅ Existe" : "❌ No existe"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tiene datos:</span>
                <span className={schemaStatus.hasData ? "text-green-600" : "text-yellow-600"}>
                  {schemaStatus.hasData ? "✅ Sí" : "⚠️ No"}
                </span>
              </div>
              {schemaStatus.error && <div className="text-red-600 text-xs mt-2">Error: {schemaStatus.error}</div>}
            </div>
          </div>
        )}

        {/* Estado del Cliente */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Estado del Cliente:</span>
            <span className={status?.configured ? "text-green-600" : "text-red-600"}>
              {status?.configured ? "✅ Configurado" : "❌ No configurado"}
            </span>
          </div>

          <div className="flex justify-between">
            <span>URL:</span>
            <span className="text-gray-600 font-mono text-xs">{status?.url}</span>
          </div>

          <div className="flex justify-between">
            <span>API Key:</span>
            <span className={status?.hasAnonKey ? "text-green-600" : "text-red-600"}>
              {status?.hasAnonKey ? "✅ Configurada" : "❌ Faltante"}
            </span>
          </div>
        </div>

        {/* Resultado de la Prueba */}
        {testResult && (
          <div className="mt-3 p-3 bg-gray-50 border border-gray-200 rounded-md">
            <p className="text-gray-800 text-xs">{testResult}</p>
          </div>
        )}

        {/* Mensaje de Error */}
        {hasIssues && (
          <div className="mt-3 p-3 bg-red-100 border border-red-300 rounded-md">
            <p className="text-red-800 text-xs font-medium">
              ⚠️ PROBLEMA DETECTADO: Las variables de entorno no se están cargando correctamente.
            </p>
          </div>
        )}

        {/* Mensaje sobre Schema */}
        {schemaStatus && !schemaStatus.activitiesTable && (
          <div className="mt-3 p-3 bg-yellow-100 border border-yellow-300 rounded-md">
            <p className="text-yellow-800 text-xs font-medium">
              ⚠️ SCHEMA NO CONFIGURADO: Las tablas de la base de datos no existen. Necesitas crear el schema en Supabase.
            </p>
          </div>
        )}
      </div>
    </Card>
  )
}