"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import CategorySection from "@/features/asmr/components/CategorySection";
import TriggerFilters from "@/features/asmr/components/TriggerFilters";
import { triggerPrimaryCategories, triggerPrimaryCategoryOrder } from "@/features/asmr/data/categories";
import { useFavoriteTriggers } from "@/features/asmr/hooks/useFavoriteTriggers";
import { filterTriggers } from "@/features/asmr/lib/filter-triggers";
import type { Trigger, TriggerFilters as TriggerFiltersState, TriggerPrimaryCategory } from "@/features/asmr/types";

type TriggerCatalogProps = {
  triggers: Trigger[];
};

const emptyFilters: TriggerFiltersState = {
  query: "",
  categories: [],
  tags: [],
  favoriteOnly: false,
};

function splitParamValues(values: string[]) {
  return values
    .flatMap((value) => value.split(","))
    .map((value) => value.trim())
    .filter(Boolean);
}

function parseFiltersFromSearchParams(searchParams: URLSearchParams): TriggerFiltersState {
  const categories = splitParamValues(searchParams.getAll("category")).filter(
    (category): category is TriggerPrimaryCategory =>
      triggerPrimaryCategoryOrder.includes(category as TriggerPrimaryCategory),
  );

  return {
    query: searchParams.get("q") ?? "",
    categories,
    tags: splitParamValues(searchParams.getAll("tag")),
    favoriteOnly: searchParams.get("favorites") === "1",
  };
}

function getFiltersSignature(filters: TriggerFiltersState) {
  return JSON.stringify({
    query: filters.query,
    categories: [...filters.categories].sort(),
    tags: [...filters.tags].sort(),
    favoriteOnly: filters.favoriteOnly,
  });
}

function buildSearchParams(filters: TriggerFiltersState) {
  const nextSearchParams = new URLSearchParams();
  const trimmedQuery = filters.query.trim();

  if (trimmedQuery) {
    nextSearchParams.set("q", trimmedQuery);
  }

  filters.categories.forEach((category) => nextSearchParams.append("category", category));
  filters.tags.forEach((tag) => nextSearchParams.append("tag", tag));

  if (filters.favoriteOnly) {
    nextSearchParams.set("favorites", "1");
  }

  return nextSearchParams;
}

export default function TriggerCatalog({ triggers }: TriggerCatalogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { favoriteTriggerIds, favoriteTriggerIdSet, toggleFavoriteTrigger } =
    useFavoriteTriggers();
  const currentSearchParams = searchParams.toString();
  const urlFilters = useMemo(
    () => parseFiltersFromSearchParams(new URLSearchParams(currentSearchParams)),
    [currentSearchParams],
  );
  const urlFiltersSignature = useMemo(() => getFiltersSignature(urlFilters), [urlFilters]);
  const [filters, setFilters] = useState<TriggerFiltersState>(() =>
    parseFiltersFromSearchParams(new URLSearchParams(searchParams.toString())),
  );
  const [collapsedCategories, setCollapsedCategories] = useState<TriggerPrimaryCategory[]>([]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const tags = useMemo(
    () => Array.from(new Set(triggers.flatMap((trigger) => trigger.tags))).sort(),
    [triggers],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setFilters((currentFilters) =>
        getFiltersSignature(currentFilters) === urlFiltersSignature ? currentFilters : urlFilters,
      );
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [urlFilters, urlFiltersSignature]);

  useEffect(() => {
    const nextSearchParams = buildSearchParams(filters);
    const nextQueryString = nextSearchParams.toString();
    const currentQueryString = searchParams.toString();

    if (nextQueryString !== currentQueryString) {
      router.replace(nextQueryString ? `${pathname}?${nextQueryString}` : pathname, {
        scroll: false,
      });
    }
  }, [filters, pathname, router, searchParams]);

  const filteredTriggers = useMemo(
    () =>
      filterTriggers(triggers, {
        ...filters,
        favoriteTriggerIds,
      }),
    [favoriteTriggerIds, filters, triggers],
  );

  const groupedTriggers = useMemo(
    () =>
      triggerPrimaryCategoryOrder
        .map((category) => ({
          category,
          triggers: filteredTriggers.filter((trigger) => trigger.primaryCategory === category),
        }))
        .filter((group) => group.triggers.length > 0),
    [filteredTriggers],
  );

  const activeFilterChips = [
    ...(filters.query.trim() ? [{ key: "query", label: `Поиск: ${filters.query.trim()}` }] : []),
    ...filters.categories.map((category) => ({
      key: `category-${category}`,
      label: triggerPrimaryCategories[category],
    })),
    ...filters.tags.map((tag) => ({ key: `tag-${tag}`, label: `#${tag}` })),
    ...(filters.favoriteOnly ? [{ key: "favorites", label: "Только избранные" }] : []),
  ];

  const resetFilters = useCallback(() => {
    setFilters(emptyFilters);
  }, []);

  const removeChip = useCallback((key: string) => {
    setFilters((currentFilters) => {
      if (key === "query") {
        return { ...currentFilters, query: "" };
      }

      if (key === "favorites") {
        return { ...currentFilters, favoriteOnly: false };
      }

      if (key.startsWith("category-")) {
        const category = key.replace("category-", "") as TriggerPrimaryCategory;

        return {
          ...currentFilters,
          categories: currentFilters.categories.filter(
            (currentCategory) => currentCategory !== category,
          ),
        };
      }

      if (key.startsWith("tag-")) {
        const tag = key.replace("tag-", "");

        return {
          ...currentFilters,
          tags: currentFilters.tags.filter((currentTag) => currentTag !== tag),
        };
      }

      return currentFilters;
    });
  }, []);

  const toggleCollapsedCategory = useCallback((category: TriggerPrimaryCategory) => {
    setCollapsedCategories((currentCategories) =>
      currentCategories.includes(category)
        ? currentCategories.filter((currentCategory) => currentCategory !== category)
        : [...currentCategories, category],
    );
  }, []);

  const favoriteEmptyState = filters.favoriteOnly && favoriteTriggerIds.length === 0;

  return (
    <section className="asmr-catalog" aria-label="Каталог ASMR-триггеров">
      <div className="asmr-mobile-search">
        <label className="asmr-search">
          <span>Поиск</span>
          <input
            onChange={(event) =>
              setFilters((currentFilters) => ({
                ...currentFilters,
                query: event.target.value,
              }))
            }
            placeholder="scratching, whispering..."
            type="search"
            value={filters.query}
          />
        </label>
        <button
          className="asmr-filter-open"
          onClick={() => setIsMobileFiltersOpen(true)}
          type="button"
        >
          Фильтры
        </button>
      </div>

      <div className="asmr-catalog-layout">
        <aside className="asmr-desktop-filters" aria-label="Фильтры каталога">
          <TriggerFilters
            filters={filters}
            onChange={setFilters}
            onReset={resetFilters}
            resultCount={filteredTriggers.length}
            tags={tags}
          />
        </aside>

        <div className="asmr-catalog-results">
          <div className="asmr-count">
            Найдено: <strong>{filteredTriggers.length}</strong> из {triggers.length}
            <span>В избранном: {favoriteTriggerIds.length}</span>
          </div>

          {activeFilterChips.length ? (
            <div className="asmr-active-filters" aria-label="Активные фильтры">
              {activeFilterChips.map((chip) => (
                <button key={chip.key} onClick={() => removeChip(chip.key)} type="button">
                  {chip.label}
                  <span aria-hidden="true">×</span>
                </button>
              ))}
              <button className="asmr-reset-chip" onClick={resetFilters} type="button">
                Сбросить фильтры
              </button>
            </div>
          ) : null}

          {favoriteEmptyState ? (
            <div className="asmr-empty-state">
              <h2>Пока нет избранных триггеров</h2>
              <p>Нажимайте на сердечко у карточек, чтобы сохранить понравившиеся триггеры.</p>
            </div>
          ) : filteredTriggers.length === 0 ? (
            <div className="asmr-empty-state">
              <h2>Ничего не найдено</h2>
              <p>Попробуйте убрать часть фильтров или изменить поисковый запрос.</p>
            </div>
          ) : (
            <div className="asmr-category-list">
              {groupedTriggers.map((group) => (
                <CategorySection
                  category={group.category}
                  favoriteTriggerIdSet={favoriteTriggerIdSet}
                  isCollapsed={collapsedCategories.includes(group.category)}
                  key={group.category}
                  onToggleCollapsed={toggleCollapsedCategory}
                  onToggleFavorite={toggleFavoriteTrigger}
                  triggers={group.triggers}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {isMobileFiltersOpen ? (
        <div className="asmr-filter-drawer" role="dialog" aria-label="Фильтры" aria-modal="true">
          <button
            aria-label="Закрыть фильтры"
            className="asmr-filter-backdrop"
            onClick={() => setIsMobileFiltersOpen(false)}
            type="button"
          />
          <div className="asmr-filter-sheet">
            <TriggerFilters
              filters={filters}
              onChange={setFilters}
              onClose={() => setIsMobileFiltersOpen(false)}
              onReset={resetFilters}
              resultCount={filteredTriggers.length}
              tags={tags}
            />
          </div>
        </div>
      ) : null}
    </section>
  );
}
