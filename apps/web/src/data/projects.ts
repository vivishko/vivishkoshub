export type Project = {
  slug: string;
  title: string;
  summary: string;
  tags: string[];
  cover?: { src: string; alt: string };
  gallery?: { src: string; alt: string }[];
  links: {
    live?: string;
    repo?: string;
  };
  bodyMd?: string;
};

// TODO: turn static projects into dynamic
// make it possible to change descriptions without commiting
export const projects: Project[] = [
  {
    slug: "custom-proxy-ext",
    title: "Custom Proxy extention",
    summary: "A lightweight browser extension for flexible proxy control.",
    tags: ["proxy", "extention", "chrome"],
    cover: {
      src: "/covers/custom-proxy-ext.png",
      alt: "Custom Proxy extention cover",
    },
    gallery: [
      {
        src: "/covers/custom-proxy-ext-usage-1.png",
        alt: "Custom Proxy detail 1",
      },
      {
        src: "/covers/custom-proxy-ext-usage-2.png",
        alt: "Custom Proxy detail 2",
      },
      {
        src: "/covers/custom-proxy-ext-usage-3.png",
        alt: "Custom Proxy detail 3",
      },
      {
        src: "/covers/custom-proxy-ext-usage-4.png",
        alt: "Custom Proxy detail 4",
      },
    ],
    links: {
      repo: "https://github.com/yourname/aurora-archive",
    },
    bodyMd: `## What it is
A lightweight browser extension for flexible proxy control. It lets you manage global proxy settings, define per-site behavior, and maintain your own list of proxies with authentication support. The popup UI gives instant visibility into which proxy rule applies to the current page.

## Tech
- Manifest V3
- JavaScript ES Modules
- Chrome Proxy API
- chrome.storage.sync

## How to start
Installation guide is [here](https://github.com/vivishko/custom-proxy-ext?tab=readme-ov-file#-installation)

## How to use
Usage overview is [here](https://github.com/vivishko/custom-proxy-ext?tab=readme-ov-file#-installation)
`,
  },
  {
    slug: "paper-skyline",
    title: "Paper Skyline",
    summary: "A typographic cityscape built from modular shapes.",
    tags: ["layout", "typography", "ui"],
    cover: { src: "/covers/paper-skyline.svg", alt: "Paper Skyline cover" },
    gallery: [
      { src: "/covers/skyline-1.svg", alt: "Paper Skyline detail 1" },
      { src: "/covers/skyline-2.svg", alt: "Paper Skyline detail 2" },
    ],
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
    gallery: [
      { src: "/projects/studio.svg", alt: "Studio Drift detail 1" },
      { src: "/covers/studio-drift.svg", alt: "Studio Drift detail 2" },
    ],
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
