"use client";

import { useMemo, useState } from "react";
import { filterTriggers } from "@/features/asmr/lib/filter-triggers";
import type { Trigger, TriggerFilters } from "@/features/asmr/types";

const initialFilters: TriggerFilters = {
  query: "",
  categories: [],
  tags: [],
  favoriteOnly: false,
};

export function useTriggerFilters(triggers: Trigger[]) {
  const [filters, setFilters] = useState<TriggerFilters>(initialFilters);

  const tags = useMemo(
    () => Array.from(new Set(triggers.flatMap((trigger) => trigger.tags))).sort(),
    [triggers],
  );

  const filteredTriggers = useMemo(() => {
    return filterTriggers(triggers, {
      query: filters.query,
      categories: filters.categories,
      tags: filters.tags,
      favoriteOnly: filters.favoriteOnly,
    });
  }, [filters, triggers]);

  return {
    filters,
    filteredTriggers,
    setFilters,
    tags,
  };
}
