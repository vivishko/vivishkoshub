"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { AsmrLocale } from "@/features/asmr/types";

type AsmrLanguageSwitcherProps = {
  locale: AsmrLocale;
};

export default function AsmrLanguageSwitcher({ locale }: AsmrLanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  function setLocale(nextLocale: AsmrLocale) {
    const nextSearchParams = new URLSearchParams(searchParams.toString());

    if (nextLocale === "ru") {
      nextSearchParams.delete("lang");
    } else {
      nextSearchParams.set("lang", nextLocale);
    }

    const nextQueryString = nextSearchParams.toString();

    router.replace(nextQueryString ? `${pathname}?${nextQueryString}` : pathname, {
      scroll: false,
    });
  }

  return (
    <div className="asmr-language-switcher" aria-label="Language">
      <button
        aria-pressed={locale === "ru"}
        className={locale === "ru" ? "is-active" : ""}
        onClick={() => setLocale("ru")}
        type="button"
      >
        RU
      </button>
      <button
        aria-pressed={locale === "en"}
        className={locale === "en" ? "is-active" : ""}
        onClick={() => setLocale("en")}
        type="button"
      >
        EN
      </button>
    </div>
  );
}
