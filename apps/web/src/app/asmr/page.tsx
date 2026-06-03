import type { Metadata } from "next";
import { Suspense } from "react";
import PageLayout from "@/components/PageLayout";
import AsmrLanguageSwitcher from "@/features/asmr/components/AsmrLanguageSwitcher";
import TriggerCatalog from "@/features/asmr/components/TriggerCatalog";
import { triggerPrimaryCategoryOrder } from "@/features/asmr/data/categories";
import { asmrCopy, getAsmrLocale } from "@/features/asmr/data/i18n";
import { triggers } from "@/features/asmr/data/triggers";

export const metadata: Metadata = {
  title: "ASMR Trigger Catalog — VivishkosHub",
  description: "Каталог ASMR-триггеров с категориями, тегами и подборками видео.",
};

type SearchParams = {
  lang?: string | string[];
};

export default async function AsmrPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const locale = getAsmrLocale((await searchParams).lang);
  const copy = asmrCopy[locale];

  return (
    <PageLayout className="asmr-page">
      <main className="asmr-main">
        <div className="container asmr-inner">
          <section className="asmr-hero">
            <div>
              <p className="asmr-kicker">ASMR MK</p>
              <h1>{copy.heroTitle}</h1>
              <p>{copy.heroDescription}</p>
              <p>{copy.heroSubtitle}</p>
            </div>
            <div className="asmr-hero-side" aria-label="Summary">
              <Suspense fallback={null}>
                <AsmrLanguageSwitcher locale={locale} />
              </Suspense>
              <div className="asmr-stats">
                <span>
                  <strong>{triggers.length}</strong>
                  {copy.triggers}
                </span>
                <span>
                  <strong>{triggerPrimaryCategoryOrder.length}</strong>
                  {copy.categories}
                </span>
              </div>
            </div>
          </section>

          <Suspense fallback={<div className="asmr-empty-state">{copy.loadingCatalog}</div>}>
            <TriggerCatalog locale={locale} triggers={triggers} />
          </Suspense>
        </div>
      </main>
    </PageLayout>
  );
}
