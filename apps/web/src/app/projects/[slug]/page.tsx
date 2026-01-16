import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { projects } from "@/data/projects";

type Params = { slug: string };

export default function ProjectOverviewPage({ params }: { params: Params }) {
  const project = projects.find((item) => item.slug === params.slug);

  if (!project) {
    return notFound();
  }

  return (
    <div className="page">
      <header className="site-header">
        <div className="logo">VivishkosHub</div>
        <nav className="nav">
          <Link href="/">Home</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/fun">Fun</Link>
        </nav>
      </header>
      <main className="project-detail">
        <div className="project-detail-header">
          <div>
            <h1>{project.title}</h1>
            <p>{project.summary}</p>
          </div>
          {project.cover ? (
            <div className="project-detail-cover">
              <Image
                src={project.cover.src}
                alt={project.cover.alt}
                width={720}
                height={540}
              />
            </div>
          ) : null}
        </div>
        <div className="project-links">
          {project.links.live ? (
            <a href={project.links.live} target="_blank" rel="noreferrer">
              Live
            </a>
          ) : null}
          {project.links.repo ? (
            <a href={project.links.repo} target="_blank" rel="noreferrer">
              Repo
            </a>
          ) : null}
        </div>
        {project.bodyMd ? (
          <section className="project-body">{project.bodyMd}</section>
        ) : null}
      </main>
    </div>
  );
}
