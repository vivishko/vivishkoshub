import { getAsmrtistId } from "@/features/asmr/data/asmrtists";
import type { Trigger, TriggerPrimaryCategory } from "@/features/asmr/types";

export type TriggerFilterOptions = {
  query?: string;
  categories?: TriggerPrimaryCategory[];
  tags?: string[];
  asmrtists?: string[];
  favoriteOnly?: boolean;
  favoriteTriggerIds?: string[];
};

function getSearchableTriggerText(trigger: Trigger) {
  return [
    trigger.title,
    trigger.slug,
    trigger.shortDescription.ru,
    trigger.shortDescription.en,
    trigger.description.ru,
    trigger.description.en,
    trigger.primaryCategory,
    trigger.secondaryCategory,
    ...trigger.tags,
    ...trigger.aliases,
    ...trigger.asmrtists,
  ]
    .join(" ")
    .toLowerCase();
}

export function filterTriggers(triggers: Trigger[], filters: TriggerFilterOptions) {
  const normalizedQuery = filters.query?.trim().toLowerCase() ?? "";
  const categories = filters.categories ?? [];
  const tags = filters.tags ?? [];
  const asmrtists = filters.asmrtists ?? [];
  const favoriteTriggerIdSet = new Set(filters.favoriteTriggerIds ?? []);

  return triggers.filter((trigger) => {
    const queryMatches =
      normalizedQuery.length === 0 ||
      getSearchableTriggerText(trigger).includes(normalizedQuery);
    const categoryMatches =
      categories.length === 0 || categories.includes(trigger.primaryCategory);
    const tagMatches = tags.length === 0 || tags.some((tag) => trigger.tags.includes(tag));
    const asmrtistMatches =
      asmrtists.length === 0 ||
      trigger.asmrtists.some((asmrtist) => asmrtists.includes(getAsmrtistId(asmrtist)));
    const favoriteMatches =
      !filters.favoriteOnly || favoriteTriggerIdSet.has(trigger.id);

    return queryMatches && categoryMatches && tagMatches && asmrtistMatches && favoriteMatches;
  });
}
