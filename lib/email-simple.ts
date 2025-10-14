import nodemailer from "nodemailer"

export const runtime = "nodejs";

// Función para detectar qué configuración de email está disponible
function detectEmailConfig() {
  // Prioridad 1: Configuración simple de Gmail
  if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
    return {
      type: "gmail-simple",
      config: {
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
        // Ajustes recomendados para entornos serverless / evitar bloqueos
        pool: false,
        maxConnections: 1,
        maxMessages: 1,
        connectionTimeout: 10000,
        greetingTimeout: 5000,
        socketTimeout: 10000,
      },
    }
  }

  // Prioridad 2: Configuración SMTP completa
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASSWORD) {
    return {
      type: "smtp",
      config: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
        pool: false,
        maxConnections: 1,
        maxMessages: 1,
        connectionTimeout: 10000,
        greetingTimeout: 5000,
        socketTimeout: 10000,
      },
    }
  }

  // Prioridad 3: Resend (si está configurado)
  if (process.env.RESEND_API_KEY) {
    return {
      type: "resend",
      config: null, // Resend usa su propia API
    }
  }

  return null
}

// Función para enviar con Resend
async function sendWithResend({
  to,
  subject,
  html,
  text,
}: {
  to: string
  subject: string
  html: string
  text?: string
}) {
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Plan A <noreply@plana.website>",
        to: [to],
        subject,
        html,
        text,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(`Resend API error: ${errorData.message || response.statusText}`)
    }

    const result = await response.json()
    return {
      success: true,
      id: result.id,
      provider: "resend",
    }
  } catch (error) {
    console.error("❌ Error con Resend:", error)
    throw error
  }
}

// Configuración básica para el transporte de correo
const getTransporter = () => {
  const emailConfig = detectEmailConfig()

  if (!emailConfig) {
    console.log("⚠️ No hay configuración de email disponible")
    return null
  }

  if (emailConfig.type === "resend") {
    console.log("📧 Usando Resend API")
    return "resend" // Indicador especial para Resend
  }

  console.log(`📧 Configurando transporte: ${emailConfig.type}`)

  try {
    return nodemailer.createTransport(emailConfig.config)
  } catch (error) {
    console.error("❌ Error creando transporter:", error)
    return null
  }
}

// Errores transitorios de red que vale la pena reintentar
function isTransientNetworkError(error: unknown) {
  const code = (error as any)?.code as string | undefined
  if (!code) return false
  const transient = new Set([
    "EAI_AGAIN",
    "EDNS",
    "ETIMEDOUT",
    "ECONNRESET",
    "ECONNREFUSED",
    "EHOSTUNREACH",
    "ENOTFOUND",
    "ESOCKETTIMEDOUT",
    "ETIME",
  ])
  return transient.has(code)
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// Función principal para enviar email
export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string
  subject: string
  html: string
  text?: string
}) {
  console.log(`📧 Intentando enviar email a: ${to}`)
  console.log(`📧 Asunto: ${subject}`)

  // Verificar si está forzada la simulación
  if (process.env.DEV_FORCE_EMAIL_SIMULATION === "true") {
    console.log("🧪 Simulación forzada por DEV_FORCE_EMAIL_SIMULATION=true")
    return await simulateEmail({ to, subject, html, text })
  }

  // Obtener transporter o indicador de Resend
  const transporter = getTransporter()
  // Si no hay configuración, simular
  if (!transporter) {
    console.log("📧 No hay configuración disponible, simulando envío")
    return await simulateEmail({ to, subject, html, text })
  }

  // Si es Resend, usar su API
  if (transporter === "resend") {
    try {
      console.log("📧 Enviando con Resend...")
      const result = await sendWithResend({ to, subject, html, text })
      console.log(`✅ Email enviado con Resend: ${result.id}`)
      return {
        success: true,
        simulated: false,
        id: result.id,
        provider: "resend",
        message: "Email enviado correctamente con Resend",
      }
    } catch (error) {
      console.error("❌ Error con Resend, usando simulación:", error)
      return await simulateEmail({
        to,
        subject,
        html,
        text,
        error: error instanceof Error ? error.message : "Error de Resend",
      })
    }
  }

  // Si es nodemailer, usar transporter
  try {
    console.log("📧 Enviando email con nodemailer...")

    const maxRetries = Number(process.env.EMAIL_MAX_RETRIES || 3)
    let lastError: any = null

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`🔄 Intento ${attempt}/${maxRetries} con nodemailer...`)
        const info = await transporter.sendMail({
          from: process.env.EMAIL_USER || process.env.SMTP_USER,
          to,
          subject,
          html,
          text,
        })

        console.log(`✅ Email enviado correctamente: ${info.messageId}`)
        return {
          success: true,
          simulated: false,
          id: info.messageId,
          provider: "nodemailer",
          message: "Email enviado correctamente",
          attempts: attempt,
        }
      } catch (error) {
        lastError = error
        const code = (error as any)?.code
        console.error("❌ Error en envío (nodemailer):", { code, error })

        if (attempt < maxRetries && isTransientNetworkError(error)) {
          const backoff = attempt * 1000
          console.log(`⏳ Error transitorio (${code}). Reintentando en ${backoff}ms...`)
          await delay(backoff)
          continue
        }
        break
      }
    }

    // Si llegó aquí, nodemailer falló en todos los intentos
    console.log("⚠️ Nodemailer falló tras reintentos.")

    // Si hay Resend configurado, intentar enviar con Resend como fallback
    if (process.env.RESEND_API_KEY) {
      try {
        console.log("🔄 Probando fallback con Resend API...")
        const result = await sendWithResend({ to, subject, html, text })
        console.log(`✅ Email enviado con Resend tras fallo SMTP: ${result.id}`)
        return {
          success: true,
          simulated: false,
          id: result.id,
          provider: "resend-fallback",
          message: "Email enviado con Resend tras fallo SMTP",
        }
      } catch (fallbackError) {
        console.error("❌ Fallback con Resend también falló:", fallbackError)
      }
    }

    // Como último recurso, simular
    console.log("📧 Usando simulación como último recurso")
    return await simulateEmail({
      to,
      subject,
      html,
      text,
      error: lastError instanceof Error ? lastError.message : "Error desconocido",
    })
  } catch (error) {
    console.error("❌ Error enviando email:", error)

    // Si falla el envío real, simular como fallback
    console.log("📧 Usando simulación como fallback")
    return await simulateEmail({
      to,
      subject,
      html,
      text,
      error: error instanceof Error ? error.message : "Error desconocido",
    })
  }
}

// Función para simular envío de email
async function simulateEmail({
  to,
  subject,
  html,
  text,
  error,
}: {
  to: string
  subject: string
  html: string
  text?: string
  error?: string
}) {
  console.log("🧪 SIMULANDO ENVÍO DE EMAIL")
  console.log(`📧 Para: ${to}`)
  console.log(`📧 Asunto: ${subject}`)
  console.log(`📧 Contenido HTML: ${html.substring(0, 100)}...`)

  if (error) {
    console.log(`⚠️ Motivo de simulación: ${error}`)
  }

  // Simular delay de red
  await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 1000))

  const simulatedId = `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  console.log(`✅ Email simulado con ID: ${simulatedId}`)

  return {
    success: true,
    simulated: true,
    id: simulatedId,
    provider: "simulation",
    message: error ? `Email simulado (error: ${error})` : "Email simulado correctamente",
    originalError: error,
  }
}

// Función para verificar la configuración actual
export function getEmailConfigStatus() {
  const config = detectEmailConfig()

  return {
    hasConfig: !!config,
    type: config?.type || "none",
    simulationForced: process.env.DEV_FORCE_EMAIL_SIMULATION === "true",
    variables: {
      EMAIL_USER: !!process.env.EMAIL_USER,
      EMAIL_PASSWORD: !!process.env.EMAIL_PASSWORD,
      SMTP_HOST: !!process.env.SMTP_HOST,
      SMTP_USER: !!process.env.SMTP_USER,
      SMTP_PASSWORD: !!process.env.SMTP_PASSWORD,
      RESEND_API_KEY: !!process.env.RESEND_API_KEY,
    },
  }
}