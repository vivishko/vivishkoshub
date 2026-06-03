import type { Metadata } from "next";
import PageLayout from "@/components/PageLayout";
import AsmrCatalogClient from "@/features/asmr/components/AsmrCatalogClient";
import { triggerPrimaryCategoryOrder } from "@/features/asmr/data/categories";
import { triggers } from "@/features/asmr/data/triggers";

export const metadata: Metadata = {
  title: "ASMR Trigger Catalog — VivishkosHub",
  description: "Каталог ASMR-триггеров с категориями, тегами и подборками видео.",
};

export default function AsmrPage() {
  return (
    <PageLayout className="asmr-page">
      <main className="asmr-main">
        <div className="container asmr-inner">
          <section className="asmr-hero">
            <div>
              <p className="asmr-kicker">ASMR MK</p>
              <h1>Каталог ASMR-триггеров</h1>
              <p>
                База популярных аудиальных, визуальных, roleplay и personal attention триггеров
                для быстрого поиска идей и связей между форматами.
              </p>
            </div>
            <div className="asmr-stats" aria-label="Сводка">
              <span>
                <strong>{triggers.length}</strong>
                триггеров
              </span>
              <span>
                <strong>{triggerPrimaryCategoryOrder.length}</strong>
                категорий
              </span>
            </div>
          </section>

          <AsmrCatalogClient triggers={triggers} />
        </div>
      </main>
    </PageLayout>
  );
}
