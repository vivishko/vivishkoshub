"use client";

import { triggerPrimaryCategories, triggerPrimaryCategoryOrder } from "@/features/asmr/data/categories";
import type { TriggerFilters as TriggerFiltersState } from "@/features/asmr/types";

type TriggerFiltersProps = {
  filters: TriggerFiltersState;
  resultCount: number;
  tags: string[];
  onChange: (filters: TriggerFiltersState) => void;
  onClose?: () => void;
  onReset: () => void;
};

function toggleValue(values: string[], value: string) {
  return values.includes(value)
    ? values.filter((currentValue) => currentValue !== value)
    : [...values, value];
}

export default function TriggerFilters({
  filters,
  resultCount,
  tags,
  onChange,
  onClose,
  onReset,
}: TriggerFiltersProps) {
  return (
    <div className="asmr-filter-panel">
      <div className="asmr-filter-panel-header">
        <h2>Фильтры</h2>
        {onClose ? (
          <button className="asmr-filter-close" onClick={onClose} type="button">
            Закрыть
          </button>
        ) : null}
      </div>

      <label className="asmr-search">
        <span>Поиск</span>
        <input
          onChange={(event) => onChange({ ...filters, query: event.target.value })}
          placeholder="scratching, whispering..."
          type="search"
          value={filters.query}
        />
      </label>

      <label className="asmr-check-row">
        <input
          checked={filters.favoriteOnly}
          onChange={(event) => onChange({ ...filters, favoriteOnly: event.target.checked })}
          type="checkbox"
        />
        <span>Только избранные</span>
      </label>

      <fieldset className="asmr-filter-group">
        <legend>Категории</legend>
        <div className="asmr-choice-list">
          {triggerPrimaryCategoryOrder.map((category) => (
            <label className="asmr-check-row" key={category}>
              <input
                checked={filters.categories.includes(category)}
                onChange={() =>
                  onChange({
                    ...filters,
                    categories: toggleValue(filters.categories, category) as typeof filters.categories,
                  })
                }
                type="checkbox"
              />
              <span>{triggerPrimaryCategories[category]}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="asmr-filter-group">
        <legend>Теги</legend>
        <div className="asmr-choice-list asmr-tag-choice-list">
          {tags.map((tag) => (
            <label className="asmr-check-row" key={tag}>
              <input
                checked={filters.tags.includes(tag)}
                onChange={() => onChange({ ...filters, tags: toggleValue(filters.tags, tag) })}
                type="checkbox"
              />
              <span>{tag}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <div className="asmr-filter-actions">
        <button className="asmr-secondary-button" onClick={onReset} type="button">
          Сбросить фильтры
        </button>
        {onClose ? (
          <button className="asmr-primary-button" onClick={onClose} type="button">
            Показать результаты ({resultCount})
          </button>
        ) : null}
      </div>
    </div>
  );
}
