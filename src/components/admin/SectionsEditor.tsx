"use client";

import {
  newSubsection,
  swap,
  type SectionState,
} from "@/components/admin/sectionState";
import { fieldClasses, fileFieldClasses } from "@/components/admin/fieldStyles";

export default function SectionsEditor({
  sections,
  onChange,
}: {
  sections: SectionState[];
  onChange: (updater: (prev: SectionState[]) => SectionState[]) => void;
}) {
  function updateSection(index: number, patch: Partial<SectionState>) {
    onChange((prev) => prev.map((s, i) => (i === index ? { ...s, ...patch } : s)));
  }

  function removeSection(index: number) {
    onChange((prev) => prev.filter((_, i) => i !== index));
  }

  function moveSection(index: number, direction: -1 | 1) {
    onChange((prev) => swap(prev, index, direction));
  }

  function addSection() {
    onChange((prev) => [
      ...prev,
      { key: crypto.randomUUID(), heading: "", subsections: [newSubsection()] },
    ]);
  }

  function updateSubsection(
    sectionIndex: number,
    subIndex: number,
    patch: Partial<SectionState["subsections"][number]>
  ) {
    onChange((prev) =>
      prev.map((s, i) =>
        i !== sectionIndex
          ? s
          : {
              ...s,
              subsections: s.subsections.map((sub, j) =>
                j === subIndex ? { ...sub, ...patch } : sub
              ),
            }
      )
    );
  }

  function removeSubsection(sectionIndex: number, subIndex: number) {
    onChange((prev) =>
      prev.map((s, i) =>
        i !== sectionIndex
          ? s
          : { ...s, subsections: s.subsections.filter((_, j) => j !== subIndex) }
      )
    );
  }

  function moveSubsection(
    sectionIndex: number,
    subIndex: number,
    direction: -1 | 1
  ) {
    onChange((prev) =>
      prev.map((s, i) =>
        i !== sectionIndex
          ? s
          : { ...s, subsections: swap(s.subsections, subIndex, direction) }
      )
    );
  }

  function addSubsection(sectionIndex: number) {
    onChange((prev) =>
      prev.map((s, i) =>
        i !== sectionIndex
          ? s
          : { ...s, subsections: [...s.subsections, newSubsection()] }
      )
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {sections.map((section, sIndex) => (
        <div
          key={section.key}
          className="flex flex-col gap-6 rounded border border-border p-6"
        >
          <div className="flex items-center gap-3">
            <input
              value={section.heading}
              onChange={(e) => updateSection(sIndex, { heading: e.target.value })}
              placeholder="Sektionens namn, t.ex. Om världen"
              className={`${fieldClasses} flex-1 font-display text-lg`}
            />
            <button
              type="button"
              onClick={() => moveSection(sIndex, -1)}
              disabled={sIndex === 0}
              className="text-muted hover:text-accent disabled:opacity-30"
              aria-label="Flytta sektion upp"
            >
              ↑
            </button>
            <button
              type="button"
              onClick={() => moveSection(sIndex, 1)}
              disabled={sIndex === sections.length - 1}
              className="text-muted hover:text-accent disabled:opacity-30"
              aria-label="Flytta sektion ner"
            >
              ↓
            </button>
            <button
              type="button"
              onClick={() => removeSection(sIndex)}
              className="text-sm text-accent-deep hover:underline"
            >
              Ta bort sektion
            </button>
          </div>

          <div className="flex flex-col gap-6 border-l border-border pl-4">
            {section.subsections.map((sub, subIndex) => (
              <div key={sub.key} className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <input
                    value={sub.heading}
                    onChange={(e) =>
                      updateSubsection(sIndex, subIndex, { heading: e.target.value })
                    }
                    placeholder="Underkategorins namn, t.ex. Landet"
                    className={`${fieldClasses} flex-1`}
                  />
                  <button
                    type="button"
                    onClick={() => moveSubsection(sIndex, subIndex, -1)}
                    disabled={subIndex === 0}
                    className="text-muted hover:text-accent disabled:opacity-30"
                    aria-label="Flytta underkategori upp"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSubsection(sIndex, subIndex, 1)}
                    disabled={subIndex === section.subsections.length - 1}
                    className="text-muted hover:text-accent disabled:opacity-30"
                    aria-label="Flytta underkategori ner"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeSubsection(sIndex, subIndex)}
                    className="text-sm text-accent-deep hover:underline"
                  >
                    Ta bort
                  </button>
                </div>

                <textarea
                  value={sub.text}
                  onChange={(e) =>
                    updateSubsection(sIndex, subIndex, { text: e.target.value })
                  }
                  rows={3}
                  placeholder="Text"
                  className={fieldClasses}
                />
                <p className="-mt-1 text-xs text-muted">
                  Formatera med **fet text**, *kursiv*, och [länktext](https://exempel.se)
                </p>

                <div className="flex flex-col gap-2">
                  <label className="text-sm text-muted">
                    Bild (valfri, jpg/png/webp)
                  </label>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(e) =>
                      updateSubsection(sIndex, subIndex, {
                        imageFile: e.target.files?.[0] ?? null,
                      })
                    }
                    className={fileFieldClasses}
                  />
                  {sub.imageFile && (
                    <p className="text-sm text-muted">
                      Vald fil: {sub.imageFile.name}
                    </p>
                  )}
                  {sub.existingImageUrl && !sub.imageFile && (
                    <div className="flex items-center gap-3">
                      {/* eslint-disable-next-line @next/next/no-img-element -- admin-förhandsvisning */}
                      <img
                        src={sub.existingImageUrl}
                        alt=""
                        className="max-h-32 rounded border border-border object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          updateSubsection(sIndex, subIndex, {
                            existingImagePath: null,
                            existingImageUrl: null,
                          })
                        }
                        className="text-sm text-accent-deep hover:underline"
                      >
                        Ta bort bild
                      </button>
                    </div>
                  )}
                  {(sub.imageFile || sub.existingImageUrl) && (
                    <>
                      <fieldset className="flex flex-wrap items-center gap-4 text-sm text-muted">
                        <legend className="sr-only">Bildens placering</legend>
                        {(
                          [
                            { value: "right", label: "Höger om texten" },
                            { value: "left", label: "Vänster om texten" },
                            { value: "top", label: "Över texten" },
                            { value: "bottom", label: "Under texten" },
                          ] as const
                        ).map((option) => (
                          <label key={option.value} className="flex items-center gap-2">
                            <input
                              type="radio"
                              checked={sub.imagePosition === option.value}
                              onChange={() =>
                                updateSubsection(sIndex, subIndex, {
                                  imagePosition: option.value,
                                })
                              }
                            />
                            {option.label}
                          </label>
                        ))}
                      </fieldset>
                      <label className="flex items-center gap-2 text-sm text-muted">
                        <input
                          type="checkbox"
                          checked={sub.imageBorder}
                          onChange={(e) =>
                            updateSubsection(sIndex, subIndex, {
                              imageBorder: e.target.checked,
                            })
                          }
                        />
                        Ram runt bilden
                      </label>
                    </>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm text-muted">
                    Ljud (valfri, mp3/wav/ogg)
                  </label>
                  <input
                    type="file"
                    accept="audio/mpeg,audio/wav,audio/ogg"
                    onChange={(e) =>
                      updateSubsection(sIndex, subIndex, {
                        audioFile: e.target.files?.[0] ?? null,
                      })
                    }
                    className={fileFieldClasses}
                  />
                  {sub.audioFile && (
                    <p className="text-sm text-muted">
                      Vald fil: {sub.audioFile.name}
                    </p>
                  )}
                  {sub.existingAudioUrl && !sub.audioFile && (
                    <div className="flex items-center gap-3">
                      <audio src={sub.existingAudioUrl} controls className="flex-1" />
                      <button
                        type="button"
                        onClick={() =>
                          updateSubsection(sIndex, subIndex, {
                            existingAudioPath: null,
                            existingAudioUrl: null,
                          })
                        }
                        className="text-sm text-accent-deep hover:underline"
                      >
                        Ta bort ljud
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addSubsection(sIndex)}
              className="self-start text-sm text-accent hover:underline"
            >
              + Lägg till underkategori
            </button>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addSection}
        className="self-start rounded border border-accent/40 bg-accent/10 px-4 py-2 text-accent transition-colors hover:bg-accent/20"
      >
        + Lägg till sektion
      </button>
    </div>
  );
}
