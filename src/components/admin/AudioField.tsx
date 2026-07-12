"use client";

import { useState } from "react";
import { fileFieldClasses } from "@/components/admin/fieldStyles";

export default function AudioField({
  fieldKey,
  label,
  currentAudioUrl,
}: {
  fieldKey: string;
  label: string;
  currentAudioUrl: string | null;
}) {
  const [fileName, setFileName] = useState<string | null>(null);
  const fileFieldName = `${fieldKey}Audio`;

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={fileFieldName} className="text-sm text-muted">
        {label} (valfri, mp3/wav/ogg)
      </label>
      <input
        id={fileFieldName}
        name={fileFieldName}
        type="file"
        accept="audio/mpeg,audio/wav,audio/ogg"
        onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)}
        className={fileFieldClasses}
      />
      {fileName && <p className="text-sm text-muted">Vald fil: {fileName}</p>}
      {currentAudioUrl && !fileName && (
        <audio src={currentAudioUrl} controls className="mt-1 w-full" />
      )}
    </div>
  );
}
