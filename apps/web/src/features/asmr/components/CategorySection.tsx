"use client";

import TriggerCard from "@/features/asmr/components/TriggerCard";
import { triggerPrimaryCategories } from "@/features/asmr/data/categories";
import type { Trigger, TriggerPrimaryCategory } from "@/features/asmr/types";

type CategorySectionProps = {
  category: TriggerPrimaryCategory;
  triggers: Trigger[];
  isCollapsed: boolean;
  favoriteTriggerIdSet: Set<string>;
  onToggleCollapsed: (category: TriggerPrimaryCategory) => void;
  onToggleFavorite: (triggerId: string) => void;
};

export default function CategorySection({
  category,
  triggers,
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
        <span>{triggerPrimaryCategories[category]}</span>
        <small>{triggers.length}</small>
      </button>

      {!isCollapsed ? (
        <div className="asmr-grid">
          {triggers.map((trigger) => (
            <TriggerCard
              isFavorite={favoriteTriggerIdSet.has(trigger.id)}
              key={trigger.id}
              onToggleFavorite={onToggleFavorite}
              trigger={trigger}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
