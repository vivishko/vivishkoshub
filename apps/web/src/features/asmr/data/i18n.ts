import type { AsmrLocale } from "@/features/asmr/types";

export const defaultAsmrLocale: AsmrLocale = "ru";

export function getAsmrLocale(value: string | string[] | undefined): AsmrLocale {
  const locale = Array.isArray(value) ? value[0] : value;

  return locale === "en" ? "en" : defaultAsmrLocale;
}

export const asmrCopy = {
  ru: {
    aliases: "Алиасы",
    asmrtists: "ASMRtists",
    backToCatalog: "← Назад к каталогу",
    addFavorite: "Добавить в избранное",
    categories: "категорий",
    clearFavorites: "Сбросить избранное",
    close: "Закрыть",
    closeFilters: "Закрыть фильтры",
    description: "Описание",
    emptyFavoritesDescription:
      "Нажимайте на сердечко у карточек, чтобы сохранить понравившиеся триггеры.",
    emptyFavoritesTitle: "Пока нет избранных триггеров",
    emptyResultsDescription: "Попробуйте убрать часть фильтров или изменить поисковый запрос.",
    emptyResultsTitle: "Ничего не найдено",
    favoriteCount: "В избранном",
    favoriteOnly: "Только избранные",
    filterCategories: "Категории",
    filterCatalog: "Фильтры каталога",
    filters: "Фильтры",
    heroDescription:
      "ASMR-триггеры — это звуки, визуальные действия или ситуации, которые могут вызывать расслабление, ощущение заботы, сонливость или характерные мурашки.",
    heroTitle: "ASMR-триггеры",
    heroSubtitle: "Изучайте категории, смотрите примеры и сохраняйте понравившиеся триггеры.",
    loadingCatalog: "Загрузка каталога...",
    search: "Поиск",
    searchPlaceholder: "scratching, whispering...",
    showResults: "Показать результаты",
    tags: "Теги",
    totalFound: "Найдено",
    triggers: "триггеров",
    resetFilters: "Сбросить фильтры",
    relatedTriggers: "Похожие триггеры",
    removeFavorite: "Убрать из избранного",
    youtube: "YouTube",
  },
  en: {
    aliases: "Aliases",
    asmrtists: "ASMRtists",
    backToCatalog: "← Back to catalog",
    addFavorite: "Add to favorites",
    categories: "categories",
    clearFavorites: "Clear favorites",
    close: "Close",
    closeFilters: "Close filters",
    description: "Description",
    emptyFavoritesDescription: "Tap the heart on cards to save triggers you like.",
    emptyFavoritesTitle: "No favorite triggers yet",
    emptyResultsDescription: "Try removing some filters or changing your search query.",
    emptyResultsTitle: "Nothing found",
    favoriteCount: "Favorites",
    favoriteOnly: "Favorites only",
    filterCategories: "Categories",
    filterCatalog: "Catalog filters",
    filters: "Filters",
    heroDescription:
      "ASMR triggers are sounds, visual actions, or situations that can create relaxation, a sense of care, sleepiness, or characteristic tingles.",
    heroTitle: "ASMR triggers",
    heroSubtitle: "Explore categories, watch examples, and save triggers you like.",
    loadingCatalog: "Loading catalog...",
    search: "Search",
    searchPlaceholder: "scratching, whispering...",
    showResults: "Show results",
    tags: "Tags",
    totalFound: "Found",
    triggers: "triggers",
    resetFilters: "Reset filters",
    relatedTriggers: "Related triggers",
    removeFavorite: "Remove from favorites",
    youtube: "YouTube",
  },
} satisfies Record<AsmrLocale, Record<string, string>>;
