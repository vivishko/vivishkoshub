import Image from "next/image";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { projects } from "@/data/projects";
import SiteHeader from "@/components/SiteHeader";
import ProjectGallery from "./ProjectGallery";
import ProjectUsageLink from "./ProjectUsageLink";

type Params = { slug: string };

export default async function ProjectOverviewPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  const gallery = project?.gallery ?? (project?.cover ? [project.cover] : []);

  if (!project) {
    return notFound();
  }

  return (
    <div className="page">
      <SiteHeader />
      <main className="project-detail">
        <div className="project-detail-header">
          <div>
            <h1>{project.title}</h1>
          </div>
          {project.cover ? (
            <div className="project-detail-cover is-icon">
              <Image
                src={project.cover.src}
                alt={project.cover.alt}
                width={400}
                height={400}
                sizes="(max-width: 768px) 38vw, 220px"
              />
            </div>
          ) : null}
        </div>
        <div className="project-links">
          {project.links.live ? (
            <a
              className="project-link"
              href={project.links.live}
              target="_blank"
              rel="noreferrer"
            >
              Live
            </a>
          ) : null}
          {project.links.repo ? (
            <a
              className="project-link repo"
              href={project.links.repo}
              target="_blank"
              rel="noreferrer"
            >
              <span className="repo-icon" aria-hidden="true">
                <svg
                  viewBox="0 0 24 24"
                  role="img"
                  focusable="false"
                  aria-hidden="true"
                >
                  <path
                    d="M12 2C6.48 2 2 6.58 2 12.2c0 4.5 2.87 8.31 6.84 9.66.5.1.68-.22.68-.48l-.02-1.69c-2.78.62-3.37-1.21-3.37-1.21-.45-1.2-1.1-1.52-1.1-1.52-.9-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.58 2.36 1.12 2.94.86.1-.67.35-1.12.64-1.38-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.72 0 0 .84-.28 2.75 1.05a9.2 9.2 0 0 1 2.5-.35c.85 0 1.7.12 2.5.35 1.9-1.33 2.74-1.05 2.74-1.05.55 1.42.2 2.46.1 2.72.64.72 1.03 1.63 1.03 2.75 0 3.93-2.35 4.8-4.59 5.05.36.32.69.94.69 1.9l-.01 2.82c0 .26.18.59.69.48A10.2 10.2 0 0 0 22 12.2C22 6.58 17.52 2 12 2z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              Repo
            </a>
          ) : null}
          <ProjectUsageLink />
        </div>
        {project.bodyMd ? (
          <section
            className="project-body"
            dangerouslySetInnerHTML={{
              __html: marked.parse(project.bodyMd) as string,
            }}
          />
        ) : null}
        {gallery.length ? <ProjectGallery images={gallery} /> : null}
      </main>
    </div>
  );
}
