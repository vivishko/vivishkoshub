import type { MetadataRoute } from "next";
import { triggers } from "@/features/asmr/data/triggers";
import { getProjects } from "@/lib/get-projects";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com";
  const projects = getProjects();

  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/fun`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/artemis-2-visualization`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/asmr`,
      lastModified: new Date(),
    },
    ...triggers.map((trigger) => ({
      url: `${baseUrl}/asmr/triggers/${trigger.slug}`,
      lastModified: new Date(),
    })),
    ...projects.map((project) => ({
      url: `${baseUrl}/projects/${project.slug}`,
      lastModified: new Date(),
    })),
  ];
}
