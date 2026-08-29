import type { Metadata } from "next";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import LocalizedLink from "@/components/LocalizedLink";
import { notes } from "@/data/notes";
import { getLocalizedNote } from "@/data/notes";
import { siteRoutes } from "@/data/site-routes";
import { getLocale, type LocaleSearchParams } from "@/lib/locale";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "VIVISHKOSHUB — работы и заметки",
  description: "Личный архив работ, наблюдений и инструментов о дизайне и цифровых продуктах.",
};

function RouteDrawing({ kind }: { kind: "projects" | "notes" }) {
  const isProjects = kind === "projects";

  return (
    <svg aria-hidden="true" className={styles.routeDrawing} viewBox="0 0 385 190">
      <path
        d={
          isProjects
            ? "M0 138 84 72l82 33 84-55 135 82"
            : "M0 184 55 170l43-45 49-9 49-51 54 9 52-48 58-6 25-20"
        }
      />
      {isProjects && <circle cx="225" cy="59" r="13" />}
    </svg>
  );
}

export default async function Home({ searchParams }: { searchParams: Promise<LocaleSearchParams> }) {
  const locale = getLocale(await searchParams);
  const copy = locale === "en" ? {
    intro: "A personal archive of work, observations, and tools — about design, digital products, and making complexity clear.",
    topics: "DESIGN · RESEARCH · PRODUCTS", fresh: "Recent materials", projects: "MY PROJECTS", map: "NOTES MAP", read: "What to read here",
    about: "Not a showcase of perfect cases, but a working collection: projects, drafts, visual techniques, and the context behind decisions.",
    themes: "Core themes", themesCopy: "Visual systems · research · digital products · writing · independent projects.",
  } : { intro: "Личный архив работ, наблюдений и инструментов. Про дизайн, цифровые продукты и способы делать сложное ясным.", topics: "ДИЗАЙН · ИССЛЕДОВАНИЯ · ПРОДУКТЫ", fresh: "Свежие материалы", projects: "МОИ ПРОЕКТЫ", map: "КАРТА ЗАМЕТОК", read: "Что здесь читать", about: "Это не витрина с идеальными кейсами, а рабочая коллекция: проекты, черновики, визуальные приёмы и контекст решений.", themes: "Основные темы", themesCopy: "Визуальные системы · исследования · цифровые продукты · тексты · независимые проекты." };
  return (
    <PageLayout className={styles.home} locale={locale}>
      <main>
        <section className={styles.hero} aria-labelledby="home-title">
          <div className="container">
            <h1 id="home-title">VIVISHKOSHUB</h1>
            <p>{copy.intro}</p>
            <span>{copy.topics}</span>
          </div>
        </section>

        <section className={styles.materials} aria-labelledby="materials-title">
          <div className="container">
            <div className={styles.sectionHeading}>
              <h2 id="materials-title">{copy.fresh}</h2>
              <span>ВСЕ&nbsp;&nbsp; / &nbsp;&nbsp;СТАТЬИ</span>
            </div>

            <div className={styles.routeLinks}>
              <LocalizedLink className={styles.routeCard} href={siteRoutes.projects} locale={locale}>
                <RouteDrawing kind="projects" />
                <span>{copy.projects}</span>
              </LocalizedLink>
              <LocalizedLink className={`${styles.routeCard} ${styles.notesRoute}`} href={siteRoutes.notes} locale={locale}>
                <RouteDrawing kind="notes" />
                <span>{copy.map}</span>
              </LocalizedLink>
            </div>

            <div className={styles.noteList}>
              {notes.map((sourceNote) => {
                const note = getLocalizedNote(sourceNote, locale);
                return <LocalizedLink
                  className={styles.noteRow}
                  href={`${siteRoutes.notes}/${note.slug}`}
                  key={note.slug}
                  locale={locale}
                >
                  <time dateTime={note.publishedAt}>{note.displayDate}</time>
                  <div className={styles.noteContent}>
                    <h3>{note.title}</h3>
                    <p>{note.description}</p>
                  </div>
                  <span className={styles.noteTags}>{note.listingTags.join("  ·  ")}</span>
                </LocalizedLink>;
              })}
            </div>
          </div>
        </section>

        <section className={styles.about} aria-labelledby="about-title">
          <div className="container">
            <div>
              <h2 id="about-title">{copy.read}</h2><p>{copy.about}</p>
            </div>
            <div>
              <h2>{copy.themes}</h2><p>{copy.themesCopy}</p>
            </div>
          </div>
        </section>
      </main>
    </PageLayout>
  );
}
