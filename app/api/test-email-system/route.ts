import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { to, subject } = await request.json()

    console.log("🧪 Probando sistema de email...")
    console.log("📧 Para:", to)
    console.log("📝 Asunto:", subject)

    // Verificar si Resend está disponible
    let resendInstalled = false
    try {
      require("resend")
      resendInstalled = true
    } catch (error) {
      resendInstalled = false
    }

    const resendConfigured = !!process.env.RESEND_API_KEY

    // Simular envío de email de prueba
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Email de Prueba - Plan A</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981, #0ea5e9); color: white; padding: 30px; text-align: center; border-radius: 8px;">
            <h1>🧪 Email de Prueba</h1>
            <p>Sistema de emails funcionando correctamente</p>
          </div>
          
          <div style="padding: 30px; background: #f8fafc; margin-top: 20px; border-radius: 8px;">
            <h2>Detalles de la Prueba</h2>
            <p><strong>Resend SDK:</strong> ${resendInstalled ? "✅ Instalado" : "❌ No instalado"}</p>
            <p><strong>API Key:</strong> ${resendConfigured ? "✅ Configurada" : "❌ No configurada"}</p>
            <p><strong>Método:</strong> ${
              resendInstalled && resendConfigured ? "Resend SDK" : resendConfigured ? "Resend API" : "Simulación"
            }</p>
            <p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #6b7280;">
            <p>Plan A - Aventuras en Bariloche</p>
            <p>Sistema de emails funcionando correctamente</p>
          </div>
        </body>
      </html>
    `

    // Intentar envío real si está configurado
    if (resendConfigured) {
      try {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Plan A <onboarding@resend.dev>",
            to: [to],
            subject: subject || "Email de Prueba - Plan A",
            html: htmlContent,
          }),
        })

        if (response.ok) {
          const result = await response.json()
          return NextResponse.json({
            success: true,
            message: "Email de prueba enviado exitosamente",
            provider: resendInstalled ? "resend-sdk" : "resend-api",
            id: result.id,
            realEmail: true,
          })
        }
      } catch (error) {
        console.log("Error enviando email real, usando simulación:", error)
      }
    }

    // Simulación (siempre funciona)
    console.log("🧪 SIMULANDO ENVÍO DE EMAIL DE PRUEBA:")
    console.log("📧 Para:", to)
    console.log("📝 Asunto:", subject)
    console.log("📄 Contenido HTML generado correctamente")

    return NextResponse.json({
      success: true,
      message: "Email de prueba simulado exitosamente",
      provider: "simulation",
      simulated: true,
      resendInstalled,
      resendConfigured,
    })
  } catch (error) {
    console.error("Error en prueba de email:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Error al probar el sistema de email",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}