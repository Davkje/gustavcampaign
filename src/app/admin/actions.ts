"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth/dal";
import { createAdminClient } from "@/lib/supabase/admin";

const MEDIA_BUCKET = "media";

export type SaveContentResult = { success?: boolean; error?: string };

function stringField(formData: FormData, key: string) {
  return String(formData.get(key) ?? "");
}

function positionField(formData: FormData, key: string) {
  return formData.get(key) === "left" ? "left" : "right";
}

// Sätter update[key] bara om formuläret skickade med en ny uppladdad fils
// path — annars lämnas den befintliga bilden/ljudet i databasen orört.
function pathField(
  update: Record<string, string>,
  formData: FormData,
  formKey: string,
  columnKey: string
) {
  const value = formData.get(formKey);
  if (typeof value === "string" && value.length > 0) {
    update[columnKey] = value;
  }
}

export async function saveContentAction(
  formData: FormData
): Promise<SaveContentResult> {
  await requireAdmin();

  const update: Record<string, string> = {
    campaign_name: stringField(formData, "campaignName"),
    subtitle: stringField(formData, "subtitle"),

    continent_text: stringField(formData, "continentText"),
    continent_image_position: positionField(formData, "continentImagePosition"),
    country_text: stringField(formData, "countryText"),
    country_image_position: positionField(formData, "countryImagePosition"),
    region_text: stringField(formData, "regionText"),
    region_image_position: positionField(formData, "regionImagePosition"),

    story_text: stringField(formData, "storyText"),
    story_image_position: positionField(formData, "storyImagePosition"),

    prep_text: stringField(formData, "prepText"),
    prep_image_position: positionField(formData, "prepImagePosition"),

    schedule_text: stringField(formData, "scheduleText"),
    schedule_image_position: positionField(formData, "scheduleImagePosition"),

    closing_text: stringField(formData, "closingText"),
    session_zero_details: stringField(formData, "sessionZeroDetails"),
  };

  pathField(update, formData, "heroVideoPath", "hero_video_path");
  pathField(update, formData, "worldAudioPath", "world_audio_path");
  pathField(update, formData, "storyAudioPath", "story_audio_path");
  pathField(update, formData, "continentImagePath", "continent_image_path");
  pathField(update, formData, "countryImagePath", "country_image_path");
  pathField(update, formData, "regionImagePath", "region_image_path");
  pathField(update, formData, "storyImagePath", "story_image_path");
  pathField(update, formData, "prepImagePath", "prep_image_path");
  pathField(update, formData, "scheduleImagePath", "schedule_image_path");

  const supabase = createAdminClient();
  const { error } = await supabase
    .from("site_content")
    .update({ ...update, updated_at: new Date().toISOString() })
    .eq("id", 1);

  if (error) {
    return { error: "Kunde inte spara. Försök igen." };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { success: true };
}

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
