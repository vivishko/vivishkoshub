"use client";

import { triggerPrimaryCategories, triggerPrimaryCategoryOrder } from "@/features/asmr/data/categories";
import { asmrCopy } from "@/features/asmr/data/i18n";
import type { AsmrLocale, TriggerFilters as TriggerFiltersState } from "@/features/asmr/types";

type TriggerFiltersProps = {
  filters: TriggerFiltersState;
  locale: AsmrLocale;
  resultCount: number;
  tags: string[];
  favoriteCount: number;
  onClearFavorites: () => void;
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
  locale,
  favoriteCount,
  resultCount,
  tags,
  onClearFavorites,
  onChange,
  onClose,
  onReset,
}: TriggerFiltersProps) {
  const copy = asmrCopy[locale];

  return (
    <div className="asmr-filter-panel">
      <div className="asmr-filter-panel-header">
        <h2>{copy.filters}</h2>
        {onClose ? (
          <button className="asmr-filter-close" onClick={onClose} type="button">
            {copy.close}
          </button>
        ) : null}
      </div>

      <label className="asmr-search">
        <span>{copy.search}</span>
        <input
          onChange={(event) => onChange({ ...filters, query: event.target.value })}
          placeholder={copy.searchPlaceholder}
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
        <span>{copy.favoriteOnly}</span>
      </label>

      <fieldset className="asmr-filter-group">
        <legend>{copy.filterCategories}</legend>
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
              <span>{triggerPrimaryCategories[category][locale]}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="asmr-filter-group">
        <legend>{copy.tags}</legend>
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
          {copy.resetFilters}
        </button>
        <button
          className="asmr-secondary-button"
          disabled={favoriteCount === 0}
          onClick={onClearFavorites}
          type="button"
        >
          {copy.clearFavorites}
        </button>
        {onClose ? (
          <button className="asmr-primary-button" onClick={onClose} type="button">
            {copy.showResults} ({resultCount})
          </button>
        ) : null}
      </div>
    </div>
  );
}
