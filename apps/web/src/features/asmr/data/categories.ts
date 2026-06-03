import type { AsmrLocale, TriggerPrimaryCategory } from "@/features/asmr/types";

export const triggerPrimaryCategories: Record<
  TriggerPrimaryCategory,
  Record<AsmrLocale, string>
> = {
  audio: {
    ru: "Аудиальные триггеры",
    en: "Audio triggers",
  },
  visual: {
    ru: "Визуальные триггеры",
    en: "Visual triggers",
  },
  "personal-attention": {
    ru: "Personal Attention",
    en: "Personal attention",
  },
  roleplay: {
    ru: "Roleplay",
    en: "Roleplay",
  },
  "imagined-touch": {
    ru: "Тактильно-воображаемые",
    en: "Imagined touch",
  },
  "object-focused": {
    ru: "Объектно-ориентированные",
    en: "Object-focused",
  },
};

export const triggerPrimaryCategoryOrder: TriggerPrimaryCategory[] = [
  "audio",
  "visual",
  "personal-attention",
  "roleplay",
  "imagined-touch",
  "object-focused",
];
