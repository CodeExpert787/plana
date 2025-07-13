// Configuración específica para producción
export const isProduction = process.env.NODE_ENV === "production"
export const isDevelopment = process.env.NODE_ENV === "development"

// Configuración de email para producción
export const productionEmailConfig = {
  // En producción, nunca simular a menos que se especifique
  forceSimulation: process.env.PROD_FORCE_EMAIL_SIMULATION === "true",

  // Logs mínimos en producción
  verboseLogs: process.env.PROD_VERBOSE_LOGS === "true",

  // Sin delays artificiales en producción
  simulateDelay: false,

  // Sin prefijo en producción
  subjectPrefix: "",

  // Configuración de reintentos
  maxRetries: 3,
  retryDelay: 1000,

  // Configuración de timeouts
  timeout: 30000,

  // Configuración de monitoreo
  enableMonitoring: true,
  logErrors: true,
}

// Función para determinar si debemos simular emails en producción
export function shouldSimulateEmailsInProduction(): boolean {
  if (!isProduction) return false

  // Solo simular si está explícitamente forzado
  if (productionEmailConfig.forceSimulation) return true

  // Si no hay configuración de Resend, simular
  if (!process.env.RESEND_API_KEY) return true

  // Por defecto en producción, usar Resend real
  return false
}

// Función para verificar si el dominio está verificado
export function isDomainVerified(): boolean {
  return process.env.RESEND_DOMAIN_VERIFIED === "true"
}

// Función para obtener configuración de producción
export function getProductionConfig() {
  return {
    ...productionEmailConfig,
    shouldSimulate: shouldSimulateEmailsInProduction(),
    environment: process.env.NODE_ENV,
    hasResendKey: !!process.env.RESEND_API_KEY,
    domainVerified: isDomainVerified(),
    resendTestMode: !isDomainVerified(),
  }
}

// Logs optimizados para producción
export function prodLog(message: string, data?: any) {
  if (isProduction && productionEmailConfig.verboseLogs) {
    console.log(`🚀 [PROD] ${message}`, data ? data : "")
  }
}

export function prodError(message: string, error?: any) {
  if (isProduction && productionEmailConfig.logErrors) {
    console.error(`❌ [PROD] ${message}`, error ? error : "")

    // En producción, también podrías enviar errores a un servicio de monitoreo
    // como Sentry, LogRocket, etc.
    if (productionEmailConfig.enableMonitoring) {
      // Aquí podrías integrar con tu servicio de monitoreo
      // Sentry.captureException(error)
    }
  }
}

export function prodSuccess(message: string, data?: any) {
  if (isProduction) {
    console.log(`✅ [PROD] ${message}`, data ? data : "")
  }
}

// Función para validar configuración de producción
export function validateProductionConfig(): {
  isValid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []

  // Validaciones críticas
  if (!process.env.RESEND_API_KEY) {
    errors.push("RESEND_API_KEY no está configurado")
  }

  if (!isDomainVerified()) {
    warnings.push("RESEND_DOMAIN_VERIFIED no está configurado como 'true'")
  }

  if (!process.env.RESEND_TEST_EMAIL) {
    warnings.push("RESEND_TEST_EMAIL no está configurado para fallback")
  }

  // Validaciones de seguridad
  if (process.env.NODE_ENV !== "production") {
    warnings.push("NODE_ENV no está configurado como 'production'")
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  }
}

// Función para obtener métricas de email
export function getEmailMetrics() {
  return {
    environment: process.env.NODE_ENV,
    resendConfigured: !!process.env.RESEND_API_KEY,
    domainVerified: isDomainVerified(),
    simulationForced: productionEmailConfig.forceSimulation,
    monitoringEnabled: productionEmailConfig.enableMonitoring,
    timestamp: new Date().toISOString(),
  }
}
