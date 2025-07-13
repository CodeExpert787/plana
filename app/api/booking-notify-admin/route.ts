import { type NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email-simple";
import type { BookingConfirmationData } from "@/lib/email-service";

export async function POST(request: NextRequest) {
  try {
    const data: BookingConfirmationData = await request.json();
    const adminEmail = process.env.ADMIN_EMAIL || "talentdev343@gmail.com";
    const subject = `Nueva reserva: ${data.activity.title}`;

    // Extract booking and user info
    const { personalInfo, activity, bookingDetails, paymentInfo } = data;

    const html = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f4f6fa; padding: 32px; border-radius: 16px; max-width: 700px; margin: auto; box-shadow: 0 4px 24px #0002;">
        <h2 style="color: #10b981; margin-bottom: 0.5em;">Nueva Reserva Recibida</h2>
        <div style="margin-bottom: 1.5em; color: #374151;">Se ha realizado una nueva reserva en Plan A.</div>
        <div style="background: #fff; border-radius: 12px; box-shadow: 0 2px 8px #0001; padding: 20px; margin-bottom: 24px;">
          <h3 style="color: #2563eb; margin-bottom: 0.7em; font-size: 1.2em;">👤 Datos del Cliente</h3>
          <table style="width: 100%; font-size: 1em; color: #111827; border-collapse: collapse;">
            <tr><td style="font-weight: 600; padding: 4px 0;">Nombre:</td><td>${personalInfo.firstName} ${personalInfo.lastName}</td></tr>
            <tr><td style="font-weight: 600; padding: 4px 0;">Email:</td><td><a href="mailto:${personalInfo.email}" style="color: #2563eb;">${personalInfo.email}</a></td></tr>
            <tr><td style="font-weight: 600; padding: 4px 0;">Teléfono:</td><td>${personalInfo.phone || "-"}</td></tr>
          </table>
        </div>
        <div style="background: #fff; border-radius: 12px; box-shadow: 0 2px 8px #0001; padding: 20px; margin-bottom: 24px;">
          <h3 style="color: #059669; margin-bottom: 0.7em; font-size: 1.2em;">🏞️ Detalles de la Reserva</h3>
          <table style="width: 100%; font-size: 1em; color: #374151; border-collapse: collapse;">
            <tr><td style="font-weight: 600; padding: 4px 0;">Actividad:</td><td>${activity.title}</td></tr>
            <tr><td style="font-weight: 600; padding: 4px 0;">Fecha:</td><td>${bookingDetails.date}</td></tr>
            <tr><td style="font-weight: 600; padding: 4px 0;">Participantes:</td><td>${bookingDetails.participants}</td></tr>
            <tr><td style="font-weight: 600; padding: 4px 0;">Duración:</td><td>${activity.duration}</td></tr>
            <tr><td style="font-weight: 600; padding: 4px 0;">Ubicación:</td><td>${activity.location}</td></tr>
            <tr><td style="font-weight: 600; padding: 4px 0;">Guía:</td><td>${activity.guide?.name || "Asignado en destino"}</td></tr>
            <tr><td style="font-weight: 600; padding: 4px 0;">Precio total:</td><td>$${bookingDetails.totalPrice.toLocaleString()}</td></tr>
            <tr><td style="font-weight: 600; padding: 4px 0;">Código de confirmación:</td><td>${bookingDetails.confirmationCode}</td></tr>
            <tr><td style="font-weight: 600; padding: 4px 0;">ID de reserva:</td><td>${bookingDetails.bookingId}</td></tr>
          </table>
        </div>
        ${paymentInfo ? `
        <div style="background: #fff; border-radius: 12px; box-shadow: 0 2px 8px #0001; padding: 20px; margin-bottom: 24px;">
          <h3 style="color: #b45309; margin-bottom: 0.7em; font-size: 1.2em;">💳 Información de Pago</h3>
          <table style="width: 100%; font-size: 1em; color: #374151; border-collapse: collapse;">
            <tr><td style="font-weight: 600; padding: 4px 0;">Tarjeta:</td><td>${paymentInfo.cardNumber}</td></tr>
            <tr><td style="font-weight: 600; padding: 4px 0;">Nombre:</td><td>${paymentInfo.cardName}</td></tr>
            <tr><td style="font-weight: 600; padding: 4px 0;">Vencimiento:</td><td>${paymentInfo.expiry}</td></tr>
          </table>
        </div>
        ` : ""}
        <div style="margin-top: 2em; color: #6b7280; font-size: 0.95em; text-align: center;">Nueva reserva registrada en Plan A.</div>
      </div>
    `;

    const text = `Nueva reserva recibida en Plan A\n\nCliente:\n- Nombre: ${personalInfo.firstName} ${personalInfo.lastName}\n- Email: ${personalInfo.email}\n- Teléfono: ${personalInfo.phone || "-"}\n\nReserva:\n- Actividad: ${activity.title}\n- Fecha: ${bookingDetails.date}\n- Participantes: ${bookingDetails.participants}\n- Duración: ${activity.duration}\n- Ubicación: ${activity.location}\n- Guía: ${activity.guide?.name || "Asignado en destino"}\n- Precio total: $${bookingDetails.totalPrice.toLocaleString()}\n- Código de confirmación: ${bookingDetails.confirmationCode}\n- ID de reserva: ${bookingDetails.bookingId}\n${paymentInfo ? `\nInformación de pago:\n- Tarjeta:  ${paymentInfo.cardNumber}\n- Nombre: ${paymentInfo.cardName}\n- Vencimiento: ${paymentInfo.expiry}\n` : ""}`;

    const result = await sendEmail({
      to: adminEmail,
      subject,
      html,
      text
    });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error sending booking admin notification:", error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
} 