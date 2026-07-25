import type { EditableSection, ImagePosition } from "@/lib/content";

export type SubsectionState = {
  key: string;
  heading: string;
  text: string;
  imageFile: File | null;
  existingImagePath: string | null;
  existingImageUrl: string | null;
  imagePosition: ImagePosition;
  imageBorder: boolean;
  audioFile: File | null;
  existingAudioPath: string | null;
  existingAudioUrl: string | null;
};

export type SectionState = {
  key: string;
  heading: string;
  subsections: SubsectionState[];
};

export function newSubsection(): SubsectionState {
  return {
    key: crypto.randomUUID(),
    heading: "",
    text: "",
    imageFile: null,
    existingImagePath: null,
    existingImageUrl: null,
    imagePosition: "right",
    imageBorder: true,
    audioFile: null,
    existingAudioPath: null,
    existingAudioUrl: null,
  };
}

export function fromInitialSections(sections: EditableSection[]): SectionState[] {
  return sections.map((section) => ({
    key: section.id,
    heading: section.heading,
    subsections: section.subsections.map((sub) => ({
      key: sub.id,
      heading: sub.heading,
      text: sub.text,
      imageFile: null,
      existingImagePath: sub.imagePath,
      existingImageUrl: sub.imageUrl,
      imagePosition: sub.imagePosition,
      imageBorder: sub.imageBorder,
      audioFile: null,
      existingAudioPath: sub.audioPath,
      existingAudioUrl: sub.audioUrl,
    })),
  }));
}

export function swap<T>(list: T[], index: number, direction: -1 | 1): T[] {
  const target = index + direction;
  if (target < 0 || target >= list.length) return list;
  const copy = [...list];
  [copy[index], copy[target]] = [copy[target], copy[index]];
  return copy;
}
