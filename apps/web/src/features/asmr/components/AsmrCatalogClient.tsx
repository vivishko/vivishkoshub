"use client";

import Link from "next/link";
import { triggerPrimaryCategories, triggerPrimaryCategoryOrder } from "@/features/asmr/data/categories";
import type { Trigger } from "@/features/asmr/types";
import { useFavoriteTriggers } from "@/features/asmr/hooks/useFavoriteTriggers";
import { useTriggerFilters } from "@/features/asmr/hooks/useTriggerFilters";

type AsmrCatalogClientProps = {
  triggers: Trigger[];
};

export default function AsmrCatalogClient({ triggers }: AsmrCatalogClientProps) {
  const { filters, filteredTriggers, setFilters, tags } = useTriggerFilters(triggers);
  const { favoriteTriggerIds, favoriteTriggerIdSet, toggleFavoriteTrigger } =
    useFavoriteTriggers();

  return (
    <section className="asmr-catalog" aria-label="Каталог ASMR-триггеров">
      <div className="asmr-toolbar" aria-label="Фильтры">
        <label className="asmr-search">
          <span>Поиск</span>
          <input
            onChange={(event) =>
              setFilters((current) => ({ ...current, query: event.target.value }))
            }
            placeholder="Шепот, кисти, roleplay..."
            type="search"
            value={filters.query}
          />
        </label>

        <label className="asmr-select">
          <span>Категория</span>
          <select
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                primaryCategory: event.target.value as typeof filters.primaryCategory,
              }))
            }
            value={filters.primaryCategory}
          >
            <option value="all">Все категории</option>
            {triggerPrimaryCategoryOrder.map((category) => (
              <option key={category} value={category}>
                {triggerPrimaryCategories[category]}
              </option>
            ))}
          </select>
        </label>

        <label className="asmr-select">
          <span>Тег</span>
          <select
            onChange={(event) =>
              setFilters((current) => ({ ...current, tag: event.target.value }))
            }
            value={filters.tag}
          >
            <option value="all">Все теги</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="asmr-count">
        Найдено: <strong>{filteredTriggers.length}</strong> из {triggers.length}
        <span>В избранном: {favoriteTriggerIds.length}</span>
      </div>

      <div className="asmr-grid">
        {filteredTriggers.map((trigger) => {
          const isFavorite = favoriteTriggerIdSet.has(trigger.id);

          return (
            <article className="asmr-card" key={trigger.id}>
              <div className="asmr-card-top">
                <span>{triggerPrimaryCategories[trigger.primaryCategory]}</span>
                <span>{trigger.secondaryCategory}</span>
                <button
                  aria-label={
                    isFavorite
                      ? `Убрать ${trigger.title} из избранного`
                      : `Добавить ${trigger.title} в избранное`
                  }
                  aria-pressed={isFavorite}
                  className={`asmr-favorite-button${isFavorite ? " is-active" : ""}`}
                  onClick={() => toggleFavoriteTrigger(trigger.id)}
                  title={isFavorite ? "Убрать из избранного" : "Добавить в избранное"}
                  type="button"
                >
                  {isFavorite ? "♥" : "♡"}
                </button>
              </div>
              <Link className="asmr-card-link" href={`/asmr/${trigger.slug}`}>
                <h2>{trigger.title}</h2>
                <p className="asmr-card-summary">{trigger.shortDescription.ru}</p>
                <div className="asmr-tags" aria-label="Теги">
                  {trigger.tags.map((tag) => (
                    <span className="asmr-tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
