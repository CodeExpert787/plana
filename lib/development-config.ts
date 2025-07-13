// Configuración específica para desarrollo
export const isDevelopment = process.env.NODE_ENV === "development"
export const isProduction = process.env.NODE_ENV === "production"

// Configuración de email para desarrollo
export const developmentEmailConfig = {
  // En desarrollo, simular siempre a menos que se especifique lo contrario
  forceSimulation: process.env.DEV_FORCE_EMAIL_SIMULATION === "true",

  // Email de desarrollo para pruebas
  devTestEmail: process.env.DEV_TEST_EMAIL || "dev@plana.website",

  // Mostrar logs detallados en desarrollo
  verboseLogs: true,

  // Simular delays para testing
  simulateDelay: true,

  // Prefijo para emails de desarrollo
  subjectPrefix: "[DEV]",
}

// Función para determinar si debemos simular emails
export function shouldSimulateEmails(): boolean {
  if (!isDevelopment) return false

  // Si está forzada la simulación, simular
  if (developmentEmailConfig.forceSimulation) return true

  // Si no hay configuración de Resend, simular
  if (!process.env.RESEND_API_KEY) return true

  // Por defecto en desarrollo, usar Resend si está configurado
  return false
}

// Función para obtener configuración de desarrollo
export function getDevelopmentConfig() {
  return {
    ...developmentEmailConfig,
    shouldSimulate: shouldSimulateEmails(),
    environment: process.env.NODE_ENV,
    hasResendKey: !!process.env.RESEND_API_KEY,
    resendTestMode: !process.env.RESEND_DOMAIN_VERIFIED || process.env.RESEND_DOMAIN_VERIFIED !== "true",
  }
}

// Logs mejorados para desarrollo
export function devLog(message: string, data?: any) {
  if (isDevelopment && developmentEmailConfig.verboseLogs) {
    console.log(`🔧 [DEV] ${message}`, data ? data : "")
  }
}

export function devError(message: string, error?: any) {
  if (isDevelopment) {
    console.error(`❌ [DEV] ${message}`, error ? error : "")
  }
}

export function devSuccess(message: string, data?: any) {
  if (isDevelopment) {
    console.log(`✅ [DEV] ${message}`, data ? data : "")
  }
}
