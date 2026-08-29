import type { Metadata } from "next";
import PageLayout from "@/components/PageLayout";
import LocalizedLink from "@/components/LocalizedLink";
import { getLocalizedNote, notes } from "@/data/notes";
import { siteRoutes } from "@/data/site-routes";
import { getLocale, type LocaleSearchParams } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Заметки — VivishkosHub",
  description: "Наблюдения о дизайне, процессе и инструментах.",
};

export default async function NotesPage({ searchParams }: { searchParams: Promise<LocaleSearchParams> }) {
  const locale = getLocale(await searchParams);
  const copy = locale === "en" ? { title: "Notes", intro: "Observations on design, process, and tools. Without pretending each entry is a final truth.", filters: "ALL · DESIGN · PROJECTS · LINKS", list: "Notes list", read: "Read", map: "Notes map", mapCopy: "Not one topic after another, but cross-connections between work, visual language, and tools.", closing: "What to read here", closingCopy: "Notes grow as an archive: old texts do not disappear, but gain new connections and refinements." } : { title: "Заметки", intro: "Наблюдения о дизайне, процессе и инструментах. Без попытки выдать каждую запись за окончательную истину.", filters: "ВСЕ · ДИЗАЙН · ПРОЕКТЫ · ССЫЛКИ", list: "Список заметок", read: "Читать", map: "Карта заметок", mapCopy: "Не тема за темой, а перекрёстные связи: наблюдения о работе, визуальном языке и инструментах.", closing: "Что здесь читать", closingCopy: "Заметки развиваются как архив: старые тексты не исчезают, а получают новые связи и уточнения." };
  return (
    <PageLayout locale={locale}>
      <main className="notes-page">
        <div className="container notes-inner">
          <header className="notes-intro">
            <h1>{copy.title}</h1><p>{copy.intro}</p><p className="notes-filters">{copy.filters}</p>
          </header>

          <section className="notes-list" aria-label={copy.list}>
            {notes.map((sourceNote) => {
              const note = getLocalizedNote(sourceNote, locale);
              return (
              <article className="note-row" key={note.slug}>
                <time dateTime={note.publishedAt}>{note.displayDate}</time>
                <div className="note-row-content">
                  <h2><LocalizedLink href={`${siteRoutes.notes}/${note.slug}`} locale={locale}>{note.title}</LocalizedLink></h2>
                  <p>{note.description}</p>
                  <LocalizedLink className="note-read-link" href={`${siteRoutes.notes}/${note.slug}`} locale={locale}>{copy.read} <span aria-hidden="true">→</span><span className="sr-only">: {note.title}</span></LocalizedLink>
                </div>
              </article>
              );
            })}
          </section>

          <section className="notes-map" aria-labelledby="notes-map-title">
            <div>
              <h2 id="notes-map-title">{copy.map}</h2><p>{copy.mapCopy}</p>
            </div>
            <svg className="notes-map-graphic" viewBox="0 0 360 235" role="img" aria-label="Абстрактная линия связей между заметками">
              <path d="M0 200 80 150l48 28 79-108 85 44 68-96" />
              <circle cx="115" cy="148" r="9" />
            </svg>
          </section>

          <section className="notes-closing" aria-labelledby="notes-closing-title">
            <h2 id="notes-closing-title">{copy.closing}</h2><p>{copy.closingCopy}</p>
          </section>
        </div>
      </main>
    </PageLayout>
  );
}
