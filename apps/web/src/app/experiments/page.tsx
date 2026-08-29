import type { Metadata } from "next";
import PageLayout from "@/components/PageLayout";
import { experiments, getLocalizedExperiment } from "@/data/experiments";
import { getLocale, type LocaleSearchParams } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Эксперименты — VivishkosHub",
  description: "Небольшие исследования, тесты и недоделанные форматы.",
};

export default async function ExperimentsPage({ searchParams }: { searchParams: Promise<LocaleSearchParams> }) {
  const locale = getLocale(await searchParams);
  const copy = locale === "en" ? { title: "Experiments", intro: "Small studies, tests, and unfinished formats. The question matters more here than a finished answer.", index: "2026 — IN PROGRESS", list: "Experiments in progress", mode: "Working mode", rationale: "Experiments are deliberately retained: even when an idea does not become a product, it can become useful material for the next one.", figure: "Working mode", graphic: "Abstract diagram of experiment development" } : { title: "Эксперименты", intro: "Небольшие исследования, тесты и недоделанные форматы. Здесь важнее вопрос, чем законченный ответ.", index: "2026 — В РАБОТЕ", list: "Эксперименты в работе", mode: "Режим работы", rationale: "Эксперименты сохраняются намеренно: даже когда идея не стала продуктом, она может стать полезным материалом для следующего проекта.", figure: "РЕЖИМ РАБОТЫ", graphic: "Абстрактная схема развития экспериментов" };
  return (
    <PageLayout locale={locale}>
      <main className="experiments-page">
        <div className="container experiments-inner">
          <header className="experiments-intro">
            <h1>{copy.title}</h1><p>{copy.intro}</p><p className="experiments-index">{copy.index}</p>
          </header>

          <section className="experiments-list" aria-label={copy.list}>
            {experiments.map((sourceExperiment) => {
              const experiment = getLocalizedExperiment(sourceExperiment, locale);
              return (
              <article className="experiment-row" key={experiment.slug}>
                <time dateTime={`2026-${experiment.date.slice(0, 2)}`}>{experiment.date}</time>
                <div className="experiment-content">
                  <h2>{experiment.title}</h2>
                  <p>{experiment.description}</p>
                </div>
                <span className="experiment-status" role="img" aria-label={experiment.status} />
              </article>
              );
            })}
          </section>

          <section className="experiments-archive" aria-labelledby="experiments-archive-title">
            <div className="experiments-rationale">
              <h2 id="experiments-archive-title">{copy.mode}</h2><p>{copy.rationale}</p>
            </div>
            <figure className="experiments-figure">
              <figcaption>{copy.figure}</figcaption>
              <svg
                viewBox="0 0 780 280"
                role="img"
                aria-label={copy.graphic}
              >
                <path d="M0 210 110 150l120 34L345 70l137 70 138-98 160 76" />
                <circle cx="430" cy="114" r="8" />
              </svg>
            </figure>
          </section>
        </div>
      </main>
    </PageLayout>
  );
}
