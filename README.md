# VivishkosHub

Personal Next.js playground for a small portfolio: a bold home page, a projects
index with clickable cards, individual project overviews, and a "Fun" lab for
mini games and visual sketches.

## Repository Structure

- apps/web: Main Next.js app (App Router, TypeScript).
  - src/app: Routes and pages.
    - /: Home page.
    - /projects: Project cards (clickable).
    - /projects/[slug]: Project overview page.
    - /fun: Mini games and visual experiments.
  - src/data/projects.ts: Project data model and sample data.
  - public/covers: Project cover images (SVG placeholders).
  - src/app/globals.css: Global styles and layout primitives.
- frontend: Early prototype scaffold (separate Next.js app).

## How It Works

- The projects index reads from `src/data/projects.ts` and renders cards with
  title, summary, tags, and optional cover image.
- Each project card links to `/projects/[slug]` and pulls the full overview
  from the same data source.
- The fun page is intentionally styled differently with a playful gradient and
  varied card treatments.

## Local Development

1. Install dependencies:
   - cd apps/web
   - npm install
2. Run the dev server:
   - npm run dev
3. Open http://localhost:3000

## Notes

- Styling is centralized in `apps/web/src/app/globals.css` to keep the visual
  language consistent across routes.
