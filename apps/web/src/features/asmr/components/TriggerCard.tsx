"use client";

import Link from "next/link";
import FavoriteButton from "@/features/asmr/components/FavoriteButton";
import { triggerPrimaryCategories } from "@/features/asmr/data/categories";
import type { Trigger } from "@/features/asmr/types";

type TriggerCardProps = {
  trigger: Trigger;
  isFavorite: boolean;
  onToggleFavorite: (triggerId: string) => void;
};

export default function TriggerCard({
  trigger,
  isFavorite,
  onToggleFavorite,
}: TriggerCardProps) {
  return (
    <article className="asmr-card">
      <div className="asmr-card-top">
        <span>{triggerPrimaryCategories[trigger.primaryCategory]}</span>
        <FavoriteButton
          isFavorite={isFavorite}
          label={
            isFavorite
              ? `Убрать ${trigger.title} из избранного`
              : `Добавить ${trigger.title} в избранное`
          }
          onToggle={() => onToggleFavorite(trigger.id)}
        />
      </div>

      <Link className="asmr-card-link" href={`/asmr/triggers/${trigger.slug}`}>
        <span className="asmr-card-subtitle">{trigger.secondaryCategory}</span>
        <h3>{trigger.title}</h3>
        <p className="asmr-card-summary">{trigger.shortDescription.ru}</p>
        <div className="asmr-tags" aria-label="Теги">
          {trigger.tags.slice(0, 5).map((tag) => (
            <span className="asmr-tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </Link>
    </article>
  );
}
