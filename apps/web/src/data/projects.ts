export type Project = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  cover?: { src: string; alt: string };
  links: {
    live?: string;
    repo?: string;
  };
  bodyMd?: string;
};

export const projects: Project[] = [
  {
    slug: "aurora-archive",
    title: "Aurora Archive",
    summary: "A visual archive of shifting light studies and layered gradients.",
    tags: ["next", "frontend", "viz"],
    cover: { src: "/covers/aurora-archive.svg", alt: "Aurora Archive cover" },
    links: {
      live: "https://example.com",
      repo: "https://github.com/yourname/aurora-archive",
    },
    bodyMd: `
## What it is
A curated set of light experiments and color stacks.

## Tech
- Next.js
- TypeScript
- CSS gradients

## Notes
Focuses on fluid motion and high contrast color pairings.
`,
  },
  {
    slug: "paper-skyline",
    title: "Paper Skyline",
    summary: "A typographic cityscape built from modular shapes.",
    tags: ["layout", "typography", "ui"],
    cover: { src: "/covers/paper-skyline.svg", alt: "Paper Skyline cover" },
    links: {
      live: "https://example.com",
      repo: "https://github.com/yourname/paper-skyline",
    },
    bodyMd: `
## What it is
A skyline generator with paper-cut textures and stacking shadows.

## Tech
- Next.js
- CSS grid
- SVG patterns

## Notes
Designed for rapid layout exploration and prototyping.
`,
  },
  {
    slug: "studio-drift",
    title: "Studio Drift",
    summary: "An ambient studio dashboard for tracking creative momentum.",
    tags: ["dashboard", "design", "motion"],
    cover: { src: "/covers/studio-drift.svg", alt: "Studio Drift cover" },
    links: {
      live: "https://example.com",
      repo: "https://github.com/yourname/studio-drift",
    },
    bodyMd: `
## What it is
An overview screen for ideas, experiments, and next actions.

## Tech
- Next.js
- TypeScript
- CSS animations

## Notes
Leans on soft gradients and clear info blocks.
`,
  },
];
