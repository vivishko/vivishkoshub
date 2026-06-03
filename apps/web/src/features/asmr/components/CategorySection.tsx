"use client";

import TriggerCard from "@/features/asmr/components/TriggerCard";
import { triggerPrimaryCategories } from "@/features/asmr/data/categories";
import type { AsmrLocale, Trigger, TriggerPrimaryCategory } from "@/features/asmr/types";

type CategorySectionProps = {
  category: TriggerPrimaryCategory;
  triggers: Trigger[];
  locale: AsmrLocale;
  isCollapsed: boolean;
  favoriteTriggerIdSet: Set<string>;
  onToggleCollapsed: (category: TriggerPrimaryCategory) => void;
  onToggleFavorite: (triggerId: string) => void;
};

export default function CategorySection({
  category,
  triggers,
  locale,
  isCollapsed,
  favoriteTriggerIdSet,
  onToggleCollapsed,
  onToggleFavorite,
}: CategorySectionProps) {
  return (
    <section className="asmr-category-section">
      <button
        aria-expanded={!isCollapsed}
        className="asmr-category-toggle"
        onClick={() => onToggleCollapsed(category)}
        type="button"
      >
        <span>{triggerPrimaryCategories[category][locale]}</span>
        <span className="asmr-category-toggle-meta">
          <small>{triggers.length}</small>
          <span className="asmr-category-toggle-icon" aria-hidden="true">
            {isCollapsed ? "▸" : "▾"}
          </span>
        </span>
      </button>

      {!isCollapsed ? (
        <div className="asmr-grid">
          {triggers.map((trigger) => (
            <TriggerCard
              isFavorite={favoriteTriggerIdSet.has(trigger.id)}
              key={trigger.id}
              locale={locale}
              onToggleFavorite={onToggleFavorite}
              trigger={trigger}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
