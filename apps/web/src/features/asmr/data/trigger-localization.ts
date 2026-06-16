import type { AsmrLocale, Trigger } from "@/features/asmr/types";

type TriggerLocalizedMetadata = {
  secondaryCategory: {
    ru: string;
    en: string;
  };
};

export const triggerLocalizedMetadata: Record<string, TriggerLocalizedMetadata> = {
  whispering: {
    secondaryCategory: { ru: "Голос", en: "Voice" },
  },
  "soft-spoken": {
    secondaryCategory: { ru: "Голос", en: "Voice" },
  },
  "inaudible-whispering": {
    secondaryCategory: { ru: "Голос", en: "Voice" },
  },
  tapping: {
    secondaryCategory: { ru: "Звуки касаний", en: "Touch Sounds" },
  },
  "fast-tapping": {
    secondaryCategory: { ru: "Звуки касаний", en: "Touch Sounds" },
  },
  scratching: {
    secondaryCategory: { ru: "Звуки касаний", en: "Touch Sounds" },
  },
  rubbing: {
    secondaryCategory: { ru: "Звуки касаний", en: "Touch Sounds" },
  },
  "paper-sounds": {
    secondaryCategory: { ru: "Материалы", en: "Material Sounds" },
  },
  "plastic-sounds": {
    secondaryCategory: { ru: "Материалы", en: "Material Sounds" },
  },
  "fabric-sounds": {
    secondaryCategory: { ru: "Материалы", en: "Material Sounds" },
  },
  "water-sounds": {
    secondaryCategory: { ru: "Материалы", en: "Material Sounds" },
  },
  "keyboard-sounds": {
    secondaryCategory: { ru: "Ритмичные звуки", en: "Rhythmic Sounds" },
  },
  "writing-sounds": {
    secondaryCategory: { ru: "Ритмичные звуки", en: "Rhythmic Sounds" },
  },
  "drawing-sounds": {
    secondaryCategory: { ru: "Ритмичные звуки", en: "Rhythmic Sounds" },
  },
  "slow-hand-movements": {
    secondaryCategory: { ru: "Медленные движения", en: "Slow Movements" },
  },
  "precise-work": {
    secondaryCategory: { ru: "Точная работа", en: "Precise Work" },
  },
  "repetitive-actions": {
    secondaryCategory: { ru: "Повторяющиеся действия", en: "Repetitive Actions" },
  },
  "light-triggers": {
    secondaryCategory: { ru: "Тесты фокуса", en: "Focus Tests" },
  },
  "follow-my-instructions": {
    secondaryCategory: { ru: "Тесты фокуса", en: "Focus Tests" },
  },
  "eye-exam": {
    secondaryCategory: { ru: "Осмотры и уход", en: "Exams & Care" },
  },
  "medical-exam": {
    secondaryCategory: { ru: "Осмотры и уход", en: "Exams & Care" },
  },
  "makeup-application": {
    secondaryCategory: { ru: "Бьюти-процедуры", en: "Beauty Procedures" },
  },
  haircut: {
    secondaryCategory: { ru: "Бьюти-процедуры", en: "Beauty Procedures" },
  },
  "head-massage": {
    secondaryCategory: { ru: "Бьюти-процедуры", en: "Beauty Procedures" },
  },
  teaching: {
    secondaryCategory: { ru: "Обучение и помощь", en: "Teaching & Help" },
  },
  "tech-support": {
    secondaryCategory: { ru: "Обучение и помощь", en: "Teaching & Help" },
  },
  "shopping-assistant": {
    secondaryCategory: { ru: "Обучение и помощь", en: "Teaching & Help" },
  },
  "camera-touching": {
    secondaryCategory: { ru: "Имитация касаний", en: "Touch Simulation" },
  },
  "your-hair-brushing": {
    secondaryCategory: { ru: "Имитация касаний", en: "Touch Simulation" },
  },
  "blanket-care": {
    secondaryCategory: { ru: "Забота", en: "Care" },
  },
  "plucking-negative-energy": {
    secondaryCategory: { ru: "Забота", en: "Care" },
  },
  "ophthalmologist-roleplay": {
    secondaryCategory: { ru: "Медицина", en: "Medical" },
  },
  "neurologist-roleplay": {
    secondaryCategory: { ru: "Медицина", en: "Medical" },
  },
  "hairdresser-roleplay": {
    secondaryCategory: { ru: "Сервис", en: "Service" },
  },
  "receptionist-roleplay": {
    secondaryCategory: { ru: "Сервис", en: "Service" },
  },
  "wizard-roleplay": {
    secondaryCategory: { ru: "Фэнтези", en: "Fantasy" },
  },
  "alchemist-roleplay": {
    secondaryCategory: { ru: "Фэнтези", en: "Fantasy" },
  },
  "friend-helps-you": {
    secondaryCategory: { ru: "Повседневность", en: "Everyday" },
  },
  "bedtime-prep": {
    secondaryCategory: { ru: "Повседневность", en: "Everyday" },
  },
  "pet-care-roleplay": {
    secondaryCategory: { ru: "Повседневность", en: "Everyday" },
  },
  "stone-collection": {
    secondaryCategory: { ru: "Коллекции", en: "Collections" },
  },
  "coin-collection": {
    secondaryCategory: { ru: "Коллекции", en: "Collections" },
  },
  "crystal-collection": {
    secondaryCategory: { ru: "Коллекции", en: "Collections" },
  },
  "makeup-objects": {
    secondaryCategory: { ru: "Косметика", en: "Cosmetics" },
  },
  stationery: {
    secondaryCategory: { ru: "Канцелярия", en: "Stationery" },
  },
  "food-packaging": {
    secondaryCategory: { ru: "Еда", en: "Food" },
  },
  "food-cutting": {
    secondaryCategory: { ru: "Еда", en: "Food" },
  },
  "cooking-prep": {
    secondaryCategory: { ru: "Еда", en: "Food" },
  },
  "glass-sounds": {
    secondaryCategory: { ru: "Материалы", en: "Materials" },
  },
  "wood-sounds": {
    secondaryCategory: { ru: "Материалы", en: "Materials" },
  },
  "scissor-sounds": {
    secondaryCategory: { ru: "Инструменты", en: "Tools" },
  },
};


export function getLocalizedTriggerSecondaryCategory(trigger: Trigger, locale: AsmrLocale) {
  return triggerLocalizedMetadata[trigger.id]?.secondaryCategory[locale] ?? trigger.secondaryCategory;
}
