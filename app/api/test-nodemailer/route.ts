import { type NextRequest, NextResponse } from "next/server"
import { createTransporter, validateEmailConfig, sendEmailWithRetry } from "@/lib/email-transporter"

// Configurar el runtime para Node.js
export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const { email, provider = "gmail" } = await request.json()

    if (!email) {
      return NextResponse.json({ success: false, error: "Email es requerido" }, { status: 400 })
    }

    console.log(`🧪 Iniciando prueba de Nodemailer con ${provider}...`)

    // Validar configuración
    const validation = validateEmailConfig(provider as "gmail" | "smtp")
    if (!validation.valid) {
      return NextResponse.json({
        success: false,
        error: validation.error,
        missing: validation.missing,
      })
    }

    console.log("✅ Configuración validada")

    // Crear transportador
    const transporter = createTransporter(provider as "gmail" | "smtp")

    // Configurar email de prueba
    const mailOptions = {
      from: {
        name: "Plan A - Prueba Nodemailer",
        address: provider === "gmail" ? process.env.EMAIL_USER! : process.env.SMTP_USER!,
      },
      to: email,
      subject: `✅ Prueba Nodemailer Exitosa - ${provider.toUpperCase()}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Prueba Nodemailer - Plan A</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #4f46e5, #06b6d4); color: white; padding: 30px; text-align: center; border-radius: 10px;">
            <h1 style="margin: 0; font-size: 24px;">🎉 ¡Nodemailer Funcionando!</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Plan A - Sistema de Emails</p>
          </div>
          
          <div style="background: white; padding: 30px; border: 1px solid #e5e7eb; margin-top: 20px; border-radius: 10px;">
            <h2 style="color: #4f46e5; margin-top: 0;">✅ Configuración Exitosa</h2>
            
            <p>¡Excelente! Nodemailer está configurado correctamente y funcionando sin problemas.</p>
            
            <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #374151;">📊 Detalles de la Prueba:</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li><strong>Proveedor:</strong> ${provider.toUpperCase()}</li>
                <li><strong>Fecha:</strong> ${new Date().toLocaleString("es-ES")}</li>
                <li><strong>Destinatario:</strong> ${email}</li>
                <li><strong>Método:</strong> Nodemailer con SMTP</li>
                <li><strong>Estado:</strong> <span style="color: #10b981;">✅ Enviado correctamente</span></li>
              </ul>
            </div>
            
            <div style="background: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #065f46;">🚀 ¿Qué significa esto?</h4>
              <ul style="margin: 0; padding-left: 20px; color: #047857;">
                <li>Las variables de entorno están configuradas correctamente</li>
                <li>La conexión SMTP funciona perfectamente</li>
                <li>Los emails de confirmación se enviarán automáticamente</li>
                <li>El sistema está listo para producción</li>
              </ul>
            </div>
            
            <p>Ahora puedes estar seguro de que los usuarios recibirán sus emails de confirmación de reserva sin problemas.</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="#" style="background: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                🏔️ Explorar Actividades en Bariloche
              </a>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <p style="text-align: center; color: #6b7280; font-size: 14px; margin: 0;">
              Plan A - Aventuras en Bariloche<br>
              Sistema de Emails con Nodemailer<br>
              <strong>¡Completamente Operativo!</strong>
            </p>
          </div>
        </body>
        </html>
      `,
      text: `
🎉 ¡NODEMAILER FUNCIONANDO! - PLAN A

✅ Configuración Exitosa

¡Excelente! Nodemailer está configurado correctamente y funcionando sin problemas.

📊 Detalles de la Prueba:
- Proveedor: ${provider.toUpperCase()}
- Fecha: ${new Date().toLocaleString("es-ES")}
- Destinatario: ${email}
- Método: Nodemailer con SMTP
- Estado: ✅ Enviado correctamente

🚀 ¿Qué significa esto?
- Las variables de entorno están configuradas correctamente
- La conexión SMTP funciona perfectamente
- Los emails de confirmación se enviarán automáticamente
- El sistema está listo para producción

Plan A - Aventuras en Bariloche
Sistema de Emails con Nodemailer
¡Completamente Operativo!
      `,
    }

    // Enviar email con reintentos
    console.log("📧 Enviando email de prueba...")
    const result = await sendEmailWithRetry(transporter, mailOptions)

    if (result.success) {
      console.log("🎉 Email de prueba enviado exitosamente")
      return NextResponse.json({
        success: true,
        message: "Email de prueba con Nodemailer enviado exitosamente",
        messageId: result.messageId,
        provider,
        attempt: result.attempt,
      })
    } else {
      console.error("❌ Error enviando email de prueba:", result.error)
      return NextResponse.json({
        success: false,
        error: "Error enviando email de prueba",
        details: result.error,
        attempts: result.attempts,
      })
    }
  } catch (error) {
    console.error("❌ Error general en prueba de Nodemailer:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Error interno en la prueba",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}