import type { TriggerPrimaryCategory } from "@/features/asmr/types";

export const triggerPrimaryCategories: Record<TriggerPrimaryCategory, string> = {
  audio: "Аудиальные триггеры",
  visual: "Визуальные триггеры",
  "personal-attention": "Personal Attention",
  roleplay: "Roleplay",
  "imagined-touch": "Тактильно-воображаемые",
  "object-focused": "Объектно-ориентированные",
};

export const triggerPrimaryCategoryOrder: TriggerPrimaryCategory[] = [
  "audio",
  "visual",
  "personal-attention",
  "roleplay",
  "imagined-touch",
  "object-focused",
];
