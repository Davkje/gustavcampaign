import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export type ImagePosition = "left" | "right" | "top" | "bottom";

export type SiteContent = {
  campaignName: string;
  subtitle: string;
  videoUrl: string | null;
  closingText: string;
  sessionZeroDetails: string;
};

export const DEFAULT_CONTENT: SiteContent = {
  campaignName: "[Kampanjnamn]",
  subtitle: "En äventyrarkampanj i Dylorien",
  videoUrl: null,
  closingText: "Vi ses vid bordet",
  sessionZeroDetails: "Datum & plats för session zero: TBD",
};

export type PublicSubsection = {
  id: string;
  heading: string;
  text: string;
  imageUrl: string | null;
  imagePosition: ImagePosition;
  imageBorder: boolean;
  audioUrl: string | null;
};

export type PublicSection = {
  id: string;
  heading: string;
  subsections: PublicSubsection[];
};

export type EditableSubsection = {
  id: string;
  heading: string;
  text: string;
  imagePath: string | null;
  imageUrl: string | null;
  imagePosition: ImagePosition;
  imageBorder: boolean;
  audioPath: string | null;
  audioUrl: string | null;
};

export type EditableSection = {
  id: string;
  heading: string;
  subsections: EditableSubsection[];
};

const MEDIA_BUCKET = "media";

function hasSupabaseConfig() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SECRET_KEY
  );
}

// Server-only läsning av hero/avslutning. Faller tillbaka på platshållare
// om Supabase inte är konfigurerat än, eller om raden saknar värden.
export async function getSiteContent(): Promise<SiteContent> {
  if (!hasSupabaseConfig()) {
    return DEFAULT_CONTENT;
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("site_content")
      .select("campaign_name, subtitle, hero_video_path, closing_text, session_zero_details")
      .eq("id", 1)
      .maybeSingle();

    if (error || !data) {
      return DEFAULT_CONTENT;
    }

    return {
      campaignName: data.campaign_name || DEFAULT_CONTENT.campaignName,
      subtitle: data.subtitle || DEFAULT_CONTENT.subtitle,
      videoUrl: data.hero_video_path
        ? supabase.storage.from(MEDIA_BUCKET).getPublicUrl(data.hero_video_path)
            .data.publicUrl
        : null,
      closingText: data.closing_text || DEFAULT_CONTENT.closingText,
      sessionZeroDetails:
        data.session_zero_details || DEFAULT_CONTENT.sessionZeroDetails,
    };
  } catch {
    return DEFAULT_CONTENT;
  }
}

// Server-only läsning av de anpassningsbara sektionerna/underkategorierna,
// i den ordning Gustav sorterat dem i adminpanelen. Inkluderar både lagrings-
// path (för admin-formuläret, som behöver skicka tillbaka oförändrade
// path-värden) och den publika URL:en (för förhandsvisning/rendering).
export async function getEditableSections(): Promise<EditableSection[]> {
  if (!hasSupabaseConfig()) {
    return [];
  }

  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("sections")
      .select(
        "id, heading, sort_order, subsections(id, heading, text, image_path, image_position, image_border, audio_path, sort_order)"
      )
      .order("sort_order", { ascending: true })
      .order("sort_order", { ascending: true, referencedTable: "subsections" });

    if (error || !data) {
      return [];
    }

    const url = (path: string | null) =>
      path
        ? supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl
        : null;
    const position = (value: string | null): ImagePosition =>
      value === "left" || value === "top" || value === "bottom"
        ? value
        : "right";

    return data.map((section) => ({
      id: section.id,
      heading: section.heading,
      subsections: (section.subsections ?? []).map((sub) => ({
        id: sub.id,
        heading: sub.heading,
        text: sub.text,
        imagePath: sub.image_path,
        imageUrl: url(sub.image_path),
        imagePosition: position(sub.image_position),
        imageBorder: sub.image_border,
        audioPath: sub.audio_path,
        audioUrl: url(sub.audio_path),
      })),
    }));
  } catch {
    return [];
  }
}

export async function getSections(): Promise<PublicSection[]> {
  const sections = await getEditableSections();
  return sections.map((section) => ({
    id: section.id,
    heading: section.heading,
    subsections: section.subsections.map((sub) => ({
      id: sub.id,
      heading: sub.heading,
      text: sub.text,
      imageUrl: sub.imageUrl,
      imagePosition: sub.imagePosition,
      imageBorder: sub.imageBorder,
      audioUrl: sub.audioUrl,
    })),
  }));
}
