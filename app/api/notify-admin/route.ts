import { type NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email-simple";

export async function POST(request: NextRequest) {
  try {
    const { formData } = await request.json();
    const adminEmail = process.env.ADMIN_EMAIL || "talentdev343@gmail.com";
    const subject = "¡Nuevo Guía quiere unirse a Plan A!";

    // Extract guide info and activity info
    const guideName = formData.name || "(Nombre no especificado)";
    const guideEmail = formData.email || "(Email no especificado)";
    const guidePhone = formData.phone || "(Teléfono no especificado)";
    const guideLocation = formData.location || "(Ubicación no especificada)";
    const guideBio = formData.bio || "(Sin biografía)";
    const guideExperience = formData.experience ? `${formData.experience} años` : "(Sin experiencia)";
    const guideSpecialties = Array.isArray(formData.specialties) && formData.specialties.length > 0 ? formData.specialties.join(", ") : "(Sin especialidades)";
    const guideCertifications = Array.isArray(formData.certifications) && formData.certifications.length > 0 ? formData.certifications.join(", ") : "(Sin certificaciones)";
    const guideProfilePhoto = formData.profilePhoto || null;

    // Activity info
    const activityTitle = formData.activityTitle || "(Sin título)";
    const activityCategory = formData.activityCategory || "(Sin categoría)";
    const activityDuration = formData.activityDuration ? `${formData.activityDuration} horas` : "(Sin duración)";
    const activityPrice = formData.activityPrice ? `$${formData.activityPrice}` : "(Sin precio)";
    const activityDifficulty = formData.activityDifficulty || "(Sin dificultad)";
    const activityLocation = formData.activityLocation || "(Sin ubicación)";
    const activityDescription = formData.activityDescription || "(Sin descripción)";
    const activityPhotos = Array.isArray(formData.activityPhotos) && formData.activityPhotos.length > 0 ? formData.activityPhotos : [];

    // Build a data science dashboard-inspired, friendly HTML email
    const html = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #f4f6fa; padding: 32px; border-radius: 16px; max-width: 700px; margin: auto; box-shadow: 0 4px 24px #0002;">
        <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 24px;">
          <div>
            <h2 style="color: #10b981; margin: 0 0 0.2em 0; font-size: 2em; font-weight: 700;">Nuevo Guía: ${guideName}</h2>
            <div style="color: #374151; font-size: 1.1em;">¡Quiere unirse a <b>Plan A</b> y ya publicó su primera actividad!</div>
          </div>
        </div>
        <div style="display: flex; gap: 24px; flex-wrap: wrap;">
          <div style="flex: 1 1 260px; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px #0001; padding: 20px; margin-bottom: 24px; min-width: 260px;">
            <h3 style="color: #2563eb; margin-bottom: 0.7em; font-size: 1.2em;">👤 Datos del Guía</h3>
            <table style="width: 100%; font-size: 1em; color: #111827; border-collapse: collapse;">
              <tr><td style="font-weight: 600; padding: 4px 0;">Nombre:</td><td>${guideName}</td></tr>
              <tr><td style="font-weight: 600; padding: 4px 0;">Email:</td><td><a href="mailto:${guideEmail}" style="color: #2563eb;">${guideEmail}</a></td></tr>
              <tr><td style="font-weight: 600; padding: 4px 0;">Teléfono:</td><td>${guidePhone}</td></tr>
              <tr><td style="font-weight: 600; padding: 4px 0;">Ubicación:</td><td>${guideLocation}</td></tr>
              <tr><td style="font-weight: 600; padding: 4px 0;">Experiencia:</td><td>${guideExperience}</td></tr>
              <tr><td style="font-weight: 600; padding: 4px 0;">Especialidades:</td><td>${guideSpecialties}</td></tr>
              <tr><td style="font-weight: 600; padding: 4px 0;">Certificaciones:</td><td>${guideCertifications}</td></tr>
            </table>
            <div style="margin-top: 1em; color: #374151; font-size: 0.98em;"><b>Biografía:</b><br/>${guideBio}</div>
          </div>
          <div style="flex: 1 1 320px; background: #fff; border-radius: 12px; box-shadow: 0 2px 8px #0001; padding: 20px; margin-bottom: 24px; min-width: 320px;">
            <h3 style="color: #059669; margin-bottom: 0.7em; font-size: 1.2em;">🏞️ Actividad Publicada</h3>
            <table style="width: 100%; font-size: 1em; color: #374151; border-collapse: collapse;">
              <tr><td style="font-weight: 600; padding: 4px 0;">Título:</td><td>${activityTitle}</td></tr>
              <tr><td style="font-weight: 600; padding: 4px 0;">Categoría:</td><td>${activityCategory}</td></tr>
              <tr><td style="font-weight: 600; padding: 4px 0;">Duración:</td><td>${activityDuration}</td></tr>
              <tr><td style="font-weight: 600; padding: 4px 0;">Precio:</td><td>${activityPrice}</td></tr>
              <tr><td style="font-weight: 600; padding: 4px 0;">Dificultad:</td><td>${activityDifficulty}</td></tr>
              <tr><td style="font-weight: 600; padding: 4px 0;">Ubicación:</td><td>${activityLocation}</td></tr>
            </table>
            <div style="margin-top: 1em; color: #374151; font-size: 0.98em;"><b>Descripción:</b><br/>${activityDescription}</div>
          </div>
        </div>
        <div style="background: #eff6ff; border-radius: 12px; padding: 20px; margin: 20px 0; border-left: 4px solid #3b82f6;">
            <h3 style="color: #1e40af; margin-bottom: 10px;">👨‍🏫 Contacto del guía</h3>
            <p><strong>${guideName || "Tu guía"}</strong></p>
            <p>Teléfono: ${guidePhone || "+54 9 294 123-4567"}</p>
            <a href="https://wa.me/${guidePhone}?text=${encodeURIComponent(
              `Hola, tengo una reserva para la actividad "${activityTitle}" `,
            )}" style="display: inline-block; background: #25d366; color: white; padding: 12px 20px; text-decoration: none; border-radius: 8px; font-weight: 600; margin-top: 10px;">
              💬 Contactar por WhatsApp
            </a>
          </div>
        <div style="margin-top: 24px; text-align: center;">
          <a href="https://plana.website/admin" style="display: inline-block; background: linear-gradient(90deg, #10b981, #2563eb); color: #fff; padding: 12px 32px; border-radius: 8px; font-size: 1.1em; font-weight: 600; text-decoration: none; box-shadow: 0 2px 8px #10b98133;">Revisar y Aprobar Guía</a>
        </div>
        <p style="margin-top: 2em; color: #6b7280; font-size: 0.95em; text-align: center;">¡Gracias por ayudar a que Plan A siga creciendo! 🌟</p>
      </div>
      
    `;
    const text = `Nuevo guía quiere unirse a Plan A\nNombre: ${guideName}\nEmail: ${guideEmail}\nTeléfono: ${guidePhone}\nUbicación: ${guideLocation}\nExperiencia: ${guideExperience}\nEspecialidades: ${guideSpecialties}\nCertificaciones: ${guideCertifications}\nBiografía: ${guideBio}\n\nActividad Publicada:\nTítulo: ${activityTitle}\nCategoría: ${activityCategory}\nDuración: ${activityDuration}\nPrecio: ${activityPrice}\nDificultad: ${activityDifficulty}\nUbicación: ${activityLocation}\nDescripción: ${activityDescription}`;

    const result = await sendEmail({
      to: adminEmail,
      subject,
      html,
      text
    });

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Error sending admin notification:", error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
} 