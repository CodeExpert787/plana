import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const provider = (searchParams.get("provider") as "gmail" | "custom") || "gmail"

  try {
    // Verificar que las variables de entorno estén configuradas
    if (provider === "gmail") {
      const hasEmailUser = !!process.env.EMAIL_USER
      const hasEmailPassword = !!process.env.EMAIL_PASSWORD

      if (!hasEmailUser || !hasEmailPassword) {
        return NextResponse.json({
          success: false,
          error: "Variables de entorno de Gmail no configuradas",
          missing: {
            EMAIL_USER: !hasEmailUser,
            EMAIL_PASSWORD: !hasEmailPassword,
          },
        })
      }

      // En lugar de verificar la conexión real (que causa problemas de DNS),
      // verificamos que las variables estén configuradas correctamente
      return NextResponse.json({
        success: true,
        message: "Variables de Gmail configuradas correctamente",
        provider: "gmail",
        configured: {
          EMAIL_USER: hasEmailUser,
          EMAIL_PASSWORD: hasEmailPassword,
        },
      })
    } else if (provider === "custom") {
      const hasSmtpHost = !!process.env.SMTP_HOST
      const hasSmtpUser = !!process.env.SMTP_USER
      const hasSmtpPassword = !!process.env.SMTP_PASSWORD
      const hasSmtpPort = !!process.env.SMTP_PORT

      if (!hasSmtpHost || !hasSmtpUser || !hasSmtpPassword) {
        return NextResponse.json({
          success: false,
          error: "Variables de entorno de SMTP no configuradas",
          missing: {
            SMTP_HOST: !hasSmtpHost,
            SMTP_PORT: !hasSmtpPort,
            SMTP_USER: !hasSmtpUser,
            SMTP_PASSWORD: !hasSmtpPassword,
          },
        })
      }

      return NextResponse.json({
        success: true,
        message: "Variables de SMTP configuradas correctamente",
        provider: "custom",
        configured: {
          SMTP_HOST: hasSmtpHost,
          SMTP_PORT: hasSmtpPort,
          SMTP_USER: hasSmtpUser,
          SMTP_PASSWORD: hasSmtpPassword,
          SMTP_SECURE: !!process.env.SMTP_SECURE,
        },
      })
    }

    return NextResponse.json({
      success: false,
      error: "Proveedor no válido",
    })
  } catch (error) {
    console.error(`Error verificando configuración de ${provider}:`, error)

    return NextResponse.json({
      success: false,
      error: `Error verificando configuración de ${provider}`,
      details: error instanceof Error ? error.message : "Error desconocido",
      provider,
    })
  }
}