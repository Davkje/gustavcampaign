"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/dal";
import { createAdminClient } from "@/lib/supabase/admin";

const MEDIA_BUCKET = "media";

// Utfärdar en tidsbegränsad, engångsgiltig uppladdnings-URL så att
// webbläsaren kan skicka filen direkt till Supabase Storage. Filen går
// alltså aldrig via vår egen server — det skulle annars begränsas hårt av
// Server Actions body-storlek (och plattformens gränser).
export async function requestMediaUploadUrlAction(
  folder: string,
  baseName: string,
  fileName: string
) {
  await requireAdmin();

  const extMatch = fileName.match(/\.[^.]+$/);
  const ext = extMatch ? extMatch[0].toLowerCase() : "";
  const path = `${folder}/${baseName}${ext}`;

  const supabase = createAdminClient();
  const { data, error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .createSignedUploadUrl(path, { upsert: true });

  if (error || !data) {
    throw new Error("Kunde inte förbereda uppladdningen.");
  }

  return data;
}

export type SubsectionInput = {
  heading: string;
  text: string;
  imagePath: string | null;
  imagePosition: "left" | "right" | "top" | "bottom";
  imageBorder: boolean;
  audioPath: string | null;
};

export type SectionInput = {
  heading: string;
  subsections: SubsectionInput[];
};

export type SaveAllResult = { success?: boolean; error?: string };

// Sparar hela adminsidan i ett svep: hero/avslutning i site_content, och
// hela sektionslistan i sections/subsections.
//
// Sektionerna ersätts i sin helhet varje gång (Gustav bygger fritt med
// lägg till/ta bort/flytta, så det är enklare och säkrare att skriva om
// allt än att räkna ut en diff). Ordningen är medveten: de nya raderna
// skrivs in FÖRST, de gamla tas bort EFTERÅT — går något fel under
// sparandet finns det gamla innehållet kvar istället för att raderas.
export async function saveAllAction(
  formData: FormData,
  sections: SectionInput[]
): Promise<SaveAllResult> {
  await requireAdmin();

  const supabase = createAdminClient();

  const contentUpdate: Record<string, string> = {
    campaign_name: String(formData.get("campaignName") ?? ""),
    subtitle: String(formData.get("subtitle") ?? ""),
    closing_text: String(formData.get("closingText") ?? ""),
    session_zero_details: String(formData.get("sessionZeroDetails") ?? ""),
  };

  const videoPath = formData.get("heroVideoPath");
  if (typeof videoPath === "string" && videoPath.length > 0) {
    contentUpdate.hero_video_path = videoPath;
  }

  const { error: contentError } = await supabase
    .from("site_content")
    .update({ ...contentUpdate, updated_at: new Date().toISOString() })
    .eq("id", 1);

  if (contentError) {
    return { error: "Kunde inte spara. Försök igen." };
  }

  const { data: existingSections, error: fetchError } = await supabase
    .from("sections")
    .select("id");

  if (fetchError) {
    return { error: "Kunde inte läsa nuvarande sektioner. Försök igen." };
  }

  const previousIds = (existingSections ?? []).map((row) => row.id);

  if (sections.length > 0) {
    const { data: insertedSections, error: sectionsError } = await supabase
      .from("sections")
      .insert(
        sections.map((section, index) => ({
          heading: section.heading,
          sort_order: index,
        }))
      )
      .select("id");

    if (sectionsError || !insertedSections) {
      return { error: "Kunde inte spara sektionerna. Försök igen." };
    }

    const subsectionRows = sections.flatMap((section, sectionIndex) =>
      section.subsections.map((sub, subIndex) => ({
        section_id: insertedSections[sectionIndex].id,
        heading: sub.heading,
        text: sub.text,
        image_path: sub.imagePath,
        image_position: sub.imagePosition,
        image_border: sub.imageBorder,
        audio_path: sub.audioPath,
        sort_order: subIndex,
      }))
    );

    if (subsectionRows.length > 0) {
      const { error: subsectionsError } = await supabase
        .from("subsections")
        .insert(subsectionRows);

      if (subsectionsError) {
        // Städa bort de nyss skapade sektionerna igen så vi inte lämnar
        // dubbletter kvar, och behåll det gamla innehållet orört.
        await supabase
          .from("sections")
          .delete()
          .in(
            "id",
            insertedSections.map((row) => row.id)
          );
        return { error: "Kunde inte spara underkategorierna. Försök igen." };
      }
    }
  }

  if (previousIds.length > 0) {
    await supabase.from("sections").delete().in("id", previousIds);
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}
