import LocalizedLink from "@/components/LocalizedLink";
import type { Project } from "@/types/project";
import Tag from "@/components/Tag";
import type { Locale } from "@/lib/locales";

type ProjectCardProps = {
  project: Project;
  index: number;
  locale?: Locale;
};

export default function ProjectCard({ project, index, locale }: ProjectCardProps) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <LocalizedLink className="project-card" href={`/projects/${project.slug}`} locale={locale}>
      <div className={`project-preview project-preview-${(index % 3) + 1}`} aria-hidden="true">
        <span className="project-preview-panel" />
        <span className="project-preview-bar" />
      </div>
      <div className="project-card-copy">
        <span className="project-number">{number}</span>
        <h2 className="project-title">{project.title}</h2>
        <p className="project-summary">{project.summary}</p>
      </div>
      <div className="project-tags">
        {project.tags.length ? (
          project.tags.map((tag) => <Tag className="project-tag" key={tag} label={tag} />)
        ) : (
          <Tag className="project-tag is-empty" label="No tags yet" />
        )}
      </div>
      <span className="project-card-link">Project →</span>
    </LocalizedLink>
  );
}
