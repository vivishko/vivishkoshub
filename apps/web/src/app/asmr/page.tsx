import type { Metadata } from "next";
import { Suspense } from "react";
import PageLayout from "@/components/PageLayout";
import TriggerCatalog from "@/features/asmr/components/TriggerCatalog";
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
              <h1>ASMR-триггеры</h1>
              <p>
                ASMR-триггеры — это звуки, визуальные действия или ситуации, которые могут
                вызывать расслабление, ощущение заботы, сонливость или характерные мурашки.
              </p>
              <p>Изучайте категории, смотрите примеры и сохраняйте понравившиеся триггеры.</p>
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

          <Suspense fallback={<div className="asmr-empty-state">Загрузка каталога...</div>}>
            <TriggerCatalog triggers={triggers} />
          </Suspense>
        </div>
      </main>
    </PageLayout>
  );
}
