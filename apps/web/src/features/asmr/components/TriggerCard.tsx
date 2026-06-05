"use client";

import Link from "next/link";
import FavoriteButton from "@/features/asmr/components/FavoriteButton";
import { triggerPrimaryCategories } from "@/features/asmr/data/categories";
import { asmrCopy } from "@/features/asmr/data/i18n";
import { getLocalizedTriggerSecondaryCategory } from "@/features/asmr/data/trigger-localization";
import type { AsmrLocale, Trigger } from "@/features/asmr/types";

type TriggerCardProps = {
  trigger: Trigger;
  locale: AsmrLocale;
  isFavorite: boolean;
  onToggleFavorite: (triggerId: string) => void;
};

export default function TriggerCard({
  trigger,
  locale,
  isFavorite,
  onToggleFavorite,
}: TriggerCardProps) {
  const copy = asmrCopy[locale];
  const secondaryCategory = getLocalizedTriggerSecondaryCategory(trigger, locale);

  return (
    <article className="asmr-card">
      <div className="asmr-card-top">
        <span>{triggerPrimaryCategories[trigger.primaryCategory][locale]}</span>
        <FavoriteButton
          isFavorite={isFavorite}
          label={
            isFavorite
              ? `${copy.removeFavorite}: ${trigger.title}`
              : `${copy.addFavorite}: ${trigger.title}`
          }
          onToggle={() => onToggleFavorite(trigger.id)}
        />
      </div>

      <Link
        className="asmr-card-link"
        href={`/asmr/triggers/${trigger.slug}${locale === "en" ? "?lang=en" : ""}`}
      >
        <span className="asmr-card-subtitle">{secondaryCategory}</span>
        <h3>{trigger.title}</h3>
        <p className="asmr-card-summary">{trigger.shortDescription[locale]}</p>
        <div className="asmr-tags" aria-label={copy.tags}>
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
