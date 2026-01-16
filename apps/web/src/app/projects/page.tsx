import Link from "next/link";
import Image from "next/image";
import { projects } from "@/data/projects";

export default function ProjectsPage() {
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
      <main className="projects">
        <h1>Projects</h1>
        <div className="project-grid">
          {projects.map((project) => (
            <Link
              className="project-card"
              href={`/projects/${project.slug}`}
              key={project.slug}
            >
              {project.cover ? (
                <div className="project-image">
                  <Image
                    src={project.cover.src}
                    alt={project.cover.alt}
                    width={640}
                    height={480}
                  />
                </div>
              ) : null}
              <h2 className="project-title">{project.title}</h2>
              <p className="project-summary">{project.summary}</p>
              <div className="project-tags">
                {project.tags.map((tag) => (
                  <span className="project-tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
