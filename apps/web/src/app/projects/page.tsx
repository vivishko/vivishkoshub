import type { Metadata } from "next";
import PageLayout from "@/components/PageLayout";
import ProjectCard from "@/components/ProjectCard";
import { getProjects } from "@/lib/get-projects";
import { getLocale, type LocaleSearchParams } from "@/lib/locale";

export const metadata: Metadata = {
  title: "Projects — VivishkosHub",
  description: "Browse live experiments, prototypes, and work in progress.",
};

export default async function ProjectsPage({ searchParams }: { searchParams: Promise<LocaleSearchParams> }) {
  const locale = getLocale(await searchParams);
  const copy = locale === "en" ? { title: "Projects", intro: "Independent and collaborative work: product interfaces, visual languages, and exploratory formats.", filters: "ALL · INTERFACES · RESEARCH · BRAND", empty: "No projects yet", emptyCopy: "New experiments are brewing. Check back soon.", closing: "More work is available on request.", closingCopy: "Some projects cannot show the entire process, but I can share the role, reasoning, and result." } : { title: "Проекты", intro: "Независимые и командные работы: продуктовые интерфейсы, визуальные языки и исследовательские форматы.", filters: "ВСЕ · ИНТЕРФЕЙСЫ · ИССЛЕДОВАНИЯ · БРЕНД", empty: "Пока нет проектов", emptyCopy: "Новые эксперименты уже готовятся.", closing: "Больше работ — по запросу.", closingCopy: "В некоторых проектах нельзя показать процесс полностью, но я могу рассказать о роли, логике и результате." };
  const projects = getProjects();
  return (
    <PageLayout locale={locale}>
      <main className="projects">
        <div className="container projects-inner">
          <header className="projects-intro">
            <h1>{copy.title}</h1><p>{copy.intro}</p><p className="projects-filter">{copy.filters}</p>
          </header>
          {projects.length ? (
            <div className="project-grid">
              {projects.map((project, index) => (
                <ProjectCard key={project.slug} project={project} index={index} locale={locale} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h2>{copy.empty}</h2><p>{copy.emptyCopy}</p>
            </div>
          )}
          <section className="projects-closing" aria-labelledby="projects-closing-title">
            <h2 id="projects-closing-title">{copy.closing}</h2><p>{copy.closingCopy}</p>
          </section>
        </div>
      </main>
    </PageLayout>
  );
}
