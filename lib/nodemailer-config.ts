import nodemailer from "nodemailer"

export interface EmailConfig {
  service?: string
  host?: string
  port?: number
  secure?: boolean
  auth: {
    user: string
    pass: string
  }
}

// Configuraciones predefinidas para diferentes proveedores
export const emailConfigs = {
  gmail: {
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASSWORD!, // App Password
    },
  },

  outlook: {
    service: "hotmail",
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASSWORD!,
    },
  },

  yahoo: {
    service: "yahoo",
    auth: {
      user: process.env.EMAIL_USER!,
      pass: process.env.EMAIL_PASSWORD!,
    },
  },

  // Configuración SMTP personalizada
  custom: {
    host: process.env.SMTP_HOST!,
    port: Number.parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASSWORD!,
    },
  },
}

export function createEmailTransporter(provider: keyof typeof emailConfigs = "gmail") {
  const config = emailConfigs[provider]

  if (!config) {
    throw new Error(`Configuración de email no encontrada para el proveedor: ${provider}`)
  }

  return nodemailer.createTransport(config)
}

// Función para verificar la configuración del email
export async function verifyEmailConfig(provider: keyof typeof emailConfigs = "gmail") {
  try {
    const transporter = createEmailTransporter(provider)
    await transporter.verify()
    console.log("✅ Configuración de email verificada correctamente")
    return true
  } catch (error) {
    console.error("❌ Error en la configuración de email:", error)
    return false
  }
}

// Función para enviar email de prueba
export async function sendTestEmail(to: string, provider: keyof typeof emailConfigs = "gmail") {
  try {
    const transporter = createEmailTransporter(provider)

    const info = await transporter.sendMail({
      from: {
        name: "Plan A - Test",
        address: process.env.EMAIL_USER!,
      },
      to,
      subject: "Email de prueba - Plan A",
      html: `
        <h2>¡Email de prueba exitoso!</h2>
        <p>Si recibes este email, la configuración de Nodemailer está funcionando correctamente.</p>
        <p>Proveedor utilizado: <strong>${provider}</strong></p>
        <p>Fecha: ${new Date().toLocaleString("es-ES")}</p>
      `,
      text: `Email de prueba exitoso! Configuración de Nodemailer funcionando correctamente. Proveedor: ${provider}`,
    })

    console.log("✅ Email de prueba enviado:", info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error("❌ Error enviando email de prueba:", error)
    return { success: false, error }
  }
}
