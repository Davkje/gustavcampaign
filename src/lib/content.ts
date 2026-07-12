import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export type ImagePosition = "left" | "right";

export type SiteContent = {
  campaignName: string;
  subtitle: string;
  videoUrl: string | null;

  continentText: string;
  continentImageUrl: string | null;
  continentImagePosition: ImagePosition;

  countryText: string;
  countryImageUrl: string | null;
  countryImagePosition: ImagePosition;

  regionText: string;
  regionImageUrl: string | null;
  regionImagePosition: ImagePosition;

  worldAudioUrl: string | null;

  storyText: string;
  storyImageUrl: string | null;
  storyImagePosition: ImagePosition;
  storyAudioUrl: string | null;

  prepText: string;
  prepImageUrl: string | null;
  prepImagePosition: ImagePosition;

  scheduleText: string;
  scheduleImageUrl: string | null;
  scheduleImagePosition: ImagePosition;

  closingText: string;
  sessionZeroDetails: string;
};

export const DEFAULT_CONTENT: SiteContent = {
  campaignName: "[Kampanjnamn]",
  subtitle: "En äventyrarkampanj i Dylorien",
  videoUrl: null,

  continentText: "Platshållartext om kontinenten Occidens kommer här.",
  continentImageUrl: null,
  continentImagePosition: "right",

  countryText: "Platshållartext om landet Dylorien kommer här.",
  countryImageUrl: null,
  countryImagePosition: "right",

  regionText: "Platshållartext om regionerna kommer här.",
  regionImageUrl: null,
  regionImagePosition: "right",

  worldAudioUrl: null,

  storyText: "Platshållartext om kampanjens story kommer här.",
  storyImageUrl: null,
  storyImagePosition: "right",
  storyAudioUrl: null,

  prepText: "Platshållartext om vad ni bör förbereda kommer här.",
  prepImageUrl: null,
  prepImagePosition: "right",

  scheduleText: "Platshållartext om schema och sessionstider kommer här.",
  scheduleImageUrl: null,
  scheduleImagePosition: "right",

  closingText: "Vi ses vid bordet",
  sessionZeroDetails: "Datum & plats för session zero: TBD",
};

const MEDIA_BUCKET = "media";

// Server-only läsning av sidans innehåll. Faller tillbaka på platshållare
// om Supabase inte är konfigurerat än, eller om raden saknar värden.
export async function getSiteContent(): Promise<SiteContent> {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SECRET_KEY
  ) {
    return DEFAULT_CONTENT;
  }

  try {
    const supabase = createAdminClient();
    // Kolumnlistan måste skrivas som en bokstavlig strängliteral direkt här
    // (inte en variabel) för att supabase-js ska kunna typinferera raden.
    const { data, error } = await supabase
      .from("site_content")
      .select(
        `campaign_name, subtitle, hero_video_path,
         continent_text, continent_image_path, continent_image_position,
         country_text, country_image_path, country_image_position,
         region_text, region_image_path, region_image_position,
         world_audio_path,
         story_text, story_image_path, story_image_position, story_audio_path,
         prep_text, prep_image_path, prep_image_position,
         schedule_text, schedule_image_path, schedule_image_position,
         closing_text, session_zero_details`
      )
      .eq("id", 1)
      .maybeSingle();

    if (error || !data) {
      return DEFAULT_CONTENT;
    }

    const url = (path: string | null) =>
      path
        ? supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl
        : null;
    const position = (value: string | null): ImagePosition =>
      value === "left" ? "left" : "right";

    return {
      campaignName: data.campaign_name || DEFAULT_CONTENT.campaignName,
      subtitle: data.subtitle || DEFAULT_CONTENT.subtitle,
      videoUrl: url(data.hero_video_path),

      continentText: data.continent_text || DEFAULT_CONTENT.continentText,
      continentImageUrl: url(data.continent_image_path),
      continentImagePosition: position(data.continent_image_position),

      countryText: data.country_text || DEFAULT_CONTENT.countryText,
      countryImageUrl: url(data.country_image_path),
      countryImagePosition: position(data.country_image_position),

      regionText: data.region_text || DEFAULT_CONTENT.regionText,
      regionImageUrl: url(data.region_image_path),
      regionImagePosition: position(data.region_image_position),

      worldAudioUrl: url(data.world_audio_path),

      storyText: data.story_text || DEFAULT_CONTENT.storyText,
      storyImageUrl: url(data.story_image_path),
      storyImagePosition: position(data.story_image_position),
      storyAudioUrl: url(data.story_audio_path),

      prepText: data.prep_text || DEFAULT_CONTENT.prepText,
      prepImageUrl: url(data.prep_image_path),
      prepImagePosition: position(data.prep_image_position),

      scheduleText: data.schedule_text || DEFAULT_CONTENT.scheduleText,
      scheduleImageUrl: url(data.schedule_image_path),
      scheduleImagePosition: position(data.schedule_image_position),

      closingText: data.closing_text || DEFAULT_CONTENT.closingText,
      sessionZeroDetails:
        data.session_zero_details || DEFAULT_CONTENT.sessionZeroDetails,
    };
  } catch {
    return DEFAULT_CONTENT;
  }
}
