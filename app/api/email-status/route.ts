import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Verificar si Resend está instalado
    let resendInstalled = false
    try {
      require("resend")
      resendInstalled = true
    } catch (error) {
      resendInstalled = false
    }

    // Verificar variables de entorno
    const environmentVariables = {
      RESEND_API_KEY: !!process.env.RESEND_API_KEY,
      EMAIL_USER: !!process.env.EMAIL_USER,
      EMAIL_PASSWORD: !!process.env.EMAIL_PASSWORD,
      SMTP_HOST: !!process.env.SMTP_HOST,
      SMTP_PORT: !!process.env.SMTP_PORT,
      SMTP_SECURE: !!process.env.SMTP_SECURE,
      SMTP_USER: !!process.env.SMTP_USER,
      SMTP_PASSWORD: !!process.env.SMTP_PASSWORD,
    }

    const resendConfigured = environmentVariables.RESEND_API_KEY

    // Determinar método recomendado
    let recommendedMethod = "Simulación"
    if (resendInstalled && resendConfigured) {
      recommendedMethod = "Resend SDK"
    } else if (resendConfigured) {
      recommendedMethod = "Resend API"
    }

    // Determinar si puede enviar emails reales
    const canSendEmails = resendConfigured || (environmentVariables.EMAIL_USER && environmentVariables.EMAIL_PASSWORD)

    return NextResponse.json({
      resendInstalled,
      resendConfigured,
      environmentVariables,
      recommendedMethod,
      canSendEmails,
    })
  } catch (error) {
    console.error("Error checking email status:", error)
    return NextResponse.json(
      {
        error: "Error al verificar el estado del sistema de emails",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}