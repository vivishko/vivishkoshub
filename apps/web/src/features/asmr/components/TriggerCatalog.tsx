"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import CategorySection from "@/features/asmr/components/CategorySection";
import TriggerFilters from "@/features/asmr/components/TriggerFilters";
import { triggerPrimaryCategories, triggerPrimaryCategoryOrder } from "@/features/asmr/data/categories";
import { asmrCopy } from "@/features/asmr/data/i18n";
import { useFavoriteTriggers } from "@/features/asmr/hooks/useFavoriteTriggers";
import { filterTriggers } from "@/features/asmr/lib/filter-triggers";
import type { AsmrLocale, Trigger, TriggerFilters as TriggerFiltersState, TriggerPrimaryCategory } from "@/features/asmr/types";

type TriggerCatalogProps = {
  locale: AsmrLocale;
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

function buildSearchParams(filters: TriggerFiltersState, locale: AsmrLocale) {
  const nextSearchParams = new URLSearchParams();
  const trimmedQuery = filters.query.trim();

  if (locale === "en") {
    nextSearchParams.set("lang", locale);
  }

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

export default function TriggerCatalog({ locale, triggers }: TriggerCatalogProps) {
  const copy = asmrCopy[locale];
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { clearFavoriteTriggers, favoriteTriggerIds, favoriteTriggerIdSet, toggleFavoriteTrigger } =
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
    const nextSearchParams = buildSearchParams(filters, locale);
    const nextQueryString = nextSearchParams.toString();
    const currentQueryString = searchParams.toString();

    if (nextQueryString !== currentQueryString) {
      router.replace(nextQueryString ? `${pathname}?${nextQueryString}` : pathname, {
        scroll: false,
      });
    }
  }, [filters, locale, pathname, router, searchParams]);

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
    ...(filters.query.trim() ? [{ key: "query", label: `${copy.search}: ${filters.query.trim()}` }] : []),
    ...filters.categories.map((category) => ({
      key: `category-${category}`,
      label: triggerPrimaryCategories[category][locale],
    })),
    ...filters.tags.map((tag) => ({ key: `tag-${tag}`, label: `#${tag}` })),
    ...(filters.favoriteOnly ? [{ key: "favorites", label: copy.favoriteOnly }] : []),
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
    <section className="asmr-catalog" aria-label={copy.heroTitle}>
      <div className="asmr-mobile-search">
        <label className="asmr-search">
          <span>{copy.search}</span>
          <input
            onChange={(event) =>
              setFilters((currentFilters) => ({
                ...currentFilters,
                query: event.target.value,
              }))
            }
            placeholder={copy.searchPlaceholder}
            type="search"
            value={filters.query}
          />
        </label>
        <button
          className="asmr-filter-open"
          onClick={() => setIsMobileFiltersOpen(true)}
          type="button"
        >
          {copy.filters}
        </button>
      </div>

      <div className="asmr-catalog-layout">
        <aside className="asmr-desktop-filters" aria-label={copy.filterCatalog}>
          <TriggerFilters
            favoriteCount={favoriteTriggerIds.length}
            filters={filters}
            locale={locale}
            onChange={setFilters}
            onClearFavorites={clearFavoriteTriggers}
            onReset={resetFilters}
            resultCount={filteredTriggers.length}
            tags={tags}
          />
        </aside>

        <div className="asmr-catalog-results">
          <div className="asmr-count">
            {copy.totalFound}: <strong>{filteredTriggers.length}</strong> / {triggers.length}
            <span>
              {copy.favoriteCount}: {favoriteTriggerIds.length}
            </span>
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
                {copy.resetFilters}
              </button>
            </div>
          ) : null}

          {favoriteEmptyState ? (
            <div className="asmr-empty-state">
              <h2>{copy.emptyFavoritesTitle}</h2>
              <p>{copy.emptyFavoritesDescription}</p>
            </div>
          ) : filteredTriggers.length === 0 ? (
            <div className="asmr-empty-state">
              <h2>{copy.emptyResultsTitle}</h2>
              <p>{copy.emptyResultsDescription}</p>
            </div>
          ) : (
            <div className="asmr-category-list">
              {groupedTriggers.map((group) => (
                <CategorySection
                  category={group.category}
                  favoriteTriggerIdSet={favoriteTriggerIdSet}
                  isCollapsed={collapsedCategories.includes(group.category)}
                  key={group.category}
                  locale={locale}
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
        <div className="asmr-filter-drawer" role="dialog" aria-label={copy.filters} aria-modal="true">
          <button
            aria-label={copy.closeFilters}
            className="asmr-filter-backdrop"
            onClick={() => setIsMobileFiltersOpen(false)}
            type="button"
          />
          <div className="asmr-filter-sheet">
            <TriggerFilters
              favoriteCount={favoriteTriggerIds.length}
              filters={filters}
              locale={locale}
              onChange={setFilters}
              onClearFavorites={clearFavoriteTriggers}
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
