export const runtime = "nodejs";
import { type NextRequest, NextResponse } from "next/server"
import { sendEmail } from "@/lib/email-simple"
import type { BookingConfirmationData } from "@/lib/email-service"

export async function POST(request: NextRequest) {
  try {
    console.log("📧 API: Iniciando procesamiento de email...")

    const data: BookingConfirmationData = await request.json()
    console.log("📧 API: Datos recibidos:", {
      email: data.personalInfo?.email,
      activity: data.activity?.title,
      code: data.bookingDetails?.confirmationCode,
    })

    // Validar que tenemos todos los datos necesarios
    if (!data.personalInfo?.email || !data.activity?.title || !data.bookingDetails?.confirmationCode) {
      console.error("❌ API: Datos incompletos")
      return NextResponse.json({ error: "Datos incompletos para enviar el email" }, { status: 400 })
    }

    // Generar contenido del email
    const emailContent = generateEmailContent(data)
    const textContent = generateTextContent(data)

    console.log("📧 API: Contenido generado exitosamente")

    // Enviar email usando el servicio simplificado
    const result = await sendEmail({
      to: data.personalInfo.email,
      subject: `Confirmación de reserva - ${data.activity.title}`,
      html: emailContent,
      text: textContent,
    })

    console.log("📧 API: Resultado del envío:", result)

    // Preparar respuesta
    const response = {
      success: true,
      message: "Email de confirmación procesado exitosamente",
      emailSent: true,
      simulated: result.simulated,
      id: result.id,
    }

    // Si fue simulado, agregar información adicional
    if (result.simulated) {
      response.message += " (modo simulación)"
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error("❌ API: Error general:", error)

    return NextResponse.json(
      {
        error: "Error interno al procesar la solicitud",
        details: error instanceof Error ? error.message : "Error desconocido",
      },
      { status: 500 },
    )
  }
}

function generateEmailContent(data: BookingConfirmationData): string {
  const { personalInfo, activity, bookingDetails } = data

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmación de Reserva - Plan A</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f8fafc;
        }
        
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .header {
          background: linear-gradient(135deg, #10b981, #0ea5e9);
          color: white;
          padding: 40px 30px;
          text-align: center;
        }
        
        .header h1 {
          font-size: 28px;
          margin-bottom: 10px;
          font-weight: 700;
        }
        
        .header p {
          font-size: 16px;
          opacity: 0.9;
        }
        
        .content {
          padding: 30px;
        }
        
        .greeting {
          font-size: 18px;
          margin-bottom: 20px;
          color: #1f2937;
        }
        
        .confirmation-code {
          background: linear-gradient(135deg, #ecfdf5, #d1fae5);
          border: 2px solid #10b981;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          margin: 25px 0;
        }
        
        .confirmation-code h3 {
          color: #065f46;
          margin-bottom: 10px;
          font-size: 16px;
        }
        
        .confirmation-code .code {
          font-size: 24px;
          font-weight: bold;
          color: #10b981;
          font-family: 'Courier New', monospace;
          letter-spacing: 2px;
        }
        
        .booking-details {
          background: #f8fafc;
          border-radius: 12px;
          padding: 25px;
          margin: 25px 0;
          border-left: 4px solid #10b981;
        }
        
        .booking-details h3 {
          color: #1f2937;
          margin-bottom: 15px;
          font-size: 18px;
        }
        
        .detail-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 0;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .detail-item:last-child {
          border-bottom: none;
        }
        
        .detail-label {
          font-weight: 500;
          color: #6b7280;
        }
        
        .detail-value {
          font-weight: 600;
          color: #1f2937;
        }
        
        .price-total {
          background: #fef3c7;
          border-radius: 8px;
          padding: 15px;
          margin-top: 15px;
        }
        
        .price-total .detail-item {
          border-bottom: none;
          font-size: 18px;
          font-weight: bold;
        }
        
        .info-section {
          margin: 25px 0;
        }
        
        .info-section h3 {
          color: #1f2937;
          margin-bottom: 15px;
          font-size: 18px;
        }
        
        .info-list {
          list-style: none;
          padding: 0;
        }
        
        .info-list li {
          padding: 8px 0;
          padding-left: 25px;
          position: relative;
        }
        
        .info-list li:before {
          content: "✓";
          position: absolute;
          left: 0;
          color: #10b981;
          font-weight: bold;
        }
        
        .guide-info {
          background: #eff6ff;
          border-radius: 12px;
          padding: 20px;
          margin: 20px 0;
          border-left: 4px solid #3b82f6;
        }
        
        .guide-info h3 {
          color: #1e40af;
          margin-bottom: 10px;
        }
        
        .whatsapp-button {
          display: inline-block;
          background: #25d366;
          color: white;
          padding: 12px 20px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
          margin-top: 10px;
        }
        
        .footer {
          background: #f9fafb;
          padding: 30px;
          text-align: center;
          border-top: 1px solid #e5e7eb;
        }
        
        .footer h3 {
          color: #10b981;
          margin-bottom: 10px;
        }
        
        .footer p {
          color: #6b7280;
          margin: 5px 0;
        }
        
        .footer .small {
          font-size: 12px;
          margin-top: 15px;
        }
        
        @media (max-width: 600px) {
          .container {
            margin: 0;
          }
          
          .header, .content, .footer {
            padding: 20px;
          }
          
          .confirmation-code .code {
            font-size: 20px;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>¡Reserva Confirmada! 🎉</h1>
          <p>Tu aventura en Bariloche está lista para disfrutar</p>
        </div>
        
        <div class="content">
          <div class="greeting">
            Hola <strong>${personalInfo.firstName} ${personalInfo.lastName}</strong>,
          </div>
          
          <p>¡Excelente noticia! Tu reserva para <strong>${activity.title}</strong> ha sido confirmada exitosamente.</p>
          
          <div class="confirmation-code">
            <h3>Código de confirmación</h3>
            <div class="code">${bookingDetails.confirmationCode}</div>
          </div>
          
          <div class="booking-details">
            <h3>📋 Detalles de tu reserva</h3>
            <div class="detail-item">
              <span class="detail-label">Actividad:</span>
              <span class="detail-value">${activity.title}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Fecha:</span>
              <span class="detail-value">${bookingDetails.date}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Participantes:</span>
              <span class="detail-value">${bookingDetails.participants} persona(s)</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Duración:</span>
              <span class="detail-value">${activity.duration}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Ubicación:</span>
              <span class="detail-value">${activity.location}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Guía:</span>
              <span class="detail-value">${activity.guide?.name || "Asignado en destino"}</span>
            </div>
            
            <div class="price-total">
              <div class="detail-item">
                <span class="detail-label">Precio total:</span>
                <span class="detail-value">$${bookingDetails.totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div class="info-section">
            <h3>📝 Información importante</h3>
            <ul class="info-list">
              <li>Llega 15 minutos antes del horario de inicio</li>
              <li>Trae ropa cómoda y adecuada para la actividad</li>
              <li>No olvides tu documento de identidad</li>
              <li>En caso de mal clima, te contactaremos para reprogramar</li>
              <li>Mantén este email como comprobante de tu reserva</li>
            </ul>
          </div>
          
          <div class="guide-info">
            <h3>👨‍🏫 Contacto del guía</h3>
            <p><strong>${activity.guide?.name || "Tu guía"}</strong></p>
            <p>Teléfono: ${activity.guide?.phone || "+54 9 294 123-4567"}</p>
            <a href="https://wa.me/5492944123456?text=${encodeURIComponent(
              `Hola, tengo una reserva para la actividad "${activity.title}" con el código ${bookingDetails.confirmationCode}. ¿Podría darme más información?`,
            )}" class="whatsapp-button">
              💬 Contactar por WhatsApp
            </a>
          </div>
          
          <p style="margin-top: 30px;">
            Si tienes alguna pregunta o necesitas hacer cambios en tu reserva, no dudes en contactarnos respondiendo a este email o a través de WhatsApp.
          </p>
          
          <p style="margin-top: 20px; font-weight: 600; color: #10b981;">
            ¡Esperamos que disfrutes mucho de tu aventura en Bariloche! 🏔️
          </p>
        </div>
        
        <div class="footer">
          <h3>Plan A - Aventuras en Bariloche</h3>
          <p>📧 Email: plan.a.aventuras@gmail.com</p>
          <p>📱 Teléfono: +54 9 294 123-4567</p>
          <p>🌐 Web: plana.website</p>
          <p class="small">
            Este es un email automático de confirmación. Si tienes consultas, puedes responder a este email y te contactaremos a la brevedad.
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

function generateTextContent(data: BookingConfirmationData): string {
  const { personalInfo, activity, bookingDetails } = data

  return `
    PLAN A - CONFIRMACIÓN DE RESERVA

    ¡Hola ${personalInfo.firstName} ${personalInfo.lastName}!

    Tu reserva para "${activity.title}" ha sido confirmada exitosamente.

    CÓDIGO DE CONFIRMACIÓN: ${bookingDetails.confirmationCode}

    DETALLES DE LA RESERVA:
    - Actividad: ${activity.title}
    - Fecha: ${bookingDetails.date}
    - Participantes: ${bookingDetails.participants} persona(s)
    - Duración: ${activity.duration}
    - Ubicación: ${activity.location}
    - Guía: ${activity.guide?.name || "Asignado en destino"}
    - Precio total: $${bookingDetails.totalPrice.toLocaleString()}

    INFORMACIÓN IMPORTANTE:
    - Llega 15 minutos antes del horario de inicio
    - Trae ropa cómoda y adecuada para la actividad
    - No olvides tu documento de identidad
    - En caso de mal clima, te contactaremos para reprogramar

    CONTACTO DEL GUÍA:
    ${activity.guide?.name || "Tu guía"}
    Teléfono: ${activity.guide?.phone || "+54 9 294 123-4567"}
    WhatsApp: https://wa.me/5492944123456

    ¡Esperamos que disfrutes mucho de tu aventura en Bariloche!

    Plan A - Aventuras en Bariloche
    Email: plan.a.aventuras@gmail.com
    Teléfono: +54 9 294 123-4567
    Web: plana.website
      `
}