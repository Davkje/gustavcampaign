"use client";

import { useState } from "react";
import type { ImagePosition } from "@/lib/content";
import { fileFieldClasses } from "@/components/admin/fieldStyles";

export default function ImageField({
  fieldKey,
  currentImageUrl,
  currentPosition,
}: {
  fieldKey: string;
  currentImageUrl: string | null;
  currentPosition: ImagePosition;
}) {
  const [fileName, setFileName] = useState<string | null>(null);
  const fileFieldName = `${fieldKey}Image`;
  const positionFieldName = `${fieldKey}ImagePosition`;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={fileFieldName} className="text-sm text-muted">
        Bild (valfri, jpg/png/webp)
      </label>
      <input
        id={fileFieldName}
        name={fileFieldName}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
        className={fileFieldClasses}
      />
      {fileName && <p className="text-sm text-muted">Vald fil: {fileName}</p>}
      {currentImageUrl && !fileName && (
        // eslint-disable-next-line @next/next/no-img-element -- admin-förhandsvisning, ingen next/image-vinst
        <img
          src={currentImageUrl}
          alt=""
          className="mt-1 max-h-32 rounded border border-border object-cover"
        />
      )}

      <fieldset className="flex items-center gap-4 text-sm text-muted">
        <legend className="sr-only">Bildens placering</legend>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name={positionFieldName}
            value="right"
            defaultChecked={currentPosition !== "left"}
          />
          Höger om texten
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name={positionFieldName}
            value="left"
            defaultChecked={currentPosition === "left"}
          />
          Vänster om texten
        </label>
      </fieldset>
    </div>
  );
}
