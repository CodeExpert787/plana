import {
  isDevelopment,
  isProduction,
  shouldSimulateEmails,
  devLog,
  devError,
  devSuccess,
  getDevelopmentConfig,
} from "./development-config"
import {
  shouldSimulateEmailsInProduction,
  isDomainVerified,
  prodLog,
  prodError,
  prodSuccess,
  getProductionConfig,
  validateProductionConfig,
} from "./production-config"

// Importar Resend solo si está disponible
let Resend: any = null
let resend: any = null

try {
  // Intentar importar Resend
  const ResendModule = require("resend")
  Resend = ResendModule.Resend

  // Inicializar solo si tenemos la API key
  if (process.env.RESEND_API_KEY && Resend) {
    resend = new Resend(process.env.RESEND_API_KEY)

    if (isDevelopment) {
      devLog("Resend SDK inicializado correctamente")
    } else {
      prodLog("Resend SDK inicializado para producción")
    }
  } else {
    if (isDevelopment) {
      devLog("Resend SDK no inicializado - falta API key")
    } else {
      prodError("Resend SDK no inicializado - falta API key en producción")
    }
  }
} catch (error) {
  if (isDevelopment) {
    devLog("Resend no está instalado, usando fetch directo o simulación")
  } else {
    prodError("Resend no está instalado en producción", error)
  }
}

// Función para validar el formato de la API key de Resend
export function isValidResendApiKeyFormat(): boolean {
  const apiKey = process.env.RESEND_API_KEY

  // Si no hay API key, no es válida
  if (!apiKey) return false

  // Las API keys de Resend comienzan con "re_" y tienen al menos 24 caracteres
  return apiKey.startsWith("re_") && apiKey.length >= 24
}

// Función para verificar si Resend está configurado
export function isResendConfigured(): boolean {
  return !!process.env.RESEND_API_KEY && isValidResendApiKeyFormat()
}

// Función para verificar si la librería está instalada
export function isResendInstalled(): boolean {
  return !!Resend
}

// Función para verificar si estamos en modo de prueba
export function isResendTestMode(): boolean {
  if (isProduction) {
    return !isDomainVerified()
  }
  return !process.env.RESEND_DOMAIN_VERIFIED || process.env.RESEND_DOMAIN_VERIFIED !== "true"
}

// Función para obtener el email de prueba autorizado
export function getAuthorizedTestEmail(): string {
  return process.env.RESEND_TEST_EMAIL || "orion2000wcse@gmail.com"
}

// Función para obtener el remitente correcto
export function getFromAddress(): string {
  return "Plan A <noreply@plana.website>"
}

// Función para obtener configuración actual
export function getCurrentConfig() {
  if (isDevelopment) {
    return getDevelopmentConfig()
  } else {
    return getProductionConfig()
  }
}

// Función para simular envío de email (desarrollo)
export async function simulateEmailSending({
  to,
  subject,
  html,
  text,
  from,
}: {
  to: string
  subject: string
  html: string
  text?: string
  from?: string
}) {
  const config = getCurrentConfig()
  const fromAddress = from || getFromAddress()

  if (isDevelopment) {
    devLog("🧪 SIMULANDO ENVÍO DE EMAIL EN DESARROLLO")
    devLog("📧 Para:", to)
    devLog("📧 Desde:", fromAddress)
    devLog("📝 Asunto:", subject)

    // Simular delay de red solo en desarrollo
    if (config.simulateDelay) {
      devLog("⏳ Simulando delay de red...")
      await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000))
    }

    devLog("📄 Contenido HTML (primeros 300 chars):", html.substring(0, 300) + "...")
    if (text) {
      devLog("📄 Contenido texto (primeros 200 chars):", text.substring(0, 200) + "...")
    }
  } else {
    prodLog("🧪 SIMULANDO ENVÍO DE EMAIL EN PRODUCCIÓN")
    prodLog("📧 Para:", to)
    prodLog("📧 Desde:", fromAddress)
    prodLog("📝 Asunto:", subject)
  }

  // Simular ID de email
  const simulatedId = `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  if (isDevelopment) {
    devSuccess("Email simulado exitosamente", {
      id: simulatedId,
      to,
      from: fromAddress,
      subject,
    })
  } else {
    prodSuccess("Email simulado en producción", {
      id: simulatedId,
      to,
      from: fromAddress,
    })
  }

  return {
    success: true,
    id: simulatedId,
    provider: isProduction ? "production-simulation" : "development-simulation",
    simulated: true,
    fromAddress,
    environment: process.env.NODE_ENV,
    reason: isProduction ? "Simulación forzada en producción" : "Configurado para simular en desarrollo",
  }
}

// Función para enviar email usando Resend SDK con reintentos
export async function sendEmailWithResendSDK({
  to,
  subject,
  html,
  text,
  from,
}: {
  to: string
  subject: string
  html: string
  text?: string
  from?: string
}) {
  const config = getCurrentConfig()
  const maxRetries = isProduction ? 3 : 1

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      if (!isResendConfigured()) {
        throw new Error("RESEND_API_KEY no está configurado")
      }

      if (!isResendInstalled() || !resend) {
        throw new Error("Resend SDK no está instalado")
      }

      // Usar el dominio personalizado
      const fromAddress = from || getFromAddress()

      // En desarrollo, agregar prefijo al asunto
      if (isDevelopment) {
        subject = `[DEV] ${subject}`
      }

      // En modo de prueba, enviar solo al email autorizado
      let finalTo = to
      let testMode = false

      if (isResendTestMode()) {
        const authorizedEmail = getAuthorizedTestEmail()
        if (to !== authorizedEmail) {
          if (isDevelopment) {
            devLog(`⚠️ Modo de prueba: Redirigiendo email de ${to} a ${authorizedEmail}`)
          } else {
            prodLog(`⚠️ Modo de prueba en producción: Redirigiendo email de ${to} a ${authorizedEmail}`)
          }

          finalTo = authorizedEmail
          testMode = true

          // Modificar el asunto para indicar el destinatario original
          subject = `[PRUEBA - Para: ${to}] ${subject}`

          // Agregar nota al HTML sobre el destinatario original
          const environmentNote = isProduction ? "Producción" : "Desarrollo"
          html = `
            <div style="background: #fef3c7; padding: 15px; margin-bottom: 20px; border-radius: 8px; border-left: 4px solid #f59e0b;">
              <h3 style="color: #92400e; margin: 0 0 10px 0;">🧪 Email de Prueba - ${environmentNote}</h3>
              <p style="color: #92400e; margin: 0;">
                <strong>Destinatario original:</strong> ${to}<br>
                <strong>Remitente:</strong> ${fromAddress}<br>
                <strong>Entorno:</strong> ${process.env.NODE_ENV}<br>
                <strong>Motivo:</strong> Dominio plana.website no verificado en Resend. Para enviar a cualquier email, verifica el dominio en resend.com/domains
              </p>
            </div>
            ${html}
          `
        }
      }

      if (isDevelopment) {
        devLog("📧 Enviando email con Resend SDK...")
        devLog("👤 Para:", finalTo)
        devLog("📧 Desde:", fromAddress)
        devLog("📝 Asunto:", subject)
        devLog("🧪 Modo de prueba:", testMode)
        devLog("🔄 Intento:", attempt)
      } else {
        prodLog("📧 Enviando email con Resend SDK...")
        prodLog("👤 Para:", finalTo)
        prodLog("🔄 Intento:", attempt)
      }

      const result = await resend.emails.send({
        from: fromAddress,
        to: [finalTo],
        subject,
        html,
        text,
      })

      if (isDevelopment) {
        devSuccess("Email enviado exitosamente con Resend SDK:", result.data?.id)
      } else {
        prodSuccess("Email enviado exitosamente con Resend SDK:", result.data?.id)
      }

      return {
        success: true,
        id: result.data?.id,
        provider: "resend-sdk",
        testMode,
        originalRecipient: testMode ? to : undefined,
        actualRecipient: finalTo,
        fromAddress,
        environment: process.env.NODE_ENV,
        attempts: attempt,
      }
    } catch (error) {
      if (isDevelopment) {
        devError(`Error en intento ${attempt} enviando email con Resend SDK:`, error)
      } else {
        prodError(`Error en intento ${attempt} enviando email con Resend SDK:`, error)
      }

      // Si es el último intento, devolver error
      if (attempt === maxRetries) {
        return {
          success: false,
          error: error instanceof Error ? error.message : "Error desconocido",
          provider: "resend-sdk",
          attempts: attempt,
        }
      }

      // Esperar antes del siguiente intento (solo en producción)
      if (isProduction && attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * attempt))
      }
    }
  }

  return {
    success: false,
    error: "Máximo número de intentos alcanzado",
    provider: "resend-sdk",
    attempts: maxRetries,
  }
}

// Función para enviar email usando fetch directo (fallback)
export async function sendEmailWithResendFetch({
  to,
  subject,
  html,
  text,
  from,
}: {
  to: string
  subject: string
  html: string
  text?: string
  from?: string
}) {
  try {
    if (!isResendConfigured()) {
      throw new Error("RESEND_API_KEY no está configurado")
    }

    // Usar el dominio personalizado
    const fromAddress = from || getFromAddress()

    // En desarrollo, agregar prefijo al asunto
    if (isDevelopment) {
      subject = `[DEV] ${subject}`
    }

    // En modo de prueba, enviar solo al email autorizado
    let finalTo = to
    let testMode = false

    if (isResendTestMode()) {
      const authorizedEmail = getAuthorizedTestEmail()
      if (to !== authorizedEmail) {
        if (isDevelopment) {
          devLog(`⚠️ Modo de prueba: Redirigiendo email de ${to} a ${authorizedEmail}`)
        } else {
          prodLog(`⚠️ Modo de prueba en producción: Redirigiendo email de ${to} a ${authorizedEmail}`)
        }

        finalTo = authorizedEmail
        testMode = true

        // Modificar el asunto para indicar el destinatario original
        subject = `[PRUEBA - Para: ${to}] ${subject}`

        // Agregar nota al HTML sobre el destinatario original
        const environmentNote = isProduction ? "Producción" : "Desarrollo"
        html = `
          <div style="background: #fef3c7; padding: 15px; margin-bottom: 20px; border-radius: 8px; border-left: 4px solid #f59e0b;">
            <h3 style="color: #92400e; margin: 0 0 10px 0;">🧪 Email de Prueba - ${environmentNote}</h3>
            <p style="color: #92400e; margin: 0;">
              <strong>Destinatario original:</strong> ${to}<br>
              <strong>Remitente:</strong> ${fromAddress}<br>
              <strong>Entorno:</strong> ${process.env.NODE_ENV}<br>
              <strong>Motivo:</strong> Dominio plana.website no verificado en Resend. Para enviar a cualquier email, verifica el dominio en resend.com/domains
            </p>
          </div>
          ${html}
        `
      }
    }

    if (isDevelopment) {
      devLog("📧 Enviando email con Resend API (fetch)...")
      devLog("👤 Para:", finalTo)
      devLog("📧 Desde:", fromAddress)
      devLog("🧪 Modo de prueba:", testMode)
    } else {
      prodLog("📧 Enviando email con Resend API (fetch)...")
      prodLog("👤 Para:", finalTo)
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [finalTo],
        subject,
        html,
        text,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()

      // Manejar diferentes tipos de errores comunes de Resend
      if (errorData.message) {
        // Error de dominio no verificado
        if (errorData.message.includes("verify a domain")) {
          if (isDevelopment) {
            devLog("⚠️ Error de dominio no verificado, usando simulación...")
          } else {
            prodLog("⚠️ Error de dominio no verificado en producción, usando simulación...")
          }

          return {
            success: true,
            provider: "simulation-fallback",
            simulated: true,
            reason: "Dominio plana.website no verificado en Resend",
            originalError: errorData.message,
            fromAddress,
            environment: process.env.NODE_ENV,
          }
        }

        // Error de API key inválida
        if (errorData.message.includes("API key is invalid")) {
          if (isDevelopment) {
            devLog("⚠️ API key de Resend inválida, usando simulación...")
          } else {
            prodLog("⚠️ API key de Resend inválida en producción, usando simulación...")
          }

          return {
            success: true,
            provider: "simulation-fallback",
            simulated: true,
            reason: "API key de Resend inválida o mal formateada",
            originalError: errorData.message,
            fromAddress,
            environment: process.env.NODE_ENV,
          }
        }
      }

      // Para cualquier otro error, usar simulación como fallback
      if (isDevelopment) {
        devLog(`⚠️ Error de Resend API: ${errorData.message || response.statusText}, usando simulación...`)
      } else {
        prodLog(
          `⚠️ Error de Resend API en producción: ${errorData.message || response.statusText}, usando simulación...`,
        )
      }

      return {
        success: true,
        provider: "simulation-fallback",
        simulated: true,
        reason: `Error de Resend API: ${errorData.message || response.statusText}`,
        originalError: errorData.message || response.statusText,
        fromAddress,
        environment: process.env.NODE_ENV,
      }
    }

    const result = await response.json()

    if (isDevelopment) {
      devSuccess("Email enviado con Resend API:", result.id)
    } else {
      prodSuccess("Email enviado con Resend API:", result.id)
    }

    return {
      success: true,
      id: result.id,
      provider: "resend-fetch",
      testMode,
      originalRecipient: testMode ? to : undefined,
      actualRecipient: finalTo,
      fromAddress,
      environment: process.env.NODE_ENV,
    }
  } catch (error) {
    if (isDevelopment) {
      devError("Error con Resend API:", error)
    } else {
      prodError("Error con Resend API:", error)
    }

    // Si es un error de verificación de dominio, usar simulación
    if (error instanceof Error && error.message.includes("verify a domain")) {
      if (isDevelopment) {
        devLog("🔄 Error de dominio, usando simulación como fallback...")
      } else {
        prodLog("🔄 Error de dominio en producción, usando simulación como fallback...")
      }

      return {
        success: true,
        provider: "simulation-fallback",
        simulated: true,
        reason: "Dominio plana.website no verificado en Resend",
        originalError: error.message,
        fromAddress: from || getFromAddress(),
        environment: process.env.NODE_ENV,
      }
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
      provider: "resend-fetch",
    }
  }
}

// Función principal que intenta múltiples métodos
export async function sendEmailWithResend({
  to,
  subject,
  html,
  text,
  from,
}: {
  to: string
  subject: string
  html: string
  text?: string
  from?: string
}) {
  const config = getCurrentConfig()

  if (isDevelopment) {
    devLog("📧 Iniciando envío de email...")
    devLog("🔧 Configuración:", config)
    devLog("📧 Remitente:", from || getFromAddress())
  } else {
    prodLog("📧 Iniciando envío de email en producción...")
    prodLog("📧 Remitente:", from || getFromAddress())
  }

  // Validar configuración en producción
  if (isProduction) {
    const validation = validateProductionConfig()
    if (!validation.isValid) {
      prodError("Configuración de producción inválida:", validation.errors)
      return {
        success: false,
        error: "Configuración de producción inválida: " + validation.errors.join(", "),
        provider: "validation-error",
      }
    }

    if (validation.warnings.length > 0) {
      prodLog("Advertencias de configuración:", validation.warnings)
    }
  }

  // En desarrollo, si está configurado para simular, usar simulación
  if (isDevelopment && shouldSimulateEmails()) {
    devLog("🧪 Usando simulación (configurado para desarrollo)")
    return await simulateEmailSending({ to, subject, html, text, from })
  }

  // En producción, si está configurado para simular, usar simulación
  if (isProduction && shouldSimulateEmailsInProduction()) {
    prodLog("🧪 Usando simulación (forzado en producción)")
    return await simulateEmailSending({ to, subject, html, text, from })
  }

  // Método 1: Intentar con SDK si está instalado
  if (isResendInstalled()) {
    if (isDevelopment) {
      devLog("🔄 Intentando con Resend SDK...")
    } else {
      prodLog("🔄 Intentando con Resend SDK...")
    }

    const result = await sendEmailWithResendSDK({ to, subject, html, text, from })
    if (result.success) {
      return result
    }

    if (isDevelopment) {
      devLog("🔄 SDK falló, intentando con fetch...")
    } else {
      prodLog("🔄 SDK falló, intentando con fetch...")
    }
  }

  // Método 2: Intentar con fetch directo
  if (isResendConfigured()) {
    if (isDevelopment) {
      devLog("🔄 Intentando con Resend API...")
    } else {
      prodLog("🔄 Intentando con Resend API...")
    }

    try {
      const result = await sendEmailWithResendFetch({ to, subject, html, text, from })
      if (result.success) {
        return result
      }
    } catch (error) {
      if (isDevelopment) {
        devError("❌ Error crítico con Resend API:", error)
        devLog("🔄 Error capturado, usando simulación como fallback...")
      } else {
        prodError("❌ Error crítico con Resend API en producción:", error)
        prodLog("🔄 Error capturado, usando simulación como fallback...")
      }
    }
  }

  // Método 3: Simulación (siempre funciona)
  if (isDevelopment) {
    devLog("🧪 Usando simulación como fallback")
  } else {
    prodLog("🧪 Usando simulación como fallback en producción")
  }

  return await simulateEmailSending({ to, subject, html, text, from })
}
