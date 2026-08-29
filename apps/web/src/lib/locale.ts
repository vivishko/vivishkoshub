import type { Locale } from "@/lib/locales";

export type { Locale } from "@/lib/locales";

export type LocaleSearchParams = { lang?: string | string[] };

export function getLocale(searchParams?: LocaleSearchParams): Locale {
  return searchParams?.lang === "en" ? "en" : "ru";
}
