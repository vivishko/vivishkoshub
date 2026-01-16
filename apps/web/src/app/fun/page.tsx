import type { CSSProperties } from "react";
import Link from "next/link";

const funItems = [
  {
    title: "Neon Drift",
    summary: "A tiny racing loop with pastel trails and ripple physics.",
    type: "mini-game",
    status: "prototype",
    tags: ["webgl", "motion", "play"],
    accent: "#ffb8d9",
  },
  {
    title: "Orbit Choir",
    summary: "Orbital dots that sing when their paths intersect.",
    type: "audio-viz",
    status: "live sketch",
    tags: ["sound", "canvas", "rhythm"],
    accent: "#c7d2ff",
  },
  {
    title: "Echo Tiles",
    summary: "Tap a grid, build a melody, and watch it dissolve.",
    type: "interaction",
    status: "idea",
    tags: ["ui", "music", "touch"],
    accent: "#ffe3a3",
  },
  {
    title: "Constellation Lab",
    summary: "A sandbox for drawing constellations with soft gravity.",
    type: "simulation",
    status: "in progress",
    tags: ["particles", "viz", "space"],
    accent: "#b9f5e8",
  },
];

export default function FunPage() {
  return (
    <div className="page fun">
      <header className="site-header">
        <div className="logo">VivishkosHub</div>
        <nav className="nav">
          <Link href="/">Home</Link>
          <Link href="/projects">Projects</Link>
          <Link href="/fun">Fun</Link>
        </nav>
      </header>
      <main className="fun-section">
        <div className="fun-intro">
          <h1>Fun Lab</h1>
          <p>
            Mini games, playful visuals, and experimental sketches. These are
            quick explorations designed to surprise and delight.
          </p>
        </div>
        <div className="fun-grid">
          {funItems.map((item) => (
            <article
              className="fun-card"
              key={item.title}
              style={{ "--accent": item.accent } as CSSProperties}
            >
              <div className="fun-card-top">
                <span className="fun-chip">{item.type}</span>
                <span className="fun-status">{item.status}</span>
              </div>
              <h2>{item.title}</h2>
              <p>{item.summary}</p>
              <div className="fun-tags">
                {item.tags.map((tag) => (
                  <span className="fun-tag" key={tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
