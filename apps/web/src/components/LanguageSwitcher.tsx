"use client";

import { useEffect } from "react";
import type { Locale } from "@/lib/locales";

const labels: Record<Locale, string> = {
  ru: "RU",
  en: "EN",
};

export default function LanguageSwitcher({ locale }: { locale: Locale }) {

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  function changeLanguage(nextLocale: Locale) {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    params.set("lang", nextLocale);
    url.search = params.toString();
    window.location.assign(`${url.pathname}${url.search}${url.hash}`);
  }

  return (
    <div className="language-switcher" aria-label="Язык интерфейса">
      {(Object.keys(labels) as Locale[]).map((option) => (
        <button
          aria-pressed={locale === option}
          className={locale === option ? "is-active" : undefined}
          key={option}
          onClick={() => changeLanguage(option)}
          type="button"
        >
          {labels[option]}
        </button>
      ))}
    </div>
  );
}
