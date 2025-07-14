import { type NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const { formData } = await request.json();

    // Extract guide and activity info
    const guideName = formData.name || "(Nombre no especificado)";
    const guideEmail = formData.email || "(Email no especificado)";
    const guidePhone = formData.phone || "(Teléfono no especificado)";
    const guideLocation = formData.location || "(Ubicación no especificada)";
    const guideBio = formData.bio || "(Sin biografía)";
    const guideExperience = formData.experience ? `${formData.experience} años` : "(Sin experiencia)";
    const guideProfilePhoto = formData.profilePhoto || null;

    const activityTitle = formData.activityTitle || "(Sin título)";
    const activityCategory = formData.activityCategory || "(Sin categoría)";
    const activityDuration = formData.activityDuration ? `${formData.activityDuration} horas` : "(Sin duración)";
    const activityPrice = formData.activityPrice || 0;
    const activityDifficulty = formData.activityDifficulty || "(Sin dificultad)";
    const activityLocation = formData.activityLocation || "(Sin ubicación)";
    const activityDescription = formData.activityDescription || "(Sin descripción)";
    const activityPhotos = Array.isArray(formData.activityPhotos) && formData.activityPhotos.length > 0 ? formData.activityPhotos : [];

    // --- Save to mockActivities.ts ---
    const mockPath = path.join(process.cwd(), "data", "mockActivities.ts");
    let fileContent = fs.readFileSync(mockPath, "utf-8");
    // Extract the array
    const arrayStart = fileContent.indexOf("[");
    const arrayEnd = fileContent.lastIndexOf("]");
    const arrText = fileContent.substring(arrayStart, arrayEnd + 1);
    let activitiesArr = [];
    try {
      activitiesArr = eval(arrText); // Only safe for local dev, not prod!
    } catch (e) {
      activitiesArr = [];
    }
    // Generate new id
    const newId = (activitiesArr.length + 1).toString();
    // Format new activity
    const newActivity = {
      id: newId,
      title: activityTitle,
      description: activityDescription,
      image: activityPhotos[0] || "",
      price: activityPrice,
      duration: activityDuration,
      location: activityLocation,
      rating: 0,
      category: activityCategory,
      season: "-",
      difficulty: activityDifficulty,
      included: [],
      notIncluded: [],
      requirements: [],
      startTimes: [],
      guide: {
        name: guideName,
        image: guideProfilePhoto || "",
        experience: guideExperience,
        languages: [],
        bio: guideBio,
        phone: guidePhone,
      },
      images: activityPhotos,
    };
    activitiesArr.push(newActivity);
    // Replace the array in the file
    const newArrText = JSON.stringify(activitiesArr, null, 2);
    const newFileContent = fileContent.substring(0, arrayStart) + newArrText + fileContent.substring(arrayEnd + 1);
    fs.writeFileSync(mockPath, newFileContent, "utf-8");
    // --- End save ---
    console.log("New activity saved:", newActivity);
    return NextResponse.json({ success: true, newActivity });
  } catch (error) {
    console.error("Error saving activity to mockActivities.ts:", error);
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
} 