import { projects } from "@/data/projects";
import type { Project } from "@/types/project";

export function getProjects(): Project[] {
  return projects;
}

export function getProjectBySlug(slug: string): Project | null {
  return projects.find((item) => item.slug === slug) ?? null;
}
