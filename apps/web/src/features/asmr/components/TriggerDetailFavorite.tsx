"use client";

import FavoriteButton from "@/features/asmr/components/FavoriteButton";
import { asmrCopy } from "@/features/asmr/data/i18n";
import { useFavoriteTriggers } from "@/features/asmr/hooks/useFavoriteTriggers";
import type { AsmrLocale } from "@/features/asmr/types";

type TriggerDetailFavoriteProps = {
  locale: AsmrLocale;
  triggerId: string;
  triggerTitle: string;
};

export default function TriggerDetailFavorite({
  locale,
  triggerId,
  triggerTitle,
}: TriggerDetailFavoriteProps) {
  const copy = asmrCopy[locale];
  const { favoriteTriggerIdSet, toggleFavoriteTrigger } = useFavoriteTriggers();
  const isFavorite = favoriteTriggerIdSet.has(triggerId);

  return (
    <FavoriteButton
      isFavorite={isFavorite}
      label={
        isFavorite
          ? `${copy.removeFavorite}: ${triggerTitle}`
          : `${copy.addFavorite}: ${triggerTitle}`
      }
      onToggle={() => toggleFavoriteTrigger(triggerId)}
    />
  );
}
