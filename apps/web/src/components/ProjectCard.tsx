import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/types/project";
import Tag from "@/components/Tag";

type ProjectCardProps = {
  project: Project;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link className="project-card" href={`/projects/${project.slug}`}>
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
        {project.tags.length ? (
          project.tags.map((tag) => (
            <Tag className="project-tag" key={tag} label={tag} />
          ))
        ) : (
          <Tag className="project-tag is-empty" label="No tags yet" />
        )}
      </div>
    </Link>
  );
}
