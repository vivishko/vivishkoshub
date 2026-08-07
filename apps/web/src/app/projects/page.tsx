import type { Metadata } from "next";
import PageLayout from "@/components/PageLayout";
import ProjectCard from "@/components/ProjectCard";
import { getProjects } from "@/lib/get-projects";

export const metadata: Metadata = {
  title: "Projects — VivishkosHub",
  description: "Browse live experiments, prototypes, and work in progress.",
};

export default function ProjectsPage() {
  const projects = getProjects();
  return (
    <PageLayout>
      <main className="projects">
        <div className="container projects-inner">
          <header className="projects-intro">
            <h1>Projects</h1>
            <p>
              Independent and collaborative work: product interfaces, visual languages, and
              exploratory formats.
            </p>
            <p className="projects-filter" aria-label="Project categories">
              <span>All</span>
              <span aria-hidden="true">·</span>
              <span>Interfaces</span>
              <span aria-hidden="true">·</span>
              <span>Research</span>
              <span aria-hidden="true">·</span>
              <span>Brand</span>
            </p>
          </header>
          {projects.length ? (
            <div className="project-grid">
              {projects.map((project, index) => (
                <ProjectCard key={project.slug} project={project} index={index} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h2>No projects yet</h2>
              <p>New experiments are brewing. Check back soon.</p>
            </div>
          )}
          <section className="projects-closing" aria-labelledby="projects-closing-title">
            <h2 id="projects-closing-title">More work is available on request.</h2>
            <p>
              Some projects cannot show the entire process, but I can share the role, reasoning, and
              result.
            </p>
          </section>
        </div>
      </main>
    </PageLayout>
  );
}
