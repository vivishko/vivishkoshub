import type { Metadata } from "next";
import PageLayout from "@/components/PageLayout";
import { experiments } from "@/data/experiments";

export const metadata: Metadata = {
  title: "Эксперименты — VivishkosHub",
  description: "Небольшие исследования, тесты и недоделанные форматы.",
};

export default function ExperimentsPage() {
  return (
    <PageLayout>
      <main className="experiments-page">
        <div className="container experiments-inner">
          <header className="experiments-intro">
            <h1>Эксперименты</h1>
            <p>
              Небольшие исследования, тесты и недоделанные форматы. Здесь важнее вопрос, чем
              законченный ответ.
            </p>
            <p className="experiments-index">2026 — В РАБОТЕ</p>
          </header>

          <section className="experiments-list" aria-label="Эксперименты в работе">
            {experiments.map((experiment) => (
              <article className="experiment-row" key={experiment.slug}>
                <time dateTime={`2026-${experiment.date.slice(0, 2)}`}>{experiment.date}</time>
                <div className="experiment-content">
                  <h2>{experiment.title}</h2>
                  <p>{experiment.description}</p>
                </div>
                <span className="experiment-status" role="img" aria-label={experiment.status} />
              </article>
            ))}
          </section>

          <section className="experiments-archive" aria-labelledby="experiments-archive-title">
            <div className="experiments-rationale">
              <h2 id="experiments-archive-title">Режим работы</h2>
              <p>
                Эксперименты сохраняются намеренно: даже когда идея не стала продуктом, она может
                стать полезным материалом для следующего проекта.
              </p>
            </div>
            <figure className="experiments-figure">
              <figcaption>РЕЖИМ РАБОТЫ</figcaption>
              <svg
                viewBox="0 0 780 280"
                role="img"
                aria-label="Абстрактная схема развития экспериментов"
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
