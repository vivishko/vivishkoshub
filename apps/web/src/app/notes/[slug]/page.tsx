import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import LocalizedLink from "@/components/LocalizedLink";
import { getLocalizedNote, getNoteBySlug, notes } from "@/data/notes";
import { siteRoutes } from "@/data/site-routes";
import { getLocale, type LocaleSearchParams } from "@/lib/locale";

type Params = { slug: string };

function getLead(description: string) {
  return description === "Почему ограничение на количество приёмов обычно даёт более живой результат."
    ? "Личный сайт становится убедительнее, когда у него есть простые правила и достаточно воздуха, чтобы их заметить."
    : description;
}

export function generateStaticParams() {
  return notes.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const note = getNoteBySlug(slug);
  return note
    ? { title: `${note.title} — VivishkosHub`, description: note.description }
    : { title: "Заметка не найдена — VivishkosHub" };
}

export default async function NoteDetailPage({ params, searchParams }: { params: Promise<Params>; searchParams: Promise<LocaleSearchParams> }) {
  const { slug } = await params;
  const sourceNote = getNoteBySlug(slug);
  if (!sourceNote) notFound();
  const locale = getLocale(await searchParams);
  const note = getLocalizedNote(sourceNote, locale);
  const copy = locale === "en" ? { notes: "Notes", fallbackHeading: "A note in progress", caption: "FIG. 01 — NOTE IN PROGRESS", quote: "This note is still being assembled from observations, links, and working questions.", tags: "Tags", figure: "Abstract graphic of rhythm and repetition" } : { notes: "Заметки", fallbackHeading: "Заметка в развитии", caption: "РИС. 01 — ЗАМЕТКА В РАЗВИТИИ", quote: "Эта заметка пока собирается из наблюдений, ссылок и рабочих вопросов.", tags: "Теги", figure: "Абстрактная графика ритма и повторов" };

  const sections = note.body?.sections ?? [{ heading: copy.fallbackHeading, text: note.description }];
  const caption = note.body?.figure ?? copy.caption;
  const quote = note.body?.quote ?? copy.quote;

  return (
    <PageLayout locale={locale}>
      <main className="note-detail">
        <article className="container note-detail-inner">
          <p className="note-breadcrumbs">
            <LocalizedLink href={siteRoutes.notes} locale={locale}>{copy.notes}</LocalizedLink><span aria-hidden="true"> / </span>
            <span>{note.tags[0] ?? copy.notes}</span><span aria-hidden="true"> / </span><time dateTime={note.publishedAt}>{note.displayDate}</time>
          </p>
          <header className="note-detail-header">
            <h1>{note.title}</h1>
            <p>{getLead(note.description)}</p>
          </header>
          <figure className="note-figure">
            <svg viewBox="0 0 820 210" role="img" aria-label={copy.figure} preserveAspectRatio="none">
              <path d="M0 180 155 70l145 55 142-81 178 101 200-127" />
            </svg>
          </figure>
          <p className="note-figure-caption">{caption}</p>
          <div className="note-body">
            {sections.map((section) => <section key={section.heading}><h2>{section.heading}</h2><p>{section.text}</p></section>)}
            <blockquote>{quote}</blockquote>
          </div>
          <p className="note-tags" aria-label={copy.tags}>{note.tags.join(" · ")}</p>
        </article>
      </main>
    </PageLayout>
  );
}
