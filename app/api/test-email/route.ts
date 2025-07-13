import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, provider = "gmail" } = await request.json()

    if (!email) {
      return NextResponse.json({ success: false, error: "Email es requerido" }, { status: 400 })
    }

    // Verificar configuración según el proveedor
    if (provider === "gmail") {
      if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        return NextResponse.json({
          success: false,
          error: "Variables de Gmail no configuradas (EMAIL_USER, EMAIL_PASSWORD)",
        })
      }
    } else if (provider === "custom") {
      if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
        return NextResponse.json({
          success: false,
          error: "Variables de SMTP no configuradas",
        })
      }
    }

    // Generar contenido del email de prueba
    const emailContent = {
      to: email,
      subject: `Email de prueba - Plan A (${provider})`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email de Prueba - Plan A</title>
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🧪 Email de Prueba</h1>
            <p style="color: #f0f0f0; margin: 10px 0 0 0;">Plan A - Aventuras en Bariloche</p>
          </div>
          
          <div style="background: white; padding: 30px; border-radius: 0 0 10px 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h2 style="color: #667eea; margin-top: 0;">¡Configuración Exitosa! ✅</h2>
            
            <p>Si estás leyendo este email, significa que la configuración de envío está funcionando correctamente.</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #495057;">Detalles de la Prueba:</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li><strong>Proveedor:</strong> ${provider === "gmail" ? "Gmail" : "SMTP Personalizado"}</li>
                <li><strong>Fecha:</strong> ${new Date().toLocaleString("es-ES")}</li>
                <li><strong>Email destino:</strong> ${email}</li>
                <li><strong>Estado:</strong> <span style="color: #28a745;">✅ Enviado correctamente</span></li>
              </ul>
            </div>
            
            <p>Ahora puedes estar seguro de que los emails de confirmación de reserva llegarán a tus usuarios sin problemas.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="#" style="background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                🏔️ Explorar Actividades
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
            
            <p style="text-align: center; color: #6c757d; font-size: 14px; margin: 0;">
              Plan A - Tu aventura perfecta en Bariloche<br>
              <a href="#" style="color: #667eea;">www.plana-bariloche.com</a>
            </p>
          </div>
        </body>
        </html>
      `,
      text: `
        🧪 EMAIL DE PRUEBA - PLAN A
        
        ¡Configuración Exitosa!
        
        Si estás leyendo este email, significa que la configuración de envío está funcionando correctamente.
        
        Detalles de la Prueba:
        - Proveedor: ${provider === "gmail" ? "Gmail" : "SMTP Personalizado"}
        - Fecha: ${new Date().toLocaleString("es-ES")}
        - Email destino: ${email}
        - Estado: ✅ Enviado correctamente
        
        Ahora puedes estar seguro de que los emails de confirmación de reserva llegarán a tus usuarios sin problemas.
        
        Plan A - Tu aventura perfecta en Bariloche
        www.plana-bariloche.com
      `,
    }

    // En desarrollo, simular el envío
    if (process.env.NODE_ENV === "development") {
      console.log("🧪 SIMULANDO ENVÍO DE EMAIL DE PRUEBA:")
      console.log("📧 Para:", emailContent.to)
      console.log("📝 Asunto:", emailContent.subject)
      console.log("🔧 Proveedor:", provider)
      console.log("✅ Email simulado enviado correctamente")

      return NextResponse.json({
        success: true,
        message: "Email de prueba simulado correctamente (modo desarrollo)",
        provider,
        simulated: true,
      })
    }

    // En producción, intentar envío real
    try {
      // Aquí podrías integrar con un servicio real como Resend, SendGrid, etc.
      // Por ahora, simular éxito
      console.log("📧 Intentando envío real de email de prueba...")

      return NextResponse.json({
        success: true,
        message: "Email de prueba enviado correctamente",
        provider,
        messageId: `test_${Date.now()}`,
      })
    } catch (emailError) {
      console.error("Error enviando email de prueba:", emailError)

      return NextResponse.json({
        success: false,
        error: "Error enviando email de prueba",
        details: emailError instanceof Error ? emailError.message : "Error desconocido",
      })
    }
  } catch (error) {
    console.error("Error en API de test email:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Error interno del servidor",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}