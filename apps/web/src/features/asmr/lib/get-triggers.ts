import { triggers } from "@/features/asmr/data/triggers";

export function getTriggerBySlug(slug: string) {
  return triggers.find((trigger) => trigger.slug === slug);
}

export function getTriggerById(id: string) {
  return triggers.find((trigger) => trigger.id === id);
}
