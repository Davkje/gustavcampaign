"use client";

import { useState, useTransition, type FormEvent } from "react";
import { createBrowserClient } from "@/lib/supabase/browser";
import {
  saveContentAction,
  requestMediaUploadUrlAction,
} from "@/app/admin/actions";
import type { SiteContent } from "@/lib/content";
import ImageField from "@/components/admin/ImageField";
import AudioField from "@/components/admin/AudioField";
import { fieldClasses, labelClasses, fileFieldClasses } from "@/components/admin/fieldStyles";

async function uploadIfSelected(
  formData: FormData,
  fileFieldName: string,
  folder: string,
  baseName: string,
  pathFieldName: string
) {
  const file = formData.get(fileFieldName);
  if (file instanceof File && file.size > 0) {
    const { token, path } = await requestMediaUploadUrlAction(
      folder,
      baseName,
      file.name
    );
    const supabase = createBrowserClient();
    const { error } = await supabase.storage
      .from("media")
      .uploadToSignedUrl(path, token, file);
    if (error) {
      throw new Error(`Kunde inte ladda upp filen: ${file.name}`);
    }
    formData.set(pathFieldName, path);
  }
  formData.delete(fileFieldName);
}

export default function AdminForm({
  initialContent,
}: {
  initialContent: SiteContent;
}) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<
    { type: "success" | "error"; text: string } | null
  >(null);
  const [videoFileName, setVideoFileName] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      try {
        await uploadIfSelected(
          formData,
          "video",
          "hero",
          "hero-background",
          "heroVideoPath"
        );
        await uploadIfSelected(
          formData,
          "worldAudio",
          "audio",
          "world-audio",
          "worldAudioPath"
        );
        await uploadIfSelected(
          formData,
          "storyAudio",
          "audio",
          "story-audio",
          "storyAudioPath"
        );
        await uploadIfSelected(
          formData,
          "continentImage",
          "images",
          "continent",
          "continentImagePath"
        );
        await uploadIfSelected(
          formData,
          "countryImage",
          "images",
          "country",
          "countryImagePath"
        );
        await uploadIfSelected(
          formData,
          "regionImage",
          "images",
          "region",
          "regionImagePath"
        );
        await uploadIfSelected(
          formData,
          "storyImage",
          "images",
          "story",
          "storyImagePath"
        );
        await uploadIfSelected(
          formData,
          "prepImage",
          "images",
          "prep",
          "prepImagePath"
        );
        await uploadIfSelected(
          formData,
          "scheduleImage",
          "images",
          "schedule",
          "scheduleImagePath"
        );

        const result = await saveContentAction(formData);
        if (result.error) {
          setMessage({ type: "error", text: result.error });
        } else {
          setMessage({ type: "success", text: "Sparat!" });
          setVideoFileName(null);
        }
      } catch {
        setMessage({ type: "error", text: "Något gick fel. Försök igen." });
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
      <section className="flex flex-col gap-4">
        <h2 className="font-display text-xl text-foreground">Hero</h2>

        <div className="flex flex-col gap-2">
          <label htmlFor="campaignName" className={labelClasses}>
            Kampanjnamn
          </label>
          <input
            id="campaignName"
            name="campaignName"
            defaultValue={initialContent.campaignName}
            className={fieldClasses}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="subtitle" className={labelClasses}>
            Underrubrik
          </label>
          <input
            id="subtitle"
            name="subtitle"
            defaultValue={initialContent.subtitle}
            className={fieldClasses}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="video" className={labelClasses}>
            Bakgrundsvideo (mp4 eller webm)
          </label>
          <input
            id="video"
            name="video"
            type="file"
            accept="video/mp4,video/webm"
            onChange={(e) => setVideoFileName(e.target.files?.[0]?.name ?? null)}
            className={fileFieldClasses}
          />
          {videoFileName && (
            <p className="text-sm text-muted">Vald fil: {videoFileName}</p>
          )}
          {initialContent.videoUrl && !videoFileName && (
            <video
              src={initialContent.videoUrl}
              controls
              muted
              className="mt-2 max-h-40 rounded border border-border"
            />
          )}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="font-display text-xl text-foreground">Om världen</h2>

        <AudioField
          fieldKey="world"
          label="Ljud — uppläsning av hela avsnittet"
          currentAudioUrl={initialContent.worldAudioUrl}
        />

        <div className="flex flex-col gap-3 border-t border-border pt-6">
          <label htmlFor="continentText" className={labelClasses}>
            Kontinenten
          </label>
          <textarea
            id="continentText"
            name="continentText"
            rows={3}
            defaultValue={initialContent.continentText}
            className={fieldClasses}
          />
          <ImageField
            fieldKey="continent"
            currentImageUrl={initialContent.continentImageUrl}
            currentPosition={initialContent.continentImagePosition}
          />
        </div>

        <div className="flex flex-col gap-3 border-t border-border pt-6">
          <label htmlFor="countryText" className={labelClasses}>
            Landet
          </label>
          <textarea
            id="countryText"
            name="countryText"
            rows={3}
            defaultValue={initialContent.countryText}
            className={fieldClasses}
          />
          <ImageField
            fieldKey="country"
            currentImageUrl={initialContent.countryImageUrl}
            currentPosition={initialContent.countryImagePosition}
          />
        </div>

        <div className="flex flex-col gap-3 border-t border-border pt-6">
          <label htmlFor="regionText" className={labelClasses}>
            Regioner
          </label>
          <textarea
            id="regionText"
            name="regionText"
            rows={3}
            defaultValue={initialContent.regionText}
            className={fieldClasses}
          />
          <ImageField
            fieldKey="region"
            currentImageUrl={initialContent.regionImageUrl}
            currentPosition={initialContent.regionImagePosition}
          />
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-xl text-foreground">Story</h2>

        <AudioField
          fieldKey="story"
          label="Ljud — uppläsning av texten"
          currentAudioUrl={initialContent.storyAudioUrl}
        />

        <div className="flex flex-col gap-2">
          <label htmlFor="storyText" className={labelClasses}>
            Story
          </label>
          <textarea
            id="storyText"
            name="storyText"
            rows={4}
            defaultValue={initialContent.storyText}
            className={fieldClasses}
          />
        </div>
        <ImageField
          fieldKey="story"
          currentImageUrl={initialContent.storyImageUrl}
          currentPosition={initialContent.storyImagePosition}
        />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-xl text-foreground">Prep</h2>
        <div className="flex flex-col gap-2">
          <label htmlFor="prepText" className={labelClasses}>
            Prep
          </label>
          <textarea
            id="prepText"
            name="prepText"
            rows={4}
            defaultValue={initialContent.prepText}
            className={fieldClasses}
          />
        </div>
        <ImageField
          fieldKey="prep"
          currentImageUrl={initialContent.prepImageUrl}
          currentPosition={initialContent.prepImagePosition}
        />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-xl text-foreground">Schema</h2>
        <div className="flex flex-col gap-2">
          <label htmlFor="scheduleText" className={labelClasses}>
            Schema
          </label>
          <textarea
            id="scheduleText"
            name="scheduleText"
            rows={4}
            defaultValue={initialContent.scheduleText}
            className={fieldClasses}
          />
        </div>
        <ImageField
          fieldKey="schedule"
          currentImageUrl={initialContent.scheduleImageUrl}
          currentPosition={initialContent.scheduleImagePosition}
        />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-display text-xl text-foreground">Avslutning</h2>
        <div className="flex flex-col gap-2">
          <label htmlFor="closingText" className={labelClasses}>
            Avslutningstext
          </label>
          <textarea
            id="closingText"
            name="closingText"
            rows={2}
            defaultValue={initialContent.closingText}
            className={fieldClasses}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="sessionZeroDetails" className={labelClasses}>
            Datum & plats för session zero
          </label>
          <input
            id="sessionZeroDetails"
            name="sessionZeroDetails"
            defaultValue={initialContent.sessionZeroDetails}
            className={fieldClasses}
          />
        </div>
      </section>

      {message && (
        <p
          className={
            message.type === "success" ? "text-accent" : "text-accent-deep"
          }
        >
          {message.text}
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="self-start rounded border border-accent/40 bg-accent/10 px-6 py-2 font-display text-accent transition-colors hover:bg-accent/20 disabled:opacity-50"
      >
        {isPending ? "Sparar…" : "Spara"}
      </button>
    </form>
  );
}
