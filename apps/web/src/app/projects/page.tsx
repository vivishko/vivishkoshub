import ProjectCard from "@/components/ProjectCard";
import SiteHeader from "@/components/SiteHeader";
import { getProjects } from "@/lib/get-projects";

export default function ProjectsPage() {
  const projects = getProjects();
  return (
    <div className="page">
      <SiteHeader />
      <main className="projects">
        <h1>Projects</h1>
        <div className="project-grid">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </main>
    </div>
  );
}
