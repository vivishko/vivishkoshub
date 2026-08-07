import type { Metadata } from "next";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import { notes } from "@/data/notes";
import { siteRoutes } from "@/data/site-routes";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Вивишко Шуб — работы и заметки",
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

export default function Home() {
  return (
    <PageLayout className={styles.home}>
      <main>
        <section className={styles.hero} aria-labelledby="home-title">
          <div className="container">
            <h1 id="home-title">Вивишко Шуб</h1>
            <p>
              Личный архив работ, наблюдений и инструментов. Про дизайн, цифровые продукты и способы
              делать сложное ясным.
            </p>
            <span>ДИЗАЙН · ИССЛЕДОВАНИЯ · ПРОДУКТЫ</span>
          </div>
        </section>

        <section className={styles.materials} aria-labelledby="materials-title">
          <div className="container">
            <div className={styles.sectionHeading}>
              <h2 id="materials-title">Свежие материалы</h2>
              <span>ВСЕ&nbsp;&nbsp; / &nbsp;&nbsp;СТАТЬИ</span>
            </div>

            <div className={styles.routeLinks}>
              <Link className={styles.routeCard} href={siteRoutes.projects}>
                <RouteDrawing kind="projects" />
                <span>МОИ ПРОЕКТЫ</span>
              </Link>
              <Link className={`${styles.routeCard} ${styles.notesRoute}`} href={siteRoutes.notes}>
                <RouteDrawing kind="notes" />
                <span>КАРТА ЗАМЕТОК</span>
              </Link>
            </div>

            <div className={styles.noteList}>
              {notes.map((note) => (
                <Link
                  className={styles.noteRow}
                  href={`${siteRoutes.notes}/${note.slug}`}
                  key={note.slug}
                >
                  <time dateTime={note.publishedAt}>{note.displayDate}</time>
                  <div className={styles.noteContent}>
                    <h3>{note.title}</h3>
                    <p>{note.description}</p>
                  </div>
                  <span className={styles.noteTags}>{note.listingTags.join("  ·  ")}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.about} aria-labelledby="about-title">
          <div className="container">
            <div>
              <h2 id="about-title">Что здесь читать</h2>
              <p>
                Это не витрина с идеальными кейсами, а рабочая коллекция: проекты, черновики,
                визуальные приёмы и контекст решений. Я фиксирую ход мысли — от первого вопроса до
                результата.
              </p>
            </div>
            <div>
              <h2>Основные темы</h2>
              <p>
                Визуальные системы · исследования · цифровые продукты · тексты · независимые
                проекты.
              </p>
            </div>
          </div>
        </section>
      </main>
    </PageLayout>
  );
}
