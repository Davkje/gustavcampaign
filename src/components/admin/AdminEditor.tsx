"use client";

import { useState, useTransition, type FormEvent } from "react";
import { createBrowserClient } from "@/lib/supabase/browser";
import {
  requestMediaUploadUrlAction,
  saveAllAction,
  type SectionInput,
  type SubsectionInput,
} from "@/app/admin/actions";
import type { SiteContent, EditableSection } from "@/lib/content";
import SectionsEditor from "@/components/admin/SectionsEditor";
import { fromInitialSections, type SectionState } from "@/components/admin/sectionState";
import { fieldClasses, labelClasses, fileFieldClasses } from "@/components/admin/fieldStyles";

async function uploadFile(folder: string, file: File): Promise<string> {
  const { token, path } = await requestMediaUploadUrlAction(
    folder,
    crypto.randomUUID(),
    file.name
  );
  const supabase = createBrowserClient();
  const { error } = await supabase.storage
    .from("media")
    .uploadToSignedUrl(path, token, file);
  if (error) {
    throw new Error("Kunde inte ladda upp filen.");
  }
  return path;
}

export default function AdminEditor({
  initialContent,
  initialSections,
}: {
  initialContent: SiteContent;
  initialSections: EditableSection[];
}) {
  const [sections, setSections] = useState<SectionState[]>(() =>
    fromInitialSections(initialSections)
  );
  const [videoFileName, setVideoFileName] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<
    { type: "success" | "error"; text: string } | null
  >(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    const formData = new FormData(event.currentTarget);
    const videoFile = formData.get("video");

    startTransition(async () => {
      try {
        if (videoFile instanceof File && videoFile.size > 0) {
          const { token, path } = await requestMediaUploadUrlAction(
            "hero",
            "hero-background",
            videoFile.name
          );
          const supabase = createBrowserClient();
          const { error: uploadError } = await supabase.storage
            .from("media")
            .uploadToSignedUrl(path, token, videoFile);

          if (uploadError) {
            setMessage({
              type: "error",
              text: "Kunde inte ladda upp videon. Försök igen.",
            });
            return;
          }
          formData.set("heroVideoPath", path);
        }
        formData.delete("video");

        const sectionsPayload: SectionInput[] = [];
        for (const section of sections) {
          const subInputs: SubsectionInput[] = [];

          for (const sub of section.subsections) {
            const imagePath = sub.imageFile
              ? await uploadFile("images", sub.imageFile)
              : sub.existingImagePath;
            const audioPath = sub.audioFile
              ? await uploadFile("audio", sub.audioFile)
              : sub.existingAudioPath;

            subInputs.push({
              heading: sub.heading,
              text: sub.text,
              imagePath,
              imagePosition: sub.imagePosition,
              imageBorder: sub.imageBorder,
              audioPath,
            });
          }

          sectionsPayload.push({ heading: section.heading, subsections: subInputs });
        }

        const result = await saveAllAction(formData, sectionsPayload);
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

      <div className="flex flex-col gap-4 border-t border-border pt-10">
        <h2 className="font-display text-2xl text-accent">Sektioner</h2>
        <p className="text-sm text-muted">
          Bygg fritt med egna sektioner och underkategorier — som &quot;Om
          världen&quot; med &quot;Landet&quot; och &quot;Politik&quot; under.
        </p>
        <SectionsEditor sections={sections} onChange={setSections} />
      </div>

      <section className="flex flex-col gap-4 border-t border-border pt-10">
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
