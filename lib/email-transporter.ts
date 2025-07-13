import nodemailer from "nodemailer"

// Configuración específica para diferentes proveedores
export const emailProviders = {
  gmail: {
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD, // App Password de Gmail
    },
  },
  outlook: {
    host: "smtp-mail.outlook.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number.parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  },
}

// Crear transportador con configuración optimizada para serverless
export function createTransporter(provider: keyof typeof emailProviders = "gmail") {
  const config = emailProviders[provider]

  if (!config) {
    throw new Error(`Proveedor de email no soportado: ${provider}`)
  }

  // Configuración optimizada para Vercel/serverless
  const transporterConfig = {
    ...config,
    // Configuraciones específicas para serverless
    pool: false, // Deshabilitar pool de conexiones
    maxConnections: 1, // Una conexión a la vez
    maxMessages: 1, // Un mensaje por conexión
    rateDelta: 1000, // Esperar 1 segundo entre mensajes
    rateLimit: 1, // Máximo 1 mensaje por segundo
    // Timeouts más cortos para serverless
    connectionTimeout: 10000, // 10 segundos
    greetingTimeout: 5000, // 5 segundos
    socketTimeout: 10000, // 10 segundos
  }

  return nodemailer.createTransport(transporterConfig)
}

// Función para verificar la configuración sin conectar
export function validateEmailConfig(provider: keyof typeof emailProviders = "gmail") {
  const config = emailProviders[provider]

  if (!config) {
    return { valid: false, error: `Proveedor no soportado: ${provider}` }
  }

  // Verificar variables de entorno según el proveedor
  if (provider === "gmail") {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      return {
        valid: false,
        error: "Variables EMAIL_USER y EMAIL_PASSWORD requeridas para Gmail",
        missing: {
          EMAIL_USER: !process.env.EMAIL_USER,
          EMAIL_PASSWORD: !process.env.EMAIL_PASSWORD,
        },
      }
    }
  } else if (provider === "smtp") {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      return {
        valid: false,
        error: "Variables SMTP_HOST, SMTP_USER y SMTP_PASSWORD requeridas",
        missing: {
          SMTP_HOST: !process.env.SMTP_HOST,
          SMTP_USER: !process.env.SMTP_USER,
          SMTP_PASSWORD: !process.env.SMTP_PASSWORD,
        },
      }
    }
  }

  return { valid: true, provider, config }
}

// Función para enviar email con reintentos
export async function sendEmailWithRetry(
  transporter: nodemailer.Transporter,
  mailOptions: nodemailer.SendMailOptions,
  maxRetries = 3,
) {
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Intento ${attempt} de envío de email...`)

      // Verificar conexión antes de enviar
      await transporter.verify()
      console.log("✅ Conexión SMTP verificada")

      // Enviar email
      const result = await transporter.sendMail(mailOptions)
      console.log("✅ Email enviado exitosamente:", result.messageId)

      return {
        success: true,
        messageId: result.messageId,
        attempt,
      }
    } catch (error) {
      lastError = error as Error
      console.error(`❌ Error en intento ${attempt}:`, error)

      // Si no es el último intento, esperar antes de reintentar
      if (attempt < maxRetries) {
        const delay = attempt * 2000 // 2s, 4s, 6s...
        console.log(`⏳ Esperando ${delay}ms antes del siguiente intento...`)
        await new Promise((resolve) => setTimeout(resolve, delay))
      }
    }
  }

  return {
    success: false,
    error: lastError?.message || "Error desconocido",
    attempts: maxRetries,
  }
}
