import { type NextRequest, NextResponse } from "next/server"
import { sendEmail } from "@/lib/email-simple"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email es requerido" }, { status: 400 })
    }

    console.log(`📧 API: Enviando email de prueba a ${email}`)

    const result = await sendEmail({
      to: email,
      subject: "Prueba de Email - Plan A Aventuras",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h1 style="color: #10b981;">¡Email de prueba exitoso!</h1>
          <p>Hola,</p>
          <p>Este es un email de prueba enviado desde la aplicación <strong>Plan A Aventuras</strong>.</p>
          <p>Si estás recibiendo este email, significa que el sistema de envío de correos está funcionando correctamente.</p>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 14px;">Fecha y hora: ${new Date().toLocaleString()}</p>
        </div>
      `,
      text: `
        ¡Email de prueba exitoso!
        
        Hola,
        
        Este es un email de prueba enviado desde la aplicación Plan A Aventuras.
        
        Si estás recibiendo este email, significa que el sistema de envío de correos está funcionando correctamente.
        
        Fecha y hora: ${new Date().toLocaleString()}
      `,
    })

    console.log("📧 API: Resultado del envío:", result)

    return NextResponse.json({
      success: true,
      message: "Email de prueba procesado",
      simulated: result.simulated,
      id: result.id,
    })
  } catch (error) {
    console.error("❌ API: Error:", error)

    return NextResponse.json(
      {
        error: "Error al enviar el email de prueba",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}