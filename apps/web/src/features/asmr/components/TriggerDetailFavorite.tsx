"use client";

import FavoriteButton from "@/features/asmr/components/FavoriteButton";
import { useFavoriteTriggers } from "@/features/asmr/hooks/useFavoriteTriggers";

type TriggerDetailFavoriteProps = {
  triggerId: string;
  triggerTitle: string;
};

export default function TriggerDetailFavorite({
  triggerId,
  triggerTitle,
}: TriggerDetailFavoriteProps) {
  const { favoriteTriggerIdSet, toggleFavoriteTrigger } = useFavoriteTriggers();
  const isFavorite = favoriteTriggerIdSet.has(triggerId);

  return (
    <FavoriteButton
      isFavorite={isFavorite}
      label={
        isFavorite
          ? `Убрать ${triggerTitle} из избранного`
          : `Добавить ${triggerTitle} в избранное`
      }
      onToggle={() => toggleFavoriteTrigger(triggerId)}
    />
  );
}
