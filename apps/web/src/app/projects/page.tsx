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
          <h1>Projects</h1>
          {projects.length ? (
            <div className="project-grid">
              {projects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h2>No projects yet</h2>
              <p>New experiments are brewing. Check back soon.</p>
            </div>
          )}
        </div>
      </main>
    </PageLayout>
  );
}
