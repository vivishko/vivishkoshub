"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

export const STORAGE_KEY = "asmr.favoriteTriggerIds";

function removeStoredFavoriteTriggerIds() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    return;
  }
}

function normalizeFavoriteTriggerIds(value: unknown) {
  if (!Array.isArray(value) || !value.every((item) => typeof item === "string")) {
    return null;
  }

  return Array.from(new Set(value));
}

function readFavoriteTriggerIds(): string[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);

    if (!storedValue) {
      return [];
    }

    const parsedValue: unknown = JSON.parse(storedValue);
    const triggerIds = normalizeFavoriteTriggerIds(parsedValue);

    if (!triggerIds) {
      removeStoredFavoriteTriggerIds();
      return [];
    }

    return triggerIds;
  } catch {
    removeStoredFavoriteTriggerIds();
    return [];
  }
}

function writeFavoriteTriggerIds(triggerIds: string[]) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(triggerIds));
  } catch {
    return;
  }
}

export function useFavoriteTriggers() {
  const [favoriteTriggerIds, setFavoriteTriggerIds] = useState<string[]>([]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setFavoriteTriggerIds(readFavoriteTriggerIds());
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  const favoriteTriggerIdSet = useMemo(
    () => new Set(favoriteTriggerIds),
    [favoriteTriggerIds],
  );

  const toggleFavoriteTrigger = useCallback((triggerId: string) => {
    setFavoriteTriggerIds((currentIds) => {
      const nextIds = currentIds.includes(triggerId)
        ? currentIds.filter((currentId) => currentId !== triggerId)
        : [...currentIds, triggerId];

      writeFavoriteTriggerIds(nextIds);

      return nextIds;
    });
  }, []);

  return {
    favoriteTriggerIds,
    favoriteTriggerIdSet,
    toggleFavoriteTrigger,
  };
}
