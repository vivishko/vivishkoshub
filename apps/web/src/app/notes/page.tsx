import type { Metadata } from "next";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import { notes } from "@/data/notes";
import { siteRoutes } from "@/data/site-routes";

export const metadata: Metadata = {
  title: "Заметки — VivishkosHub",
  description: "Наблюдения о дизайне, процессе и инструментах.",
};

export default function NotesPage() {
  return (
    <PageLayout>
      <main className="notes-page">
        <div className="container notes-inner">
          <header className="notes-intro">
            <h1>Заметки</h1>
            <p>
              Наблюдения о дизайне, процессе и инструментах. Без попытки выдать каждую запись за
              окончательную истину.
            </p>
            <p className="notes-filters" aria-label="Темы заметок">
              <span>ВСЕ</span><span aria-hidden="true">·</span><span>ДИЗАЙН</span>
              <span aria-hidden="true">·</span><span>ПРОЕКТЫ</span><span aria-hidden="true">·</span>
              <span>ССЫЛКИ</span>
            </p>
          </header>

          <section className="notes-list" aria-label="Список заметок">
            {notes.map((note) => (
              <article className="note-row" key={note.slug}>
                <time dateTime={note.publishedAt}>{note.displayDate}</time>
                <div className="note-row-content">
                  <h2><Link href={`${siteRoutes.notes}/${note.slug}`}>{note.title}</Link></h2>
                  <p>{note.description}</p>
                  <Link className="note-read-link" href={`${siteRoutes.notes}/${note.slug}`}>
                    Читать <span aria-hidden="true">→</span><span className="sr-only">: {note.title}</span>
                  </Link>
                </div>
              </article>
            ))}
          </section>

          <section className="notes-map" aria-labelledby="notes-map-title">
            <div>
              <h2 id="notes-map-title">Карта заметок</h2>
              <p>Не тема за темой, а перекрёстные связи: наблюдения о работе, визуальном языке и инструментах.</p>
            </div>
            <svg className="notes-map-graphic" viewBox="0 0 360 235" role="img" aria-label="Абстрактная линия связей между заметками">
              <path d="M0 200 80 150l48 28 79-108 85 44 68-96" />
              <circle cx="115" cy="148" r="9" />
            </svg>
          </section>

          <section className="notes-closing" aria-labelledby="notes-closing-title">
            <h2 id="notes-closing-title">Что здесь читать</h2>
            <p>Заметки развиваются как архив: старые тексты не исчезают, а получают новые связи и уточнения.</p>
          </section>
        </div>
      </main>
    </PageLayout>
  );
}
