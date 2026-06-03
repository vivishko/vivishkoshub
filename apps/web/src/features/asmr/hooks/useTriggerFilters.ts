"use client";

import { useMemo, useState } from "react";
import type { Trigger, TriggerFilters } from "@/features/asmr/types";

const initialFilters: TriggerFilters = {
  query: "",
  primaryCategory: "all",
  tag: "all",
};

export function useTriggerFilters(triggers: Trigger[]) {
  const [filters, setFilters] = useState<TriggerFilters>(initialFilters);

  const tags = useMemo(
    () => Array.from(new Set(triggers.flatMap((trigger) => trigger.tags))).sort(),
    [triggers],
  );

  const filteredTriggers = useMemo(() => {
    const normalizedQuery = filters.query.trim().toLowerCase();

    return triggers.filter((trigger) => {
      const categoryMatches =
        filters.primaryCategory === "all" || trigger.primaryCategory === filters.primaryCategory;
      const tagMatches = filters.tag === "all" || trigger.tags.includes(filters.tag);
      const searchableText = [
        trigger.title,
        trigger.shortDescription.ru,
        trigger.shortDescription.en,
        trigger.description.ru,
        trigger.description.en,
        trigger.secondaryCategory,
        ...trigger.tags,
        ...trigger.aliases,
        ...trigger.asmrtists,
      ]
        .join(" ")
        .toLowerCase();

      return categoryMatches && tagMatches && searchableText.includes(normalizedQuery);
    });
  }, [filters, triggers]);

  return {
    filters,
    filteredTriggers,
    setFilters,
    tags,
  };
}
